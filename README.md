# TimeAtlas

TimeAtlas 是一个互动历史网站。它不把历史做成单纯的年份表或百科条目，而是让用户选择一个历史身份，进入那个时代的一天，面对一个关键选择，并把自己的选择放回真实历史背景中理解。

## 当前 MVP

Scenario Deep Dive / Scene Reader 9.0 当前包含 14 个历史身份：

- 唐代长安西市商人
- 北宋汴京茶铺学徒
- 明代江南读书人
- 清末广州十三行买办助手
- 二战伦敦普通居民
- 阿拔斯巴格达纸坊抄写员
- 桑海时期廷巴克图手稿学生
- 阿兹特克帝国晚期特诺奇蒂特兰集市卖家
- 工业革命时期曼彻斯特纺织女工
- 1896 年殖民孟买棉纺厂女性移民工（南亚殖民工业化案例）
- 1791 年圣多明各糖园被奴役劳动者（海地革命前夜与大西洋糖业强制劳动案例）
- 1511 年马六甲季风港口经纪/码头通译（葡萄牙征服时刻与印度洋/南海港口中介案例）
- 约 1331 年基尔瓦黄金季风港商人/经纪（斯瓦希里海岸、西印度洋黄金贸易、港口信用与来源边界案例）
- 1138 年 Fustat / Cairo Geniza 商人书信学徒（红海—印度洋商人信件、合约、信用和来源幸存案例）

每个身份包含：

