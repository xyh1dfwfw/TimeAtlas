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

export type AtlasMapRoute = {
  id: string
  title: string
  subtitle: string
  lensKey: CompareLensKey
  scenarioIds: string[]
  routeQuestion: string
  mapFocus: string
  classroomUse: string
  assignmentPrompt: string
  evidencePrompts: string[]
  deliverables: string[]
  tags: string[]
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
  {
    id: 'labor-discipline-and-safety',
    title: '劳动纪律与安全边界',
    subtitle: '把汴京学徒、曼彻斯特纺织工和战时伦敦居民放在同一条“普通人如何承受制度化风险”的路径上。',
    lensKey: 'risk-safety',
    scenarioIds: ['song-bianjing-apprentice', 'industrial-manchester-mill-worker', 'wwii-london-civilian'],
    drivingQuestion: '当工作、训练或公共安全被制度安排进日常，普通人怎样在服从、协商和自保之间选择？',
    whyTheseScenarios:
      '汴京茶铺学徒、曼彻斯特纺织工和伦敦空袭居民都不是宏大政策的制定者，却每天面对钟点、规章、监督、事故和安全命令。三者适合比较劳动纪律、城市机构和普通人的风险感知。',
    tasks: [
      '为每个场景标出一种“必须服从的时间表”和一种“身体或家庭承担的风险”。',
      '比较学徒契约、工厂制度和战时民防：哪一种最像保护，哪一种最像控制？为什么？',
      '写一段 180 字判断：普通人的安全更依赖个人谨慎、同伴互助，还是制度改革？必须引用三个场景证据。',
    ],
    discussionMoves: [
      '先让学生画出三人的一天中谁在控制时间：师傅、机器、政府警报、家庭还是市场。',
      '追问“纪律”是否只意味着压迫，也可能提供技能、工资、秩序或避难资源。',
      '要求每个小组指出一条看似个人选择、实际被制度条件塑形的行动。',
    ],
    rubric: [
      '能把劳动纪律、机构规则和风险后果连接起来，而不是只描述辛苦',
      '能比较保护与控制如何同时存在',
      '至少使用三个场景中的具体证据，并说明证据边界',
      '结论能体现普通人的能动性和限制并存',
    ],
  },
  {
    id: 'atlantic-sugar-coerced-labor',
    title: '大西洋糖业、强制劳动与沉默档案',
    subtitle: '连接圣多明各、曼彻斯特、孟买和广州，追问商品帝国怎样把甜味、棉布、港口和缺席声音连在一起。',
    lensKey: 'source-credibility',
    scenarioIds: ['saint-domingue-sugar-worker', 'industrial-manchester-mill-worker', 'colonial-bombay-mill-worker', 'qing-guangzhou-comprador'],
    drivingQuestion: '当糖、棉布和港口账簿在帝国市场中流动时，谁的劳动被强制、谁能留下文字，哪些声音只能通过法律、清单、审判或后来研究间接看见？',
    whyTheseScenarios:
      '圣多明各糖园显示大西洋奴隶制与暴力制糖经济，曼彻斯特和孟买显示工业棉纺如何依赖全球原料、工厂纪律与殖民城市，广州则呈现港口中介、贸易规制和帝国压力。四站共同训练学生把商品链写成权力链、劳动链和史料沉默链。',
    tasks: [
      '为四站各写一条“商品—劳动制度—权力机构—可见/缺席声音”的证据链。',
      '比较强制劳动、工资劳动、殖民监管和口岸中介的差异：哪些不是同一种不自由，却都被商品帝国重新安排？',
      '用 220 字回答：来源中谁最常被记录为数字、类别或问题，而不是能自述的人？必须提出一种补充材料设想。',
    ],
    discussionMoves: [
      '先要求学生把“糖很甜”“棉布很轻”改写成“谁割蔗、谁纺纱、谁被检查、谁被记账”。',
      '追问每条来源的产生者：殖民法律、种植园清单、工厂调查、港口账簿和现代研究各自为什么记录这些人。',
      '提醒学生不要把所有劳动约束等同；比较必须同时承认奴隶制暴力的特殊性和其他帝国劳动制度的约束。',
    ],
    rubric: [
      '能把商品帝国与具体劳动制度、强制机制和港口/工厂/种植园空间连接起来',
      '能谨慎区分奴隶制、工资劳动、殖民行政和贸易中介的不同权力结构',
      '至少使用四站证据，并说明来源能证明什么、不能证明什么',
      '结论能主动讨论源自账簿、法律和调查材料的 source silence，而不是替缺席者编造完整内心',
    ],
  },
  {
    id: 'cotton-empire-labor-discipline',
    title: '棉花、帝国与劳动纪律',
    subtitle: '连接曼彻斯特、孟买和广州，追问棉布商品链怎样重组城市劳动、监管和殖民秩序。',
    lensKey: 'market-exchange',
    scenarioIds: ['industrial-manchester-mill-worker', 'colonial-bombay-mill-worker', 'qing-guangzhou-comprador'],
    drivingQuestion: '一条棉花/棉布链如何把机器时间、殖民城市管理、口岸贸易和普通劳动者的身体风险连在一起？',
    whyTheseScenarios:
      '曼彻斯特、孟买和广州都处在 19 世纪棉纺与帝国交换网络中：曼彻斯特显示早期工厂纪律，孟买显示殖民港口工业化与女性移民劳动，广州显示口岸中介和帝国贸易压力。三者能帮助学生把商品链写成劳动、监管与风险链。',
    tasks: [
      '绘制三站棉花/棉布联系图：原料、机器、港口、工资、监管和风险各放在哪一站？',
      '比较三人面对的劳动纪律：厂钟、殖民警察/卫生行政、海关和商馆规则分别怎样限制行动？',
      '用 200 字回答：全球交换带来的不是抽象“连通”，而是谁的时间、身体和家庭被重新安排？必须引用三站证据。',
    ],
    discussionMoves: [
      '先让学生把“商品流动”箭头改写成“谁加班、谁迁移、谁检查、谁承担风险”。',
      '追问帝国制度在每一站的形态：议会工厂法、殖民市政/防疫行政、海关和口岸规则是否都像市场规则？',
      '安排一组专门寻找性别差异：少年工、女性移民工和买办助手的家庭责任与可见度有何不同。',
    ],
    rubric: [
      '能把棉花/棉布商品链与劳动纪律、殖民监管和口岸制度连接起来',
      '能比较至少三种制度力量，而不是只说“贸易全球化”',
      '能使用曼彻斯特、孟买、广州三站具体证据，并说明来源边界',
      '结论能体现普通人的能动性、脆弱性和性别/身份差异',
    ],
  },
  {
    id: 'monsoon-port-worlds',
    title: '季风港口世界：语言、信任与国家权力',
    subtitle: '连接马六甲、广州、长安和巴格达，追问港口与市场中介如何让远方交易变成可执行的日常工作。',
    lensKey: 'market-exchange',
    scenarioIds: ['malacca-monsoon-port-broker', 'qing-guangzhou-comprador', 'tang-changan-merchant', 'abbasid-baghdad-scribe'],
    drivingQuestion: '当商品、文书和消息穿过多语言世界时，普通中介怎样建立信任，又怎样被国家、帝国和来源视角限制？',
    whyTheseScenarios:
      '马六甲港口经纪/码头通译、广州买办助手、长安西市商人和巴格达抄写员都依赖语言、账本、信用与制度接口工作。四站把海港、口岸、市集和书籍城市并置，帮助学生看到“连接世界”的劳动并不浪漫，而是被税册、关卡、赞助、国家暴力和来源偏向共同塑形。',
    tasks: [
      '为四站各标出一种中介劳动：翻译、记账、撮合、校读、信用担保或路线消息。',
      '比较信任如何形成：靠熟人、文书、官署许可、宗教/社群名声，还是货物交割记录？',
      '写一段 220 字判断：港口和市场中介是在扩大交流，还是在替更强的权力吸收风险？必须指出一条来源视角限制。',
    ],
    discussionMoves: [
      '先把“贸易路线”改写成“谁听懂、谁担保、谁盖章、谁被追责”的工作链。',
      '追问语言能力何时变成机会，何时变成被各方怀疑或利用的风险。',
      '要求每组为一条来源贴上视角标签：旅行者、征服者、朝廷记录、地方编年、现代研究。',
    ],
    rubric: [
      '能把港口/市场连接拆成具体中介劳动，而不是只说“贸易繁荣”',
      '能比较语言、信任、文书和国家权力的共同作用',
      '至少使用四站证据，并说明来源能证明与不能证明的边界',
      '结论能承认中介的能动性、脆弱性和被档案记录方式的偏向',
    ],
  },
]

