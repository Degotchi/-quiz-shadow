import type { DimensionKey } from "./archetypes";

export interface Option {
  label: string; // A, B, C, D
  text: string;
  weights: Partial<Record<DimensionKey, number>>;
}

export interface Question {
  id: number;
  stage: 1 | 2 | 3; // 1: Low (Q1-10), 2: Mid (Q11-20), 3: High (Q21-30)
  category: string; // 职场 / 社交 / 亲密关系 / 自我认知 / 道德灰区 / 压力应激
  scenario: string;
  options: Option[];
}

export const QUESTIONS: Question[] = [
  // --- Stage 1: Low Intensity ---
  {
    id: 1,
    stage: 1,
    category: "职场篇",
    scenario:
      '周一早会上，领导当着全组的面表扬了你的同事小李，说他上周那个方案"非常有创意"。但你清楚地记得，那个方案的核心思路是你在茶水间随口跟小李聊的。小李全程没提你的名字。',
    options: [
      {
        label: "A",
        text: '我会在之后的会议上"不经意"地提起——"对，这个思路当时我跟小李聊过"，让所有人自己判断。',
        weights: { masking: 3, control: 2 },
      },
      {
        label: "B",
        text: "算了，不至于为这点事撕破脸，但我以后跟他说任何想法之前都会先发邮件留痕。",
        weights: { control: 3, detachment: 1 },
      },
      {
        label: "C",
        text: '我会私下直接找小李，语气平静但意思明确："下次提一嘴呗，毕竟是一起聊出来的。"',
        weights: { aggression: 2, control: 1 },
      },
      {
        label: "D",
        text: "无所谓，好想法我有的是，被拿走一个不影响什么。但说实话，我心里给他记了一笔。",
        weights: { detachment: 2, aggression: 2 },
      },
    ],
  },
  {
    id: 2,
    stage: 1,
    category: "社交篇",
    scenario:
      '大学室友群突然活跃起来，有人发了张聚会照片。你发现所有人都去了，除了你——没有任何人通知你。群里大家在刷"好久不见""下次还约"。',
    options: [
      {
        label: "A",
        text: '我会很自然地在群里说"哇看起来好好玩！下次叫上我呀～"，带着笑脸面具，但心里已经准备好慢慢退群了。',
        weights: { masking: 3, detachment: 2 },
      },
      {
        label: "B",
        text: "我直接不说话，默默把群消息免打扰。不被需要的关系，我没兴趣维护。",
        weights: { detachment: 3, destruction: 1 },
      },
      {
        label: "C",
        text: '我会私聊关系最近的那个人问"怎么没叫我"，不是因为想去，是想确认我在这个圈子里到底算什么。',
        weights: { control: 2, envy: 2 },
      },
      {
        label: "D",
        text: "说实话，看到照片的瞬间，我第一反应是看他们玩得是不是真的开心——如果过得比我好，我会更不舒服。",
        weights: { envy: 3, aggression: 1 },
      },
    ],
  },
  {
    id: 3,
    stage: 1,
    category: "自我认知篇",
    scenario:
      '你刚完成一个自己也觉得还不错的项目，同事和领导都说"做得好"。但你脑海里有个声音一直在说：他们只是客气，你其实没那么厉害，下一次你肯定会露馅。',
    options: [
      {
        label: "A",
        text: "我会在社交媒体上发一条低调炫耀的动态，用别人的点赞来压住心里那个声音。",
        weights: { masking: 3, envy: 1 },
      },
      {
        label: "B",
        text: "我知道那个声音是假的，但我还是会逼自己加倍努力，确保下一次做得更完美，让任何人都挑不出毛病。",
        weights: { control: 3, aggression: 1 },
      },
      {
        label: "C",
        text: "我会选择不去想它，把注意力转移到别的事上。感受这东西，不理它就会消失。",
        weights: { detachment: 3, masking: 1 },
      },
      {
        label: "D",
        text: "那个声音说得可能是对的。但更让我难受的是——为什么别人就可以心安理得地接受夸奖？",
        weights: { envy: 2, destruction: 2 },
      },
    ],
  },
  {
    id: 4,
    stage: 1,
    category: "职场篇",
    scenario:
      '公司团建，领导提议玩"真心话大冒险"。轮到你的时候，有人问你："你觉得我们组谁工作能力最差？"所有人都看着你笑，但你知道他们也想听真话。',
    options: [
      {
        label: "A",
        text: '我会笑着打太极——"每个人都有自己擅长的嘛"，然后迅速把话题转走。',
        weights: { masking: 3, control: 2 },
      },
      {
        label: "B",
        text: '我心里有答案，而且我会说出来。不过我会包装成"开玩笑"的语气。',
        weights: { aggression: 3, masking: 2 },
      },
      {
        label: "C",
        text: '我会说"那肯定是我啊"来自嘲收场。',
        weights: { control: 2, masking: 2 },
      },
      {
        label: "D",
        text: "我觉得这种游戏本身就很无聊。我会选大冒险，或者找个理由去上厕所。",
        weights: { detachment: 3, control: 1 },
      },
    ],
  },
  {
    id: 5,
    stage: 1,
    category: "社交篇",
    scenario:
      '你和朋友A约好了周末的计划，临出发前朋友A突然说"不好意思，我跟B先约了，忘了，改天吧"。你打开朋友圈，看到B发了和A的合照，配文是"最佳搭档"。',
    options: [
      {
        label: "A",
        text: '我回一句"没事哈～"然后立刻安排自己的独处时间。',
        weights: { detachment: 2, masking: 2 },
      },
      {
        label: "B",
        text: '我嘴上说没事，但下次A约我的时候我一定会"恰好有事"。',
        weights: { aggression: 2, control: 2 },
      },
      {
        label: "C",
        text: "我会反复看那张合照，心里在想：A到底是更喜欢B，还是更需要B？",
        weights: { envy: 3, control: 1 },
      },
      {
        label: "D",
        text: '我会直接跟A说"你这样让我觉得不被重视"。',
        weights: { aggression: 2, destruction: 2 },
      },
    ],
  },
  {
    id: 6,
    stage: 1,
    category: "亲密关系篇",
    scenario:
      '你的伴侣/暧昧对象跟你聊天时频繁提到一个新认识的同事，说对方"很有趣""很聪明"。频率大概一天两三次。对方说只是普通同事关系。',
    options: [
      {
        label: "A",
        text: "我表面不动声色，但会开始更频繁地查看对方的社交动态和在线时间。",
        weights: { control: 3, masking: 2 },
      },
      {
        label: "B",
        text: "我会开始在对方面前提起自己生活中那些有趣的人。",
        weights: { aggression: 2, envy: 2 },
      },
      {
        label: "C",
        text: "我不会说什么，但心里已经开始做最坏的打算。",
        weights: { detachment: 3, control: 1 },
      },
      {
        label: "D",
        text: '我会半开玩笑地说"你是不是对人家有意思啊"，语气轻松，但需要看到对方否认时的眼神。',
        weights: { masking: 2, aggression: 2 },
      },
    ],
  },
  {
    id: 7,
    stage: 1,
    category: "道德灰区篇",
    scenario:
      "你在便利店自助结账，系统出了bug，少扫了一件20块钱的东西。你发现了，周围没人注意到。",
    options: [
      {
        label: "A",
        text: '我会回去重新扫码。不是因为道德感，是因为我不想让这种小事成为心里的"污点"。',
        weights: { control: 3, masking: 1 },
      },
      {
        label: "B",
        text: "不管了，20块钱而已，系统的bug不是我的问题。",
        weights: { destruction: 2, detachment: 2 },
      },
      {
        label: "C",
        text: '我会犹豫一下，然后走掉。但之后一整天会想"如果被发现了会怎样"。',
        weights: { masking: 2, control: 2 },
      },
      {
        label: "D",
        text: '我会走掉，甚至会有一种微妙的爽感——"系统有漏洞被我发现了"。',
        weights: { destruction: 3, aggression: 1 },
      },
    ],
  },
  {
    id: 8,
    stage: 1,
    category: "压力应激篇",
    scenario:
      '连续加班两周后的一个深夜，你独自坐在工位上。领导发来消息："明早的汇报材料准备好了吗？"',
    options: [
      {
        label: "A",
        text: '我会回复"在做了，放心"，然后灌一杯咖啡继续。',
        weights: { masking: 3, control: 2 },
      },
      {
        label: "B",
        text: "我想把电脑合上直接走人，让所有人第二天面对一个烂摊子。",
        weights: { destruction: 3, aggression: 2 },
      },
      {
        label: "C",
        text: '我会冷静地回复"尽量"，然后做到几点算几点。',
        weights: { detachment: 3, aggression: 1 },
      },
      {
        label: "D",
        text: "我会做完，但我会在心里详细地记下每一次不合理的加班。",
        weights: { control: 3, aggression: 1 },
      },
    ],
  },
  {
    id: 9,
    stage: 1,
    category: "自我认知篇",
    scenario:
      "你在社交媒体上看到一个和你同龄的人，做着你梦想中的工作、住着你想住的城市、过着你想要的生活。你翻完了对方最近半年的所有动态。",
    options: [
      {
        label: "A",
        text: '我会告诉自己"每个人的时区不一样"，然后关掉手机。但接下来三天做什么都提不起劲。',
        weights: { envy: 3, detachment: 1 },
      },
      {
        label: "B",
        text: '我会把对方的生活当成目标模板，开始分析"我缺什么"。',
        weights: { control: 3, envy: 1 },
      },
      {
        label: "C",
        text: "我会忍不住想：这个人是不是有什么背景？是不是靠家里的？",
        weights: { envy: 3, aggression: 1 },
      },
      {
        label: "D",
        text: "我会发一条精心编辑的朋友圈，展示我生活中看起来最好的那个切面。",
        weights: { masking: 3, envy: 2 },
      },
    ],
  },
  // {
  //     id: 10,
  //     stage: 1,
  //     category: '社交篇',
  //     scenario: '聚会上，一个不太熟的人当众模仿了你说话的方式和口头禅，引得大家哄堂大笑。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我会跟着笑，甚至自我调侃。但心里已经把这个人归类为"不安全"了。',
  //             weights: { masking: 3, control: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我会当场用同样的方式模仿回去。',
  //             weights: { aggression: 3, control: 1 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我不会当场发作，但事后反复回想，越想越不舒服。',
  //             weights: { aggression: 2, destruction: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我什么感觉都没有。或者说，我训练过自己在这种场合"什么感觉都没有"。',
  //             weights: { detachment: 3, masking: 1 },
  //         },
  //     ],
  // },
  // // --- Stage 2: Mid Intensity ---
  // {
  //     id: 11,
  //     stage: 2,
  //     category: '职场篇',
  //     scenario: '你意外在公司共享文件夹里看到了下季度的晋升名单草稿。你不在上面，但一个你认为能力不如你的同事在上面。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我会假装没看到，然后用十二分的努力工作——让那个晋升决定显得"有瑕疵"。',
  //             weights: { envy: 2, control: 3 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我会把这件事"不小心"透露给其他同事。',
  //             weights: { destruction: 3, aggression: 2 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我会私下找领导聊职业发展，一个字不提名单的事。',
  //             weights: { control: 3, masking: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '看到名单的瞬间我的第一反应不是愤怒，是一种"我就知道"的平静。',
  //             weights: { detachment: 3, envy: 1 },
  //         },
  //     ],
  // },
  // {
  //     id: 12,
  //     stage: 2,
  //     category: '亲密关系篇',
  //     scenario: '你偷看了伴侣的手机。聊天记录里没有出轨的证据，但你看到对方在跟朋友吐槽你——说你"管太多""有时候挺烦的"。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我什么也不会说。但接下来几天我会刻意变得"完美"——不管、不问、不烦。',
  //             weights: { control: 3, masking: 3 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我会找个合适的时间摊牌："我看到了你跟朋友的聊天。"',
  //             weights: { aggression: 3, destruction: 1 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我不会提这件事，但我心里有什么东西碎了。',
  //             weights: { detachment: 2, envy: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我会开始回想：是不是我真的管太多了？但在背后说我而不是当面讲，这本身就是背叛。',
  //             weights: { aggression: 2, control: 2 },
  //         },
  //     ],
  // },
  // {
  //     id: 13,
  //     stage: 2,
  //     category: '压力应激篇',
  //     scenario: '你已经连续三个月处于高压状态。某天你一个人走路的时候，突然有一种强烈的冲动：你想尖叫，或者把手里的东西狠狠砸向什么。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我会把这个冲动压下去，面无表情地继续走。崩溃是一种奢侈品。',
  //             weights: { detachment: 3, masking: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我会找一个没人的地方，真的喊出来或者砸点什么。',
  //             weights: { destruction: 2, aggression: 2 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我不会发泄，但我会开始做"退出计划"——如果我把这一切全部推翻，从零开始，会怎样？',
  //             weights: { destruction: 3, control: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我会打开手机，看看社交媒体上其他人的生活，然后告诉自己"其实大家都很难"。',
  //             weights: { envy: 2, masking: 2 },
  //         },
  //     ],
  // },
  // {
  //     id: 14,
  //     stage: 2,
  //     category: '道德灰区篇',
  //     scenario: '你发现一个很好的朋友在社交媒体上长期伪造人设——编造的学历、虚构的工作经历。你知道真相是因为你们认识太久了。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我不会说什么。但知道这个秘密让我在这段友谊里有了一种微妙的安全感。',
  //             weights: { control: 3, masking: 1 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我会继续当朋友，但心里对ta已经有了一种俯视感。',
  //             weights: { control: 3, aggression: 1 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我会私下跟ta说"你这样早晚会出事"。不是为了帮ta，是因为如果真相被揭穿，我也会被溅到。',
  //             weights: { masking: 2, control: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我会想：ta伪装得这么辛苦，是因为真实的自己不够好吗？然后我会想到自己——我又比ta真实多少呢？',
  //             weights: { masking: 3, envy: 1 },
  //         },
  //     ],
  // },
  // {
  //     id: 15,
  //     stage: 2,
  //     category: '社交篇',
  //     scenario: '你经营了两年的社交媒体账号粉丝量一直没什么增长。某天你发现一个内容风格和你极其相似的账号，半年就涨了十倍粉丝。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我会开始详细分析对方的账号，找出那个让ta比我成功的"变量"。',
  //             weights: { envy: 2, control: 3 },
  //         },
  //         {
  //             label: 'B',
  //             text: '说实话，我有过一个闪念——如果我匿名举报ta"抄袭"呢？',
  //             weights: { destruction: 3, aggression: 2 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我会告诉自己"是金子总会发光的"，然后发一条高质量的内容来证明自己。',
  //             weights: { envy: 3, masking: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我会慢慢减少更新频率，最终停更。',
  //             weights: { detachment: 3, destruction: 1 },
  //         },
  //     ],
  // },
  // {
  //     id: 16,
  //     stage: 2,
  //     category: '职场篇',
  //     scenario: '你的直属领导在一次重要会议上犯了一个明显的错误，而你在会前就提醒过ta。你有机会发言。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我会用一种"帮领导补充"的方式委婉地纠正——一箭双雕。',
  //             weights: { masking: 3, control: 3 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我什么都不说。让这个错误执行下去。等到结果出来的时候，所有人都会知道我是对的。',
  //             weights: { aggression: 2, control: 2 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我会直接指出错误。',
  //             weights: { aggression: 3, destruction: 1 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我不会说。但会后我会给自己发一封邮件记录"我在X月X日提醒过某某"。',
  //             weights: { control: 3, detachment: 2 },
  //         },
  //     ],
  // },
  // {
  //     id: 17,
  //     stage: 2,
  //     category: '自我认知篇',
  //     scenario: '深夜，你躺在床上突然想到：如果把你所有的社会身份都剥掉——工作、人际关系、社交形象——剩下的那个"你"，你喜欢吗？',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我不确定剥掉之后还剩什么。可能什么都没有。',
  //             weights: { detachment: 2, masking: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '剩下的那个我很丑陋。我之所以努力经营所有的外在身份，就是为了把那个"我"锁起来。',
  //             weights: { masking: 3, destruction: 2 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我觉得剩下的那个"我"可能比外面那个更有力量。更冷酷，更清醒。',
  //             weights: { aggression: 2, control: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '喜不喜欢不重要。重要的是别人是否需要那个"我"。',
  //             weights: { control: 3, envy: 1 },
  //         },
  //     ],
  // },
  // {
  //     id: 18,
  //     stage: 2,
  //     category: '亲密关系篇',
  //     scenario: '你跟伴侣/最亲密的人吵架。对方在争执中说了一句直戳你软肋的话——准确地命中了你最不愿意被触碰的那个点。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我瞬间冷下来。用一种冷到极点的语气说"行，那没什么好说的了"，然后不再给对方任何情绪回馈。',
  //             weights: { detachment: 3, aggression: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我会用更精准的一刀捅回去。我知道对方的痛处在哪里。',
  //             weights: { aggression: 3, destruction: 2 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我表面上会示弱、退让，甚至道歉。因为我知道"受害者"的位置在后续博弈中更有利。',
  //             weights: { masking: 3, control: 3 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我不会反击，但那句话会嵌在我脑子里很久——对方愿意使用这种武器，说明ta在理性状态下就已经想过"怎么伤你最有效"。',
  //             weights: { control: 2, detachment: 2 },
  //         },
  //     ],
  // },
  // {
  //     id: 19,
  //     stage: 2,
  //     category: '压力应激篇',
  //     scenario: '你在一个重要社交场合上，一个长辈当着很多人的面问你收入/感情状况/生育计划。周围好几个人都在看你。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我会用一个滴水不漏的标准答案把场子圆过去。散场之后我在车里坐了十五分钟没动。',
  //             weights: { masking: 3, detachment: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我会微笑着反问："您家XX最近怎么样了呀？"',
  //             weights: { aggression: 3, masking: 1 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我会直接说"这个我不太方便聊"。场面冷了就冷了。',
  //             weights: { aggression: 2, destruction: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我会回答，但给出一个经过精心设计的、比现实稍微好一点的版本。',
  //             weights: { masking: 3, control: 2 },
  //         },
  //     ],
  // },
  // {
  //     id: 20,
  //     stage: 2,
  //     category: '道德灰区篇',
  //     scenario: '你的一个"朋友"其实是你一直在利用的人脉资源。最近，对方失去了那个对你有用的职位。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我会继续维持这段关系。人脉关系有长期价值，他以后可能东山再起。',
  //             weights: { control: 3, masking: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我不会主动断联，但联系频率会自然降低。这不叫势利，叫资源配置。',
  //             weights: { detachment: 3, control: 1 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我会主动约对方吃饭，在ta最脆弱的时候出现——"雪中送炭"在社交货币体系里汇率很高。',
  //             weights: { masking: 3, control: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '说实话，我会松一口气。维持一段功利关系需要大量的情感伪装，我已经很累了。',
  //             weights: { detachment: 2, masking: 2 },
  //         },
  //     ],
  // },
  // // --- Stage 3: High Intensity ---
  // {
  //     id: 21,
  //     stage: 3,
  //     category: '职场篇',
  //     scenario: '你用了两年时间培养的下属/后辈，能力成长得很快，最近开始在公开场合挑战你的判断、绕过你直接跟上层汇报。ta在试图取代你。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我会在关键项目上逐渐减少给ta的核心信息，让ta在上层面前犯几次"可控的小错"。',
  //             weights: { control: 3, aggression: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我会把这当成一个信号——是时候向上走了。但如果我走不掉，那就别怪我不留情面。',
  //             weights: { control: 2, aggression: 2 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我会找ta谈一次。语气真诚，内容是"我理解你的野心，但你现在的方式会让你树敌太多"——这是忠告，也是警告。',
  //             weights: { control: 3, masking: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我会开始抽离对这段"师徒关系"的情感投入。不值得。',
  //             weights: { detachment: 3, aggression: 1 },
  //         },
  //     ],
  // },
  // {
  //     id: 22,
  //     stage: 3,
  //     category: '亲密关系篇',
  //     scenario: '你发现自己每一段亲密关系都会重复同一个模式：刚开始全身心投入，一旦对方开始依赖你，你就想逃。你不是不爱了——你是害怕了。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我害怕的是失控。当另一个人对你产生真实的依赖，你的每一个决定都在影响ta。',
  //             weights: { detachment: 3, control: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我害怕的是被真正看见。如果对方真的靠近了，ta就会发现我远没有我表演得那么好。',
  //             weights: { masking: 3, envy: 1 },
  //         },
  //         {
  //             label: 'C',
  //             text: '说实话，我享受被需要的感觉多于爱本身。我可能是在追逐征服，而不是在寻找伴侣。',
  //             weights: { control: 3, aggression: 1 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我害怕的是总有一天对方会觉得自己可以过得比跟我在一起更好。所以我选择先离开。',
  //             weights: { envy: 2, destruction: 2 },
  //         },
  //     ],
  // },
  // {
  //     id: 23,
  //     stage: 3,
  //     category: '自我认知篇',
  //     scenario: '如果给你一天完全不受道德、法律和社会评价约束的自由——你可以做任何事，且没有任何后果——你心里跳出来的第一个画面是什么？',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我想对所有曾经伤害过我的人说出我真正想说的话。光想想就浑身发抖。',
  //             weights: { aggression: 3, destruction: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我想消失。从我现在的身份里彻底抽离——换一个城市、换一个名字、切断所有联系。',
  //             weights: { detachment: 3, destruction: 2 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我想成为那个"制定规则的人"。让所有人按照我认为正确的方式运行。',
  //             weights: { control: 3, aggression: 1 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我想体验一次毫无伪装地活着的感觉。然后看看，这样的我，还有没有人愿意留在我身边。',
  //             weights: { masking: 3, envy: 1 },
  //         },
  //     ],
  // },
  // {
  //     id: 24,
  //     stage: 3,
  //     category: '压力应激篇',
  //     scenario: '你生命中最重要的人做了一件严重伤害你的事。你知道对方不会道歉，因为ta甚至不觉得自己有错。你躺在床上，黑暗中睁着眼睛。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我在黑暗中一遍一遍地排练一段对话——每一句话都经过精心设计。',
  //             weights: { control: 3, masking: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我脑子里出现了一种冲动：让对方也体会一次同样程度的痛。',
  //             weights: { aggression: 2, destruction: 3 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我决定不再给这个人伤害我的机会了。在心里关上一扇门。',
  //             weights: { detachment: 3, control: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我的愤怒不是对着对方的，是对着自己的。为什么我还在乎？',
  //             weights: { destruction: 2, envy: 2 },
  //         },
  //     ],
  // },
  // {
  //     id: 25,
  //     stage: 3,
  //     category: '道德灰区篇',
  //     scenario: '你无意中获得了一个可以彻底毁掉你"敌人"的信息。这个信息是真实的。使用它不违法，但会让对方的人生崩塌。你的手指悬停在发送键上方。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我不会发。使用这种手段会让我变成一个我不想成为的人。',
  //             weights: { control: 3, masking: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我会发。公开真实信息不是"毁掉"对方，是让对方面对自己。',
  //             weights: { aggression: 3, destruction: 2 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我不会发，但我会保存好这个信息。有些武器的价值在于持有。',
  //             weights: { control: 3, aggression: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我不会发。因为"我本可以毁掉你但我没有"这种权力感可以持续一辈子。',
  //             weights: { control: 3, detachment: 2 },
  //         },
  //     ],
  // },
  // {
  //     id: 26,
  //     stage: 3,
  //     category: '社交篇',
  //     scenario: '你所在的朋友圈子里，大家最近都默契地开始疏远一个人。那个人似乎还没有意识到。你跟那个人关系一般。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我不会主动参与排挤，但我也不会当那个"提醒ta"的人。',
  //             weights: { detachment: 2, masking: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我会顺着大家的节奏走。"站在多数人这边"是最安全的位置。',
  //             weights: { masking: 3, control: 2 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我会观察是谁在主导这件事，为什么。我需要搞清楚权力结构。',
  //             weights: { control: 3, aggression: 1 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我会想——如果被驱逐的那个人是我呢？其他人也会这样沉默吗？',
  //             weights: { envy: 2, destruction: 2 },
  //         },
  //     ],
  // },
  // {
  //     id: 27,
  //     stage: 3,
  //     category: '亲密关系篇',
  //     scenario: '你突然意识到：在你最亲密的关系里，你从来没有展示过真实的自己。对方爱的那个"你"，是你表演出来的版本。更可怕的是——你已经分不清哪个是真实的你了。',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '这没什么好可怕的。所有人都在表演。区别只是有的人知道自己在演。',
  //             weights: { masking: 3, detachment: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我试过展示真实的自己。结果呢？被嫌弃、被批评。那次之后我学会了：真实是一种惩罚。',
  //             weights: { masking: 3, aggression: 1 },
  //         },
  //         {
  //             label: 'C',
  //             text: '其实我不是害怕对方发现真实的我。我是害怕——撕掉所有面具，下面什么都没有。',
  //             weights: { detachment: 3, destruction: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '如果对方爱上的只是我的面具，那这段关系本质上是一种骗局——但我可能既不想摘掉面具，也不想被识破。',
  //             weights: { masking: 3, control: 2 },
  //         },
  //     ],
  // },
  // {
  //     id: 28,
  //     stage: 3,
  //     category: '自我认知篇',
  //     scenario: '回顾你过去十年的所有选择——有多少是你"真正想要的"，又有多少是"应该这样""别人觉得好的""当时最安全的选择"？',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '大部分是"安全的选择"。但我不后悔。让我不安的不是我选了安全——是我可能已经丧失了冒险的能力。',
  //             weights: { control: 2, detachment: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '至少有百分之七十是在满足别人的期待。最让我愤怒的是——那些受益的人，没有一个对我说过谢谢。',
  //             weights: { aggression: 3, envy: 2 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我选择不去想这个问题。因为一旦承认过去十年大部分选择不是我想要的，就必须面对"所以接下来呢？"',
  //             weights: { detachment: 2, masking: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我有时候会幻想一个平行宇宙里的我——每一步都选了另一条路。那个"我"会更真实。而这让此刻的我觉得自己像一个赝品。',
  //             weights: { masking: 2, destruction: 3 },
  //         },
  //     ],
  // },
  // {
  //     id: 29,
  //     stage: 3,
  //     category: '压力应激篇',
  //     scenario: '你的心理状态已经到了一个临界点——你能感觉到自己正在失去对情绪的控制。你知道你需要帮助，但……',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '我不会跟任何人说。"成为别人的负担"是我能想到的最可怕的事。',
  //             weights: { detachment: 3, masking: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '我不会去寻求帮助。"还能扛"本身就是我最后的尊严。如果我倒下了，那些等着看的人就赢了。',
  //             weights: { aggression: 2, control: 3 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我会去看心理咨询。但在咨询师面前我依然会筛选自己说的话。我允许自己被帮助，但只限于我允许的范围内。',
  //             weights: { masking: 3, control: 2 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我会选择什么都不做，让自己沉到最底部。我想知道我的底线在哪里。',
  //             weights: { destruction: 3, detachment: 2 },
  //         },
  //     ],
  // },
  // {
  //     id: 30,
  //     stage: 3,
  //     category: '道德灰区篇',
  //     scenario: '最后一题。如果以上29道题里的每一个答案都有人会看到——你的伴侣、父母、领导、朋友——你会修改你的答案吗？',
  //     options: [
  //         {
  //             label: 'A',
  //             text: '会。而且我会改掉至少一半。这不是虚伪——这叫生存。',
  //             weights: { masking: 3, control: 2 },
  //         },
  //         {
  //             label: 'B',
  //             text: '不会。这些答案不是我最黑暗的部分——这些只是冰山的一角。',
  //             weights: { aggression: 3, destruction: 1 },
  //         },
  //         {
  //             label: 'C',
  //             text: '我不确定。因为"真实的答案"这个概念本身就可疑。',
  //             weights: { detachment: 3, masking: 1 },
  //         },
  //         {
  //             label: 'D',
  //             text: '我会改。但不是怕被评判——是我不想让真正关心我的人发现"原来ta一直过得这么辛苦"。',
  //             weights: { masking: 2, detachment: 2, control: 1 },
  //         },
  //     ],
  // },
];
