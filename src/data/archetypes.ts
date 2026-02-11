/**
 * 12种阴影原型定义 + 1种隐藏原型（混沌之影）
 * Based on dd.md Agent 1 specification
 * Enhanced with poetic dimension names & shadow temptation/curse
 */

export type DimensionKey = 'control' | 'aggression' | 'envy' | 'masking' | 'destruction' | 'detachment';

export interface Archetype {
  id: string;
  nameCN: string;
  nameEN: string;
  primary: DimensionKey;
  secondary: DimensionKey;
  mask: string;        // 你的面具
  shadow: string;      // 你的阴影
  trigger: string;     // 触发条件
  temptation: string;  // 阴影的诱惑：这种人格让你在什么情况下无往不利
  curse: string;       // 阴影的诅咒：你为何总是在同一个坑里摔倒
  radarScores: Record<DimensionKey, number>; // 六维雷达图参考分值 (0-100)
}

// 原始维度（用于计算）
export const DIMENSIONS: Record<DimensionKey, { cn: string; en: string; description: string }> = {
  control: { cn: '控制欲', en: 'Control Drive', description: '对人、事、局面的掌控需求' },
  aggression: { cn: '攻击性', en: 'Aggression', description: '直接或间接的对抗倾向' },
  envy: { cn: '嫉妒值', en: 'Envy Index', description: '社会比较与资源焦虑' },
  masking: { cn: '伪装度', en: 'Masking Level', description: '社会面具的厚度与依赖程度' },
  destruction: { cn: '破坏冲动', en: 'Destructive Impulse', description: '推翻、颠覆现有秩序的欲望' },
  detachment: { cn: '情感隔离', en: 'Emotional Detachment', description: '主动切断情感连接的倾向' },
};

// 文学化维度命名（用于展示）
export const POETIC_DIMENSIONS: Record<DimensionKey, { cn: string; en: string }> = {
  control: { cn: '秩序的执念', en: 'Order Obsession' },
  aggression: { cn: '锋芒的剩余', en: 'Blade Residual' },
  envy: { cn: '镜中的饥渴', en: 'Mirror Hunger' },
  masking: { cn: '面具的厚度', en: 'Mask Density' },
  destruction: { cn: '崩塌的欲望', en: 'Collapse Desire' },
  detachment: { cn: '荒原的厚度', en: 'Wasteland Depth' },
};

