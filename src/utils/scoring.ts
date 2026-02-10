import {
    type DimensionKey,
    type Archetype,
    ARCHETYPES,
    CHAOS_ARCHETYPE,
} from '../data/archetypes';
import { QUESTIONS } from '../data/questions';

export interface ScoreResult {
    rawScores: Record<DimensionKey, number>;
    normalizedScores: Record<DimensionKey, number>; // 0-100
    dimensions: { key: DimensionKey; score: number }[]; // Sorted desc
    primaryArchetype: Archetype;
    secondaryArchetype?: Archetype; // For "Double Shadow" (叠影态)
    isChaos: boolean;   // 混沌态
    isBarrier: boolean; // 阴影屏障
    shadowSyncRate: number; // 阴影同步率 %
}

/**
 * Calculate max possible raw score for each dimension based on QUESTIONS
 */
export function getDimensionMaxScores(): Record<DimensionKey, number> {
    const maxScores: Record<DimensionKey, number> = {
        control: 0, aggression: 0, envy: 0, masking: 0, destruction: 0, detachment: 0
    };

    QUESTIONS.forEach(q => {
        // For each question, find the max weight for each dimension across all options
        const dimMaxInQuestion: Record<DimensionKey, number> = {
            control: 0, aggression: 0, envy: 0, masking: 0, destruction: 0, detachment: 0
        };

        q.options.forEach(opt => {
            (Object.keys(opt.weights) as DimensionKey[]).forEach(dim => {
                const w = opt.weights[dim] || 0;
                if (w > dimMaxInQuestion[dim]) {
                    dimMaxInQuestion[dim] = w;
                }
            });
        });

        // Add to total max
        (Object.keys(maxScores) as DimensionKey[]).forEach(dim => {
            maxScores[dim] += dimMaxInQuestion[dim];
        });
    });

    return maxScores;
}

const MAX_SCORES = getDimensionMaxScores();

/**
 * Standard Sigmoid function
 */
function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
}

/**
 * Validates that all questions have been answered
 */
export function validateAnswers(answers: Record<number, string>): boolean {
    return QUESTIONS.every(q => answers[q.id] !== undefined);
}

/**
 * Main scoring function
 */
