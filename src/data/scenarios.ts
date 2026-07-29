export type DailyLifeKey = 'food' | 'home' | 'work' | 'education' | 'risks' | 'freedoms'

export type DailyLifeSection = {
  key: DailyLifeKey
  label: string
  title: string
  text: string
}

export type TimelineEvent = {
  year: string
  title: string
  text: string
}

export type HistoricalSource = {
  title: string
  creator: string
  sourceType: 'primary' | 'institution' | 'scholarship'
  relevance: string
  url?: string
}

export type MissionTaskType = '证据说明' | '因果链' | '比较分析' | '观点论证' | '方案设计' | '角色判断'

export type Mission = {
  id: string
  title: string
  instruction: string
  evidenceUse: string
  deliverable: string
  estimatedMinutes: number
  difficulty: '入门' | '进阶' | '挑战'
  taskType: MissionTaskType
  steps: string[]
  evidenceChecklist: string[]
  reflectionPrompt: string
  outputTemplate: string[]
  rubric: string[]
  sentenceStarters: string[]
  linkedSourceTitles: string[]
}

export type KeyTerm = {
  term: string
  definition: string
}

export type CompareAngle = {
  title: string
  prompt: string
}

export type DecisionOption = {
  id: string
  label: string
  stance: string
  description: string
  immediate: string
  longTerm: string
  reflection: string
}

export type Scenario = {
  id: string
  title: string
  era: string
  year: number
  location: string
  region: string
  coordinates: [number, number]
  identity: string
  role: string
  age: number
  theme: string
  accent: string
  summary: string
  atmosphere: string
  dailyLife: DailyLifeSection[]
  timeline: TimelineEvent[]
  decision: {
    prompt: string
    context: string
    options: DecisionOption[]
  }
  realHistory: string
  interpretationNote: string
  missions: Mission[]
  keyTerms: KeyTerm[]
  compareAngles: CompareAngle[]
  sourceEvidenceUse: string
  sources: HistoricalSource[]
}