export const atlasMapRoutes: AtlasMapRoute[] = [
  {
    id: 'knowledge-cities-route',
    title: '知识城市：纸张、手稿与考试',
    subtitle: '从巴格达到廷巴克图再到江南，追踪知识如何依靠城市、媒介和门槛流动。',
    lensKey: 'knowledge-transmission',
    scenarioIds: ['abbasid-baghdad-scribe', 'timbuktu-manuscript-student', 'ming-jiangnan-scholar'],
    routeQuestion: '知识网络为什么总是同时扩大机会，又制造新的进入门槛？',
    mapFocus: '地图上连接伊斯兰世界、撒哈拉贸易网络与江南出版/科举社会，时间线从 9 世纪延伸到 16 世纪。',
    classroomUse: '适合让学生先看空间距离，再比较纸张、手稿、师承、商业出版和考试制度。',
    assignmentPrompt: '制作一张三站知识流动图：每站标出媒介、进入门槛、权威来源和被排除的学习者。',
    evidencePrompts: [
      '每一站用一条 Scene Reader 证据说明知识如何被媒介或城市空间承载。',
      '从 Source Reader 中选择一条能显示权威、师承或制度门槛的材料。',
      '比较三站中谁最容易被排除在知识网络之外，并解释证据边界。',
    ],
    deliverables: ['三站知识流动图', '两条来源证据', '一句关于“技术是否带来知识公平”的判断'],
    tags: ['知识城市', '纸张', '手稿', '考试', '教育门槛'],
  },
  {
    id: 'market-corridors-route',
    title: '市场走廊：城市交换与制度边界',
    subtitle: '把长安西市、汴京茶铺、广州口岸和特诺奇蒂特兰集市放进同一张交易地图。',
    lensKey: 'market-exchange',
    scenarioIds: ['tang-changan-merchant', 'song-bianjing-apprentice', 'qing-guangzhou-comprador', 'tenochtitlan-market-seller'],
    routeQuestion: '市场给普通人带来的选择空间，在哪些环节被税赋、监管、信用和帝国秩序重新塑形？',
    mapFocus: '路线从唐宋城市服务与丝路商品，延伸到清末口岸和美洲湖城集市，强调交易网络的空间尺度差异。',
    classroomUse: '适合启动市场比较、商品链追踪或“谁能自由交易”讨论。',
    assignmentPrompt: '为每个市场场景写一条“商品/服务—规则—风险—普通人策略”的证据链。',
    evidencePrompts: [
      '每一站标出一种商品、服务或交易关系，并说明它依赖的空间网络。',
      '用一条制度或来源证据解释市场自由被怎样限定。',
      '找出至少一个普通人为应对税赋、信用或监管而采取的策略。',
    ],
    deliverables: ['四格市场证据链', '机会/限制双列表', '一段市场自由度比较'],
    tags: ['市场', '贸易', '口岸', '信用', '监管'],
  },
  {
    id: 'crisis-news-route',
    title: '危机新闻：远方消息如何抵达日常',
    subtitle: '把边境传闻、口岸压力、空袭警报和征服流言连成风险传播路线。',
    lensKey: 'risk-safety',
    scenarioIds: ['tang-changan-merchant', 'qing-guangzhou-comprador', 'wwii-london-civilian', 'tenochtitlan-market-seller'],
    routeQuestion: '当消息不完整、风险却已经逼近时，普通人依靠什么判断并行动？',
    mapFocus: '路线跨越欧亚、美洲与战时欧洲，强调消息从远方事件转化为个人安全决策的过程。',
    classroomUse: '适合先遮住真实历史结局，让学生只凭场景证据判断风险，再回看时间线。',
    assignmentPrompt: '给每个场景写一条“消息—判断—行动—后果”的风险链，并标出仍不确定的信息。',
    evidencePrompts: [
      '每一站记录消息来自哪里，以及当事人为什么无法完全确认。',
      '勾选能显示风险进入日常生活的 Scene Reader 或 Source Reader 证据。',
      '区分当事人当时能知道的信息与我们事后才知道的结局。',
    ],
    deliverables: ['四条风险传播链', '短期/长期风险区分', '不确定信息清单'],
    tags: ['危机新闻', '风险', '安全', '传闻', '警报'],
  },
  {
    id: 'labor-safety-route',
    title: '劳动纪律与安全：时间表、身体与制度',
    subtitle: '从茶铺学徒、曼彻斯特纺织女工到战时伦敦居民，看制度化时间如何进入身体。',
    lensKey: 'risk-safety',
    scenarioIds: ['song-bianjing-apprentice', 'industrial-manchester-mill-worker', 'wwii-london-civilian'],
    routeQuestion: '纪律什么时候像保护，什么时候像控制？普通人的安全边界由谁决定？',
    mapFocus: '路线把前工业城市服务、工业工厂制度和战时民防并置，突出时间、规章与身体风险。',
    classroomUse: '适合劳动史、安全史或制度约束单元，帮助学生避免只把辛苦写成个人品格问题。',
    assignmentPrompt: '比较三人的一天：谁控制时间，谁承担身体风险，谁拥有协商空间？',
    evidencePrompts: [
      '每一站找出时间表、规章或警报如何安排身体行动。',
      '选择一条能体现“保护”和“控制”同时存在的证据。',
      '说明普通人的协商空间在哪里，以及哪些制度边界无法越过。',
    ],
    deliverables: ['时间控制图', '保护/控制判断表', '180 字安全边界论证'],
    tags: ['劳动纪律', '安全', '工厂', '学徒', '民防'],
  },
  {
    id: 'industrial-global-exchange-route',
    title: '工业城市与全球交换',
    subtitle: '从广州口岸、曼彻斯特工厂、孟买棉纺厂到长安与特诺奇蒂特兰，追问全球交换如何改变城市劳动。',
    lensKey: 'market-exchange',
    scenarioIds: ['qing-guangzhou-comprador', 'industrial-manchester-mill-worker', 'colonial-bombay-mill-worker', 'tang-changan-merchant', 'tenochtitlan-market-seller'],
    routeQuestion: '跨区域交换如何把远方商品、劳动力纪律和帝国压力带进城市普通人的一天？',
    mapFocus: '路线把古代贸易城市、清末口岸、英国工业化城市、殖民孟买工厂和美洲湖城市场放在一张长时段交换图上。',
    classroomUse: '适合做长时段比较：不要只问“有没有贸易”，而要问交换网络如何重组劳动和风险。',
    assignmentPrompt: '选择两座城市，比较远方交换如何改变本地工作节奏、价格风险或制度压力。',
    evidencePrompts: [
      '为两座城市各记录一条远方商品、劳动力或帝国压力进入日常的证据。',
      '比较交换网络改变了谁的工作节奏、收入风险或安全边界。',
      '写出一条仍需更多来源验证的全球交换联系线。',
    ],
    deliverables: ['两城比较卡', '一条商品/劳动联系线', '一个关于全球交换代价的判断'],
    tags: ['工业城市', '全球交换', '城市劳动', '商品链', '帝国压力'],
  },
  {
    id: 'sugar-cotton-empire-route',
    title: '糖与棉的帝国路线：强制、工厂与港口中介',
    subtitle: '从加勒比糖园到英国工业棉纺、殖民孟买棉厂和广州口岸，追踪商品帝国如何组织劳动与沉默。',
    lensKey: 'institutional-constraints',
    scenarioIds: ['saint-domingue-sugar-worker', 'industrial-manchester-mill-worker', 'colonial-bombay-mill-worker', 'qing-guangzhou-comprador'],
    routeQuestion: '糖和棉这些日常商品怎样依赖不同形式的强制、纪律、殖民监管与港口调解，并把普通人的身体写进账簿却常不写成声音？',
    mapFocus: '路线从 1791 年圣多明各糖业核心区出发，转向 1840 年代曼彻斯特棉纺工业，再到 1896 年殖民孟买棉纺厂与 1838 年广州口岸，强调大西洋奴隶制、工业资本主义、殖民城市和清代口岸制度的连接与差异。',
    classroomUse: '适合工业革命、奴隶制与废奴、殖民经济或全球商品链单元；教师应强调比较不是把 enslaved people 做成游戏角色，而是训练证据、约束和 source silence 判断。',
    assignmentPrompt: '制作一张四站“糖—棉帝国证据地图”：每站标出商品、劳动制度、强制/监管机制、来源类型、一个缺席声音和一个谨慎结论。',
    evidencePrompts: [
      '在圣多明各站，用 Code Noir、Moreau 描述或种植园清单说明制度暴力与来源沉默之间的关系。',
      '在曼彻斯特与孟买站，各找一条工厂时间、机器风险或殖民城市监管证据，说明工资劳动仍被制度强烈约束。',
      '在广州站，说明口岸中介、账簿和贸易规制如何调解远方商品，同时也改变谁承担政治与法律风险。',
      '为四站各写一句“这条来源不能直接告诉我们……”以避免把档案空白填成确定叙事。',
    ],
    deliverables: ['四站商品帝国证据地图', '强制/纪律/监管比较表', 'source silence 注释清单', '220 字谨慎历史论证'],
    tags: ['大西洋糖业', '棉花帝国', '强制劳动', '港口中介', '来源沉默'],
  },
  {
    id: 'cotton-empire-factory-time-route',
    title: '棉花帝国与工厂时间',
    subtitle: '从曼彻斯特到孟买再到广州，追踪棉纺、港口、殖民行政与劳动纪律如何互相塑形。',
    lensKey: 'institutional-constraints',
    scenarioIds: ['industrial-manchester-mill-worker', 'colonial-bombay-mill-worker', 'qing-guangzhou-comprador'],
    routeQuestion: '棉花和棉布的跨区域流动，如何把工厂时间、殖民治理和口岸中介变成普通人的日常约束？',
    mapFocus: '路线连接英国兰开夏、殖民孟买和清末广州，突出棉纺工业、港口贸易、帝国制度和劳动纪律的空间联系。',
    classroomUse: '适合工业革命、殖民城市或全球商品链单元，让学生把“棉花帝国”拆成劳动、监管、性别和风险证据。',
    assignmentPrompt: '制作一张三站“棉花帝国时间表”：每站标出谁控制时间、谁承担身体风险、哪些制度声称在维持秩序。',
    evidencePrompts: [
      '每一站找出一条工厂、港口或口岸制度如何安排普通人行动的证据。',
      '比较曼彻斯特少年工、孟买女性移民工和广州买办助手的协商空间。',
      '说明一条来源能够证明的商品/劳动联系，以及一条仍需谨慎推论的联系。',
    ],
    deliverables: ['三站棉花帝国时间表', '劳动纪律比较卡', '一段关于殖民/工业秩序代价的证据论证'],
    tags: ['棉花帝国', '工厂时间', '殖民孟买', '曼彻斯特', '广州口岸'],
  },
  {
    id: 'monsoon-maritime-asia-route',
    title: '季风海上亚洲：港口中介、文书与商业风险',
    subtitle: '从巴格达、长安到马六甲、广州和孟买，追踪季风海、港口经纪、帝国文书与商业风险如何相互塑形。',
    lensKey: 'market-exchange',
    scenarioIds: ['abbasid-baghdad-scribe', 'tang-changan-merchant', 'malacca-monsoon-port-broker', 'qing-guangzhou-comprador', 'colonial-bombay-mill-worker'],
    routeQuestion: '季风海上亚洲怎样把语言中介、纸面手续、国家权力和商业风险连接成普通人的工作日常？',
    mapFocus: '路线从阿拔斯巴格达的纸本/商业知识和唐代长安的陆海商品想象，转到 1511 年马六甲季风港口，再延伸至广州口岸和殖民孟买港口工业，强调印度洋与南海网络中的季风节律、港口中介、文书治理、帝国冲突和商业不确定性。',
    classroomUse: '适合世界史、印度洋史、海上丝路或殖民经济单元；学生应把地图箭头拆成船期、翻译、账簿、通行许可、税赋、暴力和来源视角。',
    assignmentPrompt: '制作一张五站“季风海上亚洲路线图”：每站标出一种中介工作、一种文书或制度、一项商业风险、一条来源证据和一个谨慎结论。',
    evidencePrompts: [
      '在巴格达与长安站，找出纸张、账本、商品消息或市场监管如何支撑远距离交换。',
      '在马六甲站，用季风等待、通译/经纪、海关税册或征服压力说明港口中介为何既有价值又危险。',
      '在广州与孟买站，比较口岸文书、殖民/帝国行政和港口工业如何把远方市场风险转化为个人劳动或法律风险。',
      '为每站写一句“这条来源最可能高估或忽略……”以检查旅行者、征服者、官方档案和现代研究的视角。',
    ],
    deliverables: ['五站季风海上亚洲路线图', '港口中介工作链', '文书/国家权力比较表', '商业风险证据提示卡', '220 字谨慎历史论证'],
    tags: ['印度洋', '季风海', '马六甲', '港口中介', '文书治理', '商业风险'],
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
  {
    id: 'industrial-manchester-mill-worker',
    title: '曼彻斯特棉纺厂的钟声',
    era: '英国早期工业化',
    year: 1842,
    location: '曼彻斯特安科茨棉纺区',
    region: '英格兰西北部兰开夏',
    coordinates: [53.4808, -2.2426],
    identity: '住在工厂街区的少年棉纺工',
    role: '纺纱间接线工与清扫助手',
    age: 15,
    theme: '工业化、劳动纪律、城市安全',
    accent: '#8f6a4a',
    summary:
      '你在曼彻斯特一座蒸汽棉纺厂工作。钟声、机器和监工把一天切成细小片段；工资让家庭能交房租，棉尘、噪声、罚款和短工时改革的传闻也把风险带进每一次呼吸。',
    atmosphere:
      '清晨雾气混着煤烟压在砖墙上。高窗内的传动带不停抖动，棉絮像灰白雪片粘在头发和睫毛上。街口有人读报谈《十小时法案》，厂门口的钟却先响了。',
    sceneBeats: [
      {
        timeLabel: '清晨五点半',
        title: '厂钟比家里的炉火更早醒来',
        sensoryDetail: '煤烟、潮湿羊毛披肩和街沟气味混在一起，靴底踩过黑泥，厂钟催人进门。',
        historicalTension: '工业城市的工资机会依赖严格时间纪律，迟到罚款会直接挤压家庭房租和食物。',
        evidenceHook: '把家庭预算、城市住房和工厂钟点放在同一张证据卡上，追问时间怎样变成纪律。',
        learnerPrompt: '这一天最先控制你的，是家庭需要、厂规，还是城市贫困？为什么？',
        linkedDailyLifeKeys: ['home', 'work', 'risks'],
        linkedSourceTitles: ['Report of the Factory Inspectors, 1842', 'The Making of the English Working Class'],
      },
      {
        timeLabel: '上午机器全开',
        title: '棉絮、皮带和接线的手',
        sensoryDetail: '纺锭尖声连成一片，棉絮钻进喉咙，传动带在头顶像黑色河流一样奔跑。',
        historicalTension: '机器提高产量，也把儿童和少年放进速度、噪声和事故风险之中。',
        evidenceHook: '用工厂调查、检察报告和伤病描述比较“效率”与“身体代价”。',
        learnerPrompt: '如果机器停一分钟会损失工资，谁会为安全减速？谁有权决定？',
        linkedDailyLifeKeys: ['work', 'risks', 'education'],
        linkedSourceTitles: ['Factories Inquiry Commission Report, 1833', 'The Condition of the Working Class in England'],
      },
      {
        timeLabel: '午间短歇',
        title: '面包、茶和十小时传闻',
        sensoryDetail: '冷面包边沾着棉尘，淡茶还没凉，年长工人已经在争论请愿和罢工消息。',
        historicalTension: '工人并非只被动受害；请愿、工会、罢工和短工时运动提供发声渠道，但会带来失业或黑名单风险。',
        evidenceHook: '把 1842 年工业区骚动、工时改革和工人家庭利益放在一起，分析集体行动的代价。',
        learnerPrompt: '你会把短工时看成安全改革、工资威胁，还是尊严问题？',
        linkedDailyLifeKeys: ['food', 'freedoms', 'risks'],
        linkedSourceTitles: ['UK Parliament: Factory Acts', 'The Making of the English Working Class'],
      },
      {
        timeLabel: '夜里回到背街',
        title: '同一座城市里的工资和污水',
        sensoryDetail: '工厂灯光从高窗漏出，背街屋里几户共用水泵，湿墙上有煤灰和霉味。',
        historicalTension: '工业工资把家庭吸引到城市，却没有自动带来安全住房、干净水源或稳定教育。',
        evidenceHook: '用恩格斯的城市观察与现代研究互证：城市环境也是工业劳动的一部分。',
        learnerPrompt: '下班后离开机器，工业化的风险真的结束了吗？',
        linkedDailyLifeKeys: ['home', 'education', 'risks'],
        linkedSourceTitles: ['The Condition of the Working Class in England', 'British Library: Industrial Revolution sources'],
      },
    ],
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '工资买来的面包和淡茶',
        text: '早餐常是面包、茶和少量黄油或燕麦。工资按周计算，迟到罚款、短工或食价上涨都会让餐桌立刻变薄。',
      },
      {
        key: 'home',
        label: '居所',
        title: '工厂街区的拥挤房间',
        text: '你家租住在靠近厂区的背街，几户共用水源和厕所。靠近工厂节省通勤时间，也意味着煤烟、潮湿和传染病风险。',
      },
      {
        key: 'work',
        label: '工作',
        title: '钟点、监工和机器速度',
        text: '你接断线、清棉絮、协助看机器。工作节奏由蒸汽机、传动带和监工决定，出错会影响产量，也可能受罚。',
      },
      {
        key: 'education',
        label: '见识',
        title: '半日学校和报纸碎片',
        text: '工厂法推动少年工接受有限 schooling，但疲劳和家庭收入压力常让学习断断续续。你更多从工友、教堂课堂和报纸朗读中了解改革。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '事故、棉尘和失业',
        text: '飞转机器、开放传动带、棉尘和长时间站立都威胁身体。要求改善条件可能带来报复，经济低迷又会让全家失去收入。',
      },
      {
        key: 'freedoms',
        label: '机会',
        title: '现金工资与城市网络',
        text: '工厂工资给少年和家庭带来现金收入，城市也提供教堂、互助社、工人政治和转厂机会；这些机会始终受雇主、市场和性别年龄规则限制。',
      },
    ],
    timeline: [
      { year: '1780s-1820s', title: '棉纺厂在兰开夏扩张', text: '水力与蒸汽动力推动棉纺集中到大型工厂和工业城镇。' },
      { year: '1833', title: '工厂法限制童工工时', text: '英国《工厂法》规定纺织业儿童工时与教育要求，并设置工厂监察员。' },
      { year: '1842', title: '工业区请愿与罢工浪潮', text: '经济困难、宪章运动和工时诉求在兰开夏等工业区交织。' },
      { year: '1844-1847', title: '进一步工厂改革', text: '后续法律加强机器防护、女性和少年工时限制，十小时法案在 1847 年通过。' },
    ],
    decision: {
      prompt: '午休时，年长工人请你把名字加到支持缩短工时的请愿名单上。你知道这可能保护身体，也可能被监工记住。你怎么做？',
      context: '1842 年曼彻斯特周边有工时、工资和宪章派政治的讨论。少年工需要工资帮家里交租，也越来越清楚长工时和事故风险。',
      options: [
        {
          id: 'sign-petition',
          label: '签名支持短工时',
          stance: '把安全变成公共诉求',
          description: '加入工友请愿，希望用集体声音推动更短工时和更严格检查。',
          immediate: '你获得同伴认可，也可能被监工视为麻烦人物。',
          longTerm: '工时改革可能改善少年工处境，但短期内家庭收入和工作稳定性仍不确定。',
          reflection: '集体行动能把个人伤痛变成制度问题，但普通工人要承担最先暴露的风险。',
        },
        {
          id: 'stay-quiet',
          label: '暂不签名，保住岗位',
          stance: '优先保护家庭收入',
          description: '继续工作，不公开表态，避免被扣工或失去推荐。',
          immediate: '你减少被针对的风险，家里下周房租更有保障。',
          longTerm: '沉默可能让危险制度延续，但对一个依赖周薪的家庭来说并非简单懦弱。',
          reflection: '普通人的政治选择常被生计约束，安全改革需要考虑收入替代和保护机制。',
        },
        {
          id: 'seek-inspector',
          label: '向工厂监察员提供线索',
          stance: '借助新制度而非公开冲突',
          description: '私下记录超时、机器防护或童工 schooling 问题，寻找监察员或教堂人士转达。',
          immediate: '证据更具体，但匿名未必可靠，且你需要识字者或可信中间人帮助。',
          longTerm: '监察制度可能推动改良，却受人员有限、地方阻力和证据不足限制。',
          reflection: '制度改革不是自动发生的；它需要普通人的信息，也会暴露普通人的脆弱位置。',
        },
      ],
    },
    realHistory:
      '19 世纪 30-40 年代，曼彻斯特和兰开夏棉纺工业集中使用蒸汽动力、童工和少年工。1833 年工厂法设置监察并限制儿童工时；1842 年经济困难、罢工和宪章运动使工业劳动问题更公开；1844 与 1847 年改革继续限制妇女和少年工工时并关注机器安全。',
    interpretationNote:
      '本场景合成一名 1842 年曼彻斯特少年棉纺工视角，依据工厂调查、工厂监察、工人运动和城市社会史。具体请愿选择是课堂情境，不指向某个可查个人档案。',
    lessonPack: {
      inquiryQuestion: '工业化怎样把时间、工资和身体安全重新组织进普通人的一天？',
      quickStart: [
        '定位 1842 年曼彻斯特、棉纺厂、少年工和工厂法。',
        '找出一条“机器效率”证据和一条“身体代价”证据。',
        '判断签名、沉默或向监察员提供线索的利弊。',
      ],
      classroomFlow: {
        quick: {
          title: '10 分钟工厂钟声导入',
          steps: ['读清晨厂钟场景', '在日常切片中圈出时间纪律、工资和风险', '写一句“工业时间如何进入家庭”'],
        },
        source: {
          title: '22 分钟工厂调查 Source Lab',
          steps: ['比较工厂调查、监察报告和恩格斯观察的视角', '标注哪些证据来自官方调查、哪些来自批判性观察', '写出一条需要谨慎推论的普通工人经验'],
        },
        debate: {
          title: '25 分钟短工时改革辩论',
          steps: ['工人家庭、厂主、监察员、改革者四组准备', '每组必须同时说明安全和收入', '全班形成一条“改革必须补上什么保护”的结论'],
        },
      },
      checkQuestions: [
        {
          question: '为什么工厂钟声是一种制度证据？',
          answer: '它把劳动时间标准化，并通过迟到罚款、监工和机器节奏影响工资与家庭生活。',
          teacherNote: '引导学生把声音细节连接到劳动纪律，而不是只当作氛围描写。',
        },
        {
          question: '工厂法为什么既是保护也是限制？',
          answer: '它限制儿童和少年工时、要求教育和检查，但执行依赖监察力量，也可能影响家庭收入安排。',
          teacherNote: '避免把改革写成瞬间解决全部问题。',
        },
        {
          question: '恩格斯的观察能直接代表所有工人吗？',
          answer: '不能。他提供强烈的城市贫困批判视角，但需要与官方调查、地方材料和现代研究互证。',
          teacherNote: '训练来源视角和政治立场判断。',
        },
      ],
      misconceptions: [
        { misconception: '工业化只意味着技术进步和产量增加。', correction: '技术进步同时改变时间纪律、家庭预算、城市环境和身体风险。' },
        { misconception: '童工改革一通过，儿童就立刻安全上学。', correction: '1833 年后有监察和 schooling 要求，但执行、贫困和家庭工资依赖仍限制改革效果。' },
        { misconception: '普通工人完全没有政治行动能力。', correction: '请愿、罢工、互助社、宗教和读报网络都提供行动空间，只是代价很高。' },
      ],
      discussionRoles: [
        { role: '少年接线工', task: '说明工资、疲劳和受伤风险如何影响是否签名。' },
        { role: '母亲或房客家人', task: '从房租和食物角度评估短工时改革。' },
        { role: '工厂监察员', task: '说明法律能检查什么、检查不到什么。' },
        { role: '厂主代表', task: '用产量、竞争和纪律为长工时辩护，并接受证据质询。' },
      ],
      exitTickets: [
        '写出一条工厂制度如何控制时间。',
        '指出一条来源能证明的安全风险和一条仍缺席的工人声音。',
      ],
    },
    activityPacks: [
      {
        id: 'manchester-factory-clock-map',
        title: '工厂钟声时间地图',
        mode: 'warmup',
        durationMinutes: 10,
        audience: '全班导入或个人观察',
        prompt: '把少年工一天中的时间控制者画出来：家庭、厂钟、机器、监工、学校和街区。',
        materials: ['Scene Reader：厂钟比家里的炉火更早醒来', '日常切片：工作', '时间线：1833 工厂法'],
        steps: ['画出从起床到下班的 5 个时间节点。', '给每个节点标注控制者和可能的罚款或风险。', '写一句时间纪律如何影响家庭生活。'],
        deliverable: '一张 5 节点工厂时间地图。',
        successCriteria: ['能把时间节点与制度或机器相连。', '能指出至少一个家庭后果。', '能区分个人习惯和外部纪律。'],
        linkedSourceTitles: ['Report of the Factory Inspectors, 1842', 'UK Parliament: Factory Acts'],
        linkedSceneBeatTitles: ['厂钟比家里的炉火更早醒来', '棉絮、皮带和接线的手'],
      },
      {
        id: 'manchester-source-lab-safety',
        title: '工厂安全 Source Lab',
        mode: 'source-lab',
        durationMinutes: 24,
        audience: '小组史料判断',
        prompt: '用官方调查、监察报告和社会批判材料判断棉纺厂风险能被哪些来源看见。',
        materials: ['Factories Inquiry Commission Report 来源卡', 'Report of the Factory Inspectors 来源卡', 'Engels 来源卡'],
        steps: ['给每条来源标注 primary / institution / scholarship 或观察立场。', '摘出一条关于工时、机器或城市环境的证据。', '写出来源不能直接告诉我们的少年工感受。'],
        deliverable: '一张三栏来源可靠性卡。',
        successCriteria: ['能区分官方调查、监察和批判性观察。', '能说明材料可证明的风险类型。', '能指出缺席声音和推论边界。'],
        linkedSourceTitles: ['Factories Inquiry Commission Report, 1833', 'Report of the Factory Inspectors, 1842', 'The Condition of the Working Class in England'],
        linkedSceneBeatTitles: ['棉絮、皮带和接线的手', '同一座城市里的工资和污水'],
      },
      {
        id: 'manchester-ten-hours-roleplay',
        title: '十小时诉求角色会议',
        mode: 'roleplay',
        durationMinutes: 28,
        audience: '四角色小组协商',
        prompt: '围绕“是否支持更短工时”进行会议，每个角色必须同时处理安全、工资和执行问题。',
        materials: ['决策选项卡', 'Scene Reader：面包、茶和十小时传闻', 'UK Parliament: Factory Acts 来源卡'],
        steps: ['分配少年工、家人、厂主、监察员角色。', '每组写出一个支持和一个担忧。', '协商一条既能减少事故又能保护家庭收入的改革条件。'],
        deliverable: '一份三条款工厂改革建议。',
        successCriteria: ['能从角色利益出发而非只说现代观点。', '能同时考虑安全和收入。', '能把法律执行问题纳入方案。'],
        linkedSourceTitles: ['UK Parliament: Factory Acts', 'The Making of the English Working Class'],
        linkedSceneBeatTitles: ['面包、茶和十小时传闻', '厂钟比家里的炉火更早醒来'],
      },
    ],
    missions: [
      {
        id: 'explain-factory-discipline',
        title: '说明工厂纪律',
        instruction: '解释厂钟、机器速度和迟到罚款如何把时间变成劳动纪律。',
        evidenceUse: '引用清晨厂钟、钟点监工和工厂监察来源。',
        deliverable: '一段 120 字以内的证据说明，回答“时间怎样在棉纺厂里变成纪律？”',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '证据说明',
        steps: [
          '重读清晨厂钟和工作日常切片。',
          '找出至少两条控制时间的机制。',
          '说明这些机制如何影响工资、家庭或安全。',
        ],
        evidenceChecklist: [
          '至少点名厂钟、机器速度或罚款中的两项。',
          '说明纪律对家庭预算或身体风险的影响。',
          '引用一条来源标题或场景线索。',
        ],
        reflectionPrompt: '如果没有厂钟，工厂还能维持同样产量吗？代价会转移给谁？',
        outputTemplate: [
          '核心判断：',
          '机制一：',
          '机制二：',
          '对普通人的影响：',
          '证据标注：',
        ],
        rubric: [
          '能把时间控制解释为制度而非个人习惯。',
          '至少使用两条具体证据。',
          '能说明家庭或安全后果。',
          '语言简洁，因果清楚。',
        ],
        sentenceStarters: [
          '工厂纪律首先体现在……',
          '这不只是钟声，因为……',
          '对少年工来说，后果是……',
          '这条证据说明……',
        ],
        linkedSourceTitles: ['Report of the Factory Inspectors, 1842', 'UK Parliament: Factory Acts'],
      },
      {
        id: 'trace-machine-risk',
        title: '追踪机器风险链',
        instruction: '说明机器速度如何从产量要求传导到事故、疲劳和改革诉求。',
        evidenceUse: '连接棉絮皮带场景、工厂调查和短工时传闻。',
        deliverable: '一条 4 步因果链：产量—纪律—身体风险—改革诉求。',
        estimatedMinutes: 15,
        difficulty: '进阶',
        taskType: '因果链',
        steps: [
          '找出产量或机器速度的起点。',
          '写出监工、罚款或长工时怎样放大风险。',
          '把身体风险连接到短工时或监察制度。',
        ],
        evidenceChecklist: [
          '因果链必须包含机器、工时和身体三类证据。',
          '说明一个中介机制，如罚款、监工或家庭工资依赖。',
          '避免只说“机器很危险”，要说明为什么危险被制度放大。',
        ],
        reflectionPrompt: '技术本身危险，还是技术被组织进工厂制度后才变得危险？',
        outputTemplate: [
          '起点：',
          '中介环节：',
          '身体后果：',
          '改革诉求：',
          '一句总结：',
        ],
        rubric: [
          '因果顺序清楚。',
          '能连接技术、制度和身体。',
          '至少引用两条场景或来源证据。',
          '结论不把责任简单推给单一因素。',
        ],
        sentenceStarters: [
          '风险链可以从……开始。',
          '机器速度通过……传导到身体。',
          '工人要求改革，是因为……',
          '最脆弱的环节是……',
        ],
        linkedSourceTitles: ['Factories Inquiry Commission Report, 1833', 'Report of the Factory Inspectors, 1842'],
      },
      {
        id: 'judge-ten-hours-choice',
        title: '判断是否签名',
        instruction: '站在少年棉纺工位置，权衡支持短工时请愿的收益、风险和信息限制。',
        evidenceUse: '使用决策选项、1842 时间线、家庭饮食和工资依赖线索。',
        deliverable: '一张 120 字以内角色判断卡：我会/不会/改用间接方式支持，因为……',
        estimatedMinutes: 16,
        difficulty: '进阶',
        taskType: '角色判断',
        steps: [
          '选择签名、沉默或向监察员提供线索。',
          '列出一个短期后果和一个长期后果。',
          '用至少两条证据说明这个选择符合角色处境。',
        ],
        evidenceChecklist: [
          '提到家庭收入或房租压力。',
          '提到身体安全或工时改革。',
          '承认监工报复、执行不足或信息不完整中的一项限制。',
        ],
        reflectionPrompt: '今天看起来“正确”的选择，在当时为什么可能很难做？',
        outputTemplate: [
          '我的选择：',
          '角色处境：',
          '支持证据：',
          '最大风险：',
          '有条件结论：',
        ],
        rubric: [
          '判断符合 1842 年少年工的信息和资源。',
          '收益与风险权衡完整。',
          '至少使用两条场景证据。',
          '能避免用现代安全观直接替角色决定。',
        ],
        sentenceStarters: [
          '站在少年工的位置，我会……',
          '这个选择的短期好处是……',
          '但家庭最担心……',
          '因此这不是简单的勇敢或胆怯，而是……',
        ],
        linkedSourceTitles: ['UK Parliament: Factory Acts', 'The Making of the English Working Class'],
      },
      {
        id: 'compare-sources-manchester',
        title: '比较工厂来源视角',
        instruction: '判断工厂调查、监察报告、恩格斯和现代研究分别能证明什么、遗漏什么。',
        evidenceUse: '对照 primary、institution 和 scholarship 来源，识别官方、批判者和历史学家的不同问题意识。',
        deliverable: '一张史料判断卡，列出“可证明 / 需谨慎 / 缺席声音”。',
        estimatedMinutes: 20,
        difficulty: '挑战',
        taskType: '史料判断',
        steps: [
          '选择两条以上来源，标注来源类型和作者立场。',
          '写出每条来源最能证明的一点。',
          '指出少年工本人声音在哪里缺席。',
        ],
        evidenceChecklist: [
          '至少比较两种来源类型。',
          '区分观察、调查、法律说明和后世解释。',
          '指出缺席声音或可靠性限制。',
        ],
        reflectionPrompt: '当我们没有这名少年工的日记时，怎样避免把他只写成统计数字？',
        outputTemplate: [
          '来源一及可证明内容：',
          '来源二及可证明内容：',
          '需要谨慎的地方：',
          '缺席声音：',
          '我的边界结论：',
        ],
        rubric: [
          '来源类型判断准确。',
          '能说明证据与推论边界。',
          '能识别政治立场或机构目的。',
          '结论保留普通人视角的复杂性。',
        ],
        sentenceStarters: [
          '这条来源最适合证明……',
          '但它不直接告诉我们……',
          '与另一条来源相比，差异在于……',
          '因此我会把结论限制在……',
        ],
        linkedSourceTitles: [
          'Factories Inquiry Commission Report, 1833',
          'Report of the Factory Inspectors, 1842',
          'The Condition of the Working Class in England',
          'The Making of the English Working Class',
        ],
      },
    ],
    keyTerms: [
      { term: '工厂法', definition: '英国议会针对工厂劳动，尤其儿童、少年和女性工时、教育与安全条件所作的系列法律改革。' },
      { term: '工厂监察员', definition: '1833 年后设立的执法人员，负责检查工厂是否遵守工时和童工等规定，但早期人手和权力有限。' },
      { term: '十小时运动', definition: '19 世纪英国要求限制工厂每日劳动时间的改革运动，1847 年十小时法案是重要节点。' },
      { term: '宪章运动', definition: '1830-40 年代英国工人阶级政治运动，要求扩大男性选举权等政治改革，并与工业区经济困境交织。' },
      { term: '劳动纪律', definition: '通过钟点、罚款、监工、工资和机器节奏等机制组织劳动者行为的制度化控制。' },
    ],
    compareAngles: [
      { title: '机器效率 vs. 身体安全', prompt: '当机器速度提高产量时，谁有权决定减速以保护工人？' },
      { title: '家庭工资 vs. 工时改革', prompt: '缩短工时为什么可能同时是保护和威胁？家庭预算怎样改变政治选择？' },
      { title: '官方调查 vs. 工人声音', prompt: '没有少年工日记时，哪些来源能帮助我们接近他的经验，哪些仍会遮蔽他？' },
    ],
    sourceEvidenceUse: '用工厂调查和监察报告确认工时、童工和监管制度，用恩格斯的城市观察呈现工业贫困批判，再用现代劳工史校准工人行动、家庭策略和改革语境。',
    sources: [
      {
        title: 'Factories Inquiry Commission Report, 1833',
        creator: '英国议会工厂调查委员会',
        sourceType: 'primary',
        relevance: '收集纺织工厂儿童劳动、工时、健康和教育状况证词，是理解 1833 年工厂法背景的重要材料。',
        excerpt: '调查材料记录儿童和少年在纺织工厂的长时间劳动、疲劳、教育不足和健康担忧。',
        sourceQuestion: '官方调查证词能怎样帮助我们理解儿童工厂劳动？它如何受提问者和改革议程影响？',
        reliabilityNote: '包含当时证词和观察，价值高；但问题设置、选取证人和改革政治会影响呈现方式。',
        perspective: '议会调查与改革辩论视角',
        evidenceTags: ['童工', '工时', '健康', '议会调查'],
      },
      {
        title: 'Report of the Factory Inspectors, 1842',
        creator: '英国工厂监察员',
        sourceType: 'institution',
        relevance: '显示 1833 年后工厂法执行、检查和违规问题，适合讨论法律改革与现场劳动之间的距离。',
        excerpt: '监察报告关注工时规定、童工年龄、教育要求和工厂执行情况，显示改革需要持续检查。',
        sourceQuestion: '监察员报告能证明法律执行的哪些环节？哪些工人经验可能仍然被表格化或遗漏？',
        reliabilityNote: '机构材料能呈现执法重点和统计，但受检查范围、雇主配合和官僚分类限制。',
        perspective: '国家监管与工厂执法视角',
        evidenceTags: ['工厂法执行', '监察', '制度改革', '违规'],
      },
      {
        title: 'The Condition of the Working Class in England',
        creator: 'Friedrich Engels',
        sourceType: 'primary',
        relevance: '基于 1840 年代曼彻斯特观察，描述工业城市住房、贫困、疾病和工人处境。',
        excerpt: '恩格斯把曼彻斯特工业街区写成工资劳动、拥挤住房、污水和阶级不平等交织的城市空间。',
        sourceQuestion: '一位政治批判者的强烈观察能揭示什么？又可能如何选择性强调苦难？',
        reliabilityNote: '接近当时工业城市观察且影响深远，但带有明确政治立场，需要与调查和现代研究互证。',
        perspective: '19 世纪社会主义批判与城市观察视角',
        evidenceTags: ['曼彻斯特', '城市贫困', '住房', '工人阶级'],
      },
      {
        title: 'UK Parliament: Factory Acts',
        creator: 'UK Parliament Living Heritage',
        sourceType: 'institution',
        relevance: '概述 19 世纪英国工厂法改革脉络，适合课堂核对 1833、1844、1847 等关键节点。',
        excerpt: '议会教育资源概述工厂法如何逐步限制儿童、少年和女性工时，并引入检查制度。',
        sourceQuestion: '机构概述如何帮助建立时间线？它会不会简化工人行动和地方执行差异？',
        reliabilityNote: '适合核对法律节点和议会背景，但不是普通工人生活的直接证词。',
        perspective: '现代议会公共史与制度史视角',
        evidenceTags: ['工厂法', '议会改革', '时间线', '公共史'],
        url: 'https://www.parliament.uk/about/living-heritage/transformingsociety/livinglearning/19thcentury/overview/factoryact/',
      },
      {
        title: 'British Library: Industrial Revolution sources',
        creator: 'British Library',
        sourceType: 'institution',
        relevance: '提供工业革命、城市化、劳动与改革的教学来源入口，可辅助学生寻找图像、文本和背景材料。',
        excerpt: '馆藏教育材料把工业增长、城市环境、劳动条件和改革辩论放在同一历史主题下。',
        sourceQuestion: '馆藏材料怎样帮助我们从单一工厂扩展到城市和社会改革？',
        reliabilityNote: '机构导览适合发现材料和背景，不应替代具体原始证词或研究论证。',
        perspective: '现代图书馆馆藏与教学资源视角',
        evidenceTags: ['工业革命', '馆藏材料', '城市化', '教学资源'],
        url: 'https://www.bl.uk/georgian-britain/articles/the-industrial-revolution',
      },
      {
        title: 'The Making of the English Working Class',
        creator: 'E. P. Thompson',
        sourceType: 'scholarship',
        relevance: '强调工人阶级形成、习俗、抗议和政治文化，帮助避免把工人只写成机器旁的受害者。',
        excerpt: '汤普森把工人阶级形成理解为经验、组织、文化和抗议共同塑造的历史过程。',
        sourceQuestion: '现代劳工史如何恢复普通工人的能动性，同时仍承认经济和制度限制？',
        reliabilityNote: '经典研究影响深远，也有时代和解释框架；用于校准工人政治文化时应与具体地方证据配合。',
        perspective: '现代社会史与劳工史视角',
        evidenceTags: ['工人阶级', '抗议', '能动性', '劳工史'],
      },
    ],
  },

  {
    id: 'colonial-bombay-mill-worker',
    title: '殖民孟买棉纺厂女工的一天',
    era: '英属印度晚期殖民工业化',
    year: 1896,
    location: '孟买帕雷尔—吉尔冈棉纺厂街区',
    region: '南亚西海岸孟买管辖区',
    coordinates: [18.969, 72.8205],
    identity: '从德干村庄来到孟买的年轻女性移民工',
    role: '棉纺厂绕线与清棉工，住在拥挤 chawl 的家庭成员',
    age: 22,
    theme: '殖民工业化、女性劳动、棉花帝国、城市防疫',
    accent: '#c7664d',
    summary:
      '你从德干内陆来到孟买，在棉纺厂里绕线、清棉、跟随机器节奏挣日工资。1896 年鼠疫传闻、殖民卫生检查、工厂钟声和家庭汇款一起压进一天：留在厂里意味着现金收入，离开城市也可能失去住处、工资和互助网络。',
    atmosphere:
      '阿拉伯海的潮湿空气裹着煤烟、棉絮和鱼市气味。厂房高窗透出黄色灯光，汽笛声划过帕雷尔街区；巷口有人低声谈论鼠疫检查队，chawl 走廊里孩子、锅碗和各地口音挤成一团。',
    sceneBeats: [
      {
        timeLabel: '清晨汽笛',
        title: 'chawl 走廊里的水罐和厂门',
        sensoryDetail: '公共水龙头前已经排队，湿棉布贴在肩上，远处汽笛提醒你今天不能迟到。',
        historicalTension: '移民工资让家庭获得现金，却把居住、卫生、通勤和工厂纪律捆在殖民城市空间里。',
        evidenceHook: '把 chawl 住房、女性移民劳动和工厂时间放在同一张证据卡上，看工业化如何进入家庭。',
        learnerPrompt: '这条走廊里的哪一个细节最能说明“城市机会”和“城市风险”同时存在？',
        linkedDailyLifeKeys: ['home', 'work', 'risks'],
        linkedSourceTitles: ['The Origins of Industrial Capitalism in India', 'Imperial Power and Popular Politics'],
      },
      {
        timeLabel: '上午机器全速',
        title: '棉絮在喉咙里，监工在过道上',
        sensoryDetail: '纱锭尖声压过说话声，棉絮粘在睫毛和手背，监工的脚步在机器间来回。',
        historicalTension: '殖民孟买工厂雇用大量本地移民劳动者，女性工资、工种和可替代性都受性别、家庭和雇主制度限制。',
        evidenceHook: '用工厂委员会材料和劳动史研究比较法律条文、工厂现场和女工身体经验之间的距离。',
        learnerPrompt: '如果法律规定、厂规和家庭需要给出不同答案，你认为女工最先会听见哪一种压力？',
        linkedDailyLifeKeys: ['work', 'food', 'risks'],
        linkedSourceTitles: ['Report of the Indian Factory Commission, 1890', 'Lost Worlds: Indian Labour and Its Forgotten Histories'],
      },
      {
        timeLabel: '午间短歇',
        title: '米饭、汇款和返乡传闻',
        sensoryDetail: '冷米饭和辣酱很快吃完，工友谈起家乡欠债、雨季收成和有人准备逃离鼠疫检查。',
        historicalTension: '移民工并非脱离乡村；工资、债务、婚姻、节庆返乡和亲族义务让城市劳动与农村家庭持续相连。',
        evidenceHook: '把工资用途、乡村联系和城市公共卫生危机连接起来，追问“离开城市”是否真是自由选择。',
        learnerPrompt: '返乡在这一刻是安全选择、经济风险，还是家庭责任？证据在哪里？',
        linkedDailyLifeKeys: ['food', 'home', 'freedoms'],
        linkedSourceTitles: ['Imperial Power and Popular Politics', 'Lost Worlds: Indian Labour and Its Forgotten Histories'],
      },
      {
        timeLabel: '傍晚鼠疫消息',
        title: '检查队、隔离营和女工的身体边界',
        sensoryDetail: '街角忽然安静下来，邻居把包袱塞进门后，孩子被叫进屋里，远处有马车和警靴声。',
        historicalTension: '1896 年后孟买鼠疫行政声称保护公共健康，但搜查、隔离和身体检查也激起隐私、性别尊严和殖民权力的冲突。',
        evidenceHook: '比较卫生行政报告、法律权力和社会史研究，判断公共安全何时变成强制控制。',
        learnerPrompt: '防疫命令怎样同时可能保护城市、伤害信任，并改变女工明天是否上工？',
        linkedDailyLifeKeys: ['risks', 'freedoms', 'home'],
        linkedSourceTitles: ['Bombay Plague Administration Report, 1896-97', 'Epidemic Diseases Act, 1897', 'Imperial Power and Popular Politics'],
      },
    ],
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '米饭、bhakri 和按日计算的饭钱',
        text: '餐食多是米饭、粗粮饼、豆类、辣酱或便宜鱼菜。日工资与出勤相连，病假、停工或逃离城市会立刻影响吃饭、房租和给乡村家人的钱。',
      },
      {
        key: 'home',
        label: '居所',
        title: 'chawl 里的床位、亲族和公共水源',
        text: '你住在靠近厂区的多层 chawl 或拥挤租屋，与亲属、同村人或工友共享空间。这样的网络提供介绍工作和照看孩子的帮助，也暴露在拥挤、火灾、疾病和检查之下。',
      },
      {
        key: 'work',
        label: '工作',
        title: '绕线、清棉和工厂钟点',
        text: '你的工作围绕纱线、棉絮和机器速度展开。女性常被分配到工资较低、被认为“适合手巧”的工种，实际劳动同样受噪声、粉尘、监工和罚款约束。',
      },
      {
        key: 'education',
        label: '见识',
        title: '口耳消息、工友网络和有限识字',
        text: '你可能只能读少量文字，更多依靠工友、亲族、街头读报和庙会/社区消息理解工资、法律和防疫。殖民法规常以英文和官署文书呈现，普通女工很难直接发声。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '棉尘、机器、鼠疫和强制检查',
        text: '机器伤害、棉尘、长时间站立和工资不稳是日常风险。1896 年后鼠疫与殖民防疫措施又带来隔离、搜查、离散和失去工作机会的风险。',
      },
      {
        key: 'freedoms',
        label: '机会',
        title: '现金工资、迁移和有限协商',
        text: '城市工资让你能还债、支持家人并在女性亲友网络中获得一定行动空间。可这种自由受性别规范、雇主、警察、市政卫生行政和乡村家庭责任共同限制。',
      },
    ],
    timeline: [
      { year: '1854', title: '孟买第一批现代棉纺厂出现', text: '19 世纪中后期，孟买凭借港口、资本和棉花贸易发展出重要纺织工业。' },
      { year: '1881-1891', title: '印度工厂立法逐步出现', text: '英属印度工厂法开始限制部分儿童劳动和工时，1891 年法案扩大若干保护；执行与覆盖范围仍有限，不能简单等同于充分劳动保护。' },
      { year: '1890', title: '印度工厂委员会调查', text: '委员会和官方报告收集工厂劳动、工时、女性与儿童就业等材料，反映殖民政府、雇主和改革者之间的争论。' },
      { year: '1896-1897', title: '孟买鼠疫与殖民防疫行政', text: '鼠疫在孟买暴发后，殖民政府采取检查、隔离、清扫和迁移控制等措施，公共健康目标与强制权力发生冲突。' },
      { year: '20 世纪初', title: '孟买纺织劳工政治增长', text: '工厂工人、社区网络和工会政治逐渐可见，但女性劳动者的声音常在档案和运动叙述中被边缘化。' },
    ],
    decision: {
      prompt: '傍晚回到 chawl，你听说附近街区要来鼠疫检查队。明天厂里点名照常，家乡亲戚却劝你先离开孟买。你怎么做？',
      context: '1896 年孟买鼠疫暴发后，公共卫生行政、警察搜查、隔离营和清扫措施引发恐惧与抵触。对女性移民工来说，选择还牵涉工资、住处、身体尊严、家庭汇款和亲族网络。',
      options: [
        {
          id: 'stay-and-work',
          label: '留下上工，依靠工友互通消息',
          stance: '优先保住工资与住处',
          description: '照常去厂里点名，和同住女工约定若检查队进入街区就互相提醒。',
          immediate: '你保住当天工资，也避免返乡路费和失去床位；但可能遇到检查、隔离或街区封锁。',
          longTerm: '持续工作能支撑家庭经济，却可能让身体暴露在疾病、强制行政和工厂粉尘的双重风险中。',
          reflection: '留下不是无知或顺从，而是工资、住房和互助网络把安全选择变得复杂。',
        },
        {
          id: 'return-village',
          label: '趁夜随亲友返乡',
          stance: '把身体安全和家族保护放在第一位',
          description: '带上少量衣物和积蓄，跟同村人离开孟买，先回德干家乡观望。',
          immediate: '你可能避开检查和城市疫情，也会失去工资、床位和工厂位置，路上还可能受到交通管制或盘查。',
          longTerm: '返乡能重新接入亲族保护，但债务、歉收或没有现金收入会把你推回迁移循环。',
          reflection: '逃离城市可以是抗议殖民防疫的方式，也可能是被迫放弃工业工资的风险选择。',
        },
        {
          id: 'petition-through-community',
          label: '通过社区长者要求女眷检查边界',
          stance: '争取安全与尊严之间的协商',
          description: '请同乡、宗教或社区长者向地方人员要求女性检查由女助手进行，并提前通知住户。',
          immediate: '你不必立刻丢掉工作，也尝试降低检查对身体尊严和家庭空间的伤害；但殖民行政未必接受协商。',
          longTerm: '社区协商可能改善执行方式，却也可能强化由男性长者代言女性经验的结构。',
          reflection: '普通女工的能动性常通过家庭、社区和中介表达，这既提供保护也限制了她自己的声音。',
        },
      ],
    },
    realHistory:
      '19 世纪后期孟买成为英属印度重要棉纺中心，吸引来自马哈拉施特拉、古吉拉特和德干等地的男性与女性移民劳动者。1881、1891 等印度工厂法开始规定部分儿童、女性和工时问题，但覆盖与执行有限。1896 年孟买鼠疫暴发后，殖民政府采取强制卫生行政措施，引发关于公共健康、隐私、性别尊严、阶级和殖民权力的冲突。',
    interpretationNote:
      '本场景合成一名 1896 年孟买女性移民棉纺工视角，不对应单一可查个人。内容依据孟买纺织劳动史、印度工厂立法材料、殖民城市和鼠疫行政研究；关于女工内心、具体对话和一天顺序属于课堂叙事推演，应与来源边界一起使用。',
    lessonPack: {
      inquiryQuestion: '殖民孟买的棉纺工业怎样把女性迁移、工厂纪律、公共卫生和帝国权力组织进普通人的一天？',
      quickStart: [
        '定位 1896 年孟买：港口城市、棉纺厂、女性移民工和鼠疫暴发。',
        '找出一条“现金工资带来机会”的证据和一条“殖民治理带来风险”的证据。',
        '判断留下、返乡或社区协商三种选择各自依赖哪些资源。',
      ],
      classroomFlow: {
        quick: {
          title: '12 分钟棉纺厂与 chawl 导入',
          steps: ['读清晨走廊和机器场景', '在日常切片中圈出工资、住房、性别和风险', '写一句“迁移为什么不是完全自由的选择”'],
        },
        source: {
          title: '25 分钟殖民档案 Source Lab',
          steps: ['比较工厂委员会、工厂法、鼠疫行政和现代劳工史的视角', '标注哪些材料来自国家/雇主问题意识，哪些来自后世社会史', '写出女工本人声音缺席在哪里'],
        },
        debate: {
          title: '30 分钟防疫与尊严协商会',
          steps: ['分配女工、社区长者、殖民卫生官、厂主代表四组', '每组提出一条安全理由和一条权力/尊严担忧', '协商一份不超过四条的防疫执行边界'],
        },
      },
      checkQuestions: [
        {
          question: '为什么孟买女工不能简单被写成“离乡进厂更自由”？',
          answer: '现金工资确实带来机会，但住房、亲族义务、性别规范、低工资工种、厂规和殖民行政同时限制选择。',
          teacherNote: '引导学生同时看见能动性和结构约束。',
        },
        {
          question: '印度工厂法能否证明 1896 年女工已经得到充分保护？',
          answer: '不能。1881、1891 等立法说明殖民政府开始规定部分儿童、女性和工时问题，但覆盖范围、执行力量和雇主规避都需要谨慎讨论。',
          teacherNote: '要求学生使用“开始、部分、有限、执行差异”等谨慎词。',
        },
        {
          question: '鼠疫行政为什么既是公共卫生措施，也是殖民权力证据？',
          answer: '它以控制疫情为目标，采取检查、隔离、清扫等措施；但强制进入家庭和身体检查可能侵犯隐私与尊严，并加剧殖民政府与居民的不信任。',
          teacherNote: '避免把防疫简单等同于恶意或善意，重点分析权力执行方式。',
        },
      ],
      misconceptions: [
        { misconception: '殖民地工厂只是复制英国工厂制度。', correction: '孟买工厂与港口、殖民法律、地方资本、移民网络、种姓/社群和性别分工交织，不能简单套用曼彻斯特模型。' },
        { misconception: '女性进厂就代表摆脱家庭控制。', correction: '工资可能扩大行动空间，但家庭汇款、亲族同住、婚姻责任和社区代言仍深刻影响女工选择。' },
        { misconception: '鼠疫时期离开城市只是迷信或恐慌。', correction: '离开可能是面对强制检查、隔离、疾病和失业风险的理性选择，也受交通、债务和家庭资源限制。' },
      ],
      discussionRoles: [
        { role: '女性移民棉纺工', task: '说明工资、身体风险、检查恐惧和家庭责任如何影响是否离开。' },
        { role: '同住工友或亲属', task: '评估互助网络能提供哪些保护，又在哪些时刻失效。' },
        { role: '殖民卫生官', task: '用公共健康理由解释检查与隔离，同时回应权力滥用质疑。' },
        { role: '厂主或监工代表', task: '从出勤和产量角度说明工厂立场，并接受女工安全证据质询。' },
      ],
      exitTickets: [
        '写出一条棉纺厂纪律如何影响女工身体或家庭。',
        '指出一条关于鼠疫行政的来源能证明什么，以及不能直接证明什么。',
      ],
    },
    activityPacks: [
      {
        id: 'bombay-chawl-factory-map',
        title: 'chawl—厂门风险地图',
        mode: 'warmup',
        durationMinutes: 12,
        audience: '全班导入或个人观察',
        prompt: '把女工从公共水龙头到厂门再到机器间的路线画出来，标出机会、约束和风险。',
        materials: ['Scene Reader：chawl 走廊里的水罐和厂门', '日常切片：居所/工作/风险', '时间线：1896-1897 鼠疫行政'],
        steps: ['画出 5 个空间节点。', '每个节点标注一个帮助她工作的资源和一个限制。', '用一句话说明城市空间怎样塑造劳动选择。'],
        deliverable: '一张 5 节点 chawl—厂门风险地图。',
        successCriteria: ['能连接居住、通勤、工厂和防疫。', '至少同时标出机会和风险。', '能说明空间不是中性背景。'],
        linkedSourceTitles: ['The Origins of Industrial Capitalism in India', 'Bombay Plague Administration Report, 1896-97'],
        linkedSceneBeatTitles: ['chawl 走廊里的水罐和厂门', '检查队、隔离营和女工的身体边界'],
      },
      {
        id: 'bombay-source-lab-legislation-plague',
        title: '工厂法与鼠疫行政 Source Lab',
        mode: 'source-lab',
        durationMinutes: 26,
        audience: '小组史料判断',
        prompt: '比较印度工厂立法、工厂委员会和鼠疫行政材料能证明什么，哪些女工经验需要现代研究补足。',
        materials: ['Report of the Indian Factory Commission, 1890 来源卡', 'Epidemic Diseases Act, 1897 来源卡', 'Bombay Plague Administration Report 来源卡', '女性/劳工研究来源卡'],
        steps: ['给每条来源标注 primary / institution / scholarship。', '写出每条来源最能证明的一项制度。', '标出女工声音、身体经验或家庭策略的缺席。'],
        deliverable: '一张“可证明 / 需谨慎 / 缺席声音”来源判断表。',
        successCriteria: ['能谨慎描述工厂法保护的有限性。', '能区分公共卫生目标和强制执行方式。', '能说明现代研究如何补足官方档案。'],
        linkedSourceTitles: ['Report of the Indian Factory Commission, 1890', 'Epidemic Diseases Act, 1897', 'Bombay Plague Administration Report, 1896-97', 'Lost Worlds: Indian Labour and Its Forgotten Histories'],
        linkedSceneBeatTitles: ['棉絮在喉咙里，监工在过道上', '检查队、隔离营和女工的身体边界'],
      },
      {
        id: 'bombay-plague-choice-roleplay',
        title: '鼠疫检查与明日上工角色会',
        mode: 'roleplay',
        durationMinutes: 30,
        audience: '四角色小组协商',
        prompt: '围绕“明天是否上工、如何面对检查队”协商，必须同时处理工资、安全、尊严和公共卫生。',
        materials: ['决策选项卡', 'Scene Reader：检查队、隔离营和女工的身体边界', 'Imperial Power and Popular Politics 来源卡'],
        steps: ['分配女工、工友/亲属、卫生官、厂主代表。', '每个角色写出最担心的一个风险和最需要的一项保障。', '协商一份三条款行动方案，并标注谁有权执行。'],
        deliverable: '一份三条款“安全上工/暂避/协商”方案。',
        successCriteria: ['能从 1896 年角色资源出发。', '能同时处理工资、疾病和强制行政。', '能说明方案中谁被代表、谁仍缺席。'],
        linkedSourceTitles: ['Imperial Power and Popular Politics', 'Bombay Plague Administration Report, 1896-97'],
        linkedSceneBeatTitles: ['米饭、汇款和返乡传闻', '检查队、隔离营和女工的身体边界'],
      },
    ],
    missions: [
      {
        id: 'bombay-explain-factory-time',
        title: '说明孟买工厂时间',
        instruction: '解释厂门、汽笛、机器速度和日工资如何把女性移民工的一天组织成工厂纪律。',
        evidenceUse: '引用清晨厂门、机器全速场景和日常工作/饮食切片。',
        deliverable: '一段 120 字以内证据说明：工厂时间怎样进入女工家庭和身体？',
        estimatedMinutes: 12,
        difficulty: '入门',
        taskType: '证据说明',
        steps: ['重读清晨汽笛和机器场景。', '找出至少两种时间控制机制。', '说明这些机制如何影响工资、食物、住房或健康。'],
        evidenceChecklist: ['点名汽笛、厂门、机器速度或日工资中的两项。', '说明女性移民工的家庭或身体后果。', '引用一条来源标题或场景线索。'],
        reflectionPrompt: '如果她迟到或停工，损失只发生在工厂里吗？',
        outputTemplate: ['核心判断：', '时间控制机制一：', '时间控制机制二：', '对家庭/身体的影响：', '证据标注：'],
        rubric: ['能把时间解释为制度安排。', '至少使用两条具体证据。', '能连接工厂与家庭。', '语言简洁，因果清楚。'],
        sentenceStarters: ['孟买工厂时间首先体现在……', '这不只是个人守时，因为……', '对女性移民工来说，后果是……', '这条证据说明……'],
        linkedSourceTitles: ['Report of the Indian Factory Commission, 1890', 'The Origins of Industrial Capitalism in India'],
      },
      {
        id: 'bombay-plague-risk-chain',
        title: '追踪鼠疫风险链',
        instruction: '把鼠疫消息、殖民检查、隔离风险、返乡/上工选择连成因果链。',
        evidenceUse: '连接傍晚鼠疫场景、时间线和鼠疫行政来源。',
        deliverable: '一条 5 步风险链：消息—行政—身体/家庭风险—选择—后果。',
        estimatedMinutes: 16,
        difficulty: '进阶',
        taskType: '因果链',
        steps: ['写出鼠疫消息怎样抵达 chawl。', '说明检查或隔离如何改变女工行动。', '比较留下、返乡或协商的短期/长期后果。'],
        evidenceChecklist: ['包含疾病风险和行政风险两类证据。', '说明工资、住房或身体尊严中的至少一项。', '区分当时可知信息与后见之明。'],
        reflectionPrompt: '公共卫生风险为什么会转化成劳动和家庭风险？',
        outputTemplate: ['消息：', '行政措施：', '身体/家庭风险：', '可选行动：', '可能后果：'],
        rubric: ['因果顺序清楚。', '能同时处理疫情和殖民权力。', '至少引用两条证据。', '结论承认不确定性。'],
        sentenceStarters: ['风险链可以从……开始。', '检查措施通过……影响女工。', '她可能选择……因为……', '最不确定的是……'],
        linkedSourceTitles: ['Bombay Plague Administration Report, 1896-97', 'Epidemic Diseases Act, 1897', 'Imperial Power and Popular Politics'],
      },
      {
        id: 'bombay-judge-stay-or-leave',
        title: '判断留下还是返乡',
        instruction: '站在女性移民工位置，权衡明天上工、返乡或通过社区协商的收益、风险和限制。',
        evidenceUse: '使用决策选项、日常生活、鼠疫场景和来源边界。',
        deliverable: '一张 140 字以内角色判断卡：我会……因为……但仍担心……',
        estimatedMinutes: 18,
        difficulty: '进阶',
        taskType: '角色判断',
        steps: ['选择留下、返乡或社区协商。', '列出一个短期收益和一个长期代价。', '用至少三条证据说明选择符合角色处境。'],
        evidenceChecklist: ['提到工资或床位。', '提到疾病、检查或隔离风险。', '提到性别/亲族/社区网络中的至少一项。'],
        reflectionPrompt: '今天看似最安全的选择，为什么可能在当时不可承受？',
        outputTemplate: ['我的选择：', '角色处境：', '支持证据：', '最大风险：', '有条件结论：'],
        rubric: ['判断符合 1896 年孟买女工资源。', '收益与风险权衡完整。', '至少使用三条证据。', '避免用现代自由迁移想象替角色决定。'],
        sentenceStarters: ['站在她的位置，我会……', '这个选择的短期好处是……', '但她最担心……', '因此这不是简单的勇敢或恐慌，而是……'],
        linkedSourceTitles: ['Imperial Power and Popular Politics', 'Lost Worlds: Indian Labour and Its Forgotten Histories'],
      },
      {
        id: 'bombay-source-credibility-women-labor',
        title: '判断女工声音在哪里',
        instruction: '比较工厂委员会、工厂法/鼠疫行政和现代女性/劳工研究，说明它们分别能看见或遮蔽什么。',
        evidenceUse: '对照 primary、institution 和 scholarship 来源，识别官方分类、殖民目的和现代研究解释。',
        deliverable: '一张史料判断卡：可证明 / 需谨慎 / 缺席声音 / 补充材料。',
        estimatedMinutes: 22,
        difficulty: '挑战',
        taskType: '史料判断',
        steps: ['选择三条不同类型来源。', '写出每条来源最适合证明的一点。', '指出女工本人声音、家庭情感或身体经验在哪里缺席。', '提出一种可能补充材料。'],
        evidenceChecklist: ['至少比较官方材料与现代研究。', '说明工厂法和鼠疫行政材料的目的限制。', '明确指出女性劳动者声音的档案缺口。'],
        reflectionPrompt: '当档案更常记录管理者而不是女工本人时，我们怎样谨慎重建她的一天？',
        outputTemplate: ['来源一及可证明内容：', '来源二及可证明内容：', '来源三及可证明内容：', '缺席声音：', '补充材料设想：', '边界结论：'],
        rubric: ['来源类型判断准确。', '能说明证据与推论边界。', '能识别殖民行政或研究框架。', '结论避免把女工写成单一受害者。'],
        sentenceStarters: ['这条来源最适合证明……', '但它不直接告诉我们……', '现代研究能帮助我们……', '因此我会把叙事限制在……'],
        linkedSourceTitles: ['Report of the Indian Factory Commission, 1890', 'Epidemic Diseases Act, 1897', 'Lost Worlds: Indian Labour and Its Forgotten Histories', 'Gender, Caste and Labour in Bombay Cotton Mills'],
      },
    ],
    keyTerms: [
      { term: 'chawl', definition: '孟买等城市常见的多层工人租住建筑，房间拥挤、公共设施共享，也是移民互助和城市风险交汇的空间。' },
      { term: '印度工厂法', definition: '英属印度关于工厂劳动条件的系列立法；19 世纪末开始涉及儿童、女性和工时等问题，但保护范围和执行力度有限。' },
      { term: '鼠疫行政', definition: '1896 年后殖民政府为控制鼠疫采取的检查、隔离、清扫、迁移管制等公共卫生措施，常伴随强制权力。' },
      { term: '棉花帝国', definition: '棉花种植、贸易、纺纱织布、港口金融和帝国制度构成的跨区域网络，连接原料、机器、劳动和殖民权力。' },
      { term: '女性移民劳动', definition: '女性跨乡村与城市寻找工资劳动的经历，受家庭责任、性别规范、雇主制度和城市社群网络共同塑形。' },
    ],
    compareAngles: [
      { title: '工资机会 vs. 殖民城市风险', prompt: '孟买提供现金工资时，同时把哪些住房、卫生和行政风险推给女工？' },
      { title: '工厂法条文 vs. 执行现场', prompt: '法律开始规定保护时，为什么不能直接推论女工已经安全？' },
      { title: '公共卫生 vs. 身体尊严', prompt: '鼠疫检查怎样显示保护城市与侵犯居民信任之间的张力？' },
      { title: '曼彻斯特 vs. 孟买', prompt: '两座棉纺城市的工厂时间相似在哪里，又怎样因殖民、性别和迁移而不同？' },
    ],
    sourceEvidenceUse: '用印度工厂委员会和工厂立法材料谨慎建立劳动监管语境，用孟买鼠疫行政材料理解公共卫生权力，再以孟买纺织劳动、殖民城市政治和女性劳动研究补足官方档案较少记录的移民网络、性别分工和普通女工经验。',
    sources: [
      {
        title: 'Report of the Indian Factory Commission, 1890',
        creator: '英属印度工厂委员会',
        sourceType: 'primary',
        relevance: '记录 19 世纪末印度工厂劳动、工时、女性和儿童就业等调查与争论，是理解 1891 年前后工厂立法背景的重要材料。',
        excerpt: '委员会材料围绕工厂劳动条件、工时、监管范围和产业利益展开，显示殖民政府对劳动保护与生产竞争的双重关注。',
        sourceQuestion: '官方委员会材料能证明哪些劳动制度？它是否直接记录女工自己的声音？',
        reliabilityNote: '接近当时政策讨论，价值高；但由殖民调查框架组织，提问、证人选择和产业政治会影响呈现。',
        perspective: '殖民政府调查、雇主与改革争论视角',
        evidenceTags: ['印度工厂法', '工时', '女性劳动', '殖民调查'],
      },
      {
        title: 'Epidemic Diseases Act, 1897',
        creator: 'Government of India',
        sourceType: 'primary',
        relevance: '为殖民政府应对鼠疫等疫情提供广泛行政权力，适合讨论公共卫生、强制检查和居民权利边界。',
        excerpt: '法案授权政府采取特别措施控制危险流行病，体现公共卫生紧急状态下行政权力的扩张。',
        sourceQuestion: '法律授权能证明殖民政府拥有哪些权力？它不能告诉我们居民实际感受的哪些部分？',
        reliabilityNote: '作为法律文本适合确认权力框架，但不能直接说明每个街区的执行方式或女工经验。',
        perspective: '殖民国家法律与公共卫生权力视角',
        evidenceTags: ['鼠疫', '公共卫生', '殖民法律', '强制权力'],
      },
      {
        title: 'Bombay Plague Administration Report, 1896-97',
        creator: 'Bombay Presidency / Municipal plague administration',
        sourceType: 'institution',
        relevance: '概述孟买鼠疫时期检查、隔离、清扫和行政组织等措施，可用于分析公共卫生与殖民城市治理。',
        excerpt: '行政报告通常记录病例、检查、隔离、卫生清扫和人员组织，呈现政府如何把疫情管理转化为城市行动。',
        sourceQuestion: '行政报告把什么视为“有效治理”？哪些隐私、性别尊严或居民抵触可能被弱化？',
        reliabilityNote: '机构材料有助于确认措施和行政逻辑；但会偏向政府视角，需与社会史研究和居民反应互证。',
        perspective: '殖民市政与公共卫生行政视角',
        evidenceTags: ['孟买鼠疫', '隔离', '检查', '城市治理'],
      },
      {
        title: 'The Origins of Industrial Capitalism in India',
        creator: 'Rajnarayan Chandavarkar',
        sourceType: 'scholarship',
        relevance: '研究孟买产业、资本、劳动力和城市政治形成，帮助把棉纺厂放入港口城市、移民网络和殖民经济中理解。',
        excerpt: '研究强调孟买工业资本主义由地方资本、殖民结构、劳动市场和城市社会关系共同塑造。',
        sourceQuestion: '劳动史研究怎样帮助我们避免把孟买工厂只看成英国工业模式的复制？',
        reliabilityNote: '重要学术研究，适合解释结构和城市劳工政治；具体女工日常仍需与更细材料配合。',
        perspective: '现代印度劳动史与城市史视角',
        evidenceTags: ['孟买纺织', '工业资本主义', '移民劳动', '城市政治'],
      },
      {
        title: 'Imperial Power and Popular Politics',
        creator: 'Rajnarayan Chandavarkar',
        sourceType: 'scholarship',
        relevance: '讨论殖民孟买权力、城市社会和民众政治，适合理解鼠疫行政、工人社区和殖民国家之间的紧张关系。',
        excerpt: '研究把国家权力、城市社区、劳动者政治和日常协商放在同一分析框架中。',
        sourceQuestion: '民众政治研究如何揭示普通居民并非只被动接受殖民命令？',
        reliabilityNote: '用于解释权力与社区互动很有价值；课堂叙事仍应区分研究解释和单个女工的可证经验。',
        perspective: '现代殖民城市社会史视角',
        evidenceTags: ['殖民权力', '民众政治', '鼠疫行政', '社区网络'],
      },
      {
        title: 'Lost Worlds: Indian Labour and Its Forgotten Histories',
        creator: 'Chitra Joshi',
        sourceType: 'scholarship',
        relevance: '关注印度劳动者被遗忘的经验、迁移和劳动文化，可帮助讨论女性和普通工人在官方档案中的缺席。',
        excerpt: '研究提醒我们，劳工历史需要追踪工作场所之外的家庭、社区、迁移和记忆，而不只看制度文件。',
        sourceQuestion: '当官方档案少记录女工声音时，劳动史如何提出更谨慎的问题？',
        reliabilityNote: '学术研究有助于恢复劳动者经验和方法意识；用于 1896 孟买女工时需谨慎区分概括与具体个案。',
        perspective: '现代印度劳工史与性别/记忆问题意识',
        evidenceTags: ['印度劳工史', '女性劳动', '迁移', '档案缺席'],
      },
      {
        title: 'Gender, Caste and Labour in Bombay Cotton Mills',
        creator: 'Samita Sen and modern South Asian labour historians',
        sourceType: 'scholarship',
        relevance: '概括学界关于孟买纺织业性别分工、女性工资、家庭责任和档案可见度的讨论，用于校准女性移民工叙事。',
        excerpt: '相关研究通常指出，女性劳动既进入工厂工资体系，也持续受家庭、社群、雇主偏好和殖民统计分类影响。',
        sourceQuestion: '性别研究怎样改变我们对“工人”这一看似中性身份的理解？',
        reliabilityNote: '作为课堂综合参考而非单一书目条目使用；应提示学生这是研究问题集合，需要与具体档案和专著互证。',
        perspective: '现代性别史与劳工史综合视角',
        evidenceTags: ['性别分工', '女性工资', '家庭责任', '档案可见度'],
      },
    ],
  },

  {
    id: 'saint-domingue-sugar-worker',
    title: '圣多明各糖园的黎明',
    era: '大西洋奴隶制与海地革命前夜',
    year: 1791,
    location: '圣多明各北部平原近海地角（Cap-Français）糖业区',
    region: '加勒比圣多明各殖民地',
    coordinates: [19.759, -72.205],
    identity: '被奴役的非洲裔糖园劳动者',
    role: '在甘蔗田、糖厂和奴隶居住区之间被强制调配的 plantation worker',
    age: 27,
    theme: '大西洋奴隶制、糖业帝国、强制劳动、海地革命前夜、来源沉默',
    accent: '#8f4f2d',
    summary:
      '1791 年夏，圣多明各是法国最富庶也最暴力的殖民地之一。你被奴役在北部平原的糖园，清晨被钟声和监工驱赶到甘蔗田，夜里听见关于自由、伏都集会、逃亡山地和白人殖民者争执的片段消息。场景不要求学生“扮演奴隶制”，而是通过受限选择理解制度暴力、集体行动、亲属互助和档案沉默。',
    atmosphere:
      '甘蔗叶边缘割手，榨糖厂的滚轴声与锅炉热浪从天亮持续到深夜。海风带来糖蜜、烟灰和潮湿泥土的气味；远处种植园大宅灯火明亮，居住区里有人压低声音交换克里奥尔语、非洲记忆、天主教圣像和夜间传闻。',
    sceneBeats: [
      {
        timeLabel: '天未亮的钟声',
        title: '甘蔗叶先割破手背',
        sensoryDetail: '钟声催人离开狭窄屋棚，露水还在叶片上，锋利甘蔗叶划过手背，监工的鞭声和口令比太阳更早到来。',
        historicalTension: '圣多明各糖业利润建立在奴隶制暴力、长工时、惩罚、死亡率和持续输入被贩卖人口之上；劳动不是契约选择，而是被法律和武力强制。',
        evidenceHook: '把 Code Noir、种植园清单和糖业描述并读：法律把人写成财产，账簿把劳动者写成数量，二者都留下重要证据也制造沉默。',
        learnerPrompt: '这一个清晨细节怎样说明“糖的利润”不能只从市场价格解释？',
        linkedDailyLifeKeys: ['work', 'risks', 'freedoms'],
        linkedSourceTitles: ['Code Noir, 1685', 'Plantation inventories and notarial records from Saint-Domingue'],
      },
      {
        timeLabel: '午后糖厂热浪',
        title: '滚轴、锅炉和不能停的速度',
        sensoryDetail: '榨蔗滚轴吞进成捆甘蔗，糖汁流向沸腾铜锅，汗水、烟灰和糖蜜粘在皮肤上，任何停顿都可能招来惩罚。',
        historicalTension: '糖厂把农业劳动和高强度加工连在一起，季节性高峰要求日夜轮转；技术效率常意味着对被奴役者身体更严密的调度。',
        evidenceHook: 'Moreau de Saint-Méry 的殖民描述能显示糖业组织，却常从白人殖民观察者角度书写，需要与现代研究和来源沉默一起读。',
        learnerPrompt: '为什么“技术先进”在这里不等于劳动者生活改善？',
        linkedDailyLifeKeys: ['work', 'food', 'risks'],
        linkedSourceTitles: ['Description topographique, physique, civile, politique et historique de la partie française de l’île Saint-Domingue', 'Avengers of the New World'],
      },
      {
        timeLabel: '黄昏分配口粮',
        title: '木薯、园地和被挤压的照料时间',
        sensoryDetail: '一天结束后，木薯、少量咸鱼和自己照看的小园地才轮到你；有人把病人的份额藏起来，也有人交换草药和消息。',
        historicalTension: '被奴役者在极窄空间中维持家庭、园地、市场交换、治疗和信仰网络，这些不是奴隶制给予的自由，而是在暴力制度缝隙中的生存与互助。',
        evidenceHook: '用 Carolyn Fick 与 Laurent Dubois 的研究理解日常抵抗、文化网络和集体行动，同时承认个体情感很少直接进入殖民档案。',
        learnerPrompt: '哪些行动显示能动性？为什么这些能动性仍然不能被写成“自由选择”？',
        linkedDailyLifeKeys: ['food', 'home', 'education', 'freedoms'],
        linkedSourceTitles: ['The Making of Haiti', 'Avengers of the New World'],
      },
      {
        timeLabel: '夜间低声消息',
        title: '自由传闻、山地路径和沉默决定',
        sensoryDetail: '夜色里有人提到法国革命、自由有色人诉求、逃亡者和北部平原的秘密会面；狗叫声一响，谈话立刻断开。',
        historicalTension: '1791 年起义前夜的信息并不完整，个人安全、亲属牵挂、集体信任和惩罚威胁交织；行动空间来自秘密网络，也被奴隶制暴力随时封锁。',
        evidenceHook: 'David Geggus、Dubois 和 Fick 的研究能重建起义结构，但学生必须标注哪些来自审判、殖民报告或后世推论。',
        learnerPrompt: '在证据不完整、后果极端危险时，历史判断如何保留不确定性？',
        linkedDailyLifeKeys: ['risks', 'freedoms', 'education'],
        linkedSourceTitles: ['Haitian Revolutionary Studies', 'The Making of Haiti', 'Avengers of the New World'],
      },
    ],
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '口粮、小园地和被剥夺的时间',
        text: '食物可能包括木薯、玉米、豆类、少量咸鱼或糖园配给，也依赖被奴役者在极少休息时间照看的 provision grounds。口粮不足、疾病和繁忙榨糖季会把饥饿与劳动强度连在一起。',
      },
      {
        key: 'home',
        label: '居所',
        title: '奴隶居住区中的亲属与监控',
        text: '居住区靠近糖田和加工设施，既是休息、照料、语言、宗教与亲属网络的空间，也处在监工、巡逻和惩罚制度监视下。家庭关系常被买卖、死亡和调配打断。',
      },
      {
        key: 'work',
        label: '工作',
        title: '甘蔗田、榨糖厂和强制节奏',
        text: '劳动包括开沟、种植、砍蔗、搬运、榨汁、煮糖和清洁设备。糖业季节要求长时间、高危险、按班轮转的劳动；拒绝、减速或受伤都可能遭受惩罚。',
      },
      {
        key: 'education',
        label: '见识',
        title: '口耳消息、宗教网络和多语世界',
        text: '许多消息通过克里奥尔语、非洲语言记忆、天主教仪式、伏都社群、市场和逃亡者路线传播。法国革命话语、殖民派别冲突和自由有色人诉求并非总能清晰传到每个人耳中。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '惩罚、疾病、死亡率和报复',
        text: '主要风险来自奴隶制本身：身体惩罚、家庭拆散、过劳、机器伤害、热带疾病、营养不足和逃亡/集体行动后的残酷报复。任何选择都在暴力威胁下发生。',
      },
      {
        key: 'freedoms',
        label: '行动缝隙',
        title: '互助、慢工、逃亡和集体计划',
        text: '被奴役者仍能通过互助、保护亲属、保存信仰与语言、临时交易、破坏工具、逃亡山地或参与集体计划表达能动性。但这些不是制度许可的自由，而是在严重约束中的风险行动。',
      },
    ],
    timeline: [
      { year: '1685', title: 'Code Noir 颁布', text: '法国王权以法律形式规定殖民地奴隶制、宗教、惩罚和奴隶主权力，后来在不同殖民地执行和调整。' },
      { year: '18世纪', title: '圣多明各糖业扩张', text: '圣多明各成为法国大西洋帝国最重要的糖、咖啡和靛蓝产区之一，依赖大规模被贩卖非洲人的强制劳动。' },
      { year: '1789', title: '法国革命爆发', text: '自由、权利和公民资格争论跨越大西洋传播，却在殖民地被奴隶制、种族等级和财产利益深刻扭曲。' },
      { year: '1791年8月', title: '北部平原起义爆发', text: '圣多明各北部被奴役者发动大规模起义，海地革命进入决定性阶段。' },
      { year: '1804', title: '海地独立', text: '长期战争后，海地宣布独立，成为由奴隶起义推动建立的独立国家，对大西洋奴隶制世界产生巨大冲击。' },
    ],
    decision: {
      prompt: '夜里你听到邻近居住区有人传来秘密消息：几天后可能有集体行动，也有人建议先把年幼亲属、草药和少量食物藏到更安全的地方。你明天能做的事很有限，也极其危险。你如何在不确定中行动？',
      context: '1791 年北部平原起义前夜，被奴役者面对的不是自由游戏式选择，而是奴隶制暴力下的受限判断。任何行动都可能带来惩罚、连坐或失去亲属；沉默、准备、传递消息或暂时不参与都可能包含生存策略。',
      options: [
        {
          id: 'protect-care-network',
          label: '优先保护照料网络',
          stance: '把亲属、病人和可信同伴的安全放在第一位',
          description: '不公开表态，只在可信范围内准备水、食物、草药和藏身路线，提醒最脆弱的人注意巡逻。',
          immediate: '你降低了亲属和同伴在突发暴力中的风险，也避免过早暴露；但消息可能传得不够快，集体行动准备有限。',
          longTerm: '照料网络能帮助人们熬过报复、逃亡或混乱，却不能单独拆除奴隶制制度。',
          reflection: '这不是“胆小”，而是在极端强制下把生存、亲属责任和未来行动条件放在一起权衡。',
        },
        {
          id: 'share-through-trusted-paths',
          label: '通过可信路径传递有限消息',
          stance: '支持集体行动，但尽量降低暴露范围',
          description: '只把消息传给长期互相信任的人，避免说出无法确认的细节，并观察监工和巡逻变化。',
          immediate: '消息可能帮助更多人准备，也可能因告密、误传或审讯带来严重惩罚。',
          longTerm: '集体行动需要信息与信任网络；但后世来源很难完整记录每个传递者的判断和风险。',
          reflection: '这里的能动性来自组织和信任，不是个人英雄叙事；证据也要求我们承认许多名字没有留下。',
        },
        {
          id: 'delay-and-read-signs',
          label: '暂缓行动，观察迹象',
          stance: '在消息不确定时避免牵连他人',
          description: '照常上工，留意监工、白人殖民者和邻近居住区动向，等待更可靠信号再决定是否移动。',
          immediate: '你暂时降低被发现的风险，也可能错过准备时间；旁人可能把沉默理解成不信任或恐惧。',
          longTerm: '等待可能保护部分人，也可能在起义或镇压来临时让选择空间更小。',
          reflection: '受限处境中的沉默不等于顺从；它可能是信息不足、惩罚恐惧和照料责任共同造成的策略。',
        },
      ],
    },
    realHistory:
      '18 世纪末圣多明各是世界最重要的糖业殖民地之一，财富建立在被奴役非洲人及其后代的强制劳动、暴力惩罚和高死亡率之上。法国革命后，殖民地白人、自由有色人和被奴役者的政治冲突加剧。1791 年 8 月，北部平原大规模奴隶起义爆发，逐步发展为海地革命，并最终导致 1804 年海地独立。',
    interpretationNote:
      '本场景合成一名 1791 年圣多明各北部糖园被奴役劳动者的处境，不对应单一可查个人。课堂叙事严格避免把奴隶制写成可轻松代入的冒险角色；所有决策都被界定为暴力制度下的受限行动。关于个人感受、秘密谈话和夜间计划的细节多由法律、种植园记录、殖民观察、审判/行政材料和现代研究间接推论，必须持续标注 source silence。',
    lessonPack: {
      inquiryQuestion: '圣多明各糖业财富怎样依赖奴隶制暴力、强制劳动和档案沉默，而被奴役者又如何在极窄空间中保存互助、信息网络与集体行动能力？',
      quickStart: [
        '定位 1791 年圣多明各：法国殖民地、糖业核心区、被奴役人口多数和革命前夜。',
        '从 Scene Reader 找出一条强制劳动证据、一条互助/能动性证据、一条来源沉默证据。',
        '给决策选项加上“可行条件”和“危险后果”，避免把选择写成自由冒险。',
      ],
      classroomFlow: {
        quick: {
          title: '12 分钟糖业暴力导入',
          steps: ['读清晨钟声和糖厂热浪两个场景', '把“利润、技术、劳动、惩罚”连成四词证据链', '写一句：为什么糖不能只被讲成消费史'],
        },
        source: {
          title: '28 分钟 Code Noir 与沉默档案 Source Lab',
          steps: ['比较 Code Noir、Moreau、种植园清单和现代研究的来源类型', '标注每条来源最能证明的制度或经验', '写出至少两个它们不能直接证明的被奴役者声音'],
        },
        debate: {
          title: '25 分钟谨慎历史论证会',
          steps: ['不分配“奴隶主/被奴役者扮演”，而分配证据审查员、制度分析员、沉默档案观察员和比较员', '每组提出一条可证结论和一条必须保留的不确定性', '共同修改一段避免浪漫化起义也避免抹去能动性的说明'],
        },
      },
      checkQuestions: [
        {
          question: '为什么不能把圣多明各糖园劳动写成普通艰苦工作？',
          answer: '因为劳动者被法律和武力当作财产强制劳动，面临惩罚、买卖、家庭拆散和高死亡率；这与工资劳动或一般贫困不同。',
          teacherNote: '强调奴隶制暴力的制度特殊性，同时为后续比较保留精确词汇。',
        },
        {
          question: '被奴役者的能动性为什么不能被写成“他们其实很自由”？',
          answer: '互助、保存文化、慢工、逃亡或组织起义显示能动性，但这些行动都在暴力惩罚、信息不完整和极小行动空间中发生，并非制度赋予的自由。',
          teacherNote: '要求学生使用“受限能动性”“风险行动”“强制制度缝隙”等表述。',
        },
        {
          question: '种植园清单和殖民法律有什么史料价值和危险？',
          answer: '它们能证明财产化、制度权力、人口分类和劳动组织，却常把被奴役者写成数量、价格或管理对象，不能直接呈现完整个人声音。',
          teacherNote: '训练学生把来源沉默当成分析对象，而不是用想象填满。',
        },
      ],
      misconceptions: [
        { misconception: '海地革命只是法国革命思想的海外回声。', correction: '法国革命话语重要，但海地革命也来自被奴役者长期抵抗、非洲与克里奥尔文化网络、殖民地种族政治和糖业奴隶制矛盾。' },
        { misconception: '奴隶制下的人没有能动性。', correction: '被奴役者在照料、信仰、语言、逃亡、信息传递和集体行动中持续行动；关键是承认这些行动承受极端风险。' },
        { misconception: '有法律文本就能知道真实生活。', correction: 'Code Noir 等法律说明权力框架，但执行、规避、暴力现场和被奴役者经验需要与其他材料和研究谨慎互证。' },
      ],
      discussionRoles: [
        { role: '制度分析员', task: '说明 Code Noir、惩罚和种植园管理如何限定行动边界。' },
        { role: '劳动链追踪员', task: '把甘蔗田、糖厂、口粮和出口利润连成证据链。' },
        { role: '沉默档案观察员', task: '指出每条来源没有直接记录哪些被奴役者声音。' },
        { role: '受限能动性分析员', task: '寻找互助、信息网络或集体行动证据，同时标注风险。' },
      ],
      exitTickets: [
        '写出一条“糖业利润—强制劳动—来源沉默”的三步证据链。',
        '用一句话区分“能动性”和“自由选择”。',
      ],
    },
    activityPacks: [
      {
        id: 'saint-domingue-sugar-labor-chain',
        title: '糖业劳动链证据地图',
        mode: 'warmup',
        durationMinutes: 14,
        audience: '全班导入或个人观察',
        prompt: '把甘蔗从田地到糖厂、港口和欧洲消费的路径画成劳动链，而不是只画商品链。',
        materials: ['Scene Reader：甘蔗叶先割破手背', 'Scene Reader：滚轴、锅炉和不能停的速度', '日常切片：工作/风险/饮食'],
        steps: ['画出田地、糖厂、居住区、港口四个节点。', '每个节点标出一种强制或风险。', '用一句话说明哪一环最容易在消费叙事中被隐藏。'],
        deliverable: '一张四节点糖业劳动链证据地图。',
        successCriteria: ['能把商品与劳动制度连接。', '明确使用“强制劳动/奴隶制暴力”等准确词。', '能指出至少一个被隐藏的身体或家庭后果。'],
        linkedSourceTitles: ['Code Noir, 1685', 'Description topographique, physique, civile, politique et historique de la partie française de l’île Saint-Domingue'],
        linkedSceneBeatTitles: ['甘蔗叶先割破手背', '滚轴、锅炉和不能停的速度'],
      },
      {
        id: 'saint-domingue-source-silence-lab',
        title: 'Code Noir 与种植园清单 Source Silence Lab',
        mode: 'source-lab',
        durationMinutes: 30,
        audience: '小组史料判断',
        prompt: '比较法律、殖民描述、现代研究和种植园清单：它们各能证明什么，又如何把被奴役者声音压成类别、数量或沉默？',
        materials: ['Code Noir 来源卡', 'Moreau de Saint-Méry 来源卡', 'Plantation inventories 来源卡', 'Dubois / Fick / Geggus 研究来源卡'],
        steps: ['给每条来源标注 primary / institution / scholarship。', '写出它最能证明的一项制度或劳动事实。', '写出它不能直接证明的一项个人经验。', '提出一种补充材料或谨慎表述。'],
        deliverable: '一张“可证明 / 需谨慎 / 缺席声音 / 补充问题”来源表。',
        successCriteria: ['能区分法律、殖民观察、清单和现代研究。', '能把 source silence 写成分析而不是空白。', '避免为缺席者编造确定心理。'],
        linkedSourceTitles: ['Code Noir, 1685', 'Plantation inventories and notarial records from Saint-Domingue', 'Avengers of the New World', 'The Making of Haiti'],
        linkedSceneBeatTitles: ['甘蔗叶先割破手背', '自由传闻、山地路径和沉默决定'],
      },
      {
        id: 'saint-domingue-constrained-agency-writing',
        title: '受限能动性谨慎短论',
        mode: 'writing',
        durationMinutes: 24,
        audience: '个人写作或同伴互评',
        prompt: '用 180 字解释：被奴役者怎样在奴隶制暴力下仍然行动？必须同时写出能动性、约束和史料边界。',
        materials: ['决策选项卡', 'Scene Reader：木薯、园地和被挤压的照料时间', 'Scene Reader：自由传闻、山地路径和沉默决定', 'lessonPack 检查题'],
        steps: ['选择一条互助、信息传递或准备行动证据。', '说明它受到哪些暴力制度限制。', '加入一句“来源不能直接告诉我们……”的边界句。', '同伴检查是否把能动性误写成自由。'],
        deliverable: '一段 180 字受限能动性短论。',
        successCriteria: ['同时呈现行动与约束。', '至少引用两条场景或来源证据。', '包含明确来源边界句。'],
        linkedSourceTitles: ['The Making of Haiti', 'Haitian Revolutionary Studies', 'Plantation inventories and notarial records from Saint-Domingue'],
        linkedSceneBeatTitles: ['木薯、园地和被挤压的照料时间', '自由传闻、山地路径和沉默决定'],
      },
    ],
    missions: [
      {
        id: 'saint-domingue-explain-coerced-labor',
        title: '说明糖业强制劳动',
        instruction: '解释圣多明各糖业为什么不能只被描述为高利润农业，而必须写成奴隶制强制劳动体系。',
        evidenceUse: '引用清晨甘蔗田、糖厂热浪、日常工作/风险切片和 Code Noir 或种植园清单。',
        deliverable: '一段 130 字证据说明：糖业利润如何依赖强制劳动？',
        estimatedMinutes: 14,
        difficulty: '入门',
        taskType: '证据说明',
        steps: ['重读清晨和糖厂两个 scene beats。', '找出至少两种强制机制。', '把强制机制连接到糖业利润或出口商品。'],
        evidenceChecklist: ['点名奴隶制法律、监工惩罚、长工时或机器风险中的两项。', '说明劳动者不是契约工。', '引用一条来源标题。'],
        reflectionPrompt: '如果只说“糖业效率高”，会遮蔽谁的身体经验？',
        outputTemplate: ['核心判断：', '强制机制一：', '强制机制二：', '与糖业利润的关系：', '证据标注：'],
        rubric: ['准确使用奴隶制和强制劳动概念。', '至少使用两条具体证据。', '能连接劳动与商品利润。', '避免把暴力弱化为一般辛苦。'],
        sentenceStarters: ['圣多明各糖业利润依赖……', '这不是普通雇佣劳动，因为……', '糖厂/甘蔗田证据显示……', '这条来源能证明……'],
        linkedSourceTitles: ['Code Noir, 1685', 'Plantation inventories and notarial records from Saint-Domingue'],
      },
      {
        id: 'saint-domingue-map-constrained-choice',
        title: '绘制受限选择图',
        instruction: '把保护亲属、传递消息、暂缓观察三种行动放进风险图，说明每种行动的资源、限制和可能后果。',
        evidenceUse: '使用决策选项、夜间消息场景、日常居所/风险/行动缝隙切片。',
        deliverable: '一张三栏受限选择图：行动—可用资源—危险边界—不确定后果。',
        estimatedMinutes: 18,
        difficulty: '进阶',
        taskType: '方案设计',
        steps: ['列出三种行动。', '为每种行动写出一个可用资源和一个危险边界。', '标注哪些后果在当时无法确认。'],
        evidenceChecklist: ['包含亲属/同伴网络。', '包含惩罚、巡逻或告密风险。', '至少写出一处不确定信息。'],
        reflectionPrompt: '为什么“最佳选择”在奴隶制暴力下可能并不存在？',
        outputTemplate: ['行动一：资源 / 危险 / 不确定后果', '行动二：资源 / 危险 / 不确定后果', '行动三：资源 / 危险 / 不确定后果', '综合判断：'],
        rubric: ['能把选择写成受限行动。', '收益和危险都具体。', '能保留不确定性。', '不把历史人物写成单一英雄或受害者。'],
        sentenceStarters: ['这个行动依赖……', '它的危险边界是……', '当时无法确认的是……', '因此我不能简单说……'],
        linkedSourceTitles: ['The Making of Haiti', 'Haitian Revolutionary Studies'],
      },
      {
        id: 'saint-domingue-source-silence-judgment',
        title: '判断沉默档案',
        instruction: '比较 Code Noir、Moreau 描述、种植园清单和现代研究，说明它们如何帮助又限制我们重建被奴役者的一天。',
        evidenceUse: '对照 primary、institution 和 scholarship 来源，识别法律、殖民观察、账簿和研究解释的边界。',
        deliverable: '一张史料判断卡：来源 / 可证明 / 需谨慎 / 缺席声音 / 补充材料。',
        estimatedMinutes: 24,
        difficulty: '挑战',
        taskType: '史料判断',
        steps: ['选择至少四条不同类型来源。', '写出每条来源最适合证明的一点。', '指出它如何把被奴役者写成对象、数量或沉默。', '提出一种补充材料或谨慎句式。'],
        evidenceChecklist: ['至少包含 Code Noir 和一种种植园记录。', '至少比较一条现代研究。', '明确指出不能直接知道的个人声音。'],
        reflectionPrompt: '当来源多由奴隶主、殖民官员或后世学者产生时，我们如何避免替被奴役者“说得太满”？',
        outputTemplate: ['来源一及可证明内容：', '来源二及可证明内容：', '来源三及可证明内容：', '缺席声音：', '补充材料/谨慎表述：', '边界结论：'],
        rubric: ['来源类型判断准确。', '能说明证据与推论边界。', '能主动讨论 source silence。', '结论尊重被奴役者能动性但不虚构完整内心。'],
        sentenceStarters: ['这条来源最适合证明……', '但它不能直接告诉我们……', '它的视角来自……', '因此我会谨慎写成……'],
        linkedSourceTitles: ['Code Noir, 1685', 'Description topographique, physique, civile, politique et historique de la partie française de l’île Saint-Domingue', 'Plantation inventories and notarial records from Saint-Domingue', 'Avengers of the New World'],
      },
      {
        id: 'saint-domingue-compare-commodity-empires',
        title: '比较糖与棉的商品帝国',
        instruction: '把圣多明各糖园与曼彻斯特、孟买或广州任一场景比较，说明商品链如何组织劳动、监管和来源可见度。',
        evidenceUse: '使用 compareAngles、atlas route 或相邻场景来源，至少比较一条劳动制度和一条来源边界。',
        deliverable: '一段 180 字比较分析：相似点 / 关键差异 / 来源沉默。',
        estimatedMinutes: 22,
        difficulty: '挑战',
        taskType: '比较分析',
        steps: ['选择一个比较场景。', '各找一条商品—劳动证据。', '说明权力结构的相似与差异。', '写出两边来源各自遮蔽什么。'],
        evidenceChecklist: ['圣多明各必须明确奴隶制强制劳动。', '另一场景必须明确工厂、殖民或口岸制度。', '包含至少一条 source silence 判断。'],
        reflectionPrompt: '比较为什么既要连接全球商品链，又不能把所有不自由劳动混成一种？',
        outputTemplate: ['比较对象：', '相似点证据：', '关键差异证据：', '来源沉默：', '谨慎结论：'],
        rubric: ['比较对象明确。', '能连接商品链和劳动制度。', '能谨慎区分奴隶制与其他劳动约束。', '来源边界表述清楚。'],
        sentenceStarters: ['两站都显示商品链依赖……', '关键差异在于……', '圣多明各的奴隶制暴力不能等同于……', '两边来源共同遮蔽了……'],
        linkedSourceTitles: ['Avengers of the New World', 'Haitian Revolutionary Studies', 'Report of the Factory Inspectors, 1842', 'Report of the Indian Factory Commission, 1890', 'The Chinese Repository'],
      },
    ],
    keyTerms: [
      { term: '圣多明各', definition: '法属加勒比殖民地 Saint-Domingue，18 世纪末以糖、咖啡等种植园经济闻名，财富高度依赖被奴役非洲人及其后代的强制劳动。' },
      { term: 'Code Noir', definition: '法国 1685 年颁布的殖民地奴隶制法令，规定奴隶主权力、宗教、惩罚和被奴役者法律地位；既是制度证据，也体现把人财产化的暴力。' },
      { term: '糖业种植园', definition: '以甘蔗种植、榨汁、煮糖和出口为核心的生产单位，通常把农业、加工、监控和惩罚制度结合起来。' },
      { term: '受限能动性', definition: '人在强制制度中仍通过互助、信息传递、信仰、逃亡、慢工或集体行动作出选择，但选择空间被暴力、惩罚和资源不足严重限制。' },
      { term: '来源沉默', definition: '档案记录中某些人的声音、情感和判断没有被直接保存，常因法律、账簿、殖民报告或调查材料的视角而被压成数量、类别或问题。' },
      { term: '海地革命', definition: '1791 年起义后发展出的革命战争，最终促成 1804 年海地独立，是大西洋世界反奴隶制和反殖民历史的关键事件。' },
    ],
    compareAngles: [
      { title: '糖的甜味 vs. 强制劳动', prompt: '消费市场看到的是糖，种植园现场隐藏了哪些身体、家庭和死亡率代价？' },
      { title: '法律文本 vs. 生活现场', prompt: 'Code Noir 能证明奴隶制权力，却不能直接告诉我们哪些日常经验？' },
      { title: '能动性 vs. 自由选择', prompt: '如何同时承认被奴役者行动能力，又不把极端强制下的风险行动浪漫化？' },
      { title: '糖业帝国 vs. 棉花帝国', prompt: '圣多明各、曼彻斯特、孟买和广州如何用不同制度组织商品、劳动和沉默档案？' },
    ],
    sourceEvidenceUse: '用 Code Noir 确认法理权力和人身财产化，用 Moreau de Saint-Méry 这类殖民描述理解糖业空间组织但同时标注白人殖民视角，用种植园清单和公证材料谨慎追踪人口、技能、家庭拆散和财产化语言，再借助 Dubois、Fick、Geggus 等研究解释革命、集体行动和来源沉默。任何具体内心、谈话或个人计划都应写成课堂推论而非直接史实。',
    sources: [
      {
        title: 'Code Noir, 1685',
        creator: 'French Crown / Louis XIV’s colonial administration',
        sourceType: 'primary',
        relevance: '提供法国殖民地奴隶制法律框架，适合讨论宗教、惩罚、奴隶主权力和被奴役者被财产化的制度基础。',
        excerpt: '法律条文把被奴役者置于主人权力和殖民秩序之下，显示国家如何把奴隶制暴力制度化。',
        sourceQuestion: '法律文本能证明哪些权力关系？它不能直接告诉我们实际执行和被奴役者感受的哪些部分？',
        reliabilityNote: '作为法律文本权威性高，但法律不等于现场生活；不同殖民地、庄园和时期的执行需要其他材料互证。',
        perspective: '法国殖民国家与奴隶主秩序视角',
        evidenceTags: ['Code Noir', '奴隶制法律', '人身财产化', '制度暴力'],
      },
      {
        title: 'Description topographique, physique, civile, politique et historique de la partie française de l’île Saint-Domingue',
        creator: 'Moreau de Saint-Méry',
        sourceType: 'primary',
        relevance: '18 世纪末关于法属圣多明各地理、社会、种植园和殖民秩序的重要描述，可帮助理解糖业空间和殖民分类。',
        excerpt: '作品详细整理殖民地地理、生产和社会等级，呈现白人殖民知识如何观察并分类圣多明各。',
        sourceQuestion: '殖民观察者能看见糖业组织的哪些部分？他的位置又会遮蔽或合理化哪些暴力？',
        reliabilityNote: '材料丰富且接近时代，但作者是殖民精英视角；涉及被奴役者生活时必须与批判性研究和其他材料互读。',
        perspective: '白人殖民精英与行政知识视角',
        evidenceTags: ['Moreau de Saint-Méry', '殖民描述', '糖业空间', '种族分类'],
      },
      {
        title: 'Avengers of the New World',
        creator: 'Laurent Dubois',
        sourceType: 'scholarship',
        relevance: '综合叙述海地革命，强调被奴役者、自由有色人、法国革命和殖民政治之间的互动。',
        excerpt: '研究把海地革命写成大西洋世界的关键革命，突出被奴役者在创造自由政治中的主动作用。',
        sourceQuestion: '现代综合研究如何帮助我们把起义看成集体政治行动，而不是突然暴乱？',
        reliabilityNote: '权威学术综合，适合解释革命过程；课堂使用时仍需区分作者解释、原始材料和合成叙事情节。',
        perspective: '现代大西洋革命史与海地革命研究视角',
        evidenceTags: ['海地革命', '被奴役者能动性', '大西洋世界', '革命政治'],
      },
      {
        title: 'The Making of Haiti',
        creator: 'Carolyn E. Fick',
        sourceType: 'scholarship',
        relevance: '强调圣多明各被奴役者基层组织、抵抗和革命形成过程，适合讨论集体行动与日常抵抗。',
        excerpt: '研究关注底层被奴役者的动员、社群网络和革命参与，挑战只从精英政治解释海地革命的叙事。',
        sourceQuestion: '研究如何从不完整档案中重建基层行动？它需要在哪些地方保持谨慎？',
        reliabilityNote: '对基层革命研究很重要；具体个人动机和秘密组织细节仍受档案沉默限制。',
        perspective: '现代社会史、奴隶抵抗与基层革命视角',
        evidenceTags: ['基层动员', '日常抵抗', '集体行动', '来源沉默'],
      },
      {
        title: 'Haitian Revolutionary Studies',
        creator: 'David Geggus',
        sourceType: 'scholarship',
        relevance: '汇集关于海地革命人口、军事、政治和史料问题的研究，适合校准起义、档案和解释边界。',
        excerpt: '研究通过细读殖民、军事和人口材料，讨论革命进程及其史料解释难题。',
        sourceQuestion: '人口、军事和殖民档案能帮助我们确认什么？哪些个人经验仍难以还原？',
        reliabilityNote: '重视档案细节和修正，是谨慎讨论海地革命的重要参考；但许多被奴役者个人声音仍需承认缺席。',
        perspective: '现代海地革命档案研究与历史方法视角',
        evidenceTags: ['海地革命研究', '档案方法', '人口史', '起义证据'],
      },
      {
        title: 'Plantation inventories and notarial records from Saint-Domingue',
        creator: 'Saint-Domingue notaries, plantation managers, and colonial record keepers',
        sourceType: 'institution',
        relevance: '种植园清单、公证买卖和财产记录常列出被奴役者姓名、年龄、技能、估价或家庭关系碎片，是研究奴隶制经济和 source silence 的关键材料。',
        excerpt: '这些记录把人登记为资产、劳动力或交易对象，有时留下姓名和关系线索，也同时暴露档案暴力。',
        sourceQuestion: '当一个人以价格、年龄或技能出现在清单中时，我们能知道什么，又必须承认不知道什么？',
        reliabilityNote: '适合确认财产化语言、人口结构和劳动分类；但由奴隶主和殖民机构产生，极少直接保存被奴役者自述。',
        perspective: '种植园管理、公证和殖民财产记录视角',
        evidenceTags: ['种植园清单', '公证记录', '财产化', '来源沉默'],
      },
    ],
  },

  {
    id: 'malacca-monsoon-port-broker',
    title: '马六甲季风港口的一日',
    era: '16 世纪初东南亚海上贸易世界',
    year: 1511,
    location: '马六甲港',
    region: '马六甲海峡',
    coordinates: [2.1896, 102.2501],
    identity: '港口经纪家庭中的年轻码头通译',
    role: '季风船期、税册和多语交易的中介',
    age: 27,
    theme: '印度洋、季风贸易、港口中介、征服时刻',
    accent: '#2f9c95',
    summary:
      '你在马六甲码头替爪哇、古吉拉特、琉球、华人和本地商人传话、核对货单、寻找担保人。1511 年葡萄牙舰队逼近，季风港口的语言、信用和税册突然变成生死攸关的政治证据。',
    atmosphere:
      '潮水退下后，码头木桩露出盐痕。胡椒、锡锭、檀香、米饭和湿帆布的气味混在一起，清真寺宣礼、庙前钟声和几种语言的讨价声同时压向海面。',
    sceneBeats: [
      {
        timeLabel: '清晨退潮',
        title: '船还没走，语言先靠岸',
        sensoryDetail: '湿帆布拍在舷侧，古吉拉特商人、爪哇舵手和福建货主把同一批胡椒说成几套不同账目。',
        historicalTension: '马六甲的繁荣依赖多语中介、担保和港口规则；翻译不是中立服务，而是信用与权力的接口。',
        evidenceHook: '用《东方志》关于马六甲贸易族群的记述和现代印度洋研究，区分多元港口事实与旅行者/殖民观察视角。',
        learnerPrompt: '哪一个词最可能在翻译中改变交易风险：重量、税率、担保人还是船期？为什么？',
        linkedDailyLifeKeys: ['work', 'education', 'freedoms'],
        linkedSourceTitles: ['Suma Oriental', 'Southeast Asia in the Age of Commerce, 1450-1680'],
      },
      {
        timeLabel: '午前报关',
        title: '税册把海风写成数字',
        sensoryDetail: '书记员用蘸湿的笔核对货单，锡锭碰在木箱上，香料粉末落进账页缝里。',
        historicalTension: '港口国家通过税、许可和官员层级把季风贸易转成收入，也让通译和经纪被记录、被依赖、被追责。',
        evidenceHook: '把马六甲苏丹国的港口制度、海关职位和葡萄牙征服叙述放在一起，观察谁把港口秩序写成“财富”或“可夺取的节点”。',
        learnerPrompt: '税册保护交易，还是暴露交易？请给出一条当事人会在意的理由。',
        linkedDailyLifeKeys: ['work', 'risks', 'freedoms'],
        linkedSourceTitles: ['Suma Oriental', 'The Commentaries of the Great Afonso Dalboquerque'],
      },
      {
        timeLabel: '午后传闻',
        title: '葡萄牙炮声还在海口之外',
        sensoryDetail: '街口忽然安静，几名水手说外海有高舷船影，铁炮声像雷一样沿海峡滚来。',
        historicalTension: '商业港口的开放性也带来军事脆弱：外来舰队把通译、港口路线和商人关系变成征服情报。',
        evidenceHook: '用阿尔布克尔克相关征服 accounts 和现代海洋帝国研究，检查“征服者如何描述港口中介”的权力视角。',
        learnerPrompt: '如果你掌握外商名单和仓库位置，这些知识在和平与征服中分别意味着什么？',
        linkedDailyLifeKeys: ['risks', 'work', 'home'],
        linkedSourceTitles: ['The Commentaries of the Great Afonso Dalboquerque', 'The Portuguese Empire in Asia, 1500-1700'],
      },
      {
        timeLabel: '夜间避风',
        title: '仓库门后，信任开始分裂',
        sensoryDetail: '油灯照着成捆布匹和米袋，邻近商人低声问你该把货交给苏丹官员、外商伙伴，还是亲族船队。',
        historicalTension: '征服时刻迫使港口中介在多重忠诚之间选择；后世来源往往更清楚记录统治者、征服者和商人群体，较少记录通译的内心。',
        evidenceHook: '对读《马来纪年》、明代朝贡背景和现代东南亚研究，判断地方记忆、国家记录和殖民文本各自看见什么。',
        learnerPrompt: '哪一种行动最能保住信任：守住税册、隐藏客户、投靠新权力，还是护送家人离港？证据边界在哪里？',
        linkedDailyLifeKeys: ['home', 'risks', 'freedoms'],
        linkedSourceTitles: ['Sejarah Melayu / Malay Annals', 'Southeast Asia in the Age of Commerce, 1450-1680'],
      },
    ],
    dailyLife: [
      {
        key: 'food',
        label: '饮食',
        title: '米饭、鱼干与船上香料',
        text: '清晨常吃米饭、鱼干和椰味小食。码头上胡椒、丁香、檀香和布匹是货物，也会进入你对远方价格和船期的嗅觉记忆。',
      },
      {
        key: 'home',
        label: '居所',
        title: '水边屋舍和亲族担保',
        text: '你住在靠近河口的水边街区，亲族、同乡和商人伙伴彼此照应。家也是信用网络的一部分：谁愿为你担保，常决定你能否继续在码头工作。',
      },
      {
        key: 'work',
        label: '工作',
        title: '翻译、报关、找担保人',
        text: '你的工作是在几种语言和计量习惯之间转译，核对货单、税率、仓库和船期。你不是大商人，却知道哪些人守约、哪些航线受季风限制。',
      },
      {
        key: 'education',
        label: '见识',
        title: '在码头学习世界地理',
        text: '你可能没有正式读过很多经典，却能听懂港口马来语、商人术语和外来货名。你的知识来自水手、账页、寺庙/清真寺社群和反复谈判。',
      },
      {
        key: 'risks',
        label: '风险',
        title: '开放港口也是军事目标',
        text: '港口繁荣吸引商船，也吸引海盗、敌对舰队和新帝国。1511 年葡萄牙攻城时，熟悉仓库、航道和商人关系的人可能被各方争取或怀疑。',
      },
      {
        key: 'freedoms',
        label: '机会',
        title: '中介让普通人接近远方财富',
        text: '懂语言和信用规则让你有机会接近跨海财富，替多方安排交易。但这种机会依赖苏丹国秩序、季风时间和商人信任，一旦权力更替就可能失效。',
      },
    ],
    timeline: [
      { year: '1400年前后', title: '马六甲苏丹国兴起', text: '马六甲凭借海峡位置、港口政策和区域网络成长为东南亚重要贸易中心。' },
      { year: '1405-1433', title: '郑和下西洋与朝贡联系', text: '明朝海上使团和朝贡体系强化中国与东南亚港口之间的外交和商业联系，但不能把马六甲简单写成明朝控制的港口。' },
      { year: '15世纪', title: '季风港口网络繁荣', text: '来自印度洋、南海和群岛世界的商人依赖季风等待、仓储、通译、税册和担保制度。' },
      { year: '1509', title: '葡萄牙人初到马六甲并发生冲突', text: '葡萄牙商人与舰队进入马六甲贸易政治，关系迅速紧张。' },
      { year: '1511', title: '葡萄牙攻占马六甲', text: '阿尔布克尔克率军攻占马六甲，试图控制海峡贸易节点；本地和区域商人网络并未因此完全停止，而是重组。' },
      { year: '16世纪后期', title: '海峡网络持续竞争', text: '柔佛、亚齐、葡萄牙马六甲和其他港口继续竞争商路、税收和政治合法性。' },
    ],
    decision: {
      prompt: '葡萄牙舰队逼近时，一名旧客户请求你藏起货单和客户名单；苏丹官员要求你上交所有税册，新来的葡萄牙人则在寻找懂多种语言的人。你怎么做？',
      context:
        '你的价值来自语言、账目和信任。可在征服时刻，这些知识既能保护人，也能成为追责、勒索或投靠新权力的工具。',
      options: [
        {
          id: 'protect-clients',
          label: '隐藏部分货单，保护旧客户',
          stance: '维护商人信任',
          description: '把最敏感的客户名单交给亲族保管，只公开不致命的普通货单。',
          immediate: '旧客户和同乡网络可能继续信任你，但官员或新权力若发现隐瞒，会把你视为危险中介。',
          longTerm: '如果旧网络重组成功，你保住职业信用；如果葡萄牙控制港口，你的沉默可能变成罪证。',
          reflection: '港口信用常建立在保密与担保上。征服把商业伦理转化为政治风险。',
        },
        {
          id: 'submit-records',
          label: '按苏丹官员要求上交税册',
          stance: '依附旧制度',
          description: '把账册交给港口官员，证明自己仍服从马六甲苏丹国秩序。',
          immediate: '你获得旧制度的保护，也可能被商人埋怨出卖信息。',
          longTerm: '若苏丹国失守，账册会落入敌手；若港口复原，你的守法记录可能保住位置。',
          reflection: '制度文书能维持秩序，也会在战败时被新统治者接收。文书从来不是无害纸张。',
        },
        {
          id: 'offer-translation',
          label: '向葡萄牙人提供有限通译',
          stance: '在新权力下求生',
          description: '只翻译公开信息，试图换取家人安全和继续工作的许可。',
          immediate: '你可能保住家庭和码头通行权，却立刻被旧客户怀疑背叛。',
          longTerm: '新政权需要中介，但也未必信任中介。你可能获得职位，也可能成为可替换的工具。',
          reflection: '普通人在征服现场的“合作”常是求生策略。判断时需要区分道德评价、证据边界和当时资源。',
        },
      ],
    },
    realHistory:
      '马六甲在 15 世纪成为连接印度洋、东南亚群岛和南海的重要季风港口。1511 年葡萄牙攻占马六甲，是早期葡萄牙亚洲海上帝国形成的关键节点之一；但港口贸易网络并未被单一欧洲力量完全掌控，区域商人、柔佛、亚齐、华人和印度洋网络继续重组。',
    interpretationNote:
      '本场景合成一名马六甲码头通译/港口经纪的视角，不对应单一可查个人。内容依据葡萄牙征服记述、马来编年传统、明代朝贡背景和现代东南亚/印度洋研究；具体对话、一天顺序和个人选择为课堂叙事推演，应与来源视角和殖民文本偏向一起使用。',
    lessonPack: {
      inquiryQuestion: '1511 年马六甲的港口中介如何在季风贸易、国家税册和征服暴力之间求生？',
      quickStart: [
        '定位 1511 年、马六甲海峡、季风港口和葡萄牙征服。',
        '圈出一条语言/信用机会证据和一条文书/军事风险证据。',
        '判断通译应保护客户、上交税册还是提供有限通译，并写出最大不确定性。',
      ],
      classroomFlow: {
        quick: {
          title: '12 分钟港口中介导入',
          steps: ['读身份卡和清晨码头 scene beat', '把“语言、货物、税册、担保人”连成工作链', '写一句“港口开放但不安全，因为____”'],
        },
        source: {
          title: '25 分钟征服时刻 Source Lab',
          steps: ['比较《东方志》、阿尔布克尔克记述和《马来纪年》的视角', '标注哪些信息来自商贸观察、征服者叙述、地方记忆或现代研究', '写出通译本人声音缺席在哪里'],
        },
        debate: {
          title: '30 分钟税册与客户名单辩论',
          steps: ['三组分别支持隐藏货单、上交税册、有限通译', '每组必须说明短期安全、长期信用和来源边界', '观察员判断哪种方案最符合 1511 年港口中介的限制'],
        },
      },
      checkQuestions: [
        {
          question: '为什么港口通译不只是“会语言的人”？',
          answer: '他还处理计量、税率、担保、客户信用、船期和不同权力之间的风险转移。',
          teacherNote: '引导学生把语言能力和港口制度、商业信任连接起来。',
        },
        {
          question: '葡萄牙征服 accounts 能直接告诉我们码头通译的内心吗？',
          answer: '不能。它们更常呈现征服者、战略和贸易节点视角，可帮助理解军事/帝国逻辑，但普通中介经验需要谨慎推论。',
          teacherNote: '要求学生使用“可证明/需推论/缺席声音”三栏。',
        },
        {
          question: '明代朝贡背景是否说明马六甲完全受中国控制？',
          answer: '不能。朝贡和郑和航行显示外交与商业联系、合法性资源和区域秩序，但马六甲仍有本地苏丹国政治与多方商人网络。',
          teacherNote: '避免把朝贡关系简化为现代主权控制。',
        },
      ],
      misconceptions: [
        { misconception: '欧洲人到来后立刻掌控了整个亚洲贸易。', correction: '1511 年很重要，但区域商人、季风船期和本地港口竞争继续重组，葡萄牙控制有限且需要中介。' },
        { misconception: '多元贸易港口天然和平自由。', correction: '多元和开放依赖税制、担保、港口官员和武力保护，也可能成为征服目标。' },
        { misconception: '通译提供翻译就是中立。', correction: '翻译会影响税额、责任、信任和情报流动，在危机中具有政治后果。' },
      ],
      discussionRoles: [
        { role: '码头通译/经纪', task: '说明语言、客户信任和家人安全之间的取舍。' },
        { role: '马六甲港口官员', task: '要求税册和秩序，解释国家收入与防守压力。' },
        { role: '古吉拉特或爪哇商人', task: '强调货物、信用和离港船期的风险。' },
        { role: '葡萄牙军官/书记员', task: '说明为什么征服者需要港口情报和通译。' },
      ],
      exitTickets: [
        '写出一条季风港口中介工作如何把语言变成权力。',
        '指出一条来源能证明什么，以及不能直接证明通译个人经验的地方。',
      ],
    },
    activityPacks: [
      {
        id: 'malacca-monsoon-port-map',
        title: '季风港口工作链热身',
        mode: 'warmup',
        durationMinutes: 12,
        audience: '全班导入或个人快速观察',
        prompt: '把一艘季风船从靠岸到离港的流程画成 6 步，标出通译/经纪在哪些节点改变交易结果。',
        materials: ['Scene Reader：船还没走，语言先靠岸', '日常切片：工作/见识/机会', '时间线：15 世纪季风港口网络繁荣'],
        steps: ['写出靠岸、报关、找仓库、找担保、议价、离港 6 个节点。', '在每个节点标注一种语言、文书或信用需求。', '用一句话说明季风节律如何限制“自由交易”。'],
        deliverable: '一张 6 节点季风港口工作链。',
        successCriteria: ['能把港口贸易拆成具体工作环节。', '至少标出两种中介劳动。', '能说明季风等待或税册不是背景，而是交易条件。'],
        linkedSourceTitles: ['Suma Oriental', 'Southeast Asia in the Age of Commerce, 1450-1680'],
        linkedSceneBeatTitles: ['船还没走，语言先靠岸', '税册把海风写成数字'],
      },
      {
        id: 'malacca-conquest-source-lab',
        title: '征服 accounts 与地方记忆 Source Lab',
        mode: 'source-lab',
        durationMinutes: 28,
        audience: '四人来源分工小组',
        prompt: '比较葡萄牙征服记述、《东方志》、《马来纪年》和现代研究分别怎样看见马六甲港口中介。',
        materials: ['Suma Oriental 来源卡', 'The Commentaries of the Great Afonso Dalboquerque 来源卡', 'Sejarah Melayu / Malay Annals 来源卡', '现代东南亚/印度洋研究来源卡'],
        steps: ['每人认领一条来源，标注 creator、sourceType 和 perspective。', '写出它最能证明的一项港口事实。', '写出它最可能忽略或扭曲的一类普通人经验。', '合成一张“可证明 / 需推论 / 缺席声音”矩阵。'],
        deliverable: '一张四来源史料判断矩阵。',
        successCriteria: ['能区分旅行者/商贸观察、征服者叙述、地方编年和现代研究。', '能说明来源视角如何影响对通译的呈现。', '结论不把任何单一来源当作完整现场。'],
        linkedSourceTitles: ['Suma Oriental', 'The Commentaries of the Great Afonso Dalboquerque', 'Sejarah Melayu / Malay Annals', 'The Portuguese Empire in Asia, 1500-1700'],
        linkedSceneBeatTitles: ['葡萄牙炮声还在海口之外', '仓库门后，信任开始分裂'],
      },
      {
        id: 'malacca-tax-ledger-roleplay',
        title: '税册、客户名单与求生角色会',
        mode: 'roleplay',
        durationMinutes: 32,
        audience: '四角色协商与观察员评议',
        prompt: '围绕是否隐藏客户名单、上交税册或向葡萄牙人有限通译协商，必须同时处理家人安全、商人信用、港口秩序和征服风险。',
        materials: ['决策选项卡', 'Scene Reader：税册把海风写成数字', 'Scene Reader：仓库门后，信任开始分裂', '来源边界提示卡'],
        steps: ['分配通译、港口官员、商人客户、葡萄牙书记员四种角色。', '每个角色写出最需要保护的一项资源和最害怕的一项后果。', '协商一份三条行动方案，并标注谁会承担最大风险。'],
        deliverable: '一份三条款危机行动方案 + 风险承担说明。',
        successCriteria: ['能从 1511 年角色资源出发，不使用后见全知。', '能同时处理商业信任和国家/军事权力。', '能说明方案依赖哪些来源推论。'],
        linkedSourceTitles: ['The Commentaries of the Great Afonso Dalboquerque', 'Sejarah Melayu / Malay Annals'],
        linkedSceneBeatTitles: ['税册把海风写成数字', '仓库门后，信任开始分裂'],
      },
    ],
    missions: [
      {
        id: 'malacca-map-intermediary-chain',
        title: '画出港口中介链',
        instruction: '说明通译/经纪如何把船主、商人、税吏、仓库和担保人连在一起。',
        evidenceUse: '引用清晨码头、报关 scene beat 和日常工作/见识切片。',
        deliverable: '一张 120 字以内中介链说明：谁需要谁，风险在哪里传递？',
        estimatedMinutes: 14,
        difficulty: '入门',
        taskType: '因果链',
        steps: ['列出至少五个港口角色。', '用箭头标出语言、货物、税册和信用如何移动。', '说明通译在哪个环节最容易被追责。'],
        evidenceChecklist: ['点名通译/经纪、税册和担保人。', '至少使用一条 scene beat 证据。', '说明中介不是中立旁观者。'],
        reflectionPrompt: '如果没有可信中介，季风港口的交易会先在哪个环节卡住？',
        outputTemplate: ['角色节点：', '中介动作：', '风险传递：', '证据标注：', '一句结论：'],
        rubric: ['链条清楚，角色不少于五个。', '能连接语言、文书和信用。', '至少引用两条证据。', '结论能体现机会与风险并存。'],
        sentenceStarters: ['这条中介链从……开始。', '通译的作用不只是……，还包括……', '风险通过……传到……', '这条证据说明……'],
        linkedSourceTitles: ['Suma Oriental', 'Southeast Asia in the Age of Commerce, 1450-1680'],
      },
      {
        id: 'malacca-judge-ledger-choice',
        title: '判断税册选择',
        instruction: '站在码头通译位置，权衡隐藏货单、上交税册或有限通译的短期安全和长期信用。',
        evidenceUse: '使用决策选项、葡萄牙攻城时间线、港口税册场景和来源视角限制。',
        deliverable: '一张 150 字以内角色判断卡：我会……因为……但这条选择最危险的是……',
        estimatedMinutes: 18,
        difficulty: '进阶',
        taskType: '角色判断',
        steps: ['选择一个行动方案。', '列出一个保护对象：家人、客户、旧制度或新权力许可。', '用三条证据说明选择符合当时处境，并写出最大不确定性。'],
        evidenceChecklist: ['提到 1511 年征服压力。', '提到税册/客户名单/通译中的至少两项。', '区分当事人当时能知道的消息和后见历史结局。'],
        reflectionPrompt: '求生策略在后世来源中为什么容易被写成背叛或合作？',
        outputTemplate: ['我的选择：', '我保护的是：', '支持证据：', '最大危险：', '有边界结论：'],
        rubric: ['判断符合 1511 年港口中介资源。', '能权衡短期安全与长期信用。', '至少使用三条证据。', '语言避免后见道德化。'],
        sentenceStarters: ['站在通译的位置，我会……', '这个选择短期保护……', '但长期风险是……', '我不能确定的是……'],
        linkedSourceTitles: ['The Commentaries of the Great Afonso Dalboquerque', 'Sejarah Melayu / Malay Annals'],
      },
      {
        id: 'malacca-source-perspective-audit',
        title: '审查征服时刻的来源视角',
        instruction: '比较《东方志》、阿尔布克尔克相关记述、《马来纪年》和现代研究能证明什么、遮蔽什么。',
        evidenceUse: '对照 primary、institution/scholarship 来源，识别商贸观察、征服者辩护、地方记忆和现代解释的边界。',
        deliverable: '一张史料判断卡：可证明 / 需谨慎 / 缺席声音 / 补充材料设想。',
        estimatedMinutes: 24,
        difficulty: '挑战',
        taskType: '史料判断',
        steps: ['选择三到四条不同视角来源。', '写出每条最适合证明的一项内容。', '指出码头通译、女性家属、普通水手或本地商贩在哪里缺席。', '提出一种可能补充材料。'],
        evidenceChecklist: ['至少比较一条葡萄牙文本和一条马来/区域或现代研究。', '说明征服 accounts 的权力位置。', '明确指出普通中介声音的档案缺口。'],
        reflectionPrompt: '当来源更常记录征服者和统治者时，我们怎样谨慎写普通港口劳动者？',
        outputTemplate: ['来源一及可证明内容：', '来源二及可证明内容：', '来源三及可证明内容：', '缺席声音：', '补充材料设想：', '边界结论：'],
        rubric: ['来源类型判断准确。', '能说明证据与推论边界。', '能识别殖民、地方编年或现代研究框架。', '结论避免把合成角色写成可直接证实个人。'],
        sentenceStarters: ['这条来源最适合证明……', '但它不直接告诉我们……', '另一种视角会提醒我们……', '因此我会把叙事限制在……'],
        linkedSourceTitles: ['Suma Oriental', 'The Commentaries of the Great Afonso Dalboquerque', 'Sejarah Melayu / Malay Annals', 'Southeast Asia in the Age of Commerce, 1450-1680'],
      },
      {
        id: 'malacca-compare-monsoon-port',
        title: '比较季风港口与广州口岸',
        instruction: '比较马六甲通译和广州买办助手如何在语言、文书、国家权力和商业风险之间工作。',
        evidenceUse: '使用马六甲港口中介证据、广州十三行买办证据和 compare lens“市场与交换/来源可信度”。',
        deliverable: '一段 180 字比较分析：两种中介相同在哪里，关键差异是什么？',
        estimatedMinutes: 22,
        difficulty: '进阶',
        taskType: '比较分析',
        steps: ['各找出一条语言中介证据。', '各找出一条文书或国家权力证据。', '比较征服时刻与禁烟危机如何改变中介风险。'],
        evidenceChecklist: ['同时引用马六甲和广州场景。', '比较维度一致：语言、文书、权力、风险。', '说明至少一条来源视角限制。'],
        reflectionPrompt: '为什么“中介”既可能获得机会，又最容易被追责？',
        outputTemplate: ['共同点：', '马六甲证据：', '广州证据：', '关键差异：', '来源边界：', '综合判断：'],
        rubric: ['比较维度一致。', '能同时处理机会与风险。', '至少使用两站证据。', '结论能连接港口制度与危机时刻。'],
        sentenceStarters: ['两者相同的是……', '马六甲的风险更突出在……', '广州的风险更突出在……', '这说明港口中介……'],
        linkedSourceTitles: ['Suma Oriental', 'The Chinese Repository', 'The Opium War: Drugs, Dreams and the Making of China'],
      },
    ],
    keyTerms: [
      { term: '季风港口', definition: '依赖季风风向、等待船期、仓储和跨区域商人停留的港口类型；交易节奏由自然风季与制度安排共同决定。' },
      { term: '港口经纪/通译', definition: '在多语商人、港口官员、船主和仓库之间传递信息、寻找担保、核对货单和调解争议的中介角色。' },
      { term: '马六甲苏丹国', definition: '15 世纪兴起于马六甲海峡的重要港口政权，凭借位置、政策和区域网络成为东南亚贸易枢纽。' },
      { term: '葡萄牙征服马六甲', definition: '1511 年阿尔布克尔克率葡萄牙军队攻占马六甲，标志葡萄牙试图控制亚洲海上贸易关键节点，但区域网络继续重组。' },
      { term: '朝贡联系', definition: '明代中国与东南亚政权通过使节、贡品、册封和贸易形成的外交商业关系；它提供合法性和联系，不等同现代主权控制。' },
      { term: '来源视角', definition: '来源由谁产生、为谁服务、记录什么和忽略什么；征服 accounts、地方编年、旅行记录和现代研究会呈现不同马六甲。' },
    ],
    compareAngles: [
      { title: '语言机会 vs. 政治风险', prompt: '通译能力为什么在和平贸易中带来收入，在征服时刻却可能变成危险知识？' },
      { title: '税册秩序 vs. 情报暴露', prompt: '港口文书如何同时保护交易、征收税赋，并在权力更替时暴露商人网络？' },
      { title: '马六甲 vs. 广州', prompt: '两个口岸中介都处理语言和文书，但征服战争与禁烟危机怎样造成不同风险？' },
      { title: '葡萄牙文本 vs. 地方记忆', prompt: '征服者记录和《马来纪年》分别更容易看见谁、忽略谁？' },
    ],
    sourceEvidenceUse: '用《东方志》谨慎重建 16 世纪初马六甲贸易族群、商品和港口制度线索；用阿尔布克尔克相关葡萄牙 accounts 理解 1511 年军事征服与帝国目标，同时警惕征服者视角；用明代郑和/朝贡背景说明马六甲在区域外交商业网络中的位置，但避免现代主权化；用《马来纪年》观察地方王权记忆和叙事传统；再用 Reid、Subrahmanyam、Andaya 等现代研究校准季风贸易、东南亚港口社会和葡萄牙亚洲帝国的解释边界。',
    sources: [
      {
        title: 'Suma Oriental',
        creator: 'Tomé Pires',
        sourceType: 'primary',
        relevance: '16 世纪初葡萄牙药剂师/官员对亚洲贸易和马六甲的描述，常用于理解马六甲港口商品、商人群体和贸易位置。',
        excerpt: '该书把马六甲呈现为连接多地商人和商品的关键港口，强调其贸易财富和战略位置。',
        sourceQuestion: 'Pires 的商贸观察能帮助我们确认哪些港口事实？他的葡萄牙身份会怎样影响他对“价值”和“秩序”的判断？',
        reliabilityNote: '接近 1511 年前后葡萄牙观察，信息丰富；但带有外来商贸和帝国机会视角，不能直接代表本地通译、普通商贩或女性经验。',
        perspective: '葡萄牙商贸观察者和早期殖民知识收集视角',
        evidenceTags: ['马六甲', '港口贸易', '商人群体', '葡萄牙观察'],
      },
      {
        title: 'The Commentaries of the Great Afonso Dalboquerque',
        creator: 'Afonso de Albuquerque / Brás de Albuquerque tradition',
        sourceType: 'primary',
        relevance: '记录阿尔布克尔克在印度洋和马六甲行动的葡萄牙征服叙述，适合理解 1511 年军事目标、战略语言和征服者自我辩护。',
        excerpt: '征服 accounts 将马六甲描写为控制东方贸易的重要节点，并突出葡萄牙军事、外交和宗教使命。',
        sourceQuestion: '征服者叙述为什么强调港口财富和战略位置？它会怎样塑造对本地中介的描写？',
        reliabilityNote: '对葡萄牙行动和官方/家族记忆有价值；但具有辩护和英雄化倾向，对本地社会、被迫合作者和普通劳动者常有偏向或沉默。',
        perspective: '葡萄牙征服者、帝国扩张和家族纪念视角',
        evidenceTags: ['1511征服', '葡萄牙帝国', '军事叙述', '来源偏向'],
      },
      {
        title: 'Ming Veritable Records and Zheng He tribute context',
        creator: '明代朝廷记录与郑和航海相关材料',
        sourceType: 'institution',
        relevance: '提供马六甲与明朝朝贡、册封和海上外交联系的背景，帮助理解 15 世纪区域秩序和马六甲合法性资源。',
        excerpt: '明代记录呈现使节、贡品、册封和海上交通，显示中国朝廷如何把东南亚港口纳入外交秩序语言。',
        sourceQuestion: '朝贡记录能证明外交联系和秩序想象；它不能直接证明港口日常交易的哪些部分？',
        reliabilityNote: '适合确认明朝官方关系和朝廷视角；但它以中国官僚分类记录外部世界，不能等同马六甲本地社会或商人网络全貌。',
        perspective: '明代国家记录、朝贡外交和官方秩序视角',
        evidenceTags: ['郑和', '朝贡', '明代记录', '区域秩序'],
      },
      {
        title: 'Sejarah Melayu / Malay Annals',
        creator: '马来宫廷编年传统',
        sourceType: 'primary',
        relevance: '马来王权和宫廷记忆的重要文本，适合讨论马六甲苏丹国、地方合法性和葡萄牙到来在后世记忆中的位置。',
        excerpt: '《马来纪年》以王权谱系、宫廷故事和道德政治语言讲述马六甲传统，保留地方记忆也带有文学化结构。',
        sourceQuestion: '地方编年能补足葡萄牙文本的哪些视角？它自身的宫廷和文学目的又会遮蔽谁？',
        reliabilityNote: '对地方政治记忆和王权观念很重要；成书、传抄和叙事目的复杂，不能当作逐日实录使用。',
        perspective: '马来宫廷记忆、王权合法性和文学叙事视角',
        evidenceTags: ['马来纪年', '地方记忆', '王权', '叙事传统'],
      },
      {
        title: 'Southeast Asia in the Age of Commerce, 1450-1680',
        creator: 'Anthony Reid',
        sourceType: 'scholarship',
        relevance: '研究 1450-1680 年东南亚商业扩张、港口城市、商品和社会变化，是理解马六甲季风贸易世界的重要综合参考。',
        excerpt: '研究强调东南亚在“商业时代”中的区域网络、港口社会和外来贸易互动，而不是把历史只写成欧洲扩张。',
        sourceQuestion: '现代综合研究如何帮助我们把马六甲放回东南亚商业世界，而不只从葡萄牙征服看它？',
        reliabilityNote: '适合建立区域结构和长时段背景；具体到一名码头通译的日常仍需要场景化推论和来源边界。',
        perspective: '现代东南亚商业史和区域社会史视角',
        evidenceTags: ['商业时代', '东南亚', '季风贸易', '港口社会'],
      },
      {
        title: 'The Portuguese Empire in Asia, 1500-1700',
        creator: 'Sanjay Subrahmanyam; with Andaya scholarship on Melaka and the Malay world as comparative context',
        sourceType: 'scholarship',
        relevance: 'Subrahmanyam 对葡萄牙亚洲帝国网络的研究，以及 Andaya 关于马来世界和马六甲后续政治的研究，可帮助校准葡萄牙权力的能力、限制和区域反应。',
        excerpt: '现代研究通常把葡萄牙马六甲放在更广的亚洲海上网络、地方政治和商业适应中，强调控制并不等于完全垄断。',
        sourceQuestion: '为什么“占领港口”和“控制贸易网络”不是一回事？现代研究如何修正征服者叙述？',
        reliabilityNote: '有助于避免欧洲中心叙事；但本条综合多位学者的解释方向，课堂使用时应说明它是研究框架而非单一原始证词。',
        perspective: '现代海洋帝国史、印度洋网络和马来世界研究视角',
        evidenceTags: ['葡萄牙亚洲帝国', '海洋网络', '马六甲海峡', '区域反应'],
      },
    ],
  },

]
