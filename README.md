# TimeAtlas

TimeAtlas 是一个互动历史网站。它不把历史做成单纯的年份表或百科条目，而是让用户选择一个历史身份，进入那个时代的一天，面对一个关键选择，并把自己的选择放回真实历史背景中理解。

## 当前 MVP

Scenario Deep Dive / Scene Reader 9.0 包含 8 个历史身份：

- 唐代长安西市商人
- 北宋汴京茶铺学徒
- 明代江南读书人
- 清末广州十三行买办助手
- 二战伦敦普通居民
- 阿拔斯巴格达纸坊抄写员
- 桑海时期廷巴克图手稿学生
- 阿兹特克帝国晚期特诺奇蒂特兰集市卖家

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
- 场景卡片与总览中的进度徽章
- Evidence Lab / Source Reader 4.0：按来源类型筛选，展示转述摘记、视角、可靠边界、史料追问和证据标签
- Learning Workbench 4.0：新增“史料判断”任务类型，包含来源偏见、缺席声音、事实与推论边界的任务
- 任务板按任务类型与状态（全部 / 未开始 / 草稿 / 已完成）筛选
- 任务板关联来源支持一键把格式化证据卡加入当前草稿笔记
- 可复制的学习输出，整合任务、证据清单、草稿、输出结构、关联来源、史料自检和反思提示
- Guided Lesson Pack 6.0：每个身份提供探究问题、quick/source/debate 课堂流程、可揭示检查题答案、误区卡、讨论角色和可复制 exit ticket
- Evidence-to-Argument Studio 6.0：按当前身份保存论证草稿，支持撰写主张，勾选/记录来源、Scene Reader、lesson flow、check question、任务、日常、时间线与历史选择证据，补充推理、反证与不确定性，并复制/导出完整论证
- Teacher Pack 6.0：基于 lessonPack、任务 rubric、来源追问和史料自检复制更完整的课堂流程、检查题、误区卡、角色讨论、exit ticket 与检查清单
- 学习档案袋汇总全站完成数、草稿数、最近草稿、跨场景工作区条目和勾选数，并支持复制全部学习档案
- Atlas Workspace 8.0：跨场景挑战提供 4 个带稳定 ID 的比较任务，可勾选清单、撰写草稿、标记完成、复制模板 + 草稿，并按本机持久保存
- Atlas Connections / Inquiry Pathways 8.0：提供 5 条带稳定 ID 的策展式跨场景探究路径，每条包含 driving question、场景路径、讨论推进、任务、rubric、建议证据、持久化路径清单、探究草稿、完成状态和可复制 inquiry pack + user draft
- Inquiry Pathways 可一键打开首个场景，或把路径的前两个场景与比较镜头载入 Compare Lab，并遵守 reduced motion 设置滚动定位
- Cross-Scenario Compare Lab / Assignment Builder：选择两个不同身份和 7 个比较镜头之一（日常生活、制度约束、风险与安全、知识传播、市场与交换、来源可信度、历史选择），生成并复制课堂比较作业；建议引用证据会在合适镜头中优先纳入 Scene Reader 场景证据

## 来源层与探索体验

每个历史身份现在包含 2-3 条来源或参考：原始材料、机构档案或研究著作。来源层用于说明场景依据和解释边界；互动情节仍是面向学习体验的合成叙事，不等同于单一史料复原。Source Reader 4.0 为每条来源补充简短转述摘记、史料追问、可靠性边界、视角说明和证据标签，避免使用长篇版权原文。

画廊支持按标题、时代、地点、身份、主题、关键术语、来源标题、证据标签、任务标题、任务类型和 Scene Reader 场景文本搜索，并可按地区或主题快速筛选。Scene Reader 9.0 位于 Narrative Panel 之后、Daily Life Grid 之前，为每个身份提供 4 个可切换 scene beats；每个 beat 展示 time label、感官细节、历史张力、evidence hook、learner prompt、关联日常 chips 与关联来源标题，并可复制格式化 Scene Observation。Learning Workbench 4.0 会为每个任务展示任务类型徽章、交付物、预计用时、难度、输出结构、好答案标准、史料自检、工作步骤、证据检查清单、句子开头、关联来源和反思提示；用户可按任务类型或状态过滤任务，勾选证据、撰写草稿笔记、把来源证据卡追加到草稿、标记完成，并复制一段学习输出用于课堂讨论或复盘。Guided Lesson Pack 6.0 位于日常生活切片之后、Mission Board 之前，为每个身份提供可切换 quick/source/debate 模式的课堂步骤、可揭示答案的 check questions、misconception cards、discussion roles 和可复制 exit tickets。Evidence-to-Argument Studio 6.0 位于场景体验的 Source Lab / 历史岔路口之后，会汇集当前身份的来源摘记、Scene Reader 场景观察、lesson flow、check question、任务证据清单、日常生活切片、时间线事件和已选决策，帮助用户把材料组织成“主张—证据—推理—反证/不确定性”的完整论证；论证草稿同样优先保存在 localStorage，浏览器限制时回退到 sessionStorage。Teacher Pack 6.0 面板可复制整合 lessonPack、课堂讨论导入、来源追问、rubric 检查清单和史料自检的完整课堂包。Atlas Workspace 8.0 位于学习档案袋、跨场景挑战和 Inquiry Pathways 中：跨场景挑战与探究路径都拥有 notes、checkedEvidence/items、completed、updatedAt 状态，并通过 localStorage/sessionStorage fallback 持久保存。Inquiry Pathways 8.0 位于跨场景挑战与 Compare Lab 之间，提供“繁荣背后的秩序成本”“知识如何穿过纸张、师承与市场”“市场不是自由的真空”“危机消息抵达普通人的那一刻”“谁在替历史发声”五条策展路径；每条路径都可展开查看场景 chips、driving question、why these scenarios、探究任务、discussion moves、rubric、suggested evidence、工作清单和用户草稿，并可复制完整 inquiry pack + user draft 或一键把前两个场景与对应 lens 送入 Compare Lab。Compare Lab 会把两个不同历史身份放入同一个比较镜头中，展示与该镜头相关的日常、制度、风险、知识、市场、来源、Scene Reader 或选择证据，并生成包含提示、证据清单、输出结构和评分标准的课堂作业；比较对象和镜头会写入 URL 参数，方便分享。顶部概览、学习档案袋和场景卡片用已有年份、坐标与任务状态提供紧凑的时间/地点/进度导航，不引入额外地图依赖。

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