export const scenarios: Scenario[] = [
  {
    id: 'tang-changan-merchant',
    title: '长安西市的一日',
    era: '唐代中期',
    year: 742,
    location: '长安西市',
    region: '关中平原',
    coordinates: [34.3416, 108.9398],
    identity: '胡汉混居街区里的年轻商人',
    role: '香料与织物铺合伙人',
    age: 24,
    theme: '贸易、城市、开放世界',
    accent: '#d7a84b',
    summary:
      '你在长安西市经营一间小铺，白天与粟特商队讨价还价，夜里听人谈论边境军情。繁华背后，帝国的财政、军镇与远方贸易正在彼此拉扯。',
    atmosphere:
      '鼓声开市，马铃与胡琴混在一起。你闻到胡椒、皮革、热饼和雨后泥土的气味。坊墙之外，是一座自信到近乎耀眼的世界城市。',
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '热饼、羊肉与远方香料',
        text: '早餐常是胡饼和热汤。真正稀罕的是柜台上那些来自远方的香料，它们既是商品，也是长安连接世界的证据。',
      },
      {
        key: 'home',
        label: '居所',
        title: '坊内闭门，市中喧哗',
        text: '你住在靠近西市的坊里，夜禁后街门关闭。白天的城市像海港，夜晚却被制度重新切成一个个安静方格。',
      },
      {
        key: 'work',
        label: '工作',
        title: '价格取决于道路是否安全',
        text: '你的利润不只来自口才，还取决于河西走廊、草原局势和官府税令。一次边境摩擦，可能让一匹织物涨价三成。',
      },
      {
        key: 'education',
        label: '见识',
        title: '不读经史，也读账本与人心',
        text: '你未必能进士及第，却能听懂几种口音，记住不同商队的信用。你的知识写在账本、路程和称量里。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '繁荣需要秩序保护',
        text: '盗匪、禁令、货币成色、官吏盘查都会改变命运。商人看似自由，实际每一步都踩在制度边缘。',
      },
      {
        key: 'freedoms',
        label: '机会',
        title: '城市给你向上流动的缝隙',
        text: '长安容纳远人、奇货和新风尚。只要路线不断，信用不破，小铺也可能变成连接数地的贸易网络。',
      },
    ],
    timeline: [
      { year: '618', title: '唐朝建立', text: '关中重新成为帝国政治中心。' },
      { year: '7世纪', title: '丝路交通活跃', text: '长安与中亚、西亚的贸易和文化交流频繁。' },
      { year: '742', title: '开元盛世末期', text: '城市繁华仍在，但边镇与财政压力逐渐累积。' },
      { year: '755', title: '安史之乱爆发', text: '帝国秩序遭遇巨大冲击，商业路线也随之改变。' },
    ],
    decision: {
      prompt: '一支熟悉的商队邀请你赊货扩大生意，但边境传来不稳消息。你怎么做？',
      context:
        '机会来自远方，道路也通向风险。你没有完整情报，只能在账本、传闻和人情之间做判断。',
      options: [
        {
          id: 'expand',
          label: '押上信用，扩大赊货',
          stance: '冒险扩张',
          description: '相信熟人商队，也相信长安的需求会继续增长。',
          immediate: '货架更满，利润想象空间变大，你在商圈中的名声迅速上升。',
          longTerm: '如果道路中断，债务会比货物更快抵达你家门口。繁荣时期的杠杆，会在动荡时期变成枷锁。',
          reflection: '历史中的商业繁荣常常建立在跨区域秩序之上。你赌的不是一批货，而是帝国仍能维持道路安全。',
        },
        {
          id: 'hedge',
          label: '缩小规模，分散货源',
          stance: '谨慎经营',
          description: '少赚一点，但把风险拆成几份。',
          immediate: '你的扩张速度慢下来，也错过一部分热门货利润。',
          longTerm: '当局势波动时，你更可能活下来。你的铺子不耀眼，却有韧性。',
          reflection: '许多普通人无法左右大事件，只能通过保守库存、分散关系和保持现金来对抗不确定性。',
        },
        {
          id: 'official',
          label: '转向官府采购关系',
          stance: '依附制度',
          description: '减少远途贸易，改做更稳定的官府或军需相关买卖。',
          immediate: '你需要打点关系，利润未必最高，但订单更可预期。',
          longTerm: '制度稳定时你会受益；制度震荡时，你也会被更深地卷入权力与责任。',
          reflection: '在古代商业社会里，市场从不完全独立于国家。靠近权力能避风，也可能更早被风暴吞没。',
        },
      ],
    },
    realHistory:
      '唐代长安确是高度国际化的帝国都城。安史之乱后，唐朝政治、财政与交通格局深刻改变，长安的世界城市地位也逐渐转向另一种形态。',
    interpretationNote:
      '本场景把长安西市的制度、商旅与异域商品压缩进一个虚构小商人的一天；具体人物与选择为叙事化合成，不对应单一史料个案。',
    missions: [
      {
        id: 'map-risk-route',
        title: '标出风险路线',
        instruction: '从河西走廊、草原局势和西市货价之间找出一条因果链。',
        evidenceUse: '用时间线中的“丝路交通活跃”和日常里的货价波动解释贸易风险。',
        deliverable: '一段 120 字以内的证据说明，回答“从河西走廊、草原局势和西市货价之间找出一条因果链。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '因果链',
        outputTemplate: [
          '起点：指出最先变化的条件。',
          '中介环节：写出制度、交通、价格或人际网络如何传导。',
          '结果：说明普通人生活或选择受到什么影响。',
          '证据标注：列出至少两条证据。',
          '一句总结：把因果链压缩成可复述结论。'
        ],
        rubric: [
          '因果顺序清楚，能区分起点、中介和结果。',
          '包含制度/环境变化如何传导到个人生活。',
          '证据不是孤立罗列，而是嵌入链条。',
          '结论简洁，可被同伴复述或质疑。'
        ],
        sentenceStarters: [
          '因果链可以从……开始。',
          '这个变化通过……传导到……',
          '对这个身份来说，结果不是抽象的，而是……',
          '最脆弱的环节是……'
        ],
        linkedSourceTitles: [
          '《唐六典》',
          'The Silk Road: A New History'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：从河西走廊、草原局势和西市货价之间找出一条因果链。',
          '使用证据：用时间线中的“丝路交通活跃”和日常里的货价波动解释贸易风险。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'audit-credit',
        title: '审一笔赊货账',
        instruction: '判断熟人商队的信用是否足以支撑扩大赊货。',
        evidenceUse: '对照“账本与人心”的经验知识，区分人情信用与道路秩序。',
        deliverable: '一段 120 字以内的证据说明，回答“判断熟人商队的信用是否足以支撑扩大赊货。”',
        estimatedMinutes: 16,
        difficulty: '进阶',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          '《唐六典》',
          'The Silk Road: A New History'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：判断熟人商队的信用是否足以支撑扩大赊货。',
          '使用证据：对照“账本与人心”的经验知识，区分人情信用与道路秩序。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'compare-market-state',
        title: '找出市场背后的官府',
        instruction: '列出商人看似自由但受制度约束的三个环节。',
        evidenceUse: '引用坊市、夜禁、市署或官府采购相关线索。',
        deliverable: '一段 120 字以内的证据说明，回答“列出商人看似自由但受制度约束的三个环节。”',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '证据说明',
        outputTemplate: [
          '核心判断：用一句话回答任务问题。',
          '证据一：引用场景中的具体线索，并说明来源。',
          '证据二：再补充一条不同类型的线索。',
          '解释：说明两条证据如何共同支持判断。',
          '保留问题：写出仍不确定的一点。'
        ],
        rubric: [
          '回答紧扣任务问题，没有只复述剧情。',
          '至少使用两条具体证据，并标明来自日常、时间线、决策或来源层。',
          '能解释证据与判断之间的关系。',
          '承认叙事化合成的边界或不确定性。'
        ],
        sentenceStarters: [
          '我认为最关键的证据是……',
          '这条线索说明……',
          '如果只看这一点，可能会误判，因为……',
          '我还不能确定的是……'
        ],
        linkedSourceTitles: [
          '《唐六典》',
          'The Silk Road: A New History'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：列出商人看似自由但受制度约束的三个环节。',
          '使用证据：引用坊市、夜禁、市署或官府采购相关线索。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'test-prosperity',
        title: '检验繁荣叙事',
        instruction: '说明长安的开放世界为何同时带来机会和脆弱性。',
        evidenceUse: '结合外来商品、跨区域秩序与安史之乱前后对照。',
        deliverable: '一段 120 字以内的证据说明，回答“说明长安的开放世界为何同时带来机会和脆弱性。”',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '观点论证',
        outputTemplate: [
          '观点：明确赞成、反对或折中立场。',
          '证据：列出支持观点的两条线索。',
          '反例/限制：说明这个观点可能忽略什么。',
          '解释：把证据和观点连起来。',
          '结论：回到普通人的处境。'
        ],
        rubric: [
          '观点明确且可争辩。',
          '证据能支撑观点，并处理一个反例或限制。',
          '把宏观历史条件与角色处境连接起来。',
          '语言克制，避免现代价值直接覆盖历史语境。'
        ],
        sentenceStarters: [
          '我的观点是……',
          '支持这个观点的第一条证据是……',
          '一个可能的反驳是……',
          '把它放回当时的限制条件中，……'
        ],
        linkedSourceTitles: [
          '《唐六典》',
          'The Silk Road: A New History'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：说明长安的开放世界为何同时带来机会和脆弱性。',
          '使用证据：结合外来商品、跨区域秩序与安史之乱前后对照。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
    ],
    keyTerms: [
      { term: '坊市制', definition: '以坊、市场和城门时段管理组织城市生活的制度安排。' },
      { term: '丝绸之路', definition: '连接东亚、中亚和西亚的多路线贸易与文化交流网络。' },
      { term: '粟特商人', definition: '活跃于中古欧亚贸易中的中亚商人群体，常见于唐代跨文化交流叙事。' },
      { term: '安史之乱', definition: '755 年爆发的重大叛乱，深刻改变唐朝军事、财政与交通格局。' },
    ],
    compareAngles: [
      { title: '贸易机会 vs. 道路安全', prompt: '同一条商路在什么条件下是财富通道，在什么条件下变成债务陷阱？' },
      { title: '城市开放 vs. 城市管制', prompt: '长安的国际化气质如何与坊市、夜禁和官府监管同时存在？' },
    ],
    sourceEvidenceUse: '先用制度性材料理解城市监管，再用物质文化与丝路研究补足商品、路线和风险细节。',
    sources: [
      {
        title: '《唐六典》',
        creator: '唐代官修政书',
        sourceType: 'primary',
        relevance: '提供唐代官制、市署与城市管理制度背景，可辅助理解坊市秩序和商业监管。',
      },
      {
        title: "The Golden Peaches of Samarkand: A Study of T'ang Exotics",
        creator: 'Edward H. Schafer',
        sourceType: 'scholarship',
        relevance: '梳理唐代外来物品、香料和异域风尚，支撑长安国际化日常氛围。',
      },
      {
        title: 'The Silk Road: A New History',
        creator: 'Valerie Hansen',
        sourceType: 'scholarship',
        relevance: '以出土文书和路线节点讨论丝路贸易网络，帮助界定商队与道路风险的历史边界。',
      },
    ],
  },
  {
    id: 'song-bianjing-apprentice',
    title: '汴京茶铺学徒',
    era: '北宋末年',
    year: 1120,
    location: '东京汴梁',
    region: '黄河下游',
    coordinates: [34.7973, 114.3076],
    identity: '茶铺里的十七岁学徒',
    role: '跑堂、烧水、听客人谈天下',
    age: 17,
    theme: '城市生活、信息流动、危机前夜',
    accent: '#7cc7b2',
    summary:
      '你在汴京一家茶铺做学徒。你不在朝堂，却每天听到商人、士子、差役谈论物价、边境和新政。城市的热闹让人忘记，北方的风正越来越冷。',
    atmosphere:
      '天未亮你就生火。街上已有卖早点的人，瓦舍还没散尽昨夜的笑声。汴河载着货物进城，也载着关于远方战争的含糊消息。',
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '热汤与剩点心',
        text: '你吃得比乡下亲戚好些，但多数时候只是热汤、炊饼和客人剩下的点心边角。城市提供选择，也放大差距。',
      },
      {
        key: 'home',
        label: '居所',
        title: '睡在店后窄屋',
        text: '你和另一个伙计挤在店后。夜里能听到车轮和更鼓，汴京几乎不像会真正睡着。',
      },
      {
        key: 'work',
        label: '工作',
        title: '茶水是生意，消息也是',
        text: '你添水、擦桌、记熟客喜好。茶铺是城市的信息节点，传言在这里比热气散得更快。',
      },
      {
        key: 'education',
        label: '教育',
        title: '识几个字，够看招牌',
        text: '你没有稳定读书机会，却在听客人闲谈中知道辽、金、岁币和科举。你的世界比父辈更大，也更不安。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '繁华城市也脆弱',
        text: '火灾、疫病、粮价、兵乱都可能压垮小民。你没有土地，只有手艺、人情和一点点积蓄。',
      },
      {
        key: 'freedoms',
        label: '机会',
        title: '城市允许你想象另一种人生',
        text: '如果攒够钱，你也许能租个小摊，甚至开自己的茶坊。汴京让普通人看见流动的可能。',
      },
    ],
    timeline: [
      { year: '960', title: '北宋建立', text: '东京逐渐成为高度商业化的大都市。' },
      { year: '11世纪', title: '城市经济繁荣', text: '夜市、瓦舍、茶坊构成丰富的市民生活。' },
      { year: '1120', title: '危机逼近', text: '宋金关系与北方局势日益复杂。' },
      { year: '1127', title: '靖康之变', text: '北宋灭亡，东京命运急转直下。' },
    ],
    decision: {
      prompt: '有客人暗示北方将乱，建议你带积蓄离开汴京。可你的师傅说城里机会仍多。你怎么选？',
      context: '你只有少量钱，没有可靠情报。离开意味着放弃熟人网络，留下则继续赌城市秩序。',
      options: [
        {
          id: 'stay',
          label: '留下继续做工',
          stance: '相信城市',
          description: '汴京这么大，朝廷这么近，总会有办法。',
          immediate: '你的生活保持稳定，熟客和师傅都觉得你踏实。',
          longTerm: '如果危机真的到来，普通人撤离的窗口往往比权贵更短。你可能被迫在混乱中重新选择。',
          reflection: '历史灾变来临前，大多数人并不会立刻逃走。家计、亲友、职业和侥幸心理都会把人留在原地。',
        },
        {
          id: 'leave',
          label: '带钱南下投亲',
          stance: '提前避险',
          description: '宁可错过机会，也不想把命运交给传闻中的战争。',
          immediate: '路费几乎耗尽，你在陌生地方重新做最底层的活。',
          longTerm: '你可能避开最大的灾难，但失去城市中积累的人脉。安全不是胜利，只是另一种艰难开始。',
          reflection: '迁徙是普通人面对历史冲击的重要策略，但迁徙本身也充满成本和危险。',
        },
        {
          id: 'prepare',
          label: '留下，但换成可携带资产',
          stance: '两手准备',
          description: '继续工作，同时把积蓄换成更容易带走的银钱和关系。',
          immediate: '你降低日常花费，开始打听南方路引、亲友和商队消息。',
          longTerm: '你不一定能改变命运，但会比毫无准备的人多一个选择。',
          reflection: '历史中的理性选择常不是英雄式决断，而是在不确定中增加选项。',
        },
      ],
    },
    realHistory:
      '《东京梦华录》等材料呈现了北宋东京繁盛的市民生活。1127 年靖康之变使这座城市和大量普通人的命运发生剧烈转折。',
    interpretationNote:
      '本场景主要依据城市生活与靖康前夜的宏观背景推演茶铺学徒经验；茶铺人物、对话传闻和个人迁徙选择均为教育化虚构。',
    missions: [
      {
        id: 'listen-for-crisis',
        title: '筛选茶铺传闻',
        instruction: '把客人闲谈分成物价、边境、朝廷三类信息，并判断哪类最影响你。',
        evidenceUse: '用茶铺“信息节点”与时间线中的危机逼近建立证据链。',
        deliverable: '一段 120 字以内的证据说明，回答“把客人闲谈分成物价、边境、朝廷三类信息，并判断哪类最影响你。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          '《东京梦华录》',
          'The Cambridge History of China, Volume 5: The Sung Dynasty and Its Precursors'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：把客人闲谈分成物价、边境、朝廷三类信息，并判断哪类最影响你。',
          '使用证据：用茶铺“信息节点”与时间线中的危机逼近建立证据链。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'budget-escape',
        title: '计算南下成本',
        instruction: '说明离开汴京会损失哪些资源，而不只是花掉路费。',
        evidenceUse: '引用居所、工作、熟人网络和积蓄有限的情境。',
        deliverable: '一段 120 字以内的证据说明，回答“说明离开汴京会损失哪些资源，而不只是花掉路费。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '观点论证',
        outputTemplate: [
          '观点：明确赞成、反对或折中立场。',
          '证据：列出支持观点的两条线索。',
          '反例/限制：说明这个观点可能忽略什么。',
          '解释：把证据和观点连起来。',
          '结论：回到普通人的处境。'
        ],
        rubric: [
          '观点明确且可争辩。',
          '证据能支撑观点，并处理一个反例或限制。',
          '把宏观历史条件与角色处境连接起来。',
          '语言克制，避免现代价值直接覆盖历史语境。'
        ],
        sentenceStarters: [
          '我的观点是……',
          '支持这个观点的第一条证据是……',
          '一个可能的反驳是……',
          '把它放回当时的限制条件中，……'
        ],
        linkedSourceTitles: [
          '《东京梦华录》',
          'The Cambridge History of China, Volume 5: The Sung Dynasty and Its Precursors',
          'Daily Life in China on the Eve of the Mongol Invasion, 1250-1276'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：说明离开汴京会损失哪些资源，而不只是花掉路费。',
          '使用证据：引用居所、工作、熟人网络和积蓄有限的情境。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'read-city-fragility',
        title: '判断繁华的脆弱处',
        instruction: '找出汴京日常中最容易被战争打断的三个系统。',
        evidenceUse: '从汴河货运、粮价、店铺劳动和城市治安中选取证据。',
        deliverable: '一段 120 字以内的证据说明，回答“找出汴京日常中最容易被战争打断的三个系统。”',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          '《东京梦华录》',
          'The Cambridge History of China, Volume 5: The Sung Dynasty and Its Precursors'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：找出汴京日常中最容易被战争打断的三个系统。',
          '使用证据：从汴河货运、粮价、店铺劳动和城市治安中选取证据。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'ordinary-choice',
        title: '重写普通人的选择题',
        instruction: '把“逃或留”改写成一个更真实的渐进式准备方案。',
        evidenceUse: '用“可携带资产”和“增加选项”的反思说明普通人的策略。',
        deliverable: '一段 120 字以内的证据说明，回答“把“逃或留”改写成一个更真实的渐进式准备方案。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '方案设计',
        outputTemplate: [
          '目标：写明方案要解决的风险。',
          '做法：列出 2-3 个可执行步骤。',
          '证据依据：说明每一步来自哪些历史线索。',
          '代价：承认方案会损失什么。',
          '检验：说明怎样判断方案有效。'
        ],
        rubric: [
          '方案目标具体，步骤可执行。',
          '每个步骤都能对应历史线索或来源。',
          '能评估代价、风险和可能失败点。',
          '检验标准清楚，不只是愿望表达。'
        ],
        sentenceStarters: [
          '这个方案首先要避免……',
          '第一步可以是……',
          '这样做的历史依据是……',
          '它的代价是……'
        ],
        linkedSourceTitles: [
          '《东京梦华录》',
          'The Cambridge History of China, Volume 5: The Sung Dynasty and Its Precursors',
          'Daily Life in China on the Eve of the Mongol Invasion, 1250-1276'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：把“逃或留”改写成一个更真实的渐进式准备方案。',
          '使用证据：用“可携带资产”和“增加选项”的反思说明普通人的策略。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
    ],
    keyTerms: [
      { term: '东京汴梁', definition: '北宋都城，商业、交通和市民文化高度发达。' },
      { term: '瓦舍', definition: '宋代城市中的娱乐消费空间，聚集表演、说唱和人群流动。' },
      { term: '靖康之变', definition: '1127 年金军攻破东京、北宋灭亡的重大政治军事事件。' },
      { term: '市民生活', definition: '由商业服务、娱乐、信息流通和雇佣劳动构成的城市日常经验。' },
    ],
    compareAngles: [
      { title: '城市机会 vs. 迁徙成本', prompt: '为什么提前离开可能更安全，却不一定更“划算”？' },
      { title: '宏大危机 vs. 日常惯性', prompt: '战争临近时，哪些日常牵引会让普通人继续留在城市？' },
    ],
    sourceEvidenceUse: '以《东京梦华录》校准城市生活细节，再把宋代社会史研究用于解释危机前夜的结构性限制。',
    sources: [
      {
        title: '《东京梦华录》',
        creator: '孟元老',
        sourceType: 'primary',
        relevance: '记录北宋东京街市、饮食、瓦舍、节令和市民生活，是场景日常细节的核心参照。',
      },
      {
        title: 'The Cambridge History of China, Volume 5: The Sung Dynasty and Its Precursors',
        creator: 'Denis Twitchett 与 Paul Jakov Smith 编',
        sourceType: 'scholarship',
        relevance: '提供宋代政治、经济和社会结构综述，帮助把城市繁荣放入北宋末局势中。',
      },
      {
        title: 'Daily Life in China on the Eve of the Mongol Invasion, 1250-1276',
        creator: 'Jacques Gernet',
        sourceType: 'scholarship',
        relevance: '虽聚焦南宋杭州，但对宋代城市商业、茶酒铺与市民生活有可比参考价值。',
      },
    ],
  },
  {
    id: 'ming-jiangnan-scholar',
    title: '江南书房与海风',
    era: '明代中后期',
    year: 1567,
    location: '江南府县',
    region: '长江三角洲',
    coordinates: [31.2304, 121.4737],
    identity: '屡试不第的青年读书人',
    role: '塾师、账房、备考者',
    age: 29,
    theme: '科举、商业化、海贸边界',
    accent: '#86a8e7',
    summary:
      '你出身小康之家，读书多年仍未中举。身边有人继续押注科举，也有人转向账房、出版、海贸和地方事务。江南的财富正在改变读书人的选择。',
    atmosphere:
      '梅雨打湿书页，河埠头却挤满货船。你白天教蒙童背书，夜里替商家誊账，心里仍放不下下一场乡试。',
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '精细但不奢侈',
        text: '米饭、鱼虾、时蔬并不稀奇。真正昂贵的是应酬、书籍、纸墨和一次次赴考的路费。',
      },
      {
        key: 'home',
        label: '居所',
        title: '书房连着账房',
        text: '你的案头同时放着四书注本和商号账册。江南社会让读书与商业靠得很近，却也让身份焦虑更明显。',
      },
      {
        key: 'work',
        label: '工作',
        title: '功名之外也有市场',
        text: '教书、写状、修谱、记账都能糊口。科举是正途，但并非唯一生路。',
      },
      {
        key: 'education',
        label: '教育',
        title: '读书改变想象，也制造压力',
        text: '你熟悉经典，却也知道录取名额有限。越是相信读书能改命，落榜就越像对整个人生的否定。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '身份选择会得罪不同的人',
        text: '靠商太近会被讥为逐利，继续考试又可能拖垮家计。你要面对的不只是经济风险，还有名声。',
      },
      {
        key: 'freedoms',
        label: '机会',
        title: '商业化打开灰色空间',
        text: '出版、契约、海贸和地方公益需要识字者。你可以不做官，也参与塑造地方社会。',
      },
    ],
    timeline: [
      { year: '1368', title: '明朝建立', text: '科举和里甲制度重塑地方秩序。' },
      { year: '15世纪', title: '海禁与民间贸易拉扯', text: '官方控制与沿海商业需求长期并存。' },
      { year: '1567', title: '隆庆开关', text: '明廷部分开放海外贸易，白银流入加速。' },
      { year: '16世纪后期', title: '江南商业繁荣', text: '出版、手工业和市场网络发展。' },
    ],
    decision: {
      prompt: '家中积蓄有限，你是继续备考三年，还是接受商号邀请管理账务并参与海贸？',
      context: '科举给你身份正当性，商业给你现实收入。两条路都不是纯粹的成功或失败。',
      options: [
        {
          id: 'exam',
          label: '继续全力备考',
          stance: '守正途',
          description: '再给自己三年，把全部时间押在乡试上。',
          immediate: '你的社会评价保持体面，但家庭现金压力越来越大。',
          longTerm: '若中举，命运改写；若再落榜，你会更晚进入其他职业网络。',
          reflection: '科举社会的魅力在于开放上升通道，残酷也在于它让大量人长期悬置在希望之中。',
        },
        {
          id: 'commerce',
          label: '进入商号',
          stance: '务实转向',
          description: '用识字和计算能力换取稳定收入。',
          immediate: '你能补贴家用，也接触到更广阔的货物流动。',
          longTerm: '你可能积累财富，却需要处理读书人身份和商业实践之间的张力。',
          reflection: '明代江南商业化给士人提供了更多角色：他们既可能是官员候选人，也可能是市场社会的技术节点。',
        },
        {
          id: 'hybrid',
          label: '半工半读',
          stance: '折中路线',
          description: '白天做账，夜里读书，保留考试资格。',
          immediate: '你极其疲惫，但家计和理想都没有立刻崩塌。',
          longTerm: '折中可能让你两边都不够彻底，也可能让你成为更适应时代变化的人。',
          reflection: '多数人的历史选择不是二选一，而是在制度期待和现实压力之间拼接生活。',
        },
      ],
    },
    realHistory:
      '明代中后期江南商业、出版和海外白银流动显著发展。读书人与商业社会并非完全隔绝，地方社会中存在大量复合身份。',
    interpretationNote:
      '本场景把江南商业化、科举压力与隆庆开关后的海贸变化合并呈现；读书人的具体职业组合是时代趋势下的合成人物。',
    missions: [
      {
        id: 'trace-silver',
        title: '追踪白银流入',
        instruction: '说明海贸开放如何间接影响一个江南读书人的职业选择。',
        evidenceUse: '连接隆庆开关、商号账务和地方市场扩张。',
        deliverable: '一段 120 字以内的证据说明，回答“说明海贸开放如何间接影响一个江南读书人的职业选择。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '因果链',
        outputTemplate: [
          '起点：指出最先变化的条件。',
          '中介环节：写出制度、交通、价格或人际网络如何传导。',
          '结果：说明普通人生活或选择受到什么影响。',
          '证据标注：列出至少两条证据。',
          '一句总结：把因果链压缩成可复述结论。'
        ],
        rubric: [
          '因果顺序清楚，能区分起点、中介和结果。',
          '包含制度/环境变化如何传导到个人生活。',
          '证据不是孤立罗列，而是嵌入链条。',
          '结论简洁，可被同伴复述或质疑。'
        ],
        sentenceStarters: [
          '因果链可以从……开始。',
          '这个变化通过……传导到……',
          '对这个身份来说，结果不是抽象的，而是……',
          '最脆弱的环节是……'
        ],
        linkedSourceTitles: [
          '《明实录》隆庆朝相关记载',
          'The Confusions of Pleasure: Commerce and Culture in Ming China'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：说明海贸开放如何间接影响一个江南读书人的职业选择。',
          '使用证据：连接隆庆开关、商号账务和地方市场扩张。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'weigh-exam',
        title: '评估科举押注',
        instruction: '列出继续备考的身份收益和家庭成本。',
        evidenceUse: '用赴考路费、录取名额有限和社会评价体面作为证据。',
        deliverable: '一段 120 字以内的证据说明，回答“列出继续备考的身份收益和家庭成本。”',
        estimatedMinutes: 16,
        difficulty: '进阶',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          '《明实录》隆庆朝相关记载',
          'The Confusions of Pleasure: Commerce and Culture in Ming China'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：列出继续备考的身份收益和家庭成本。',
          '使用证据：用赴考路费、录取名额有限和社会评价体面作为证据。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'identify-hybrid-role',
        title: '辨认复合身份',
        instruction: '找出你同时像士人、雇员和商业技术人的证据。',
        evidenceUse: '引用书房、账房、塾师、誊账和出版/契约线索。',
        deliverable: '一段 120 字以内的证据说明，回答“找出你同时像士人、雇员和商业技术人的证据。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          '《明实录》隆庆朝相关记载',
          'The Confusions of Pleasure: Commerce and Culture in Ming China'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：找出你同时像士人、雇员和商业技术人的证据。',
          '使用证据：引用书房、账房、塾师、誊账和出版/契约线索。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'debate-reputation',
        title: '讨论名声风险',
        instruction: '解释为什么靠近商业不只是经济选择，也是名誉选择。',
        evidenceUse: '对照“逐利”讥评与地方社会对识字者的实际需求。',
        deliverable: '一段 120 字以内的证据说明，回答“解释为什么靠近商业不只是经济选择，也是名誉选择。”',
        estimatedMinutes: 16,
        difficulty: '进阶',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          '《明实录》隆庆朝相关记载',
          'The Confusions of Pleasure: Commerce and Culture in Ming China'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：解释为什么靠近商业不只是经济选择，也是名誉选择。',
          '使用证据：对照“逐利”讥评与地方社会对识字者的实际需求。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
    ],
    keyTerms: [
      { term: '科举', definition: '以经典考试选拔官员的制度，也是明代士人身份想象的核心通道。' },
      { term: '隆庆开关', definition: '1567 年后明廷部分放开民间海外贸易，月港贸易活跃。' },
      { term: '白银流入', definition: '全球贸易推动美洲和日本白银进入中国市场，影响税收与商业。' },
      { term: '士商关系', definition: '读书人身份与商业活动之间既互斥又互需的社会关系。' },
    ],
    compareAngles: [
      { title: '功名正途 vs. 市场生路', prompt: '为什么“不中举”不等于无路可走，却仍会造成身份焦虑？' },
      { title: '地方社会 vs. 全球贸易', prompt: '远洋白银和海贸政策如何改变内陆书房里的选择？' },
    ],
    sourceEvidenceUse: '用实录把政策时间点钉牢，再用晚明商业文化研究解释士人与市场的重叠空间。',
    sources: [
      {
        title: '《明实录》隆庆朝相关记载',
        creator: '明代官修实录',
        sourceType: 'primary',
        relevance: '可追溯隆庆年间海禁调整与月港开放等政策背景。',
      },
      {
        title: 'The Confusions of Pleasure: Commerce and Culture in Ming China',
        creator: 'Timothy Brook',
        sourceType: 'scholarship',
        relevance: '讨论明代商业化、消费文化和士商关系，是江南社会氛围的重要依据。',
      },
      {
        title: '1587, A Year of No Significance: The Ming Dynasty in Decline',
        creator: 'Ray Huang',
        sourceType: 'scholarship',
        relevance: '帮助理解晚明制度、财政与士人处境，作为科举和地方社会压力的背景读物。',
      },
    ],
  },
  {
    id: 'qing-guangzhou-comprador',
    title: '广州十三行的账簿',
    era: '清末前夜',
    year: 1838,
    location: '广州十三行',
    region: '珠江口',
    coordinates: [23.1291, 113.2644],
    identity: '懂英语和账务的买办助手',
    role: '翻译、记账、撮合交易',
    age: 31,
    theme: '全球贸易、制度夹缝、鸦片危机',
    accent: '#e58d72',
    summary:
      '你在十三行附近替行商与外商处理账务。茶叶、白银、鸦片、禁令和传言交织在一起。你比许多人更早看见全球贸易，也更早感到风暴。',
    atmosphere:
      '潮湿空气里有茶箱、木材和海水气味。外商馆区灯火通明，城内官府文书层层下达。每个人都在算账，却没人能算清代价。',
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '早茶与应酬饭局',
        text: '你熟悉本地饮食，也常在应酬中接触外来酒食。餐桌是交易场，也是试探边界的地方。',
      },
      {
        key: 'home',
        label: '居所',
        title: '离财富很近，离安全很远',
        text: '你住得比普通工人好，但身份尴尬。你靠外语与贸易谋生，也因此更容易被怀疑。',
      },
      {
        key: 'work',
        label: '工作',
        title: '翻译的不只是语言',
        text: '你解释价格、礼节、法律和误会。许多冲突看似语言问题，背后其实是制度与利益无法互译。',
      },
      {
        key: 'education',
        label: '技能',
        title: '边缘知识变成稀缺能力',
        text: '你的英语、算术和商业习惯来自实践，不一定被传统评价体系认可，却在口岸世界非常有用。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '夹在多方权力中间',
        text: '官府、行商、外商、走私网络都可能需要你，也都可能抛弃你。越接近核心交易，越难保持清白。',
      },
      {
        key: 'freedoms',
        label: '机会',
        title: '世界正在打开，但方式并不温和',
        text: '全球贸易带来财富、信息和新技术，也带来暴力、不平等和主权危机。你的机会嵌在这个矛盾里。',
      },
    ],
    timeline: [
      { year: '1757', title: '一口通商格局形成', text: '广州成为清朝对西方贸易的核心口岸。' },
      { year: '18世纪末', title: '茶叶与白银贸易扩大', text: '中西贸易规模增长，结构性矛盾加深。' },
      { year: '1838', title: '禁烟风暴前夕', text: '鸦片问题成为政治与外交危机焦点。' },
      { year: '1839', title: '林则徐虎门销烟', text: '中英冲突迅速升级。' },
    ],
    decision: {
      prompt: '外商希望你帮忙处理一批可疑货物文书，报酬很高。官府禁令却越来越严。你怎么做？',
      context: '拒绝可能失去客户，接受可能卷入违法与政治危机。你掌握的信息比普通人多，却仍看不清全局。',
      options: [
        {
          id: 'accept',
          label: '接受委托',
          stance: '逐利冒险',
          description: '只做文书，不直接碰货，或许能置身事外。',
          immediate: '你获得一大笔钱，也被更深地记录在交易链条中。',
          longTerm: '危机升级时，文书和关系都会成为证据。你以为自己只是中介，历史却可能把中介推到前台。',
          reflection: '全球贸易中的普通从业者常在灰色地带谋生，但灰色地带一旦被国家权力照亮，就会变得危险。',
        },
        {
          id: 'refuse',
          label: '拒绝并切断关系',
          stance: '自保避险',
          description: '少赚一笔，也少一个把柄。',
          immediate: '客户不满，你的收入下降，同行笑你胆小。',
          longTerm: '你可能避开清查，却也失去口岸贸易中最赚钱的网络。',
          reflection: '道德选择在历史现场很少是无成本的。拒绝不是退出历史，而是承担另一种代价。',
        },
        {
          id: 'report',
          label: '向行商透露风险',
          stance: '寻找保护伞',
          description: '不直接告官，而是把风险交给更有权势的人判断。',
          immediate: '你暂时获得行商庇护，也可能被视为不可靠的合作者。',
          longTerm: '依附强者能分摊风险，但你的命运也更依赖他们如何自保。',
          reflection: '夹缝中的人常通过层级关系求安全。保护伞不是自由，只是风险转移。',
        },
      ],
    },
    realHistory:
      '广州十三行体系连接清朝制度与全球贸易。鸦片贸易和禁烟运动最终引发鸦片战争，深刻改变中国近代史进程。',
    interpretationNote:
      '本场景从买办助手视角呈现十三行制度与鸦片危机的夹缝经验；文书委托与个人抉择为虚构，用于展示制度风险而非具体案件复原。',
    missions: [
      {
        id: 'follow-paper-trail',
        title: '追一条文书链',
        instruction: '把可疑货物从外商委托到官府追查的风险节点列出来。',
        evidenceUse: '用翻译、记账、撮合交易和“文书成为证据”的结果说明。',
        deliverable: '一段 120 字以内的证据说明，回答“把可疑货物从外商委托到官府追查的风险节点列出来。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '因果链',
        outputTemplate: [
          '起点：指出最先变化的条件。',
          '中介环节：写出制度、交通、价格或人际网络如何传导。',
          '结果：说明普通人生活或选择受到什么影响。',
          '证据标注：列出至少两条证据。',
          '一句总结：把因果链压缩成可复述结论。'
        ],
        rubric: [
          '因果顺序清楚，能区分起点、中介和结果。',
          '包含制度/环境变化如何传导到个人生活。',
          '证据不是孤立罗列，而是嵌入链条。',
          '结论简洁，可被同伴复述或质疑。'
        ],
        sentenceStarters: [
          '因果链可以从……开始。',
          '这个变化通过……传导到……',
          '对这个身份来说，结果不是抽象的，而是……',
          '最脆弱的环节是……'
        ],
        linkedSourceTitles: [
          'The Chinese Repository',
          'Trade and Diplomacy on the China Coast: The Opening of the Treaty Ports, 1842-1854'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：把可疑货物从外商委托到官府追查的风险节点列出来。',
          '使用证据：用翻译、记账、撮合交易和“文书成为证据”的结果说明。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'map-middleman',
        title: '画出中介位置',
        instruction: '说明买办助手夹在官府、行商、外商和走私网络之间的原因。',
        evidenceUse: '引用日常风险与十三行制度的真实历史对照。',
        deliverable: '一段 120 字以内的证据说明，回答“说明买办助手夹在官府、行商、外商和走私网络之间的原因。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '因果链',
        outputTemplate: [
          '起点：指出最先变化的条件。',
          '中介环节：写出制度、交通、价格或人际网络如何传导。',
          '结果：说明普通人生活或选择受到什么影响。',
          '证据标注：列出至少两条证据。',
          '一句总结：把因果链压缩成可复述结论。'
        ],
        rubric: [
          '因果顺序清楚，能区分起点、中介和结果。',
          '包含制度/环境变化如何传导到个人生活。',
          '证据不是孤立罗列，而是嵌入链条。',
          '结论简洁，可被同伴复述或质疑。'
        ],
        sentenceStarters: [
          '因果链可以从……开始。',
          '这个变化通过……传导到……',
          '对这个身份来说，结果不是抽象的，而是……',
          '最脆弱的环节是……'
        ],
        linkedSourceTitles: [
          'The Chinese Repository',
          'Trade and Diplomacy on the China Coast: The Opening of the Treaty Ports, 1842-1854'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：说明买办助手夹在官府、行商、外商和走私网络之间的原因。',
          '使用证据：引用日常风险与十三行制度的真实历史对照。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'price-opium-risk',
        title: '给灰色收益定价',
        instruction: '比较高报酬与政治危机带来的不对称代价。',
        evidenceUse: '用禁烟风暴、客户网络和清查风险建立判断。',
        deliverable: '一段 120 字以内的证据说明，回答“比较高报酬与政治危机带来的不对称代价。”',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '比较分析',
        outputTemplate: [
          '比较对象 A：概括其优势与限制。',
          '比较对象 B：概括其优势与限制。',
          '共同背景：指出两者共享的时代条件。',
          '关键差异：说明哪一点最影响选择。',
          '结论：给出有条件的判断。'
        ],
        rubric: [
          '比较维度一致，不把两个对象各说各话。',
          '能说明共同背景和关键差异。',
          '结论有条件，避免绝对化判断。',
          '至少引用两类证据支撑比较。'
        ],
        sentenceStarters: [
          '二者相同的是……',
          '真正的差异在于……',
          '如果把身份限制考虑进去，……',
          '因此我更倾向于……，但条件是……'
        ],
        linkedSourceTitles: [
          'The Chinese Repository',
          'Trade and Diplomacy on the China Coast: The Opening of the Treaty Ports, 1842-1854',
          'The Opium War: Drugs, Dreams and the Making of China'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：比较高报酬与政治危机带来的不对称代价。',
          '使用证据：用禁烟风暴、客户网络和清查风险建立判断。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'translate-systems',
        title: '翻译两个制度',
        instruction: '指出至少两个“语言问题”背后的制度冲突。',
        evidenceUse: '从礼节、法律、价格和贸易规则不可互译处举例。',
        deliverable: '一段 120 字以内的证据说明，回答“指出至少两个“语言问题”背后的制度冲突。”',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '比较分析',
        outputTemplate: [
          '比较对象 A：概括其优势与限制。',
          '比较对象 B：概括其优势与限制。',
          '共同背景：指出两者共享的时代条件。',
          '关键差异：说明哪一点最影响选择。',
          '结论：给出有条件的判断。'
        ],
        rubric: [
          '比较维度一致，不把两个对象各说各话。',
          '能说明共同背景和关键差异。',
          '结论有条件，避免绝对化判断。',
          '至少引用两类证据支撑比较。'
        ],
        sentenceStarters: [
          '二者相同的是……',
          '真正的差异在于……',
          '如果把身份限制考虑进去，……',
          '因此我更倾向于……，但条件是……'
        ],
        linkedSourceTitles: [
          'The Chinese Repository',
          'Trade and Diplomacy on the China Coast: The Opening of the Treaty Ports, 1842-1854',
          'The Opium War: Drugs, Dreams and the Making of China'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：指出至少两个“语言问题”背后的制度冲突。',
          '使用证据：从礼节、法律、价格和贸易规则不可互译处举例。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
    ],
    keyTerms: [
      { term: '十三行', definition: '清代广州对外贸易中承担中外贸易管理与中介职能的行商体系。' },
      { term: '买办', definition: '在中外贸易中提供语言、账务、撮合和制度转换服务的中介角色。' },
      { term: '鸦片贸易', definition: '以鸦片走私和白银外流为核心的贸易危机，最终引发战争。' },
      { term: '一口通商', definition: '清廷限制西方商人在广州一地进行贸易的制度格局。' },
    ],
    compareAngles: [
      { title: '全球机会 vs. 主权危机', prompt: '为什么口岸世界能同时带来新技能、新财富和国家层面的风险？' },
      { title: '中介能力 vs. 中介责任', prompt: '当你只“翻译和记账”时，是否仍要承担交易后果？' },
    ],
    sourceEvidenceUse: '用口岸英文材料观察当时人的贸易视角，再用外交与鸦片战争研究界定制度冲突。',
    sources: [
      {
        title: 'The Chinese Repository',
        creator: '19世纪广州英文期刊',
        sourceType: 'primary',
        relevance: '保留口岸外侨、贸易和中外关系观察，可作为十三行时代英文材料参照。',
      },
      {
        title: 'Trade and Diplomacy on the China Coast: The Opening of the Treaty Ports, 1842-1854',
        creator: 'John King Fairbank',
        sourceType: 'scholarship',
        relevance: '分析广州贸易制度向条约口岸体系转变的外交与商业背景。',
      },
      {
        title: 'The Opium War: Drugs, Dreams and the Making of China',
        creator: 'Julia Lovell',
        sourceType: 'scholarship',
        relevance: '以近现代视角综述鸦片贸易、禁烟运动与战争影响，帮助界定叙事的危机边界。',
      },
    ],
  },
  {
    id: 'wwii-london-civilian',
    title: '伦敦防空灯火管制',
    era: '第二次世界大战',
    year: 1940,
    location: '伦敦东区',
    region: '英格兰东南部',
    coordinates: [51.5072, -0.1276],
    identity: '伦敦东区的普通居民',
    role: '白天做文员，夜里参加社区防空',
    age: 26,
    theme: '总体战、城市韧性、平民经验',
    accent: '#9fb6ff',
    summary:
      '你生活在不列颠空战与伦敦大轰炸期间。战争不只在前线，也在地铁站、防空洞、配给本和每一扇遮光窗帘里。',
    atmosphere:
      '傍晚后城市压低亮光。警报响起时，人们带着毯子、茶壶和疲惫钻进地下。恐惧并不总是尖叫，有时只是排队时的沉默。',
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '配给塑造餐桌',
        text: '糖、肉、黄油都受限制。你学会把简单食材做得更耐吃，也学会把抱怨变成玩笑。',
      },
      {
        key: 'home',
        label: '居所',
        title: '家需要被遮光',
        text: '窗帘必须严密，玻璃贴上胶带。家不再只是私人空间，也是城市防御的一部分。',
      },
      {
        key: 'work',
        label: '工作',
        title: '日常继续运转',
        text: '白天你仍要上班，处理文件、排队买东西、关心亲友消息。战争把普通日程变得沉重，却没有让它停止。',
      },
      {
        key: 'education',
        label: '信息',
        title: '广播连接全国情绪',
        text: '你从广播和报纸获得消息。官方叙事、真实损失和邻里传闻交织，影响每个人对未来的判断。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '危险来自天空',
        text: '炸弹不会区分军人和平民。一次警报、一次迟疑、一个错误地点，都可能改变家庭命运。',
      },
      {
        key: 'freedoms',
        label: '互助',
        title: '社区成为防线',
        text: '邻居共享热水、消息和床位。总体战压缩个人自由，也让互助变成生存技术。',
      },
    ],
    timeline: [
      { year: '1939', title: '英国参战', text: '平民生活迅速进入战时制度。' },
      { year: '1940', title: '不列颠空战', text: '英国本土面临德国空军持续压力。' },
      { year: '1940-1941', title: '伦敦大轰炸', text: '伦敦遭受连续空袭，平民成为战争核心承受者。' },
      { year: '1945', title: '欧洲战争结束', text: '战后重建重新塑造城市和福利国家想象。' },
    ],
    decision: {
      prompt: '今晚警报响起，你可以去拥挤但坚固的地铁站，也可以留在家附近照顾年迈邻居。你怎么选？',
      context: '没有选择是完全安全的。你要在个人安全、责任和不确定的轰炸路线之间判断。',
      options: [
        {
          id: 'station',
          label: '去地铁站避难',
          stance: '优先自保',
          description: '那里更坚固，也有更多人。',
          immediate: '你挤在潮湿站台上，睡不好，但心理上更踏实。',
          longTerm: '你更可能避开房屋坍塌风险，却也可能在混乱中与邻里支持网络变得疏远。',
          reflection: '平民战争经验里，自保不是怯懦，而是持续生活的前提。',
        },
        {
          id: 'neighbor',
          label: '留下照顾邻居',
          stance: '社区责任',
          description: '你帮助行动不便的人进入附近防空处。',
          immediate: '你承担更大风险，也让几个人不至于孤立无援。',
          longTerm: '如果平安度过，社区关系会更紧密；如果轰炸落下，代价可能极高。',
          reflection: '历史中的勇气常不是宏大宣言，而是在有限范围内不放弃别人。',
        },
        {
          id: 'rotate',
          label: '组织轮班互助',
          stance: '制度化互助',
          description: '你提议今晚由几户人轮流照看老人和孩子。',
          immediate: '协调很麻烦，甚至有人不愿配合，但风险被分摊。',
          longTerm: '一套小小的社区规则可能比单次善意更持久。',
          reflection: '面对长期危机，互助需要从情绪变成机制。战争推动了人们对公共责任的新理解。',
        },
      ],
    },
    realHistory:
      '伦敦大轰炸期间，平民防空、灯火管制、地铁避难和社区互助成为英国战时社会的重要经验，也影响战后公共政策想象。',
    interpretationNote:
      '本场景依据伦敦大轰炸中的平民防护、配给和互助经验塑造普通居民；邻居与轮班选择为合成情境，不代表单一档案个案。',
    missions: [
      {
        id: 'inspect-blackout',
        title: '检查灯火管制',
        instruction: '说明一扇窗帘为什么会成为城市防御的一部分。',
        evidenceUse: '引用遮光窗、玻璃胶带和空袭风险，连接私人空间与总体战。',
        deliverable: '一段 120 字以内的证据说明，回答“说明一扇窗帘为什么会成为城市防御的一部分。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          'Imperial War Museums: The Blitz collection and learning resources',
          'Mass Observation Archive'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：说明一扇窗帘为什么会成为城市防御的一部分。',
          '使用证据：引用遮光窗、玻璃胶带和空袭风险，连接私人空间与总体战。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'ration-table',
        title: '重建配给餐桌',
        instruction: '用配给限制解释家庭日常如何被战争制度重新组织。',
        evidenceUse: '从糖、肉、黄油限制和排队生活中提取证据。',
        deliverable: '一段 120 字以内的证据说明，回答“用配给限制解释家庭日常如何被战争制度重新组织。”',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '证据说明',
        outputTemplate: [
          '核心判断：用一句话回答任务问题。',
          '证据一：引用场景中的具体线索，并说明来源。',
          '证据二：再补充一条不同类型的线索。',
          '解释：说明两条证据如何共同支持判断。',
          '保留问题：写出仍不确定的一点。'
        ],
        rubric: [
          '回答紧扣任务问题，没有只复述剧情。',
          '至少使用两条具体证据，并标明来自日常、时间线、决策或来源层。',
          '能解释证据与判断之间的关系。',
          '承认叙事化合成的边界或不确定性。'
        ],
        sentenceStarters: [
          '我认为最关键的证据是……',
          '这条线索说明……',
          '如果只看这一点，可能会误判，因为……',
          '我还不能确定的是……'
        ],
        linkedSourceTitles: [
          'Imperial War Museums: The Blitz collection and learning resources',
          'Mass Observation Archive'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：用配给限制解释家庭日常如何被战争制度重新组织。',
          '使用证据：从糖、肉、黄油限制和排队生活中提取证据。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'shelter-decision',
        title: '比较避难选择',
        instruction: '评估地铁站、家附近防空处和社区轮班各自的风险。',
        evidenceUse: '结合决策选项中的短期结果与长期影响。',
        deliverable: '一段 120 字以内的证据说明，回答“评估地铁站、家附近防空处和社区轮班各自的风险。”',
        estimatedMinutes: 16,
        difficulty: '进阶',
        taskType: '比较分析',
        outputTemplate: [
          '比较对象 A：概括其优势与限制。',
          '比较对象 B：概括其优势与限制。',
          '共同背景：指出两者共享的时代条件。',
          '关键差异：说明哪一点最影响选择。',
          '结论：给出有条件的判断。'
        ],
        rubric: [
          '比较维度一致，不把两个对象各说各话。',
          '能说明共同背景和关键差异。',
          '结论有条件，避免绝对化判断。',
          '至少引用两类证据支撑比较。'
        ],
        sentenceStarters: [
          '二者相同的是……',
          '真正的差异在于……',
          '如果把身份限制考虑进去，……',
          '因此我更倾向于……，但条件是……'
        ],
        linkedSourceTitles: [
          'Imperial War Museums: The Blitz collection and learning resources',
          'Mass Observation Archive',
          'Wartime: Britain 1939-1945'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：评估地铁站、家附近防空处和社区轮班各自的风险。',
          '使用证据：结合决策选项中的短期结果与长期影响。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'read-morale',
        title: '辨认平民士气',
        instruction: '找出恐惧、玩笑、排队沉默和互助如何共同构成韧性。',
        evidenceUse: '用氛围、广播信息和 Mass Observation 类材料的平民视角。',
        deliverable: '一段 120 字以内的证据说明，回答“找出恐惧、玩笑、排队沉默和互助如何共同构成韧性。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          'Imperial War Museums: The Blitz collection and learning resources',
          'Mass Observation Archive'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：找出恐惧、玩笑、排队沉默和互助如何共同构成韧性。',
          '使用证据：用氛围、广播信息和 Mass Observation 类材料的平民视角。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
    ],
    keyTerms: [
      { term: '伦敦大轰炸', definition: '1940-1941 年德国空军对伦敦等英国城市的持续轰炸。' },
      { term: '灯火管制', definition: '通过遮蔽夜间光源降低敌机定位城市目标可能性的民防措施。' },
      { term: '配给制度', definition: '战时政府限制和分配关键食品、燃料及物资的制度。' },
      { term: '总体战', definition: '动员军事、工业、家庭和社会生活各层面的战争形态。' },
    ],
    compareAngles: [
      { title: '自保 vs. 互助', prompt: '平民在长期空袭下如何平衡个人安全与社区责任？' },
      { title: '私人日常 vs. 国家战争', prompt: '配给本、窗帘和地铁站如何把家庭生活接入国家战争机器？' },
    ],
    sourceEvidenceUse: '用博物馆资料确认民防制度与事件框架，用平民档案和社会史研究补足情绪与日常细节。',
    sources: [
      {
        title: 'Imperial War Museums: The Blitz collection and learning resources',
        creator: 'Imperial War Museums',
        sourceType: 'institution',
        relevance: '提供伦敦大轰炸、防空、灯火管制和民防体系的博物馆级资料入口。',
        url: 'https://www.iwm.org.uk/history/the-blitz-around-britain',
      },
      {
        title: 'Mass Observation Archive',
        creator: 'University of Sussex Special Collections',
        sourceType: 'institution',
        relevance: '保存英国平民战时日记、问卷和观察材料，支撑普通人情绪与日常经验维度。',
        url: 'https://massobs.org.uk/',
      },
      {
        title: 'Wartime: Britain 1939-1945',
        creator: 'Juliet Gardiner',
        sourceType: 'scholarship',
        relevance: '综合战时英国社会史，覆盖配给、避难、家庭与社区生活。',
      },
    ],
  },
  {
    id: 'abbasid-baghdad-scribe',
    title: '巴格达纸坊抄写员',
    era: '阿拔斯王朝盛期',
    year: 832,
    location: '巴格达',
    region: '美索不达米亚',
    coordinates: [33.3152, 44.3661],
    identity: '在纸坊和书肆之间奔走的青年抄写员',
    role: '抄写、校读、替学者整理手稿',
    age: 22,
    theme: '纸张、翻译、知识城市',
    accent: '#c9a46a',
    summary:
      '你靠抄写纸本谋生，也在学者、书商和赞助人之间见证知识流动。纸张让书更便宜，巴格达让希腊、波斯、印度与阿拉伯传统在同一张书页上相遇。',
    atmosphere:
      '底格里斯河边湿热而嘈杂。纸浆、墨烟和皮革气味混在一起，书肆里有人争论天文表，也有人急着把一部译稿送进赞助人的宅邸。',
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '枣、面饼与长夜咖谈前的热汤',
        text: '你吃得简单：面饼、豆汤、枣和偶尔的羊肉。真正消耗收入的是纸、墨、灯油和请校读者喝茶的花费。',
      },
      {
        key: 'home',
        label: '居所',
        title: '租屋里堆满纸页',
        text: '你和亲属合住，睡处旁边就是待抄的书页。纸比羊皮便宜，却仍怕潮、火和鼠咬。',
      },
      {
        key: 'work',
        label: '工作',
        title: '准确比速度更值钱',
        text: '你按页或按卷收钱，抄完还要校对人名、数字和异文。一个小错误可能让医方失效，或让天文计算偏离。',
      },
      {
        key: 'education',
        label: '见识',
        title: '在字里偷学世界',
        text: '你不是名学者，却通过抄写接触几何、医学、哲学和诗歌。手艺劳动也可能成为学习通道。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '赞助与争论同样危险',
        text: '翻译项目需要哈里发和精英资助，也会卷入神学、宫廷和学派争论。知识越受重视，错误和立场越容易被放大。',
      },
      {
        key: 'freedoms',
        label: '机会',
        title: '纸张扩大了知识市场',
        text: '纸本、书肆和学术圈创造新职业：抄写员、装订匠、译者、校读者。你可以靠文字进入更宽广的城市网络。',
      },
    ],
    timeline: [
      { year: '762', title: '巴格达建城', text: '新都成为阿拔斯帝国政治与商业中心。' },
      { year: '8世纪后期', title: '纸张生产扩展', text: '纸本逐渐改变行政、商业和学术书写成本。' },
      { year: '832', title: '翻译与学术赞助活跃', text: '哈里发马蒙时期，学术赞助与翻译活动声望很高。' },
      { year: '9世纪', title: '书肆与学术网络繁荣', text: '抄写、校读、藏书和辩论支撑城市知识经济。' },
    ],
    decision: {
      prompt: '一位赞助人催你快速抄完医学译稿，但校读者发现几个可疑术语。你怎么处理？',
      context: '快交稿能拿到报酬，慢校对可能得罪赞助人。你只是抄写员，却知道文字错误会进入更大的知识链。',
      options: [
        {
          id: 'rush',
          label: '按时交稿',
          stance: '保住收入',
          description: '把疑点留给读者，先不耽误交付。',
          immediate: '你按期拿钱，赞助人满意，书商也愿继续给你活。',
          longTerm: '如果错误被追究，你的名声会受损。知识市场依赖信用，抄写员也要为准确性承担责任。',
          reflection: '知识传播不是抽象的光辉事业，也由计件劳动、时间压力和信用体系支撑。',
        },
        {
          id: 'delay',
          label: '请求延期校订',
          stance: '优先准确',
          description: '向赞助人解释术语疑点，需要再核对旧本。',
          immediate: '你可能少拿一部分钱，甚至被认为效率低。',
          longTerm: '若校订证明有价值，你会获得更可靠的职业声誉。',
          reflection: '学术质量常来自看不见的慢工：核对、比较、怀疑和修正。',
        },
        {
          id: 'annotate',
          label: '交稿并附疑点注记',
          stance: '折中透明',
          description: '按期提交，但在页边列出需要学者判断的术语。',
          immediate: '你避免完全延误，也把风险公开给上层判断。',
          longTerm: '注记可能让你被看见为细心助手，也可能暴露你“越界”评论文本。',
          reflection: '普通劳动者常通过标注、提醒和流程设计影响知识可靠性。',
        },
      ],
    },
    realHistory:
      '阿拔斯时期巴格达是重要的行政、商业与学术中心。纸张传播、翻译运动、书肆和赞助网络共同推动了阿拉伯语学术文化的发展。',
    interpretationNote:
      '本场景把纸张生产、抄写职业和翻译赞助合成到一名虚构抄写员身上；具体委托与医学译稿冲突为教育化情境。',
    missions: [
      {
        id: 'trace-paper-chain',
        title: '追踪一页纸的旅程',
        instruction: '说明纸张如何从材料技术变成城市知识市场的基础。',
        evidenceUse: '连接纸坊、书肆、抄写计件和书籍成本下降。',
        deliverable: '一段 120 字以内的证据说明，回答“说明纸张如何从材料技术变成城市知识市场的基础。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '因果链',
        outputTemplate: [
          '起点：指出最先变化的条件。',
          '中介环节：写出制度、交通、价格或人际网络如何传导。',
          '结果：说明普通人生活或选择受到什么影响。',
          '证据标注：列出至少两条证据。',
          '一句总结：把因果链压缩成可复述结论。'
        ],
        rubric: [
          '因果顺序清楚，能区分起点、中介和结果。',
          '包含制度/环境变化如何传导到个人生活。',
          '证据不是孤立罗列，而是嵌入链条。',
          '结论简洁，可被同伴复述或质疑。'
        ],
        sentenceStarters: [
          '因果链可以从……开始。',
          '这个变化通过……传导到……',
          '对这个身份来说，结果不是抽象的，而是……',
          '最脆弱的环节是……'
        ],
        linkedSourceTitles: [
          '《群书类述》（Kitāb al-Fihrist）',
          'The Rise of the Arabic Book'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：说明纸张如何从材料技术变成城市知识市场的基础。',
          '使用证据：连接纸坊、书肆、抄写计件和书籍成本下降。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'audit-translation',
        title: '审核一个译词',
        instruction: '判断可疑术语会影响哪些读者和职业角色。',
        evidenceUse: '引用医学、天文、校读和赞助人之间的知识链。',
        deliverable: '一段 120 字以内的证据说明，回答“判断可疑术语会影响哪些读者和职业角色。”',
        estimatedMinutes: 16,
        difficulty: '进阶',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          '《群书类述》（Kitāb al-Fihrist）',
          'The Rise of the Arabic Book'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：判断可疑术语会影响哪些读者和职业角色。',
          '使用证据：引用医学、天文、校读和赞助人之间的知识链。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'map-patronage',
        title: '画出赞助网络',
        instruction: '列出抄写员、译者、校读者、书商和赞助人的利益关系。',
        evidenceUse: '用决策选项中的报酬、延期和注记风险解释。',
        deliverable: '一段 120 字以内的证据说明，回答“列出抄写员、译者、校读者、书商和赞助人的利益关系。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '因果链',
        outputTemplate: [
          '起点：指出最先变化的条件。',
          '中介环节：写出制度、交通、价格或人际网络如何传导。',
          '结果：说明普通人生活或选择受到什么影响。',
          '证据标注：列出至少两条证据。',
          '一句总结：把因果链压缩成可复述结论。'
        ],
        rubric: [
          '因果顺序清楚，能区分起点、中介和结果。',
          '包含制度/环境变化如何传导到个人生活。',
          '证据不是孤立罗列，而是嵌入链条。',
          '结论简洁，可被同伴复述或质疑。'
        ],
        sentenceStarters: [
          '因果链可以从……开始。',
          '这个变化通过……传导到……',
          '对这个身份来说，结果不是抽象的，而是……',
          '最脆弱的环节是……'
        ],
        linkedSourceTitles: [
          '《群书类述》（Kitāb al-Fihrist）',
          'The Rise of the Arabic Book'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：列出抄写员、译者、校读者、书商和赞助人的利益关系。',
          '使用证据：用决策选项中的报酬、延期和注记风险解释。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'compare-labor-learning',
        title: '辨认劳动中的学习',
        instruction: '说明抄写为何既是体力/手艺劳动，也是接触知识的机会。',
        evidenceUse: '结合“在字里偷学世界”和准确性要求。',
        deliverable: '一段 120 字以内的证据说明，回答“说明抄写为何既是体力/手艺劳动，也是接触知识的机会。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          '《群书类述》（Kitāb al-Fihrist）',
          'The Rise of the Arabic Book'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：说明抄写为何既是体力/手艺劳动，也是接触知识的机会。',
          '使用证据：结合“在字里偷学世界”和准确性要求。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
    ],
    keyTerms: [
      { term: '阿拔斯王朝', definition: '750 年建立、以巴格达为核心的伊斯兰帝国王朝，推动行政与学术文化发展。' },
      { term: '智慧宫', definition: '常用来概括巴格达宫廷赞助的翻译、藏书和学术活动传统。' },
      { term: '纸张传播', definition: '纸的生产和使用降低书写成本，扩大行政、商业和学术文本流通。' },
      { term: '翻译运动', definition: '将希腊、波斯、印度等传统中的医学、哲学、数学文本译入阿拉伯语的长期过程。' },
    ],
    compareAngles: [
      { title: '技术材料 vs. 知识制度', prompt: '为什么纸张本身不足以创造学术繁荣，还需要赞助、市场和校读网络？' },
      { title: '普通抄写 vs. 学术创新', prompt: '知识史中哪些关键劳动常被伟大学者叙事遮蔽？' },
    ],
    sourceEvidenceUse: '用阿拉伯书籍史和科学史研究校准纸张、翻译与抄写职业，再用早期书目传统理解城市知识网络。',
    sources: [
      {
        title: '《群书类述》（Kitāb al-Fihrist）',
        creator: '伊本·纳迪姆',
        sourceType: 'primary',
        relevance: '10 世纪书目材料，记录作者、书籍、译者和学术传统，可反观巴格达书籍文化。',
      },
      {
        title: 'The Rise of the Arabic Book',
        creator: 'Beatrice Gruendler',
        sourceType: 'scholarship',
        relevance: '讨论阿拉伯书籍文化、纸张和文本生产，支撑抄写员与书肆细节。',
      },
      {
        title: 'Greek Thought, Arabic Culture',
        creator: 'Dimitri Gutas',
        sourceType: 'scholarship',
        relevance: '分析阿拔斯翻译运动的社会、政治和知识背景。',
      },
    ],
  },
  {
    id: 'timbuktu-manuscript-student',
    title: '廷巴克图手稿学生',
    era: '桑海帝国时期',
    year: 1495,
    location: '廷巴克图',
    region: '西非萨赫勒',
    coordinates: [16.7666, -3.0026],
    identity: '寄住在学者家中的手稿学生',
    role: '诵读、抄写、替师长跑腿',
    age: 18,
    theme: '手稿、伊斯兰学术、跨撒哈拉贸易',
    accent: '#d6b86a',
    summary:
      '你在廷巴克图求学，白天背诵法学文本，夜里替老师抄写手稿。盐、金、书籍和消息沿着商路进入城市，知识也是贸易网络的一部分。',
    atmosphere:
      '沙尘落在木板和纸页上。清真寺旁有人讨论判例，驼队带来盐块、布匹和远方消息。你把墨水磨匀，小心不让风吹乱未干的字。',
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '米粥、奶和集市来的盐',
        text: '饮食朴素，常靠寄宿家庭和同乡互助。盐既是味道，也是跨撒哈拉贸易在餐桌上的痕迹。',
      },
      {
        key: 'home',
        label: '居所',
        title: '学者家也是小课堂',
        text: '你睡在老师家的一角，书箱、木板和来访学生挤在一起。学习空间和家庭空间并不分开。',
      },
      {
        key: 'work',
        label: '学习',
        title: '背诵与抄写同样重要',
        text: '你背诵法学、语法和诗文，也抄写手稿换取指导。知识靠记忆、师承和纸页共同保存。',
      },
      {
        key: 'education',
        label: '师承',
        title: '证书来自人际链条',
        text: '一本书的权威不只在文字，也在谁教过你、谁允许你传授。学术声望是一条关系链。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '书会被火、潮和战争带走',
        text: '手稿昂贵而脆弱，政治冲突、劫掠、火灾和沙尘都可能让多年学习消失。',
      },
      {
        key: 'freedoms',
        label: '机会',
        title: '商路把城市接入世界',
        text: '你可能遇见来自杰内、瓦拉塔、马格里布的商人与学者。廷巴克图不是孤岛，而是沙漠边缘的知识节点。',
      },
    ],
    timeline: [
      { year: '1324', title: '曼萨·穆萨朝觐', text: '马里统治者的朝觐提升西非伊斯兰世界声望。' },
      { year: '15世纪后期', title: '桑海控制廷巴克图', text: '城市在桑海帝国框架下继续作为贸易与学术中心。' },
      { year: '1495', title: '手稿学习网络活跃', text: '学者、学生与商路共同维持城市学术生活。' },
      { year: '1591', title: '摩洛哥军队入侵桑海', text: '政治格局变化冲击廷巴克图的学术与商业环境。' },
    ],
    decision: {
      prompt: '一支商队愿意带你去瓦拉塔继续求学，但老师希望你留下协助整理手稿。你怎么选？',
      context: '远行能拓展师承，留下能保护现有书籍和关系。路途、费用和安全都不确定。',
      options: [
        {
          id: 'travel',
          label: '随商队远行求学',
          stance: '拓展师承',
          description: '把风险交给商路，寻找新的老师和文本。',
          immediate: '你离开熟悉的庇护，旅费和路途风险立刻变重。',
          longTerm: '若平安抵达，你的学术关系会扩大，也可能获得更高声望。',
          reflection: '知识网络常依赖移动。学者和学生的远行把城市连接成看不见的地图。',
        },
        {
          id: 'stay',
          label: '留下整理手稿',
          stance: '守护本地知识',
          description: '帮助老师校对、分类和保存书箱。',
          immediate: '你错过远行机会，但获得老师更深入指导。',
          longTerm: '你可能成为本地传统的可靠继承者；若政治风暴来临，守护也可能变成负担。',
          reflection: '保存知识不是被动停留，而是把脆弱材料变成可传承的秩序。',
        },
        {
          id: 'copy',
          label: '先抄副本再决定',
          stance: '复制分散风险',
          description: '用几个月抄出关键文本副本，再随下一支商队走。',
          immediate: '你非常辛苦，也需要更多纸墨和同学协助。',
          longTerm: '副本让知识不只依赖一个地点，你也带着本地学脉远行。',
          reflection: '手稿文化中的复制不是机械重复，而是面对脆弱世界的风险管理。',
        },
      ],
    },
    realHistory:
      '廷巴克图在马里、桑海时期与跨撒哈拉贸易和伊斯兰学术网络相连，保存了大量法学、语法、诗歌、天文等手稿传统。',
    interpretationNote:
      '本场景把廷巴克图学者家庭、学生寄宿、手稿抄写与商路移动合成呈现；个人远行选择不对应单一学生传记。',
    missions: [
      {
        id: 'map-sahara-network',
        title: '画出沙漠知识网',
        instruction: '说明商路如何同时运送盐、书籍、消息和学术声望。',
        evidenceUse: '连接驼队、盐、杰内/瓦拉塔/马格里布和师承流动。',
        deliverable: '一段 120 字以内的证据说明，回答“说明商路如何同时运送盐、书籍、消息和学术声望。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '因果链',
        outputTemplate: [
          '起点：指出最先变化的条件。',
          '中介环节：写出制度、交通、价格或人际网络如何传导。',
          '结果：说明普通人生活或选择受到什么影响。',
          '证据标注：列出至少两条证据。',
          '一句总结：把因果链压缩成可复述结论。'
        ],
        rubric: [
          '因果顺序清楚，能区分起点、中介和结果。',
          '包含制度/环境变化如何传导到个人生活。',
          '证据不是孤立罗列，而是嵌入链条。',
          '结论简洁，可被同伴复述或质疑。'
        ],
        sentenceStarters: [
          '因果链可以从……开始。',
          '这个变化通过……传导到……',
          '对这个身份来说，结果不是抽象的，而是……',
          '最脆弱的环节是……'
        ],
        linkedSourceTitles: [
          'Timbuktu Manuscripts Project resources',
          'Timbuktu and the Songhay Empire'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：说明商路如何同时运送盐、书籍、消息和学术声望。',
          '使用证据：连接驼队、盐、杰内/瓦拉塔/马格里布和师承流动。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'protect-manuscript',
        title: '设计手稿保护方案',
        instruction: '列出手稿面临的三类风险，并提出一种分散风险的方法。',
        evidenceUse: '引用火、潮、战争、沙尘和抄副本选项。',
        deliverable: '一段 120 字以内的证据说明，回答“列出手稿面临的三类风险，并提出一种分散风险的方法。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '方案设计',
        outputTemplate: [
          '目标：写明方案要解决的风险。',
          '做法：列出 2-3 个可执行步骤。',
          '证据依据：说明每一步来自哪些历史线索。',
          '代价：承认方案会损失什么。',
          '检验：说明怎样判断方案有效。'
        ],
        rubric: [
          '方案目标具体，步骤可执行。',
          '每个步骤都能对应历史线索或来源。',
          '能评估代价、风险和可能失败点。',
          '检验标准清楚，不只是愿望表达。'
        ],
        sentenceStarters: [
          '这个方案首先要避免……',
          '第一步可以是……',
          '这样做的历史依据是……',
          '它的代价是……'
        ],
        linkedSourceTitles: [
          'Timbuktu Manuscripts Project resources',
          'Timbuktu and the Songhay Empire',
          'The Meanings of Timbuktu'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：列出手稿面临的三类风险，并提出一种分散风险的方法。',
          '使用证据：引用火、潮、战争、沙尘和抄副本选项。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'read-authority-chain',
        title: '辨认权威链条',
        instruction: '解释为什么“谁教过你”会影响一本书的权威。',
        evidenceUse: '使用师承、允许传授和学者家课堂线索。',
        deliverable: '一段 120 字以内的证据说明，回答“解释为什么“谁教过你”会影响一本书的权威。”',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          'Timbuktu Manuscripts Project resources',
          'Timbuktu and the Songhay Empire'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：解释为什么“谁教过你”会影响一本书的权威。',
          '使用证据：使用师承、允许传授和学者家课堂线索。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'compare-travel-stay',
        title: '比较远行与留下',
        instruction: '评估远行求学和本地守护各自能创造什么历史价值。',
        evidenceUse: '对照决策选项的短期成本和长期影响。',
        deliverable: '一段 120 字以内的证据说明，回答“评估远行求学和本地守护各自能创造什么历史价值。”',
        estimatedMinutes: 16,
        difficulty: '进阶',
        taskType: '比较分析',
        outputTemplate: [
          '比较对象 A：概括其优势与限制。',
          '比较对象 B：概括其优势与限制。',
          '共同背景：指出两者共享的时代条件。',
          '关键差异：说明哪一点最影响选择。',
          '结论：给出有条件的判断。'
        ],
        rubric: [
          '比较维度一致，不把两个对象各说各话。',
          '能说明共同背景和关键差异。',
          '结论有条件，避免绝对化判断。',
          '至少引用两类证据支撑比较。'
        ],
        sentenceStarters: [
          '二者相同的是……',
          '真正的差异在于……',
          '如果把身份限制考虑进去，……',
          '因此我更倾向于……，但条件是……'
        ],
        linkedSourceTitles: [
          'Timbuktu Manuscripts Project resources',
          'Timbuktu and the Songhay Empire',
          'The Meanings of Timbuktu'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：评估远行求学和本地守护各自能创造什么历史价值。',
          '使用证据：对照决策选项的短期成本和长期影响。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
    ],
    keyTerms: [
      { term: '廷巴克图', definition: '位于尼日尔河以北的西非城市，是贸易、学术和手稿传统的重要中心。' },
      { term: '跨撒哈拉贸易', definition: '连接西非、北非和地中海世界的商路网络，运输盐、金、书籍等。' },
      { term: '桑海帝国', definition: '15-16 世纪西非重要帝国，曾控制廷巴克图等贸易与学术城市。' },
      { term: '伊贾扎', definition: '伊斯兰学术传统中的授权或传授许可，体现师承关系。' },
    ],
    compareAngles: [
      { title: '贸易城市 vs. 学术城市', prompt: '为什么廷巴克图的知识生活不能脱离商路来理解？' },
      { title: '保存文本 vs. 移动求学', prompt: '知识传承需要稳定地点，还是需要不断移动的人？' },
    ],
    sourceEvidenceUse: '用西非手稿机构资料确认文本传统，再用区域史研究解释贸易、帝国和学术网络。',
    sources: [
      {
        title: 'Timbuktu Manuscripts Project resources',
        creator: 'University of Cape Town and partners',
        sourceType: 'institution',
        relevance: '介绍廷巴克图手稿类型、保存与研究项目，是理解手稿传统的机构资料入口。',
        url: 'https://www.timbuktumanuscripts.org/',
      },
      {
        title: 'Timbuktu and the Songhay Empire',
        creator: 'John O. Hunwick',
        sourceType: 'scholarship',
        relevance: '提供廷巴克图学者、桑海政治和城市学术生活背景。',
      },
      {
        title: 'The Meanings of Timbuktu',
        creator: 'Shamil Jeppie 与 Souleymane Bachir Diagne 编',
        sourceType: 'scholarship',
        relevance: '从多角度讨论廷巴克图手稿、知识传统和现代保护问题。',
      },
    ],
  },
  {
    id: 'tenochtitlan-market-seller',
    title: '特诺奇蒂特兰集市卖家',
    era: '阿兹特克帝国晚期',
    year: 1519,
    location: '特诺奇蒂特兰-特拉特洛尔科市场',
    region: '墨西哥盆地',
    coordinates: [19.4326, -99.1332],
    identity: '在湖城大市场摆摊的年轻卖家',
    role: '售卖玉米饼、辣椒和小件布料',
    age: 27,
    theme: '市场、贡赋、征服前夜',
    accent: '#78b66d',
    summary:
      '你在特拉特洛尔科市场摆摊。独木舟把玉米、可可、棉布和鲜花带进湖城；市场秩序严密，贡赋网络庞大，而陌生的海岸消息正沿道路传来。',
    atmosphere:
      '清晨的湖面反光刺眼。摊位之间有可可豆、辣椒、火鸡和鲜花的气味，市场官员巡视称量和争端。远处神庙高耸，城里却在谈论东边来的陌生人。',
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '玉米塑造一日节奏',
        text: '玉米饼、豆类、辣椒和南瓜是日常基础。你出售的食物既养活顾客，也把周边村社劳动带进城市。',
      },
      {
        key: 'home',
        label: '居所',
        title: '湖城里的家庭摊位',
        text: '你住在亲族附近，清晨把货带到市场。家庭劳动、摊位关系和邻里互助紧密相连。',
      },
      {
        key: 'work',
        label: '工作',
        title: '交易有规矩',
        text: '价格、称量和争执受市场官员监督。可可豆、棉布和实物交换共同构成复杂交易系统。',
      },
      {
        key: 'education',
        label: '见识',
        title: '市场是信息学校',
        text: '你从行商口中听见各地贡赋、战争和海岸传闻。不会书写并不等于没有政治判断。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '贡赋与战争改变价格',
        text: '征收、干旱、道路安全和军事动员都会影响货源。城市繁荣依赖被征服地区的持续供给。',
      },
      {
        key: 'freedoms',
        label: '机会',
        title: '大市场给小摊位位置',
        text: '巨大的市场让普通人接触远方物品和客户。只要规则稳定，小摊也能嵌入帝国经济。',
      },
    ],
    timeline: [
      { year: '1428', title: '三城同盟形成', text: '特诺奇蒂特兰扩张为墨西哥盆地强权核心。' },
      { year: '15世纪', title: '贡赋网络扩大', text: '被征服地区向帝国中心输送物品与劳力。' },
      { year: '1519', title: '西班牙人抵达中部墨西哥', text: '陌生同盟与军事技术改变政治格局。' },
      { year: '1521', title: '特诺奇蒂特兰陷落', text: '战争、疾病与围城摧毁湖城秩序。' },
    ],
    decision: {
      prompt: '行商说海岸来的陌生人正逼近，有人开始囤积玉米和可可。你要不要跟着囤货涨价？',
      context: '囤货可能赚钱，也可能引来市场官员处罚或邻里怨恨。传闻真假难辨，但价格已经波动。',
      options: [
        {
          id: 'hoard',
          label: '囤货等待涨价',
          stance: '抓住危机利润',
          description: '把今天能买到的玉米和可可尽量收起来。',
          immediate: '摊位货少了，邻居开始怀疑你，若传闻加剧你可能获利。',
          longTerm: '围城或管制来临时，囤货可能变成生存保障，也可能成为被处罚的证据。',
          reflection: '危机市场里，个人理性常和共同体稳定发生冲突。',
        },
        {
          id: 'fair-price',
          label: '维持公平价格',
          stance: '守住市场信用',
          description: '按平常规则售卖，不主动制造恐慌。',
          immediate: '你少赚快钱，但邻里和顾客更信任你。',
          longTerm: '如果秩序维持，信用会带来稳定客户；如果战争失控，信用也无法保护所有人。',
          reflection: '市场秩序不仅靠官员，也靠许多小卖家的重复信用。',
        },
        {
          id: 'diversify',
          label: '换成易携带货物',
          stance: '准备撤退',
          description: '减少鲜食，换成可携带的布料、可可豆和工具。',
          immediate: '你的摊位类型改变，熟客可能流失。',
          longTerm: '若局势恶化，你更容易迁移或交换必需品。',
          reflection: '普通人面对征服前夜的不确定，常通过调整资产形态而不是公开表态来应对。',
        },
      ],
    },
    realHistory:
      '特拉特洛尔科市场是征服前中部墨西哥著名大市场，西班牙征服者记录了其规模和秩序。1519-1521 年的战争、疾病和同盟变化使特诺奇蒂特兰陷落。',
    interpretationNote:
      '本场景依据市场、贡赋和征服前夜的已知背景合成一名卖家视角；囤货选择用于展示危机市场逻辑，不是具体档案事件。',
    missions: [
      {
        id: 'map-market-supply',
        title: '追踪市场货源',
        instruction: '说明玉米、可可、棉布如何从村社和商路进入湖城市场。',
        evidenceUse: '连接独木舟、贡赋网络、周边劳动和市场摊位。',
        deliverable: '一段 120 字以内的证据说明，回答“说明玉米、可可、棉布如何从村社和商路进入湖城市场。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '因果链',
        outputTemplate: [
          '起点：指出最先变化的条件。',
          '中介环节：写出制度、交通、价格或人际网络如何传导。',
          '结果：说明普通人生活或选择受到什么影响。',
          '证据标注：列出至少两条证据。',
          '一句总结：把因果链压缩成可复述结论。'
        ],
        rubric: [
          '因果顺序清楚，能区分起点、中介和结果。',
          '包含制度/环境变化如何传导到个人生活。',
          '证据不是孤立罗列，而是嵌入链条。',
          '结论简洁，可被同伴复述或质疑。'
        ],
        sentenceStarters: [
          '因果链可以从……开始。',
          '这个变化通过……传导到……',
          '对这个身份来说，结果不是抽象的，而是……',
          '最脆弱的环节是……'
        ],
        linkedSourceTitles: [
          'General History of the Things of New Spain (Florentine Codex)',
          'The Conquest of New Spain'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：说明玉米、可可、棉布如何从村社和商路进入湖城市场。',
          '使用证据：连接独木舟、贡赋网络、周边劳动和市场摊位。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'inspect-market-law',
        title: '检查市场规则',
        instruction: '找出价格、称量、争执和官员监督如何维持交易秩序。',
        evidenceUse: '引用交易有规矩、市场官员和公平价格选项。',
        deliverable: '一段 120 字以内的证据说明，回答“找出价格、称量、争执和官员监督如何维持交易秩序。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          'General History of the Things of New Spain (Florentine Codex)',
          'The Conquest of New Spain'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：找出价格、称量、争执和官员监督如何维持交易秩序。',
          '使用证据：引用交易有规矩、市场官员和公平价格选项。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'read-rumor-chain',
        title: '追问传闻来源',
        instruction: '判断海岸陌生人的消息如何改变一个摊主的库存决策。',
        evidenceUse: '用行商消息、1519 时间点和价格波动建立证据链。',
        deliverable: '一段 120 字以内的证据说明，回答“判断海岸陌生人的消息如何改变一个摊主的库存决策。”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '角色判断',
        outputTemplate: [
          '判断：先给出你的结论。',
          '身份处境：说明这个角色拥有什么资源和限制。',
          '证据：引用至少两条场景线索。',
          '权衡：写出收益、风险和不确定性。',
          '后果：预测这个判断对普通人生活的影响。'
        ],
        rubric: [
          '判断符合角色的资源、身份和信息限制。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能说明该判断如何影响普通人的日常选择。'
        ],
        sentenceStarters: [
          '站在这个角色的位置，我会判断……',
          '他/她能动用的资源包括……',
          '最大的风险不是……而是……',
          '所以这个选择更像是……'
        ],
        linkedSourceTitles: [
          'General History of the Things of New Spain (Florentine Codex)',
          'The Conquest of New Spain'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：判断海岸陌生人的消息如何改变一个摊主的库存决策。',
          '使用证据：用行商消息、1519 时间点和价格波动建立证据链。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
      {
        id: 'compare-tribute-market',
        title: '比较贡赋与市场',
        instruction: '解释帝国强制征收和日常交换如何共同支撑城市繁荣。',
        evidenceUse: '对照贡赋网络扩大与大市场给小摊位机会。',
        deliverable: '一段 120 字以内的证据说明，回答“解释帝国强制征收和日常交换如何共同支撑城市繁荣。”',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '比较分析',
        outputTemplate: [
          '比较对象 A：概括其优势与限制。',
          '比较对象 B：概括其优势与限制。',
          '共同背景：指出两者共享的时代条件。',
          '关键差异：说明哪一点最影响选择。',
          '结论：给出有条件的判断。'
        ],
        rubric: [
          '比较维度一致，不把两个对象各说各话。',
          '能说明共同背景和关键差异。',
          '结论有条件，避免绝对化判断。',
          '至少引用两类证据支撑比较。'
        ],
        sentenceStarters: [
          '二者相同的是……',
          '真正的差异在于……',
          '如果把身份限制考虑进去，……',
          '因此我更倾向于……，但条件是……'
        ],
        linkedSourceTitles: [
          'General History of the Things of New Spain (Florentine Codex)',
          'The Conquest of New Spain',
          'Everyday Life in the Aztec World'
        ],
        steps: [
          '重读任务说明，先写下一个核心判断。',
          '回到身份卡、日常切片、时间线或决策结果中寻找至少两条线索。',
          '把线索连成因果或对比关系，再压缩成可复述的结论。',
        ],
        evidenceChecklist: [
          '回应任务：解释帝国强制征收和日常交换如何共同支撑城市繁荣。',
          '使用证据：对照贡赋网络扩大与大市场给小摊位机会。',
          '说明这条证据如何支持你的判断，而不是只摘录情节。',
        ],
        reflectionPrompt: '如果换成同一时代的另一个普通人，你的判断会怎样改变？',
      },
    ],
    keyTerms: [
      { term: '特诺奇蒂特兰', definition: '墨西卡人在湖中建立的都城，阿兹特克帝国政治和宗教核心。' },
      { term: '特拉特洛尔科市场', definition: '特诺奇蒂特兰附近著名大市场，以规模、分区和交易秩序闻名。' },
      { term: '贡赋', definition: '被征服地区向帝国中心提供物品和劳力的制度。' },
      { term: '可可豆货币', definition: '中部美洲交易中常见的价值媒介之一，可与实物交换并存。' },
    ],
    compareAngles: [
      { title: '市场秩序 vs. 帝国征收', prompt: '自愿交易和强制贡赋如何同时出现在同一座城市的繁荣中？' },
      { title: '危机利润 vs. 共同体信用', prompt: '当战争传闻到来，小摊主的“聪明选择”何时会伤害市场整体？' },
    ],
    sourceEvidenceUse: '用征服时期记述把市场规模与秩序作为参照，再用中美洲社会史研究补足贡赋、家庭和普通人视角。',
    sources: [
      {
        title: 'General History of the Things of New Spain (Florentine Codex)',
        creator: 'Bernardino de Sahagún 与纳瓦作者/画师',
        sourceType: 'primary',
        relevance: '提供中部墨西哥社会、市场、物品和日常生活的重要殖民早期材料。',
      },
      {
        title: 'The Conquest of New Spain',
        creator: 'Bernal Díaz del Castillo',
        sourceType: 'primary',
        relevance: '征服者回忆录中描述特拉特洛尔科市场规模和秩序，可作为外来观察材料。',
      },
      {
        title: 'Everyday Life in the Aztec World',
        creator: 'Frances F. Berdan 与 Michael E. Smith',
        sourceType: 'scholarship',
        relevance: '综合阿兹特克社会、市场、家庭和经济生活，适合校准普通人场景。',
      },
    ],
  },
]
