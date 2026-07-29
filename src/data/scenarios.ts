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

export type SceneBeat = {
  timeLabel: string
  title: string
  sensoryDetail: string
  historicalTension: string
  evidenceHook: string
  learnerPrompt: string
  linkedDailyLifeKeys: DailyLifeKey[]
  linkedSourceTitles: string[]
}

export type HistoricalSource = {
  title: string
  creator: string
  sourceType: 'primary' | 'institution' | 'scholarship'
  relevance: string
  excerpt: string
  sourceQuestion: string
  reliabilityNote: string
  perspective: string
  evidenceTags: string[]
  url?: string
}

export type MissionTaskType = '证据说明' | '因果链' | '比较分析' | '观点论证' | '方案设计' | '角色判断' | '史料判断'

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

export type CompareLensKey =
  | 'daily-life'
  | 'institutional-constraints'
  | 'risk-safety'
  | 'knowledge-transmission'
  | 'market-exchange'
  | 'source-credibility'
  | 'historical-choice'

export type CompareLens = {
  key: CompareLensKey
  title: string
  shortLabel: string
  description: string
  prompt: string
  evidenceChecklist: string[]
  outputTemplate: string[]
  rubric: string[]
}

export type AtlasInquiryPath = {
  id: string
  title: string
  subtitle: string
  lensKey: CompareLensKey
  scenarioIds: string[]
  drivingQuestion: string
  whyTheseScenarios: string
  tasks: string[]
  discussionMoves: string[]
  rubric: string[]
}

export type LessonPackMode = 'quick' | 'source' | 'debate'

export type ActivityPackMode = 'warmup' | 'source-lab' | 'roleplay' | 'debate' | 'writing' | 'compare' | 'extension'

export type ActivityPack = {
  id: string
  title: string
  mode: ActivityPackMode
  durationMinutes: number
  audience: string
  prompt: string
  materials: string[]
  steps: string[]
  deliverable: string
  successCriteria: string[]
  linkedSourceTitles: string[]
  linkedSceneBeatTitles: string[]
}

export type LessonPack = {
  inquiryQuestion: string
  quickStart: string[]
  classroomFlow: Record<LessonPackMode, {
    title: string
    steps: string[]
  }>
  checkQuestions: {
    question: string
    answer: string
    teacherNote: string
  }[]
  misconceptions: {
    misconception: string
    correction: string
  }[]
  discussionRoles: {
    role: string
    task: string
  }[]
  exitTickets: string[]
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
  sceneBeats: SceneBeat[]
  dailyLife: DailyLifeSection[]
  timeline: TimelineEvent[]
  decision: {
    prompt: string
    context: string
    options: DecisionOption[]
  }
  realHistory: string
  interpretationNote: string
  lessonPack: LessonPack
  activityPacks: ActivityPack[]
  missions: Mission[]
  keyTerms: KeyTerm[]
  compareAngles: CompareAngle[]
  sourceEvidenceUse: string
  sources: HistoricalSource[]
}

export const compareLenses: CompareLens[] = [
  {
    key: 'daily-life',
    title: '日常生活',
    shortLabel: 'Daily life',
    description: '比较两个身份如何吃饭、居住、工作、学习，并说明日常选择背后的时代条件。',
    prompt: '比较两个历史身份的一天：哪些日常经验相似，哪些差异来自城市结构、家庭责任、职业分工或物质条件？',
    evidenceChecklist: [
      '各引用至少一条饮食、居住、劳动或学习线索',
      '说明一个相似点不是“巧合”，而是由共同需求或环境造成',
      '说明一个差异点背后的时代、地点或身份条件',
      '避免只列清单，要把日常细节连到更大的历史结构',
    ],
    outputTemplate: [
      '身份 A 的日常证据：',
      '身份 B 的日常证据：',
      '最重要的相似点及原因：',
      '最重要的差异点及原因：',
      '一句综合判断：日常生活如何让我们看见时代？',
    ],
    rubric: [
      '能从具体生活细节出发，而不是只复述场景标题',
      '能解释相似与差异的条件',
      '至少使用两类日常证据',
      '结论能回到“普通人如何经历历史变化”',
    ],
  },
  {
    key: 'institutional-constraints',
    title: '制度约束',
    shortLabel: 'Institutions',
    description: '观察法律、城市监管、税赋、战争动员、行会或帝国制度如何限制普通人的行动边界。',
    prompt: '比较两个身份面对的制度限制：谁限制他们，限制通过什么机制发生，他们又有哪些绕行、协商或利用制度的空间？',
    evidenceChecklist: [
      '各找出一个明确制度或权力机构',
      '说明制度限制如何影响职业、迁移、交易、学习或安全',
      '指出普通人仍可行动的空间，而不是把他们写成完全被动',
      '用真实历史对照或时间线验证制度变化',
    ],
    outputTemplate: [
      '身份 A 面对的制度：',
      '身份 B 面对的制度：',
      '制度如何限制行动：',
      '普通人的应对空间：',
      '比较结论：哪一种限制更强，为什么？',
    ],
    rubric: [
      '能准确指出制度主体与作用方式',
      '能区分“限制”与“机会”',
      '比较不止停留在强弱判断，能解释机制',
      '能把个人选择放回历史条件',
    ],
  },
  {
    key: 'risk-safety',
    title: '风险与安全',
    shortLabel: 'Risk',
    description: '比较战争、疾病、贸易失败、政治动荡、火灾、征服或社会秩序变化带来的风险。',
    prompt: '比较两个身份最担心的风险：风险来自自然、市场、制度还是暴力？他们可用哪些资源获得安全感？',
    evidenceChecklist: [
      '各指出一个短期风险和一个长期风险',
      '说明风险来源：市场、制度、战争、环境、社会关系或信息不确定',
      '比较两人可获得的保护资源是否平等',
      '把“安全感”与来源证据或真实历史对照相连',
    ],
    outputTemplate: [
      '身份 A 的风险链：',
      '身份 B 的风险链：',
      '谁能获得保护，保护来自哪里：',
      '谁更脆弱，脆弱来自哪里：',
      '课堂讨论问题：如果你是当时的人，会如何降低风险？',
    ],
    rubric: [
      '能区分短期危机和长期结构性风险',
      '能说明安全资源的来源与不平等',
      '能用至少两条证据支持风险判断',
      '能避免用现代安全观直接套用古代/近代处境',
    ],
  },
  {
    key: 'knowledge-transmission',
    title: '知识传播',
    shortLabel: 'Knowledge',
    description: '比较书籍、手稿、学校、店铺、口耳相传、档案或新闻如何让知识流动。',
    prompt: '比较两个场景中知识如何被保存、复制、传授或垄断：哪些媒介让知识流动，哪些门槛阻止知识流动？',
    evidenceChecklist: [
      '各指出一种知识媒介或学习场所',
      '说明谁能接触知识，谁被排除在外',
      '比较知识传播依赖的技术、制度或市场条件',
      '使用关键术语或来源层说明传播边界',
    ],
    outputTemplate: [
      '身份 A 的知识媒介：',
      '身份 B 的知识媒介：',
      '传播速度与范围比较：',
      '进入知识网络的门槛：',
      '综合判断：知识传播如何改变社会选择？',
    ],
    rubric: [
      '能识别知识传播的具体媒介',
      '能讨论技术、制度和市场的共同作用',
      '能看到知识机会的不平等',
      '能用证据避免泛泛而谈“文化繁荣”',
    ],
  },
  {
    key: 'market-exchange',
    title: '市场与交换',
    shortLabel: 'Market',
    description: '比较商品、货币、信用、贡赋、口岸、集市和跨区域贸易如何连接普通人。',
    prompt: '比较两个身份所处的交换网络：他们依赖哪些商品、信用或中介？市场给他们带来机会，也带来什么限制？',
    evidenceChecklist: [
      '各指出一种商品、服务、货币或交换关系',
      '说明交换网络的空间范围：街市、城市、帝国、海路或洲际',
      '比较市场与制度如何共同塑造交易',
      '指出市场风险：价格、信用、征税、垄断、战争或征服',
    ],
    outputTemplate: [
      '身份 A 的交换网络：',
      '身份 B 的交换网络：',
      '市场带来的机会：',
      '市场带来的限制或风险：',
      '比较结论：市场是自由空间，还是被制度塑形的空间？',
    ],
    rubric: [
      '能用具体商品或交换关系展开分析',
      '能说明市场网络的尺度',
      '能同时看到机会与约束',
      '能把市场与制度、风险或知识传播相连',
    ],
  },
  {
    key: 'source-credibility',
    title: '来源可信度',
    shortLabel: 'Sources',
    description: '比较两个场景的来源类型、视角、可靠边界和缺席声音，训练史料判断。',
    prompt: '比较两个场景的来源层：哪些材料更接近当时人的声音？哪些材料更像后来的解释？这些差异会怎样影响我们的判断？',
    evidenceChecklist: [
      '各选择至少一条来源并标明来源类型',
      '说明来源的视角、可靠边界或缺席声音',
      '区分材料中的事实线索与自己的推论',
      '指出还需要哪类补充材料才能更有把握',
    ],
    outputTemplate: [
      '身份 A 使用的来源及类型：',
      '身份 B 使用的来源及类型：',
      '最可靠的部分：',
      '最需要谨慎的部分：',
      '还想补充的材料：',
    ],
    rubric: [
      '能准确点名来源类型和作者/机构',
      '能说明材料能证明什么、不能证明什么',
      '能区分原始材料、机构材料和研究解释',
      '能提出合理的补充史料需求',
    ],
  },
  {
    key: 'historical-choice',
    title: '历史选择',
    shortLabel: 'Choice',
    description: '比较两个身份的关键选择，分析选择边界、短期结果、长期影响与真实历史。',
    prompt: '比较两个身份的历史岔路口：他们看似可以选择什么，实际上被哪些信息、风险、制度或关系限制？',
    evidenceChecklist: [
      '各概括一个关键选择及其情境',
      '说明每个选择的短期收益与长期代价',
      '比较两人掌握信息与承担风险的差异',
      '用真实历史对照检查“如果是我会怎样”的判断',
    ],
    outputTemplate: [
      '身份 A 的关键选择：',
      '身份 B 的关键选择：',
      '选择边界比较：',
      '短期收益 / 长期代价：',
      '我的历史判断：怎样评价普通人的选择？',
    ],
    rubric: [
      '能把选择放进历史条件，而不是只做道德评判',
      '能比较信息、风险和制度约束',
      '能使用决策结果与真实历史对照',
      '结论能承认不确定性与多种可能',
    ],
  },
]