- 时代、地点、身份卡
- 日常生活切片
- Scene Reader 9.0：每个身份新增 4 个 scene beats，串联 time label、感官细节、历史张力、证据钩子、学习追问、关联日常与关联来源
- 关键时间线
- 历史岔路口选择
- 短期结果、长期影响、历史反思
- 真实历史对照
- 可搜索/筛选的身份画廊
- 按本机持久保存的任务进度、证据勾选和草稿笔记（localStorage，必要时回退 sessionStorage）
- 使用年份和坐标生成的轻量时间地图概览
- Time-Space Atlas / Route Explorer 12.1：基于现有 scenario 年份、坐标、地区与主题生成互动地图 pins、route polyline、时间轨、场景预览、地区/主题筛选、路线卡、状态徽章、Compare Lab 启动按钮、可复制/导出的路线作业单，以及按本机持久保存的 Route Inquiry Notebook；内置 10 条策展路线（知识城市、市场走廊、危机新闻、劳动纪律与安全、工业城市与全球交换、糖与棉的帝国路线、棉花帝国与工厂时间、季风海上亚洲、西印度洋季风路线、红海—印度洋信用路线）
- Archive & Evidence Atlas / 全站史料证据地图 1.0：直接汇总现有 scenarios[].sources（不改变 scenario 数据结构），支持全站来源搜索、来源类型/场景/证据标签筛选、类型数量快照、高频标签、档案空白 prompt、Source Reader 跳转、来源可信度 Compare Lens 启动、2-4 条 Evidence Basket、可复制“史料判断”工作纸，以及 Corroboration Studio / 史料互证工作台 1.0：当 Evidence Basket 有 2-4 条来源时显示来源矩阵、sourcing/contextualization/corroboration/silence 方法卡、临时判断/支持证据/张力冲突/缺席声音/所需来源/信心等级字段，并按排序后的来源组合 key 本机保存和恢复草稿、清空当前草稿、复制互证简报
- Causation & Change Lab / 因果与历史变化工作台 1.0：位于 Source Atlas 之后、学习档案袋之前，从现有 scenarios 自动派生 6 个因果探究（商品帝国与劳动纪律、港口信用与远距离贸易、危机消息与普通选择、知识传播、制度约束与市场变化、档案沉默与因果判断），证据轨直接抽取 timeline、decision context/options、scene beats、sources 和 relevant missions；草稿字段覆盖 backgroundConditions、immediateTriggers、constraints、humanChoices、shortTermConsequences、longTermChange、contingency、missingEvidence、confidence、selectedEvidenceIds、updatedAt，并按本机 localStorage / sessionStorage 持久保存；每条证据显示 economic、political/institutional、environmental/geographic、social/labor、cultural/knowledge、source limitation 类别 chips，可复制/导出 Causation Brief，并作为 source type `causation` 纳入 Task Library
- Continuity & Turning Points Lab / 历史连续性与分期工作台 1.0：位于 Causation Lab 之后、学习档案袋之前，使用稳定 section id `periodization-lab`，不改变 scenario schema；从现有场景派生 6 个分期探究（商品链/劳动时间、知识城市/媒介、港口信用/季风世界、市场规则长时段变化、危机新闻/普通安全、档案可见性变化）。选择 inquiry 后显示按 year 排序的 chronology rail 与 turning-point evidence cards，证据来自 scenario.year、timeline、sceneBeats、decision context/options、realHistory 和 sources；草稿字段覆盖 periodStart、periodEnd、continuities、changes、turningPoint、beforeAfterEvidence、periodLabel、alternativePeriodization、missingEvidence、confidence、selectedEvidenceIds、updatedAt，并按 localStorage / sessionStorage 持久保存；支持打开 Scene Reader / Source Reader、清空草稿、复制/导出 Periodization Brief，并作为 source type `periodization` 纳入 Task Library 和学习档案袋 archive export
- 场景卡片与总览中的进度徽章
- Evidence Lab / Source Reader 4.0：按来源类型筛选，展示转述摘记、视角、可靠边界、史料追问和证据标签
- Learning Workbench 4.0：新增“史料判断”任务类型，包含来源偏见、缺席声音、事实与推论边界的任务
- 任务板按任务类型与状态（全部 / 未开始 / 草稿 / 已完成）筛选
- 任务板关联来源支持一键把格式化证据卡加入当前草稿笔记
- 可复制的学习输出，整合任务、证据清单、草稿、输出结构、关联来源、史料自检和反思提示
- Guided Lesson Pack 6.0：每个身份提供探究问题、quick/source/debate 课堂流程、可揭示检查题答案、误区卡、讨论角色和可复制 exit ticket
- Activity Pack / Task Launcher 10.0：每个身份新增 3 个可启动活动包，覆盖 warmup、source-lab、roleplay、debate、writing、compare、extension 等模式，包含时长、适用对象、提示、材料、步骤、交付物、成功标准、关联来源与关联 scene beats，并可复制 activity sheet
- Evidence-to-Argument Studio 6.0：按当前身份保存论证草稿，支持撰写主张，勾选/记录来源、Scene Reader、lesson flow、check question、任务、日常、时间线与历史选择证据，补充推理、反证与不确定性，并复制/导出完整论证
- Teacher Pack 6.0：基于 lessonPack、任务 rubric、来源追问和史料自检复制更完整的课堂流程、检查题、误区卡、角色讨论、exit ticket 与检查清单
- 学习档案袋汇总全站完成数、草稿数、最近草稿、跨场景工作区条目、Route Inquiry Notebook、史料互证草稿、因果草稿、分期草稿和勾选数，并支持复制包含互证/因果/分期草稿 section 的全部学习档案
- Task Library / Assignment Launcher 11.0：全站汇总 scenario missions、Activity Packs、Lesson Pack 课堂流程、Inquiry Pathways、Causation inquiries、Periodization inquiries 和 Compare Lens 模板，支持关键词、类别、场景、时长、来源和来源型任务筛选；任务卡展示情境、类别、时长、摘要、交付物、标签，并可打开对应场景、载入 Compare / Causation / Periodization Lab 或复制统一格式的任务单
- Guided Session Builder / Healthy Chunking：用现有 scenario 数据自动生成 15/30/45/75 分钟路线卡，展示分步时长、可跳转 section hash、当前场景资源、linked sources、交付物和可复制/导出的路线单；步骤勾选进度按本机持久保存
- Atlas Workspace：跨场景挑战提供 4 个带稳定 ID 的比较任务，可勾选清单、撰写草稿、标记完成、复制模板 + 草稿，并按本机持久保存
- Atlas Connections / Inquiry Pathways 8.0：提供多条带稳定 ID 的策展式跨场景探究路径，每条包含 driving question、场景路径、讨论推进、任务、rubric、建议证据、持久化路径清单、探究草稿、完成状态和可复制 inquiry pack + user draft
- Inquiry Pathways 可一键打开首个场景，或把路径的前两个场景与比较镜头载入 Compare Lab，并遵守 reduced motion 设置滚动定位
- Cross-Scenario Compare Lab / Assignment Builder：选择两个不同身份和 7 个比较镜头之一（日常生活、制度约束、风险与安全、知识传播、市场与交换、来源可信度、历史选择），生成并复制课堂比较作业；建议引用证据会在合适镜头中优先纳入 Scene Reader 场景证据