export const ARCHETYPES: Archetype[] = [
  {
    id: 'silent-judge',
    nameCN: '沉默的审判者',
    nameEN: 'The Silent Judge',
    primary: 'control',
    secondary: 'detachment',
    mask: '你是那个永远冷静、理性、不轻易表态的人。你用沉默来掌控局面，用距离感来保护自己。',
    shadow: '你的审判从未停止。你在内心对每个人打分、归类、贴标签。你的冷漠不是无感，而是拒绝让任何人影响你的掌控权。',
    trigger: '当有人试图质疑你的判断，或者打破你设定的秩序时，你会用更深的沉默来惩罚对方。',
    temptation: '在混乱的局面中，你总能保持清醒。当所有人都在情绪失控时，你的冷静让你成为最后的仲裁者。你的沉默是权力，你的距离是护城河。',
    curse: '你以为你在掌控局面，其实你在逃避真实的连接。你的审判让你孤独，你的标准让你成为一座孤岛。每一次你用沉默惩罚别人，你也在惩罚自己。',
    radarScores: { control: 88, aggression: 45, envy: 38, masking: 62, destruction: 35, detachment: 85 },
  },
  {
    id: 'smiling-arsonist',
    nameCN: '微笑的纵火犯',
    nameEN: 'The Smiling Arsonist',
    primary: 'destruction',
    secondary: 'masking',
    mask: '你是氛围担当，是永远积极向上的那个人。你的笑容治愈，你的话语温暖。',
    shadow: '你渴望看到一切崩塌。你在想象如果你推翻现有的秩序、关系、规则会发生什么。你的微笑是烟雾弹。',
    trigger: '当你觉得某个系统、某段关系、某种规则"虚伪"或"不公"时，你会有强烈的破坏欲望——哪怕你就在这个系统里。',
    temptation: '你看透了表象下的虚伪，你的破坏冲动让你成为变革的先锋。当所有人都在维护腐朽的秩序时，只有你敢于推倒重来。你的微笑掩护了你的锋芒。',
    curse: '你摧毁的每一样东西，都曾经承载过你的期待。你推翻的每一段关系，都曾经让你相信过。你以为你在对抗虚伪，其实你在逃避失望。',
    radarScores: { control: 42, aggression: 58, envy: 48, masking: 92, destruction: 95, detachment: 55 },
  },
  {
    id: 'patient-puppeteer',
    nameCN: '隐忍的操控者',
    nameEN: 'The Patient Puppeteer',
    primary: 'control',
    secondary: 'masking',
    mask: '你善解人意、会倾听、懂分寸。你从不强迫任何人，你只是"建议"。',
    shadow: '你在精心设计每一次对话、每一个眼神、每一次示弱。你知道如何让别人按照你的意愿行动，同时让他们觉得是自己的选择。',
    trigger: '当有人不按你的剧本走，或者识破你的意图时，你会启动新的操控策略——更隐蔽，更温柔，更致命。',
    temptation: '你是真正的战略大师。你不需要声嘶力竭，你只需要四两拨千斤。你的温柔是武器，你的耐心是陷阱。在所有人都在争夺明面权力时，你已经掌控了暗线。',
    curse: '你操控的每一个人，都在远离真实的你。你设计的每一场博弈，都在加深你的孤独。你赢得了掌控权，却输掉了真实的关系。',
    radarScores: { control: 95, aggression: 38, envy: 50, masking: 90, destruction: 45, detachment: 60 },
  },
  {
    id: 'cold-spectator',
    nameCN: '冷漠的旁观者',
    nameEN: 'The Cold Spectator',
    primary: 'detachment',
    secondary: 'aggression',
    mask: '你独立、自洽、不需要别人的认可。你活得通透，看得清醒。',
    shadow: '你已经放弃了对人性的期待。你冷眼旁观所有戏剧，甚至包括你自己的人生。你的"看透"是一种武器化的冷漠。',
    trigger: '当有人试图用情感绑架你、道德施压你时，你会用极致的冷漠作为反击——让对方感受到"被抛弃"的恐惧。',
    temptation: '你不会被情绪左右，不会被道德绑架，不会被任何人操控。你的冷漠是盔甲，你的抽离是自由。在所有人都在情感漩涡里挣扎时，你已经上岸。',
    curse: '你的清醒让你成为永恒的局外人。你旁观了所有戏剧，也错过了所有温暖。你保护了自己不受伤害，也切断了被爱的可能。',
    radarScores: { control: 58, aggression: 78, envy: 35, masking: 48, destruction: 52, detachment: 92 },
  },
  {
    id: 'flawless-counterfeit',
    nameCN: '完美的赝品',
    nameEN: 'The Flawless Counterfeit',
    primary: 'masking',
    secondary: 'envy',
    mask: '你是精致的、得体的、无可挑剔的。你知道在每个场合该说什么、该做什么、该成为什么样的人。',
    shadow: '你已经分不清哪个是真实的自己。你嫉妒那些可以"做自己"的人，同时又鄙视他们的粗糙。你是一件精美的赝品。',
    trigger: '当你看到有人"不完美"却依然被爱、被接纳时，你会产生强烈的嫉妒和困惑——为什么你这么努力伪装，却依然孤独？',
    temptation: '你在任何场合都游刃有余。你的完美让你成为所有人羡慕的对象。你知道如何在社交场上永不失手，如何让自己看起来无懈可击。',
    curse: '你越完美，越孤独。你伪装得越好，越找不到真实的自己。你羡慕那些"不完美却被爱"的人，却不敢摘下面具——因为你害怕面具之下什么都没有。',
    radarScores: { control: 65, aggression: 42, envy: 88, masking: 98, destruction: 38, detachment: 58 },
  },
  {
    id: 'gentle-executioner',
    nameCN: '温柔的绞刑者',
    nameEN: 'The Gentle Executioner',
    primary: 'aggression',
    secondary: 'masking',
    mask: '你温柔、包容、从不发脾气。你总是用最柔软的方式化解冲突。',
    shadow: '你的攻击性从未消失，只是被包装成了"为你好"。你用温柔的语气说出最扎心的话，用关心的名义实施情感操控。',
    trigger: '当有人伤害了你或你在意的人，你不会爆发——你会用一种温柔而持久的方式，让对方慢慢崩溃。',
    temptation: '你的温柔是最锋利的刀。你不需要声嘶力竭，你的一句"我是为你好"就能击穿对方的防线。你的攻击从不留痕迹，却总能精准命中。',
    curse: '你的温柔成了一种暴政。你伤害别人的同时，也在消耗自己。你以为你在保护自己，其实你在用"为你好"的名义，把所有人推开。',
    radarScores: { control: 68, aggression: 90, envy: 45, masking: 85, destruction: 55, detachment: 48 },
  },
  {
    id: 'mirror-gazer',
    nameCN: '镜中的嫉妒者',
    nameEN: 'The Mirror Gazer',
    primary: 'envy',
    secondary: 'control',
    mask: '你上进、自律、有清晰的目标。你在追求卓越的路上从不停歇。',
    shadow: '你的努力不是为了成为更好的自己，而是为了超越某个具体的"他人"。你的人生是一场永不停歇的比较游戏。',
    trigger: '当你发现无论多努力，总有人比你更轻松地得到你想要的东西时，嫉妒会吞噬你的所有成就感。',
    temptation: '你的嫉妒是你前进的燃料。你的比较让你永不满足，也让你永不停歇。在所有人都在自我麻痹时，只有你还在奔跑。',
    curse: '你赢得了所有比赛，却输掉了快乐。你超越了所有对手，却找不到终点。你的嫉妒让你成为永动机，也让你成为永恒的失败者——因为总有下一个要超越的人。',
    radarScores: { control: 82, aggression: 58, envy: 95, masking: 62, destruction: 48, detachment: 45 },
  },
  {
    id: 'beautiful-martyr',
    nameCN: '自毁的殉道者',
    nameEN: 'The Beautiful Martyr',
    primary: 'destruction',
    secondary: 'detachment',
    mask: '你是理想主义者，是愿意为信念牺牲的人。你活得纯粹，不与世俗妥协。',
    shadow: '你的自毁不是牺牲，是一种美学化的逃避。你渴望通过毁灭来证明自己的价值，用殉道来逃避活下去的复杂性。',
    trigger: '当现实逼迫你妥协、变得"庸俗"时，你会产生强烈的自毁冲动——与其苟活，不如以崩溃的方式退场。',
    temptation: '你的纯粹让你高贵。你宁愿燃烧殆尽，也不愿苟且偷生。你的殉道赋予你悲剧英雄的光环，让你在毁灭中获得永恒。',
    curse: '你美化了毁灭，却逃避了成长。你的殉道不是勇敢，是懦弱——因为活着比死去更需要勇气。你拒绝妥协，其实是拒绝面对真实的自己。',
    radarScores: { control: 38, aggression: 52, envy: 48, masking: 55, destruction: 92, detachment: 88 },
  },
  {
    id: 'undercurrent',
    nameCN: '暗流的野心家',
    nameEN: 'The Undercurrent',
    primary: 'control',
    secondary: 'aggression',
    mask: '你低调、务实、不争不抢。你是团队里那个默默做事的人。',
    shadow: '你的野心从未沉睡。你在暗中观察每一个人的弱点，绘制权力地图，等待最佳时机出手。',
    trigger: '当你觉得时机成熟，或者有人威胁到你的位置时，你会展现出精准而冷酷的攻击性——一击致命。',
    temptation: '你是真正的玩家。你的低调是伪装，你的沉默是计算。当所有人都在争夺明面利益时，你已经布好了暗局。你的一击必中，因为你从不浪费弹药。',
    curse: '你赢得了权力游戏，却输掉了信任。你的野心让你成为赢家，也让你成为孤家。每一次你精准出击，你都在证明——你从未真正信任过任何人。',
    radarScores: { control: 90, aggression: 85, envy: 62, masking: 68, destruction: 58, detachment: 52 },
  },
  {
    id: 'island-keeper',
    nameCN: '孤岛的守望者',
    nameEN: 'The Island Keeper',
    primary: 'detachment',
    secondary: 'masking',
    mask: '你独立、自给自足、不麻烦任何人。你是情绪稳定的成年人。',
    shadow: '你把自己困在了一座孤岛上。你的"不需要"是一种防御机制——只要不靠近，就不会受伤。但你其实很孤独。',
    trigger: '当有人真正想要走近你时，你会用更深的疏离来自我保护——因为你害怕一旦接纳，就会失控。',
    temptation: '你的孤岛是你的堡垒。你不需要任何人，所以你永远不会被背叛。你的自给自足让你成为最安全的人——因为你从不把软肋暴露给任何人。',
    curse: '你的堡垒成了你的监狱。你保护了自己不受伤害，也切断了被爱的可能。你的孤岛越来越坚固，你也越来越孤独。',
    radarScores: { control: 58, aggression: 42, envy: 38, masking: 82, destruction: 45, detachment: 95 },
  },
  {
    id: 'sweet-avenger',
    nameCN: '甜蜜的复仇者',
    nameEN: 'The Sweet Avenger',
    primary: 'aggression',
    secondary: 'destruction',
    mask: '你记仇，但你不表现出来。你会说"没事"，然后继续生活。',
    shadow: '你从未原谅过任何真正伤害你的人。你在等待机会，设计场景，让对方付出代价。你的复仇是冷菜，最好吃。',
    trigger: '当你终于有机会让伤害过你的人"得到教训"时，你会感受到一种近乎甜蜜的快感——这是正义，也是毁灭。',
    temptation: '你的记忆是你的武器。你从不原谅，也从不忘记。你的复仇让你获得快感，你的等待让正义更甜美。当所有人都在劝你"放下"时，只有你知道——有些账，必须算清。',
    curse: '你的复仇吞噬了你的人生。你活在仇恨的阴影里，你的快感是剧毒的。你以为你在伸张正义，其实你在用别人的错误惩罚自己。',
    radarScores: { control: 62, aggression: 92, envy: 55, masking: 68, destruction: 88, detachment: 52 },
  },
  {
    id: 'cracked-perfectionist',
    nameCN: '失控的完美主义者',
    nameEN: 'The Cracked Perfectionist',
    primary: 'control',
    secondary: 'destruction',
    mask: '你对自己要求极高，追求完美，不允许任何瑕疵。',
    shadow: '你的完美主义已经成为一种暴政。你在用"高标准"折磨自己和周围的人。当完美无法实现时，你宁愿毁掉一切。',
    trigger: '当你意识到某件事、某段关系、某个项目"救不回来"时，你会启动自毁程序——既然无法完美，那就彻底摧毁。',
    temptation: '你的标准让你卓越。你的完美主义让你成为最可靠的人。在所有人都在妥协、降低标准时，只有你还在坚守——这让你高贵，也让你孤独。',
    curse: '你的完美主义是一座监狱。你用高标准折磨自己，用"救不回来"惩罚世界。你宁愿摧毁，也不愿接受不完美——但完美从未存在，所以你只能永远摧毁。',
    radarScores: { control: 95, aggression: 65, envy: 58, masking: 62, destruction: 90, detachment: 55 },
  },
];

/**
 * 隐藏原型：混沌之影
 * 触发条件：6维度标准差 < 8（所有维度均匀分布）
 */
export const CHAOS_ARCHETYPE: Archetype = {
  id: 'chaos-shadow',
  nameCN: '混沌之影',
  nameEN: 'The Chaotic Void',
  primary: 'control', // placeholder
  secondary: 'control', // placeholder
  mask: '你没有固定的面具，或者说你的面具每天都在变化。',
  shadow: '你的阴影是混沌的。六个维度在你体内均匀分布，相互制衡，形成一种诡异的平衡。你可能是最接近"真实人性"的那个，也可能是最迷失的那个。',
  trigger: '你无法被归类。这让你自由，也让你困惑——当所有倾向都存在时，你究竟是谁？',
  temptation: '你是不可预测的。你的混沌让你适应任何环境，你的平衡让你永不极端。在所有人都被单一人格困住时，你拥有无限可能。',
  curse: '你的自由是诅咒。你可以成为任何人，所以你不是任何人。你的平衡让你失去了方向，你的混沌让你找不到锚点。',
  radarScores: { control: 50, aggression: 50, envy: 50, masking: 50, destruction: 50, detachment: 50 },
};