export function calculateResult(answers: Record<number, string>): ScoreResult {
    // 1. Calculate Raw Scores
    const rawScores: Record<DimensionKey, number> = {
        control: 0, aggression: 0, envy: 0, masking: 0, destruction: 0, detachment: 0
    };

    QUESTIONS.forEach(q => {
        const selectedLabel = answers[q.id];
        if (!selectedLabel) return;
        const option = q.options.find(o => o.label === selectedLabel);
        if (!option) return;

        (Object.keys(option.weights) as DimensionKey[]).forEach(dim => {
            rawScores[dim] += option.weights[dim] || 0;
        });
    });

    // 2. Normalize Scores (0-100)
    const normalizedScores: Record<DimensionKey, number> = {
        control: 0, aggression: 0, envy: 0, masking: 0, destruction: 0, detachment: 0
    };

    (Object.keys(rawScores) as DimensionKey[]).forEach(dim => {
        const max = MAX_SCORES[dim] || 1; // avoid div by 0
        normalizedScores[dim] = Math.round((rawScores[dim] / max) * 100);
    });

    // 3. Sort Dimensions
    const sortedDims = (Object.keys(normalizedScores) as DimensionKey[])
        .map(key => ({ key, score: normalizedScores[key] }))
        .sort((a, b) => b.score - a.score);

    const top1 = sortedDims[0];
    const top2 = sortedDims[1];
    const bottom1 = sortedDims[sortedDims.length - 1];

    // 4. Check Special States
    const isBarrier = sortedDims.every(d => d.score < 30);

    // Calculate Standard Deviation for Chaos check
    const values = sortedDims.map(d => d.score);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const isChaos = stdDev < 8;

    let primaryArchetype: Archetype;
    let secondaryArchetype: Archetype | undefined = undefined;

    if (isChaos) {
        primaryArchetype = CHAOS_ARCHETYPE;
    } else {
        // Find matching archetype for Top1 + Top2
        // Try rigid match first: Primary == Top1, Secondary == Top2
        let match = ARCHETYPES.find(a => a.primary === top1.key && a.secondary === top2.key);

        // If no exact match (since 12 archetypes cover specific pairs, but not all 6x5=30 pairs), 
        // Fallback logic: Match Primary == Top1, and find closest Secondary or just verify Primary.
        // However, dd.md implies specific mappings. 
        // Let's look at dd.md table:
        // 12 archetypes are defined. 
        // If a user has Top1=Control, Top2=Envy -> no direct match (Control+Envy is not in table? Wait.)
        // Table:
        // Control + Detachment (Silent Judge)
        // Control + Masking (Patient Puppeteer)
        // Control + Aggression (Undercurrent)
        // Control + Destruction (Cracked Perfectionist)
        // Envy + Control (Mirror Gazer) -> This is Envy primary.

        // So if user is Control primary:
        // Could be Detachment, Masking, Aggression, Destruction.
        // What if Top2 is Envy?
        // We should probably find the archetype that *best* matches the profile.
        // A simple score distance metric might be better than rigid key matching?
        // Or just pick the one with the matching Primary, and determine which of the valid Secondaries is highest?

        if (!match) {
            // If exact pair not found, find all archetypes with this Primary
            const candidates = ARCHETYPES.filter(a => a.primary === top1.key);
            if (candidates.length > 0) {
                // Of the candidates, which one's secondary dimension has the highest score in user's profile?
                // e.g. User Top1=Control(90), Top2=Envy(80), Top3=Masking(40).
                // Candidates for Control: Detachment, Masking, Aggression, Destruction.
                // User scores: Detachment(20), Masking(40), Aggression(10), Destruction(50).
                // Best fit: Control + Destruction (Cracked Perfectionist) because Destruction(50) is highest among valid secondaries?
                // Actually Top2 is Envy(80), but there is no Control+Envy archetype.
                // So we look at the other dimensions.

                // Sort candidates by user's score on the candidate's secondary dimension
                candidates.sort((a, b) => {
                    const scoreA = normalizedScores[a.secondary];
                    const scoreB = normalizedScores[b.secondary];
                    return scoreB - scoreA;
                });
                match = candidates[0];
            } else {
                // Should not happen if all primaries are covered.
                // Fallback to first one
                match = ARCHETYPES[0];
            }
        }

        primaryArchetype = match;

        // Double Shadow (叠影态): Top1 == Top2 (diff < 5%)
        // But we need to find a SECOND archetype.
        // Maybe the one that matches Top2 as Primary?
        if (Math.abs(top1.score - top2.score) < 5) {
            // Find archetype where Primary is Top2
            // And Secondary is best fit? Or just Primary match?
            const candidates2 = ARCHETYPES.filter(a => a.primary === top2.key);
            if (candidates2.length > 0) {
                candidates2.sort((a, b) => {
                    const scoreA = normalizedScores[a.secondary];
                    const scoreB = normalizedScores[b.secondary];
                    return scoreB - scoreA;
                });
                secondaryArchetype = candidates2[0];

                // Avoid same archetype if Top1 and Top2 are swapped but resolve to same? 
                // Unlikely since Primary is unique per archetype usually? 
                // Actually checking list: No duplicates.
                if (secondaryArchetype.id === primaryArchetype.id) {
                    secondaryArchetype = undefined;
                }
            }
        }
    }

    // 5. Calculate Shadow Sync Rate
    // Formula: Base * (0.7 + Pol * 0.3) + Noise
    // Base = Sigmoid(Max / 100) * 100
    // Note: Standard sigmoid(1.0) is ~0.73. We might want to boost this to make it "Dramatic".
    // dd.md asks for "Range 47% - 99.7%".
    // Let's use a modified sigmoid or scalers.
    // If we treat x as (Score - 50) / 10?
    // Let's stick to the prompt description but maybe interpret `Max_Dimension_Score / 100` as the input to sigmoid.
    // If Max=100, x=1. Sigmoid(1)=0.73. Base=73. Sync ≈ 73%.
    // If Max=30, x=0.3. Sigmoid(0.3)=0.57. Base=57. Sync ≈ 40-50%.
    // Seems consistent with "Mean score" range.
    // But maybe they want higher? "Drama".
    // Let's scale the input x by 4. So max 100 -> x=4. Sigmoid(4)=0.98. Base=98.
    // That looks better for "99.7%".
    // Let's try x = (MaxScore - 50) / 12 ? 
    // If Max=100, x=4.16. Sigmoid(4.16) ~= 0.98. 
    // If Max=50, x=0. Sigmoid(0) = 0.5.
    // This centers 50 at 50%.
    // But usage of `Sigmoid(Max_Dimension_Score / 100)` implies 0-1 range input.
    // I'll stick to a heuristic that produces high numbers for high scores.
    // Let's use `x = (MaxScore - 40) / 15`. 
    // 100 -> 4. Sigmoid(4) -> 0.98.
    // 80 -> 2.6. Sigmoid(2.6) -> 0.93.
    // 60 -> 1.3. Sigmoid(1.3) -> 0.78.
    // 40 -> 0. Sigmoid(0) -> 0.50.

    const maxScore = top1.score;
    const x = (maxScore - 40) / 15;
    const baseVal = sigmoid(x) * 100;

    const polarization = (top1.score - bottom1.score) / 100;

    // Random (-3, +3)
    // Generating deterministic random based on answers length or score sum to avoid hydration mismatch?
    // Or just Math.random() is fine if we save the result.
    // We'll use a pseudo-random based on score sum to keep it stable for the same result.
    const sumScores = values.reduce((a, b) => a + b, 0);
    // const pseudoRandom = ((sumScores % 7) - 3); 
    // Better: ((sumScores * 13) % 60) / 10 - 3; // -3.0 to +2.9
    const noise = ((sumScores * 17) % 70) / 10 - 3.5; // -3.5 to +3.5

    let syncRate = baseVal * (0.7 + polarization * 0.3) + noise;

    // Clamp
    if (syncRate > 99.7) syncRate = 99.7;
    if (syncRate < 47) syncRate = 47;

    return {
        rawScores,
        normalizedScores,
        dimensions: sortedDims,
        primaryArchetype,
        secondaryArchetype,
        isChaos,
        isBarrier,
        shadowSyncRate: parseFloat(syncRate.toFixed(1)),
    };
}