## 来源层与探索体验

每个历史身份现在包含 2-7 条来源或参考：原始材料、机构档案或研究著作；马六甲场景包含 6 条围绕《东方志》、阿尔布克尔克征服 accounts、明代郑和/朝贡背景、《马来纪年》和 Reid/Subrahmanyam/Andaya 等研究的谨慎来源卡；基尔瓦场景包含围绕伊本·白图泰《旅行记》、《基尔瓦编年史》、UNESCO Kilwa/Songo Mnara 遗产说明与 Horton/Wynne-Jones/Kusimba 等斯瓦希里海岸考古/印度洋贸易研究的谨慎来源卡；Fustat / Cairo Geniza 场景包含围绕 Cambridge Taylor-Schechter Genizah、Princeton Geniza Project、S. D. Goitein、Jessica Goldberg、Marina Rustow 与 Geniza India / 红海—印度洋贸易研究的谨慎来源卡。来源层用于说明场景依据和解释边界；互动情节仍是面向学习体验的合成叙事，不等同于单一史料复原。Source Reader 4.0 为每条来源补充简短转述摘记、史料追问、可靠性边界、视角说明和证据标签，避免使用长篇版权原文。

画廊支持按标题、时代、地点、身份、主题、关键术语、来源标题、证据标签、任务标题、任务类型、Activity Pack 标题/模式/材料/步骤/成功标准和 Scene Reader 场景文本搜索，并可按地区或主题快速筛选。Scene Reader 9.0 位于 Narrative Panel 之后、Daily Life Grid 之前，为每个身份提供 4 个可切换 scene beats；每个 beat 展示 time label、感官细节、历史张力、evidence hook、learner prompt、关联日常 chips 与关联来源标题，并可复制格式化 Scene Observation。Learning Workbench 4.0 会为每个任务展示任务类型徽章、交付物、预计用时、难度、输出结构、好答案标准、史料自检、工作步骤、证据检查清单、句子开头、关联来源和反思提示；用户可按任务类型或状态过滤任务，勾选证据、撰写草稿笔记、把来源证据卡追加到草稿、标记完成，并复制一段学习输出用于课堂讨论或复盘。Guided Lesson Pack 6.0 位于日常生活切片之后、Mission Board 之前，为每个身份提供可切换 quick/source/debate 模式的课堂步骤、可揭示答案的 check questions、misconception cards、discussion roles 和可复制 exit tickets。Activity Pack / Task Launcher 10.0 位于 Guided Lesson Pack 之后、Mission Board 之前，提供模式筛选、可选择活动卡、活动详情、linked source / scene beat chips，以及一键复制 activity sheet。Archive & Evidence Atlas / 全站史料证据地图 1.0 位于 Time-Space Atlas 之后、学习档案袋之前，直接从现有 scenarios[].sources 派生全站来源索引：可搜索 title、creator、scenario、tags、excerpt、reliability、perspective 和 source question，按 source type、scenario 与 evidence tag 筛选，显示 source type/count snapshot、高频证据标签和 archive gap prompt cards；来源卡展示 scenario、sourceType、excerpt、perspective、reliability、sourceQuestion、evidenceTags 与 url，并可打开对应场景 Source Reader、载入“来源可信度”Compare Lens、把 2-4 条来源加入 Evidence Basket，再通过 copyTextToClipboard 复制“史料判断”工作纸。Corroboration Studio / 史料互证工作台 1.0 嵌入 Archive & Evidence Atlas：当 Evidence Basket 有 2-4 条来源时显示来源矩阵和 sourcing、contextualization、corroboration、silence 四张方法卡，提供 provisional claim、supporting evidence、tensions/conflicts、absent voices/needed sources、confidence（high/medium/low/uncertain）字段；草稿以排序后的 source id basket key 保存到 localStorage（受限时回退 sessionStorage），再次选择同一来源组合会自动恢复，可清空当前组合草稿，并可复制包含来源矩阵、方法检查和草稿字段的 Corroboration Brief；少于 2 条来源时不会生成互证简报。Causation & Change Lab / 因果与历史变化工作台 1.0 位于 Source Atlas 之后、学习档案袋之前，使用稳定 section id `causation-lab`，不改变 scenario schema；它从现有场景派生商品帝国/劳动纪律、港口信用/远距离贸易、危机消息/普通选择、知识传播、制度约束/市场、档案沉默/因果判断 6 张 inquiry cards。选择 inquiry 后，右侧 evidence rail 汇总相关场景 timeline、decision context/options、scene beats、sources 与 relevant missions，并为证据显示 economic、political/institutional、environmental/geographic、social/labor、cultural/knowledge、source limitation 原因类别 chips；草稿以 inquiry id 保存到 localStorage（受限时回退 sessionStorage），字段包括 backgroundConditions、immediateTriggers、constraints、humanChoices、shortTermConsequences、longTermChange、contingency、missingEvidence、confidence、selectedEvidenceIds、updatedAt，可清空或复制/导出 Causation Brief，学习档案袋也会汇总因果草稿。Continuity & Turning Points Lab / 历史连续性与分期工作台 1.0 位于 Causation Lab 之后、学习档案袋之前，使用稳定 section id `periodization-lab`，从现有场景派生商品链/劳动时间、知识城市/媒介、港口信用/季风世界、市场规则长时段变化、危机新闻/普通安全、档案可见性变化 6 张 inquiry cards；右侧 chronology rail 按 year 排序，turning-point evidence cards 汇总 scenario.year、timeline、sceneBeats、decision context/options、realHistory 与 sources；草稿以 inquiry id 保存到 localStorage（受限时回退 sessionStorage），字段包括 periodStart、periodEnd、continuities、changes、turningPoint、beforeAfterEvidence、periodLabel、alternativePeriodization、missingEvidence、confidence、selectedEvidenceIds、updatedAt，可清空或复制/导出 Periodization Brief，学习档案袋也会汇总分期草稿。Task Library / Assignment Launcher 11.0 位于学习档案袋之后、Guided Session Builder 之前，把 scenario missions、scenario activityPacks、lessonPack classroom flows、atlasInquiryPaths、causation inquiries、periodization inquiries 与 compareLenses 模板聚合为可搜索任务库；筛选支持 search、category、scenario、duration band、来源类型与 source-based toggle，卡片显示 title、context/scenario、category、duration、deliverable/summary、tags，并可打开场景、复制任务单，或为 inquiry/compare/causation/periodization 任务载入对应实验室。Guided Session Builder / Healthy Chunking 位于 Task Library 之后、跨场景挑战之前，按场景和 15/30/45/75 分钟筛选路线卡；每条路线使用当前 scenario 的 Scene Reader、Lesson Pack、Activity Pack、Mission Board、Source Reader、Argument Studio 或 Compare Lab 资源，展示步骤、估时、section hash、linked sources、交付物，并可跳转、勾选进度或复制路线单。场景体验中的 Scene Reader、Lesson Pack、Mission Board、Decision Panel、Argument Studio、Source Reader 与 Activity Packs 都有稳定 section id，任务库、探究路径和路线卡打开场景时会尽量跳到对应 hash。Evidence-to-Argument Studio 6.0 位于场景体验的 Source Lab / 历史岔路口之后，会汇集当前身份的来源摘记、Scene Reader 场景观察、lesson flow、check question、任务证据清单、日常生活切片、时间线事件和已选决策，帮助用户把材料组织成“主张—证据—推理—反证/不确定性”的完整论证；论证草稿同样优先保存在 localStorage，浏览器限制时回退到 sessionStorage。Teacher Pack 6.0 面板可复制整合 lessonPack、课堂讨论导入、来源追问、rubric 检查清单和史料自检的完整课堂包。Atlas Workspace 位于学习档案袋、Time-Space Atlas、跨场景挑战和 Inquiry Pathways 中：跨场景挑战、路线探究笔记与探究路径都拥有 notes、checkedEvidence/items、completed、updatedAt 状态，并通过 localStorage/sessionStorage fallback 持久保存。Inquiry Pathways 8.0 位于跨场景挑战与 Compare Lab 之间，提供“繁荣背后的秩序成本”“知识如何穿过纸张、师承与市场”“市场不是自由的真空”“危机消息抵达普通人的那一刻”“谁在替历史发声”“劳动纪律与安全边界”“大西洋糖业、强制劳动与沉默档案”“棉花、帝国与劳动纪律”“季风港口世界：语言、信任与国家权力”“斯瓦希里季风港口：语言、名声与信用”“Geniza 与印度洋信用：信件、风险与幸存档案”等策展路径；每条路径都可展开查看场景 chips、driving question、why these scenarios、探究任务、discussion moves、rubric、suggested evidence、工作清单和用户草稿，并可复制完整 inquiry pack + user draft 或一键把前两个场景与对应 lens 送入 Compare Lab。Compare Lab 会把两个不同历史身份放入同一个比较镜头中，展示与该镜头相关的日常、制度、风险、知识、市场、来源、Scene Reader 或选择证据，并生成包含提示、证据清单、输出结构和评分标准的课堂作业；比较对象和镜头会写入 URL 参数，方便分享。Time-Space Atlas / Route Explorer 12.1 位于 AtlasOverview 之后、学习档案袋之前，不引入额外地图依赖；它复用 scenario.coordinates/year/region/theme/accent 渲染风格化地图点、当前路线连线与时间轨，支持按地区和主题筛选可见场景。路线卡覆盖知识城市、市场走廊、危机新闻、劳动纪律与安全、工业城市与全球交换、糖与棉的帝国路线、棉花帝国与工厂时间、季风海上亚洲、西印度洋季风路线、红海—印度洋信用路线，并显示未开始 / 草稿 / 已完成状态 chip；新增季风海上亚洲路线把巴格达、长安、马六甲、广州和孟买连接起来，强调 Indian Ocean / monsoon maritime networks、港口中介、文书治理、帝国权力和商业风险；新增西印度洋季风路线把基尔瓦、巴格达、马六甲、广州和孟买连接起来，强调 Swahili Coast / western Indian Ocean、monsoon timing、黄金/布匹/陶瓷、港口信用、written evidence 和 source limits；新增红海—印度洋信用路线把 Fustat、基尔瓦、巴格达、马六甲和孟买连接起来，强调 Cairo Geniza merchant letters、contracts、credit、port intermediaries、seasonality、sea risk 和 archival survival；大西洋糖业/强制劳动路线把圣多明各、曼彻斯特、孟买和广州连接起来，强调 commodity empires、coercion、港口中介与 source silence；每条路线可打开第一站、跳到 Scene Reader / Source Reader、载入 Compare Lab，并通过现有 copyTextToClipboard 导出包含 map focus、时间顺序、交付物、建议证据、Route Inquiry Notebook 和 Compare Lab 设置的路线作业单。Route Inquiry Notebook 会随选中路线显示 stop checklist、evidence prompt checklist、笔记 textarea、draft/complete 状态、保存时间和复制/导出按钮，内容优先保存到 localStorage，受限时回退 sessionStorage，并纳入学习档案袋/archive export。顶部概览、学习档案袋和场景卡片用已有年份、坐标与任务状态提供紧凑的时间/地点/进度导航，不引入额外地图依赖。

## 技术栈

- Vite
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

生产构建会把 React、Framer Motion 和 Lucide React 拆成独立 vendor chunks，以降低单个 Vite chunk 过大的告警风险。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 后续方向

- 加入 MapLibre / Leaflet 历史地图层
- 加入中英文切换
- 增加更多地区、时代和普通人身份
- 扩展任务进度为多设备同步或课堂模式
- 生成可分享的历史选择卡片