export const atlasInquiryPaths: AtlasInquiryPath[] = [
  {
    id: 'order-costs-of-prosperity',
    title: '繁荣背后的秩序成本',
    subtitle: '从帝国都城、海关口岸到战时城市，追问“开放”需要谁来承担风险。',
    lensKey: 'institutional-constraints',
    scenarioIds: ['tang-changan-merchant', 'qing-guangzhou-comprador', 'wwii-london-civilian'],
    drivingQuestion: '普通人看见的繁荣或安全，究竟依赖哪些制度安排，又把哪些代价转嫁给了他们？',
    whyTheseScenarios:
      '长安商人、广州买办助手和伦敦居民都生活在高度组织化的城市秩序中：贸易、海关、军政动员看似提供机会或保护，也同时限制行动边界。',
    tasks: [
      '为每个场景标出一个“制度提供的机会”和一个“制度制造的限制”。',
      '比较三人是否能绕开制度：谁能协商，谁只能服从，谁被迫承担执行成本？',
      '用一段 180 字综合判断说明：制度是保护网、交易平台，还是风险放大器？',
    ],
    discussionMoves: [
      '先让学生用便利贴写下“谁在制定规则”，再按官府、市场、战争三类重排证据。',
      '追问每条规则的受益者与承担者是否相同，避免只把制度写成背景。',
      '要求发言者补一句“如果制度突然失灵，普通人的第一反应会是什么”。',
    ],
    rubric: [
      '能准确点名制度主体、执行机制与普通人的行动边界',
      '能比较机会与限制如何同时出现，而不是只做单向评价',
      '至少使用三种场景证据，并能说明证据与判断之间的关系',
      '结论能承认制度稳定、市场机会与个人风险之间的张力',
    ],
  },
  {
    id: 'knowledge-through-paper-mentorship-market',
    title: '知识如何穿过纸张、师承与市场',
    subtitle: '把抄写员、手稿学生和江南读书人放进同一条知识传播链。',
    lensKey: 'knowledge-transmission',
    scenarioIds: ['abbasid-baghdad-scribe', 'timbuktu-manuscript-student', 'ming-jiangnan-scholar'],
    drivingQuestion: '知识从哪里来、由谁复制、谁能进入网络，谁又被成本、身份或权威挡在门外？',
    whyTheseScenarios:
      '巴格达纸坊、廷巴克图手稿课堂和江南科举社会都围绕文字、复制与师承展开，但知识的入口分别受赞助、长途网络、考试名声和商业出版塑形。',
    tasks: [
      '绘制三站知识流动图：媒介、传授者、进入门槛、被排除的人。',
      '各选择一条来源或关键术语，判断它能证明“知识传播”中的哪一环。',
      '写一段比较：技术进步是否一定扩大知识公平？必须用两个反例或限制说明。',
    ],
    discussionMoves: [
      '让学生先按“纸张/手稿/考试/师承/市场”给证据贴标签。',
      '追问“复制得更快”与“理解得更深”是否是一回事。',
      '安排一名学生专门寻找缺席声音：女性、贫民、外来者或非精英学习者。',
    ],
    rubric: [
      '能识别知识媒介、传播场所和权威结构',
      '能比较技术、市场、制度和师承的共同作用',
      '能说明知识机会的不平等及其证据来源',
      '能避免把文化繁荣简单等同于人人可学',
    ],
  },
  {
    id: 'markets-not-free-vacuum',
    title: '市场不是自由的真空',
    subtitle: '从长安西市、汴京茶铺、特诺奇蒂特兰集市看交易规则如何塑造日常。',
    lensKey: 'market-exchange',
    scenarioIds: ['tang-changan-merchant', 'song-bianjing-apprentice', 'tenochtitlan-market-seller'],
    drivingQuestion: '市场给普通人带来哪些选择空间，又被税赋、监管、信用、供应和征服威胁怎样塑形？',
    whyTheseScenarios:
      '三个场景都以城市市场为核心，但交换网络的尺度不同：丝路商品、茶铺劳作与湖城集市分别显示跨区域贸易、城市服务业和帝国贡赋秩序。',
    tasks: [
      '为每个场景列出一种商品或服务、一条交换规则、一项市场风险。',
      '比较“信用”“监管”“供应”三类因素中哪一项最能改变普通人的选择。',
      '制作一个两列表：市场带来的上升机会 / 市场暴露出的脆弱性。',
    ],
    discussionMoves: [
      '用“如果价格突然翻倍”作为情境追问，迫使学生连接供给、制度与风险。',
      '要求每组指出一个非金钱交换因素，如名声、许可、贡赋、口碑或人情。',
      '把“市场自由吗”改写成“谁能自由，在哪个环节自由”。',
    ],
    rubric: [
      '能用具体商品、服务或交换关系展开分析',
      '能说明市场网络的空间尺度和制度边界',
      '能同时讨论机会、监管与风险',
      '比较结论能超越“古代也有市场”的简单发现',
    ],
  },
  {
    id: 'crisis-news-reaches-ordinary-people',
    title: '危机消息抵达普通人的那一刻',
    subtitle: '把边境传闻、口岸文书、空袭警报和征服流言连成风险传播路径。',
    lensKey: 'risk-safety',
    scenarioIds: ['tang-changan-merchant', 'qing-guangzhou-comprador', 'wwii-london-civilian', 'tenochtitlan-market-seller'],
    drivingQuestion: '当不确定消息变成现实风险时，普通人依靠什么判断、保护自己或继续生活？',
    whyTheseScenarios:
      '四个场景都让远方危机进入日常：边境军情、鸦片与海关压力、空袭警报和西班牙征服流言分别展示信息不完整时的风险决策。',
    tasks: [
      '给每个场景写一条“消息—判断—行动—后果”的风险链。',
      '区分短期危险与长期结构性风险，并说明哪一种更难被普通人看见。',
      '选择两人进入 Compare Lab，用“风险与安全”镜头生成一份小组作业。',
    ],
    discussionMoves: [
      '先不公布真实历史，让学生只凭场景证据判断风险，再回看真实历史对照。',
      '追问“安全资源”来自哪里：家庭、邻里、官府、市场、宗教、专业知识还是运气。',
      '鼓励学生说出仍不确定的信息，而不是假装拥有上帝视角。',
    ],
    rubric: [
      '能区分传闻、可验证证据和后来才知道的历史结果',
      '能解释风险来源及普通人的保护资源',
      '能比较短期危机与长期结构性脆弱',
      '能在判断中保留不确定性和证据边界',
    ],
  },
  {
    id: 'who-speaks-for-history',
    title: '谁在替历史发声',
    subtitle: '用来源可信度镜头检查场景叙事的证据边界和缺席声音。',
    lensKey: 'source-credibility',
    scenarioIds: ['song-bianjing-apprentice', 'ming-jiangnan-scholar', 'timbuktu-manuscript-student', 'wwii-london-civilian'],
    drivingQuestion: '我们如何知道这些普通人的生活？哪些材料接近当时声音，哪些只是后来的解释？',
    whyTheseScenarios:
      '这些场景的来源层混合城市记录、文人材料、手稿传统、战时档案与研究解释，适合训练学生判断“能证明什么”和“看不见什么”。',
    tasks: [
      '每个场景挑一条来源，标注类型、视角、可靠部分和需要谨慎的部分。',
      '写出两个缺席声音，并说明需要哪类补充材料才能接近它们。',
      '把一个场景叙事拆成“来源事实”“合理推论”“课堂想象”三栏。',
    ],
    discussionMoves: [
      '让学生先为来源投票：最接近当时人声音 / 最适合解释结构 / 最需要谨慎。',
      '每次学生提出判断时，追问“这句话是来源说的，还是我们推出来的”。',
      '安排反方专门寻找过度概括、现代价值套用或单一来源依赖。',
    ],
    rubric: [
      '能准确区分原始材料、机构材料和研究解释',
      '能说明来源能证明什么、不能证明什么',
      '能主动寻找缺席声音和补充材料需求',
      '能把史料判断用于修正叙事，而不是只贴来源标签',
    ],
  },
]

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
    sceneBeats: [
      {
        timeLabel: '鼓声开市',
        title: '西市门开，香料先到',
        sensoryDetail: '鼓声落下后，胡饼热气、皮革潮味和胡椒辛香一起涌进街巷。',
        historicalTension: '开放的都市市场并不等于自由无边，开市、坊门和市署规则同时划定行动范围。',
        evidenceHook: '把坊市制、市场监管和外来商品放在同一张证据卡上，看繁荣如何被制度组织。',
        learnerPrompt: '哪一个气味或声音最能证明长安连接远方？它又被哪条规则限制？',
        linkedDailyLifeKeys: ['food', 'home', 'work'],
        linkedSourceTitles: ['《唐六典》', "The Golden Peaches of Samarkand: A Study of T'ang Exotics"],
      },
      {
        timeLabel: '午后议价',
        title: '账本上的道路消息',
        sensoryDetail: '柜台上铜钱碰响，粟特客人的口音夹着河西走廊的传闻。',
        historicalTension: '价格看似由买卖双方决定，背后却受边境安全、商队信用和官府税令牵动。',
        evidenceHook: '用“价格取决于道路是否安全”和丝路研究解释一次议价中的风险传导。',
        learnerPrompt: '如果边境传闻属实，最先变化的是库存、信用还是价格？为什么？',
        linkedDailyLifeKeys: ['work', 'education', 'risks'],
        linkedSourceTitles: ['The Silk Road: A New History', '《唐六典》'],
      },
      {
        timeLabel: '日暮坊门',
        title: '繁华被重新关进方格',
        sensoryDetail: '暮鼓催促人群散去，白天喧闹的街面被坊墙和门禁压低声音。',
        historicalTension: '世界城市的开放感与夜禁、坊墙和治安秩序并存。',
        evidenceHook: '对照居所切片和制度来源，区分城市开放体验与实际管理机制。',
        learnerPrompt: '夜禁是保护商人，还是限制商人？请用一条证据说明。',
        linkedDailyLifeKeys: ['home', 'risks', 'freedoms'],
        linkedSourceTitles: ['《唐六典》'],
      },
      {
        timeLabel: '夜里听闻',
        title: '繁荣时代的风险预感',
        sensoryDetail: '油灯旁，边镇军情从酒肆传到铺后，账页上的数字忽然显得不稳。',
        historicalTension: '小商人的选择押注于自己无法控制的帝国道路和军事财政。',
        evidenceHook: '把安史之乱时间线、赊货选择和丝路节点研究连成一条后见与当事人不确定性的证据链。',
        learnerPrompt: '在不知道 755 年结局的情况下，你会怎样评价“扩大赊货”？',
        linkedDailyLifeKeys: ['work', 'risks', 'freedoms'],
        linkedSourceTitles: ['The Silk Road: A New History'],
      },
    ],
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
    lessonPack: {
      inquiryQuestion: '长安商人的“开放世界”到底依赖哪些制度与道路条件？',
      quickStart: [
        '30 秒定位：742 年、长安西市、香料与织物铺。',
        '圈出一个机会线索和一个风险线索。',
        '用一句话预测：赊货扩大生意会卡在哪里？',
      ],
      classroomFlow: {
        quick: {
          title: '10 分钟快速进入',
          steps: ['读身份卡与决策题', '两人互找“机会/风险”证据', '全班投票选一个经营策略'],
        },
        source: {
          title: '20 分钟来源研读',
          steps: ['比较《唐六典》与丝路研究的视角', '标出制度事实与商业推论', '写一句有边界的繁荣判断'],
        },
        debate: {
          title: '25 分钟经营辩论',
          steps: ['三组分别支持扩张、分散、官府采购', '每组必须引用一条来源和一条日常证据', '结尾说明最大不确定性'],
        },
      },
      checkQuestions: [
        {
          question: '为什么“熟人商队可信”仍不足以保证赊货安全？',
          answer: '因为信用还依赖道路安全、边境局势、官府监管和市场需求。',
          teacherNote: '引导学生把个人信任和跨区域秩序分开。',
        },
        {
          question: '《唐六典》更适合证明什么？',
          answer: '适合证明市场监管和官署框架，不直接证明小商人心理。',
          teacherNote: '强调规范性制度文本与街头执行之间有距离。',
        },
      ],
      misconceptions: [
        { misconception: '唐代长安开放就等于商人完全自由。', correction: '开放与坊市、夜禁、税令和官府采购等管制同时存在。' },
        { misconception: '丝路贸易总是稳定发财。', correction: '商路收益依赖地方秩序，动荡会把库存变成债务。' },
      ],
      discussionRoles: [
        { role: '商人合伙人', task: '主张最稳妥的库存策略。' },
        { role: '市署官吏', task: '指出市场监管会改变哪些选择。' },
        { role: '商队代表', task: '解释远途贸易为何仍值得冒险。' },
      ],
      exitTickets: [
        '写一句：长安繁荣最依赖的条件是____，证据是____。',
        '指出一个来源看不见的普通人声音。',
      ],
    },
    activityPacks: [
      {
        id: 'changan-market-signal-sprint',
        title: '三分钟市场信号热身',
        mode: 'warmup',
        durationMinutes: 8,
        audience: '个人快速进入或全班开场',
        prompt: '只用一个声音、一个气味和一条规则，判断长安西市的开放如何被制度组织。',
        materials: ['身份卡摘要', 'Scene Reader：西市门开，香料先到', '日常切片：工作、风险、机会'],
        steps: ['圈出能证明远方连接的感官线索。', '再圈出一条限制市场自由的制度线索。', '用“开放但是____”写出一句历史判断。'],
        deliverable: '一张 3 行 warmup 卡：感官证据 / 制度证据 / 一句判断。',
        successCriteria: ['至少引用一个具体感官细节。', '能把开放与坊市、市署或夜禁联系起来。', '判断句包含张力，而不只是赞美繁荣。'],
        linkedSourceTitles: ['《唐六典》', "The Golden Peaches of Samarkand: A Study of T'ang Exotics"],
        linkedSceneBeatTitles: ['西市门开，香料先到', '繁华被重新关进方格'],
      },
      {
        id: 'changan-credit-source-lab',
        title: '赊货信用 Source Lab',
        mode: 'source-lab',
        durationMinutes: 18,
        audience: '小组史料研读',
        prompt: '判断熟人商队的信用能否抵消道路、税令和边境不确定性。',
        materials: ['《唐六典》来源卡', 'The Silk Road: A New History 来源卡', '决策题三项选择'],
        steps: ['把“人情信用”和“道路秩序”分成两列。', '为每列各找一条来源或 scene beat 证据。', '写出一条仍不能被来源直接证明的推论。'],
        deliverable: '一张信用审计表，附 80 字以内的风险判断。',
        successCriteria: ['能区分制度文本、研究解释和角色推论。', '至少使用两条不同类型证据。', '结论承认当事人信息不完整。'],
        linkedSourceTitles: ['《唐六典》', 'The Silk Road: A New History'],
        linkedSceneBeatTitles: ['账本上的道路消息', '繁荣时代的风险预感'],
      },
      {
        id: 'changan-expansion-debate',
        title: '合伙人经营辩论',
        mode: 'debate',
        durationMinutes: 24,
        audience: '三组课堂辩论',
        prompt: '扩张、分散、依附官府三种方案，哪一种最符合 742 年小商人的处境？',
        materials: ['决策选项卡', '时间线：742 / 755', '关联来源标题 chips'],
        steps: ['三组分别抽取一个经营方案。', '每组准备一条短期收益证据和一条长期风险证据。', '反驳时必须指出对方忽略的制度或道路条件。'],
        deliverable: '一份小组立场陈述：主张、两条证据、一个不确定性。',
        successCriteria: ['能站在角色资源和限制中发言。', '能同时处理利润、信用和制度风险。', '反驳基于证据而非现代偏好。'],
        linkedSourceTitles: ['《唐六典》', 'The Silk Road: A New History'],
        linkedSceneBeatTitles: ['账本上的道路消息', '繁荣时代的风险预感'],
      },
    ],
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
        instruction: '判断“长安开放世界”这组来源能证明什么，哪些普通人声音仍然缺席。',
        evidenceUse: '对照制度文本、外来物品研究和丝路研究，区分可证明事实与课堂推论。',
        deliverable: '一张 120 字以内的史料判断卡，说明“开放世界”证据的可靠边界。',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '史料判断',
        outputTemplate: [
          '来源组合：列出你使用的两类来源。',
          '可证明：写出材料能较稳妥支持的事实。',
          '需推论：标出从材料到小商人处境的推理。',
          '缺席声音：指出没有直接出现的人群或经验。',
          '边界结论：说明这个叙事该如何谨慎使用。',
        ],
        rubric: [
          '明确引用至少一条来源层材料。',
          '区分事实证据与合理推论。',
          '指出来源视角、偏见或缺席声音。',
          '能解释证据不足时为何仍需保留判断。',
        ],
        sentenceStarters: [
          '这组来源最能证明的是……',
          '从……推到小商人的处境，中间还需要……',
          '材料里缺席的声音是……',
          '因此我会把这个结论限制在……',
        ],
        linkedSourceTitles: [
          '《唐六典》',
          'The Silk Road: A New History'
        ],
        steps: [
          '先选择两条关联来源，阅读其视角和可靠性边界。',
          '把“可直接支持的事实”和“课堂叙事推论”分开记录。',
          '找出一个缺席声音，再写出有边界的结论。',
        ],
        evidenceChecklist: [
          '至少点名一条来源标题或来源类型。',
          '写明一条材料能证明的事实和一条需要推论的判断。',
          '说明缺席声音或可靠性限制。',
        ],
        reflectionPrompt: '如果只能保留一条来源，你会牺牲哪部分解释？',
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
        excerpt: '政书呈现市场官署、职掌和监管框架，可把西市想象为被制度组织的空间。',
        sourceQuestion: '它能证明市场监管存在，不能直接证明某个小商人的真实心理。',
        reliabilityNote: '官修制度文本偏向规范设计，未必等同于街头执行状况。',
        perspective: '朝廷与官僚制度视角',
        evidenceTags: ['坊市制度', '市场监管', '国家能力'],
      },
      {
        title: "The Golden Peaches of Samarkand: A Study of T'ang Exotics",
        creator: 'Edward H. Schafer',
        sourceType: 'scholarship',
        relevance: '梳理唐代外来物品、香料和异域风尚，支撑长安国际化日常氛围。',
        excerpt: '研究通过外来物品复原唐代异域风尚，提示香料和奇货如何进入都市消费。',
        sourceQuestion: '外来商品能说明开放性，但是否代表多数市民日常？',
        reliabilityNote: '物质文化研究善于呈现上层和都市消费，普通小商户细节需谨慎外推。',
        perspective: '现代物质文化史视角',
        evidenceTags: ['外来商品', '城市消费', '文化交流'],
      },
      {
        title: 'The Silk Road: A New History',
        creator: 'Valerie Hansen',
        sourceType: 'scholarship',
        relevance: '以出土文书和路线节点讨论丝路贸易网络，帮助界定商队与道路风险的历史边界。',
        excerpt: '研究强调丝路由多个节点和文书网络构成，贸易安全依赖地方秩序。',
        sourceQuestion: '商路材料能支持哪些关于风险传导的判断？',
        reliabilityNote: '出土文书多来自特定地点，不能覆盖所有路线和年份。',
        perspective: '现代丝路史研究视角',
        evidenceTags: ['商路网络', '出土文书', '风险传导'],
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
    sceneBeats: [
      {
        timeLabel: '天未亮',
        title: '灶火点起城市的一天',
        sensoryDetail: '茶炉冒白汽，炊饼香从门缝钻进来，街上车轮已经压过湿土。',
        historicalTension: '汴京的商业活力给学徒饭碗，也让他依赖一座脆弱城市的连续运转。',
        evidenceHook: '用街市饮食与城市服务业来源校准茶铺日常，不把繁华写成抽象标签。',
        learnerPrompt: '茶铺学徒从清晨劳动中获得了哪些机会，又承担了哪些低位成本？',
        linkedDailyLifeKeys: ['food', 'home', 'work'],
        linkedSourceTitles: ['《东京梦华录》', 'Daily Life in China on the Eve of the Mongol Invasion, 1250-1276'],
      },
      {
        timeLabel: '午间客满',
        title: '热茶和传闻一起续杯',
        sensoryDetail: '茶盏碰桌，客人压低声音谈物价、边境和朝廷新消息。',
        historicalTension: '信息流动扩大了普通人的世界，却不保证他们能判断真假或及时行动。',
        evidenceHook: '把“茶铺是信息节点”与危机逼近时间线相连，区分传闻、信号和后见事实。',
        learnerPrompt: '哪些客人话语能算证据，哪些只能算待核实传闻？',
        linkedDailyLifeKeys: ['work', 'education', 'risks'],
        linkedSourceTitles: ['《东京梦华录》', 'The Cambridge History of China, Volume 5: The Sung Dynasty and Its Precursors'],
      },
      {
        timeLabel: '黄昏收摊',
        title: '积蓄轻得带不走城市',
        sensoryDetail: '你把零散铜钱倒进布袋，店后窄屋里还留着熟客的笑声。',
        historicalTension: '迁徙看似是避险选择，却意味着放弃人脉、职业位置和日常保障。',
        evidenceHook: '把居所、工作和南下成本任务结合，说明安全选择也有社会成本。',
        learnerPrompt: '如果只看路费，会漏掉离开汴京的哪两种成本？',
        linkedDailyLifeKeys: ['home', 'work', 'freedoms'],
        linkedSourceTitles: ['Daily Life in China on the Eve of the Mongol Invasion, 1250-1276'],
      },
      {
        timeLabel: '夜深风冷',
        title: '繁华城市的迟疑',
        sensoryDetail: '更鼓过后，远处仍有笑声，北方风声却像从瓦缝里钻进来。',
        historicalTension: '灾变前夜，多数普通人被家计、侥幸和信息不完整留在原地。',
        evidenceHook: '用靖康之变真实历史对照检查“为什么不立刻逃”的判断。',
        learnerPrompt: '你能在不责怪学徒“短视”的情况下解释留下的理由吗？',
        linkedDailyLifeKeys: ['risks', 'freedoms', 'education'],
        linkedSourceTitles: ['The Cambridge History of China, Volume 5: The Sung Dynasty and Its Precursors'],
      },
    ],
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
    lessonPack: {
      inquiryQuestion: '汴京的繁华为什么不能自动转化为普通人的安全？',
      quickStart: [
        '定位 1126 年前夜：茶铺、传闻、南下成本。',
        '找出一条繁华证据和一条脆弱证据。',
        '判断学徒该先攒钱、留守还是求助熟客。',
      ],
      classroomFlow: {
        quick: {
          title: '10 分钟城市脆弱性',
          steps: ['浏览日常切片', '给每条传闻打“可信/待查”标记', '写一句风险判断'],
        },
        source: {
          title: '20 分钟城市材料读法',
          steps: ['用《东京梦华录》找市民生活细节', '用靖康背景解释材料的时间边界', '区分繁华描写和危机预测'],
        },
        debate: {
          title: '25 分钟去留辩论',
          steps: ['留守组、南下组、观望组准备证据', '每组说明钱、人脉与消息限制', '全班评估哪种选择最像普通人'],
        },
      },
      checkQuestions: [
        {
          question: '茶铺为什么是信息节点？',
          answer: '客人流动带来官场、商旅和街坊传闻，学徒可听到但难核实。',
          teacherNote: '提醒学生传闻是线索，不等同于事实。',
        },
        {
          question: '靖康之变如何改变对繁华城市的理解？',
          answer: '它显示商业活力无法单独抵御军事和政治崩溃。',
          teacherNote: '把日常繁荣与国家防御结构连接。',
        },
      ],
      misconceptions: [
        { misconception: '城市越繁华，普通人越安全。', correction: '繁华需要城防、财政和秩序支撑，危机中反而暴露脆弱性。' },
        { misconception: '学徒只要听到传闻就能做正确选择。', correction: '信息不完整，迁移还受钱、亲友和身份限制。' },
      ],
      discussionRoles: [
        { role: '茶铺学徒', task: '说明自己的钱和消息限制。' },
        { role: '熟客商人', task: '判断哪些传闻值得相信。' },
        { role: '城中家人', task: '提出留守的现实理由。' },
      ],
      exitTickets: [
        '用“繁华但是____”完成一句历史判断。',
        '写出一条你仍无法确认的传闻。',
      ],
    },
    activityPacks: [
      {
        id: 'bianjing-rumor-triage',
        title: '茶铺传闻分诊',
        mode: 'warmup',
        durationMinutes: 10,
        audience: '两人一组快速判断',
        prompt: '把茶铺里听到的消息分成物价、边境、朝廷三类，并给出可信度标记。',
        materials: ['Scene Reader：热茶和传闻一起续杯', '时间线：危机逼近 / 靖康之变', '日常切片：教育、风险'],
        steps: ['从场景中摘出三条“听来的消息”。', '标为“可用证据”“待核实传闻”或“后见历史”。', '说明哪一类最会影响学徒的去留判断。'],
        deliverable: '一张传闻分诊表，含三类消息和可信度标记。',
        successCriteria: ['能区分传闻、来源线索和真实历史对照。', '能解释信息如何影响普通人行动。', '不会把后来的结局直接塞进当事人头脑。'],
        linkedSourceTitles: ['《东京梦华录》', 'The Cambridge History of China, Volume 5: The Sung Dynasty and Its Precursors'],
        linkedSceneBeatTitles: ['热茶和传闻一起续杯', '繁华城市的迟疑'],
      },
      {
        id: 'bianjing-go-or-stay-roleplay',
        title: '去留圆桌 Roleplay',
        mode: 'roleplay',
        durationMinutes: 22,
        audience: '四人角色扮演',
        prompt: '学徒、师傅、熟客商人和南方亲戚分别说明为什么留下、离开或两手准备。',
        materials: ['决策选项卡', 'Scene Reader：积蓄轻得带不走城市', 'discussion roles'],
        steps: ['每人抽一个角色并写出自己最在意的资源。', '轮流用 45 秒陈述建议。', '全组记录每个建议的代价和信息缺口。'],
        deliverable: '一份去留圆桌记录：四个角色建议 + 最终折中方案。',
        successCriteria: ['发言符合角色身份和资源限制。', '能把迁徙成本写成钱、人脉、职业三类。', '最终方案说明仍存在的不确定性。'],
        linkedSourceTitles: ['Daily Life in China on the Eve of the Mongol Invasion, 1250-1276'],
        linkedSceneBeatTitles: ['积蓄轻得带不走城市', '繁华城市的迟疑'],
      },
      {
        id: 'bianjing-fragility-writing',
        title: '繁华但是脆弱短论',
        mode: 'writing',
        durationMinutes: 16,
        audience: '个人写作或课后提交',
        prompt: '用“繁华但是脆弱”解释汴京为什么不能自动给学徒安全感。',
        materials: ['日常切片：工作、风险、机会', '《东京梦华录》来源卡', '真实历史对照'],
        steps: ['先写一句核心观点。', '选择一条繁华证据和一条脆弱证据。', '补一句来源边界：材料能证明什么，不能证明什么。'],
        deliverable: '一段 120-160 字短论。',
        successCriteria: ['有明确观点而非情节复述。', '至少引用两条场景或来源证据。', '能说明繁华与安全之间的断裂。'],
        linkedSourceTitles: ['《东京梦华录》', 'The Cambridge History of China, Volume 5: The Sung Dynasty and Its Precursors'],
        linkedSceneBeatTitles: ['灶火点起城市的一天', '繁华城市的迟疑'],
      },
    ],
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
        instruction: '判断《东京梦华录》和宋史研究能证明哪些城市繁华，哪些战争恐惧属于后见推论。',
        evidenceUse: '把追忆性城市描写、宏观宋史研究和学徒视角的叙事补缀分开。',
        deliverable: '一张 120 字以内的史料判断卡，说明汴京繁华证据的可用范围。',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '史料判断',
        outputTemplate: [
          '来源组合：列出你使用的两类来源。',
          '可证明：写出材料能较稳妥支持的事实。',
          '需推论：标出从材料到茶铺学徒处境的推理。',
          '缺席声音：指出没有直接出现的人群或经验。',
          '边界结论：说明这个叙事该如何谨慎使用。',
        ],
        rubric: [
          '明确引用至少一条来源层材料。',
          '区分事实证据与合理推论。',
          '指出来源视角、偏见或缺席声音。',
          '能解释证据不足时为何仍需保留判断。',
        ],
        sentenceStarters: [
          '这组来源最能证明的是……',
          '从……推到茶铺学徒的处境，中间还需要……',
          '材料里缺席的声音是……',
          '因此我会把这个结论限制在……',
        ],
        linkedSourceTitles: [
          '《东京梦华录》',
          'The Cambridge History of China, Volume 5: The Sung Dynasty and Its Precursors'
        ],
        steps: [
          '先选择两条关联来源，阅读其视角和可靠性边界。',
          '把“可直接支持的事实”和“课堂叙事推论”分开记录。',
          '找出一个缺席声音，再写出有边界的结论。',
        ],
        evidenceChecklist: [
          '至少点名一条来源标题或来源类型。',
          '写明一条材料能证明的事实和一条需要推论的判断。',
          '说明缺席声音或可靠性限制。',
        ],
        reflectionPrompt: '如果《东京梦华录》带有怀旧滤镜，你会怎样调整对“繁华”的判断？',
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
        excerpt: '作者回忆东京街市、饮食、节令和娱乐空间，呈现繁华城市的日常肌理。',
        sourceQuestion: '这类追忆能证明城市生活丰富，但能否代表底层学徒？',
        reliabilityNote: '成书带有南渡后的怀旧滤镜，选择性描写繁华场景。',
        perspective: '宋人追忆与都市观察视角',
        evidenceTags: ['城市日常', '街市饮食', '怀旧叙事'],
      },
      {
        title: 'The Cambridge History of China, Volume 5: The Sung Dynasty and Its Precursors',
        creator: 'Denis Twitchett 与 Paul Jakov Smith 编',
        sourceType: 'scholarship',
        relevance: '提供宋代政治、经济和社会结构综述，帮助把城市繁荣放入北宋末局势中。',
        excerpt: '综述把宋代政治、经济和军事局势放在长时段结构中。',
        sourceQuestion: '宏观研究如何帮助解释茶铺传闻背后的危机？',
        reliabilityNote: '综合卷提供框架但不替代具体个案史料。',
        perspective: '现代学术综合视角',
        evidenceTags: ['宋代结构', '政治危机', '宏观背景'],
      },
      {
        title: 'Daily Life in China on the Eve of the Mongol Invasion, 1250-1276',
        creator: 'Jacques Gernet',
        sourceType: 'scholarship',
        relevance: '虽聚焦南宋杭州，但对宋代城市商业、茶酒铺与市民生活有可比参考价值。',
        excerpt: '研究以城市生活为中心，描写店铺、服务业和市民消费的可比场景。',
        sourceQuestion: '南宋杭州材料能怎样、又不能怎样类比北宋汴京？',
        reliabilityNote: '时空对象不同，适合作参照而非直接证据。',
        perspective: '现代社会生活史视角',
        evidenceTags: ['城市服务业', '日常生活', '类比边界'],
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
    sceneBeats: [
      {
        timeLabel: '梅雨晨读',
        title: '书页和账册都受潮',
        sensoryDetail: '雨水打在窗纸上，四书注本旁的商号账册边角微微卷起。',
        historicalTension: '士人理想要求守住科举正途，江南商业化却把读书能力推向市场。',
        evidenceHook: '把书房连着账房与晚明商业文化研究并读，观察士商边界如何变软。',
        learnerPrompt: '这张案头同时出现经典和账册，说明身份冲突还是身份扩展？',
        linkedDailyLifeKeys: ['home', 'education', 'work'],
        linkedSourceTitles: ['The Confusions of Pleasure: Commerce and Culture in Ming China'],
      },
      {
        timeLabel: '午后塾课',
        title: '蒙童背书，家计催促',
        sensoryDetail: '孩子拖长声背诵，你却听见河埠头货船靠岸的橹声。',
        historicalTension: '科举提供上升想象，但考试成本和录取有限让希望变成长期压力。',
        evidenceHook: '用教育切片、赴考成本任务和制度史来源区分身份收益与家庭成本。',
        learnerPrompt: '继续备考最有价值的收益是什么？最难承受的代价又是什么？',
        linkedDailyLifeKeys: ['food', 'work', 'education', 'risks'],
        linkedSourceTitles: ['1587, A Year of No Significance: The Ming Dynasty in Decline'],
      },
      {
        timeLabel: '傍晚河埠',
        title: '海风把远方白银吹进内陆',
        sensoryDetail: '湿木板、鱼腥和货船绳索味混在一起，商号伙计催你核对银数。',
        historicalTension: '全球贸易的变化不直接决定个人命运，却通过账务、出版和地方市场改变选择空间。',
        evidenceHook: '把隆庆开关时间线与“功名之外也有市场”连成间接因果链。',
        learnerPrompt: '海贸政策怎样穿过商号，最后抵达一个读书人的职业选择？',
        linkedDailyLifeKeys: ['work', 'freedoms', 'risks'],
        linkedSourceTitles: ['《明实录》隆庆朝相关记载', 'The Confusions of Pleasure: Commerce and Culture in Ming China'],
      },
      {
        timeLabel: '夜里誊账',
        title: '半工半读的疲惫折中',
        sensoryDetail: '灯油将尽，你一边誊账一边默背策论，墨迹和困意一起加深。',
        historicalTension: '普通人的历史选择常不是二选一，而是在制度期待和现实压力之间拼接生活。',
        evidenceHook: '用半工半读选项和名声风险任务解释“折中路线”的历史合理性。',
        learnerPrompt: '折中是软弱妥协，还是适应时代变化的策略？请给出证据。',
        linkedDailyLifeKeys: ['education', 'work', 'risks', 'freedoms'],
        linkedSourceTitles: ['The Confusions of Pleasure: Commerce and Culture in Ming China', '1587, A Year of No Significance: The Ming Dynasty in Decline'],
      },
    ],
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
    lessonPack: {
      inquiryQuestion: '明代江南读书人的身份为何会在科举、商业与海贸之间摇摆？',
      quickStart: [
        '定位江南商业化与科举压力。',
        '选出一个“读书人”证据和一个“市场人”证据。',
        '预测参与商业会带来哪种名声风险。',
      ],
      classroomFlow: {
        quick: {
          title: '10 分钟身份拼图',
          steps: ['读角色与日常', '把线索贴到“科举/商业/海贸”三栏', '写一条复合身份判断'],
        },
        source: {
          title: '20 分钟政策与社会',
          steps: ['用政策时间点固定隆庆开关背景', '用商业文化研究解释士商交叠', '标出从宏观到个人的推论'],
        },
        debate: {
          title: '25 分钟名声风险辩论',
          steps: ['科举优先组与经商兼顾组对辩', '每组必须处理家庭责任', '结尾承认最难证明的一点'],
        },
      },
      checkQuestions: [
        {
          question: '为什么读书人与商业不是完全隔绝？',
          answer: '江南商业、出版和宗族经济让读书人可能参与账务、书籍和贸易网络。',
          teacherNote: '避免把“四民”理想秩序当成全部现实。',
        },
        {
          question: '白银流入能直接证明某个读书人经商吗？',
          answer: '不能，只能说明区域经济条件，需要日常和身份线索补足。',
          teacherNote: '训练宏观证据到个体叙事的边界意识。',
        },
      ],
      misconceptions: [
        { misconception: '士人只能读书应考，不能接触市场。', correction: '现实中地方士人常与出版、田产、账务和商业网络相连。' },
        { misconception: '海贸开放会让所有人立即受益。', correction: '收益经过地域、身份、资本和政策限制分配。' },
      ],
      discussionRoles: [
        { role: '读书人本人', task: '平衡科举前途与家庭收入。' },
        { role: '族中长辈', task: '维护名声和宗族期待。' },
        { role: '书坊/商人伙伴', task: '说明市场机会和风险。' },
      ],
      exitTickets: [
        '写出一个“制度期待”和一个“现实压力”。',
        '说明你使用的一条证据属于宏观还是个人线索。',
      ],
    },
    activityPacks: [
      {
        id: 'jiangnan-book-account-compare',
        title: '书页与账册比较',
        mode: 'compare',
        durationMinutes: 14,
        audience: '同伴比较练习',
        prompt: '比较“读书求名”和“家计催促”两种压力如何同时塑造江南读书人的一天。',
        materials: ['Scene Reader：书页和账册都受潮', 'Scene Reader：蒙童背书，家计催促', '日常切片：教育、工作'],
        steps: ['为读书压力找一条证据。', '为家计压力找一条证据。', '写出两者如何互相冲突又互相依赖。'],
        deliverable: '一张双栏比较卡：读书路径 / 家计路径 / 综合判断。',
        successCriteria: ['能把个人志向和家庭经济连起来。', '证据来自两个不同 scene beats。', '结论不把科举写成唯一解释。'],
        linkedSourceTitles: ['《明实录》隆庆朝相关记载', 'The Confusions of Pleasure: Commerce and Culture in Ming China'],
        linkedSceneBeatTitles: ['书页和账册都受潮', '蒙童背书，家计催促'],
      },
      {
        id: 'jiangnan-silver-source-lab',
        title: '白银海风 Source Lab',
        mode: 'source-lab',
        durationMinutes: 20,
        audience: '小组来源拼图',
        prompt: '判断海贸、白银和商业出版如何改变一个内陆书房里的选择。',
        materials: ['《明实录》隆庆朝相关记载', 'The Confusions of Pleasure 来源卡', 'Scene Reader：海风把远方白银吹进内陆'],
        steps: ['找出一条国家制度变化线索。', '找出一条市场或文化消费线索。', '解释远方贸易怎样进入读书人的近身日常。'],
        deliverable: '一张“远方—本地”因果链图。',
        successCriteria: ['能说明白银不是孤立商品，而是交换网络。', '能区分官方记载与现代研究解释。', '能把宏观贸易落到读书、家计或出版选择。'],
        linkedSourceTitles: ['《明实录》隆庆朝相关记载', 'The Confusions of Pleasure: Commerce and Culture in Ming China'],
        linkedSceneBeatTitles: ['海风把远方白银吹进内陆', '半工半读的疲惫折中'],
      },
      {
        id: 'jiangnan-half-study-extension',
        title: '半工半读路径延展',
        mode: 'extension',
        durationMinutes: 28,
        audience: '课后探究或拔高小组',
        prompt: '设计一条既不完全弃学、也不盲目应试的半工半读方案，并说明它依赖的历史条件。',
        materials: ['决策选项卡', '关键术语', 'compareAngles'],
        steps: ['列出方案需要的三种资源：时间、钱、关系。', '为每种资源找场景证据。', '预测如果市场或考试环境变化，方案会怎样失败。'],
        deliverable: '一份半工半读方案书，含资源表和失败条件。',
        successCriteria: ['方案符合明代江南的制度和市场环境。', '使用至少三条证据。', '能说明机会背后的脆弱性。'],
        linkedSourceTitles: ['The Confusions of Pleasure: Commerce and Culture in Ming China', '1587, A Year of No Significance: The Ming Dynasty in Decline'],
        linkedSceneBeatTitles: ['蒙童背书，家计催促', '半工半读的疲惫折中'],
      },
    ],
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
        instruction: '判断晚明商业文化研究能否证明普通读书人的名声焦虑，哪些地方声音仍需补证。',
        evidenceUse: '对照官修政策时间点和商业文化研究，区分制度变化、社会风气与个人选择。',
        deliverable: '一张 120 字以内的史料判断卡，说明士商关系证据的边界。',
        estimatedMinutes: 16,
        difficulty: '进阶',
        taskType: '史料判断',
        outputTemplate: [
          '来源组合：列出你使用的两类来源。',
          '可证明：写出材料能较稳妥支持的事实。',
          '需推论：标出从材料到读书人名声焦虑处境的推理。',
          '缺席声音：指出没有直接出现的人群或经验。',
          '边界结论：说明这个叙事该如何谨慎使用。',
        ],
        rubric: [
          '明确引用至少一条来源层材料。',
          '区分事实证据与合理推论。',
          '指出来源视角、偏见或缺席声音。',
          '能解释证据不足时为何仍需保留判断。',
        ],
        sentenceStarters: [
          '这组来源最能证明的是……',
          '从……推到读书人的处境，中间还需要……',
          '材料里缺席的声音是……',
          '因此我会把这个结论限制在……',
        ],
        linkedSourceTitles: [
          '《明实录》隆庆朝相关记载',
          'The Confusions of Pleasure: Commerce and Culture in Ming China'
        ],
        steps: [
          '先选择两条关联来源，阅读其视角和可靠性边界。',
          '把“可直接支持的事实”和“课堂叙事推论”分开记录。',
          '找出一个缺席声音，再写出有边界的结论。',
        ],
        evidenceChecklist: [
          '至少点名一条来源标题或来源类型。',
          '写明一条材料能证明的事实和一条需要推论的判断。',
          '说明缺席声音或可靠性限制。',
        ],
        reflectionPrompt: '哪些证据能证明社会结构，哪些还不能证明个人感受？',
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
        excerpt: '官修实录可锁定海禁调整、月港开放等政策节点。',
        sourceQuestion: '政策记录能说明机会出现，但能否证明地方执行一致？',
        reliabilityNote: '官修编年偏重朝廷决策，地方执行和民间反应常被压缩。',
        perspective: '朝廷编年与制度视角',
        evidenceTags: ['海禁政策', '月港开放', '制度时间点'],
      },
      {
        title: 'The Confusions of Pleasure: Commerce and Culture in Ming China',
        creator: 'Timothy Brook',
        sourceType: 'scholarship',
        relevance: '讨论明代商业化、消费文化和士商关系，是江南社会氛围的重要依据。',
        excerpt: '研究把商业化、消费文化和士商关系放在晚明社会变化中理解。',
        sourceQuestion: '商业文化证据能如何解释读书人的名声焦虑？',
        reliabilityNote: '宏观文化解释需与具体地区、身份和时间点配合使用。',
        perspective: '现代商业文化史视角',
        evidenceTags: ['商业化', '士商关系', '消费文化'],
      },
      {
        title: '1587, A Year of No Significance: The Ming Dynasty in Decline',
        creator: 'Ray Huang',
        sourceType: 'scholarship',
        relevance: '帮助理解晚明制度、财政与士人处境，作为科举和地方社会压力的背景读物。',
        excerpt: '研究用制度与财政困局解释晚明官僚体系的限制。',
        sourceQuestion: '制度困局能支持哪些关于科举和地方压力的推论？',
        reliabilityNote: '叙事性强，适合提出问题，不宜当作唯一依据。',
        perspective: '现代制度史叙事视角',
        evidenceTags: ['财政制度', '士人处境', '晚明压力'],
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
    sceneBeats: [
      {
        timeLabel: '潮湿清晨',
        title: '茶箱和海水气味之间',
        sensoryDetail: '茶箱木味、咸湿海风和外商馆区的煤油灯气混在账房门口。',
        historicalTension: '口岸贸易打开世界，也把中介劳动放进清廷规则与外商利益的夹缝。',
        evidenceHook: '把十三行制度、口岸英文材料和居所切片并置，判断机会为什么不等于安全。',
        learnerPrompt: '买办助手最重要的资源是什么？为什么这项资源也会带来怀疑？',
        linkedDailyLifeKeys: ['home', 'education', 'freedoms'],
        linkedSourceTitles: ['The Chinese Repository', 'Trade and Diplomacy on the China Coast: The Opening of the Treaty Ports, 1842-1854'],
      },
      {
        timeLabel: '午间核账',
        title: '翻译不只是语言',
        sensoryDetail: '算盘珠急促碰撞，英文货名单和中文行规在你手边来回转换。',
        historicalTension: '许多冲突看似误译，实际是法律、责任、利润和国家权力无法互译。',
        evidenceHook: '用工作切片与外交贸易研究解释“中介能力”如何转化为“中介责任”。',
        learnerPrompt: '账簿中哪一行最可能在危机中变成证据？',
        linkedDailyLifeKeys: ['work', 'education', 'risks'],
        linkedSourceTitles: ['Trade and Diplomacy on the China Coast: The Opening of the Treaty Ports, 1842-1854'],
      },
      {
        timeLabel: '禁令下达',
        title: '灰色收益被国家权力照亮',
        sensoryDetail: '官府文书层层传来，纸面上的朱印比外商许诺的银元更刺眼。',
        historicalTension: '灰色地带在平时提供收益，在政治危机中却让中介变成可追责对象。',
        evidenceHook: '把禁烟风暴时间线、可疑货物决策和鸦片战争研究连成风险链。',
        learnerPrompt: '“只做文书”能否让人置身事外？请用一条场景证据反驳或支持。',
        linkedDailyLifeKeys: ['risks', 'work', 'freedoms'],
        linkedSourceTitles: ['The Opium War: Drugs, Dreams and the Making of China', 'The Chinese Repository'],
      },
      {
        timeLabel: '夜里算代价',
        title: '每个人都在算账',
        sensoryDetail: '灯下墨迹未干，远处船桅晃动，报酬数字旁边全是看不见的代价。',
        historicalTension: '高报酬与政治危机的代价并不对称，普通中介无法掌控冲突升级。',
        evidenceHook: '用决策三个选项比较逐利、自保和寻求保护伞的不同风险。',
        learnerPrompt: '哪一种选择最像“风险转移”而不是“风险消失”？',
        linkedDailyLifeKeys: ['risks', 'freedoms', 'home'],
        linkedSourceTitles: ['The Opium War: Drugs, Dreams and the Making of China'],
      },
    ],
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
    lessonPack: {
      inquiryQuestion: '十三行买办助手为什么既有机会又处在制度夹缝中？',
      quickStart: [
        '定位广州口岸、十三行、鸦片危机。',
        '画出清廷、行商、外商、助手四方关系。',
        '判断一份账簿最可能保护谁、伤害谁。',
      ],
      classroomFlow: {
        quick: {
          title: '10 分钟关系图',
          steps: ['读决策题', '把角色连成责任链', '标出一个信息优势和一个风险来源'],
        },
        source: {
          title: '20 分钟口岸材料研读',
          steps: ['比较英文口岸视角与清朝制度背景', '区分贸易事实、利益立场和道德判断', '写一条夹缝处境证据'],
        },
        debate: {
          title: '25 分钟账簿选择辩论',
          steps: ['公开风险组、隐藏风险组、求保护组发言', '每组说明可能后果', '全班评估谁承担最大代价'],
        },
      },
      checkQuestions: [
        {
          question: '买办助手的中介优势是什么？',
          answer: '懂语言、账目和双方规矩，能传递信息并从缝隙中获得机会。',
          teacherNote: '同时追问这种优势为何不等于权力。',
        },
        {
          question: '为什么鸦片风险不是单纯个人道德问题？',
          answer: '它牵涉贸易制度、外交冲突、行商责任和国家禁令。',
          teacherNote: '引导学生从制度链条分析灰色收益。',
        },
      ],
      misconceptions: [
        { misconception: '中介会两边通吃，所以最安全。', correction: '中介也最容易在冲突中被追责或牺牲。' },
        { misconception: '贸易冲突只由个人贪婪造成。', correction: '个人选择嵌在口岸制度、全球需求和国家政策中。' },
      ],
      discussionRoles: [
        { role: '买办助手', task: '说明账簿处理的个人风险。' },
        { role: '行商', task: '强调责任、声誉和官府压力。' },
        { role: '外商', task: '提出利润和契约理由。' },
      ],
      exitTickets: [
        '写出十三行体系中的一条权力链。',
        '说明一条来源可能带有的立场。',
      ],
    },
    activityPacks: [
      {
        id: 'guangzhou-translation-warmup',
        title: '翻译不是语言热身',
        mode: 'warmup',
        durationMinutes: 9,
        audience: '全班开场快问快答',
        prompt: '用一条证据说明买办助手的翻译工作为什么同时是语言、信用和制度中介。',
        materials: ['Scene Reader：翻译不只是语言', '身份卡', '日常切片：工作'],
        steps: ['圈出一个语言线索。', '圈出一个信用或制度线索。', '把两条线索合成一句“翻译也是____”。'],
        deliverable: '一句概念判断和两条证据。',
        successCriteria: ['不把买办简化为单纯翻译。', '能点出中介位置的机会和风险。', '证据具体可回到场景文本。'],
        linkedSourceTitles: ['The Chinese Repository'],
        linkedSceneBeatTitles: ['翻译不只是语言', '茶箱和海水气味之间'],
      },
      {
        id: 'guangzhou-opium-account-debate',
        title: '灰色账目辩论',
        mode: 'debate',
        durationMinutes: 25,
        audience: '两方辩论 + 观察员',
        prompt: '面对鸦片相关灰色收益，买办助手应保护家庭机会、远离风险，还是向制度靠拢？',
        materials: ['决策选项卡', 'Scene Reader：灰色收益被国家权力照亮', 'The Opium War 来源卡'],
        steps: ['正方说明为什么接受灰色收益。', '反方说明为什么风险会外溢到家庭和口岸秩序。', '观察员记录双方使用的来源边界。'],
        deliverable: '一份辩论裁决：哪方更符合历史处境，为什么。',
        successCriteria: ['能同时讨论个人上升、国家权力和贸易风险。', '至少引用一条来源卡和一条 scene beat。', '裁决承认证据不能直接证明个人心理。'],
        linkedSourceTitles: ['The Opium War: Drugs, Dreams and the Making of China', 'Trade and Diplomacy on the China Coast: The Opening of the Treaty Ports, 1842-1854'],
        linkedSceneBeatTitles: ['灰色收益被国家权力照亮', '每个人都在算账'],
      },
      {
        id: 'guangzhou-port-source-lab',
        title: '口岸制度 Source Lab',
        mode: 'source-lab',
        durationMinutes: 18,
        audience: '三人来源分工',
        prompt: '用三条来源重建十三行口岸里“谁制定规则、谁承担风险、谁获得机会”。',
        materials: ['The Chinese Repository', 'Trade and Diplomacy on the China Coast 来源卡', 'The Opium War 来源卡'],
        steps: ['每人认领一条来源，标注其视角。', '把来源分别贴到规则、风险、机会三栏。', '写出一个来源共同无法看见的普通人声音。'],
        deliverable: '三栏来源矩阵 + 一条缺席声音。',
        successCriteria: ['能准确说明来源视角差异。', '能把贸易制度和个人处境连接。', '能指出来源沉默或偏向。'],
        linkedSourceTitles: ['The Chinese Repository', 'Trade and Diplomacy on the China Coast: The Opening of the Treaty Ports, 1842-1854', 'The Opium War: Drugs, Dreams and the Making of China'],
        linkedSceneBeatTitles: ['茶箱和海水气味之间', '每个人都在算账'],
      },
    ],
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
        instruction: '判断英文口岸材料和后世研究各自带来什么偏见，哪些中国中介声音被夹在缝隙里。',
        evidenceUse: '比较外侨观察、外交贸易研究和鸦片战争叙事，标出可证明事实与立场偏差。',
        deliverable: '一张 120 字以内的史料判断卡，说明口岸来源的视角边界。',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '史料判断',
        outputTemplate: [
          '来源组合：列出你使用的两类来源。',
          '可证明：写出材料能较稳妥支持的事实。',
          '需推论：标出从材料到买办助手处境的推理。',
          '缺席声音：指出没有直接出现的人群或经验。',
          '边界结论：说明这个叙事该如何谨慎使用。',
        ],
        rubric: [
          '明确引用至少一条来源层材料。',
          '区分事实证据与合理推论。',
          '指出来源视角、偏见或缺席声音。',
          '能解释证据不足时为何仍需保留判断。',
        ],
        sentenceStarters: [
          '这组来源最能证明的是……',
          '从……推到买办助手的处境，中间还需要……',
          '材料里缺席的声音是……',
          '因此我会把这个结论限制在……',
        ],
        linkedSourceTitles: [
          'The Chinese Repository',
          'Trade and Diplomacy on the China Coast: The Opening of the Treaty Ports, 1842-1854',
          'The Opium War: Drugs, Dreams and the Making of China'
        ],
        steps: [
          '先选择两条关联来源，阅读其视角和可靠性边界。',
          '把“可直接支持的事实”和“课堂叙事推论”分开记录。',
          '找出一个缺席声音，再写出有边界的结论。',
        ],
        evidenceChecklist: [
          '至少点名一条来源标题或来源类型。',
          '写明一条材料能证明的事实和一条需要推论的判断。',
          '说明缺席声音或可靠性限制。',
        ],
        reflectionPrompt: '如果主要材料来自外侨观察，你会怎样寻找被遮蔽的中方经验？',
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
        excerpt: '英文期刊保存外侨对广州贸易、口岸规则和中外关系的观察。',
        sourceQuestion: '外侨观察能看到什么，又会忽略哪些中国商人声音？',
        reliabilityNote: '殖民与传教语境明显，常带有外来评价框架。',
        perspective: '口岸外侨与英文读者视角',
        evidenceTags: ['口岸观察', '外来视角', '中介贸易'],
      },
      {
        title: 'Trade and Diplomacy on the China Coast: The Opening of the Treaty Ports, 1842-1854',
        creator: 'John King Fairbank',
        sourceType: 'scholarship',
        relevance: '分析广州贸易制度向条约口岸体系转变的外交与商业背景。',
        excerpt: '研究解释广州贸易制度向条约口岸体系转变的外交逻辑。',
        sourceQuestion: '外交史材料能否解释买办助手的日常选择？',
        reliabilityNote: '偏重制度和外交层面，普通中介劳动需要其他材料补足。',
        perspective: '现代外交与贸易制度史视角',
        evidenceTags: ['条约口岸', '外交制度', '贸易转型'],
      },
      {
        title: 'The Opium War: Drugs, Dreams and the Making of China',
        creator: 'Julia Lovell',
        sourceType: 'scholarship',
        relevance: '以近现代视角综述鸦片贸易、禁烟运动与战争影响，帮助界定叙事的危机边界。',
        excerpt: '研究综述鸦片贸易、禁烟运动和战争记忆的多重影响。',
        sourceQuestion: '鸦片危机能证明哪些风险，哪些只是后见之明？',
        reliabilityNote: '后设叙事容易清楚呈现结局，使用时要避免替当事人预知未来。',
        perspective: '现代全球史与战争记忆视角',
        evidenceTags: ['鸦片贸易', '禁烟运动', '后见之明'],
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
    sceneBeats: [
      {
        timeLabel: '傍晚遮光',
        title: '一扇窗帘成为防线',
        sensoryDetail: '厚布拉紧，胶带压住玻璃，街灯被黑暗吞下。',
        historicalTension: '私人家庭被总体战改造成公共防御环节，一户漏光可能牵连整条街。',
        evidenceHook: '把灯火管制、家居切片和博物馆民防资料连起来，说明个人行动的公共后果。',
        learnerPrompt: '为什么窗帘不是普通家务，而是一条历史证据？',
        linkedDailyLifeKeys: ['home', 'risks', 'freedoms'],
        linkedSourceTitles: ['Imperial War Museums: The Blitz collection and learning resources'],
      },
      {
        timeLabel: '警报响起',
        title: '恐惧有时只是沉默排队',
        sensoryDetail: '汽笛声拉长，人们抱着毯子和茶壶走向地下，队伍里只有鞋底声。',
        historicalTension: '平民不是战场旁观者，空袭把个人安全、阶层资源和社区责任压到同一刻。',
        evidenceHook: '用风险切片、避难决策和 Mass Observation 平民材料检查“士气”叙事。',
        learnerPrompt: '沉默排队能证明韧性、恐惧，还是两者都有？为什么？',
        linkedDailyLifeKeys: ['risks', 'home', 'education'],
        linkedSourceTitles: ['Mass Observation Archive', 'Wartime: Britain 1939-1945'],
      },
      {
        timeLabel: '站台深夜',
        title: '地铁站里的临时社会',
        sensoryDetail: '潮湿砖墙、热茶味和疲惫呼吸挤在同一段站台。',
        historicalTension: '公共避难更坚固，却暴露拥挤、不平等和家庭照护的现实限制。',
        evidenceHook: '把地铁避难选项与社会史研究并读，比较自保和互助的资源条件。',
        learnerPrompt: '去地铁站避难是个人主义选择吗？还是维持生活的前提？',
        linkedDailyLifeKeys: ['food', 'home', 'risks', 'freedoms'],
        linkedSourceTitles: ['Wartime: Britain 1939-1945', 'Imperial War Museums: The Blitz collection and learning resources'],
      },
      {
        timeLabel: '黎明清点',
        title: '社区把夜晚变成规则',
        sensoryDetail: '灰尘落在台阶上，邻居递来热水，大家低声确认谁还没回来。',
        historicalTension: '长期危机不能只靠一次善意，互助需要轮班、规则和公共责任。',
        evidenceHook: '用社区互助切片和轮班选项说明平民能动性如何进入战时社会。',
        learnerPrompt: '哪一条小规则能把情绪化互助变成可持续机制？',
        linkedDailyLifeKeys: ['work', 'freedoms', 'risks'],
        linkedSourceTitles: ['Mass Observation Archive', 'Wartime: Britain 1939-1945'],
      },
    ],
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
    lessonPack: {
      inquiryQuestion: '伦敦平民如何把战争压力转化为日常规则和互助？',
      quickStart: [
        '定位大轰炸、灯火管制、配给与避难。',
        '找一条国家规定和一条社区互助证据。',
        '判断违反灯火管制影响的是个人还是全街区。',
      ],
      classroomFlow: {
        quick: {
          title: '10 分钟战时日常',
          steps: ['读日常与决策', '给风险按“个人/公共”分类', '写一条公共责任判断'],
        },
        source: {
          title: '20 分钟档案与记忆',
          steps: ['用博物馆资料确认民防制度', '用平民档案补足情绪与日常', '区分宣传士气和真实压力'],
        },
        debate: {
          title: '25 分钟避难与互助辩论',
          steps: ['家庭避难组、公共避难组、邻里轮班组准备', '每组说明资源限制', '共同设计一条街区规则'],
        },
      },
      checkQuestions: [
        {
          question: '灯火管制为什么是公共安全问题？',
          answer: '一户漏光可能暴露街区位置，增加空袭风险。',
          teacherNote: '把个人行为与集体脆弱性连接。',
        },
        {
          question: '“士气高昂”这个说法需要怎样核查？',
          answer: '要对照日记、档案、配给和避难经历，注意宣传与沉默。',
          teacherNote: '避免把战时宣传直接当作全部民众经验。',
        },
      ],
      misconceptions: [
        { misconception: '战时平民只有被动忍受。', correction: '平民也通过守规、互助、避难和投诉影响社区安全。' },
        { misconception: '英国平民都始终乐观团结。', correction: '士气叙事背后有恐惧、疲惫、阶层差异和资源不均。' },
      ],
      discussionRoles: [
        { role: '街区居民', task: '说明家庭安全需求。' },
        { role: '民防管理员', task: '维护灯火和避难规则。' },
        { role: '邻居志愿者', task: '设计可持续互助安排。' },
      ],
      exitTickets: [
        '写出一条个人行动如何影响公共安全。',
        '指出“士气”叙事需要补充的证据。',
      ],
    },
    activityPacks: [
      {
        id: 'london-blackout-checklist',
        title: '灯火管制检查清单',
        mode: 'warmup',
        durationMinutes: 8,
        audience: '个人或家庭角色快速进入',
        prompt: '把一扇窗帘当作防线，说明家庭日常如何被战争规则重新组织。',
        materials: ['Scene Reader：一扇窗帘成为防线', '日常切片：home、risks', 'Imperial War Museums 来源卡'],
        steps: ['列出普通家庭要完成的两项防空动作。', '写出这些动作保护了谁，也限制了谁。', '用一句话解释“家务为何变成公共安全”。'],
        deliverable: '一张 blackout checklist，含两项动作和一条历史解释。',
        successCriteria: ['能从小物件进入总体战。', '能说明规则与社区安全的关系。', '解释不把战争只写成战场事件。'],
        linkedSourceTitles: ['Imperial War Museums: The Blitz collection and learning resources'],
        linkedSceneBeatTitles: ['一扇窗帘成为防线', '社区把夜晚变成规则'],
      },
      {
        id: 'london-shelter-roleplay',
        title: '地铁站临时社会 Roleplay',
        mode: 'roleplay',
        durationMinutes: 22,
        audience: '小组角色讨论',
        prompt: '在防空洞里，居民、志愿者、儿童和怀疑者如何协商秩序与恐惧？',
        materials: ['Scene Reader：地铁站里的临时社会', 'Mass Observation Archive 来源卡', 'lessonPack discussion roles'],
        steps: ['每人选择一个防空洞角色。', '用一条材料说明自己的需求或担忧。', '共同制定三条临时规则，并解释其历史理由。'],
        deliverable: '一张防空洞规则公告，附每条规则的证据依据。',
        successCriteria: ['角色发言能体现恐惧、互助和纪律的张力。', '规则有来源或场景证据支持。', '能看到临时共同体的不平等和脆弱。'],
        linkedSourceTitles: ['Mass Observation Archive', 'Wartime: Britain 1939-1945'],
        linkedSceneBeatTitles: ['地铁站里的临时社会', '恐惧有时只是沉默排队'],
      },
      {
        id: 'london-morale-writing',
        title: '士气与沉默短论',
        mode: 'writing',
        durationMinutes: 18,
        audience: '个人论证写作',
        prompt: '评估“伦敦居民很坚强”这句话能证明什么，又遮蔽了哪些恐惧与疲惫。',
        materials: ['Mass Observation Archive', 'Scene Reader：恐惧有时只是沉默排队', '真实历史对照'],
        steps: ['先改写一个更谨慎的观点。', '引用一条坚持秩序的证据。', '再引用一条恐惧或疲惫的证据，说明边界。'],
        deliverable: '一段 130 字史料判断短论。',
        successCriteria: ['能避免宣传式概括。', '能使用来源可信度语言。', '能同时呈现韧性和代价。'],
        linkedSourceTitles: ['Mass Observation Archive', 'Wartime: Britain 1939-1945'],
        linkedSceneBeatTitles: ['恐惧有时只是沉默排队', '社区把夜晚变成规则'],
      },
    ],
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
        instruction: '判断博物馆资料、平民档案和社会史能否证明“韧性”，以及宣传叙事可能遮蔽什么。',
        evidenceUse: '比较机构策展、Mass Observation 平民记录和社会史综合，区分情绪证据与国家叙事。',
        deliverable: '一张 120 字以内的史料判断卡，说明平民士气证据的强弱。',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '史料判断',
        outputTemplate: [
          '来源组合：列出你使用的两类来源。',
          '可证明：写出材料能较稳妥支持的事实。',
          '需推论：标出从材料到普通居民韧性处境的推理。',
          '缺席声音：指出没有直接出现的人群或经验。',
          '边界结论：说明这个叙事该如何谨慎使用。',
        ],
        rubric: [
          '明确引用至少一条来源层材料。',
          '区分事实证据与合理推论。',
          '指出来源视角、偏见或缺席声音。',
          '能解释证据不足时为何仍需保留判断。',
        ],
        sentenceStarters: [
          '这组来源最能证明的是……',
          '从……推到平民韧性，中间还需要……',
          '材料里缺席的声音是……',
          '因此我会把这个结论限制在……',
        ],
        linkedSourceTitles: [
          'Imperial War Museums: The Blitz collection and learning resources',
          'Mass Observation Archive'
        ],
        steps: [
          '先选择两条关联来源，阅读其视角和可靠性边界。',
          '把“可直接支持的事实”和“课堂叙事推论”分开记录。',
          '找出一个缺席声音，再写出有边界的结论。',
        ],
        evidenceChecklist: [
          '至少点名一条来源标题或来源类型。',
          '写明一条材料能证明的事实和一条需要推论的判断。',
          '说明缺席声音或可靠性限制。',
        ],
        reflectionPrompt: '个人日记和公共展陈发生冲突时，你会优先相信什么，为什么？',
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
        excerpt: '博物馆资料整理轰炸、防空、灯火管制和民防宣传的基本框架。',
        sourceQuestion: '官方与博物馆材料能证明制度安排，能否呈现私人恐惧？',
        reliabilityNote: '公共教育材料经过策展，细节可靠但情绪复杂性有限。',
        perspective: '机构策展与公共史视角',
        evidenceTags: ['伦敦大轰炸', '民防制度', '灯火管制'],
        url: 'https://www.iwm.org.uk/history/the-blitz-around-britain',
      },
      {
        title: 'Mass Observation Archive',
        creator: 'University of Sussex Special Collections',
        sourceType: 'institution',
        relevance: '保存英国平民战时日记、问卷和观察材料，支撑普通人情绪与日常经验维度。',
        excerpt: '档案保存日记、问卷和观察记录，能接近平民对战争日常的即时感受。',
        sourceQuestion: '个人记录能代表公众情绪吗，还是只代表留下文字的人？',
        reliabilityNote: '样本有参与者偏差，个人感受不能直接推广到全体伦敦人。',
        perspective: '平民记录与观察者视角',
        evidenceTags: ['平民日记', '情绪史', '样本偏差'],
        url: 'https://massobs.org.uk/',
      },
      {
        title: 'Wartime: Britain 1939-1945',
        creator: 'Juliet Gardiner',
        sourceType: 'scholarship',
        relevance: '综合战时英国社会史，覆盖配给、避难、家庭与社区生活。',
        excerpt: '社会史研究综合配给、避难、家庭和社区经验，连接政策与日常。',
        sourceQuestion: '社会史综合如何帮助区分宣传韧性和真实韧性？',
        reliabilityNote: '二手综合依赖多类材料，具体断言仍需回到原始记录。',
        perspective: '现代战时社会史视角',
        evidenceTags: ['配给', '社区互助', '社会史综合'],
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
    sceneBeats: [
      {
        timeLabel: '河边开工',
        title: '纸浆气味里的知识城市',
        sensoryDetail: '底格里斯河风带着湿热，纸浆、墨烟和皮革味沾在手指上。',
        historicalTension: '纸张降低书写成本，但知识流动还依赖书肆、赞助和劳动分工。',
        evidenceHook: '把纸张传播、书籍史研究和工作切片放在一条“材料到市场”的链条中。',
        learnerPrompt: '纸张本身为什么不足以解释巴格达的学术繁荣？',
        linkedDailyLifeKeys: ['home', 'work', 'freedoms'],
        linkedSourceTitles: ['The Rise of the Arabic Book', '《群书类述》（Kitāb al-Fihrist）'],
      },
      {
        timeLabel: '午后校读',
        title: '一个术语能改变一剂药',
        sensoryDetail: '校读者停下笔，墨点在可疑术语旁晕开，屋里突然安静。',
        historicalTension: '抄写员地位不高，却要在速度、准确和权威边界之间判断。',
        evidenceHook: '用医学译稿决策、准确性切片和翻译运动研究解释隐形劳动的责任。',
        learnerPrompt: '加注可疑术语是在越界，还是在保护知识可靠性？',
        linkedDailyLifeKeys: ['work', 'education', 'risks'],
        linkedSourceTitles: ['Greek Thought, Arabic Culture', 'The Rise of the Arabic Book'],
      },
      {
        timeLabel: '书肆争论',
        title: '知识也有市场和赞助人',
        sensoryDetail: '书商喊价，学者争论天文表，仆人催促译稿送进宅邸。',
        historicalTension: '学术声望由思想、金钱、委托和流通共同塑造，普通抄手在其中承担信用风险。',
        evidenceHook: '把赞助网络任务与书目传统对照，指出材料容易看见名家而遮蔽工匠。',
        learnerPrompt: '谁最有权决定文本如何流通？抄写员还有哪些微小影响？',
        linkedDailyLifeKeys: ['work', 'risks', 'freedoms'],
        linkedSourceTitles: ['《群书类述》（Kitāb al-Fihrist）', 'Greek Thought, Arabic Culture'],
      },
      {
        timeLabel: '长夜抄写',
        title: '在字里偷学世界',
        sensoryDetail: '灯油味越来越重，几何图形、医方和诗句在纸页间交替出现。',
        historicalTension: '计件劳动可能疲惫而低微，也可能成为接触知识和改变身份的通道。',
        evidenceHook: '用教育切片和劳动中的学习任务，修正“复制机器”的误解。',
        learnerPrompt: '抄写员学到的知识是正式教育，还是工作副产品？这个区分重要吗？',
        linkedDailyLifeKeys: ['food', 'education', 'work', 'freedoms'],
        linkedSourceTitles: ['The Rise of the Arabic Book'],
      },
    ],
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
    lessonPack: {
      inquiryQuestion: '巴格达抄写员如何在劳动中参与知识生产？',
      quickStart: [
        '定位纸张、翻译、书肆和赞助。',
        '找出抄写员的手工劳动与判断劳动。',
        '判断是否该给医学译稿加注。',
      ],
      classroomFlow: {
        quick: {
          title: '10 分钟一页纸旅程',
          steps: ['从纸坊到读者画流程', '标出抄写员能影响的环节', '写一句知识可靠性判断'],
        },
        source: {
          title: '20 分钟书籍史研读',
          steps: ['用纸张与翻译研究校准背景', '用书目传统理解知识网络', '区分赞助者、译者、抄手视角'],
        },
        debate: {
          title: '25 分钟加注辩论',
          steps: ['忠实抄写组与谨慎加注组对辩', '每组说明权威和错误风险', '共同写一条注记规范'],
        },
      },
      checkQuestions: [
        {
          question: '抄写员为什么不只是复制机器？',
          answer: '他会校对、排版、辨认术语、处理委托要求和错误风险。',
          teacherNote: '突出知识传播中的隐形劳动。',
        },
        {
          question: '赞助网络会怎样影响文本？',
          answer: '赞助决定委托、主题、报酬和流通对象，也可能影响解释权。',
          teacherNote: '把知识生产与社会资源连接。',
        },
      ],
      misconceptions: [
        { misconception: '翻译运动只是少数学者的思想活动。', correction: '纸张、抄写、书肆、赞助等劳动共同支撑知识流动。' },
        { misconception: '抄写越忠实就越没有判断。', correction: '判断常体现在校误、术语选择和是否加注。' },
      ],
      discussionRoles: [
        { role: '抄写员', task: '说明加注的职业风险。' },
        { role: '赞助人', task: '提出准确、声誉和成本要求。' },
        { role: '读者/医者', task: '说明错误文本的实际后果。' },
      ],
      exitTickets: [
        '写出一项抄写劳动如何改变知识可靠性。',
        '指出一条来源难以看见的劳动者经验。',
      ],
    },
    activityPacks: [
      {
        id: 'baghdad-paper-trail-warmup',
        title: '纸张如何移动知识',
        mode: 'warmup',
        durationMinutes: 9,
        audience: '全班导入',
        prompt: '用纸浆气味、抄写劳动和城市赞助解释巴格达为什么是知识城市。',
        materials: ['Scene Reader：纸浆气味里的知识城市', '关键术语', 'The Rise of the Arabic Book 来源卡'],
        steps: ['指出一条技术线索：纸张或抄写。', '指出一条社会线索：市场、赞助或师承。', '合成一句“知识流动需要____”。'],
        deliverable: '一条知识流动公式：媒介 + 人群 + 条件。',
        successCriteria: ['能把知识传播写成社会过程。', '至少包含一条物质媒介证据。', '不把翻译运动简化为少数天才行为。'],
        linkedSourceTitles: ['The Rise of the Arabic Book', '《群书类述》（Kitāb al-Fihrist）'],
        linkedSceneBeatTitles: ['纸浆气味里的知识城市', '知识也有市场和赞助人'],
      },
      {
        id: 'baghdad-term-source-lab',
        title: '一个术语的 Source Lab',
        mode: 'source-lab',
        durationMinutes: 21,
        audience: '小组文本细读',
        prompt: '追踪一个医学或哲学术语从希腊文本进入阿拉伯书页时，哪些意义可能被改变。',
        materials: ['Scene Reader：一个术语能改变一剂药', 'Greek Thought, Arabic Culture 来源卡', 'The Rise of the Arabic Book 来源卡'],
        steps: ['选择一个“术语”作为案例。', '标出翻译者、抄写员、读者三种角色的影响。', '写出一条翻译带来的知识机会和一条风险。'],
        deliverable: '一张术语旅行卡：来源、转换、影响、风险。',
        successCriteria: ['能看到翻译不是机械替换。', '能讨论抄写员的主动学习空间。', '能说明来源只能支持传播结构，不能证明虚构个体。'],
        linkedSourceTitles: ['Greek Thought, Arabic Culture', 'The Rise of the Arabic Book'],
        linkedSceneBeatTitles: ['一个术语能改变一剂药', '在字里偷学世界'],
      },
      {
        id: 'baghdad-patronage-debate',
        title: '知识市场与赞助辩论',
        mode: 'debate',
        durationMinutes: 24,
        audience: '赞助人组、抄写员组、读者组',
        prompt: '知识传播更依赖市场需求、宫廷赞助，还是抄写员这样的劳动者？',
        materials: ['Scene Reader：知识也有市场和赞助人', '来源层三张卡', 'compareAngles'],
        steps: ['三组分别主张一种动力。', '每组提出两条证据和一个对其他动力的承认。', '全班投票：哪种动力最容易被来源高估或低估？'],
        deliverable: '一份辩论结论：三种动力排序 + 证据理由。',
        successCriteria: ['能比较技术、市场、赞助和劳动的共同作用。', '能承认单一解释不足。', '能指出来源对精英赞助的偏向。'],
        linkedSourceTitles: ['《群书类述》（Kitāb al-Fihrist）', 'The Rise of the Arabic Book', 'Greek Thought, Arabic Culture'],
        linkedSceneBeatTitles: ['知识也有市场和赞助人', '在字里偷学世界'],
      },
    ],
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
        instruction: '判断书目和书籍史研究能证明哪些知识网络，哪些抄写劳动仍被材料遮蔽。',
        evidenceUse: '把书目记录、书籍生产研究和翻译运动研究分层使用。',
        deliverable: '一张 120 字以内的史料判断卡，说明巴格达知识网络证据的缺口。',
        estimatedMinutes: 16,
        difficulty: '进阶',
        taskType: '史料判断',
        outputTemplate: [
          '来源组合：列出你使用的两类来源。',
          '可证明：写出材料能较稳妥支持的事实。',
          '需推论：标出从材料到抄写员处境的推理。',
          '缺席声音：指出没有直接出现的人群或经验。',
          '边界结论：说明这个叙事该如何谨慎使用。',
        ],
        rubric: [
          '明确引用至少一条来源层材料。',
          '区分事实证据与合理推论。',
          '指出来源视角、偏见或缺席声音。',
          '能解释证据不足时为何仍需保留判断。',
        ],
        sentenceStarters: [
          '这组来源最能证明的是……',
          '从……推到抄写员的处境，中间还需要……',
          '材料里缺席的声音是……',
          '因此我会把这个结论限制在……',
        ],
        linkedSourceTitles: [
          '《群书类述》（Kitāb al-Fihrist）',
          'The Rise of the Arabic Book'
        ],
        steps: [
          '先选择两条关联来源，阅读其视角和可靠性边界。',
          '把“可直接支持的事实”和“课堂叙事推论”分开记录。',
          '找出一个缺席声音，再写出有边界的结论。',
        ],
        evidenceChecklist: [
          '至少点名一条来源标题或来源类型。',
          '写明一条材料能证明的事实和一条需要推论的判断。',
          '说明缺席声音或可靠性限制。',
        ],
        reflectionPrompt: '伟大译者和书目传统之外，哪些劳动最容易在史料中消失？',
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
        excerpt: '书目记录作者、书籍、译者和知识传统，显示巴格达书籍世界的网络。',
        sourceQuestion: '书目能证明知识网络存在，能否证明抄写员的日常劳动？',
        reliabilityNote: '书目偏向著名作者和文本，普通工匠与抄手常隐身。',
        perspective: '书商书目与学术传统视角',
        evidenceTags: ['书目传统', '知识网络', '缺席劳动'],
      },
      {
        title: 'The Rise of the Arabic Book',
        creator: 'Beatrice Gruendler',
        sourceType: 'scholarship',
        relevance: '讨论阿拉伯书籍文化、纸张和文本生产，支撑抄写员与书肆细节。',
        excerpt: '研究讨论纸张、书籍生产和阅读文化，帮助复原抄写与书肆环境。',
        sourceQuestion: '书籍史材料能如何推断纸坊抄写员的工作边界？',
        reliabilityNote: '现代综合可连接碎片证据，但具体人物仍是教学合成。',
        perspective: '现代阿拉伯书籍史视角',
        evidenceTags: ['纸张', '抄写劳动', '阅读文化'],
      },
      {
        title: 'Greek Thought, Arabic Culture',
        creator: 'Dimitri Gutas',
        sourceType: 'scholarship',
        relevance: '分析阿拔斯翻译运动的社会、政治和知识背景。',
        excerpt: '研究分析翻译运动背后的政治赞助、学术需求和社会条件。',
        sourceQuestion: '赞助网络能解释译词风险，但能否说明所有文本流通？',
        reliabilityNote: '偏重精英翻译和思想史，基层生产环节需另行补证。',
        perspective: '现代思想史与翻译运动视角',
        evidenceTags: ['翻译运动', '赞助网络', '精英知识'],
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
    sceneBeats: [
      {
        timeLabel: '沙尘清晨',
        title: '木板上的第一行字',
        sensoryDetail: '沙尘落在木板和纸页上，墨水刚磨匀就被热风催干。',
        historicalTension: '学习发生在家庭、师承和物质脆弱性之中，不只是抽象的学术传统。',
        evidenceHook: '把学者家小课堂、手稿保存资料和师承切片连起来，说明课堂空间如何被生活包围。',
        learnerPrompt: '哪些细节能证明学习空间和家庭空间没有分开？',
        linkedDailyLifeKeys: ['home', 'work', 'education'],
        linkedSourceTitles: ['Timbuktu Manuscripts Project resources'],
      },
      {
        timeLabel: '午后诵读',
        title: '权威来自人际链条',
        sensoryDetail: '老师纠正你的发音，书箱旁挤着从不同地方来的学生。',
        historicalTension: '一本书的权威不只在文字，还在谁传授、谁认可、谁允许继续传授。',
        evidenceHook: '用伊贾扎关键术语和区域史来源解释知识权威的关系网络。',
        learnerPrompt: '为什么“谁教过你”会成为证据，而不只是个人履历？',
        linkedDailyLifeKeys: ['education', 'work', 'freedoms'],
        linkedSourceTitles: ['Timbuktu and the Songhay Empire', 'The Meanings of Timbuktu'],
      },
      {
        timeLabel: '驼队抵达',
        title: '盐、书籍和消息同路而来',
        sensoryDetail: '驼铃、盐块碰撞声和商人口音把沙漠外的世界带到院门口。',
        historicalTension: '廷巴克图的学术生活离不开商路，但商路也带来费用、盗匪和政治风险。',
        evidenceHook: '把跨撒哈拉贸易、饮食中的盐和远行求学决策做成同一条知识网证据。',
        learnerPrompt: '商路运送的是物品，还是学习机会？请各举一条证据。',
        linkedDailyLifeKeys: ['food', 'freedoms', 'risks', 'education'],
        linkedSourceTitles: ['Timbuktu and the Songhay Empire'],
      },
      {
        timeLabel: '夜里抄副本',
        title: '复制也是风险管理',
        sensoryDetail: '你压住被风掀起的纸角，一笔一笔把老师书箱里的关键段落抄出副本。',
        historicalTension: '手稿文化中的复制不是机械重复，而是对火灾、战争、潮湿和迁移风险的回应。',
        evidenceHook: '用手稿风险切片、抄副本选项和现代保护资料讨论幸存文本偏差。',
        learnerPrompt: '留下保护原本和带走副本，哪一种更能保存知识？为什么？',
        linkedDailyLifeKeys: ['work', 'risks', 'freedoms'],
        linkedSourceTitles: ['Timbuktu Manuscripts Project resources', 'The Meanings of Timbuktu'],
      },
    ],
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
    lessonPack: {
      inquiryQuestion: '廷巴克图学生如何在手稿、师承和商路之间保护知识？',
      quickStart: [
        '定位桑海时期、跨撒哈拉贸易和手稿学习。',
        '找出一个知识流动条件和一个脆弱条件。',
        '判断远行求学还是留下抄副本。',
      ],
      classroomFlow: {
        quick: {
          title: '10 分钟知识网',
          steps: ['把老师、学生、商队、手稿连线', '标出盐金贸易与学术移动关系', '写一句保护方案'],
        },
        source: {
          title: '20 分钟手稿来源研读',
          steps: ['用机构资料确认手稿传统', '用区域史解释贸易和学术网络', '区分保存下来的文本与学生日常'],
        },
        debate: {
          title: '25 分钟远行与留守辩论',
          steps: ['远行组、留守组、副本组发言', '每组说明知识收益和损失', '全班制定手稿风险清单'],
        },
      },
      checkQuestions: [
        {
          question: '商路为什么会影响学习？',
          answer: '商路带来纸张、书籍、学者、消息和旅费，也带来盗匪与政治风险。',
          teacherNote: '把经济网络和知识网络叠合起来。',
        },
        {
          question: '保存的手稿能否完整代表学生生活？',
          answer: '不能，它更能证明文本传统，学生情绪和日常需谨慎推论。',
          teacherNote: '提醒学生区分材料幸存与历史整体。',
        },
      ],
      misconceptions: [
        { misconception: '非洲内陆学术与世界交流隔绝。', correction: '廷巴克图通过跨撒哈拉网络连接商业、学术和伊斯兰世界。' },
        { misconception: '手稿保存下来就说明知识很安全。', correction: '手稿易受火灾、潮湿、战争、迁移和所有权变化影响。' },
      ],
      discussionRoles: [
        { role: '手稿学生', task: '权衡远行学习与本地责任。' },
        { role: '老师', task: '维护师承和文本准确性。' },
        { role: '商队伙伴', task: '说明旅途资源和风险。' },
      ],
      exitTickets: [
        '写出一条连接贸易与学习的证据。',
        '提出一个保护手稿的现实步骤。',
      ],
    },
    activityPacks: [
      {
        id: 'timbuktu-manuscript-warmup',
        title: '木板第一行热身',
        mode: 'warmup',
        durationMinutes: 8,
        audience: '个人观察 + 同伴分享',
        prompt: '从木板、墨迹和背诵中找出廷巴克图学习的媒介和门槛。',
        materials: ['Scene Reader：木板上的第一行字', '日常切片：教育', 'Timbuktu Manuscripts Project resources'],
        steps: ['圈出一种学习媒介。', '写出谁能接触它、谁可能被挡在外面。', '用一句话定义“学习门槛”。'],
        deliverable: '一张学习门槛便签。',
        successCriteria: ['能识别手稿、木板或师承等具体媒介。', '能说明门槛来自成本、身份或关系。', '不把廷巴克图只写成神秘藏书地。'],
        linkedSourceTitles: ['Timbuktu Manuscripts Project resources'],
        linkedSceneBeatTitles: ['木板上的第一行字', '权威来自人际链条'],
      },
      {
        id: 'timbuktu-chain-roleplay',
        title: '师承链条 Roleplay',
        mode: 'roleplay',
        durationMinutes: 20,
        audience: '四人学术链条扮演',
        prompt: '老师、学生、抄写者和商旅分别说明一本手稿如何获得权威并流动。',
        materials: ['Scene Reader：权威来自人际链条', 'Scene Reader：盐、书籍和消息同路而来', 'Timbuktu and the Songhay Empire 来源卡'],
        steps: ['每人选择一个链条角色。', '说明自己为手稿提供了什么：记忆、校订、运输、名声或资金。', '共同画出手稿流动路径。'],
        deliverable: '一张师承—贸易流动图，含四个角色贡献。',
        successCriteria: ['能把知识权威与人际关系相连。', '能把贸易路线和手稿流动相连。', '每个角色都有证据支持而非空泛表演。'],
        linkedSourceTitles: ['Timbuktu and the Songhay Empire', 'The Meanings of Timbuktu'],
        linkedSceneBeatTitles: ['权威来自人际链条', '盐、书籍和消息同路而来'],
      },
      {
        id: 'timbuktu-preservation-extension',
        title: '手稿保护方案延展',
        mode: 'extension',
        durationMinutes: 30,
        audience: '项目式小组任务',
        prompt: '面对潮湿、盗掠、价格和政治风险，为一批手稿设计保存与传抄方案。',
        materials: ['Scene Reader：复制也是风险管理', '来源层三张卡', '真实历史对照'],
        steps: ['列出三类风险：物质、市场、政治或记忆断裂。', '为每类风险设计一项应对行动。', '说明行动可能牺牲的成本或公平性。'],
        deliverable: '一份手稿保护 brief：风险表、行动表、取舍说明。',
        successCriteria: ['能把复制视为风险管理，而非只为扩散。', '能使用来源层说明保护对象的重要性。', '能讨论谁有权接触和保存知识。'],
        linkedSourceTitles: ['Timbuktu Manuscripts Project resources', 'Timbuktu and the Songhay Empire', 'The Meanings of Timbuktu'],
        linkedSceneBeatTitles: ['复制也是风险管理', '盐、书籍和消息同路而来'],
      },
    ],
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
        instruction: '判断现代手稿项目和区域史能证明哪些师承网络，哪些学生声音仍难直接听见。',
        evidenceUse: '比较手稿保存资料、桑海区域史和现代解释，标出幸存文本偏差。',
        deliverable: '一张 120 字以内的史料判断卡，说明廷巴克图手稿证据的边界。',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '史料判断',
        outputTemplate: [
          '来源组合：列出你使用的两类来源。',
          '可证明：写出材料能较稳妥支持的事实。',
          '需推论：标出从材料到手稿学生处境的推理。',
          '缺席声音：指出没有直接出现的人群或经验。',
          '边界结论：说明这个叙事该如何谨慎使用。',
        ],
        rubric: [
          '明确引用至少一条来源层材料。',
          '区分事实证据与合理推论。',
          '指出来源视角、偏见或缺席声音。',
          '能解释证据不足时为何仍需保留判断。',
        ],
        sentenceStarters: [
          '这组来源最能证明的是……',
          '从……推到手稿学生的处境，中间还需要……',
          '材料里缺席的声音是……',
          '因此我会把这个结论限制在……',
        ],
        linkedSourceTitles: [
          'Timbuktu Manuscripts Project resources',
          'Timbuktu and the Songhay Empire'
        ],
        steps: [
          '先选择两条关联来源，阅读其视角和可靠性边界。',
          '把“可直接支持的事实”和“课堂叙事推论”分开记录。',
          '找出一个缺席声音，再写出有边界的结论。',
        ],
        evidenceChecklist: [
          '至少点名一条来源标题或来源类型。',
          '写明一条材料能证明的事实和一条需要推论的判断。',
          '说明缺席声音或可靠性限制。',
        ],
        reflectionPrompt: '幸存手稿越珍贵，是否越容易让我们忽略没有保存下来的知识？',
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
        excerpt: '机构资料介绍手稿类型、保存项目和数字化保护，呈现文本传统的物质面。',
        sourceQuestion: '保存项目能证明手稿重要性，能否还原十五世纪课堂？',
        reliabilityNote: '现代保护视角会突出幸存文本，遗失和口传传统较难呈现。',
        perspective: '机构保护与数字人文视角',
        evidenceTags: ['手稿保存', '文本传统', '幸存偏差'],
        url: 'https://www.timbuktumanuscripts.org/',
      },
      {
        title: 'Timbuktu and the Songhay Empire',
        creator: 'John O. Hunwick',
        sourceType: 'scholarship',
        relevance: '提供廷巴克图学者、桑海政治和城市学术生活背景。',
        excerpt: '研究提供廷巴克图学者、城市政治和桑海帝国背景。',
        sourceQuestion: '区域史能怎样连接求学、贸易和帝国权力？',
        reliabilityNote: '重建依赖后世传记和编年材料，普通学生声音有限。',
        perspective: '现代西非区域史视角',
        evidenceTags: ['桑海帝国', '学者网络', '城市政治'],
      },
      {
        title: 'The Meanings of Timbuktu',
        creator: 'Shamil Jeppie 与 Souleymane Bachir Diagne 编',
        sourceType: 'scholarship',
        relevance: '从多角度讨论廷巴克图手稿、知识传统和现代保护问题。',
        excerpt: '论文集从多角度讨论手稿、知识传统和现代保护意义。',
        sourceQuestion: '多重现代解释会怎样影响我们理解廷巴克图？',
        reliabilityNote: '多作者视角丰富但问题意识现代，需区分过去实践与当代意义。',
        perspective: '跨学科现代解释视角',
        evidenceTags: ['知识传统', '现代保护', '多重解释'],
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
    sceneBeats: [
      {
        timeLabel: '湖面清晨',
        title: '独木舟把城市喂醒',
        sensoryDetail: '湖面反光刺眼，玉米、辣椒、火鸡和鲜花的气味从摊位间升起。',
        historicalTension: '湖城繁荣依赖周边村社、独木舟运输和贡赋网络，不只是市场自身的活力。',
        evidenceHook: '把货源任务、饮食切片和现代社会史研究连接，追踪物品如何进入城市。',
        learnerPrompt: '一张玉米饼背后至少连接了哪两种劳动或制度？',
        linkedDailyLifeKeys: ['food', 'home', 'work'],
        linkedSourceTitles: ['Everyday Life in the Aztec World', 'General History of the Things of New Spain (Florentine Codex)'],
      },
      {
        timeLabel: '市场正午',
        title: '称量、争执和市场官员',
        sensoryDetail: '可可豆在手心滚动，市场官员穿过摊位，停在一场价格争执旁。',
        historicalTension: '大型市场不是无规则交换，秩序依靠监督、信用和重复交易共同维持。',
        evidenceHook: '用市场规则切片、征服者目击和纳瓦材料对照市场秩序的证据边界。',
        learnerPrompt: '市场官员的存在说明普通卖家更自由，还是更受约束？',
        linkedDailyLifeKeys: ['work', 'freedoms', 'risks'],
        linkedSourceTitles: ['The Conquest of New Spain', 'General History of the Things of New Spain (Florentine Codex)'],
      },
      {
        timeLabel: '传闻入市',
        title: '东边来的陌生消息改变价格',
        sensoryDetail: '行商压低声音谈海岸来人，顾客的手在玉米和可可之间犹豫。',
        historicalTension: '普通人面对的不是完整征服结局，而是传闻、价格波动和不确定同盟。',
        evidenceHook: '把 1519 时间线、市场是信息学校和传闻来源任务组合，避免倒推结局。',
        learnerPrompt: '1519 年的摊主能知道什么？哪些是我们后来才知道的？',
        linkedDailyLifeKeys: ['education', 'work', 'risks'],
        linkedSourceTitles: ['The Conquest of New Spain', 'Everyday Life in the Aztec World'],
      },
      {
        timeLabel: '收摊前',
        title: '危机利润和共同体信用',
        sensoryDetail: '你数着剩下的玉米和布料，邻居的目光比可可豆更沉。',
        historicalTension: '囤货可能符合个人理性，却会伤害市场信用、邻里关系和共同体稳定。',
        evidenceHook: '用囤货、公平价格和换成可携带货物三个选项比较危机市场策略。',
        learnerPrompt: '在战争传闻下，什么情况下“聪明经营”会变成破坏秩序？',
        linkedDailyLifeKeys: ['risks', 'freedoms', 'home'],
        linkedSourceTitles: ['Everyday Life in the Aztec World'],
      },
    ],
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
    lessonPack: {
      inquiryQuestion: '特诺奇蒂特兰市场秩序如何在征服前夜同时提供稳定与风险？',
      quickStart: [
        '定位 1519 年、特拉特洛尔科市场、贡赋与传闻。',
        '找出一条市场秩序证据和一条危机传闻。',
        '判断囤货、换货还是维持摊位。',
      ],
      classroomFlow: {
        quick: {
          title: '10 分钟市场秩序',
          steps: ['读市场日常', '把货源连到贡赋、湖区和乡村', '写一句传闻如何影响价格'],
        },
        source: {
          title: '20 分钟征服时期材料研读',
          steps: ['用征服记述确认市场规模与秩序', '用社会史补足普通卖家视角', '标出欧洲记录的视角限制'],
        },
        debate: {
          title: '25 分钟危机经营辩论',
          steps: ['囤货组、换成必需品组、正常营业组准备', '每组引用市场规则和战争线索', '结尾说明疾病和同盟变化的不确定性'],
        },
      },
      checkQuestions: [
        {
          question: '为什么市场规则会影响普通卖家的安全？',
          answer: '规则约束价格、摊位、争端和交换秩序，使陌生人交易可预期。',
          teacherNote: '强调市场不是无政府空间。',
        },
        {
          question: '征服者记录市场时可能有什么限制？',
          answer: '他们能描述规模和惊异感，却未必理解本地制度和普通卖家的处境。',
          teacherNote: '训练学生识别外来观察者视角。',
        },
      ],
      misconceptions: [
        { misconception: '阿兹特克市场只是简单物物交换。', correction: '大型市场有规则、监督、专门货物和复杂供应网络。' },
        { misconception: '征服前夜普通人能清楚预见帝国陷落。', correction: '他们面对的是传闻、价格波动、疾病和政治同盟等不完整信号。' },
      ],
      discussionRoles: [
        { role: '市场卖家', task: '说明库存和家庭生计压力。' },
        { role: '市场监督者', task: '维护交易秩序和规则。' },
        { role: '外来观察者', task: '描述所见并承认理解限制。' },
      ],
      exitTickets: [
        '写出一条市场秩序如何降低交易风险。',
        '指出一条征服时期来源的视角限制。',
      ],
    },
    activityPacks: [
      {
        id: 'tenochtitlan-market-map',
        title: '独木舟市场地图',
        mode: 'warmup',
        durationMinutes: 9,
        audience: '全班导入或个人观察',
        prompt: '从独木舟、湖城和集市官员三个线索，画出特诺奇蒂特兰市场如何运转。',
        materials: ['Scene Reader：独木舟把城市喂醒', 'Scene Reader：称量、争执和市场官员', '日常切片：工作'],
        steps: ['画出商品进入市场的路径。', '标出一个规则执行点。', '写出卖家依赖这个系统的一个机会和一个限制。'],
        deliverable: '一张 3 节点市场地图。',
        successCriteria: ['能把地理环境与市场供应相连。', '能指出市场官员或称量规则。', '同时呈现机会与限制。'],
        linkedSourceTitles: ['General History of the Things of New Spain (Florentine Codex)', 'Everyday Life in the Aztec World'],
        linkedSceneBeatTitles: ['独木舟把城市喂醒', '称量、争执和市场官员'],
      },
      {
        id: 'tenochtitlan-conquest-source-lab',
        title: '征服消息 Source Lab',
        mode: 'source-lab',
        durationMinutes: 22,
        audience: '小组史料判断',
        prompt: '判断东边来的陌生消息如何改变价格、信用和共同体关系。',
        materials: ['Florentine Codex 来源卡', 'The Conquest of New Spain 来源卡', 'Scene Reader：东边来的陌生消息改变价格'],
        steps: ['把消息分成“当时可听见”和“后来才知道”两类。', '找出价格或供应变化的证据。', '说明殖民叙述来源需要谨慎使用的原因。'],
        deliverable: '一张消息—市场—来源边界分析卡。',
        successCriteria: ['能区分当事人视角和征服后的叙述。', '能解释危机消息如何影响市场关系。', '能说明来源视角和缺席声音。'],
        linkedSourceTitles: ['General History of the Things of New Spain (Florentine Codex)', 'The Conquest of New Spain'],
        linkedSceneBeatTitles: ['东边来的陌生消息改变价格', '危机利润和共同体信用'],
      },
      {
        id: 'tenochtitlan-crisis-ethics-debate',
        title: '危机利润与共同体辩论',
        mode: 'debate',
        durationMinutes: 24,
        audience: '市场卖家组、邻里组、官员组',
        prompt: '危机中涨价是自保、机会，还是对共同体信用的破坏？',
        materials: ['决策选项卡', 'Scene Reader：危机利润和共同体信用', 'Everyday Life in the Aztec World 来源卡'],
        steps: ['三组分别从卖家、邻里和市场官员视角陈述。', '每组必须说明短期收益和长期代价。', '全班形成一条危机交易规则。'],
        deliverable: '一条市场危机规则 + 三方理由。',
        successCriteria: ['能站在不同角色评价同一价格行为。', '能把信用、规则和征服风险连接。', '结论避免用现代市场观直接裁判。'],
        linkedSourceTitles: ['Everyday Life in the Aztec World', 'General History of the Things of New Spain (Florentine Codex)'],
        linkedSceneBeatTitles: ['称量、争执和市场官员', '危机利润和共同体信用'],
      },
    ],
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
        instruction: '判断殖民早期材料和征服者回忆能证明哪些市场事实，哪些本地摊主声音被改写或缺席。',
        evidenceUse: '比较纳瓦合作者材料、征服者目击叙事和现代社会史，区分目击、翻译和后见解释。',
        deliverable: '一张 120 字以内的史料判断卡，说明特诺奇蒂特兰市场来源的偏见。',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '史料判断',
        outputTemplate: [
          '来源组合：列出你使用的两类来源。',
          '可证明：写出材料能较稳妥支持的事实。',
          '需推论：标出从材料到市场卖家处境的推理。',
          '缺席声音：指出没有直接出现的人群或经验。',
          '边界结论：说明这个叙事该如何谨慎使用。',
        ],
        rubric: [
          '明确引用至少一条来源层材料。',
          '区分事实证据与合理推论。',
          '指出来源视角、偏见或缺席声音。',
          '能解释证据不足时为何仍需保留判断。',
        ],
        sentenceStarters: [
          '这组来源最能证明的是……',
          '从……推到市场卖家的处境，中间还需要……',
          '材料里缺席的声音是……',
          '因此我会把这个结论限制在……',
        ],
        linkedSourceTitles: [
          'General History of the Things of New Spain (Florentine Codex)',
          'The Conquest of New Spain'
        ],
        steps: [
          '先选择两条关联来源，阅读其视角和可靠性边界。',
          '把“可直接支持的事实”和“课堂叙事推论”分开记录。',
          '找出一个缺席声音，再写出有边界的结论。',
        ],
        evidenceChecklist: [
          '至少点名一条来源标题或来源类型。',
          '写明一条材料能证明的事实和一条需要推论的判断。',
          '说明缺席声音或可靠性限制。',
        ],
        reflectionPrompt: '当材料来自征服之后，你会怎样避免把结局倒推给 1519 年的摊主？',
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
        excerpt: '殖民早期材料记录中部墨西哥社会、市场、物品和图像知识。',
        sourceQuestion: '纳瓦作者参与的殖民材料能证明什么，又受谁的提问框架限制？',
        reliabilityNote: '材料珍贵但形成于征服之后，受传教、翻译和殖民权力影响。',
        perspective: '殖民早期纳瓦合作者与传教士视角',
        evidenceTags: ['市场物品', '殖民记录', '翻译权力'],
      },
      {
        title: 'The Conquest of New Spain',
        creator: 'Bernal Díaz del Castillo',
        sourceType: 'primary',
        relevance: '征服者回忆录中描述特拉特洛尔科市场规模和秩序，可作为外来观察材料。',
        excerpt: '征服者回忆录描写大市场规模和秩序，提供外来目击叙事。',
        sourceQuestion: '外来目击能证明市场震撼感，能否代表本地摊主经验？',
        reliabilityNote: '回忆录带有自我辩护和征服者立场，需与本地材料互证。',
        perspective: '西班牙征服者回忆视角',
        evidenceTags: ['外来目击', '市场规模', '征服者偏见'],
      },
      {
        title: 'Everyday Life in the Aztec World',
        creator: 'Frances F. Berdan 与 Michael E. Smith',
        sourceType: 'scholarship',
        relevance: '综合阿兹特克社会、市场、家庭和经济生活，适合校准普通人场景。',
        excerpt: '研究综合家庭、市场、贡赋和经济生活，校准普通人场景。',
        sourceQuestion: '现代综合能如何补足殖民材料中的普通人缺口？',
        reliabilityNote: '二手研究可校准背景，但具体课堂判断仍要标明推论层级。',
        perspective: '现代中美洲社会史视角',
        evidenceTags: ['普通人生活', '贡赋市场', '背景校准'],
      },
    ],
  },
]
