import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock3,
  Copy,
  Compass,
  Landmark,
  LibraryBig,
  MapPin,
  Route,
  Search,
  ScrollText,
  Scale,
  Share2,
  ShieldAlert,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react'
import {
  atlasInquiryPaths,
  atlasMapRoutes,
  compareLenses,
  scenarios,
  type AtlasInquiryPath,
  type AtlasMapRoute,
  type CompareLens,
  type DailyLifeKey,
  type ActivityPack,
  type ActivityPackMode,
  type DecisionOption,
  type LessonPackMode,
  type Mission,
  type MissionTaskType,
  type Scenario,
  type SocialActor,
  type SocialEncounter,
} from './data/scenarios'
import './App.css'

const defaultScenarioId = scenarios[1]?.id ?? scenarios[0].id
const defaultCompareScenarioAId = scenarios[0]?.id ?? defaultScenarioId
const defaultCompareScenarioBId = scenarios.find((scenario) => scenario.id !== defaultCompareScenarioAId)?.id ?? defaultScenarioId
const defaultCompareLensKey = compareLenses[0]?.key ?? 'daily-life'
const missionProgressStorageKey = 'timeatlas:mission-progress'
const missionWorkStorageKey = 'timeatlas:mission-work'
const argumentStudioStorageKey = 'timeatlas:argument-studio-drafts'
const corroborationStudioStorageKey = 'timeatlas:corroboration-studio-drafts'
const causationLabStorageKey = 'timeatlas:causation-lab-drafts'
const periodizationLabStorageKey = 'timeatlas:periodization-lab-drafts'
const perspectivesLabStorageKey = 'timeatlas:perspectives-agency-lab-drafts'
const contextLabStorageKey = 'timeatlas:context-scale-lab-drafts'
const significanceLabStorageKey = 'timeatlas:significance-memory-lab-drafts'
const synthesisStudioStorageKey = 'timeatlas:synthesis-writing-studio-drafts'
const evidenceCaseFileStorageKey = 'timeatlas:evidence-case-file-drafts'
const compareLabStorageKey = 'timeatlas:compare-lab-drafts'
const workspaceStorageKey = 'timeatlas:atlas-workspace-8'
const guidedSessionProgressStorageKey = 'timeatlas:guided-session-progress'
const taskModuleProgressStorageKey = 'timeatlas:task-module-progress'
const assignmentBuilderStorageKey = 'timeatlas:assignment-builder-draft'
const taskWorkbenchStorageKey = 'timeatlas:task-workbench-drafts'
const actorNetworkDraftStorageKey = 'timeatlas:actor-network-drafts'
const defaultScenarioSectionId = 'experience'
const sectionIds = {
  experience: defaultScenarioSectionId,
  dailyLife: 'daily-life',
  sceneReader: 'scene-reader',
  lessonPack: 'lesson-pack',
  activityPacks: 'activity-packs',
  missionBoard: 'mission-board',
  actorNetwork: 'actor-network',
  decisionPanel: 'decision-panel',
  argumentStudio: 'argument-studio',
  sourceReader: 'source-reader',
  evidenceCaseFiles: 'case-files',
  causationLab: 'causation-lab',
  periodizationLab: 'periodization-lab',
  perspectivesLab: 'perspectives-agency-lab',
  contextLab: 'context-scale-lab',
  significanceLab: 'significance-memory-lab',
  synthesisStudio: 'synthesis-writing-studio',
  compareLab: 'compare-lab',
} as const

const pageIds = [
  'home',
  'scenario',
  'atlas',
  'evidence',
  'labs',
  'tasks',
  'about',
] as const

const legacyLabPageIds = ['causation', 'periodization', 'perspectives', 'context', 'significance', 'synthesis'] as const

type PageId = typeof pageIds[number]

const pageLabels: Record<PageId, { label: string; eyebrow: string; description: string }> = {
  home: { label: '首页', eyebrow: 'Start', description: '身份选择、项目概览与时间地图' },
  scenario: { label: '场景体验', eyebrow: 'Scenario', description: '进入一个历史身份的一天、任务与来源层' },
  atlas: { label: '时空路线', eyebrow: 'Atlas', description: '地图路线、跨场景挑战、探究路径与比较实验室' },
  evidence: { label: '史料证据', eyebrow: 'Evidence', description: '全站史料地图、证据篮与互证工作台' },
  labs: { label: '历史思维', eyebrow: 'Labs', description: '因果、分期、多视角、情境化、历史意义与综合写作' },
  tasks: { label: '任务档案', eyebrow: 'Tasks', description: '任务库、学习路径、作品集与导出' },
  about: { label: '项目理念', eyebrow: 'About', description: 'TimeAtlas 的设计思路与学习目标' },
}

const primaryPages: PageId[] = ['home', 'scenario', 'atlas', 'evidence', 'labs', 'tasks']

const optionCounts = scenarios.map((scenario) => scenario.decision.options.length)
const minOptionCount = Math.min(...optionCounts)
const maxOptionCount = Math.max(...optionCounts)
const totalSourceCount = scenarios.reduce((count, scenario) => count + scenario.sources.length, 0)
const totalMissionCount = scenarios.reduce((count, scenario) => count + scenario.missions.length, 0)
const timelineYears = scenarios.map((scenario) => scenario.year)
const earliestScenarioYear = Math.min(...timelineYears)
const latestScenarioYear = Math.max(...timelineYears)
const regionOptions = [...new Set(scenarios.map((scenario) => scenario.region))]
const themeOptions = [
  ...new Set(
    scenarios.flatMap((scenario) =>
      scenario.theme
        .split(/[、，,]/)
        .map((theme) => theme.trim())
        .filter(Boolean),
    ),
  ),
]
const missionTaskTypeOptions = [
  ...new Set(scenarios.flatMap((scenario) => scenario.missions.map((mission) => mission.taskType))),
]
const sortedScenarios = [...scenarios].sort((first, second) => first.year - second.year)
const atlasMissions = [
  {
    id: 'cross-era-risk-chain',
    title: '跨时代风险链',
    prompt: '选两个身份，比较“远方消息”如何改变普通人的工作或安全感。',
    checklist: ['选择两个不同时代身份', '各写出一条风险或消息证据', '比较消息抵达后的行动变化', '形成一句跨时代结论'],
    template: '身份 A：\n关键证据：\n身份 B：\n关键证据：\n共同点 / 差异：\n我的结论：',
  },
  {
    id: 'institutions-and-markets',
    title: '制度与市场',
    prompt: '找出三个场景中市场被制度塑形的证据，说明自由与约束如何并存。',
    checklist: ['选择三个市场相关场景', '为每个场景标出制度线索', '区分机会与限制', '写出综合判断'],
    template: '场景 1：证据 + 解释\n场景 2：证据 + 解释\n场景 3：证据 + 解释\n综合判断：',
  },
  {
    id: 'how-knowledge-flows',
    title: '知识如何流动',
    prompt: '从书籍、文书、口耳传闻或档案中任选三条线索，解释知识传播的条件。',
    checklist: ['选出三条知识传播线索', '说明媒介或场所', '标出进入门槛', '写出仍不确定的问题'],
    template: '线索一：\n线索二：\n线索三：\n传播需要的条件：\n仍不确定的问题：',
  },
  {
    id: 'ordinary-choice-boundaries',
    title: '普通人的选择边界',
    prompt: '比较一个“冒险选择”和一个“保守选择”，判断它们各自依赖哪些历史条件。',
    checklist: ['选择一个冒险选择', '选择一个保守选择', '列出各自依赖的历史条件', '推演条件变化后的选择变化'],
    template: '冒险选择：\n依赖条件：\n保守选择：\n依赖条件：\n如果条件变化，选择会怎样改变：',
  },
]
const statItems = [
  { value: String(scenarios.length), label: '历史身份' },
  {
    value: minOptionCount === maxOptionCount ? String(minOptionCount) : `${minOptionCount}-${maxOptionCount}`,
    label: '选择分支 / 身份',
  },
  { value: String(totalSourceCount), label: '来源参考' },
  { value: String(totalMissionCount), label: '史证任务' },
]

function getScenarioById(id: string | null) {
  return scenarios.find((scenario) => scenario.id === id) ?? null
}

function getCompareLensByKey(key: string | null) {
  return compareLenses.find((lens) => lens.key === key) ?? compareLenses[0]
}

function getFallbackCompareScenarioId(excludedId: string) {
  return scenarios.find((scenario) => scenario.id !== excludedId)?.id ?? excludedId
}

function parseMissionState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as Record<string, string[]>
    }

    return Object.fromEntries(
      Object.entries(parsedState).filter((entry): entry is [string, string[]] =>
        Array.isArray(entry[1]) && entry[1].every((missionId) => typeof missionId === 'string'),
      ),
    )
  } catch {
    return {} as Record<string, string[]>
  }
}

type MissionWorkEntry = {
  notes: string
  checkedEvidence: string[]
  updatedAt?: string
}

type MissionWorkState = Record<string, MissionWorkEntry>

type ArgumentDraft = {
  claim: string
  evidence: string[]
  customEvidence: string
  reasoning: string
  counterEvidence: string
  updatedAt?: string
}

type ArgumentDraftState = Record<string, ArgumentDraft>

type CorroborationConfidence = 'high' | 'medium' | 'low' | 'uncertain'

type CorroborationDraft = {
  sourceIds: string[]
  provisionalClaim: string
  supportingEvidence: string
  tensions: string
  absentVoices: string
  confidence: CorroborationConfidence
  updatedAt?: string
}

type CorroborationDraftState = Record<string, CorroborationDraft>

type CompareConfidence = 'high' | 'medium' | 'low' | 'uncertain'

type CompareDraft = {
  scenarioAId: string
  scenarioBId: string
  lensKey: CompareLens['key']
  selectedEvidenceIdsA: string[]
  selectedEvidenceIdsB: string[]
  comparativeClaim: string
  similarity: string
  difference: string
  evidenceBridge: string
  sourceLimits: string
  confidence: CompareConfidence
  updatedAt?: string
}

type CompareDraftState = Record<string, CompareDraft>

type CompareWorkspaceTab = 'assignment' | 'evidence' | 'brief'

type CausationConfidence = 'high' | 'medium' | 'low' | 'uncertain'

type CauseCategory = 'economic' | 'political-institutional' | 'environmental-geographic' | 'social-labor' | 'cultural-knowledge' | 'source-limitation'

type CausationDraft = {
  backgroundConditions: string
  immediateTriggers: string
  constraints: string
  humanChoices: string
  shortTermConsequences: string
  longTermChange: string
  contingency: string
  missingEvidence: string
  confidence: CausationConfidence
  selectedEvidenceIds: string[]
  updatedAt?: string
}

type CausationDraftState = Record<string, CausationDraft>

type CausationInquiry = {
  id: string
  title: string
  subtitle: string
  drivingQuestion: string
  scenarioIds: string[]
  focus: string
  tags: string[]
  suggestedCategories: CauseCategory[]
}

type CausationEvidence = {
  id: string
  inquiryId: string
  scenario: Scenario
  sourceType: 'timeline' | 'decision-context' | 'decision-option' | 'scene-beat' | 'source' | 'mission'
  label: string
  title: string
  text: string
  categories: CauseCategory[]
}

type PeriodizationConfidence = 'high' | 'medium' | 'low' | 'uncertain'

type PeriodizationDraft = {
  periodStart: string
  periodEnd: string
  continuities: string
  changes: string
  turningPoint: string
  beforeAfterEvidence: string
  periodLabel: string
  alternativePeriodization: string
  missingEvidence: string
  confidence: PeriodizationConfidence
  selectedEvidenceIds: string[]
  updatedAt?: string
}

type PeriodizationDraftState = Record<string, PeriodizationDraft>

type ContextConfidence = 'high' | 'medium' | 'low' | 'uncertain'

type ContextDraft = {
  localSetting: string
  regionalConnections: string
  largeScaleForces: string
  sourceContext: string
  anachronismRisk: string
  contextClaim: string
  missingContext: string
  confidence: ContextConfidence
  selectedEvidenceIds: string[]
  updatedAt?: string
}

type ContextDraftState = Record<string, ContextDraft>

type ContextInquiry = {
  id: string
  title: string
  subtitle: string
  drivingQuestion: string
  scenarioIds: string[]
  focus: string
  tags: string[]
  scaleFrame: string
}

type ContextEvidenceLabel = 'local' | 'regional' | 'imperial-global' | 'source-context' | 'presentism-risk'

type ContextEvidence = {
  id: string
  inquiryId: string
  scenario: Scenario
  label: ContextEvidenceLabel
  sourceType: 'scenario-context' | 'timeline' | 'key-term' | 'daily-life' | 'scene-beat' | 'decision-context' | 'decision-option' | 'source' | 'real-history' | 'source-evidence-use'
  title: string
  text: string
  scaleHint: string
  tags: string[]
}

type SignificanceConfidence = 'high' | 'medium' | 'low' | 'uncertain'

type SignificanceDraft = {
  eventOrProcess: string
  whoItMatteredTo: string
  contemporarySignificance: string
  longTermSignificance: string
  scaleOfImpact: string
  contestedMeaning: string
  sourceLimits: string
  significanceClaim: string
  selectedEvidenceIds: string[]
  confidence: SignificanceConfidence
  updatedAt?: string
}

type SignificanceDraftState = Record<string, SignificanceDraft>

type SignificanceInquiry = {
  id: string
  title: string
  subtitle: string
  drivingQuestion: string
  scenarioIds: string[]
  focus: string
  tags: string[]
  memoryFrame: string
}

type SynthesisConfidence = 'high' | 'medium' | 'low' | 'uncertain'

type SynthesisDraft = {
  drivingQuestion: string
  workingThesis: string
  claimScope: string
  evidenceIds: string[]
  reasoningBridge: string
  counterargument: string
  sourceLimits: string
  paragraphPlan: string
  significanceLink: string
  revisionChecklist: string
  confidence: SynthesisConfidence
  updatedAt?: string
}

type SynthesisDraftState = Record<string, SynthesisDraft>

type EvidenceCaseFileDraft = {
  sourceNotes: string
  contextNotes: string
  corroborationNotes: string
  tensions: string
  missingVoices: string
  workingClaim: string
  confidence: SynthesisConfidence
  completedTaskIds: string[]
  updatedAt?: string
}

type EvidenceCaseFileDraftState = Record<string, EvidenceCaseFileDraft>

type EvidenceCasePacketItem = {
  id: string
  scenario: Scenario
  sourceType: 'source' | 'scene-beat' | 'decision' | 'timeline'
  title: string
  text: string
  label: string
  tags: string[]
}

type EvidenceCasePacket = {
  sources: EvidenceCasePacketItem[]
  sceneBeats: EvidenceCasePacketItem[]
  decisions: EvidenceCasePacketItem[]
  timelines: EvidenceCasePacketItem[]
}

type EvidenceCaseFile = {
  id: string
  title: string
  subtitle: string
  drivingQuestion: string
  scenarioIds: string[]
  skills: string[]
  tags: string[]
  selectorTerms: string[]
  taskChecklist: string[]
  suggestedClaimFrame: string
}

type SynthesisInquiryPreset = {
  id: string
  title: string
  subtitle: string
  drivingQuestion: string
  claimScope: string
  focus: string
  tags: string[]
  paragraphFrame: string[]
}

type SynthesisEvidenceOrigin =
  | 'case-file'
  | 'corroboration'
  | 'causation'
  | 'periodization'
  | 'perspectives'
  | 'contextualization'
  | 'significance'
  | 'compare'
  | 'actor-network'
  | 'mission-work'
  | 'workspace'

type SynthesisEvidence = {
  id: string
  origin: SynthesisEvidenceOrigin
  originLabel: string
  title: string
  text: string
  tags: string[]
  scenarioTitle?: string
  scenarioId?: string
  inquiryTitle?: string
  updatedAt?: string
}

type SignificanceEvidenceLabel = 'immediate-impact' | 'long-term-change' | 'scale-reach' | 'contested-meaning' | 'memory-archive' | 'ordinary-life'

type SignificanceEvidence = {
  id: string
  inquiryId: string
  scenario: Scenario
  label: SignificanceEvidenceLabel
  sourceType: 'identity-summary' | 'timeline' | 'daily-life' | 'scene-beat' | 'decision-context' | 'decision-option' | 'source' | 'real-history' | 'interpretation-note' | 'source-evidence-use'
  title: string
  text: string
  significanceHint: string
  tags: string[]
}

type PerspectivesConfidence = 'high' | 'medium' | 'low' | 'uncertain'

type PerspectivesDraft = {
  actorView: string
  constraints: string
  availableKnowledge: string
  stakesAndRisks: string
  agencyClaim: string
  presentismWarning: string
  sourcePerspectiveLimits: string
  missingVoices: string
  confidence: PerspectivesConfidence
  selectedEvidenceIds: string[]
  updatedAt?: string
}

type PerspectivesDraftState = Record<string, PerspectivesDraft>

type PerspectivesInquiry = {
  id: string
  title: string
  subtitle: string
  drivingQuestion: string
  scenarioIds: string[]
  focus: string
  tags: string[]
  agencyFrame: string
}

type PerspectivesEvidenceLabel = 'actor position' | 'constraint' | 'knowledge limit' | 'risk/stake' | 'source perspective' | 'absent voice'

type PerspectivesEvidence = {
  id: string
  inquiryId: string
  scenario: Scenario
  label: PerspectivesEvidenceLabel
  sourceType: 'identity-role-summary' | 'daily-life' | 'scene-beat' | 'decision-context' | 'decision-option' | 'source' | 'source-evidence-use'
  title: string
  text: string
  sourcePerspective?: string
  sourceReliability?: string
  sourceQuestion?: string
  tags: string[]
}

type PeriodizationInquiry = {
  id: string
  title: string
  subtitle: string
  drivingQuestion: string
  scenarioIds: string[]
  focus: string
  tags: string[]
  suggestedTurningPoint: string
}

type PeriodizationEvidence = {
  id: string
  inquiryId: string
  scenario: Scenario
  year: number
  sourceType: 'scenario-year' | 'timeline' | 'scene-beat' | 'decision-context' | 'decision-option' | 'real-history' | 'source'
  label: string
  title: string
  text: string
  evidenceHint: string
}

type WorkspaceEntry = {
  notes: string
  checkedEvidence: string[]
  completed: boolean
  updatedAt?: string
}

type WorkspaceState = {
  atlasMissions: Record<string, WorkspaceEntry>
  inquiryPaths: Record<string, WorkspaceEntry>
  routeNotebooks: Record<string, WorkspaceEntry>
}

type WorkspaceStats = {
  totalEntries: number
  draftEntries: number
  completedEntries: number
  checkedEvidenceCount: number
  recentEntries: {
    key: string
    title: string
    category: string
    entry: WorkspaceEntry
  }[]
}

type TaskLibrarySource = 'mission' | 'activity' | 'lesson' | 'debate' | 'actor-network' | 'inquiry' | 'compare' | 'causation' | 'periodization' | 'perspectives' | 'contextualization' | 'significance' | 'synthesis' | 'case-file'
type DurationBand = 'short' | 'medium' | 'long' | 'extended'
type ScenarioSectionId = typeof sectionIds[keyof typeof sectionIds]
type ScenarioExperienceTab = 'overview' | 'scenes' | 'daily' | 'lesson' | 'activities' | 'missions' | 'actors' | 'decision' | 'sources' | 'argument'

const scenarioExperienceTabs: {
  id: ScenarioExperienceTab
  label: string
  eyebrow: string
  description: string
  hash: ScenarioSectionId
}[] = [
  { id: 'overview', label: '概览', eyebrow: 'Overview', description: '身份卡、时间线与情境开场', hash: sectionIds.experience },
  { id: 'scenes', label: '现场阅读', eyebrow: 'Scene', description: '4 个历史现场 beat 与观察任务', hash: sectionIds.sceneReader },
  { id: 'daily', label: '日常生活', eyebrow: 'Daily', description: '食物、居所、工作、教育、风险与自由', hash: sectionIds.dailyLife },
  { id: 'lesson', label: '课堂包', eyebrow: 'Lesson', description: 'Quick / source / debate 课堂流程', hash: sectionIds.lessonPack },
  { id: 'activities', label: '活动包', eyebrow: 'Activity', description: 'Warmup、source lab、roleplay、writing 等任务', hash: sectionIds.activityPacks },
  { id: 'missions', label: '任务板', eyebrow: 'Missions', description: '证据任务、草稿、勾选与学习输出', hash: sectionIds.missionBoard },
  { id: 'actors', label: '人物网络', eyebrow: 'Actors', description: 'Social Worlds / Actor Network 协商地图', hash: sectionIds.actorNetwork },
  { id: 'decision', label: '历史岔路', eyebrow: 'Decision', description: '选择、后果与真实历史对照', hash: sectionIds.decisionPanel },
  { id: 'sources', label: '来源层', eyebrow: 'Sources', description: '来源类型、摘记、视角与可靠边界', hash: sectionIds.sourceReader },
  { id: 'argument', label: '论证', eyebrow: 'Argument', description: '把证据转成完整历史论证', hash: sectionIds.argumentStudio },
]


type SubpageNavItem<T extends string> = {
  id: T
  label: string
  eyebrow: string
  description: string
  hash: string
}

type AtlasSubpage = 'routes' | 'missions' | 'pathways' | 'compare'
type EvidenceSubpage = 'source-atlas' | 'case-files'
type LabsSubpage = typeof legacyLabPageIds[number]
type TasksSubpage = 'discover' | 'library' | 'builder' | 'workbench' | 'assessment' | 'debate' | 'sessions' | 'modules' | 'portfolio'
type DebateMode = 'decision-hearing' | 'source-challenge' | 'cross-era-forum'
type DebateDuration = 15 | 30 | 45

const evidenceSubpages: SubpageNavItem<EvidenceSubpage>[] = [
  { id: 'source-atlas', label: 'Source Atlas', eyebrow: 'Atlas', description: '全站来源搜索、证据篮与互证', hash: 'source-atlas' },
  { id: 'case-files', label: 'Case Files', eyebrow: 'Quests', description: '6 个来源任务档案与证据包', hash: sectionIds.evidenceCaseFiles },
]

const atlasSubpages: SubpageNavItem<AtlasSubpage>[] = [
  { id: 'routes', label: '路线地图', eyebrow: 'Routes', description: '地图 pins、路线时间轨与 Route Notebook', hash: 'time-space-atlas' },
  { id: 'missions', label: '跨场景挑战', eyebrow: 'Missions', description: 'Atlas Workspace 任务草稿与勾选', hash: 'atlas-missions' },
  { id: 'pathways', label: '探究路径', eyebrow: 'Pathways', description: '策展 inquiry paths 与 Compare 入口', hash: 'atlas-inquiry-paths' },
  { id: 'compare', label: '比较实验室', eyebrow: 'Compare', description: '双场景比较镜头与作业生成', hash: sectionIds.compareLab },
]

const labsSubpages: SubpageNavItem<LabsSubpage>[] = [
  { id: 'causation', label: '因果变化', eyebrow: 'Causation', description: '因果链、触发、约束、后果与不确定性', hash: sectionIds.causationLab },
  { id: 'periodization', label: '连续分期', eyebrow: 'Periodization', description: '时间证据轨、转折点与历史分期', hash: sectionIds.periodizationLab },
  { id: 'perspectives', label: '多视角', eyebrow: 'Agency', description: '选择边界、能动性与反当下主义', hash: sectionIds.perspectivesLab },
  { id: 'context', label: '情境尺度', eyebrow: 'Context', description: '地方、区域、全球尺度与来源情境', hash: sectionIds.contextLab },
  { id: 'significance', label: '历史意义', eyebrow: 'Memory', description: '重要性、记忆、争议与档案沉默', hash: sectionIds.significanceLab },
  { id: 'synthesis', label: '综合写作', eyebrow: 'Writing', description: '把所有草稿汇总成综合历史论证', hash: sectionIds.synthesisStudio },
]

const tasksSubpages: SubpageNavItem<TasksSubpage>[] = [
  { id: 'discover', label: '任务发现', eyebrow: 'Discover', description: '按学习目标、时间和历史思维发现任务集合', hash: 'task-discovery' },
  { id: 'library', label: '任务库', eyebrow: 'Library', description: '全站任务搜索、筛选与启动', hash: 'task-library' },
  { id: 'builder', label: '任务组合', eyebrow: 'Builder', description: '组合最多 6 个任务，生成学生任务单与教师指南', hash: 'assignment-builder' },
  { id: 'workbench', label: '任务执行台', eyebrow: 'Workbench', description: '按单个任务记录清单、证据、主张与反思', hash: 'task-workbench' },
  { id: 'assessment', label: '评价反馈', eyebrow: 'Assessment', description: '按任务、组合或模块生成 rubric、评分指南与反馈句式', hash: 'assessment-studio' },
  { id: 'debate', label: '辩论工作台', eyebrow: 'Debate', description: '角色卡、证据卡、回合计划与可复制指南', hash: 'debate-studio' },
  { id: 'sessions', label: '学习路线', eyebrow: 'Sessions', description: '15/30/45/75 分钟 Guided Sessions', hash: 'guided-session-builder' },
  { id: 'modules', label: '单元模块', eyebrow: 'Modules', description: '6 个跨页学习单元、步骤进度与导出', hash: 'task-modules' },
  { id: 'portfolio', label: '作品档案', eyebrow: 'Portfolio', description: '学习草稿、完成记录与导出', hash: 'portfolio' },
]

type GuidedSessionRoute = {
  id: string
  title: string
  minutes: 15 | 30 | 45 | 75
  scenario: Scenario
  purpose: string
  steps: {
    title: string
    minutes: number
    description: string
    hash: ScenarioSectionId
  }[]
  resources: string[]
  linkedSourceTitles: string[]
  deliverable: string
}

type GuidedSessionProgressState = Record<string, string[]>

type TaskModuleAction =
  | { type: 'scenario', scenarioId: string, hash?: ScenarioSectionId }
  | { type: 'atlas', hash: string, inquiryPathId?: string, routeId?: string }
  | { type: 'labs', lab: LabsSubpage, inquiryId?: string }
  | { type: 'evidence' }
  | { type: 'synthesis', presetId: string }

type TaskModuleStep = {
  id: string
  title: string
  minutes: number
  actionLabel: string
  description: string
  action: TaskModuleAction
}

type TaskModule = {
  id: string
  title: string
  subtitle: string
  scenarioIds: string[]
  tags: string[]
  totalMinutes: number
  drivingQuestion: string
  steps: TaskModuleStep[]
  finalDeliverable: string
}

type TaskModuleProgressState = Record<string, string[]>

type LibraryTask = {
  id: string
  title: string
  context: string
  scenarioId?: string
  category: string
  source: TaskLibrarySource
  sourceLabel: string
  durationMinutes: number
  durationBand: DurationBand
  summary: string
  deliverable: string
  tags: string[]
  sourceBased: boolean
  searchText: string
  primaryActionLabel?: string
  secondaryActionLabel?: string
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  onStartTask?: () => void
  workbenchPrompts?: string[]
  checklist?: string[]
  evidencePrompts?: string[]
  formatSheet: () => string
}


type TaskWorkbenchDraft = {
  taskId: string
  checkedPromptIds: string[]
  evidenceNotes: string
  claimExplanation: string
  sourceLimits: string
  reflection: string
  completed: boolean
  updatedAt?: string
}

type TaskWorkbenchState = Record<string, TaskWorkbenchDraft>

type ActorNetworkDraft = {
  selectedActorIds: string[]
  roleBrief: string
  perspectiveComparison: string
  negotiationPlan: string
  missingVoiceNote: string
  evidenceNotes: string
  completed: boolean
  updatedAt?: string
}

type ActorNetworkDraftState = Record<string, ActorNetworkDraft>

type TaskWorkbenchStats = {
  activeDrafts: [string, TaskWorkbenchDraft][]
  activeCount: number
  completedCount: number
  checkedPromptCount: number
  recentDrafts: [string, TaskWorkbenchDraft][]
}

type AssignmentBuilderDraft = {
  selectedTaskIds: string[]
  title: string
  audience: string
  timeBox: string
  learningGoal: string
  finalDeliverable: string
  teacherNotes: string
  studentInstructions: string
  rubricFocus: string
  updatedAt?: string
}

type AssignmentBuilderSummary = {
  selectedTasks: LibraryTask[]
  totalMinutes: number
  sourceCategories: string[]
  scenarioCoverage: string[]
  historicalThinkingTags: string[]
}

type AssessmentTargetType = 'assignment' | 'task' | 'module'

type RubricCriterion = {
  id: string
  title: string
  focus: string
  levels: {
    exceeds: string
    meets: string
    developing: string
    beginning: string
  }
}

type AssessmentDraft = {
  targetType: AssessmentTargetType
  taskId: string
  moduleId: string
}

type TaskLibraryPreset = {
  id: string
  label: string
  searchQuery?: string
  category?: string
  durationBand?: DurationBand
  source?: TaskLibrarySource
  sourceBasedOnly?: boolean
  matcher: (task: LibraryTask) => boolean
}

type TaskPackSelector = {
  taskIds?: string[]
  sources?: TaskLibrarySource[]
  scenarioIds?: string[]
  durationBands?: DurationBand[]
  keywords?: string[]
  sourceBasedOnly?: boolean
}

type TaskPack = {
  id: string
  title: string
  audience: string
  totalMinutes: number
  learningGoal: string
  finalDeliverable: string
  teacherNotes: string
  studentInstructions: string
  rubricFocus: string
  tags: string[]
  coverage: string[]
  selectors: TaskPackSelector[]
  fallbackKeywords: string[]
}

type TaskDiscoveryCollection = TaskLibraryPreset & {
  reason: string
  audience: string
  duration: string
  secondaryAction?: 'open-first' | 'copy-first'
}

type CoachRecommendationType = 'resume-workbench' | 'continue-module' | 'synthesis-next' | 'portfolio-next' | 'compare-bridge' | 'starter'

type LearningCoachRecommendation = {
  id: string
  type: CoachRecommendationType
  typeLabel: string
  title: string
  reason: string
  estimatedMinutes: number
  tags: string[]
  ctaLabel: string
  action: () => void
}

type LearningCoachPlanSnapshot = {
  totalCompletedMissionCount: number
  missionDraftCount: number
  workspaceStats: WorkspaceStats
  taskModuleStats: ReturnType<typeof getTaskModuleProgressStats>
  taskWorkbenchStats: TaskWorkbenchStats
  labDraftCount: number
  compareDraftCount: number
  synthesisDraftCount: number
  caseFileDraftCount: number
}


const taskLibrarySourceFilters: { value: 'all' | TaskLibrarySource, label: string }[] = [
  { value: 'all', label: '全部来源' },
  { value: 'mission', label: 'Scenario Missions' },
  { value: 'activity', label: 'Activity Packs' },
  { value: 'lesson', label: 'Lesson Pack' },
  { value: 'debate', label: 'Debate Studio' },
  { value: 'actor-network', label: 'Actor Network' },
  { value: 'inquiry', label: 'Inquiry Paths' },
  { value: 'compare', label: 'Compare Lenses' },
  { value: 'causation', label: 'Causation Lab' },
  { value: 'periodization', label: 'Periodization Lab' },
  { value: 'perspectives', label: 'Perspectives Lab' },
  { value: 'contextualization', label: 'Context & Scale Lab' },
  { value: 'significance', label: 'Significance Lab' },
  { value: 'synthesis', label: 'Synthesis Studio' },
  { value: 'case-file', label: 'Evidence Case Files' },
]

type SourceAtlasEntry = {
  id: string
  scenario: Scenario
  source: Scenario['sources'][number]
  searchText: string
}

const evidenceCaseFiles: EvidenceCaseFile[] = [
  {
    id: 'sugar-coercion-archive-silence',
    title: 'Sugar, Coercion, and Archive Silence',
    subtitle: '糖、强制劳动与档案沉默',
    drivingQuestion: '糖业商品链怎样依赖强制劳动，而现存来源又怎样过滤被奴役者的声音？',
    scenarioIds: ['saint-domingue-sugar-worker', 'industrial-manchester-mill-worker', 'colonial-bombay-mill-worker', 'qing-guangzhou-comprador'],
    skills: ['sourcing', 'corroboration', 'silence'],
    tags: ['sugar', 'coercion', 'archive silence', 'labor discipline', 'commodity empire'],
    selectorTerms: ['sugar', 'coercion', 'enslaved', 'plantation', 'commodity', 'labor', 'archive', 'silence', '糖', '强制', '奴役', '劳动', '档案'],
    taskChecklist: ['标出至少两条关于强制或劳动纪律的来源', '比较来源视角：谁在记录、谁被记录', '写出一条档案沉默或缺席声音', '形成一句谨慎 claim'],
    suggestedClaimFrame: '糖业利润不是单纯市场结果，而是建立在强制劳动、制度暴力和不完整档案之上；因此结论必须同时说明证据与沉默。',
  },
  {
    id: 'monsoon-credit-port-trust',
    title: 'Monsoon Credit and Port Trust',
    subtitle: '季风信用与港口信任',
    drivingQuestion: '远距离海上贸易怎样把季风时间、信用文书、语言中介和港口权力变成可执行的信任？',
    scenarioIds: ['fustat-geniza-merchant-apprentice', 'kilwa-swahili-gold-merchant', 'malacca-monsoon-port-broker', 'qing-guangzhou-comprador'],
    skills: ['contextualization', 'corroboration', 'sourcing'],
    tags: ['monsoon', 'credit', 'port trust', 'letters', 'intermediaries'],
    selectorTerms: ['monsoon', 'credit', 'letter', 'contract', 'port', 'broker', 'trust', 'merchant', '季风', '信用', '港口', '信件', '合约', '中介'],
    taskChecklist: ['找出季风/时间风险证据', '找出信用或文书证据', '说明中介和港口规则如何降低或制造风险', '写出一条关于 trust 的解释'],
    suggestedClaimFrame: '港口信任来自季节知识、书信合约、名声网络和制度权力的组合，而不是来自“自由市场”的自然秩序。',
  },
  {
    id: 'nonwritten-records-imperial-labor',
    title: 'Nonwritten Records and Imperial Labor',
    subtitle: '非文字记录与帝国劳动',
    drivingQuestion: 'khipu、道路仓储、考古和殖民文本怎样让帝国劳动可见，同时限制普通劳动者的解释权？',
    scenarioIds: ['inca-cusco-khipu-runner', 'tenochtitlan-market-seller', 'fustat-geniza-merchant-apprentice', 'saint-domingue-sugar-worker'],
    skills: ['sourcing', 'contextualization', 'silence'],
    tags: ['khipu', 'nonwritten evidence', 'imperial labor', 'archive silence'],
    selectorTerms: ['khipu', 'quipu', 'nonwritten', 'record', 'road', 'storehouse', 'labor', 'empire', 'archive', '结绳', '非文字', '道路', '仓储', '劳役'],
    taskChecklist: ['区分非文字、考古、书信或殖民文本证据', '指出记录制度如何组织劳动', '标出普通劳动者声音的缺口', '写出一条 evidence limit'],
    suggestedClaimFrame: '非文字和物质证据能证明制度劳动的存在与组织方式，但常需要与后来的文字材料互证，并谨慎处理缺席声音。',
  },
  {
    id: 'knowledge-cities-access-thresholds',
    title: 'Knowledge Cities and Access Thresholds',
    subtitle: '知识城市与进入门槛',
    drivingQuestion: '城市、纸张、书院/手稿、市场与身份门槛怎样决定谁能接近知识？',
    scenarioIds: ['abbasid-baghdad-scribe', 'song-bianjing-apprentice', 'timbuktu-manuscript-student', 'tang-changan-merchant', 'fustat-geniza-merchant-apprentice'],
    skills: ['contextualization', 'perspective', 'corroboration'],
    tags: ['knowledge', 'cities', 'access', 'manuscripts', 'paper'],
    selectorTerms: ['knowledge', 'book', 'paper', 'manuscript', 'school', 'scribe', 'letter', 'access', 'city', '知识', '纸', '手稿', '书', '城市', '门槛'],
    taskChecklist: ['找出知识媒介或学习场所证据', '说明身份/财富/制度门槛', '比较至少两个城市的进入条件', '写出一条 access claim'],
    suggestedClaimFrame: '知识城市扩大了信息流动，但进入门槛由媒介、身份、财富、师承和保存条件共同决定。',
  },
  {
    id: 'market-rules-not-neutral',
    title: 'Market Rules Are Not Neutral',
    subtitle: '市场规则并非中立',
    drivingQuestion: '市场中的税、身份、国家权力、信用和习俗怎样塑造普通人的机会与风险？',
    scenarioIds: ['tang-changan-merchant', 'song-bianjing-apprentice', 'tenochtitlan-market-seller', 'malacca-monsoon-port-broker', 'qing-guangzhou-comprador'],
    skills: ['contextualization', 'causation', 'corroboration'],
    tags: ['market rules', 'institutions', 'tax', 'state power', 'risk'],
    selectorTerms: ['market', 'tax', 'rule', 'institution', 'state', 'credit', 'broker', 'merchant', '市场', '税', '规则', '制度', '国家', '信用'],
    taskChecklist: ['列出至少三条市场规则或制度证据', '说明规则让谁获益/受限', '区分机会与风险', '写出一句反“市场中立”的 claim'],
    suggestedClaimFrame: '市场不是无规则空间；规则、税收、身份与权力关系决定了交易机会、风险分配和普通人的行动边界。',
  },
  {
    id: 'crisis-news-ordinary-safety',
    title: 'Crisis News and Ordinary Safety',
    subtitle: '危机新闻与普通安全',
    drivingQuestion: '战争、征服、起义、空袭或价格危机的消息怎样进入普通人的安全判断？',
    scenarioIds: ['wwii-london-civilian', 'tenochtitlan-market-seller', 'saint-domingue-sugar-worker', 'colonial-bombay-mill-worker', 'song-bianjing-apprentice'],
    skills: ['perspective', 'contextualization', 'sourcing'],
    tags: ['crisis news', 'ordinary safety', 'risk', 'war', 'community'],
    selectorTerms: ['crisis', 'news', 'war', 'risk', 'safety', 'riot', 'revolt', 'bomb', 'price', '危机', '消息', '战争', '安全', '风险', '起义'],
    taskChecklist: ['找出消息来源或风险提示', '说明普通人当时可知道什么', '区分短期安全与长期后果', '写出一条避免后见之明的 claim'],
    suggestedClaimFrame: '危机判断发生在信息有限、风险不均和制度压力之中；普通人的安全选择不能用后来的结果简单评判。',
  },
]


const taskModules: TaskModule[] = [
  {
    id: 'khipu-roads-archive-silence',
    title: 'Khipu / Roads / Archive Silence · 结绳、道路与档案沉默',
    subtitle: '从非文字记录出发，比较帝国如何让劳动可见、又让普通人的解释权沉默。',
    scenarioIds: ['inca-cusco-khipu-runner', 'tenochtitlan-market-seller', 'fustat-geniza-merchant-apprentice', 'saint-domingue-sugar-worker'],
    tags: ['khipu', 'roads', 'nonwritten records', 'archive silence', 'imperial labor'],
    totalMinutes: 120,
    drivingQuestion: 'khipu、道路、仓储、殖民编年、书信和清单怎样记录制度劳动，同时限制我们听见普通人的声音？',
    steps: [
      { id: 'inca-scene', title: '进入 Cusco khipu 与道路现场', minutes: 20, actionLabel: '打开 Inca Scene Reader', description: '读取 khipu runner 的 scene beats，标出道路、仓储、mit’a 与记录劳动。', action: { type: 'scenario', scenarioId: 'inca-cusco-khipu-runner', hash: sectionIds.sceneReader } },
      { id: 'records-route', title: '载入非文字记录路线', minutes: 25, actionLabel: '打开 Atlas route', description: '用路线图比较 Cusco、Tenochtitlan、Fustat、Saint-Domingue 的记录媒介。', action: { type: 'atlas', hash: 'time-space-atlas', routeId: 'nonwritten-records-imperial-labor-route' } },
      { id: 'source-boundary', title: '检查来源边界', minutes: 20, actionLabel: '打开 Evidence Atlas', description: '把 khipu/考古、殖民文本、商人书信、种植园清单放入来源可信度判断。', action: { type: 'evidence' } },
      { id: 'agency-silence', title: '谁发声，谁被记录', minutes: 25, actionLabel: '打开 Perspectives Lab', description: '使用“谁发声，谁被记录”探究，把可见记录与缺席声音分开。', action: { type: 'labs', lab: 'perspectives', inquiryId: 'who-speaks-who-is-recorded' } },
      { id: 'synthesis-claim', title: '写出档案沉默判断', minutes: 30, actionLabel: '打开 Synthesis Studio', description: '把非文字证据、来源边界和历史意义合成谨慎论证。', action: { type: 'synthesis', presetId: 'archive-silence-significance' } },
    ],
    finalDeliverable: '一份“记录媒介—制度劳动—可见/沉默”证据图 + 230 字谨慎历史论证。',
  },
  {
    id: 'commodity-empires-labor-discipline',
    title: 'Commodity Empires / Labor Discipline · 商品帝国与劳动纪律',
    subtitle: '把糖、棉、港口和工厂时间写成穿过身体、制度与档案的历史过程。',
    scenarioIds: ['saint-domingue-sugar-worker', 'industrial-manchester-mill-worker', 'colonial-bombay-mill-worker', 'qing-guangzhou-comprador'],
    tags: ['commodity empires', 'labor discipline', 'sugar', 'cotton', 'coercion'],
    totalMinutes: 135,
    drivingQuestion: '糖与棉怎样把远方市场、强制劳动、工厂时间、殖民监管和港口中介连接成劳动纪律？',
    steps: [
      { id: 'plantation-entry', title: '从圣多明各劳动现场开始', minutes: 20, actionLabel: '打开糖园场景', description: '读取糖园劳动者的场景与来源，记录强制、暴力和来源沉默。', action: { type: 'scenario', scenarioId: 'saint-domingue-sugar-worker', hash: sectionIds.sceneReader } },
      { id: 'commodity-route', title: '追踪糖与棉的帝国路线', minutes: 25, actionLabel: '打开 Atlas route', description: '比较圣多明各、曼彻斯特、孟买、广州的商品—劳动—制度链。', action: { type: 'atlas', hash: 'time-space-atlas', routeId: 'sugar-cotton-empire-route' } },
      { id: 'causal-chain', title: '拆解劳动纪律因果链', minutes: 30, actionLabel: '打开 Causation Lab', description: '用背景、触发、制度约束和长期变化解释商品帝国如何重组劳动。', action: { type: 'labs', lab: 'causation', inquiryId: 'commodity-empires-labor-discipline' } },
      { id: 'period-shift', title: '判断劳动时间转折', minutes: 25, actionLabel: '打开 Periodization Lab', description: '比较种植园强制、工厂时间、殖民城市和口岸规则中的连续与转折。', action: { type: 'labs', lab: 'periodization', inquiryId: 'commodity-chains-labor-time-periods' } },
      { id: 'commodity-synthesis', title: '综合商品链与劳动论证', minutes: 35, actionLabel: '打开 Synthesis Studio', description: '选择已有证据，写出商品链如何改变劳动关系的综合主张。', action: { type: 'synthesis', presetId: 'commodity-chains-labor' } },
    ],
    finalDeliverable: '四站商品帝国证据地图 + 强制/纪律/监管比较表 + 一段综合历史论证。',
  },
  {
    id: 'monsoon-ports-credit-intermediaries',
    title: 'Monsoon Ports / Credit / Intermediaries · 季风港口、信用与中介',
    subtitle: '把季风、信件、合约、名声、语言和港口权力拆成可执行的交易链。',
    scenarioIds: ['fustat-geniza-merchant-apprentice', 'kilwa-swahili-gold-merchant', 'malacca-monsoon-port-broker', 'qing-guangzhou-comprador'],
    tags: ['monsoon ports', 'credit', 'intermediaries', 'letters', 'contracts'],
    totalMinutes: 125,
    drivingQuestion: '远距离贸易为什么依赖季风时间、信用文书、语言中介、港口名声和国家权力共同维持？',
    steps: [
      { id: 'geniza-entry', title: '读取 Fustat 信件学徒现场', minutes: 20, actionLabel: '打开 Geniza 场景', description: '从书信、合约、委托代理和幸存档案进入信用问题。', action: { type: 'scenario', scenarioId: 'fustat-geniza-merchant-apprentice', hash: sectionIds.sceneReader } },
      { id: 'credit-route', title: '追踪红海—印度洋信用路线', minutes: 25, actionLabel: '打开 Atlas route', description: '把 Fustat、Kilwa、Baghdad、Malacca、Bombay 的信用和港口风险放到地图上。', action: { type: 'atlas', hash: 'time-space-atlas', routeId: 'red-sea-indian-ocean-credit-route' } },
      { id: 'monsoon-context', title: '搭建季风港口尺度梯', minutes: 25, actionLabel: '打开 Context Lab', description: '用地方码头、区域季风、帝国规则和来源情境解释中介风险。', action: { type: 'labs', lab: 'context', inquiryId: 'monsoon-ports-intermediaries' } },
      { id: 'port-causation', title: '分析港口信用因果机制', minutes: 25, actionLabel: '打开 Causation Lab', description: '区分信用工具、季风延误、语言中介和国家权力各自的作用。', action: { type: 'labs', lab: 'causation', inquiryId: 'port-credit-distant-trade' } },
      { id: 'markets-power-writing', title: '写出市场、权力与风险主张', minutes: 30, actionLabel: '打开 Synthesis Studio', description: '把港口中介写成市场权力关系，而不是浪漫贸易路线。', action: { type: 'synthesis', presetId: 'markets-power-risk' } },
    ],
    finalDeliverable: '一张港口信用工作链 + 一段说明“信任如何变成可执行交易”的证据论证。',
  },
  {
    id: 'knowledge-worlds-access-thresholds',
    title: 'Knowledge Worlds / Access Thresholds · 知识世界与进入门槛',
    subtitle: '比较纸张、手稿、考试、师承、书信和语言如何扩大知识，也制造门槛。',
    scenarioIds: ['abbasid-baghdad-scribe', 'timbuktu-manuscript-student', 'ming-jiangnan-scholar', 'fustat-geniza-merchant-apprentice'],
    tags: ['knowledge worlds', 'access thresholds', 'paper', 'manuscripts', 'education'],
    totalMinutes: 115,
    drivingQuestion: '知识能被谁学习、复制、保存和移动，为什么取决于媒介、身份、制度和档案幸存？',
    steps: [
      { id: 'baghdad-entry', title: '进入巴格达纸本知识现场', minutes: 20, actionLabel: '打开巴格达场景', description: '寻找纸张、赞助、抄写与商业知识如何塑造学习机会。', action: { type: 'scenario', scenarioId: 'abbasid-baghdad-scribe', hash: sectionIds.sceneReader } },
      { id: 'knowledge-route', title: '比较知识城市路线', minutes: 20, actionLabel: '打开 Atlas route', description: '把巴格达、廷巴克图、江南放进媒介、城市和门槛路线。', action: { type: 'atlas', hash: 'time-space-atlas', routeId: 'knowledge-cities-route' } },
      { id: 'knowledge-context', title: '情境化知识城市与媒介门槛', minutes: 25, actionLabel: '打开 Context Lab', description: '从 local practice 连接到区域知识网络和来源可见性。', action: { type: 'labs', lab: 'context', inquiryId: 'knowledge-cities-media-thresholds' } },
      { id: 'knowledge-agency', title: '判断进入知识世界的行动空间', minutes: 25, actionLabel: '打开 Perspectives Lab', description: '比较学习、抄写、通信和考试中的能动性与限制。', action: { type: 'labs', lab: 'perspectives', inquiryId: 'thresholds-into-knowledge-worlds' } },
      { id: 'knowledge-synthesis', title: '写出知识可及性综合论证', minutes: 25, actionLabel: '打开 Synthesis Studio', description: '把媒介、制度、身份和保存条件合成关于知识门槛的主张。', action: { type: 'synthesis', presetId: 'knowledge-access' } },
    ],
    finalDeliverable: '三到四站知识流动图 + 一段“技术是否带来知识公平”的谨慎回答。',
  },
  {
    id: 'cities-markets-state-rules',
    title: 'Cities / Markets / State Rules · 城市、市场与国家规则',
    subtitle: '把城市交换从“自由市场”改写成税、监管、信用、贡赋和身份边界的日常。',
    scenarioIds: ['tang-changan-merchant', 'song-bianjing-apprentice', 'tenochtitlan-market-seller', 'qing-guangzhou-comprador', 'malacca-monsoon-port-broker'],
    tags: ['cities', 'markets', 'state rules', 'tax', 'credit'],
    totalMinutes: 120,
    drivingQuestion: '城市市场给普通人带来的机会，怎样被国家规则、税赋、信用、身份和空间秩序重新塑形？',
    steps: [
      { id: 'market-entry', title: '从城市市场日常进入', minutes: 20, actionLabel: '打开长安市场场景', description: '寻找商品、规则、价格、信用和道路消息之间的关系。', action: { type: 'scenario', scenarioId: 'tang-changan-merchant', hash: sectionIds.sceneReader } },
      { id: 'market-route', title: '打开市场走廊路线', minutes: 20, actionLabel: '打开 Atlas route', description: '比较长安、汴京、广州、特诺奇蒂特兰的交易规则和制度边界。', action: { type: 'atlas', hash: 'time-space-atlas', routeId: 'market-corridors-route' } },
      { id: 'market-causation', title: '分析制度约束与市场变化', minutes: 25, actionLabel: '打开 Causation Lab', description: '判断变化来自规则、信用、身份、地理条件还是劳动义务。', action: { type: 'labs', lab: 'causation', inquiryId: 'institutional-constraints-markets' } },
      { id: 'market-significance', title: '判断市场规则的制度遗产', minutes: 25, actionLabel: '打开 Significance Lab', description: '说明税、行会、通商规则、信用和身份边界为何留下长期意义。', action: { type: 'labs', lab: 'significance', inquiryId: 'market-rules-institutional-legacy' } },
      { id: 'market-synthesis', title: '写出市场、权力与风险综合论证', minutes: 30, actionLabel: '打开 Synthesis Studio', description: '回应“市场自由”解释，写出有规则、有权力、有风险的市场主张。', action: { type: 'synthesis', presetId: 'markets-power-risk' } },
    ],
    finalDeliverable: '四站“商品/服务—规则—风险—普通人策略”证据链 + 市场权力综合段落。',
  },
  {
    id: 'crisis-news-safety-public-memory',
    title: 'Crisis News / Safety / Public Memory · 危机消息、安全与公共记忆',
    subtitle: '区分当时人的有限消息、身体安全判断，以及后世公共记忆如何塑造意义。',
    scenarioIds: ['wwii-london-civilian', 'tenochtitlan-market-seller', 'malacca-monsoon-port-broker', 'saint-domingue-sugar-worker', 'colonial-bombay-mill-worker'],
    tags: ['crisis news', 'safety', 'public memory', 'risk', 'uncertainty'],
    totalMinutes: 125,
    drivingQuestion: '当战争、征服、起义或市场危机消息进入普通生活，人们如何判断安全，后世又如何记忆这些判断？',
    steps: [
      { id: 'london-entry', title: '进入战时伦敦安全判断现场', minutes: 20, actionLabel: '打开伦敦场景', description: '读取空袭警报、家庭责任、公共安全命令和不确定消息。', action: { type: 'scenario', scenarioId: 'wwii-london-civilian', hash: sectionIds.sceneReader } },
      { id: 'crisis-route', title: '追踪危机新闻路线', minutes: 20, actionLabel: '打开 Atlas route', description: '比较传闻、警报、征服消息、口岸压力如何抵达普通人的一天。', action: { type: 'atlas', hash: 'time-space-atlas', routeId: 'crisis-news-route' } },
      { id: 'crisis-agency', title: '分析危机中的安全判断', minutes: 25, actionLabel: '打开 Perspectives Lab', description: '把有限消息、知识边界、风险利害和行动选择分开。', action: { type: 'labs', lab: 'perspectives', inquiryId: 'safety-judgments-in-crisis' } },
      { id: 'crisis-memory', title: '判断危机如何成为公共记忆', minutes: 25, actionLabel: '打开 Significance Lab', description: '连接当时影响、长期记忆、争议意义和来源保存边界。', action: { type: 'labs', lab: 'significance', inquiryId: 'crisis-public-memory' } },
      { id: 'crisis-synthesis', title: '写出危机、记忆与判断论证', minutes: 35, actionLabel: '打开 Synthesis Studio', description: '避免后见之明，用证据说明危机判断和公共记忆的关系。', action: { type: 'synthesis', presetId: 'crisis-memory-judgment' } },
    ],
    finalDeliverable: '一组“消息—判断—行动—后果—记忆”风险链 + 220 字公共记忆论证。',
  },
]

const corroborationMethodCards = [
  {
    key: 'sourcing',
    title: 'Sourcing / 来源判断',
    prompt: '先问谁写/谁保存/为谁服务：作者、机构、媒介和可靠边界会怎样塑造这条证据？',
  },
  {
    key: 'contextualization',
    title: 'Contextualization / 情境化',
    prompt: '把每条来源放回它的时代、地点、制度和日常压力中，避免用今天的问题直接替代当时人的处境。',
  },
  {
    key: 'corroboration',
    title: 'Corroboration / 互证',
    prompt: '寻找相互支持、相互修正或相互冲突的线索：哪些事实被多条来源照亮？哪些只是单一视角？',
  },
  {
    key: 'silence',
    title: 'Silence / 沉默与缺席',
    prompt: '记录材料看不见的人、问题和经验，并写出下一步最需要补充的来源类型。',
  },
]

const corroborationConfidenceLabels: Record<CorroborationConfidence, string> = {
  high: 'High / 较高',
  medium: 'Medium / 中等',
  low: 'Low / 较低',
  uncertain: 'Uncertain / 仍不确定',
}

const causationConfidenceLabels: Record<CausationConfidence, string> = corroborationConfidenceLabels
const periodizationConfidenceLabels: Record<PeriodizationConfidence, string> = corroborationConfidenceLabels
const perspectivesConfidenceLabels: Record<PerspectivesConfidence, string> = corroborationConfidenceLabels
const contextConfidenceLabels: Record<ContextConfidence, string> = corroborationConfidenceLabels
const significanceConfidenceLabels: Record<SignificanceConfidence, string> = corroborationConfidenceLabels
const synthesisConfidenceLabels: Record<SynthesisConfidence, string> = corroborationConfidenceLabels
const compareConfidenceLabels: Record<CompareConfidence, string> = corroborationConfidenceLabels
const evidenceCaseConfidenceLabels: Record<SynthesisConfidence, string> = corroborationConfidenceLabels

const significanceEvidenceLabelText: Record<SignificanceEvidenceLabel, string> = {
  'immediate-impact': 'immediate-impact / 当时影响',
  'long-term-change': 'long-term-change / 长期变化',
  'scale-reach': 'scale-reach / 影响尺度',
  'contested-meaning': 'contested-meaning / 意义争议',
  'memory-archive': 'memory-archive / 记忆与档案',
  'ordinary-life': 'ordinary-life / 普通生活',
}

const significanceCriteriaLadder = [
  { key: 'immediate-impact', title: 'Immediate impact / 当时影响', prompt: '它当时改变了谁的安全、生计、知识、选择或制度位置？' },
  { key: 'long-term-change', title: 'Long-term change / 长期变化', prompt: '后来的制度、商品链、知识传播、公共记忆或生活方式如何被它改变？' },
  { key: 'scale-reach', title: 'Scale & reach / 尺度与范围', prompt: '意义停留在个人/社区，还是连接到区域、帝国、全球或跨时代影响？' },
  { key: 'contested-meaning', title: 'Contested meaning / 意义争议', prompt: '不同群体会怎样解释、纪念、淡化或反驳它的重要性？' },
  { key: 'memory-archive', title: 'Memory & archive / 记忆与档案', prompt: '哪些来源保存了它，哪些沉默改变了我们判断它重要性的方式？' },
  { key: 'ordinary-life', title: 'Ordinary life / 普通生活', prompt: '普通人的日常经验如何证明“大历史”不是只由精英事件构成？' },
] satisfies { key: SignificanceEvidenceLabel, title: string, prompt: string }[]

const contextEvidenceLabelText: Record<ContextEvidenceLabel, string> = {
  local: 'local / 地方现场',
  regional: 'regional / 区域连接',
  'imperial-global': 'imperial-global / 帝国-全球尺度',
  'source-context': 'source-context / 来源情境',
  'presentism-risk': 'presentism-risk / 当下主义风险',
}

const contextScaleLadder = [
  { key: 'local', title: 'Local / 地方现场', prompt: '地点、城市秩序、劳动节奏和日常选择先在哪里发生？' },
  { key: 'regional', title: 'Regional / 区域连接', prompt: '港口、季风、城市腹地、书信或市场如何把多个地点连接起来？' },
  { key: 'imperial-global', title: 'Imperial-global / 帝国-全球', prompt: '帝国规则、商品链、战争、殖民或全球需求如何改变地方处境？' },
  { key: 'source-context', title: 'Source context / 来源情境', prompt: '这条材料由谁留下、保存在哪里、能看见和看不见什么？' },
  { key: 'presentism-risk', title: 'Presentism risk / 当下主义风险', prompt: '哪些后见之明、现代概念或道德捷径可能压扁当时处境？' },
] satisfies { key: ContextEvidenceLabel, title: string, prompt: string }[]

const perspectivesEvidenceLabelText: Record<PerspectivesEvidenceLabel, string> = {
  'actor position': 'actor position / 行动者位置',
  constraint: 'constraint / 约束',
  'knowledge limit': 'knowledge limit / 知识边界',
  'risk/stake': 'risk/stake / 风险与利害',
  'source perspective': 'source perspective / 来源视角',
  'absent voice': 'absent voice / 缺席声音',
}

const perspectivesAntiPresentismChecklist = [
  '我是否先说明当时人的身份、角色和可见选择，而不是直接用今天的价值判断替代？',
  '我是否区分“他们知道什么”和“后来的我们知道什么”？',
  '我是否把制度、市场、身体风险、家庭责任或来源保存条件写成约束，而不是把行动者写成全能或全被动？',
  '我是否点名至少一种来源视角限制，并承认哪些声音没有被记录？',
]

const causeCategoryLabels: Record<CauseCategory, string> = {
  economic: 'economic / 经济',
  'political-institutional': 'political/institutional / 政治制度',
  'environmental-geographic': 'environmental/geographic / 环境地理',
  'social-labor': 'social/labor / 社会劳动',
  'cultural-knowledge': 'cultural/knowledge / 文化知识',
  'source-limitation': 'source limitation / 来源限制',
}

const causationInquiryDefinitions: CausationInquiry[] = [
  {
    id: 'commodity-empires-labor-discipline',
    title: '商品帝国与劳动纪律',
    subtitle: 'Commodity empires / labor discipline',
    drivingQuestion: '糖、棉与工厂时间如何把远方市场、强制劳动和身体纪律连接成历史变化？',
    scenarioIds: ['saint-domingue-sugar-worker', 'industrial-manchester-mill-worker', 'colonial-bombay-mill-worker', 'qing-guangzhou-comprador'],
    focus: '区分商品需求、制度强制、工厂时间和劳动者选择，判断哪些原因改变了劳动关系。',
    tags: ['商品帝国', '劳动纪律', '强制劳动', '棉花', '糖业'],
    suggestedCategories: ['economic', 'social-labor', 'political-institutional', 'source-limitation'],
  },
  {
    id: 'port-credit-distant-trade',
    title: '港口信用与远距离贸易',
    subtitle: 'Port credit / distant trade',
    drivingQuestion: '季风、书信、通译、合约和名声如何让远距离贸易既可能又脆弱？',
    scenarioIds: ['fustat-geniza-merchant-apprentice', 'kilwa-swahili-gold-merchant', 'malacca-monsoon-port-broker', 'qing-guangzhou-comprador'],
    focus: '追踪信用机制、港口中介、地理季节性和国家权力如何共同塑造贸易选择。',
    tags: ['港口信用', '季风', '远距离贸易', '商人网络'],
    suggestedCategories: ['economic', 'environmental-geographic', 'political-institutional', 'cultural-knowledge'],
  },
  {
    id: 'crisis-news-ordinary-choices',
    title: '危机消息与普通选择',
    subtitle: 'Crisis news / ordinary choices',
    drivingQuestion: '当战争、征服、起义或市场危机消息抵达普通人时，哪些条件决定他们能做什么？',
    scenarioIds: ['inca-cusco-khipu-runner', 'wwii-london-civilian', 'malacca-monsoon-port-broker', 'saint-domingue-sugar-worker', 'colonial-bombay-mill-worker'],
    focus: '把远方消息、即时触发、风险边界和普通人的应对选择分开记录；Inca 站尤其提醒学生区分征服前夜的片段消息与后见之明。',
    tags: ['危机新闻', '普通人选择', '风险', '不确定性', '征服前夜'],
    suggestedCategories: ['political-institutional', 'social-labor', 'economic', 'source-limitation'],
  },
  {
    id: 'knowledge-transmission',
    title: '知识传播的条件',
    subtitle: 'Knowledge transmission',
    drivingQuestion: '纸张、手稿、学校、书信和市场如何改变知识能被谁保存、学习和移动？',
    scenarioIds: ['abbasid-baghdad-scribe', 'timbuktu-manuscript-student', 'ming-jiangnan-scholar', 'fustat-geniza-merchant-apprentice'],
    focus: '分析媒介、师承、制度门槛和档案保存如何共同造成知识流动与限制。',
    tags: ['知识传播', '纸张', '手稿', '教育', '档案'],
    suggestedCategories: ['cultural-knowledge', 'political-institutional', 'economic', 'source-limitation'],
  },
  {
    id: 'institutional-constraints-markets',
    title: '制度约束与市场变化',
    subtitle: 'Institutional constraints / markets',
    drivingQuestion: '市场为什么不是自由的真空？税、行会、帝国规则和身份边界怎样改变交易结果？',
    scenarioIds: ['inca-cusco-khipu-runner', 'tang-changan-merchant', 'song-bianjing-apprentice', 'tenochtitlan-market-seller', 'qing-guangzhou-comprador', 'malacca-monsoon-port-broker'],
    focus: '把市场机会、贡赋/仓储、劳役和制度限制并列，判断变化来自规则、信用、身份还是地理条件。',
    tags: ['制度约束', '市场', '城市', '税与规则', 'mit’a', '仓储'],
    suggestedCategories: ['political-institutional', 'economic', 'social-labor', 'environmental-geographic'],
  },
  {
    id: 'archive-silence-causal-judgment',
    title: '档案沉默与因果判断',
    subtitle: 'Archive silence / causal judgment',
    drivingQuestion: '当来源只保存了商人、国家或后世研究者的视角时，因果判断应该怎样保留不确定性？',
    scenarioIds: ['inca-cusco-khipu-runner', 'saint-domingue-sugar-worker', 'fustat-geniza-merchant-apprentice', 'kilwa-swahili-gold-merchant', 'tenochtitlan-market-seller'],
    focus: '把“证据能说明的原因”和“沉默导致的风险”分开，避免把幸存档案、殖民编年或尚未完全解码的非文字证据误当完整历史。',
    tags: ['档案沉默', '来源限制', '因果判断', '缺席声音', '非文字证据', 'khipu'],
    suggestedCategories: ['source-limitation', 'political-institutional', 'social-labor', 'cultural-knowledge'],
  },
]




const significanceInquiryDefinitions: SignificanceInquiry[] = [
  {
    id: 'ordinary-people-matter',
    title: '普通人为什么重要',
    subtitle: 'Why ordinary people matter',
    drivingQuestion: '为什么一个商人、学徒、学生、劳动者或居民的日常选择也能成为重要历史？',
    scenarioIds: ['inca-cusco-khipu-runner', 'song-bianjing-apprentice', 'wwii-london-civilian', 'colonial-bombay-mill-worker', 'saint-domingue-sugar-worker', 'tenochtitlan-market-seller'],
    focus: '用身份、日常生活、scene beats 与选择后果说明普通人的经验如何揭示制度、市场、战争和劳动秩序，包括道路/仓储助手这类低位行政劳动。',
    tags: ['ordinary people', 'daily life', 'agency', 'memory', 'institutional labor'],
    memoryFrame: '把普通生活当作历史意义的入口，而不是宏大事件的背景噪音。',
  },
  {
    id: 'commodity-chains-changing-worlds',
    title: '商品链如何改变世界',
    subtitle: 'Commodity chains changing worlds',
    drivingQuestion: '糖、棉、黄金、纸张或港口货物流动为什么能改变劳动、制度和远方社会？',
    scenarioIds: ['saint-domingue-sugar-worker', 'industrial-manchester-mill-worker', 'colonial-bombay-mill-worker', 'qing-guangzhou-comprador', 'kilwa-swahili-gold-merchant'],
    focus: '连接商品链中的即时影响、长期变化、尺度扩展和来源沉默，判断“改变世界”的具体含义。',
    tags: ['commodity chains', 'labor', 'markets', 'empire'],
    memoryFrame: '不要只说“全球化”；说明商品链如何穿过某个身体、港口、工厂和档案。',
  },
  {
    id: 'knowledge-preservation-transmission',
    title: '知识保存与传播',
    subtitle: 'Knowledge preservation / transmission',
    drivingQuestion: '手稿、纸张、学校、书信和档案为什么会影响谁能学习、保存和传递知识？',
    scenarioIds: ['abbasid-baghdad-scribe', 'timbuktu-manuscript-student', 'ming-jiangnan-scholar', 'fustat-geniza-merchant-apprentice'],
    focus: '比较媒介、学习门槛、保存条件和后世记忆，判断知识传播的历史意义。',
    tags: ['knowledge', 'manuscripts', 'paper', 'archives'],
    memoryFrame: '知识的意义既在传播，也在被保存、筛选和重新解释。',
  },
  {
    id: 'crisis-public-memory',
    title: '危机经验与公共记忆',
    subtitle: 'Crisis experience / public memory',
    drivingQuestion: '战争、征服、起义或价格危机进入普通生活后，为什么会变成公共记忆或历史争议？',
    scenarioIds: ['inca-cusco-khipu-runner', 'wwii-london-civilian', 'tenochtitlan-market-seller', 'malacca-monsoon-port-broker', 'saint-domingue-sugar-worker', 'colonial-bombay-mill-worker'],
    focus: '从危机当下经验、长远后果、不同群体解释和记忆材料边界判断意义，避免把征服后知识投回当时选择。',
    tags: ['crisis', 'public memory', 'war', 'conquest', 'uncertainty'],
    memoryFrame: '公共记忆来自真实痛苦、后世叙事和档案可见性的共同塑形。',
  },
  {
    id: 'market-rules-institutional-legacy',
    title: '市场规则与制度遗产',
    subtitle: 'Market rules / institutional legacy',
    drivingQuestion: '税、行会、通商规则、信用和身份边界为什么会留下长期制度遗产？',
    scenarioIds: ['tang-changan-merchant', 'song-bianjing-apprentice', 'tenochtitlan-market-seller', 'qing-guangzhou-comprador', 'malacca-monsoon-port-broker', 'fustat-geniza-merchant-apprentice'],
    focus: '把市场规则的当时影响、长期制度遗产、跨区域范围和争议性意义并列分析。',
    tags: ['market rules', 'institutions', 'credit', 'legacy'],
    memoryFrame: '市场不是无规则空间；制度遗产常保存在合约、惯例、税制和后世解释中。',
  },
  {
    id: 'archive-silence-changing-significance',
    title: '档案沉默如何改变意义',
    subtitle: 'Archive silence changing significance',
    drivingQuestion: '当资料只留下商人、国家、殖民者或后世研究者的声音时，历史意义会怎样被改变？',
    scenarioIds: ['inca-cusco-khipu-runner', 'fustat-geniza-merchant-apprentice', 'kilwa-swahili-gold-merchant', 'tenochtitlan-market-seller', 'saint-domingue-sugar-worker', 'wwii-london-civilian'],
    focus: '用来源视角、可靠边界、source question、interpretationNote 和 sourceEvidenceUse 判断沉默如何限制或放大意义，并比较非文字证据与殖民文字的可见性差异。',
    tags: ['archive silence', 'source limits', 'memory', 'contested meaning', 'nonwritten evidence'],
    memoryFrame: '档案沉默不是空白背景；它会直接改变谁被认为“重要”。',
  },
 ]

const synthesisInquiryPresets: SynthesisInquiryPreset[] = [
  {
    id: 'ordinary-people-historical-change',
    title: '普通人与历史变化',
    subtitle: 'Ordinary people / historical change',
    drivingQuestion: '普通人的日常选择如何揭示更大的历史变化，而不只是被动承受大事件？',
    claimScope: '比较至少三个身份，连接日常选择、制度约束与长期变化。',
    focus: '把普通人的行动、风险和证据限制综合成一段可争辩历史论证。',
    tags: ['ordinary people', 'historical change', 'agency', 'daily life'],
    paragraphFrame: ['主张普通人经验为何可作为历史变化证据', '用两个或三个场景互证变化机制', '承认来源沉默并连接历史意义'],
  },
  {
    id: 'markets-power-risk',
    title: '市场、权力与风险',
    subtitle: 'Markets / power / risk',
    drivingQuestion: '市场活动如何被国家权力、信用规则、身份边界和风险判断共同塑造？',
    claimScope: '比较港口、城市市场或工厂场景，说明市场不是无规则真空。',
    focus: '综合制度、市场机会、风险与行动边界，形成对市场权力关系的解释。',
    tags: ['markets', 'power', 'risk', 'institutions'],
    paragraphFrame: ['界定市场中的权力与风险', '排列跨场景证据说明规则如何塑造选择', '回应“市场自由”或单因解释的反驳'],
  },
  {
    id: 'commodity-chains-labor',
    title: '商品链与劳动',
    subtitle: 'Commodity chains / labor',
    drivingQuestion: '糖、棉、黄金或港口货物流动如何把远方需求、劳动纪律和身体风险连接起来？',
    claimScope: '至少使用两个劳动/商品链场景，并区分强制、工资、工厂时间与港口中介。',
    focus: '把商品链写成穿过身体、时间、制度和档案的历史过程。',
    tags: ['commodity chains', 'labor', 'discipline', 'empire'],
    paragraphFrame: ['提出商品链改变劳动关系的主张', '用劳动现场和市场/制度证据搭桥', '说明档案沉默如何限制劳动者经验'],
  },
  {
    id: 'knowledge-access',
    title: '知识与进入门槛',
    subtitle: 'Knowledge / access',
    drivingQuestion: '纸张、手稿、学校、考试、书信和语言如何决定谁能进入知识世界？',
    claimScope: '比较知识城市或商贸书信场景，说明媒介、制度和身份门槛。',
    focus: '综合知识传播、保存、学习门槛和来源幸存条件。',
    tags: ['knowledge', 'access', 'manuscripts', 'education'],
    paragraphFrame: ['界定知识可及性的历史条件', '用媒介/制度/身份证据解释流动与限制', '连接保存条件与后世意义判断'],
  },
  {
    id: 'crisis-memory-judgment',
    title: '危机、记忆与判断',
    subtitle: 'Crisis memory / judgment',
    drivingQuestion: '危机消息抵达普通生活后，人们如何在不完整信息中判断安全，后世又如何记忆这些判断？',
    claimScope: '比较战争、征服、起义、价格或劳动危机场景，区分当时知识与后见之明。',
    focus: '把危机中的判断、风险、记忆和历史意义写成综合论证。',
    tags: ['crisis', 'memory', 'judgment', 'uncertainty'],
    paragraphFrame: ['说明危机判断发生在不完整信息中', '用跨场景证据分析风险与选择', '连接公共记忆、争议意义和反当下主义'],
  },
  {
    id: 'archive-silence-significance',
    title: '档案沉默与历史意义',
    subtitle: 'Archive silence / significance',
    drivingQuestion: '当档案只保存部分声音时，历史论证如何既提出意义判断，又保留来源限制？',
    claimScope: '至少使用三类证据，明确说明谁被记录、谁缺席，以及这如何改变重要性判断。',
    focus: '把互证、缺席声音、来源边界和历史意义合并为谨慎论证。',
    tags: ['archive silence', 'significance', 'source limits', 'corroboration'],
    paragraphFrame: ['提出档案沉默如何改变历史意义', '用互证/来源/工作草稿说明可见与不可见', '写出反驳、来源限制和修订计划'],
  },
]

const contextInquiryDefinitions: ContextInquiry[] = [
  {
    id: 'city-order-daily-work',
    title: '城市秩序与日常劳动',
    subtitle: 'City order / daily work',
    drivingQuestion: '城市规则、街市空间、行会或国家秩序如何进入普通人的一天？',
    scenarioIds: ['tang-changan-merchant', 'song-bianjing-apprentice', 'tenochtitlan-market-seller', 'ming-jiangnan-scholar'],
    focus: '从地点、年份、日常劳动、scene beats 和决策语境出发，把普通人的选择放回城市秩序与生活尺度中。',
    tags: ['城市秩序', '日常劳动', '市场', '制度', '地方尺度'],
    scaleFrame: '先定位街市/学校/家庭等 local setting，再说明区域市场或国家制度如何改变日常工作。',
  },
  {
    id: 'monsoon-ports-intermediaries',
    title: '季风港口与跨文化中介',
    subtitle: 'Monsoon ports / intermediaries',
    drivingQuestion: '季风、港口、语言和信用怎样塑造跨文化中介的机会与风险？',
    scenarioIds: ['fustat-geniza-merchant-apprentice', 'kilwa-swahili-gold-merchant', 'malacca-monsoon-port-broker', 'qing-guangzhou-comprador'],
    focus: '把港口地方现场、印度洋/南海区域连接、书信/通译/合约与来源幸存条件放在同一尺度梯上。',
    tags: ['季风', '港口', '跨文化中介', '信用', '区域连接'],
    scaleFrame: '从码头和书信的地方证据，逐级连接到季风航线、港口网络和帝国规则。',
  },
  {
    id: 'commodity-empires-scale-shifts',
    title: '商品帝国的尺度转换',
    subtitle: 'Commodity empires / scale shifts',
    drivingQuestion: '糖、棉、黄金和通商规则如何把地方劳动转化为帝国或全球尺度的压力？',
    scenarioIds: ['saint-domingue-sugar-worker', 'industrial-manchester-mill-worker', 'colonial-bombay-mill-worker', 'qing-guangzhou-comprador', 'kilwa-swahili-gold-merchant'],
    focus: '追踪商品链、劳动纪律、港口中介和市场需求如何在 local、regional 与 imperial-global 之间转换。',
    tags: ['商品帝国', '尺度转换', '劳动纪律', '棉花', '糖业'],
    scaleFrame: '不要只说“全球化”；说明具体商品链如何穿过某个身体、工厂、港口或档案。',
  },
  {
    id: 'knowledge-cities-media-thresholds',
    title: '知识城市与媒介门槛',
    subtitle: 'Knowledge cities / media thresholds',
    drivingQuestion: '纸张、手稿、书信、学校和考试如何决定谁能进入知识世界？',
    scenarioIds: ['abbasid-baghdad-scribe', 'timbuktu-manuscript-student', 'ming-jiangnan-scholar', 'fustat-geniza-merchant-apprentice'],
    focus: '比较知识城市中的日常学习、媒介门槛、区域流动和档案保存，把“知识传播”情境化。',
    tags: ['知识城市', '媒介门槛', '纸张', '手稿', '教育'],
    scaleFrame: '从抄写、求学或书信的 local practice，连接到区域知识网络和来源可见性。',
  },
  {
    id: 'crisis-news-daily-life',
    title: '危机新闻进入日常生活',
    subtitle: 'Crisis news / daily life',
    drivingQuestion: '战争、征服、起义或市场危机的消息抵达后，日常生活的哪些尺度同时变化？',
    scenarioIds: ['wwii-london-civilian', 'tenochtitlan-market-seller', 'malacca-monsoon-port-broker', 'saint-domingue-sugar-worker', 'colonial-bombay-mill-worker'],
    focus: '区分消息抵达的地方体验、区域安全网络、帝国战争/殖民压力与当事人的可得知识。',
    tags: ['危机新闻', '日常生活', '安全', '不确定性', '当下主义风险'],
    scaleFrame: '把“我们知道后来发生什么”和“当时人能知道什么”分开，避免后见之明。',
  },
  {
    id: 'archive-context-visibility',
    title: '档案情境与可见性',
    subtitle: 'Archive context / visibility',
    drivingQuestion: '来源保存了哪些尺度的历史，又让哪些地方经验、劳动身体或声音不可见？',
    scenarioIds: ['inca-cusco-khipu-runner', 'fustat-geniza-merchant-apprentice', 'kilwa-swahili-gold-merchant', 'tenochtitlan-market-seller', 'saint-domingue-sugar-worker', 'wwii-london-civilian'],
    focus: '用 sources、sourceEvidenceUse 与 realHistory 说明来源情境、保存条件、可见性和解释风险，尤其比较 khipu/考古、殖民编年和档案书写。',
    tags: ['档案情境', '可见性', '来源限制', '缺席声音', '解释风险', '非文字证据'],
    scaleFrame: '把 archive 当成历史尺度的一部分：它能连接远方，也会过滤普通人的地方经验。',
  },
]

const perspectivesInquiryDefinitions: PerspectivesInquiry[] = [
  {
    id: 'ordinary-choice-boundaries',
    title: '普通人的选择边界',
    subtitle: 'Ordinary choice boundaries',
    drivingQuestion: '普通人面对历史岔路时，哪些选择真的可行，哪些只是后人想象的自由？',
    scenarioIds: ['inca-cusco-khipu-runner', 'song-bianjing-apprentice', 'wwii-london-civilian', 'colonial-bombay-mill-worker', 'saint-domingue-sugar-worker'],
    focus: '从身份、日常责任、决策语境和选项后果出发，判断行动空间的边界，包括记录/递送/呈报这类低位行政选择。',
    tags: ['agency', 'choice boundaries', 'ordinary people', 'anti-presentism', 'record labor'],
    agencyFrame: '把普通人写成有判断、有策略但受限制的历史行动者。',
  },
  {
    id: 'who-speaks-who-is-recorded',
    title: '谁发声，谁被记录',
    subtitle: 'Who speaks / who is recorded',
    drivingQuestion: '来源保存了谁的语言、机构或后世解释，又把哪些当事人的经验留在沉默中？',
    scenarioIds: ['inca-cusco-khipu-runner', 'fustat-geniza-merchant-apprentice', 'kilwa-swahili-gold-merchant', 'tenochtitlan-market-seller', 'saint-domingue-sugar-worker'],
    focus: '比较来源 perspective、reliability、source question 与缺席声音，避免把幸存档案、殖民编年或可解码的 khipu 结构当成完整历史。',
    tags: ['archive silence', 'source perspective', 'recorded voices', 'missing voices', 'khipu', 'nonwritten evidence'],
    agencyFrame: '用来源边界说明谁能留下证词，谁只能被他人间接记录。',
  },
  {
    id: 'market-intermediaries',
    title: '市场中介与协商空间',
    subtitle: 'Market intermediaries',
    drivingQuestion: '商人、经纪、通译和学徒如何在规则、信用、语言和权力之间创造有限的行动空间？',
    scenarioIds: ['tang-changan-merchant', 'fustat-geniza-merchant-apprentice', 'malacca-monsoon-port-broker', 'qing-guangzhou-comprador', 'kilwa-swahili-gold-merchant'],
    focus: '从 role、market daily life、decision context/options 和 sourceEvidenceUse 中寻找中介的能力与限制。',
    tags: ['markets', 'intermediaries', 'credit', 'translation', 'rules'],
    agencyFrame: '市场能动性不是自由交易，而是在制度、信用与语言门槛中协商。',
  },
  {
    id: 'labor-discipline-body-risk',
    title: '劳动纪律与身体风险',
    subtitle: 'Labor discipline / body risk',
    drivingQuestion: '劳动者面对时间纪律、强制、工资和身体风险时，能动性表现在哪里？',
    scenarioIds: ['inca-cusco-khipu-runner', 'saint-domingue-sugar-worker', 'industrial-manchester-mill-worker', 'colonial-bombay-mill-worker'],
    focus: '用 dailyLife、sceneBeats 与决策选项解释身体、纪律、劳役义务和生计如何限制或塑造选择。',
    tags: ['labor discipline', 'body risk', 'coercion', 'factory time', 'mit’a'],
    agencyFrame: '在高压劳动环境中，能动性常表现为风险判断、节奏调整、互助或保全。',
  },
  {
    id: 'safety-judgments-in-crisis',
    title: '危机中的安全判断',
    subtitle: 'Safety judgments in crisis',
    drivingQuestion: '当战争、征服、起义或价格危机逼近，普通人如何在不完整信息中判断安全？',
    scenarioIds: ['wwii-london-civilian', 'malacca-monsoon-port-broker', 'tenochtitlan-market-seller', 'song-bianjing-apprentice', 'colonial-bombay-mill-worker'],
    focus: '把场景张力、知识限制、风险利害和选项后果并列，分析危机中的判断而非事后责备。',
    tags: ['crisis', 'safety', 'uncertainty', 'risk judgment'],
    agencyFrame: '危机能动性依赖有限消息、社区关系、身体安全和可承受损失。',
  },
  {
    id: 'thresholds-into-knowledge-worlds',
    title: '进入知识世界的门槛',
    subtitle: 'Thresholds into knowledge worlds',
    drivingQuestion: '纸张、手稿、学校、考试、书信和语言如何决定谁能进入知识世界？',
    scenarioIds: ['abbasid-baghdad-scribe', 'timbuktu-manuscript-student', 'ming-jiangnan-scholar', 'fustat-geniza-merchant-apprentice'],
    focus: '从身份角色、education daily life、sceneBeats、decision context 和来源边界中寻找知识门槛。',
    tags: ['knowledge', 'education', 'manuscripts', 'letters', 'thresholds'],
    agencyFrame: '知识能动性来自学习、抄写、请教、考试或通信，但总被身份、资源和保存条件限制。',
  },
]

const periodizationInquiryDefinitions: PeriodizationInquiry[] = [
  {
    id: 'commodity-chains-labor-time-periods',
    title: '商品链与劳动时间分期',
    subtitle: 'Commodity chains / labor time',
    drivingQuestion: '从糖业强制劳动到棉纺工厂时间，劳动纪律的连续性与转折应如何分期？',
    scenarioIds: ['saint-domingue-sugar-worker', 'industrial-manchester-mill-worker', 'colonial-bombay-mill-worker', 'qing-guangzhou-comprador'],
    focus: '比较强制、工资、机器节奏、帝国贸易和港口中介，判断“商品帝国”中的劳动控制何时发生关键变化。',
    tags: ['商品链', '劳动时间', '工厂纪律', '帝国贸易'],
    suggestedTurningPoint: '工业工厂时间与全球棉花链把劳动控制从种植园强制扩展为机器节奏、工资纪律和殖民市场压力。',
  },
  {
    id: 'knowledge-cities-media-periods',
    title: '知识城市与媒介变化分期',
    subtitle: 'Knowledge cities / media',
    drivingQuestion: '纸张、手稿、学校、商业出版与书信档案如何改变知识传播的阶段？',
    scenarioIds: ['abbasid-baghdad-scribe', 'timbuktu-manuscript-student', 'ming-jiangnan-scholar', 'fustat-geniza-merchant-apprentice'],
    focus: '用城市、媒介、师承、市场和档案保存来划分知识流动的连续性与转折。',
    tags: ['知识城市', '媒介', '手稿', '教育', '档案'],
    suggestedTurningPoint: '从手抄与师承的高门槛传播，转向更依赖纸张市场、考试制度和商业书信的复合知识网络。',
  },
  {
    id: 'port-credit-monsoon-world-periods',
    title: '港口信用与季风世界分期',
    subtitle: 'Port credit / monsoon world',
    drivingQuestion: '季风航线、港口名声、合约与通译怎样把印度洋世界划分为不同交易阶段？',
    scenarioIds: ['fustat-geniza-merchant-apprentice', 'kilwa-swahili-gold-merchant', 'malacca-monsoon-port-broker', 'qing-guangzhou-comprador', 'colonial-bombay-mill-worker'],
    focus: '按季节性、信用文书、港口中介、国家监管和殖民工业连接来判断转折点。',
    tags: ['港口信用', '季风', '印度洋', '中介', '合约'],
    suggestedTurningPoint: '信用文书与港口中介的连续性被更强的帝国监管和工业商品链重新组织。',
  },
  {
    id: 'market-rules-long-change-periods',
    title: '市场规则的长时段变化',
    subtitle: 'Market rules / long change',
    drivingQuestion: '从城市市场、行会、贡赋到帝国通商规则，市场规则的长期变化应怎样划段？',
    scenarioIds: ['tang-changan-merchant', 'song-bianjing-apprentice', 'tenochtitlan-market-seller', 'qing-guangzhou-comprador', 'malacca-monsoon-port-broker'],
    focus: '把税、身份、行会、国家权力、信用和港口规则放到同一时间轴，避免把市场想成无规则真空。',
    tags: ['市场规则', '制度', '城市', '税', '信用'],
    suggestedTurningPoint: '市场从城市与行会/国家规则并存，逐渐转向更远距离、跨帝国、由信用和通商制度共同塑形的规则环境。',
  },
  {
    id: 'crisis-news-ordinary-safety-periods',
    title: '危机新闻与普通安全分期',
    subtitle: 'Crisis news / ordinary safety',
    drivingQuestion: '当战争、起义、征服或价格危机抵达普通人，安全感的连续性与转折在哪里？',
    scenarioIds: ['song-bianjing-apprentice', 'tenochtitlan-market-seller', 'saint-domingue-sugar-worker', 'wwii-london-civilian', 'colonial-bombay-mill-worker'],
    focus: '比较消息速度、国家动员、社区互助、劳动风险和普通人的撤退/坚持选择。',
    tags: ['危机消息', '普通安全', '战争', '起义', '社区'],
    suggestedTurningPoint: '危机从局部传闻和市场震荡，转向更密集的国家动员、城市防护和全球新闻/工业风险。',
  },
  {
    id: 'archive-visibility-changes-periods',
    title: '档案可见性变化分期',
    subtitle: 'Archive visibility changes',
    drivingQuestion: '哪些人的声音在不同时期更容易进入档案？史料可见性的转折怎样影响历史分期？',
    scenarioIds: ['inca-cusco-khipu-runner', 'fustat-geniza-merchant-apprentice', 'kilwa-swahili-gold-merchant', 'tenochtitlan-market-seller', 'saint-domingue-sugar-worker', 'wwii-london-civilian'],
    focus: '追踪 khipu/考古、商人书信、殖民记录、国家宣传与幸存档案，看见分期判断中的沉默。',
    tags: ['档案可见性', '沉默', '来源限制', '普通人声音', 'khipu'],
    suggestedTurningPoint: '从偶然幸存的商贸/考古材料，到更密集的国家、媒体和机构记录；但劳动者与被压迫者仍常被间接记录。',
  },
]

function getEmptyWorkspaceEntry(): WorkspaceEntry {
  return {
    notes: '',
    checkedEvidence: [],
    completed: false,
  }
}

function getEmptyWorkspaceState(): WorkspaceState {
  return {
    atlasMissions: {},
    inquiryPaths: {},
    routeNotebooks: {},
  }
}

function getMissionWorkKey(scenarioId: string, missionId: string) {
  return `${scenarioId}:${missionId}`
}

function parseMissionWorkState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as MissionWorkState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const entry = value as Partial<MissionWorkEntry>
        const notes = typeof entry.notes === 'string' ? entry.notes : ''
        const checkedEvidence = Array.isArray(entry.checkedEvidence)
          ? entry.checkedEvidence.filter((item): item is string => typeof item === 'string')
          : []
        const updatedAt = typeof entry.updatedAt === 'string' ? entry.updatedAt : undefined

        return [[key, { notes, checkedEvidence, updatedAt } satisfies MissionWorkEntry]]
      }),
    )
  } catch {
    return {} as MissionWorkState
  }
}


function normalizeWorkspaceEntry(value: unknown): WorkspaceEntry | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const entry = value as Partial<WorkspaceEntry>
  const notes = typeof entry.notes === 'string' ? entry.notes : ''
  const checkedEvidence = Array.isArray(entry.checkedEvidence)
    ? entry.checkedEvidence.filter((item): item is string => typeof item === 'string')
    : []
  const completed = typeof entry.completed === 'boolean' ? entry.completed : false
  const updatedAt = typeof entry.updatedAt === 'string' ? entry.updatedAt : undefined

  return { notes, checkedEvidence, completed, updatedAt }
}

function normalizeWorkspaceEntryMap(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {} as Record<string, WorkspaceEntry>
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, entry]) => {
      const normalizedEntry = normalizeWorkspaceEntry(entry)

      return normalizedEntry ? [[key, normalizedEntry]] : []
    }),
  )
}

function parseWorkspaceState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return getEmptyWorkspaceState()
    }

    const state = parsedState as Partial<WorkspaceState>

    return {
      atlasMissions: normalizeWorkspaceEntryMap(state.atlasMissions),
      inquiryPaths: normalizeWorkspaceEntryMap(state.inquiryPaths),
      routeNotebooks: normalizeWorkspaceEntryMap(state.routeNotebooks),
    } satisfies WorkspaceState
  } catch {
    return getEmptyWorkspaceState()
  }
}

function parseArgumentDraftState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as ArgumentDraftState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<ArgumentDraft>
        const evidence = Array.isArray(draft.evidence)
          ? draft.evidence.filter((item): item is string => typeof item === 'string')
          : []

        return [[
          key,
          {
            claim: typeof draft.claim === 'string' ? draft.claim : '',
            evidence,
            customEvidence: typeof draft.customEvidence === 'string' ? draft.customEvidence : '',
            reasoning: typeof draft.reasoning === 'string' ? draft.reasoning : '',
            counterEvidence: typeof draft.counterEvidence === 'string' ? draft.counterEvidence : '',
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies ArgumentDraft,
        ]]
      }),
    )
  } catch {
    return {} as ArgumentDraftState
  }
}

function parseCorroborationDraftState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as CorroborationDraftState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<CorroborationDraft>
        const sourceIds = Array.isArray(draft.sourceIds)
          ? draft.sourceIds.filter((item): item is string => typeof item === 'string').sort()
          : key.split('|').filter(Boolean).sort()
        const confidence = draft.confidence && draft.confidence in corroborationConfidenceLabels
          ? draft.confidence
          : 'uncertain'

        return [[
          key,
          {
            sourceIds,
            provisionalClaim: typeof draft.provisionalClaim === 'string' ? draft.provisionalClaim : '',
            supportingEvidence: typeof draft.supportingEvidence === 'string' ? draft.supportingEvidence : '',
            tensions: typeof draft.tensions === 'string' ? draft.tensions : '',
            absentVoices: typeof draft.absentVoices === 'string' ? draft.absentVoices : '',
            confidence,
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies CorroborationDraft,
        ]]
      }),
    )
  } catch {
    return {} as CorroborationDraftState
  }
}

function parseCausationDraftState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as CausationDraftState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<CausationDraft>
        const selectedEvidenceIds = Array.isArray(draft.selectedEvidenceIds)
          ? draft.selectedEvidenceIds.filter((item): item is string => typeof item === 'string')
          : []
        const confidence = draft.confidence && draft.confidence in causationConfidenceLabels
          ? draft.confidence
          : 'uncertain'

        return [[
          key,
          {
            backgroundConditions: typeof draft.backgroundConditions === 'string' ? draft.backgroundConditions : '',
            immediateTriggers: typeof draft.immediateTriggers === 'string' ? draft.immediateTriggers : '',
            constraints: typeof draft.constraints === 'string' ? draft.constraints : '',
            humanChoices: typeof draft.humanChoices === 'string' ? draft.humanChoices : '',
            shortTermConsequences: typeof draft.shortTermConsequences === 'string' ? draft.shortTermConsequences : '',
            longTermChange: typeof draft.longTermChange === 'string' ? draft.longTermChange : '',
            contingency: typeof draft.contingency === 'string' ? draft.contingency : '',
            missingEvidence: typeof draft.missingEvidence === 'string' ? draft.missingEvidence : '',
            confidence,
            selectedEvidenceIds,
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies CausationDraft,
        ]]
      }),
    )
  } catch {
    return {} as CausationDraftState
  }
}

function parsePeriodizationDraftState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as PeriodizationDraftState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<PeriodizationDraft>
        const selectedEvidenceIds = Array.isArray(draft.selectedEvidenceIds)
          ? draft.selectedEvidenceIds.filter((item): item is string => typeof item === 'string')
          : []
        const confidence = draft.confidence && draft.confidence in periodizationConfidenceLabels
          ? draft.confidence
          : 'uncertain'

        return [[
          key,
          {
            periodStart: typeof draft.periodStart === 'string' ? draft.periodStart : '',
            periodEnd: typeof draft.periodEnd === 'string' ? draft.periodEnd : '',
            continuities: typeof draft.continuities === 'string' ? draft.continuities : '',
            changes: typeof draft.changes === 'string' ? draft.changes : '',
            turningPoint: typeof draft.turningPoint === 'string' ? draft.turningPoint : '',
            beforeAfterEvidence: typeof draft.beforeAfterEvidence === 'string' ? draft.beforeAfterEvidence : '',
            periodLabel: typeof draft.periodLabel === 'string' ? draft.periodLabel : '',
            alternativePeriodization: typeof draft.alternativePeriodization === 'string' ? draft.alternativePeriodization : '',
            missingEvidence: typeof draft.missingEvidence === 'string' ? draft.missingEvidence : '',
            confidence,
            selectedEvidenceIds,
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies PeriodizationDraft,
        ]]
      }),
    )
  } catch {
    return {} as PeriodizationDraftState
  }
}


function parseContextDraftState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as ContextDraftState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<ContextDraft>
        const selectedEvidenceIds = Array.isArray(draft.selectedEvidenceIds)
          ? draft.selectedEvidenceIds.filter((item): item is string => typeof item === 'string')
          : []
        const confidence = draft.confidence && draft.confidence in contextConfidenceLabels
          ? draft.confidence
          : 'uncertain'

        return [[
          key,
          {
            localSetting: typeof draft.localSetting === 'string' ? draft.localSetting : '',
            regionalConnections: typeof draft.regionalConnections === 'string' ? draft.regionalConnections : '',
            largeScaleForces: typeof draft.largeScaleForces === 'string' ? draft.largeScaleForces : '',
            sourceContext: typeof draft.sourceContext === 'string' ? draft.sourceContext : '',
            anachronismRisk: typeof draft.anachronismRisk === 'string' ? draft.anachronismRisk : '',
            contextClaim: typeof draft.contextClaim === 'string' ? draft.contextClaim : '',
            missingContext: typeof draft.missingContext === 'string' ? draft.missingContext : '',
            confidence,
            selectedEvidenceIds,
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies ContextDraft,
        ]]
      }),
    )
  } catch {
    return {} as ContextDraftState
  }
}

function parsePerspectivesDraftState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as PerspectivesDraftState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<PerspectivesDraft>
        const selectedEvidenceIds = Array.isArray(draft.selectedEvidenceIds)
          ? draft.selectedEvidenceIds.filter((item): item is string => typeof item === 'string')
          : []
        const confidence = draft.confidence && draft.confidence in perspectivesConfidenceLabels
          ? draft.confidence
          : 'uncertain'

        return [[
          key,
          {
            actorView: typeof draft.actorView === 'string' ? draft.actorView : '',
            constraints: typeof draft.constraints === 'string' ? draft.constraints : '',
            availableKnowledge: typeof draft.availableKnowledge === 'string' ? draft.availableKnowledge : '',
            stakesAndRisks: typeof draft.stakesAndRisks === 'string' ? draft.stakesAndRisks : '',
            agencyClaim: typeof draft.agencyClaim === 'string' ? draft.agencyClaim : '',
            presentismWarning: typeof draft.presentismWarning === 'string' ? draft.presentismWarning : '',
            sourcePerspectiveLimits: typeof draft.sourcePerspectiveLimits === 'string' ? draft.sourcePerspectiveLimits : '',
            missingVoices: typeof draft.missingVoices === 'string' ? draft.missingVoices : '',
            confidence,
            selectedEvidenceIds,
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies PerspectivesDraft,
        ]]
      }),
    )
  } catch {
    return {} as PerspectivesDraftState
  }
}


function parseCompareDraftState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as CompareDraftState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<CompareDraft>
        const scenarioAId = typeof draft.scenarioAId === 'string' ? draft.scenarioAId : ''
        const scenarioBId = typeof draft.scenarioBId === 'string' ? draft.scenarioBId : ''
        const lensKey = draft.lensKey && compareLenses.some((lens) => lens.key === draft.lensKey) ? draft.lensKey : defaultCompareLensKey
        const selectedEvidenceIdsA = Array.isArray(draft.selectedEvidenceIdsA)
          ? draft.selectedEvidenceIdsA.filter((item): item is string => typeof item === 'string')
          : []
        const selectedEvidenceIdsB = Array.isArray(draft.selectedEvidenceIdsB)
          ? draft.selectedEvidenceIdsB.filter((item): item is string => typeof item === 'string')
          : []
        const confidence = draft.confidence && draft.confidence in compareConfidenceLabels
          ? draft.confidence
          : 'uncertain'
        const normalizedKey = scenarioAId && scenarioBId ? getCompareDraftKey(scenarioAId, scenarioBId, lensKey) : key

        return [[
          normalizedKey,
          {
            scenarioAId,
            scenarioBId,
            lensKey,
            selectedEvidenceIdsA,
            selectedEvidenceIdsB,
            comparativeClaim: typeof draft.comparativeClaim === 'string' ? draft.comparativeClaim : '',
            similarity: typeof draft.similarity === 'string' ? draft.similarity : '',
            difference: typeof draft.difference === 'string' ? draft.difference : '',
            evidenceBridge: typeof draft.evidenceBridge === 'string' ? draft.evidenceBridge : '',
            sourceLimits: typeof draft.sourceLimits === 'string' ? draft.sourceLimits : '',
            confidence,
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies CompareDraft,
        ]]
      }),
    )
  } catch {
    return {} as CompareDraftState
  }
}

function parseSynthesisDraftState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as SynthesisDraftState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<SynthesisDraft>
        const evidenceIds = Array.isArray(draft.evidenceIds)
          ? draft.evidenceIds.filter((item): item is string => typeof item === 'string')
          : []
        const confidence = draft.confidence && draft.confidence in synthesisConfidenceLabels
          ? draft.confidence
          : 'uncertain'

        return [[
          key,
          {
            drivingQuestion: typeof draft.drivingQuestion === 'string' ? draft.drivingQuestion : '',
            workingThesis: typeof draft.workingThesis === 'string' ? draft.workingThesis : '',
            claimScope: typeof draft.claimScope === 'string' ? draft.claimScope : '',
            evidenceIds,
            reasoningBridge: typeof draft.reasoningBridge === 'string' ? draft.reasoningBridge : '',
            counterargument: typeof draft.counterargument === 'string' ? draft.counterargument : '',
            sourceLimits: typeof draft.sourceLimits === 'string' ? draft.sourceLimits : '',
            paragraphPlan: typeof draft.paragraphPlan === 'string' ? draft.paragraphPlan : '',
            significanceLink: typeof draft.significanceLink === 'string' ? draft.significanceLink : '',
            revisionChecklist: typeof draft.revisionChecklist === 'string' ? draft.revisionChecklist : '',
            confidence,
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies SynthesisDraft,
        ]]
      }),
    )
  } catch {
    return {} as SynthesisDraftState
  }
}

function parseGuidedSessionProgressState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as GuidedSessionProgressState
    }

    return Object.fromEntries(
      Object.entries(parsedState).filter((entry): entry is [string, string[]] =>
        Array.isArray(entry[1]) && entry[1].every((stepId) => typeof stepId === 'string'),
      ),
    )
  } catch {
    return {} as GuidedSessionProgressState
  }
}


function parseTaskModuleProgressState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as TaskModuleProgressState
    }

    return Object.fromEntries(
      Object.entries(parsedState).filter((entry): entry is [string, string[]] =>
        Array.isArray(entry[1]) && entry[1].every((stepId) => typeof stepId === 'string'),
      ),
    )
  } catch {
    return {} as TaskModuleProgressState
  }
}

function getSafeStorage(kind: 'localStorage' | 'sessionStorage') {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storage = window[kind]
    const probeKey = `timeatlas:${kind}:probe`

    storage.setItem(probeKey, '1')
    storage.removeItem(probeKey)

    return storage
  } catch {
    return null
  }
}

function loadMissionState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseMissionState(localStorage?.getItem(missionProgressStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parseMissionState(sessionStorage?.getItem(missionProgressStorageKey) ?? null)
}

function persistMissionState(state: Record<string, string[]>) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(missionProgressStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(missionProgressStorageKey, serializedState)
}

function loadMissionWorkState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseMissionWorkState(localStorage?.getItem(missionWorkStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parseMissionWorkState(sessionStorage?.getItem(missionWorkStorageKey) ?? null)
}

function persistMissionWorkState(state: MissionWorkState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(missionWorkStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(missionWorkStorageKey, serializedState)
}

function loadArgumentDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseArgumentDraftState(localStorage?.getItem(argumentStudioStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parseArgumentDraftState(sessionStorage?.getItem(argumentStudioStorageKey) ?? null)
}

function persistArgumentDraftState(state: ArgumentDraftState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(argumentStudioStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(argumentStudioStorageKey, serializedState)
}

function loadCorroborationDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseCorroborationDraftState(localStorage?.getItem(corroborationStudioStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parseCorroborationDraftState(sessionStorage?.getItem(corroborationStudioStorageKey) ?? null)
}

function persistCorroborationDraftState(state: CorroborationDraftState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(corroborationStudioStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(corroborationStudioStorageKey, serializedState)
}

function loadCausationDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseCausationDraftState(localStorage?.getItem(causationLabStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parseCausationDraftState(sessionStorage?.getItem(causationLabStorageKey) ?? null)
}

function persistCausationDraftState(state: CausationDraftState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(causationLabStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(causationLabStorageKey, serializedState)
}

function loadPeriodizationDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parsePeriodizationDraftState(localStorage?.getItem(periodizationLabStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parsePeriodizationDraftState(sessionStorage?.getItem(periodizationLabStorageKey) ?? null)
}

function persistPeriodizationDraftState(state: PeriodizationDraftState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(periodizationLabStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(periodizationLabStorageKey, serializedState)
}


function loadContextDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseContextDraftState(localStorage?.getItem(contextLabStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parseContextDraftState(sessionStorage?.getItem(contextLabStorageKey) ?? null)
}

function persistContextDraftState(state: ContextDraftState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(contextLabStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(contextLabStorageKey, serializedState)
}


function parseSignificanceDraftState(rawState: string | null) {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as SignificanceDraftState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<SignificanceDraft>
        const selectedEvidenceIds = Array.isArray(draft.selectedEvidenceIds)
          ? draft.selectedEvidenceIds.filter((item): item is string => typeof item === 'string')
          : []
        const confidence = draft.confidence && draft.confidence in significanceConfidenceLabels
          ? draft.confidence
          : 'uncertain'

        return [[
          key,
          {
            eventOrProcess: typeof draft.eventOrProcess === 'string' ? draft.eventOrProcess : '',
            whoItMatteredTo: typeof draft.whoItMatteredTo === 'string' ? draft.whoItMatteredTo : '',
            contemporarySignificance: typeof draft.contemporarySignificance === 'string' ? draft.contemporarySignificance : '',
            longTermSignificance: typeof draft.longTermSignificance === 'string' ? draft.longTermSignificance : '',
            scaleOfImpact: typeof draft.scaleOfImpact === 'string' ? draft.scaleOfImpact : '',
            contestedMeaning: typeof draft.contestedMeaning === 'string' ? draft.contestedMeaning : '',
            sourceLimits: typeof draft.sourceLimits === 'string' ? draft.sourceLimits : '',
            significanceClaim: typeof draft.significanceClaim === 'string' ? draft.significanceClaim : '',
            selectedEvidenceIds,
            confidence,
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies SignificanceDraft,
        ]]
      }),
    )
  } catch {
    return {} as SignificanceDraftState
  }
}

function loadSignificanceDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseSignificanceDraftState(localStorage?.getItem(significanceLabStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parseSignificanceDraftState(sessionStorage?.getItem(significanceLabStorageKey) ?? null)
}

function persistSignificanceDraftState(state: SignificanceDraftState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(significanceLabStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(significanceLabStorageKey, serializedState)
}

function loadPerspectivesDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parsePerspectivesDraftState(localStorage?.getItem(perspectivesLabStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parsePerspectivesDraftState(sessionStorage?.getItem(perspectivesLabStorageKey) ?? null)
}

function persistPerspectivesDraftState(state: PerspectivesDraftState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(perspectivesLabStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(perspectivesLabStorageKey, serializedState)
}


function loadCompareDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseCompareDraftState(localStorage?.getItem(compareLabStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parseCompareDraftState(sessionStorage?.getItem(compareLabStorageKey) ?? null)
}

function persistCompareDraftState(state: CompareDraftState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(compareLabStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(compareLabStorageKey, serializedState)
}

function loadSynthesisDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseSynthesisDraftState(localStorage?.getItem(synthesisStudioStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parseSynthesisDraftState(sessionStorage?.getItem(synthesisStudioStorageKey) ?? null)
}

function persistSynthesisDraftState(state: SynthesisDraftState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(synthesisStudioStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(synthesisStudioStorageKey, serializedState)
}

function loadGuidedSessionProgressState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseGuidedSessionProgressState(localStorage?.getItem(guidedSessionProgressStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parseGuidedSessionProgressState(sessionStorage?.getItem(guidedSessionProgressStorageKey) ?? null)
}

function persistGuidedSessionProgressState(state: GuidedSessionProgressState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(guidedSessionProgressStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(guidedSessionProgressStorageKey, serializedState)
}


function loadTaskModuleProgressState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseTaskModuleProgressState(localStorage?.getItem(taskModuleProgressStorageKey) ?? null)

  if (Object.keys(localState).length > 0) {
    return localState
  }

  return parseTaskModuleProgressState(sessionStorage?.getItem(taskModuleProgressStorageKey) ?? null)
}

function persistTaskModuleProgressState(state: TaskModuleProgressState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(taskModuleProgressStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(taskModuleProgressStorageKey, serializedState)
}


function getEmptyTaskWorkbenchDraft(taskId: string): TaskWorkbenchDraft {
  return {
    taskId,
    checkedPromptIds: [],
    evidenceNotes: '',
    claimExplanation: '',
    sourceLimits: '',
    reflection: '',
    completed: false,
  }
}

function parseTaskWorkbenchDraftState(rawState: string | null): TaskWorkbenchState {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as TaskWorkbenchState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<TaskWorkbenchDraft>
        const taskId = typeof draft.taskId === 'string' && draft.taskId ? draft.taskId : key
        const checkedPromptIds = Array.isArray(draft.checkedPromptIds)
          ? draft.checkedPromptIds.filter((item): item is string => typeof item === 'string')
          : []

        return [[
          taskId,
          {
            taskId,
            checkedPromptIds,
            evidenceNotes: typeof draft.evidenceNotes === 'string' ? draft.evidenceNotes : '',
            claimExplanation: typeof draft.claimExplanation === 'string' ? draft.claimExplanation : '',
            sourceLimits: typeof draft.sourceLimits === 'string' ? draft.sourceLimits : '',
            reflection: typeof draft.reflection === 'string' ? draft.reflection : '',
            completed: Boolean(draft.completed),
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies TaskWorkbenchDraft,
        ]]
      }),
    )
  } catch {
    return {} as TaskWorkbenchState
  }
}

function hasTaskWorkbenchDraftActivity(draft: TaskWorkbenchDraft) {
  return Boolean(
    draft.checkedPromptIds.length
      || draft.evidenceNotes.trim()
      || draft.claimExplanation.trim()
      || draft.sourceLimits.trim()
      || draft.reflection.trim()
      || draft.completed,
  )
}

function loadTaskWorkbenchDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseTaskWorkbenchDraftState(localStorage?.getItem(taskWorkbenchStorageKey) ?? null)

  if (Object.values(localState).some(hasTaskWorkbenchDraftActivity)) {
    return localState
  }

  return parseTaskWorkbenchDraftState(sessionStorage?.getItem(taskWorkbenchStorageKey) ?? null)
}

function persistTaskWorkbenchDraftState(state: TaskWorkbenchState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(taskWorkbenchStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(taskWorkbenchStorageKey, serializedState)
}

function getEmptyActorNetworkDraft(encounter: SocialEncounter): ActorNetworkDraft {
  return {
    selectedActorIds: encounter.actorIds.slice(0, 2),
    roleBrief: '',
    perspectiveComparison: '',
    negotiationPlan: '',
    missingVoiceNote: '',
    evidenceNotes: '',
    completed: false,
  }
}

function getActorNetworkDraftKey(scenarioId: string, encounterId: string) {
  return `${scenarioId}:${encounterId}`
}

function parseActorNetworkDraftState(rawState: string | null): ActorNetworkDraftState {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as ActorNetworkDraftState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<ActorNetworkDraft>
        const selectedActorIds = Array.isArray(draft.selectedActorIds)
          ? draft.selectedActorIds.filter((item): item is string => typeof item === 'string')
          : []

        return [[
          key,
          {
            selectedActorIds,
            roleBrief: typeof draft.roleBrief === 'string' ? draft.roleBrief : '',
            perspectiveComparison: typeof draft.perspectiveComparison === 'string' ? draft.perspectiveComparison : '',
            negotiationPlan: typeof draft.negotiationPlan === 'string' ? draft.negotiationPlan : '',
            missingVoiceNote: typeof draft.missingVoiceNote === 'string' ? draft.missingVoiceNote : '',
            evidenceNotes: typeof draft.evidenceNotes === 'string' ? draft.evidenceNotes : '',
            completed: Boolean(draft.completed),
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies ActorNetworkDraft,
        ]]
      }),
    )
  } catch {
    return {} as ActorNetworkDraftState
  }
}

function hasActorNetworkDraftActivity(draft: ActorNetworkDraft) {
  return Boolean(
    draft.selectedActorIds.length
      || draft.roleBrief.trim()
      || draft.perspectiveComparison.trim()
      || draft.negotiationPlan.trim()
      || draft.missingVoiceNote.trim()
      || draft.evidenceNotes.trim()
      || draft.completed,
  )
}

function loadActorNetworkDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseActorNetworkDraftState(localStorage?.getItem(actorNetworkDraftStorageKey) ?? null)

  if (Object.values(localState).some(hasActorNetworkDraftActivity)) {
    return localState
  }

  return parseActorNetworkDraftState(sessionStorage?.getItem(actorNetworkDraftStorageKey) ?? null)
}

function persistActorNetworkDraftState(state: ActorNetworkDraftState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(actorNetworkDraftStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(actorNetworkDraftStorageKey, serializedState)
}

function getTaskWorkbenchChecklist(task: LibraryTask) {
  return task.checklist?.length
    ? task.checklist
    : [
      `理解任务：${task.summary}`,
      `收集并标注至少一条${task.sourceBased ? '来源证据' : '任务证据'}`,
      `产出交付物：${task.deliverable}`,
      '指出来源限制、缺席声音或仍不确定的问题。',
    ]
}

function getTaskWorkbenchEvidencePrompts(task: LibraryTask) {
  return task.evidencePrompts?.length
    ? task.evidencePrompts
    : [
      '哪一条证据最能支持你的判断？它来自哪里？',
      '这条证据不能证明什么？哪些声音或材料缺席？',
      '你如何把证据连接到历史情境、尺度或因果/比较/意义判断？',
    ]
}

function getTaskWorkbenchPrompts(task: LibraryTask) {
  return task.workbenchPrompts?.length
    ? task.workbenchPrompts
    : [
      `用一句话复述任务目标：${task.summary}`,
      `完成形式：${task.deliverable}`,
      `历史思维焦点：${task.category} / ${task.sourceLabel}`,
    ]
}

function getTaskWorkbenchStats(state: TaskWorkbenchState): TaskWorkbenchStats {
  const activeDrafts = Object.entries(state).filter((entry): entry is [string, TaskWorkbenchDraft] => hasTaskWorkbenchDraftActivity(entry[1]))
  const sortedDrafts = [...activeDrafts].sort(([, first], [, second]) => (second.updatedAt ?? '').localeCompare(first.updatedAt ?? ''))

  return {
    activeDrafts,
    activeCount: activeDrafts.length,
    completedCount: activeDrafts.filter(([, draft]) => draft.completed).length,
    checkedPromptCount: activeDrafts.reduce((count, [, draft]) => count + draft.checkedPromptIds.length, 0),
    recentDrafts: sortedDrafts.slice(0, 4),
  }
}

function formatActorNetworkBrief(scenario: Scenario, encounter: SocialEncounter, actors: SocialActor[], draft: ActorNetworkDraft) {
  const selectedActors = actors.filter((actor) => draft.selectedActorIds.includes(actor.id))

  return [
    `TimeAtlas Actor Network Brief · ${scenario.title}`,
    `Encounter：${encounter.title}`,
    `Setting：${encounter.setting}`,
    `Decision focus：${encounter.decisionFocus}`,
    `状态：${draft.completed ? '已完成' : hasActorNetworkDraftActivity(draft) ? '草稿' : '未开始'}`,
    `更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
    '',
    'Selected actors:',
    ...(selectedActors.length ? selectedActors.map((actor) => `- ${actor.name}｜${actor.role}｜关系：${actor.relationship}｜目标：${actor.goals}｜限制：${actor.constraints}｜知识边界：${actor.knowledgeLimits}｜风险：${actor.risksOrStakes}｜可能立场：${actor.likelyViewOfDecision}`) : ['- 尚未选择人物']),
    '',
    `Role brief：${draft.roleBrief.trim() || '尚未填写'}`,
    `Perspective comparison：${draft.perspectiveComparison.trim() || '尚未填写'}`,
    `Negotiation plan：${draft.negotiationPlan.trim() || '尚未填写'}`,
    `Missing voice note：${draft.missingVoiceNote.trim() || '尚未填写'}`,
    `Evidence notes：${draft.evidenceNotes.trim() || '尚未填写'}`,
    '',
    'Task checklist:',
    ...encounter.taskChecklist.map((item) => `- ${item}`),
    '',
    'Evidence links:',
    ...encounter.evidenceLinks.map((link) => `- ${link}`),
  ].join('\n')
}

function formatActorNetworkTaskSheet(scenario: Scenario, encounter: SocialEncounter) {
  const actors = scenario.socialActors.filter((actor) => encounter.actorIds.includes(actor.id))

  return [
    `TimeAtlas Actor Network Task · ${scenario.title}`,
    `Encounter：${encounter.title}`,
    `地点/情境：${scenario.location}｜${scenario.era}`,
    `任务焦点：${encounter.decisionFocus}`,
    `张力：${encounter.tension}`,
    '',
    '人物卡：',
    ...actors.map((actor) => `- ${actor.name}：${actor.relationship}；目标：${actor.goals}；限制：${actor.constraints}；知识边界：${actor.knowledgeLimits}`),
    '',
    '执行清单：',
    ...encounter.taskChecklist.map((item, index) => `${index + 1}. ${item}`),
    '',
    '输出模板：',
    'Role brief：',
    'Perspective comparison：',
    'Negotiation plan：',
    'Missing voice / evidence limits：',
  ].join('\n')
}

function formatTaskWorkbenchDraft(task: LibraryTask, draft: TaskWorkbenchDraft) {
  const checklist = getTaskWorkbenchChecklist(task)
  const evidencePrompts = getTaskWorkbenchEvidencePrompts(task)
  const promptSections = getTaskWorkbenchPrompts(task)

  return [
    `TimeAtlas Tasks Workbench / 任务执行台：${task.title}`,
    `来源：${task.sourceLabel}｜${task.category}`,
    `情境：${task.context}`,
    `时长：${task.durationMinutes} 分钟（${getDurationBandLabel(task.durationBand)}）`,
    `状态：${draft.completed ? '已完成' : hasTaskWorkbenchDraftActivity(draft) ? '草稿' : '未开始'}`,
    `更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
    '',
    '任务提示：',
    ...promptSections.map((prompt, index) => `${index + 1}. ${prompt}`),
    '',
    '执行清单：',
    ...checklist.map((item, index) => `- [${draft.checkedPromptIds.includes(`checklist:${index}`) ? 'x' : ' '}] ${item}`),
    '',
    '证据提示：',
    ...evidencePrompts.map((prompt, index) => `- ${index + 1}. ${prompt}`),
    '',
    `证据 notes：${draft.evidenceNotes.trim() || '尚未填写'}`,
    `Claim / explanation：${draft.claimExplanation.trim() || '尚未填写'}`,
    `Source limits：${draft.sourceLimits.trim() || '尚未填写'}`,
    `Reflection：${draft.reflection.trim() || '尚未填写'}`,
    '',
    '原始任务单：',
    task.formatSheet(),
  ].join('\n')
}

function getEmptyAssignmentBuilderDraft(): AssignmentBuilderDraft {
  return {
    selectedTaskIds: [],
    title: 'TimeAtlas 任务组合',
    audience: '中学历史课堂 / 自主学习小组',
    timeBox: '45–75 分钟',
    learningGoal: '用多个 TimeAtlas 任务连接身份、来源、历史思维和最终论证。',
    finalDeliverable: '一份证据驱动的学习输出，可包含任务草稿、比较判断或综合段落。',
    teacherNotes: '',
    studentInstructions: '',
    rubricFocus: '证据选择、历史情境、推理清晰、来源限制、完成度',
  }
}

function parseAssignmentBuilderDraft(rawState: string | null): AssignmentBuilderDraft {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return getEmptyAssignmentBuilderDraft()
    }

    const draft = parsedState as Partial<AssignmentBuilderDraft>
    const selectedTaskIds = Array.isArray(draft.selectedTaskIds)
      ? draft.selectedTaskIds.filter((item): item is string => typeof item === 'string').slice(0, 6)
      : []

    return {
      ...getEmptyAssignmentBuilderDraft(),
      selectedTaskIds,
      title: typeof draft.title === 'string' ? draft.title : getEmptyAssignmentBuilderDraft().title,
      audience: typeof draft.audience === 'string' ? draft.audience : getEmptyAssignmentBuilderDraft().audience,
      timeBox: typeof draft.timeBox === 'string' ? draft.timeBox : getEmptyAssignmentBuilderDraft().timeBox,
      learningGoal: typeof draft.learningGoal === 'string' ? draft.learningGoal : getEmptyAssignmentBuilderDraft().learningGoal,
      finalDeliverable: typeof draft.finalDeliverable === 'string' ? draft.finalDeliverable : getEmptyAssignmentBuilderDraft().finalDeliverable,
      teacherNotes: typeof draft.teacherNotes === 'string' ? draft.teacherNotes : '',
      studentInstructions: typeof draft.studentInstructions === 'string' ? draft.studentInstructions : '',
      rubricFocus: typeof draft.rubricFocus === 'string' ? draft.rubricFocus : getEmptyAssignmentBuilderDraft().rubricFocus,
      updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
    }
  } catch {
    return getEmptyAssignmentBuilderDraft()
  }
}

function hasAssignmentBuilderActivity(draft: AssignmentBuilderDraft) {
  const emptyDraft = getEmptyAssignmentBuilderDraft()

  return Boolean(
    draft.selectedTaskIds.length
      || draft.title.trim() !== emptyDraft.title
      || draft.audience.trim() !== emptyDraft.audience
      || draft.timeBox.trim() !== emptyDraft.timeBox
      || draft.learningGoal.trim() !== emptyDraft.learningGoal
      || draft.finalDeliverable.trim() !== emptyDraft.finalDeliverable
      || draft.teacherNotes.trim()
      || draft.studentInstructions.trim()
      || draft.rubricFocus.trim() !== emptyDraft.rubricFocus,
  )
}

function loadAssignmentBuilderDraft() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localDraft = parseAssignmentBuilderDraft(localStorage?.getItem(assignmentBuilderStorageKey) ?? null)

  if (hasAssignmentBuilderActivity(localDraft)) {
    return localDraft
  }

  return parseAssignmentBuilderDraft(sessionStorage?.getItem(assignmentBuilderStorageKey) ?? null)
}

function persistAssignmentBuilderDraft(draft: AssignmentBuilderDraft) {
  const serializedState = JSON.stringify(draft)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(assignmentBuilderStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(assignmentBuilderStorageKey, serializedState)
}


function loadWorkspaceState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseWorkspaceState(localStorage?.getItem(workspaceStorageKey) ?? null)

  if (getWorkspaceEntries(localState).length > 0) {
    return localState
  }

  return parseWorkspaceState(sessionStorage?.getItem(workspaceStorageKey) ?? null)
}

function persistWorkspaceState(state: WorkspaceState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(workspaceStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(workspaceStorageKey, serializedState)
}

function getWorkspaceEntries(workspaceState: WorkspaceState) {
  return [
    ...Object.entries(workspaceState.atlasMissions).map(([id, entry]) => ({
      key: `atlas:${id}`,
      id,
      title: atlasMissions.find((mission) => mission.id === id)?.title ?? '未知跨场景挑战',
      category: '跨场景挑战',
      entry,
    })),
    ...Object.entries(workspaceState.inquiryPaths).map(([id, entry]) => ({
      key: `inquiry:${id}`,
      id,
      title: atlasInquiryPaths.find((path) => path.id === id)?.title ?? '未知探究路径',
      category: '探究路径',
      entry,
    })),
    ...Object.entries(workspaceState.routeNotebooks).map(([id, entry]) => ({
      key: `route:${id}`,
      id,
      title: atlasMapRoutes.find((route) => route.id === id)?.title ?? '未知路线笔记',
      category: '路线探究笔记',
      entry,
    })),
  ]
}

function hasWorkspaceEntryActivity(entry: WorkspaceEntry) {
  return Boolean(entry.completed || entry.notes.trim() || entry.checkedEvidence.length)
}

function getWorkspaceStats(workspaceState: WorkspaceState): WorkspaceStats {
  const activeEntries = getWorkspaceEntries(workspaceState).filter(({ entry }) => hasWorkspaceEntryActivity(entry))

  return {
    totalEntries: activeEntries.length,
    draftEntries: activeEntries.filter(({ entry }) => !entry.completed && (entry.notes.trim() || entry.checkedEvidence.length)).length,
    completedEntries: activeEntries.filter(({ entry }) => entry.completed).length,
    checkedEvidenceCount: activeEntries.reduce((count, { entry }) => count + entry.checkedEvidence.length, 0),
    recentEntries: [...activeEntries]
      .sort((first, second) => (second.entry.updatedAt ?? '').localeCompare(first.entry.updatedAt ?? ''))
      .slice(0, 4),
  }
}


function countScenarioMissionWork(scenario: Scenario, missionWorkState: MissionWorkState) {
  return scenario.missions.filter((mission) => {
    const work = missionWorkState[getMissionWorkKey(scenario.id, mission.id)]

    return Boolean(work?.notes.trim() || work?.checkedEvidence.length)
  }).length
}

function getTotalCompletedMissions(completedMissionIdsByScenario: Record<string, string[]>) {
  return scenarios.reduce((count, scenario) => {
    const validMissionIds = new Set(scenario.missions.map((mission) => mission.id))
    const completedMissionIds = completedMissionIdsByScenario[scenario.id] ?? []

    return count + completedMissionIds.filter((missionId) => validMissionIds.has(missionId)).length
  }, 0)
}

function getRouteNotebookStatus(route: AtlasMapRoute, entry: WorkspaceEntry) {
  if (entry.completed) {
    return 'completed' as const
  }

  if (entry.notes.trim() || entry.checkedEvidence.length) {
    return 'draft' as const
  }

  const totalItems = route.scenarioIds.length + route.evidencePrompts.length

  if (totalItems > 0 && entry.checkedEvidence.length >= totalItems) {
    return 'draft' as const
  }

  return 'not-started' as const
}

function getMissionStatus(scenarioId: string, mission: Mission, completedMissionIds: string[], missionWorkState: MissionWorkState) {
  if (completedMissionIds.includes(mission.id)) {
    return 'completed' as const
  }

  const work = missionWorkState[getMissionWorkKey(scenarioId, mission.id)]

  if (work?.notes.trim() || work?.checkedEvidence.length) {
    return 'draft' as const
  }

  return 'not-started' as const
}

function getEmptyArgumentDraft(): ArgumentDraft {
  return {
    claim: '',
    evidence: [],
    customEvidence: '',
    reasoning: '',
    counterEvidence: '',
  }
}

function getCorroborationBasketKey(sourceIds: string[]) {
  return [...sourceIds].sort().join('|')
}

function getEmptyCorroborationDraft(sourceIds: string[] = []): CorroborationDraft {
  const sortedSourceIds = [...sourceIds].sort()

  return {
    sourceIds: sortedSourceIds,
    provisionalClaim: '',
    supportingEvidence: '',
    tensions: '',
    absentVoices: '',
    confidence: 'uncertain',
  }
}

function getCompareDraftKey(scenarioAId: string, scenarioBId: string, lensKey: CompareLens['key']) {
  return `${scenarioAId}::${scenarioBId}::${lensKey}`
}

function getEmptyCompareDraft(scenarioAId: string, scenarioBId: string, lensKey: CompareLens['key']): CompareDraft {
  return {
    scenarioAId,
    scenarioBId,
    lensKey,
    selectedEvidenceIdsA: [],
    selectedEvidenceIdsB: [],
    comparativeClaim: '',
    similarity: '',
    difference: '',
    evidenceBridge: '',
    sourceLimits: '',
    confidence: 'uncertain',
  }
}

function hasCompareDraftActivity(draft: CompareDraft) {
  return Boolean(
    draft.selectedEvidenceIdsA.length
      || draft.selectedEvidenceIdsB.length
      || draft.comparativeClaim.trim()
      || draft.similarity.trim()
      || draft.difference.trim()
      || draft.evidenceBridge.trim()
      || draft.sourceLimits.trim()
      || draft.confidence !== 'uncertain',
  )
}

function getActiveCompareDrafts(compareDraftState: CompareDraftState) {
  return Object.entries(compareDraftState).filter(([, draft]) => hasCompareDraftActivity(draft))
}

function getActiveActorNetworkDrafts(actorNetworkDraftState: ActorNetworkDraftState) {
  return Object.entries(actorNetworkDraftState).filter(([, draft]) => hasActorNetworkDraftActivity(draft))
}

function hasCorroborationDraftActivity(draft: CorroborationDraft) {
  return Boolean(
    draft.provisionalClaim.trim()
      || draft.supportingEvidence.trim()
      || draft.tensions.trim()
      || draft.absentVoices.trim()
      || draft.confidence !== 'uncertain',
  )
}

function getActiveCorroborationDrafts(corroborationDraftState: CorroborationDraftState) {
  return Object.entries(corroborationDraftState).filter(([, draft]) => hasCorroborationDraftActivity(draft))
}

function getEmptyPeriodizationDraft(): PeriodizationDraft {
  return {
    periodStart: '',
    periodEnd: '',
    continuities: '',
    changes: '',
    turningPoint: '',
    beforeAfterEvidence: '',
    periodLabel: '',
    alternativePeriodization: '',
    missingEvidence: '',
    confidence: 'uncertain',
    selectedEvidenceIds: [],
  }
}


function getEmptyContextDraft(): ContextDraft {
  return {
    localSetting: '',
    regionalConnections: '',
    largeScaleForces: '',
    sourceContext: '',
    anachronismRisk: '',
    contextClaim: '',
    missingContext: '',
    confidence: 'uncertain',
    selectedEvidenceIds: [],
  }
}

function hasContextDraftActivity(draft: ContextDraft) {
  return Boolean(
    draft.localSetting.trim()
      || draft.regionalConnections.trim()
      || draft.largeScaleForces.trim()
      || draft.sourceContext.trim()
      || draft.anachronismRisk.trim()
      || draft.contextClaim.trim()
      || draft.missingContext.trim()
      || draft.confidence !== 'uncertain'
      || draft.selectedEvidenceIds.length,
  )
}

function getActiveContextDrafts(contextDraftState: ContextDraftState) {
  return Object.entries(contextDraftState).filter(([, draft]) => hasContextDraftActivity(draft))
}

function getEmptyPerspectivesDraft(): PerspectivesDraft {
  return {
    actorView: '',
    constraints: '',
    availableKnowledge: '',
    stakesAndRisks: '',
    agencyClaim: '',
    presentismWarning: '',
    sourcePerspectiveLimits: '',
    missingVoices: '',
    confidence: 'uncertain',
    selectedEvidenceIds: [],
  }
}

function hasPerspectivesDraftActivity(draft: PerspectivesDraft) {
  return Boolean(
    draft.actorView.trim()
      || draft.constraints.trim()
      || draft.availableKnowledge.trim()
      || draft.stakesAndRisks.trim()
      || draft.agencyClaim.trim()
      || draft.presentismWarning.trim()
      || draft.sourcePerspectiveLimits.trim()
      || draft.missingVoices.trim()
      || draft.confidence !== 'uncertain'
      || draft.selectedEvidenceIds.length,
  )
}

function getActivePerspectivesDrafts(perspectivesDraftState: PerspectivesDraftState) {
  return Object.entries(perspectivesDraftState).filter(([, draft]) => hasPerspectivesDraftActivity(draft))
}

function hasPeriodizationDraftActivity(draft: PeriodizationDraft) {
  return Boolean(
    draft.periodStart.trim()
      || draft.periodEnd.trim()
      || draft.continuities.trim()
      || draft.changes.trim()
      || draft.turningPoint.trim()
      || draft.beforeAfterEvidence.trim()
      || draft.periodLabel.trim()
      || draft.alternativePeriodization.trim()
      || draft.missingEvidence.trim()
      || draft.confidence !== 'uncertain'
      || draft.selectedEvidenceIds.length,
  )
}

function getActivePeriodizationDrafts(periodizationDraftState: PeriodizationDraftState) {
  return Object.entries(periodizationDraftState).filter(([, draft]) => hasPeriodizationDraftActivity(draft))
}



function getEmptySignificanceDraft(): SignificanceDraft {
  return {
    eventOrProcess: '',
    whoItMatteredTo: '',
    contemporarySignificance: '',
    longTermSignificance: '',
    scaleOfImpact: '',
    contestedMeaning: '',
    sourceLimits: '',
    significanceClaim: '',
    selectedEvidenceIds: [],
    confidence: 'uncertain',
  }
}

function hasSignificanceDraftActivity(draft: SignificanceDraft) {
  return Boolean(
    draft.eventOrProcess.trim()
      || draft.whoItMatteredTo.trim()
      || draft.contemporarySignificance.trim()
      || draft.longTermSignificance.trim()
      || draft.scaleOfImpact.trim()
      || draft.contestedMeaning.trim()
      || draft.sourceLimits.trim()
      || draft.significanceClaim.trim()
      || draft.confidence !== 'uncertain'
      || draft.selectedEvidenceIds.length,
  )
}

function getActiveSignificanceDrafts(significanceDraftState: SignificanceDraftState) {
  return Object.entries(significanceDraftState).filter(([, draft]) => hasSignificanceDraftActivity(draft))
}

function getEmptySynthesisDraft(preset?: SynthesisInquiryPreset): SynthesisDraft {
  return {
    drivingQuestion: preset?.drivingQuestion ?? '',
    workingThesis: '',
    claimScope: preset?.claimScope ?? '',
    evidenceIds: [],
    reasoningBridge: '',
    counterargument: '',
    sourceLimits: '',
    paragraphPlan: preset?.paragraphFrame.map((item, index) => `${index + 1}. ${item}`).join('\n') ?? '',
    significanceLink: '',
    revisionChecklist: '□ 主张是否可争辩且范围清楚？\n□ 每段是否至少连接一条证据和一句推理？\n□ 是否纳入反例、反驳或替代解释？\n□ 是否说明来源限制、沉默和信心等级？',
    confidence: 'uncertain',
  }
}

function hasSynthesisDraftActivity(draft: SynthesisDraft) {
  return Boolean(
    draft.drivingQuestion.trim()
      || draft.workingThesis.trim()
      || draft.claimScope.trim()
      || draft.evidenceIds.length
      || draft.reasoningBridge.trim()
      || draft.counterargument.trim()
      || draft.sourceLimits.trim()
      || draft.paragraphPlan.trim()
      || draft.significanceLink.trim()
      || draft.revisionChecklist.trim()
      || draft.confidence !== 'uncertain',
  )
}

function getActiveSynthesisDrafts(synthesisDraftState: SynthesisDraftState) {
  return Object.entries(synthesisDraftState).filter(([, draft]) => hasSynthesisDraftActivity(draft))
}


function getEmptyEvidenceCaseFileDraft(): EvidenceCaseFileDraft {
  return {
    sourceNotes: '',
    contextNotes: '',
    corroborationNotes: '',
    tensions: '',
    missingVoices: '',
    workingClaim: '',
    confidence: 'uncertain',
    completedTaskIds: [],
  }
}

function hasEvidenceCaseFileDraftActivity(draft: EvidenceCaseFileDraft) {
  return Boolean(
    draft.sourceNotes.trim()
      || draft.contextNotes.trim()
      || draft.corroborationNotes.trim()
      || draft.tensions.trim()
      || draft.missingVoices.trim()
      || draft.workingClaim.trim()
      || draft.confidence !== 'uncertain'
      || draft.completedTaskIds.length,
  )
}

function getActiveEvidenceCaseFileDrafts(caseFileDraftState: EvidenceCaseFileDraftState) {
  return Object.entries(caseFileDraftState).filter(([, draft]) => hasEvidenceCaseFileDraftActivity(draft))
}

function parseEvidenceCaseFileDraftState(rawState: string | null): EvidenceCaseFileDraftState {
  try {
    const parsedState = rawState ? JSON.parse(rawState) : {}

    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return {} as EvidenceCaseFileDraftState
    }

    return Object.fromEntries(
      Object.entries(parsedState).flatMap(([key, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          return []
        }

        const draft = value as Partial<EvidenceCaseFileDraft>
        const completedTaskIds = Array.isArray(draft.completedTaskIds)
          ? draft.completedTaskIds.filter((item): item is string => typeof item === 'string')
          : []
        const confidence = draft.confidence && draft.confidence in evidenceCaseConfidenceLabels
          ? draft.confidence
          : 'uncertain'

        return [[
          key,
          {
            sourceNotes: typeof draft.sourceNotes === 'string' ? draft.sourceNotes : '',
            contextNotes: typeof draft.contextNotes === 'string' ? draft.contextNotes : '',
            corroborationNotes: typeof draft.corroborationNotes === 'string' ? draft.corroborationNotes : '',
            tensions: typeof draft.tensions === 'string' ? draft.tensions : '',
            missingVoices: typeof draft.missingVoices === 'string' ? draft.missingVoices : '',
            workingClaim: typeof draft.workingClaim === 'string' ? draft.workingClaim : '',
            confidence,
            completedTaskIds,
            updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : undefined,
          } satisfies EvidenceCaseFileDraft,
        ]]
      }),
    )
  } catch {
    return {} as EvidenceCaseFileDraftState
  }
}

function loadEvidenceCaseFileDraftState() {
  const localStorage = getSafeStorage('localStorage')
  const sessionStorage = getSafeStorage('sessionStorage')
  const localState = parseEvidenceCaseFileDraftState(localStorage?.getItem(evidenceCaseFileStorageKey) ?? null)

  if (Object.values(localState).some(hasEvidenceCaseFileDraftActivity)) {
    return localState
  }

  return parseEvidenceCaseFileDraftState(sessionStorage?.getItem(evidenceCaseFileStorageKey) ?? null)
}

function persistEvidenceCaseFileDraftState(state: EvidenceCaseFileDraftState) {
  const serializedState = JSON.stringify(state)
  const localStorage = getSafeStorage('localStorage')

  if (localStorage) {
    localStorage.setItem(evidenceCaseFileStorageKey, serializedState)
    return
  }

  getSafeStorage('sessionStorage')?.setItem(evidenceCaseFileStorageKey, serializedState)
}

function getEvidenceCaseFileProgress(caseFile: EvidenceCaseFile, draft: EvidenceCaseFileDraft) {
  return caseFile.taskChecklist.length ? Math.round((draft.completedTaskIds.length / caseFile.taskChecklist.length) * 100) : 0
}

function matchEvidenceCaseTerms(text: string, terms: string[]) {
  const normalizedText = text.toLowerCase()
  return terms.some((term) => normalizedText.includes(term.toLowerCase()))
}

function scoreEvidenceCasePacketItem(text: string, terms: string[]) {
  const normalizedText = text.toLowerCase()
  return terms.reduce((score, term) => score + (normalizedText.includes(term.toLowerCase()) ? 1 : 0), 0)
}

function buildEvidenceCasePacket(caseFile: EvidenceCaseFile): EvidenceCasePacket {
  const caseScenarios = caseFile.scenarioIds.map((id) => getScenarioById(id)).filter((scenario): scenario is Scenario => Boolean(scenario))

  function sortByScore<T extends EvidenceCasePacketItem>(items: T[]) {
    return [...items].sort((first, second) => scoreEvidenceCasePacketItem(second.text + second.title + second.tags.join(' '), caseFile.selectorTerms) - scoreEvidenceCasePacketItem(first.text + first.title + first.tags.join(' '), caseFile.selectorTerms))
  }

  const sources = sortByScore(caseScenarios.flatMap((scenario) => scenario.sources.map((source, index) => ({
    id: `${caseFile.id}:${scenario.id}:source:${index}`,
    scenario,
    sourceType: 'source' as const,
    title: source.title,
    text: `${source.excerpt}｜视角：${source.perspective}｜可靠边界：${source.reliabilityNote}｜追问：${source.sourceQuestion}`,
    label: sourceTypeLabels[source.sourceType],
    tags: [source.creator, sourceTypeLabels[source.sourceType], ...source.evidenceTags],
  } satisfies EvidenceCasePacketItem)))).filter((entry) => matchEvidenceCaseTerms([entry.title, entry.text, ...entry.tags].join(' '), caseFile.selectorTerms)).slice(0, 8)

  const sceneBeats = sortByScore(caseScenarios.flatMap((scenario) => scenario.sceneBeats.map((beat, index) => ({
    id: `${caseFile.id}:${scenario.id}:scene:${index}`,
    scenario,
    sourceType: 'scene-beat' as const,
    title: beat.title,
    text: `${beat.timeLabel}｜${beat.historicalTension}｜${beat.evidenceHook}｜追问：${beat.learnerPrompt}`,
    label: 'Scene beat',
    tags: [...beat.linkedDailyLifeKeys, ...beat.linkedSourceTitles],
  } satisfies EvidenceCasePacketItem)))).slice(0, 8)

  const decisions = sortByScore(caseScenarios.flatMap((scenario) => [
    { id: `${caseFile.id}:${scenario.id}:decision:context`, scenario, sourceType: 'decision' as const, title: scenario.decision.prompt, text: scenario.decision.context, label: 'Decision context', tags: ['decision', scenario.theme, scenario.region] } satisfies EvidenceCasePacketItem,
    ...scenario.decision.options.slice(0, 2).map((option) => ({ id: `${caseFile.id}:${scenario.id}:decision:${option.id}`, scenario, sourceType: 'decision' as const, title: option.label, text: `${option.stance}：${option.description}｜短期：${option.immediate}｜长期：${option.longTerm}`, label: 'Decision option', tags: ['decision', option.stance, scenario.theme] } satisfies EvidenceCasePacketItem)),
  ])).slice(0, 7)

  const timelines = sortByScore(caseScenarios.flatMap((scenario) => scenario.timeline.slice(0, 3).map((event, index) => ({
    id: `${caseFile.id}:${scenario.id}:timeline:${index}`,
    scenario,
    sourceType: 'timeline' as const,
    title: event.title,
    text: `${event.year}｜${event.text}`,
    label: 'Timeline',
    tags: ['timeline', String(event.year), scenario.era, scenario.region],
  } satisfies EvidenceCasePacketItem)))).slice(0, 8)

  return { sources, sceneBeats, decisions, timelines }
}

function formatEvidenceCaseFileBrief(caseFile: EvidenceCaseFile, draft: EvidenceCaseFileDraft, packet: EvidenceCasePacket) {
  const packetItems = [...packet.sources, ...packet.sceneBeats, ...packet.decisions, ...packet.timelines]
  const completedTasks = caseFile.taskChecklist.filter((_, index) => draft.completedTaskIds.includes(`task:${index}`))

  return [
    'TimeAtlas Evidence Case Files / Archive Quests 1.0',
    `生成时间：${new Date().toLocaleString()}`,
    `Case File：${caseFile.title}｜${caseFile.subtitle}`,
    `核心问题：${caseFile.drivingQuestion}`,
    `场景：${caseFile.scenarioIds.map((id) => getScenarioById(id)?.title ?? id).join(' × ')}`,
    `Skills：${caseFile.skills.join(' → ')}`,
    `进度：${completedTasks.length}/${caseFile.taskChecklist.length} tasks`,
    '',
    '一、Evidence packet / 证据包',
    ...packetItems.slice(0, 14).map((entry, index) => `${index + 1}. ${entry.scenario.title}｜${entry.label}｜${entry.title}\n   ${entry.text}\n   标签：${entry.tags.slice(0, 8).join('、') || '无'}`),
    '',
    '二、Skill ladder / 方法阶梯',
    ...caseFile.skills.map((skill, index) => `${index + 1}. ${skill}：用证据说明来源、情境、互证、张力或沉默，而不是只摘录信息。`),
    '',
    '三、Task checklist / 任务清单',
    ...caseFile.taskChecklist.map((task, index) => `- [${draft.completedTaskIds.includes(`task:${index}`) ? 'x' : ' '}] ${task}`),
    '',
    '四、Draft / 草稿',
    `Source notes：${draft.sourceNotes.trim() || '尚未填写'}`,
    `Context notes：${draft.contextNotes.trim() || '尚未填写'}`,
    `Corroboration notes：${draft.corroborationNotes.trim() || '尚未填写'}`,
    `Tensions：${draft.tensions.trim() || '尚未填写'}`,
    `Missing voices：${draft.missingVoices.trim() || '尚未填写'}`,
    `Working claim：${draft.workingClaim.trim() || caseFile.suggestedClaimFrame}`,
    `Confidence：${evidenceCaseConfidenceLabels[draft.confidence]}`,
    `更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
  ].join('\n')
}

function formatEvidenceCaseFileTaskSheet(caseFile: EvidenceCaseFile) {
  const packet = buildEvidenceCasePacket(caseFile)
  return [
    `TimeAtlas Evidence Case File Assignment：${caseFile.title}`,
    `核心问题：${caseFile.drivingQuestion}`,
    `场景：${caseFile.scenarioIds.map((id) => getScenarioById(id)?.title ?? id).join(' × ')}`,
    `Skills：${caseFile.skills.join(' → ')}`,
    '',
    '任务：打开 Evidence Case Files，阅读 evidence packet，完成 checklist，并写出带来源限制的 working claim。',
    '',
    'Checklist：',
    ...caseFile.taskChecklist.map((item) => `- ${item}`),
    '',
    '证据起点：',
    ...[...packet.sources, ...packet.sceneBeats].slice(0, 6).map((entry) => `- ${entry.scenario.title}｜${entry.label}｜${entry.title}：${entry.text}`),
    '',
    '交付物：一份 Evidence Case File Brief，包含 source/context/corroboration notes、tensions、missing voices、working claim 与 confidence。',
  ].join('\n')
}

function inferSignificanceDailyLifeKeys(inquiry: SignificanceInquiry): DailyLifeKey[] {
  if (inquiry.id.includes('knowledge')) {
    return ['education', 'work', 'freedoms', 'risks']
  }

  if (inquiry.id.includes('commodity')) {
    return ['work', 'risks', 'home', 'freedoms']
  }

  if (inquiry.id.includes('crisis')) {
    return ['risks', 'home', 'work', 'freedoms']
  }

  if (inquiry.id.includes('market')) {
    return ['work', 'freedoms', 'risks', 'education']
  }

  return ['work', 'risks', 'home', 'education']
}

function getSignificanceEvidenceLabel(inquiry: SignificanceInquiry, sourceType: SignificanceEvidence['sourceType'], text: string): SignificanceEvidenceLabel {
  const normalizedText = `${inquiry.id} ${inquiry.tags.join(' ')} ${text}`.toLowerCase()

  if (sourceType === 'source' || sourceType === 'source-evidence-use' || sourceType === 'interpretation-note' || normalizedText.includes('archive') || normalizedText.includes('source') || normalizedText.includes('档案') || normalizedText.includes('来源') || normalizedText.includes('沉默')) {
    return 'memory-archive'
  }

  if (sourceType === 'real-history' || normalizedText.includes('long') || normalizedText.includes('legacy') || normalizedText.includes('长期') || normalizedText.includes('遗产') || normalizedText.includes('后来')) {
    return 'long-term-change'
  }

  if (normalizedText.includes('empire') || normalizedText.includes('global') || normalizedText.includes('region') || normalizedText.includes('commodity') || normalizedText.includes('帝国') || normalizedText.includes('全球') || normalizedText.includes('区域') || normalizedText.includes('商品')) {
    return 'scale-reach'
  }

  if (sourceType === 'decision-option' || normalizedText.includes('contested') || normalizedText.includes('meaning') || normalizedText.includes('risk') || normalizedText.includes('争议') || normalizedText.includes('意义') || normalizedText.includes('风险')) {
    return 'contested-meaning'
  }

  if (sourceType === 'identity-summary' || sourceType === 'daily-life' || normalizedText.includes('ordinary') || normalizedText.includes('daily') || normalizedText.includes('普通') || normalizedText.includes('日常')) {
    return 'ordinary-life'
  }

  return 'immediate-impact'
}

function getSignificanceHint(label: SignificanceEvidenceLabel) {
  return {
    'immediate-impact': '说明当时谁受到影响，以及影响如何进入选择、身体、安全或生计。',
    'long-term-change': '连接后续制度、商品链、知识传播、社会变化或历史遗产。',
    'scale-reach': '判断影响范围：个人、社区、城市、区域、帝国、全球或跨时代。',
    'contested-meaning': '标出不同群体可能如何争论、纪念或否认这件事的重要性。',
    'memory-archive': '检查来源如何保存、过滤或沉默，从而改变意义判断。',
    'ordinary-life': '用普通生活证明历史意义不只属于精英、国家或战争大事件。',
  }[label]
}

function buildSignificanceEvidenceEntry(
  inquiry: SignificanceInquiry,
  scenario: Scenario,
  sourceType: SignificanceEvidence['sourceType'],
  idSuffix: string,
  title: string,
  text: string,
  tags: string[] = [],
): SignificanceEvidence {
  const label = getSignificanceEvidenceLabel(inquiry, sourceType, text)

  return {
    id: `${inquiry.id}:${scenario.id}:${idSuffix}`,
    inquiryId: inquiry.id,
    scenario,
    label,
    sourceType,
    title,
    text,
    significanceHint: getSignificanceHint(label),
    tags: [...new Set([scenario.era, scenario.location, scenario.region, scenario.theme, ...tags])],
  }
}

function buildSignificanceEvidenceForInquiry(inquiry: SignificanceInquiry): SignificanceEvidence[] {
  const preferredDailyLifeKeys = inferSignificanceDailyLifeKeys(inquiry)

  return inquiry.scenarioIds.flatMap((scenarioId) => {
    const scenario = getScenarioById(scenarioId)

    if (!scenario) {
      return []
    }

    const identityEvidence = buildSignificanceEvidenceEntry(
      inquiry,
      scenario,
      'identity-summary',
      'identity-summary',
      scenario.identity,
      scenario.summary,
      [scenario.identity],
    )
    const timelineEvidence = scenario.timeline.slice(0, 3).map((event, index) => buildSignificanceEvidenceEntry(
      inquiry,
      scenario,
      'timeline',
      `timeline:${index}`,
      event.title,
      `${event.year}｜${event.text}`,
      ['timeline', event.year],
    ))
    const dailyLifeEvidence = scenario.dailyLife
      .filter((section) => preferredDailyLifeKeys.includes(section.key))
      .slice(0, 3)
      .map((section) => buildSignificanceEvidenceEntry(
        inquiry,
        scenario,
        'daily-life',
        `daily:${section.key}`,
        `${section.label}：${section.title}`,
        section.text,
        [section.label, section.key],
      ))
    const sceneBeatEvidence = scenario.sceneBeats.slice(0, 3).map((beat, index) => buildSignificanceEvidenceEntry(
      inquiry,
      scenario,
      'scene-beat',
      `scene:${index}`,
      beat.title,
      `${beat.timeLabel}｜${beat.historicalTension}｜${beat.evidenceHook}｜追问：${beat.learnerPrompt}`,
      [...beat.linkedDailyLifeKeys, ...beat.linkedSourceTitles.slice(0, 2)],
    ))
    const decisionContext = buildSignificanceEvidenceEntry(
      inquiry,
      scenario,
      'decision-context',
      'decision:context',
      scenario.decision.prompt,
      scenario.decision.context,
      ['decision context'],
    )
    const decisionOptions = scenario.decision.options.slice(0, 3).map((option) => buildSignificanceEvidenceEntry(
      inquiry,
      scenario,
      'decision-option',
      `option:${option.id}`,
      option.label,
      `${option.stance}：${option.description}｜短期：${option.immediate}｜长期：${option.longTerm}`,
      ['decision option', option.stance],
    ))
    const sourceEvidence = scenario.sources.slice(0, 3).map((source, index) => buildSignificanceEvidenceEntry(
      inquiry,
      scenario,
      'source',
      `source:${index}`,
      source.title,
      `${source.excerpt}｜视角：${source.perspective}｜可靠边界：${source.reliabilityNote}｜史料追问：${source.sourceQuestion}`,
      [sourceTypeLabels[source.sourceType], ...source.evidenceTags],
    ))
    const realHistoryEvidence = buildSignificanceEvidenceEntry(
      inquiry,
      scenario,
      'real-history',
      'real-history',
      '真实历史走向',
      scenario.realHistory,
      ['realHistory'],
    )
    const interpretationEvidence = buildSignificanceEvidenceEntry(
      inquiry,
      scenario,
      'interpretation-note',
      'interpretation-note',
      'interpretation note / 解释提示',
      scenario.interpretationNote,
      ['interpretationNote'],
    )
    const sourceUseEvidence = buildSignificanceEvidenceEntry(
      inquiry,
      scenario,
      'source-evidence-use',
      'source-evidence-use',
      'source evidence use / 来源使用边界',
      scenario.sourceEvidenceUse,
      ['sourceEvidenceUse'],
    )

    return [
      identityEvidence,
      ...timelineEvidence,
      ...dailyLifeEvidence,
      ...sceneBeatEvidence,
      decisionContext,
      ...decisionOptions,
      ...sourceEvidence,
      realHistoryEvidence,
      interpretationEvidence,
      sourceUseEvidence,
    ]
  })
}

function getSignificanceInquiryEvidenceMap() {
  return Object.fromEntries(
    significanceInquiryDefinitions.map((inquiry) => [inquiry.id, buildSignificanceEvidenceForInquiry(inquiry)]),
  ) as Record<string, SignificanceEvidence[]>
}

function formatSignificanceBrief(inquiry: SignificanceInquiry, evidence: SignificanceEvidence[], draft: SignificanceDraft) {
  const selectedEvidence = draft.selectedEvidenceIds
    .map((id) => evidence.find((entry) => entry.id === id))
    .filter((entry): entry is SignificanceEvidence => Boolean(entry))
  const evidenceForExport = selectedEvidence.length ? selectedEvidence : evidence.slice(0, 10)

  return [
    'TimeAtlas Significance & Memory Lab / 历史意义与记忆工作台 1.0',
    `生成时间：${new Date().toLocaleString()}`,
    `探究：${inquiry.title}｜${inquiry.subtitle}`,
    `核心问题：${inquiry.drivingQuestion}`,
    `分析焦点：${inquiry.focus}`,
    `记忆框架：${inquiry.memoryFrame}`,
    '',
    '一、Significance criteria ladder / 意义标准梯',
    ...significanceCriteriaLadder.map((step, index) => `${index + 1}. ${step.title}：${step.prompt}`),
    '',
    '二、已选证据',
    ...evidenceForExport.map((entry, index) => `${index + 1}. ${entry.scenario.title}｜${significanceEvidenceLabelText[entry.label]}｜${entry.title}
   ${entry.text}
   意义用途：${entry.significanceHint}
   标签：${entry.tags.join('、') || '无'}`),
    '',
    '三、历史意义与记忆草稿',
    `事件/过程：${draft.eventOrProcess.trim() || '尚未填写'}`,
    `对谁重要：${draft.whoItMatteredTo.trim() || '尚未填写'}`,
    `当时意义：${draft.contemporarySignificance.trim() || '尚未填写'}`,
    `长期意义：${draft.longTermSignificance.trim() || '尚未填写'}`,
    `影响尺度：${draft.scaleOfImpact.trim() || '尚未填写'}`,
    `争议意义：${draft.contestedMeaning.trim() || '尚未填写'}`,
    `来源限制：${draft.sourceLimits.trim() || '尚未填写'}`,
    `意义主张：${draft.significanceClaim.trim() || '尚未填写'}`,
    `信心等级：${significanceConfidenceLabels[draft.confidence]}`,
    `更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
  ].join('\n')
}

function formatSignificanceTaskSheet(inquiry: SignificanceInquiry) {
  const evidence = buildSignificanceEvidenceForInquiry(inquiry).slice(0, 10)

  return [
    `TimeAtlas Significance & Memory Lab Assignment：${inquiry.title}`,
    `核心问题：${inquiry.drivingQuestion}`,
    `分析焦点：${inquiry.focus}`,
    `建议场景：${inquiry.scenarioIds.map((id) => getScenarioById(id)?.title).filter(Boolean).join(' × ')}`,
    '',
    '任务：用事件/过程、对谁重要、当时意义、长期意义、影响尺度、争议意义、来源限制和意义主张组织一份 Significance Brief。',
    '',
    '意义标准梯：',
    ...significanceCriteriaLadder.map((step) => `- ${step.title}：${step.prompt}`),
    '',
    '建议证据起点：',
    ...evidence.map((entry) => `- ${entry.scenario.title}｜${significanceEvidenceLabelText[entry.label]}｜${entry.title}：${entry.text}`),
    '',
    `交付物：一份历史意义与记忆简报，必须点名至少 4 条证据，并说明一个 archive/memory limitation。`,
  ].join('\n')
}

function inferContextDailyLifeKeys(inquiry: ContextInquiry): DailyLifeKey[] {
  if (inquiry.id.includes('knowledge')) {
    return ['education', 'work', 'freedoms', 'risks']
  }

  if (inquiry.id.includes('commodity')) {
    return ['work', 'risks', 'home', 'freedoms']
  }

  if (inquiry.id.includes('crisis')) {
    return ['risks', 'home', 'work', 'freedoms']
  }

  if (inquiry.id.includes('monsoon') || inquiry.id.includes('city')) {
    return ['work', 'freedoms', 'risks', 'education']
  }

  return ['work', 'risks', 'education', 'freedoms']
}

function getContextEvidenceLabel(inquiry: ContextInquiry, sourceType: ContextEvidence['sourceType'], text: string): ContextEvidenceLabel {
  const normalizedText = `${inquiry.id} ${inquiry.tags.join(' ')} ${text}`.toLowerCase()

  if (sourceType === 'source' || sourceType === 'source-evidence-use') {
    return 'source-context'
  }

  if (sourceType === 'real-history' || normalizedText.includes('empire') || normalizedText.includes('global') || normalizedText.includes('colonial') || normalizedText.includes('帝国') || normalizedText.includes('殖民') || normalizedText.includes('全球')) {
    return 'imperial-global'
  }

  if (normalizedText.includes('monsoon') || normalizedText.includes('port') || normalizedText.includes('route') || normalizedText.includes('regional') || normalizedText.includes('季风') || normalizedText.includes('港') || normalizedText.includes('区域') || normalizedText.includes('路线')) {
    return 'regional'
  }

  if (sourceType === 'decision-option' || normalizedText.includes('risk') || normalizedText.includes('后见') || normalizedText.includes('当下') || normalizedText.includes('presentism')) {
    return 'presentism-risk'
  }

  return 'local'
}

function getContextScaleHint(label: ContextEvidenceLabel) {
  return {
    local: '定位地方现场：谁在什么地点、制度和日常压力下行动？',
    regional: '连接区域网络：路线、季节、港口、市场或城市腹地如何扩大处境？',
    'imperial-global': '上推大尺度力量：帝国规则、殖民、战争或商品链怎样进入地方？',
    'source-context': '追问来源情境：谁记录、谁保存、谁不可见？',
    'presentism-risk': '警惕当下主义：哪些后见之明或现代概念需要被标出？',
  }[label]
}

function buildContextEvidenceEntry(
  inquiry: ContextInquiry,
  scenario: Scenario,
  sourceType: ContextEvidence['sourceType'],
  idSuffix: string,
  title: string,
  text: string,
  tags: string[] = [],
): ContextEvidence {
  const label = getContextEvidenceLabel(inquiry, sourceType, text)

  return {
    id: `${inquiry.id}:${scenario.id}:${idSuffix}`,
    inquiryId: inquiry.id,
    scenario,
    label,
    sourceType,
    title,
    text,
    scaleHint: getContextScaleHint(label),
    tags: [...new Set([scenario.era, scenario.location, scenario.region, ...tags])],
  }
}

function buildContextEvidenceForInquiry(inquiry: ContextInquiry): ContextEvidence[] {
  const preferredDailyLifeKeys = inferContextDailyLifeKeys(inquiry)

  return inquiry.scenarioIds.flatMap((scenarioId) => {
    const scenario = getScenarioById(scenarioId)

    if (!scenario) {
      return []
    }

    const scenarioContext = buildContextEvidenceEntry(
      inquiry,
      scenario,
      'scenario-context',
      'scenario-context',
      `${scenario.year} · ${scenario.era} · ${scenario.location}`,
      `${scenario.identity} / ${scenario.role}｜${scenario.summary}`,
      [scenario.theme, scenario.identity, scenario.role],
    )
    const timelineEvidence = scenario.timeline.slice(0, 3).map((event, index) => buildContextEvidenceEntry(
      inquiry,
      scenario,
      'timeline',
      `timeline:${index}`,
      event.title,
      `${event.year}｜${event.text}`,
      ['timeline', event.year],
    ))
    const keyTermEvidence = scenario.keyTerms.slice(0, 2).map((term, index) => buildContextEvidenceEntry(
      inquiry,
      scenario,
      'key-term',
      `key-term:${index}`,
      term.term,
      term.definition,
      ['keyTerms', term.term],
    ))
    const dailyLifeEvidence = scenario.dailyLife
      .filter((section) => preferredDailyLifeKeys.includes(section.key))
      .slice(0, 3)
      .map((section) => buildContextEvidenceEntry(
        inquiry,
        scenario,
        'daily-life',
        `daily:${section.key}`,
        `${section.label}：${section.title}`,
        section.text,
        [section.label, section.key, scenario.theme],
      ))
    const sceneBeatEvidence = scenario.sceneBeats.slice(0, 3).map((beat, index) => buildContextEvidenceEntry(
      inquiry,
      scenario,
      'scene-beat',
      `scene:${index}`,
      beat.title,
      `${beat.timeLabel}｜${beat.historicalTension}｜${beat.evidenceHook}｜追问：${beat.learnerPrompt}`,
      [...beat.linkedDailyLifeKeys, ...beat.linkedSourceTitles.slice(0, 2)],
    ))
    const decisionContext = buildContextEvidenceEntry(
      inquiry,
      scenario,
      'decision-context',
      'decision:context',
      scenario.decision.prompt,
      scenario.decision.context,
      ['decision context', scenario.theme],
    )
    const decisionOptions = scenario.decision.options.slice(0, 2).map((option) => buildContextEvidenceEntry(
      inquiry,
      scenario,
      'decision-option',
      `option:${option.id}`,
      option.label,
      `${option.stance}：${option.description}｜短期：${option.immediate}｜长期：${option.longTerm}`,
      ['decision option', option.stance],
    ))
    const sourceEvidence = scenario.sources.slice(0, 3).map((source, index) => buildContextEvidenceEntry(
      inquiry,
      scenario,
      'source',
      `source:${index}`,
      source.title,
      `${source.excerpt}｜视角：${source.perspective}｜可靠边界：${source.reliabilityNote}｜史料追问：${source.sourceQuestion}`,
      [sourceTypeLabels[source.sourceType], ...source.evidenceTags],
    ))
    const realHistoryEvidence = buildContextEvidenceEntry(
      inquiry,
      scenario,
      'real-history',
      'real-history',
      '真实历史走向',
      scenario.realHistory,
      ['realHistory', scenario.theme],
    )
    const sourceUseEvidence = buildContextEvidenceEntry(
      inquiry,
      scenario,
      'source-evidence-use',
      'source-evidence-use',
      'source evidence use / 来源使用边界',
      scenario.sourceEvidenceUse,
      ['sourceEvidenceUse', scenario.theme],
    )

    return [
      scenarioContext,
      ...timelineEvidence,
      ...keyTermEvidence,
      ...dailyLifeEvidence,
      ...sceneBeatEvidence,
      decisionContext,
      ...decisionOptions,
      ...sourceEvidence,
      realHistoryEvidence,
      sourceUseEvidence,
    ]
  })
}

function getContextInquiryEvidenceMap() {
  return Object.fromEntries(
    contextInquiryDefinitions.map((inquiry) => [inquiry.id, buildContextEvidenceForInquiry(inquiry)]),
  ) as Record<string, ContextEvidence[]>
}

function formatContextBrief(inquiry: ContextInquiry, evidence: ContextEvidence[], draft: ContextDraft) {
  const selectedEvidence = draft.selectedEvidenceIds
    .map((id) => evidence.find((entry) => entry.id === id))
    .filter((entry): entry is ContextEvidence => Boolean(entry))
  const evidenceForExport = selectedEvidence.length ? selectedEvidence : evidence.slice(0, 10)

  return [
    'TimeAtlas Context & Scale Lab / 历史情境化与尺度工作台 1.0',
    `生成时间：${new Date().toLocaleString()}`,
    `探究：${inquiry.title}｜${inquiry.subtitle}`,
    `核心问题：${inquiry.drivingQuestion}`,
    `分析焦点：${inquiry.focus}`,
    `尺度框架：${inquiry.scaleFrame}`,
    '',
    '一、尺度梯',
    ...contextScaleLadder.map((step, index) => `${index + 1}. ${step.title}：${step.prompt}`),
    '',
    '二、已选证据',
    ...evidenceForExport.map((entry, index) => `${index + 1}. ${entry.scenario.title}｜${contextEvidenceLabelText[entry.label]}｜${entry.title}\n   ${entry.text}\n   尺度用途：${entry.scaleHint}\n   标签：${entry.tags.join('、') || '无'}`),
    '',
    '三、历史情境化草稿',
    `地方现场：${draft.localSetting.trim() || '尚未填写'}`,
    `区域连接：${draft.regionalConnections.trim() || '尚未填写'}`,
    `大尺度力量：${draft.largeScaleForces.trim() || '尚未填写'}`,
    `来源情境：${draft.sourceContext.trim() || '尚未填写'}`,
    `时代错置风险：${draft.anachronismRisk.trim() || '尚未填写'}`,
    `情境化判断：${draft.contextClaim.trim() || '尚未填写'}`,
    `缺失情境：${draft.missingContext.trim() || '尚未填写'}`,
    `信心等级：${contextConfidenceLabels[draft.confidence]}`,
    `更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
  ].join('\n')
}

function formatContextTaskSheet(inquiry: ContextInquiry) {
  const evidence = buildContextEvidenceForInquiry(inquiry).slice(0, 10)

  return [
    `TimeAtlas Context & Scale Lab Assignment：${inquiry.title}`,
    `核心问题：${inquiry.drivingQuestion}`,
    `分析焦点：${inquiry.focus}`,
    `建议场景：${inquiry.scenarioIds.map((id) => getScenarioById(id)?.title).filter(Boolean).join(' × ')}`,
    '',
    '任务：用地方现场、区域连接、大尺度力量、来源情境、时代错置风险、情境化判断与缺失情境组织一份 Context Brief。',
    '',
    '尺度梯：',
    ...contextScaleLadder.map((step) => `- ${step.title}：${step.prompt}`),
    '',
    '建议证据起点：',
    ...evidence.map((entry) => `- ${entry.scenario.title}｜${contextEvidenceLabelText[entry.label]}｜${entry.title}：${entry.text}`),
    '',
    `交付物：一份历史情境化简报，必须点名至少 4 条证据，并说明一个 presentism-risk / 时代错置风险。`,
  ].join('\n')
}

function inferPerspectivesDailyLifeKeys(inquiry: PerspectivesInquiry): DailyLifeKey[] {
  if (inquiry.id.includes('knowledge')) {
    return ['education', 'work', 'freedoms', 'risks']
  }

  if (inquiry.id.includes('labor')) {
    return ['work', 'risks', 'home', 'freedoms']
  }

  if (inquiry.id.includes('market')) {
    return ['work', 'freedoms', 'risks', 'education']
  }

  if (inquiry.id.includes('safety') || inquiry.id.includes('choice')) {
    return ['risks', 'home', 'work', 'freedoms']
  }

  return ['work', 'risks', 'freedoms', 'education']
}

function buildPerspectivesEvidenceForInquiry(inquiry: PerspectivesInquiry): PerspectivesEvidence[] {
  const preferredDailyLifeKeys = inferPerspectivesDailyLifeKeys(inquiry)

  return inquiry.scenarioIds.flatMap((scenarioId) => {
    const scenario = getScenarioById(scenarioId)

    if (!scenario) {
      return []
    }

    const identityEvidence: PerspectivesEvidence = {
      id: `${inquiry.id}:${scenario.id}:identity-role-summary`,
      inquiryId: inquiry.id,
      scenario,
      label: 'actor position',
      sourceType: 'identity-role-summary',
      title: `${scenario.identity} / ${scenario.role}`,
      text: `${scenario.summary}`,
      tags: [scenario.region, scenario.theme, scenario.identity, scenario.role],
    }
    const dailyLifeEvidence = scenario.dailyLife
      .filter((section) => preferredDailyLifeKeys.includes(section.key))
      .slice(0, 3)
      .map((section): PerspectivesEvidence => ({
        id: `${inquiry.id}:${scenario.id}:daily:${section.key}`,
        inquiryId: inquiry.id,
        scenario,
        label: section.key === 'risks' ? 'risk/stake' : section.key === 'freedoms' ? 'constraint' : 'actor position',
        sourceType: 'daily-life',
        title: `${section.label}：${section.title}`,
        text: section.text,
        tags: [section.label, section.key, scenario.theme],
      }))
    const sceneBeatEvidence = scenario.sceneBeats.slice(0, 3).map((beat, index): PerspectivesEvidence => ({
      id: `${inquiry.id}:${scenario.id}:scene:${index}`,
      inquiryId: inquiry.id,
      scenario,
      label: inquiry.id.includes('safety') || inquiry.id.includes('labor') ? 'risk/stake' : 'knowledge limit',
      sourceType: 'scene-beat',
      title: beat.title,
      text: `${beat.timeLabel}｜${beat.historicalTension}｜${beat.evidenceHook}｜追问：${beat.learnerPrompt}`,
      tags: [...beat.linkedDailyLifeKeys, ...beat.linkedSourceTitles.slice(0, 2)],
    }))
    const decisionContext: PerspectivesEvidence = {
      id: `${inquiry.id}:${scenario.id}:decision:context`,
      inquiryId: inquiry.id,
      scenario,
      label: 'constraint',
      sourceType: 'decision-context',
      title: scenario.decision.prompt,
      text: scenario.decision.context,
      tags: ['decision context', scenario.theme],
    }
    const decisionOptions = scenario.decision.options.slice(0, 3).map((option): PerspectivesEvidence => ({
      id: `${inquiry.id}:${scenario.id}:option:${option.id}`,
      inquiryId: inquiry.id,
      scenario,
      label: 'risk/stake',
      sourceType: 'decision-option',
      title: option.label,
      text: `${option.stance}：${option.description}｜短期：${option.immediate}｜长期：${option.longTerm}`,
      tags: ['decision option', option.stance],
    }))
    const sourcePerspectiveEvidence = scenario.sources.slice(0, 3).map((source, index): PerspectivesEvidence => ({
      id: `${inquiry.id}:${scenario.id}:source:${index}`,
      inquiryId: inquiry.id,
      scenario,
      label: inquiry.id.includes('who-speaks') || source.reliabilityNote.includes('缺') || source.reliabilityNote.toLowerCase().includes('missing') ? 'absent voice' : 'source perspective',
      sourceType: 'source',
      title: source.title,
      text: `${source.excerpt}`,
      sourcePerspective: source.perspective,
      sourceReliability: source.reliabilityNote,
      sourceQuestion: source.sourceQuestion,
      tags: source.evidenceTags,
    }))
    const sourceUseEvidence: PerspectivesEvidence = {
      id: `${inquiry.id}:${scenario.id}:source-evidence-use`,
      inquiryId: inquiry.id,
      scenario,
      label: 'knowledge limit',
      sourceType: 'source-evidence-use',
      title: 'source evidence use / 来源使用边界',
      text: scenario.sourceEvidenceUse,
      tags: ['sourceEvidenceUse', scenario.theme],
    }

    return [identityEvidence, ...dailyLifeEvidence, ...sceneBeatEvidence, decisionContext, ...decisionOptions, ...sourcePerspectiveEvidence, sourceUseEvidence]
  })
}

function getPerspectivesInquiryEvidenceMap() {
  return Object.fromEntries(
    perspectivesInquiryDefinitions.map((inquiry) => [inquiry.id, buildPerspectivesEvidenceForInquiry(inquiry)]),
  ) as Record<string, PerspectivesEvidence[]>
}

function formatPerspectivesBrief(inquiry: PerspectivesInquiry, evidence: PerspectivesEvidence[], draft: PerspectivesDraft) {
  const selectedEvidence = draft.selectedEvidenceIds
    .map((id) => evidence.find((entry) => entry.id === id))
    .filter((entry): entry is PerspectivesEvidence => Boolean(entry))
  const evidenceForExport = selectedEvidence.length ? selectedEvidence : evidence.slice(0, 10)

  return [
    'TimeAtlas Perspectives & Agency Lab / 多视角与历史能动性工作台 1.0',
    `生成时间：${new Date().toLocaleString()}`,
    `探究：${inquiry.title}｜${inquiry.subtitle}`,
    `核心问题：${inquiry.drivingQuestion}`,
    `分析焦点：${inquiry.focus}`,
    `能动性框架：${inquiry.agencyFrame}`,
    '',
    '一、已选证据',
    ...evidenceForExport.map((entry, index) => [
      `${index + 1}. ${entry.scenario.title}｜${perspectivesEvidenceLabelText[entry.label]}｜${entry.title}`,
      `   ${entry.text}`,
      entry.sourcePerspective ? `   来源视角：${entry.sourcePerspective}` : '',
      entry.sourceReliability ? `   可靠边界：${entry.sourceReliability}` : '',
      entry.sourceQuestion ? `   史料追问：${entry.sourceQuestion}` : '',
      `   标签：${entry.tags.join('、') || '无'}`,
    ].filter(Boolean).join('\n')),
    '',
    '二、反当下主义检查',
    ...perspectivesAntiPresentismChecklist.map((item, index) => `${index + 1}. ${item}`),
    '',
    '三、多视角与能动性草稿',
    `行动者视角：${draft.actorView.trim() || '尚未填写'}`,
    `约束条件：${draft.constraints.trim() || '尚未填写'}`,
    `可得知识：${draft.availableKnowledge.trim() || '尚未填写'}`,
    `利害与风险：${draft.stakesAndRisks.trim() || '尚未填写'}`,
    `能动性判断：${draft.agencyClaim.trim() || '尚未填写'}`,
    `反当下主义警示：${draft.presentismWarning.trim() || '尚未填写'}`,
    `来源视角限制：${draft.sourcePerspectiveLimits.trim() || '尚未填写'}`,
    `缺席声音：${draft.missingVoices.trim() || '尚未填写'}`,
    `信心等级：${perspectivesConfidenceLabels[draft.confidence]}`,
    `更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
  ].join('\n')
}

function formatPerspectivesTaskSheet(inquiry: PerspectivesInquiry) {
  const evidence = buildPerspectivesEvidenceForInquiry(inquiry).slice(0, 10)

  return [
    `TimeAtlas Perspectives & Agency Lab Assignment：${inquiry.title}`,
    `核心问题：${inquiry.drivingQuestion}`,
    `分析焦点：${inquiry.focus}`,
    `建议场景：${inquiry.scenarioIds.map((id) => getScenarioById(id)?.title).filter(Boolean).join(' × ')}`,
    '',
    '任务：用行动者视角、约束、可得知识、风险利害、能动性判断、反当下主义警示、来源视角限制和缺席声音组织一份多视角简报。',
    '',
    '反当下主义检查：',
    ...perspectivesAntiPresentismChecklist.map((item) => `- ${item}`),
    '',
    '建议证据起点：',
    ...evidence.map((entry) => `- ${entry.scenario.title}｜${perspectivesEvidenceLabelText[entry.label]}｜${entry.title}：${entry.text}`),
    '',
    `交付物：一份多视角与能动性简报，必须点名至少 4 条证据，并说明来源视角限制与缺席声音。`,
  ].join('\n')
}

function getTimelineYearValue(year: string, fallbackYear: number) {
  const match = year.match(/-?\d+/)

  return match ? Number(match[0]) : fallbackYear
}

function buildPeriodizationEvidenceForInquiry(inquiry: PeriodizationInquiry): PeriodizationEvidence[] {
  const evidence = inquiry.scenarioIds.flatMap((scenarioId) => {
    const scenario = getScenarioById(scenarioId)

    if (!scenario) {
      return []
    }

    const scenarioAnchor: PeriodizationEvidence = {
      id: `${inquiry.id}:${scenario.id}:scenario-year`,
      inquiryId: inquiry.id,
      scenario,
      year: scenario.year,
      sourceType: 'scenario-year',
      label: 'Scenario year',
      title: `${scenario.year} · ${scenario.title}`,
      text: `${scenario.summary}｜${scenario.atmosphere}`,
      evidenceHint: '用作分期时间锚点：这一身份所在年份能代表什么连续性或变化？',
    }
    const timelineEvidence = scenario.timeline.map((event, index): PeriodizationEvidence => ({
      id: `${inquiry.id}:${scenario.id}:timeline:${index}`,
      inquiryId: inquiry.id,
      scenario,
      year: getTimelineYearValue(event.year, scenario.year),
      sourceType: 'timeline',
      label: 'Timeline',
      title: event.title,
      text: `${event.year}｜${event.text}`,
      evidenceHint: '按年份排序，判断它是长期延续、加速变化还是候选转折点。',
    }))
    const sceneBeatEvidence = scenario.sceneBeats.slice(0, 2).map((beat, index): PeriodizationEvidence => ({
      id: `${inquiry.id}:${scenario.id}:scene:${index}`,
      inquiryId: inquiry.id,
      scenario,
      year: scenario.year,
      sourceType: 'scene-beat',
      label: 'Scene beat',
      title: beat.title,
      text: `${beat.timeLabel}｜${beat.historicalTension}｜${beat.evidenceHook}`,
      evidenceHint: '把日常张力放入“转折前/后”的生活经验对照。',
    }))
    const decisionContext: PeriodizationEvidence = {
      id: `${inquiry.id}:${scenario.id}:decision:context`,
      inquiryId: inquiry.id,
      scenario,
      year: scenario.year,
      sourceType: 'decision-context',
      label: 'Decision context',
      title: scenario.decision.prompt,
      text: scenario.decision.context,
      evidenceHint: '检验当时人的选择边界，避免只用宏观年份划分。',
    }
    const decisionOptions = scenario.decision.options.slice(0, 2).map((option): PeriodizationEvidence => ({
      id: `${inquiry.id}:${scenario.id}:option:${option.id}`,
      inquiryId: inquiry.id,
      scenario,
      year: scenario.year,
      sourceType: 'decision-option',
      label: 'Decision option',
      title: option.label,
      text: `${option.stance}：${option.description}｜短期：${option.immediate}｜长期：${option.longTerm}`,
      evidenceHint: '比较选择后果：转折点是否真的改变了行动空间？',
    }))
    const realHistoryEvidence: PeriodizationEvidence = {
      id: `${inquiry.id}:${scenario.id}:real-history`,
      inquiryId: inquiry.id,
      scenario,
      year: scenario.year,
      sourceType: 'real-history',
      label: 'Real history',
      title: '真实历史走向',
      text: scenario.realHistory,
      evidenceHint: '用后续历史检验分期标签是否过宽、过窄或遗漏反例。',
    }
    const sourceEvidence = scenario.sources.slice(0, 2).map((source, index): PeriodizationEvidence => ({
      id: `${inquiry.id}:${scenario.id}:source:${index}`,
      inquiryId: inquiry.id,
      scenario,
      year: scenario.year,
      sourceType: 'source',
      label: sourceTypeLabels[source.sourceType],
      title: source.title,
      text: `${source.excerpt}｜${source.perspective}｜${source.reliabilityNote}`,
      evidenceHint: '检查来源可见性：这条材料更容易证明延续、变化，还是档案限制？',
    }))

    return [scenarioAnchor, ...timelineEvidence, ...sceneBeatEvidence, decisionContext, ...decisionOptions, realHistoryEvidence, ...sourceEvidence]
  })

  return evidence.sort((first, second) => first.year - second.year || first.scenario.title.localeCompare(second.scenario.title, 'zh-Hans-CN') || first.label.localeCompare(second.label))
}

function getPeriodizationInquiryEvidenceMap() {
  return Object.fromEntries(
    periodizationInquiryDefinitions.map((inquiry) => [inquiry.id, buildPeriodizationEvidenceForInquiry(inquiry)]),
  ) as Record<string, PeriodizationEvidence[]>
}

function formatPeriodizationBrief(inquiry: PeriodizationInquiry, evidence: PeriodizationEvidence[], draft: PeriodizationDraft) {
  const selectedEvidence = draft.selectedEvidenceIds
    .map((id) => evidence.find((entry) => entry.id === id))
    .filter((entry): entry is PeriodizationEvidence => Boolean(entry))
  const evidenceForExport = selectedEvidence.length ? selectedEvidence : evidence.slice(0, 10)

  return [
    'TimeAtlas Continuity & Turning Points Lab / 历史连续性与分期工作台 1.0',
    `生成时间：${new Date().toLocaleString()}`,
    `探究：${inquiry.title}｜${inquiry.subtitle}`,
    `核心问题：${inquiry.drivingQuestion}`,
    `分析焦点：${inquiry.focus}`,
    `建议转折点：${inquiry.suggestedTurningPoint}`,
    '',
    '一、时间顺序证据',
    ...evidenceForExport.map((entry, index) => `${index + 1}. ${entry.year}｜${entry.scenario.title}｜${entry.label}｜${entry.title}\n   ${entry.text}\n   分期用途：${entry.evidenceHint}`),
    '',
    '二、分期草稿',
    `时期起点：${draft.periodStart.trim() || '尚未填写'}`,
    `时期终点：${draft.periodEnd.trim() || '尚未填写'}`,
    `连续性：${draft.continuities.trim() || '尚未填写'}`,
    `变化：${draft.changes.trim() || '尚未填写'}`,
    `转折点：${draft.turningPoint.trim() || '尚未填写'}`,
    `前后证据：${draft.beforeAfterEvidence.trim() || '尚未填写'}`,
    `分期标签：${draft.periodLabel.trim() || '尚未填写'}`,
    `替代分期：${draft.alternativePeriodization.trim() || '尚未填写'}`,
    `缺失证据：${draft.missingEvidence.trim() || '尚未填写'}`,
    `信心等级：${periodizationConfidenceLabels[draft.confidence]}`,
    `更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
  ].join('\n')
}

function formatPeriodizationTaskSheet(inquiry: PeriodizationInquiry) {
  const evidence = buildPeriodizationEvidenceForInquiry(inquiry).slice(0, 10)

  return [
    `TimeAtlas Periodization Lab Assignment：${inquiry.title}`,
    `核心问题：${inquiry.drivingQuestion}`,
    `分析焦点：${inquiry.focus}`,
    `建议场景：${inquiry.scenarioIds.map((id) => getScenarioById(id)?.title).filter(Boolean).join(' × ')}`,
    '',
    '任务：按年份整理证据，提出一个时期起点、终点和转折点；同时说明连续性、变化、前后证据、替代分期与缺失材料。',
    '',
    '建议证据起点：',
    ...evidence.map((entry) => `- ${entry.year}｜${entry.scenario.title}｜${entry.label}｜${entry.title}：${entry.text}`),
    '',
    `建议转折点：${inquiry.suggestedTurningPoint}`,
    `交付物：一份分期简报，必须点名至少 4 条证据，并说明信心等级与替代分期。`,
  ].join('\n')
}

function getEmptyCausationDraft(): CausationDraft {
  return {
    backgroundConditions: '',
    immediateTriggers: '',
    constraints: '',
    humanChoices: '',
    shortTermConsequences: '',
    longTermChange: '',
    contingency: '',
    missingEvidence: '',
    confidence: 'uncertain',
    selectedEvidenceIds: [],
  }
}

function hasCausationDraftActivity(draft: CausationDraft) {
  return Boolean(
    draft.backgroundConditions.trim()
      || draft.immediateTriggers.trim()
      || draft.constraints.trim()
      || draft.humanChoices.trim()
      || draft.shortTermConsequences.trim()
      || draft.longTermChange.trim()
      || draft.contingency.trim()
      || draft.missingEvidence.trim()
      || draft.confidence !== 'uncertain'
      || draft.selectedEvidenceIds.length,
  )
}

function getActiveCausationDrafts(causationDraftState: CausationDraftState) {
  return Object.entries(causationDraftState).filter(([, draft]) => hasCausationDraftActivity(draft))
}

function inferCauseCategories(text: string): CauseCategory[] {
  const normalizedText = text.toLowerCase()
  const categories: CauseCategory[] = []
  const checks: [CauseCategory, string[]][] = [
    ['economic', ['trade', 'market', 'credit', 'commodity', 'cotton', 'sugar', 'price', 'wage', 'factory', 'labor', '贸易', '市场', '信用', '商品', '棉', '糖', '工资', '工厂']],
    ['political-institutional', ['empire', 'law', 'state', 'institution', 'tax', 'regulation', 'war', 'colonial', '制度', '国家', '帝国', '法律', '税', '战争', '殖民', '规则']],
    ['environmental-geographic', ['port', 'monsoon', 'sea', 'river', 'route', 'harbor', 'geographic', 'season', '港', '季风', '海', '河', '路线', '地理', '季节']],
    ['social-labor', ['worker', 'labor', 'family', 'guild', 'enslaved', 'discipline', 'safety', 'migration', '劳动', '工人', '家庭', '被奴役', '纪律', '安全', '移民', '身份']],
    ['cultural-knowledge', ['knowledge', 'paper', 'manuscript', 'letter', 'school', 'education', 'language', 'archive', '知识', '纸', '手稿', '书信', '教育', '语言', '档案']],
    ['source-limitation', ['source', 'archive', 'silence', 'reliability', 'perspective', 'missing', '来源', '档案', '沉默', '可靠', '视角', '缺席', '限制']],
  ]

  checks.forEach(([category, keywords]) => {
    if (keywords.some((keyword) => normalizedText.includes(keyword))) {
      categories.push(category)
    }
  })

  return categories.length ? categories : ['economic']
}

function getEvidenceCategories(baseText: string, preferredCategories: CauseCategory[] = []) {
  return [...new Set([...inferCauseCategories(baseText), ...preferredCategories.slice(0, 2)])].slice(0, 4)
}

function buildCausationEvidenceForInquiry(inquiry: CausationInquiry): CausationEvidence[] {
  return inquiry.scenarioIds.flatMap((scenarioId) => {
    const scenario = getScenarioById(scenarioId)

    if (!scenario) {
      return []
    }

    const preferredCategories = inquiry.suggestedCategories
    const timelineEvidence = scenario.timeline.slice(0, 3).map((event, index) => {
      const text = `${event.year}｜${event.title}：${event.text}`

      return {
        id: `${inquiry.id}:${scenario.id}:timeline:${index}`,
        inquiryId: inquiry.id,
        scenario,
        sourceType: 'timeline' as const,
        label: 'Timeline',
        title: event.title,
        text,
        categories: getEvidenceCategories(text, preferredCategories),
      }
    })
    const decisionContext = {
      id: `${inquiry.id}:${scenario.id}:decision:context`,
      inquiryId: inquiry.id,
      scenario,
      sourceType: 'decision-context' as const,
      label: 'Decision context',
      title: scenario.decision.prompt,
      text: scenario.decision.context,
      categories: getEvidenceCategories(`${scenario.decision.prompt} ${scenario.decision.context}`, preferredCategories),
    }
    const decisionOptions = scenario.decision.options.slice(0, 2).map((option) => {
      const text = `${option.stance}：${option.description}｜短期：${option.immediate}｜长期：${option.longTerm}`

      return {
        id: `${inquiry.id}:${scenario.id}:option:${option.id}`,
        inquiryId: inquiry.id,
        scenario,
        sourceType: 'decision-option' as const,
        label: 'Decision option',
        title: option.label,
        text,
        categories: getEvidenceCategories(text, preferredCategories),
      }
    })
    const sceneBeats = scenario.sceneBeats.slice(0, 2).map((beat, index) => {
      const text = `${beat.timeLabel}｜${beat.historicalTension}｜${beat.evidenceHook}`

      return {
        id: `${inquiry.id}:${scenario.id}:scene:${index}`,
        inquiryId: inquiry.id,
        scenario,
        sourceType: 'scene-beat' as const,
        label: 'Scene beat',
        title: beat.title,
        text,
        categories: getEvidenceCategories(text, preferredCategories),
      }
    })
    const sources = scenario.sources.slice(0, 2).map((source, index) => {
      const text = `${source.excerpt}｜${source.perspective}｜${source.reliabilityNote}`

      return {
        id: `${inquiry.id}:${scenario.id}:source:${index}`,
        inquiryId: inquiry.id,
        scenario,
        sourceType: 'source' as const,
        label: sourceTypeLabels[source.sourceType],
        title: source.title,
        text,
        categories: getEvidenceCategories(`${text} ${source.evidenceTags.join(' ')}`, [...preferredCategories, 'source-limitation']),
      }
    })
    const relevantMissions = scenario.missions
      .filter((mission) => mission.taskType === '因果链' || mission.taskType === '史料判断' || mission.taskType === '比较分析' || mission.linkedSourceTitles.length > 0)
      .slice(0, 2)
      .map((mission) => {
        const text = `${mission.instruction}｜交付物：${mission.deliverable}｜证据：${mission.evidenceChecklist.slice(0, 3).join('；')}`

        return {
          id: `${inquiry.id}:${scenario.id}:mission:${mission.id}`,
          inquiryId: inquiry.id,
          scenario,
          sourceType: 'mission' as const,
          label: 'Mission',
          title: mission.title,
          text,
          categories: getEvidenceCategories(text, preferredCategories),
        }
      })

    return [decisionContext, ...timelineEvidence, ...decisionOptions, ...sceneBeats, ...sources, ...relevantMissions]
  })
}

function getCausationInquiryEvidenceMap() {
  return Object.fromEntries(
    causationInquiryDefinitions.map((inquiry) => [inquiry.id, buildCausationEvidenceForInquiry(inquiry)]),
  ) as Record<string, CausationEvidence[]>
}

function formatCausationBrief(inquiry: CausationInquiry, evidence: CausationEvidence[], draft: CausationDraft) {
  const selectedEvidence = draft.selectedEvidenceIds
    .map((id) => evidence.find((entry) => entry.id === id))
    .filter((entry): entry is CausationEvidence => Boolean(entry))
  const evidenceForExport = selectedEvidence.length ? selectedEvidence : evidence.slice(0, 8)

  return [
    'TimeAtlas Causation & Change Lab / 因果与历史变化工作台 1.0',
    `生成时间：${new Date().toLocaleString()}`,
    `探究：${inquiry.title}｜${inquiry.subtitle}`,
    `核心问题：${inquiry.drivingQuestion}`,
    `分析焦点：${inquiry.focus}`,
    '',
    '一、已选证据',
    ...evidenceForExport.map((entry, index) => `${index + 1}. ${entry.scenario.title}｜${entry.label}｜${entry.title}\n   ${entry.text}\n   原因类别：${entry.categories.map((category) => causeCategoryLabels[category]).join('、')}`),
    '',
    '二、因果草稿',
    `背景条件：${draft.backgroundConditions.trim() || '尚未填写'}`,
    `直接触发：${draft.immediateTriggers.trim() || '尚未填写'}`,
    `约束条件：${draft.constraints.trim() || '尚未填写'}`,
    `人的选择：${draft.humanChoices.trim() || '尚未填写'}`,
    `短期后果：${draft.shortTermConsequences.trim() || '尚未填写'}`,
    `长期变化：${draft.longTermChange.trim() || '尚未填写'}`,
    `偶然性 / 反事实：${draft.contingency.trim() || '尚未填写'}`,
    `缺失证据：${draft.missingEvidence.trim() || '尚未填写'}`,
    `信心等级：${causationConfidenceLabels[draft.confidence]}`,
    `更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
  ].join('\n')
}

function formatCausationTaskSheet(inquiry: CausationInquiry) {
  const evidence = buildCausationEvidenceForInquiry(inquiry).slice(0, 8)

  return [
    `TimeAtlas Causation Lab Assignment：${inquiry.title}`,
    `核心问题：${inquiry.drivingQuestion}`,
    `分析焦点：${inquiry.focus}`,
    `建议场景：${inquiry.scenarioIds.map((id) => getScenarioById(id)?.title).filter(Boolean).join(' × ')}`,
    '',
    '任务：用背景条件、直接触发、约束、人的选择、短期后果、长期变化、偶然性和缺失证据八格组织一个因果解释。',
    '',
    '建议证据起点：',
    ...evidence.map((entry) => `- ${entry.scenario.title}｜${entry.label}｜${entry.title}：${entry.text}`),
    '',
    '原因类别：',
    ...inquiry.suggestedCategories.map((category) => `- ${causeCategoryLabels[category]}`),
    '',
    '交付物：一份因果简报，必须点名至少 4 条证据，并说明信心等级与缺失材料。',
  ].join('\n')
}

function formatSourceCorroborationBrief(entries: SourceAtlasEntry[], draft: CorroborationDraft) {
  if (entries.length < 2) {
    return ''
  }

  return [
    'TimeAtlas Corroboration Studio / 史料互证工作台 1.0',
    `生成时间：${new Date().toLocaleString()}`,
    `Basket key：${getCorroborationBasketKey(entries.map((entry) => entry.id))}`,
    `所选来源数：${entries.length}`,
    '',
    '一、互证来源矩阵',
    ...entries.flatMap((entry, index) => [
      `${index + 1}. ${entry.scenario.title}｜${entry.source.title}`,
      `   来源类型：${sourceTypeLabels[entry.source.sourceType]} / ${entry.source.creator}`,
      `   时空情境：${entry.scenario.era} · ${entry.scenario.location} · ${entry.scenario.identity}`,
      `   摘记：${entry.source.excerpt}`,
      `   视角：${entry.source.perspective}`,
      `   可靠边界：${entry.source.reliabilityNote}`,
      `   史料追问：${entry.source.sourceQuestion}`,
      `   标签：${entry.source.evidenceTags.join('、')}`,
    ]),
    '',
    '二、方法检查',
    ...corroborationMethodCards.map((card, index) => `${index + 1}. ${card.title}：${card.prompt}`),
    '',
    '三、互证草稿',
    `临时历史判断：${draft.provisionalClaim.trim() || '尚未填写'}`,
    `支持证据：${draft.supportingEvidence.trim() || '尚未填写'}`,
    `张力 / 冲突：${draft.tensions.trim() || '尚未填写'}`,
    `缺席声音 / 仍需来源：${draft.absentVoices.trim() || '尚未填写'}`,
    `信心等级：${corroborationConfidenceLabels[draft.confidence]}`,
    `更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
  ].join('\n')
}

function getSynthesisOriginLabel(origin: SynthesisEvidenceOrigin) {
  return {
    corroboration: 'Corroboration draft / 互证草稿',
    causation: 'Causation draft / 因果草稿',
    periodization: 'Periodization draft / 分期草稿',
    perspectives: 'Perspectives draft / 多视角草稿',
    contextualization: 'Context draft / 情境化草稿',
    significance: 'Significance draft / 意义草稿',
    compare: 'Compare draft / 比较草稿',
    'actor-network': 'Actor Network draft / 人物网络草稿',
    'mission-work': 'Mission work / 场景任务草稿',
    'case-file': 'Evidence Case File / 来源任务档案',
    workspace: 'Workspace entry / 跨场景工作区',
  }[origin]
}

function getSynthesisEvidenceOriginLabel(entry: SynthesisEvidence) {
  return entry.originLabel || getSynthesisOriginLabel(entry.origin)
}

function makeSynthesisEvidenceId(origin: SynthesisEvidenceOrigin, key: string) {
  return `synthesis:${origin}:${key.replace(/[^a-zA-Z0-9:_|-]+/g, '-')}`
}

function buildSynthesisEvidencePool({
  corroborationDraftState,
  causationDraftState,
  periodizationDraftState,
  perspectivesDraftState,
  contextDraftState,
  significanceDraftState,
  compareDraftState,
  caseFileDraftState,
  actorNetworkDraftState,
  missionWorkState,
  workspaceState,
}: {
  corroborationDraftState: CorroborationDraftState
  causationDraftState: CausationDraftState
  periodizationDraftState: PeriodizationDraftState
  perspectivesDraftState: PerspectivesDraftState
  contextDraftState: ContextDraftState
  significanceDraftState: SignificanceDraftState
  compareDraftState: CompareDraftState
  caseFileDraftState: EvidenceCaseFileDraftState
  actorNetworkDraftState: ActorNetworkDraftState
  missionWorkState: MissionWorkState
  workspaceState: WorkspaceState
}): SynthesisEvidence[] {
  const sourceAtlasEntries = buildSourceAtlasEntries()
  const causationEvidenceByInquiry = getCausationInquiryEvidenceMap()
  const periodizationEvidenceByInquiry = getPeriodizationInquiryEvidenceMap()
  const perspectivesEvidenceByInquiry = getPerspectivesInquiryEvidenceMap()
  const contextEvidenceByInquiry = getContextInquiryEvidenceMap()
  const significanceEvidenceByInquiry = getSignificanceInquiryEvidenceMap()
  const entries: SynthesisEvidence[] = []

  getActiveEvidenceCaseFileDrafts(caseFileDraftState).forEach(([caseFileId, draft]) => {
    const caseFile = evidenceCaseFiles.find((candidate) => candidate.id === caseFileId)
    if (!caseFile) return
    entries.push({
      id: makeSynthesisEvidenceId('case-file', caseFileId),
      origin: 'case-file',
      originLabel: getSynthesisOriginLabel('case-file'),
      title: caseFile.title,
      text: [`主张：${draft.workingClaim}`, `来源：${draft.sourceNotes}`, `情境：${draft.contextNotes}`, `互证：${draft.corroborationNotes}`, `张力：${draft.tensions}`, `缺席：${draft.missingVoices}`].filter((line) => !line.match(/：\s*$/)).join('｜'),
      tags: ['case file', ...caseFile.tags, ...caseFile.skills, draft.confidence],
      inquiryTitle: caseFile.drivingQuestion,
      updatedAt: draft.updatedAt,
    })
  })

  getActiveCorroborationDrafts(corroborationDraftState).forEach(([basketKey, draft]) => {
    const sourceTitles = draft.sourceIds
      .map((sourceId) => sourceAtlasEntries.find((entry) => entry.id === sourceId))
      .filter((entry): entry is SourceAtlasEntry => Boolean(entry))
      .map((entry) => `${entry.scenario.title}｜${entry.source.title}`)
    entries.push({
      id: makeSynthesisEvidenceId('corroboration', basketKey),
      origin: 'corroboration',
      originLabel: getSynthesisOriginLabel('corroboration'),
      title: `互证：${sourceTitles.slice(0, 2).join(' × ') || basketKey}`,
      text: [`判断：${draft.provisionalClaim}`, `支持证据：${draft.supportingEvidence}`, `张力：${draft.tensions}`, `沉默：${draft.absentVoices}`].filter((line) => !line.endsWith('：')).join('｜'),
      tags: ['corroboration', 'source limits', draft.confidence],
      updatedAt: draft.updatedAt,
    })
  })

  getActiveCausationDrafts(causationDraftState).forEach(([inquiryId, draft]) => {
    const inquiry = causationInquiryDefinitions.find((candidate) => candidate.id === inquiryId)
    const evidence = causationEvidenceByInquiry[inquiryId] ?? []
    const selectedTitles = draft.selectedEvidenceIds.map((id) => evidence.find((entry) => entry.id === id)).filter((entry): entry is CausationEvidence => Boolean(entry)).map((entry) => `${entry.scenario.title}｜${entry.title}`)
    entries.push({
      id: makeSynthesisEvidenceId('causation', inquiryId),
      origin: 'causation',
      originLabel: getSynthesisOriginLabel('causation'),
      title: inquiry?.title ?? inquiryId,
      text: [`背景：${draft.backgroundConditions}`, `触发：${draft.immediateTriggers}`, `约束：${draft.constraints}`, `选择：${draft.humanChoices}`, `后果/变化：${draft.shortTermConsequences} ${draft.longTermChange}`, `缺失：${draft.missingEvidence}`].filter((line) => !line.match(/：\s*$/)).join('｜'),
      tags: ['causation', ...(inquiry?.tags ?? []), ...selectedTitles.slice(0, 3), draft.confidence],
      inquiryTitle: inquiry?.title,
      updatedAt: draft.updatedAt,
    })
  })

  getActivePeriodizationDrafts(periodizationDraftState).forEach(([inquiryId, draft]) => {
    const inquiry = periodizationInquiryDefinitions.find((candidate) => candidate.id === inquiryId)
    const evidence = periodizationEvidenceByInquiry[inquiryId] ?? []
    const selectedTitles = draft.selectedEvidenceIds.map((id) => evidence.find((entry) => entry.id === id)).filter((entry): entry is PeriodizationEvidence => Boolean(entry)).map((entry) => `${entry.year} ${entry.scenario.title}`)
    entries.push({
      id: makeSynthesisEvidenceId('periodization', inquiryId),
      origin: 'periodization',
      originLabel: getSynthesisOriginLabel('periodization'),
      title: inquiry?.title ?? inquiryId,
      text: [`分期：${draft.periodLabel}`, `起止：${draft.periodStart}-${draft.periodEnd}`, `连续性：${draft.continuities}`, `变化/转折：${draft.changes} ${draft.turningPoint}`, `替代分期：${draft.alternativePeriodization}`].filter((line) => !line.match(/：\s*$|：-$/)).join('｜'),
      tags: ['periodization', ...(inquiry?.tags ?? []), ...selectedTitles.slice(0, 3), draft.confidence],
      inquiryTitle: inquiry?.title,
      updatedAt: draft.updatedAt,
    })
  })

  getActivePerspectivesDrafts(perspectivesDraftState).forEach(([inquiryId, draft]) => {
    const inquiry = perspectivesInquiryDefinitions.find((candidate) => candidate.id === inquiryId)
    const evidence = perspectivesEvidenceByInquiry[inquiryId] ?? []
    const selectedTitles = draft.selectedEvidenceIds.map((id) => evidence.find((entry) => entry.id === id)).filter((entry): entry is PerspectivesEvidence => Boolean(entry)).map((entry) => `${entry.scenario.title}｜${perspectivesEvidenceLabelText[entry.label]}`)
    entries.push({
      id: makeSynthesisEvidenceId('perspectives', inquiryId),
      origin: 'perspectives',
      originLabel: getSynthesisOriginLabel('perspectives'),
      title: inquiry?.title ?? inquiryId,
      text: [`视角：${draft.actorView}`, `约束：${draft.constraints}`, `可得知识：${draft.availableKnowledge}`, `风险：${draft.stakesAndRisks}`, `能动性：${draft.agencyClaim}`, `缺席：${draft.missingVoices}`].filter((line) => !line.match(/：\s*$/)).join('｜'),
      tags: ['perspectives', ...(inquiry?.tags ?? []), ...selectedTitles.slice(0, 3), draft.confidence],
      inquiryTitle: inquiry?.title,
      updatedAt: draft.updatedAt,
    })
  })

  getActiveContextDrafts(contextDraftState).forEach(([inquiryId, draft]) => {
    const inquiry = contextInquiryDefinitions.find((candidate) => candidate.id === inquiryId)
    const evidence = contextEvidenceByInquiry[inquiryId] ?? []
    const selectedTitles = draft.selectedEvidenceIds.map((id) => evidence.find((entry) => entry.id === id)).filter((entry): entry is ContextEvidence => Boolean(entry)).map((entry) => `${entry.scenario.title}｜${contextEvidenceLabelText[entry.label]}`)
    entries.push({
      id: makeSynthesisEvidenceId('contextualization', inquiryId),
      origin: 'contextualization',
      originLabel: getSynthesisOriginLabel('contextualization'),
      title: inquiry?.title ?? inquiryId,
      text: [`地方：${draft.localSetting}`, `区域：${draft.regionalConnections}`, `大尺度：${draft.largeScaleForces}`, `来源情境：${draft.sourceContext}`, `风险：${draft.anachronismRisk}`, `判断：${draft.contextClaim}`].filter((line) => !line.match(/：\s*$/)).join('｜'),
      tags: ['contextualization', ...(inquiry?.tags ?? []), ...selectedTitles.slice(0, 3), draft.confidence],
      inquiryTitle: inquiry?.title,
      updatedAt: draft.updatedAt,
    })
  })

  getActiveSignificanceDrafts(significanceDraftState).forEach(([inquiryId, draft]) => {
    const inquiry = significanceInquiryDefinitions.find((candidate) => candidate.id === inquiryId)
    const evidence = significanceEvidenceByInquiry[inquiryId] ?? []
    const selectedTitles = draft.selectedEvidenceIds.map((id) => evidence.find((entry) => entry.id === id)).filter((entry): entry is SignificanceEvidence => Boolean(entry)).map((entry) => `${entry.scenario.title}｜${significanceEvidenceLabelText[entry.label]}`)
    entries.push({
      id: makeSynthesisEvidenceId('significance', inquiryId),
      origin: 'significance',
      originLabel: getSynthesisOriginLabel('significance'),
      title: inquiry?.title ?? inquiryId,
      text: [`事件/过程：${draft.eventOrProcess}`, `对谁重要：${draft.whoItMatteredTo}`, `当时/长期意义：${draft.contemporarySignificance} ${draft.longTermSignificance}`, `尺度/争议：${draft.scaleOfImpact} ${draft.contestedMeaning}`, `来源限制：${draft.sourceLimits}`, `主张：${draft.significanceClaim}`].filter((line) => !line.match(/：\s*$/)).join('｜'),
      tags: ['significance', ...(inquiry?.tags ?? []), ...selectedTitles.slice(0, 3), draft.confidence],
      inquiryTitle: inquiry?.title,
      updatedAt: draft.updatedAt,
    })
  })

  getActiveCompareDrafts(compareDraftState).forEach(([key, draft]) => {
    const scenarioA = getScenarioById(draft.scenarioAId)
    const scenarioB = getScenarioById(draft.scenarioBId)
    const lens = getCompareLensByKey(draft.lensKey)
    const evidenceA = scenarioA ? getLensEvidenceSections(scenarioA, lens).filter((section) => draft.selectedEvidenceIdsA.includes(section.id)).map((section) => `${scenarioA.title}｜${section.label}`) : []
    const evidenceB = scenarioB ? getLensEvidenceSections(scenarioB, lens).filter((section) => draft.selectedEvidenceIdsB.includes(section.id)).map((section) => `${scenarioB.title}｜${section.label}`) : []

    entries.push({
      id: makeSynthesisEvidenceId('compare', key),
      origin: 'compare',
      originLabel: getSynthesisOriginLabel('compare'),
      title: `${lens.title}：${scenarioA?.title ?? draft.scenarioAId} × ${scenarioB?.title ?? draft.scenarioBId}`,
      text: [`主张：${draft.comparativeClaim}`, `共同点：${draft.similarity}`, `差异：${draft.difference}`, `证据桥：${draft.evidenceBridge}`, `来源限制：${draft.sourceLimits}`].filter((line) => !line.match(/：\s*$/)).join('｜'),
      tags: ['compare', lens.shortLabel, lens.key, scenarioA?.region, scenarioB?.region, ...evidenceA, ...evidenceB, draft.confidence].filter((tag): tag is string => Boolean(tag)),
      scenarioTitle: [scenarioA?.title, scenarioB?.title].filter(Boolean).join(' × '),
      inquiryTitle: lens.title,
      updatedAt: draft.updatedAt,
    })
  })

  getActiveActorNetworkDrafts(actorNetworkDraftState).forEach(([key, draft]) => {
    const [scenarioId, encounterId] = key.split(':')
    const scenario = getScenarioById(scenarioId)
    const encounter = scenario?.socialEncounters.find((candidate) => candidate.id === encounterId)
    const actors = scenario?.socialActors.filter((actor) => draft.selectedActorIds.includes(actor.id)) ?? []

    entries.push({
      id: makeSynthesisEvidenceId('actor-network', key),
      origin: 'actor-network',
      originLabel: getSynthesisOriginLabel('actor-network'),
      title: encounter?.title ?? key,
      text: [`人物：${actors.map((actor) => actor.name).join('、')}`, `角色简报：${draft.roleBrief}`, `视角比较：${draft.perspectiveComparison}`, `协商方案：${draft.negotiationPlan}`, `缺席声音：${draft.missingVoiceNote}`, `证据：${draft.evidenceNotes}`].filter((line) => !line.match(/：\s*$/)).join('｜'),
      tags: ['actor network', 'social worlds', scenario?.region, scenario?.theme, draft.completed ? 'completed' : 'draft'].filter((tag): tag is string => Boolean(tag)),
      scenarioTitle: scenario?.title,
      scenarioId: scenario?.id,
      inquiryTitle: encounter?.decisionFocus,
      updatedAt: draft.updatedAt,
    })
  })

  Object.entries(missionWorkState).forEach(([key, work]) => {
    if (!work.notes.trim() && work.checkedEvidence.length === 0) return
    const [scenarioId, missionId] = key.split(':')
    const scenario = getScenarioById(scenarioId)
    const mission = scenario?.missions.find((candidate) => candidate.id === missionId)
    entries.push({
      id: makeSynthesisEvidenceId('mission-work', key),
      origin: 'mission-work',
      originLabel: getSynthesisOriginLabel('mission-work'),
      title: mission?.title ?? key,
      text: [work.notes, ...work.checkedEvidence].filter(Boolean).join('｜'),
      tags: [mission?.taskType, mission?.difficulty, scenario?.region, scenario?.theme, ...(mission?.linkedSourceTitles ?? [])].filter((tag): tag is string => Boolean(tag)),
      scenarioTitle: scenario?.title,
      scenarioId: scenario?.id,
      updatedAt: work.updatedAt,
    })
  })

  getWorkspaceEntries(workspaceState).filter(({ entry }) => hasWorkspaceEntryActivity(entry)).forEach(({ key, title, category, entry }) => {
    entries.push({
      id: makeSynthesisEvidenceId('workspace', key),
      origin: 'workspace',
      originLabel: `${getSynthesisOriginLabel('workspace')} · ${category}`,
      title,
      text: [entry.notes, ...entry.checkedEvidence].filter(Boolean).join('｜'),
      tags: ['workspace', category, entry.completed ? 'completed' : 'draft'],
      updatedAt: entry.updatedAt,
    })
  })

  const deduped = new Map<string, SynthesisEvidence>()
  entries.forEach((entry) => {
    if (entry.text.trim()) {
      deduped.set(entry.id, { ...entry, tags: [...new Set(entry.tags.filter(Boolean))] })
    }
  })

  return [...deduped.values()].sort((first, second) => (second.updatedAt ?? '').localeCompare(first.updatedAt ?? '') || first.origin.localeCompare(second.origin))
}

function formatSynthesisWritingBrief(preset: SynthesisInquiryPreset, evidencePool: SynthesisEvidence[], draft: SynthesisDraft) {
  const selectedEvidence = draft.evidenceIds
    .map((id) => evidencePool.find((entry) => entry.id === id))
    .filter((entry): entry is SynthesisEvidence => Boolean(entry))
  const evidenceForExport = selectedEvidence.length ? selectedEvidence : evidencePool.slice(0, 12)

  return [
    'TimeAtlas Synthesis & Historical Writing Studio / 综合历史论证工作台 1.0',
    `生成时间：${new Date().toLocaleString()}`,
    `预设：${preset.title}｜${preset.subtitle}`,
    `核心问题：${draft.drivingQuestion.trim() || preset.drivingQuestion}`,
    `论证范围：${draft.claimScope.trim() || preset.claimScope}`,
    `分析焦点：${preset.focus}`,
    '',
    '一、综合证据池 / selected evidence',
    ...evidenceForExport.map((entry, index) => `${index + 1}. ${getSynthesisEvidenceOriginLabel(entry)}｜${entry.scenarioTitle ? `${entry.scenarioTitle}｜` : ''}${entry.title}\n   ${entry.text}\n   标签：${entry.tags.join('、') || '无'}`),
    '',
    '二、Thesis builder / 论文主张',
    `Working thesis：${draft.workingThesis.trim() || '尚未填写'}`,
    `Reasoning bridge：${draft.reasoningBridge.trim() || '尚未填写'}`,
    `Counterargument：${draft.counterargument.trim() || '尚未填写'}`,
    `Source limits：${draft.sourceLimits.trim() || '尚未填写'}`,
    '',
    '三、Paragraph planner / 段落计划',
    draft.paragraphPlan.trim() || preset.paragraphFrame.map((item, index) => `${index + 1}. ${item}`).join('\n'),
    '',
    '四、Significance & revision / 意义与修订',
    `Significance link：${draft.significanceLink.trim() || '尚未填写'}`,
    `Revision checklist：\n${draft.revisionChecklist.trim() || '尚未填写'}`,
    `Confidence：${synthesisConfidenceLabels[draft.confidence]}`,
    `更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
  ].join('\n')
}

function formatSynthesisTaskSheet(preset: SynthesisInquiryPreset) {
  return [
    `TimeAtlas Synthesis Studio Assignment：${preset.title}`,
    `核心问题：${preset.drivingQuestion}`,
    `论证范围：${preset.claimScope}`,
    `分析焦点：${preset.focus}`,
    '',
    '任务：从已有互证、因果、分期、多视角、情境化、意义、任务草稿和工作区条目中选择证据，写出一份综合历史论证。',
    '',
    '建议段落计划：',
    ...preset.paragraphFrame.map((item, index) => `${index + 1}. ${item}`),
    '',
    '交付物：一份 Synthesis Writing Brief，包含 driving question、working thesis、claim scope、证据、reasoning bridge、counterargument、source limits、paragraph plan、significance link、revision checklist 与 confidence。',
  ].join('\n')
}

function formatLearningArchive(
  missionWorkState: MissionWorkState,
  completedMissionIdsByScenario: Record<string, string[]>,
  workspaceState: WorkspaceState,
  corroborationDraftState: CorroborationDraftState,
  causationDraftState: CausationDraftState,
  periodizationDraftState: PeriodizationDraftState,
  perspectivesDraftState: PerspectivesDraftState,
  contextDraftState: ContextDraftState,
  significanceDraftState: SignificanceDraftState,
  synthesisDraftState: SynthesisDraftState,
  caseFileDraftState: EvidenceCaseFileDraftState,
  compareDraftState: CompareDraftState,
  actorNetworkDraftState: ActorNetworkDraftState,
  taskModuleProgressState: TaskModuleProgressState,
  assignmentBuilderDraft: AssignmentBuilderDraft,
  assignmentLibraryTasks: LibraryTask[],
  taskWorkbenchDraftState: TaskWorkbenchState,
) {
  const workspaceStats = getWorkspaceStats(workspaceState)
  const activeCorroborationDrafts = getActiveCorroborationDrafts(corroborationDraftState)
  const activeCausationDrafts = getActiveCausationDrafts(causationDraftState)
  const activePeriodizationDrafts = getActivePeriodizationDrafts(periodizationDraftState)
  const activePerspectivesDrafts = getActivePerspectivesDrafts(perspectivesDraftState)
  const activeContextDrafts = getActiveContextDrafts(contextDraftState)
  const activeSignificanceDrafts = getActiveSignificanceDrafts(significanceDraftState)
  const activeSynthesisDrafts = getActiveSynthesisDrafts(synthesisDraftState)
  const activeCaseFileDrafts = getActiveEvidenceCaseFileDrafts(caseFileDraftState)
  const activeCompareDrafts = getActiveCompareDrafts(compareDraftState)
  const activeActorNetworkDrafts = getActiveActorNetworkDrafts(actorNetworkDraftState)
  const taskModuleStats = getTaskModuleProgressStats(taskModuleProgressState)
  const assignmentSummary = getAssignmentBuilderSummary(assignmentBuilderDraft, assignmentLibraryTasks)
  const taskWorkbenchStats = getTaskWorkbenchStats(taskWorkbenchDraftState)
  const libraryTasksById = new Map(assignmentLibraryTasks.map((task) => [task.id, task]))
  const causationEvidenceByInquiry = getCausationInquiryEvidenceMap()
  const periodizationEvidenceByInquiry = getPeriodizationInquiryEvidenceMap()
  const perspectivesEvidenceByInquiry = getPerspectivesInquiryEvidenceMap()
  const contextEvidenceByInquiry = getContextInquiryEvidenceMap()
  const significanceEvidenceByInquiry = getSignificanceInquiryEvidenceMap()
  const synthesisEvidencePool = buildSynthesisEvidencePool({ corroborationDraftState, causationDraftState, periodizationDraftState, perspectivesDraftState, contextDraftState, significanceDraftState, compareDraftState, caseFileDraftState, actorNetworkDraftState, missionWorkState, workspaceState })
  const lines = [
    'TimeAtlas Learning Archive',
    `导出时间：${new Date().toLocaleString()}`,
    '',
    '全站概览：',
    `- 场景任务完成：${getTotalCompletedMissions(completedMissionIdsByScenario)}/${totalMissionCount}`,
    `- 跨场景工作区条目：${workspaceStats.totalEntries}`,
    `- 跨场景已完成：${workspaceStats.completedEntries}`,
    `- 跨场景草稿：${workspaceStats.draftEntries}`,
    `- 跨场景已勾选证据/步骤：${workspaceStats.checkedEvidenceCount}`,
    `- 史料互证草稿：${activeCorroborationDrafts.length}`,
    `- 因果变化草稿：${activeCausationDrafts.length}`,
    `- 历史分期草稿：${activePeriodizationDrafts.length}`,
    `- 多视角与能动性草稿：${activePerspectivesDrafts.length}`,
    `- 历史情境化与尺度草稿：${activeContextDrafts.length}`,
    `- 历史意义与记忆草稿：${activeSignificanceDrafts.length}`,
    `- 综合历史论证草稿：${activeSynthesisDrafts.length}`,
    `- Evidence Case Files 草稿：${activeCaseFileDrafts.length}`,
    `- 跨场景比较草稿：${activeCompareDrafts.length}`,
    `- Actor Network 草稿：${activeActorNetworkDrafts.length}`,
    `- 任务组合器：${assignmentSummary.selectedTasks.length ? `${assignmentSummary.selectedTasks.length} tasks，${assignmentSummary.totalMinutes} 分钟` : '尚未组合'}`,
    `- 任务执行台草稿：${taskWorkbenchStats.activeCount} drafts，${taskWorkbenchStats.completedCount} completed，${taskWorkbenchStats.checkedPromptCount} checklist items`,
    `- 单元模块进度：${taskModuleStats.startedCount}/${taskModules.length} started，${taskModuleStats.completedCount} completed，${taskModuleStats.checkedStepCount}/${taskModuleStats.totalStepCount} steps`,
    '',
  ]

  scenarios.forEach((scenario) => {
    const completedMissionIds = completedMissionIdsByScenario[scenario.id] ?? []
    const missionLines = scenario.missions.flatMap((mission) => {
      const work = missionWorkState[getMissionWorkKey(scenario.id, mission.id)]
      const status = getMissionStatus(scenario.id, mission, completedMissionIds, missionWorkState)

      if (status === 'not-started') {
        return []
      }

      const checkedEvidence = work?.checkedEvidence.length
        ? work.checkedEvidence.map((item) => `    - ${item}`).join('\n')
        : '    - 尚未勾选证据'

      return [
        `  - ${mission.title}（${mission.taskType} / ${status === 'completed' ? '已完成' : '草稿'}）`,
        `    交付物：${mission.deliverable}`,
        `    关联来源：${mission.linkedSourceTitles.join('、') || '场景来源层'}`,
        '    证据：',
        checkedEvidence,
        `    草稿：${work?.notes.trim() || '尚未填写'}`,
      ]
    })

    if (missionLines.length > 0) {
      lines.push(`${scenario.title} · ${scenario.era}`, ...missionLines, '')
    }
  })

  activeActorNetworkDrafts.forEach(([key, draft]) => {
    const [scenarioId, encounterId] = key.split(':')
    const scenario = getScenarioById(scenarioId)
    const encounter = scenario?.socialEncounters.find((candidate) => candidate.id === encounterId)
    const actors = scenario?.socialActors.filter((actor) => draft.selectedActorIds.includes(actor.id)) ?? []

    lines.push(
      `Actor Network / 人物网络：${encounter?.title ?? key}`,
      `  场景：${scenario?.title ?? scenarioId}`,
      `  状态：${draft.completed ? '已完成' : '草稿'}；人物：${actors.map((actor) => actor.name).join('、') || '未选择'}`,
      `  Role brief：${draft.roleBrief.trim() || '未填写'}`,
      `  Perspective comparison：${draft.perspectiveComparison.trim() || '未填写'}`,
      `  Negotiation plan：${draft.negotiationPlan.trim() || '未填写'}`,
      `  Missing voice：${draft.missingVoiceNote.trim() || '未填写'}`,
      `  Evidence notes：${draft.evidenceNotes.trim() || '未填写'}`,
      '',
    )
  })

  const workspaceEntries = getWorkspaceEntries(workspaceState).filter(({ entry }) => hasWorkspaceEntryActivity(entry))

  if (assignmentSummary.selectedTasks.length > 0 || hasAssignmentBuilderActivity(assignmentBuilderDraft)) {
    lines.push(
      'Assignment Builder / 任务组合器：',
      `  标题：${assignmentBuilderDraft.title.trim() || '未填写'}`,
      `  对象：${assignmentBuilderDraft.audience.trim() || '未填写'}`,
      `  时间盒：${assignmentBuilderDraft.timeBox.trim() || `${assignmentSummary.totalMinutes} 分钟`}`,
      `  学习目标：${assignmentBuilderDraft.learningGoal.trim() || '未填写'}`,
      `  最终交付物：${assignmentBuilderDraft.finalDeliverable.trim() || '未填写'}`,
      `  任务序列：${assignmentSummary.selectedTasks.map((task, index) => `${index + 1}. ${task.title}`).join('；') || '尚未选择'}`,
      `  来源类别：${assignmentSummary.sourceCategories.join('、') || '尚未选择'}`,
      `  场景覆盖：${assignmentSummary.scenarioCoverage.join('、') || '尚未选择'}`,
      `  历史思维标签：${assignmentSummary.historicalThinkingTags.slice(0, 12).join('、') || '尚未识别'}`,
      `  评分关注：${assignmentBuilderDraft.rubricFocus.trim() || '未填写'}`,
      '',
    )
  }

  if (taskWorkbenchStats.activeDrafts.length > 0) {
    lines.push('Tasks Workbench / 任务执行台：')
    taskWorkbenchStats.activeDrafts.forEach(([taskId, draft]) => {
      const task = libraryTasksById.get(taskId)
      const checklist = task ? getTaskWorkbenchChecklist(task) : []
      const completedChecklist = checklist.filter((_, index) => draft.checkedPromptIds.includes(`checklist:${index}`))

      lines.push(
        `  - ${task?.title ?? taskId}（${draft.completed ? '已完成' : '草稿'}｜${task?.sourceLabel ?? '未知来源'}）`,
        `    更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
        `    情境：${task?.context ?? '任务库条目已变化'}`,
        `    清单进度：${completedChecklist.length}/${checklist.length}`,
        `    已完成清单：${completedChecklist.join('；') || '尚未勾选'}`,
        `    证据 notes：${draft.evidenceNotes.trim() || '尚未填写'}`,
        `    Claim / explanation：${draft.claimExplanation.trim() || '尚未填写'}`,
        `    Source limits：${draft.sourceLimits.trim() || '尚未填写'}`,
        `    Reflection：${draft.reflection.trim() || '尚未填写'}`,
      )
    })
    lines.push('')
  }

  if (taskModuleStats.details.length > 0) {
    lines.push('Tasks Learning Modules / 单元模块：')
    taskModuleStats.details.forEach(({ module, completedSteps, totalSteps, isComplete }) => {
      const checkedStepIds = taskModuleProgressState[module.id] ?? []

      lines.push(
        `  - ${module.title}（${isComplete ? '已完成' : '进行中'}｜${completedSteps}/${totalSteps} steps｜${module.totalMinutes} 分钟）`,
        `    核心问题：${module.drivingQuestion}`,
        `    场景：${module.scenarioIds.map((id) => getScenarioById(id)?.title ?? id).join('、')}`,
        `    已完成步骤：${module.steps.filter((step) => checkedStepIds.includes(step.id)).map((step) => step.title).join('；') || '尚未勾选'}`,
        `    最终交付物：${module.finalDeliverable}`,
      )
    })
    lines.push('')
  }

  if (workspaceEntries.length > 0) {
    lines.push('跨场景工作区：')
    workspaceEntries.forEach(({ title, category, entry }) => {
      const checkedEvidence = entry.checkedEvidence.length
        ? entry.checkedEvidence.map((item) => `    - ${item}`).join('\n')
        : '    - 尚未勾选'

      lines.push(
        `  - ${title}（${category} / ${entry.completed ? '已完成' : '草稿'}）`,
        `    更新时间：${entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : '未记录时间'}`,
        '    清单 / 证据：',
        checkedEvidence,
        `    草稿：${entry.notes.trim() || '尚未填写'}`,
      )
    })
    lines.push('')
  }

  if (activeCausationDrafts.length > 0) {
    lines.push('因果与历史变化工作台：')
    activeCausationDrafts.forEach(([inquiryId, draft]) => {
      const inquiry = causationInquiryDefinitions.find((candidate) => candidate.id === inquiryId)
      const evidence = causationEvidenceByInquiry[inquiryId] ?? []
      const selectedEvidenceTitles = draft.selectedEvidenceIds
        .map((evidenceId) => evidence.find((entry) => entry.id === evidenceId))
        .filter((entry): entry is CausationEvidence => Boolean(entry))
        .map((entry) => `${entry.scenario.title}｜${entry.label}｜${entry.title}`)

      lines.push(
        `  - ${inquiry?.title ?? inquiryId}`,
        `    更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
        `    已选证据：${selectedEvidenceTitles.join('；') || '尚未勾选证据'}`,
        `    背景条件：${draft.backgroundConditions.trim() || '尚未填写'}`,
        `    直接触发：${draft.immediateTriggers.trim() || '尚未填写'}`,
        `    约束条件：${draft.constraints.trim() || '尚未填写'}`,
        `    人的选择：${draft.humanChoices.trim() || '尚未填写'}`,
        `    短期后果：${draft.shortTermConsequences.trim() || '尚未填写'}`,
        `    长期变化：${draft.longTermChange.trim() || '尚未填写'}`,
        `    偶然性：${draft.contingency.trim() || '尚未填写'}`,
        `    缺失证据：${draft.missingEvidence.trim() || '尚未填写'}`,
        `    信心等级：${causationConfidenceLabels[draft.confidence]}`,
      )
    })
    lines.push('')
  }

  if (activePeriodizationDrafts.length > 0) {
    lines.push('历史连续性与分期工作台：')
    activePeriodizationDrafts.forEach(([inquiryId, draft]) => {
      const inquiry = periodizationInquiryDefinitions.find((candidate) => candidate.id === inquiryId)
      const evidence = periodizationEvidenceByInquiry[inquiryId] ?? []
      const selectedEvidenceTitles = draft.selectedEvidenceIds
        .map((evidenceId) => evidence.find((entry) => entry.id === evidenceId))
        .filter((entry): entry is PeriodizationEvidence => Boolean(entry))
        .map((entry) => `${entry.year}｜${entry.scenario.title}｜${entry.label}｜${entry.title}`)

      lines.push(
        `  - ${inquiry?.title ?? inquiryId}`,
        `    更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
        `    已选证据：${selectedEvidenceTitles.join('；') || '尚未勾选证据'}`,
        `    时期起点：${draft.periodStart.trim() || '尚未填写'}`,
        `    时期终点：${draft.periodEnd.trim() || '尚未填写'}`,
        `    连续性：${draft.continuities.trim() || '尚未填写'}`,
        `    变化：${draft.changes.trim() || '尚未填写'}`,
        `    转折点：${draft.turningPoint.trim() || '尚未填写'}`,
        `    前后证据：${draft.beforeAfterEvidence.trim() || '尚未填写'}`,
        `    分期标签：${draft.periodLabel.trim() || '尚未填写'}`,
        `    替代分期：${draft.alternativePeriodization.trim() || '尚未填写'}`,
        `    缺失证据：${draft.missingEvidence.trim() || '尚未填写'}`,
        `    信心等级：${periodizationConfidenceLabels[draft.confidence]}`,
      )
    })
    lines.push('')
  }

  if (activePerspectivesDrafts.length > 0) {
    lines.push('多视角与历史能动性工作台：')
    activePerspectivesDrafts.forEach(([inquiryId, draft]) => {
      const inquiry = perspectivesInquiryDefinitions.find((candidate) => candidate.id === inquiryId)
      const evidence = perspectivesEvidenceByInquiry[inquiryId] ?? []
      const selectedEvidenceTitles = draft.selectedEvidenceIds
        .map((evidenceId) => evidence.find((entry) => entry.id === evidenceId))
        .filter((entry): entry is PerspectivesEvidence => Boolean(entry))
        .map((entry) => `${entry.scenario.title}｜${perspectivesEvidenceLabelText[entry.label]}｜${entry.title}`)

      lines.push(
        `  - ${inquiry?.title ?? inquiryId}`,
        `    更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
        `    已选证据：${selectedEvidenceTitles.join('；') || '尚未勾选证据'}`,
        `    行动者视角：${draft.actorView.trim() || '尚未填写'}`,
        `    约束条件：${draft.constraints.trim() || '尚未填写'}`,
        `    可得知识：${draft.availableKnowledge.trim() || '尚未填写'}`,
        `    利害与风险：${draft.stakesAndRisks.trim() || '尚未填写'}`,
        `    能动性判断：${draft.agencyClaim.trim() || '尚未填写'}`,
        `    反当下主义警示：${draft.presentismWarning.trim() || '尚未填写'}`,
        `    来源视角限制：${draft.sourcePerspectiveLimits.trim() || '尚未填写'}`,
        `    缺席声音：${draft.missingVoices.trim() || '尚未填写'}`,
        `    信心等级：${perspectivesConfidenceLabels[draft.confidence]}`,
      )
    })
    lines.push('')
  }

  if (activeContextDrafts.length > 0) {
    lines.push('历史情境化与尺度工作台：')
    activeContextDrafts.forEach(([inquiryId, draft]) => {
      const inquiry = contextInquiryDefinitions.find((candidate) => candidate.id === inquiryId)
      const evidence = contextEvidenceByInquiry[inquiryId] ?? []
      const selectedEvidenceTitles = draft.selectedEvidenceIds
        .map((evidenceId) => evidence.find((entry) => entry.id === evidenceId))
        .filter((entry): entry is ContextEvidence => Boolean(entry))
        .map((entry) => `${entry.scenario.title}｜${contextEvidenceLabelText[entry.label]}｜${entry.title}`)

      lines.push(
        `  - ${inquiry?.title ?? inquiryId}`,
        `    更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
        `    已选证据：${selectedEvidenceTitles.join('；') || '尚未勾选证据'}`,
        `    地方现场：${draft.localSetting.trim() || '尚未填写'}`,
        `    区域连接：${draft.regionalConnections.trim() || '尚未填写'}`,
        `    大尺度力量：${draft.largeScaleForces.trim() || '尚未填写'}`,
        `    来源情境：${draft.sourceContext.trim() || '尚未填写'}`,
        `    时代错置风险：${draft.anachronismRisk.trim() || '尚未填写'}`,
        `    情境化判断：${draft.contextClaim.trim() || '尚未填写'}`,
        `    缺失情境：${draft.missingContext.trim() || '尚未填写'}`,
        `    信心等级：${contextConfidenceLabels[draft.confidence]}`,
      )
    })
    lines.push('')
  }

  if (activeSignificanceDrafts.length > 0) {
    lines.push('历史意义与记忆工作台：')
    activeSignificanceDrafts.forEach(([inquiryId, draft]) => {
      const inquiry = significanceInquiryDefinitions.find((candidate) => candidate.id === inquiryId)
      const evidence = significanceEvidenceByInquiry[inquiryId] ?? []
      const selectedEvidenceTitles = draft.selectedEvidenceIds
        .map((evidenceId) => evidence.find((entry) => entry.id === evidenceId))
        .filter((entry): entry is SignificanceEvidence => Boolean(entry))
        .map((entry) => `${entry.scenario.title}｜${significanceEvidenceLabelText[entry.label]}｜${entry.title}`)

      lines.push(
        `  - ${inquiry?.title ?? inquiryId}`,
        `    更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
        `    已选证据：${selectedEvidenceTitles.join('；') || '尚未勾选证据'}`,
        `    事件/过程：${draft.eventOrProcess.trim() || '尚未填写'}`,
        `    对谁重要：${draft.whoItMatteredTo.trim() || '尚未填写'}`,
        `    当时意义：${draft.contemporarySignificance.trim() || '尚未填写'}`,
        `    长期意义：${draft.longTermSignificance.trim() || '尚未填写'}`,
        `    影响尺度：${draft.scaleOfImpact.trim() || '尚未填写'}`,
        `    争议意义：${draft.contestedMeaning.trim() || '尚未填写'}`,
        `    来源限制：${draft.sourceLimits.trim() || '尚未填写'}`,
        `    意义主张：${draft.significanceClaim.trim() || '尚未填写'}`,
        `    信心等级：${significanceConfidenceLabels[draft.confidence]}`,
      )
    })
    lines.push('')
  }

  if (activeCaseFileDrafts.length > 0) {
    lines.push('Evidence Case Files / Archive Quests：')
    activeCaseFileDrafts.forEach(([caseFileId, draft]) => {
      const caseFile = evidenceCaseFiles.find((candidate) => candidate.id === caseFileId)
      if (!caseFile) return
      const completedTasks = caseFile.taskChecklist.filter((_, index) => draft.completedTaskIds.includes(`task:${index}`))
      lines.push(
        `  - ${caseFile.title}`,
        `    更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
        `    核心问题：${caseFile.drivingQuestion}`,
        `    已完成任务：${completedTasks.join('；') || '尚未勾选'}`,
        `    Source notes：${draft.sourceNotes.trim() || '尚未填写'}`,
        `    Context notes：${draft.contextNotes.trim() || '尚未填写'}`,
        `    Corroboration：${draft.corroborationNotes.trim() || '尚未填写'}`,
        `    Tensions：${draft.tensions.trim() || '尚未填写'}`,
        `    Missing voices：${draft.missingVoices.trim() || '尚未填写'}`,
        `    Working claim：${draft.workingClaim.trim() || '尚未填写'}`,
        `    Confidence：${evidenceCaseConfidenceLabels[draft.confidence]}`,
      )
    })
    lines.push('')
  }

  if (activeCompareDrafts.length > 0) {
    lines.push('Compare Lab Workspace / 跨场景比较工作区：')
    activeCompareDrafts.forEach(([, draft]) => {
      const scenarioA = getScenarioById(draft.scenarioAId)
      const scenarioB = getScenarioById(draft.scenarioBId)
      const lens = getCompareLensByKey(draft.lensKey)
      const selectedEvidenceA = scenarioA
        ? getLensEvidenceSections(scenarioA, lens).filter((section) => draft.selectedEvidenceIdsA.includes(section.id)).map((section) => `${section.label}｜${section.text}`)
        : []
      const selectedEvidenceB = scenarioB
        ? getLensEvidenceSections(scenarioB, lens).filter((section) => draft.selectedEvidenceIdsB.includes(section.id)).map((section) => `${section.label}｜${section.text}`)
        : []

      lines.push(
        `  - ${lens.title}：${scenarioA?.title ?? draft.scenarioAId} × ${scenarioB?.title ?? draft.scenarioBId}`,
        `    更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
        `    A 侧证据：${selectedEvidenceA.join('；') || '尚未勾选证据'}`,
        `    B 侧证据：${selectedEvidenceB.join('；') || '尚未勾选证据'}`,
        `    比较主张：${draft.comparativeClaim.trim() || '尚未填写'}`,
        `    共同点：${draft.similarity.trim() || '尚未填写'}`,
        `    差异：${draft.difference.trim() || '尚未填写'}`,
        `    证据桥：${draft.evidenceBridge.trim() || '尚未填写'}`,
        `    来源限制：${draft.sourceLimits.trim() || '尚未填写'}`,
        `    信心等级：${compareConfidenceLabels[draft.confidence]}`,
      )
    })
    lines.push('')
  }

  if (activeSynthesisDrafts.length > 0) {
    lines.push('综合历史论证工作台：')
    activeSynthesisDrafts.forEach(([presetId, draft]) => {
      const preset = synthesisInquiryPresets.find((candidate) => candidate.id === presetId)
      const selectedEvidenceTitles = draft.evidenceIds
        .map((evidenceId) => synthesisEvidencePool.find((entry) => entry.id === evidenceId))
        .filter((entry): entry is SynthesisEvidence => Boolean(entry))
        .map((entry) => `${getSynthesisEvidenceOriginLabel(entry)}｜${entry.title}`)

      lines.push(
        `  - ${preset?.title ?? presetId}`,
        `    更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
        `    核心问题：${draft.drivingQuestion.trim() || preset?.drivingQuestion || '尚未填写'}`,
        `    论证范围：${draft.claimScope.trim() || '尚未填写'}`,
        `    已选证据：${selectedEvidenceTitles.join('；') || '尚未勾选证据'}`,
        `    工作论文：${draft.workingThesis.trim() || '尚未填写'}`,
        `    推理桥：${draft.reasoningBridge.trim() || '尚未填写'}`,
        `    反驳：${draft.counterargument.trim() || '尚未填写'}`,
        `    来源限制：${draft.sourceLimits.trim() || '尚未填写'}`,
        `    段落计划：${draft.paragraphPlan.trim() || '尚未填写'}`,
        `    历史意义连接：${draft.significanceLink.trim() || '尚未填写'}`,
        `    修订清单：${draft.revisionChecklist.trim() || '尚未填写'}`,
        `    信心等级：${synthesisConfidenceLabels[draft.confidence]}`,
      )
    })
    lines.push('')
  }

  if (activeCorroborationDrafts.length > 0) {
    const sourceAtlasEntries = buildSourceAtlasEntries()

    lines.push('史料互证工作台：')
    activeCorroborationDrafts.forEach(([basketKey, draft]) => {
      const sourceTitles = draft.sourceIds
        .map((sourceId) => sourceAtlasEntries.find((entry) => entry.id === sourceId))
        .filter((entry): entry is SourceAtlasEntry => Boolean(entry))
        .map((entry) => `${entry.scenario.title}｜${entry.source.title}`)

      lines.push(
        `  - Basket ${basketKey}`,
        `    来源：${sourceTitles.join('；') || '来源组合已变化'}`,
        `    更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
        `    临时历史判断：${draft.provisionalClaim.trim() || '尚未填写'}`,
        `    支持证据：${draft.supportingEvidence.trim() || '尚未填写'}`,
        `    张力 / 冲突：${draft.tensions.trim() || '尚未填写'}`,
        `    缺席声音 / 仍需来源：${draft.absentVoices.trim() || '尚未填写'}`,
        `    信心等级：${corroborationConfidenceLabels[draft.confidence]}`,
      )
    })
    lines.push('')
  }

  if (lines.length <= 15) {
    lines.push('尚未保存任何任务草稿、任务执行台草稿、跨场景草稿、互证草稿、因果草稿、分期草稿、多视角草稿、情境化草稿、历史意义草稿、综合论证草稿、Evidence Case Files 草稿、单元模块进度或完成记录。')
  }

  return lines.join('\n')
}

function getDurationBand(minutes: number): DurationBand {
  if (minutes <= 20) {
    return 'short'
  }

  if (minutes <= 45) {
    return 'medium'
  }

  if (minutes <= 90) {
    return 'long'
  }

  return 'extended'
}

function getDurationBandLabel(band: DurationBand) {
  return {
    short: '≤20 分钟',
    medium: '21-45 分钟',
    long: '46-90 分钟',
    extended: '90+ 分钟',
  }[band]
}

function taskMatchesAny(task: LibraryTask, terms: string[]) {
  return terms.some((term) => task.searchText.includes(term.toLowerCase()))
}


function hasArgumentDraftActivity(draft: ArgumentDraft) {
  return Boolean(
    draft.claim.trim()
      || draft.evidence.length
      || draft.customEvidence.trim()
      || draft.reasoning.trim()
      || draft.counterEvidence.trim(),
  )
}

function getLabDraftCount({
  corroborationDraftState,
  causationDraftState,
  periodizationDraftState,
  perspectivesDraftState,
  contextDraftState,
  significanceDraftState,
}: {
  corroborationDraftState: CorroborationDraftState
  causationDraftState: CausationDraftState
  periodizationDraftState: PeriodizationDraftState
  perspectivesDraftState: PerspectivesDraftState
  contextDraftState: ContextDraftState
  significanceDraftState: SignificanceDraftState
}) {
  return getActiveCorroborationDrafts(corroborationDraftState).length
    + getActiveCausationDrafts(causationDraftState).length
    + getActivePeriodizationDrafts(periodizationDraftState).length
    + getActivePerspectivesDrafts(perspectivesDraftState).length
    + getActiveContextDrafts(contextDraftState).length
    + getActiveSignificanceDrafts(significanceDraftState).length
}

function getMissionDraftCount(missionWorkState: MissionWorkState) {
  return Object.values(missionWorkState).filter((work) => work.notes.trim() || work.checkedEvidence.length).length
}

function formatLearningCoachPlan(recommendations: LearningCoachRecommendation[], snapshot: LearningCoachPlanSnapshot) {
  const visibleRecommendations = recommendations.slice(0, 4)

  return [
    'TimeAtlas Learning Coach / 下一步学习计划',
    `导出时间：${new Date().toLocaleString()}`,
    '',
    '当前本地学习状态：',
    `- 场景任务完成：${snapshot.totalCompletedMissionCount}/${totalMissionCount}`,
    `- Scenario mission 草稿：${snapshot.missionDraftCount}`,
    `- 跨场景工作区：${snapshot.workspaceStats.totalEntries} entries（${snapshot.workspaceStats.draftEntries} drafts / ${snapshot.workspaceStats.completedEntries} completed）`,
    `- Task Workbench：${snapshot.taskWorkbenchStats.activeCount} drafts（${snapshot.taskWorkbenchStats.completedCount} completed）`,
    `- Task Modules：${snapshot.taskModuleStats.startedCount}/${taskModules.length} started（${snapshot.taskModuleStats.completedCount} completed）`,
    `- Labs 草稿：${snapshot.labDraftCount}`,
    `- Compare Lab 草稿：${snapshot.compareDraftCount}`,
    `- Synthesis 草稿：${snapshot.synthesisDraftCount}`,
    `- Case Files 草稿：${snapshot.caseFileDraftCount}`,
    '',
    '推荐下一步：',
    ...(visibleRecommendations.length
      ? visibleRecommendations.flatMap((recommendation, index) => [
        `${index + 1}. [${recommendation.typeLabel}] ${recommendation.title}`,
        `   理由：${recommendation.reason}`,
        `   预计时间：${recommendation.estimatedMinutes} 分钟`,
        `   标签：${recommendation.tags.join('、')}`,
        `   CTA：${recommendation.ctaLabel}`,
      ])
      : ['1. 暂无推荐：先进入一个 scenario 或任务集合生成本地学习痕迹。']),
  ].join('\n')
}

function getStarterTask(tasks: LibraryTask[]) {
  return tasks.find((task) => task.durationMinutes <= 20 && task.source === 'mission')
    ?? tasks.find((task) => task.durationMinutes <= 20)
    ?? tasks[0]
}

function buildLearningCoachRecommendations({
  libraryTasks,
  taskWorkbenchDraftState,
  taskModuleProgressState,
  workspaceState,
  argumentDraftState,
  corroborationDraftState,
  causationDraftState,
  periodizationDraftState,
  perspectivesDraftState,
  contextDraftState,
  significanceDraftState,
  synthesisDraftState,
  compareDraftState,
  missionWorkState,
  completedMissionIdsByScenario,
  onStartTask,
  onSelectTasksSubpage,
  onSelectScenario,
  onSelectLabsSubpage,
  onSelectAtlasSubpage,
}: {
  libraryTasks: LibraryTask[]
  taskWorkbenchDraftState: TaskWorkbenchState
  taskModuleProgressState: TaskModuleProgressState
  workspaceState: WorkspaceState
  argumentDraftState: ArgumentDraftState
  corroborationDraftState: CorroborationDraftState
  causationDraftState: CausationDraftState
  periodizationDraftState: PeriodizationDraftState
  perspectivesDraftState: PerspectivesDraftState
  contextDraftState: ContextDraftState
  significanceDraftState: SignificanceDraftState
  synthesisDraftState: SynthesisDraftState
  caseFileDraftState: EvidenceCaseFileDraftState
  compareDraftState: CompareDraftState
  missionWorkState: MissionWorkState
  completedMissionIdsByScenario: Record<string, string[]>
  onStartTask: (taskId: string) => void
  onSelectTasksSubpage: (subpage: TasksSubpage) => void
  onSelectScenario: (id: string, hash?: ScenarioSectionId) => void
  onSelectLabsSubpage: (subpage: LabsSubpage) => void
  onSelectAtlasSubpage: (subpage: AtlasSubpage) => void
}): LearningCoachRecommendation[] {
  const recommendations: LearningCoachRecommendation[] = []
  const taskWorkbenchStats = getTaskWorkbenchStats(taskWorkbenchDraftState)
  const incompleteWorkbenchDraft = taskWorkbenchStats.recentDrafts.find(([, draft]) => !draft.completed)
  const moduleStats = getTaskModuleProgressStats(taskModuleProgressState)
  const incompleteModule = moduleStats.details.find((detail) => !detail.isComplete)
  const workspaceStats = getWorkspaceStats(workspaceState)
  const labDraftCount = getLabDraftCount({ corroborationDraftState, causationDraftState, periodizationDraftState, perspectivesDraftState, contextDraftState, significanceDraftState })
  const compareDraftCount = getActiveCompareDrafts(compareDraftState).length
  const synthesisDraftCount = getActiveSynthesisDrafts(synthesisDraftState).length
  const argumentDraftCount = Object.values(argumentDraftState).filter(hasArgumentDraftActivity).length
  const missionDraftCount = getMissionDraftCount(missionWorkState)
  const completedMissionCount = getTotalCompletedMissions(completedMissionIdsByScenario)
  const hasAnyLocalProgress = Boolean(
    taskWorkbenchStats.activeCount
      || moduleStats.startedCount
      || workspaceStats.totalEntries
      || labDraftCount
      || compareDraftCount
      || synthesisDraftCount
      || argumentDraftCount
      || missionDraftCount
      || completedMissionCount,
  )

  if (incompleteWorkbenchDraft) {
    const [taskId, draft] = incompleteWorkbenchDraft
    const task = libraryTasks.find((candidate) => candidate.id === taskId)
    const checklist = task ? getTaskWorkbenchChecklist(task) : []
    const checkedCount = checklist.filter((_, index) => draft.checkedPromptIds.includes(`checklist:${index}`)).length

    recommendations.push({
      id: `resume-workbench:${taskId}`,
      type: 'resume-workbench',
      typeLabel: 'Resume draft',
      title: task ? `继续 Task Workbench：${task.title}` : '继续未完成的 Task Workbench 草稿',
      reason: `你已有执行台草稿但尚未标记完成；当前清单进度 ${checkedCount}/${checklist.length || '若干'}，最短路径是补齐证据、claim 与 reflection。`,
      estimatedMinutes: Math.min(30, Math.max(15, task?.durationMinutes ?? 20)),
      tags: ['Task Workbench', 'draft', task?.category ?? '任务执行'],
      ctaLabel: '回到执行台草稿',
      action: () => onStartTask(taskId),
    })
  }

  if (incompleteModule) {
    recommendations.push({
      id: `continue-module:${incompleteModule.module.id}`,
      type: 'continue-module',
      typeLabel: 'Continue module',
      title: `继续单元模块：${incompleteModule.module.title}`,
      reason: `该模块已完成 ${incompleteModule.completedSteps}/${incompleteModule.totalSteps} steps，继续下一步能保留跨页学习路线的连贯性。`,
      estimatedMinutes: incompleteModule.module.steps.find((step) => !(taskModuleProgressState[incompleteModule.module.id] ?? []).includes(step.id))?.minutes ?? 20,
      tags: ['Modules', 'learning path', ...incompleteModule.module.tags.slice(0, 2)],
      ctaLabel: '打开单元模块',
      action: () => onSelectTasksSubpage('modules'),
    })
  }

  if ((labDraftCount + compareDraftCount + argumentDraftCount + workspaceStats.totalEntries + missionDraftCount >= 2) && synthesisDraftCount === 0) {
    const preset = synthesisInquiryPresets.find((candidate) => candidate.id === 'commodity-chains-labor') ?? synthesisInquiryPresets[0]

    recommendations.push({
      id: `synthesis-next:${preset?.id ?? 'default'}`,
      type: 'synthesis-next',
      typeLabel: 'Synthesize',
      title: '把已有草稿推进到综合写作',
      reason: `你已有 ${labDraftCount} 个 Labs 草稿、${compareDraftCount} 个 Compare 草稿、${workspaceStats.totalEntries} 个 workspace 条目或 scenario 草稿；适合合并为一个 Synthesis Brief。`,
      estimatedMinutes: 35,
      tags: ['Synthesis Studio', 'writing', 'evidence pool'],
      ctaLabel: '打开综合写作',
      action: () => onSelectLabsSubpage('synthesis'),
    })
  } else if (synthesisDraftCount > 0 || taskWorkbenchStats.completedCount > 0 || workspaceStats.completedEntries > 0 || moduleStats.completedCount > 0) {
    recommendations.push({
      id: 'portfolio-next',
      type: 'portfolio-next',
      typeLabel: 'Portfolio',
      title: '整理作品档案并导出阶段成果',
      reason: `已有可归档成果：${taskWorkbenchStats.completedCount} 个执行台完成项、${workspaceStats.completedEntries} 个跨场景完成项、${synthesisDraftCount} 个综合写作草稿。`,
      estimatedMinutes: 10,
      tags: ['Portfolio', 'archive', 'export'],
      ctaLabel: '打开作品档案',
      action: () => onSelectTasksSubpage('portfolio'),
    })
  }

  if (compareDraftCount === 0 && (missionDraftCount > 0 || completedMissionCount > 0 || workspaceStats.totalEntries > 0 || taskWorkbenchStats.activeCount > 0)) {
    recommendations.push({
      id: 'compare-bridge',
      type: 'compare-bridge',
      typeLabel: 'Compare bridge',
      title: '用 Compare Lab 连接第二个历史身份',
      reason: '你已经在一个任务或场景中留下学习痕迹；下一步可加入第二个身份，训练相同点、差异与证据边界。',
      estimatedMinutes: 25,
      tags: ['Compare Lab', 'second scenario', 'cross-era'],
      ctaLabel: '打开比较实验室',
      action: () => onSelectAtlasSubpage('compare'),
    })
  }

  if (!hasAnyLocalProgress) {
    const starterTask = getStarterTask(libraryTasks)
    const starterScenario = scenarios[0]

    recommendations.push({
      id: 'starter:first-task',
      type: 'starter',
      typeLabel: 'Start here',
      title: starterTask ? `从 15 分钟任务开始：${starterTask.title}` : `从一个身份开始：${starterScenario.title}`,
      reason: '当前本地还没有任务、Lab 或 workspace 草稿；先完成一个短任务，Learning Coach 后续会基于你的本地状态继续推荐。',
      estimatedMinutes: Math.min(20, starterTask?.durationMinutes ?? 15),
      tags: ['zero state', 'starter', starterTask?.sourceLabel ?? 'Scenario'],
      ctaLabel: starterTask ? '开始首个任务' : '打开首个身份',
      action: () => starterTask ? onStartTask(starterTask.id) : onSelectScenario(starterScenario.id, sectionIds.sceneReader),
    })

    recommendations.push({
      id: 'starter:discover',
      type: 'starter',
      typeLabel: 'Browse',
      title: '先浏览任务库集合',
      reason: '如果还不确定学习主题，可以从 Tasks Discovery 的集合筛选进入任务库，不需要新增历史场景或后端数据。',
      estimatedMinutes: 5,
      tags: ['Discovery', 'Task Library', 'local only'],
      ctaLabel: '查看任务库',
      action: () => onSelectTasksSubpage('library'),
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: 'fallback:portfolio',
      type: 'portfolio-next',
      typeLabel: 'Review',
      title: '复盘学习档案，选择下一份可提交作品',
      reason: '当前没有明显未完成草稿；建议检查 Portfolio 中的最近记录，决定要导出、修订还是开启新任务。',
      estimatedMinutes: 10,
      tags: ['Portfolio', 'review', 'next step'],
      ctaLabel: '打开作品档案',
      action: () => onSelectTasksSubpage('portfolio'),
    })
  }

  return recommendations.slice(0, 4)
}

const taskPacks: TaskPack[] = [
  {
    id: 'first-45-minutes',
    title: 'First 45 Minutes',
    audience: '第一次进入 TimeAtlas 的中学历史课堂 / 社团体验课',
    totalMinutes: 45,
    learningGoal: '用一个低门槛身份现场、一个来源判断和一个短出口产出，建立 TimeAtlas 的证据驱动学习流程。',
    finalDeliverable: '一张 45 分钟入门任务单：现场观察、来源边界、出口判断。',
    teacherNotes: '先用 quick / warmup 型任务降低进入门槛，再转向一条 source-based 任务，最后要求学生写出“我能确定 / 仍不确定”的出口判断。',
    studentInstructions: '按顺序完成任务；每一步只保留最关键的一条证据和一句解释，最后写出一个仍需要更多来源的问题。',
    rubricFocus: '进入情境、证据定位、来源边界、出口判断清晰度',
    tags: ['starter', '45 minutes', 'warmup', 'source-based'],
    coverage: ['Scenario entry', 'Source judgement', 'Exit ticket'],
    selectors: [
      { sources: ['lesson'], durationBands: ['short'], keywords: ['quick', '15', 'exit ticket', '快速'] },
      { sources: ['activity'], durationBands: ['short', 'medium'], keywords: ['warmup', 'source-lab', '观察', '来源'] },
      { sources: ['mission'], durationBands: ['short', 'medium'], keywords: ['evidence', 'source', '现场', '证据'] },
    ],
    fallbackKeywords: ['quick', 'warmup', 'source', 'evidence', 'exit ticket', '快速', '来源', '证据'],
  },
  {
    id: 'source-detective-workshop',
    title: 'Source Detective Workshop',
    audience: '史料阅读训练、小组互证课、研究型作业起步',
    totalMinutes: 60,
    learningGoal: '训练学生判断来源视角、可靠边界、互证关系和档案沉默，而不是把材料当作透明事实。',
    finalDeliverable: '一份 Source Detective evidence log：来源、可说明内容、可靠边界、需要互证的问题。',
    teacherNotes: '优先选择 source-based 任务；提醒学生每条来源必须同时写“能说明什么”和“不能说明什么”。',
    studentInstructions: '每完成一个任务，记录至少一条来源细节、一个可靠性判断和一个需要其他材料互证的问题。',
    rubricFocus: '来源判断、互证、缺席声音、不确定性表达',
    tags: ['source detective', 'corroboration', 'archive silence', 'evidence'],
    coverage: ['Source Atlas', 'Compare credibility', 'Archive silence'],
    selectors: [
      { taskIds: ['compare:source-credibility'] },
      { sources: ['activity'], sourceBasedOnly: true, keywords: ['source-lab', 'credibility', 'silence', '来源', '可靠'] },
      { sources: ['perspectives', 'significance', 'causation'], sourceBasedOnly: true, keywords: ['source', 'evidence', 'archive', 'silence', '来源', '证据', '档案', '沉默'] },
    ],
    fallbackKeywords: ['source', 'evidence', 'credibility', 'corroboration', 'archive', 'silence', '来源', '证据', '互证', '可靠', '档案', '沉默'],
  },
  {
    id: 'commodity-chains-labor',
    title: 'Commodity Chains & Labor',
    audience: '全球史、劳动史、工业化或奴隶制专题课',
    totalMinutes: 75,
    learningGoal: '解释糖、棉和港口商品链如何连接强制劳动、工厂时间、殖民监管和来源沉默。',
    finalDeliverable: '四站商品链劳动证据图 + 一段关于劳动纪律变化的历史论证。',
    teacherNotes: '让学生避免只说“全球贸易”，必须指出商品链怎样穿过身体、制度、时间纪律和档案。',
    studentInstructions: '把每个任务中的商品、劳动形式、制度约束和证据限制各记录一句，最后合成一条主张。',
    rubricFocus: '商品链因果、劳动纪律、跨场景连接、来源限制',
    tags: ['commodity chains', 'labor', 'sugar', 'cotton', 'causation'],
    coverage: ['Saint-Domingue', 'Manchester/Bombay', 'Causation', 'Synthesis'],
    selectors: [
      { taskIds: ['causation:commodity-empires-labor-discipline', 'periodization:commodity-chains-labor-time-periods', 'significance:commodity-chains-changing-worlds', 'synthesis:commodity-chains-labor'] },
      { scenarioIds: ['saint-domingue-sugar-worker', 'industrial-manchester-mill-worker', 'colonial-bombay-mill-worker'], keywords: ['sugar', 'cotton', 'labor', 'discipline', '糖', '棉', '劳动', '纪律'] },
      { sources: ['inquiry'], keywords: ['sugar', 'cotton', 'commodity', 'labor', '强制劳动', '商品'] },
    ],
    fallbackKeywords: ['commodity', 'sugar', 'cotton', 'labor', 'labour', 'discipline', 'coercion', '商品', '糖', '棉', '劳动', '强制', '纪律'],
  },
  {
    id: 'monsoon-ports-credit',
    title: 'Monsoon Ports & Credit',
    audience: '印度洋、海上亚洲、商业信用与中介角色专题课',
    totalMinutes: 75,
    learningGoal: '说明季风时间、信用文书、语言中介、港口名声和国家权力如何共同维持远距离交易。',
    finalDeliverable: '港口信用工作链：时间、文书、中介、风险、权力与证据边界。',
    teacherNotes: '把“贸易路线”改写为可执行交易机制：谁写信、谁担保、谁翻译、谁承担延误和政治风险。',
    studentInstructions: '在每个任务中标出一个信用机制、一个港口/季风风险和一个中介行动，再解释它们怎样连接。',
    rubricFocus: '情境尺度、信用机制、中介角色、风险与证据',
    tags: ['monsoon', 'ports', 'credit', 'intermediaries', 'context'],
    coverage: ['Fustat/Geniza', 'Kilwa', 'Malacca', 'Context/Causation'],
    selectors: [
      { taskIds: ['contextualization:monsoon-ports-intermediaries', 'causation:port-credit-distant-trade', 'periodization:port-credit-monsoon-world-periods', 'synthesis:markets-power-risk'] },
      { scenarioIds: ['fustat-geniza-merchant-apprentice', 'kilwa-swahili-gold-merchant', 'malacca-monsoon-port-broker'], keywords: ['monsoon', 'credit', 'letter', 'broker', 'port', '季风', '信用', '港口', '中介'] },
      { sources: ['inquiry'], keywords: ['monsoon', 'indian ocean', 'credit', 'geniza', 'port', '季风', '印度洋', '信用'] },
    ],
    fallbackKeywords: ['monsoon', 'port', 'credit', 'intermediary', 'broker', 'letter', 'contract', 'indian ocean', '季风', '港口', '信用', '中介', '书信', '合约'],
  },
  {
    id: 'nonwritten-evidence-archive-silence',
    title: 'Nonwritten Evidence & Archive Silence',
    audience: '史料方法、安第斯/美洲史、殖民档案与边缘声音专题课',
    totalMinutes: 75,
    learningGoal: '比较 khipu、考古、殖民编年和幸存档案怎样让制度劳动可见，同时让普通人的解释权沉默。',
    finalDeliverable: '“记录媒介—制度劳动—可见/沉默”证据图 + 谨慎历史解释。',
    teacherNotes: '提醒学生不要用想象填补空白；把非文字证据和档案沉默都当作需要说明的历史证据条件。',
    studentInstructions: '每一步写清楚：证据媒介是什么、能看见谁/什么劳动、看不见谁的声音、你的结论需要怎样限定。',
    rubricFocus: '非文字证据、档案沉默、来源限制、谨慎论证',
    tags: ['nonwritten evidence', 'khipu', 'archive silence', 'absent voices'],
    coverage: ['Cusco khipu', 'Archive silence', 'Perspectives', 'Synthesis'],
    selectors: [
      { taskIds: ['inquiry:nonwritten-records-archive-silence', 'inquiry:nonwritten-evidence-and-imperial-labor', 'perspectives:who-speaks-who-is-recorded', 'synthesis:archive-silence-significance'] },
      { taskIds: ['causation:archive-silence-causal-judgment', 'significance:archive-silence-changing-significance', 'contextualization:archive-context-visibility', 'periodization:archive-visibility-changes-periods'] },
      { scenarioIds: ['inca-cusco-khipu-runner'], sourceBasedOnly: true, keywords: ['khipu', 'quipu', 'nonwritten', 'archive', 'silence', 'mit’a', '结绳', '非文字', '档案', '沉默'] },
    ],
    fallbackKeywords: ['nonwritten', 'non-written', 'khipu', 'quipu', 'archive', 'silence', 'absent', 'mit’a', 'mita', 'source limits', '非文字', '结绳', '档案', '沉默', '缺席', '来源限制'],
  },
  {
    id: 'debate-to-argument',
    title: 'Debate to Argument',
    audience: '课堂讨论、角色辩论、论证写作前置课',
    totalMinutes: 60,
    learningGoal: '把角色立场、证据责任、反驳和来源限制从口头讨论转化为清晰历史论证。',
    finalDeliverable: '一份 debate-to-argument sheet：立场、证据、反驳、来源限制、修订后的主张段落。',
    teacherNotes: '先让学生进入角色和证据卡，再要求他们脱离表演，把讨论记录重写成可评价的历史主张。',
    studentInstructions: '在辩论任务中记录一条己方证据、一条对方证据和一个追问；最后把它们改写成主张—证据—反驳段落。',
    rubricFocus: '角色视角、证据支撑、反驳质量、论证清晰、来源限制',
    tags: ['debate', 'argument', 'counterclaim', 'synthesis'],
    coverage: ['Debate Studio', 'Roleplay', 'Evidence', 'Writing'],
    selectors: [
      { sources: ['debate'], keywords: ['debate', 'hearing', 'source challenge', 'forum', '辩论', '听证', '质询'] },
      { sources: ['activity', 'lesson'], keywords: ['debate', 'roleplay', 'discussion', 'argument', 'writing', '辩论', '角色', '讨论', '写作'] },
      { sources: ['synthesis'], keywords: ['argument', 'claim', 'counterargument', 'thesis', '论证', '主张', '反驳'] },
    ],
    fallbackKeywords: ['debate', 'roleplay', 'hearing', 'forum', 'argument', 'claim', 'counterargument', 'thesis', 'writing', '辩论', '角色', '讨论', '论证', '主张', '反驳', '写作'],
  },
]

function getTaskDiscoveryCollections(): TaskDiscoveryCollection[] {
  return [
    {
      id: 'first-visit-15',
      label: 'First visit · 15 分钟进入 TimeAtlas',
      reason: '给第一次打开 TimeAtlas 的学习者一个低门槛入口：身份定位、一个现场片段、一个出口判断。',
      audience: '首次体验、自主学习、课堂 warm-up',
      duration: '15 分钟以内',
      durationBand: 'short',
      matcher: (task) => task.durationMinutes <= 20 || taskMatchesAny(task, ['quick', '15', 'exit ticket', '快速', 'warmup', '现场']),
      secondaryAction: 'open-first',
    },
    {
      id: 'source-detective',
      label: 'Source Detective · 来源侦探',
      reason: '优先展示需要读来源、判断可靠边界、互证或标注不确定性的任务。',
      audience: '史料阅读训练、证据小课、研究型作业起步',
      duration: '30-45 分钟',
      durationBand: 'medium',
      sourceBasedOnly: true,
      matcher: (task) => task.sourceBased && taskMatchesAny(task, ['source', 'evidence', 'credibility', 'corroboration', '来源', '证据', '互证', '可靠', 'silence', '沉默']),
      secondaryAction: 'copy-first',
    },
    {
      id: 'compare-two-lives',
      label: 'Compare Two Lives · 比较两个普通人的一天',
      reason: '把两个身份放进同一比较镜头，训练相同/不同、尺度与证据边界。',
      audience: '比较史入门、小组讨论、跨场景写作',
      duration: '35-75 分钟',
      source: 'compare',
      matcher: (task) => task.source === 'compare' || task.source === 'inquiry' || taskMatchesAny(task, ['compare', '比较', 'two', '两个', 'daily life', 'ordinary']),
      secondaryAction: 'open-first',
    },
    {
      id: 'write-argument',
      label: 'Write an Argument · 写出历史论证',
      reason: '聚焦主张、证据、推理桥、反驳和来源限制，帮助学习者从摘记走向段落。',
      audience: '写作课、capstone、论文前置练习',
      duration: '45-75 分钟',
      matcher: (task) => task.source === 'synthesis' || taskMatchesAny(task, ['argument', 'thesis', 'claim', 'reasoning', 'synthesis', '论证', '主张', '写作', '段落']),
      secondaryAction: 'copy-first',
    },
    {
      id: 'classroom-ready',
      label: 'Classroom-ready · 可直接上课',
      reason: '筛出 Lesson Pack 与 Activity Pack 中结构清晰、材料和交付物明确的课堂任务。',
      audience: '教师备课、代课包、45 分钟课堂 chunk',
      duration: '15-45 分钟',
      matcher: (task) => task.source === 'lesson' || task.source === 'activity' || taskMatchesAny(task, ['classroom', 'lesson', 'activity', 'flow', 'pack', '课堂', '活动']),
      secondaryAction: 'copy-first',
    },
    {
      id: 'classroom-discussion-role-debate',
      label: 'Classroom Discussion · 角色辩论与听证',
      reason: '聚合 Debate Studio、Lesson Pack debate flow 与 Activity Pack roleplay/debate，用角色卡和证据卡组织课堂讨论。',
      audience: '课堂讨论、小组辩论、角色扮演、历史同理心训练',
      duration: '15-45 分钟',
      source: 'debate',
      matcher: (task) => task.source === 'debate' || taskMatchesAny(task, ['debate', 'roleplay', 'discussion', 'hearing', 'cross-examination', '辩论', '角色', '讨论', '听证', '质询']),
      secondaryAction: 'copy-first',
    },
    {
      id: 'labor-and-risk',
      label: 'Labor & Risk · 劳动、身体与风险',
      reason: '围绕工作节奏、纪律、安全、身体风险与协商空间组织任务。',
      audience: '劳动史、工业革命、风险/安全主题课',
      duration: '30-75 分钟',
      matcher: (task) => taskMatchesAny(task, ['labor', 'labour', 'risk', 'safety', 'discipline', 'factory', 'work', '劳动', '风险', '安全', '纪律', '工厂']),
      secondaryAction: 'open-first',
    },
    {
      id: 'markets-and-power',
      label: 'Markets & Power · 市场与权力',
      reason: '把交换、监管、税赋、信用、帝国压力和普通人的策略放在同一问题下。',
      audience: '经济史、全球史、市场不是自由真空讨论',
      duration: '35-75 分钟',
      matcher: (task) => taskMatchesAny(task, ['market', 'exchange', 'power', 'regulation', 'empire', 'trade', 'credit', '市场', '交换', '权力', '监管', '帝国', '贸易', '信用']),
      secondaryAction: 'open-first',
    },
    {
      id: 'archive-silence',
      label: 'Archive Silence · 档案沉默与缺席声音',
      reason: '训练学生把来源沉默写成分析对象，而不是用想象填补档案空白。',
      audience: '高阶史料课、奴隶制/殖民/边缘声音讨论',
      duration: '45-75 分钟',
      sourceBasedOnly: true,
      matcher: (task) => task.sourceBased && taskMatchesAny(task, ['silence', 'archive', 'absent', 'voices', 'limits', 'source limits', '沉默', '档案', '缺席', '来源限制']),
      secondaryAction: 'copy-first',
    },
    {
      id: 'nonwritten-evidence',
      label: 'Nonwritten Evidence · 非文字证据与记录劳动',
      reason: '聚合 khipu/quipu、安第斯考古、殖民编年和制度劳动可见性任务，训练学生比较非文字记录与文字档案的边界。',
      audience: '史料方法课、安第斯/美洲史、帝国行政与劳动制度讨论',
      duration: '30-75 分钟',
      matcher: (task) => taskMatchesAny(task, ['khipu', 'quipu', 'andes', 'andean', 'inca', 'record', 'archive', 'chronicle', 'archaeology', 'labor', 'labour', 'mit’a', 'mita', 'nonwritten', 'non-written', '结绳', '奇普', '印加', '安第斯', '记录', '档案', '编年', '考古', '劳动', '劳役', '米塔', '非文字', '非书面']),
      secondaryAction: 'open-first',
    },
  ]
}

function getMatchingTasksForPreset(tasks: LibraryTask[], preset: TaskLibraryPreset) {
  return tasks.filter((task) => {
    const matchesPreset = preset.matcher(task)
    const matchesDuration = !preset.durationBand || task.durationBand === preset.durationBand
    const matchesSource = !preset.source || task.source === preset.source
    const matchesSourceBased = !preset.sourceBasedOnly || task.sourceBased

    return matchesPreset && matchesDuration && matchesSource && matchesSourceBased
  })
}

function taskMatchesSelector(task: LibraryTask, selector: TaskPackSelector) {
  const matchesTaskId = !selector.taskIds?.length || selector.taskIds.includes(task.id)
  const matchesSource = !selector.sources?.length || selector.sources.includes(task.source)
  const matchesScenario = !selector.scenarioIds?.length || (task.scenarioId ? selector.scenarioIds.includes(task.scenarioId) : false)
  const matchesDuration = !selector.durationBands?.length || selector.durationBands.includes(task.durationBand)
  const matchesSourceBased = !selector.sourceBasedOnly || task.sourceBased
  const matchesKeywords = !selector.keywords?.length || taskMatchesAny(task, selector.keywords)

  return matchesTaskId && matchesSource && matchesScenario && matchesDuration && matchesSourceBased && matchesKeywords
}

function getTaskPackTasks(pack: TaskPack, libraryTasks: LibraryTask[]) {
  const tasksById = new Map(libraryTasks.map((task) => [task.id, task]))
  const selectedTasks: LibraryTask[] = []
  const selectedTaskIds = new Set<string>()

  function addTask(task: LibraryTask | undefined) {
    if (!task || selectedTaskIds.has(task.id) || selectedTasks.length >= 6) {
      return
    }

    selectedTasks.push(task)
    selectedTaskIds.add(task.id)
  }

  pack.selectors.forEach((selector) => {
    selector.taskIds?.forEach((taskId) => addTask(tasksById.get(taskId)))
  })

  pack.selectors.forEach((selector) => {
    libraryTasks.filter((task) => taskMatchesSelector(task, selector)).forEach(addTask)
  })

  if (selectedTasks.length < Math.min(3, libraryTasks.length)) {
    libraryTasks.filter((task) => taskMatchesAny(task, pack.fallbackKeywords)).forEach(addTask)
  }

  if (selectedTasks.length < Math.min(3, libraryTasks.length)) {
    libraryTasks.filter((task) => pack.tags.some((tag) => task.searchText.includes(tag.toLowerCase()))).forEach(addTask)
  }

  return selectedTasks.slice(0, 6)
}

function buildTaskPackDraft(pack: TaskPack, tasks: LibraryTask[]): AssignmentBuilderDraft {
  return {
    selectedTaskIds: tasks.slice(0, 6).map((task) => task.id),
    title: pack.title,
    audience: pack.audience,
    timeBox: `${pack.totalMinutes} 分钟（匹配任务合计 ${tasks.reduce((total, task) => total + task.durationMinutes, 0)} 分钟，可按课堂节奏裁剪）`,
    learningGoal: pack.learningGoal,
    finalDeliverable: pack.finalDeliverable,
    teacherNotes: pack.teacherNotes,
    studentInstructions: pack.studentInstructions,
    rubricFocus: pack.rubricFocus,
    updatedAt: new Date().toISOString(),
  }
}

function formatTaskPackSheet(pack: TaskPack, tasks: LibraryTask[]) {
  const taskTotalMinutes = tasks.reduce((total, task) => total + task.durationMinutes, 0)
  const sourceLabels = [...new Set(tasks.map((task) => task.sourceLabel))]
  const scenarioCoverage = [...new Set(tasks.map((task) => task.scenarioId ? getScenarioById(task.scenarioId)?.title ?? task.scenarioId : task.context).filter(Boolean))]

  return [
    `TimeAtlas Task Pack：${pack.title}`,
    `适用对象：${pack.audience}`,
    `建议时间：${pack.totalMinutes} 分钟（匹配任务合计 ${taskTotalMinutes} 分钟）`,
    `学习目标：${pack.learningGoal}`,
    `最终交付物：${pack.finalDeliverable}`,
    `覆盖：${pack.coverage.join('、')}`,
    `标签：${pack.tags.join('、')}`,
    `来源类别：${sourceLabels.join('、') || '暂无匹配'}`,
    `场景覆盖：${scenarioCoverage.join('、') || '跨场景 / 通用任务'}`,
    '',
    '任务序列（最多 6 个）：',
    ...tasks.slice(0, 6).map((task, index) => [
      `${index + 1}. ${task.title}（${task.durationMinutes} 分钟｜${task.sourceLabel}｜${task.category}）`,
      `   情境：${task.context}`,
      `   任务：${task.summary}`,
      `   交付物：${task.deliverable}`,
    ].join('\n')),
    tasks.length ? '' : '- 当前任务库未匹配到任务，请在 Assignment Builder 中手动补充。',
    '教师说明：',
    pack.teacherNotes,
    '',
    '学生说明：',
    pack.studentInstructions,
    '',
    `评分关注：${pack.rubricFocus}`,
  ].join('\n')
}

function scrollToSection(hash: string, prefersReducedMotion: boolean | null) {
  if (typeof window === 'undefined') {
    return
  }

  window.requestAnimationFrame(() => {
    document.getElementById(hash)?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  })
}

function getOpenScenarioHash(source?: TaskLibrarySource): ScenarioSectionId {
  if (source === 'mission') {
    return sectionIds.missionBoard
  }

  if (source === 'activity') {
    return sectionIds.activityPacks
  }

  if (source === 'lesson') {
    return sectionIds.lessonPack
  }

  if (source === 'actor-network') {
    return sectionIds.actorNetwork
  }

  return defaultScenarioSectionId
}

function getPageFromValue(value: string | null): PageId | null {
  if (legacyLabPageIds.includes(value as LabsSubpage)) {
    return 'labs'
  }

  return pageIds.includes(value as PageId) ? value as PageId : null
}

function getLabsSubpageFromValue(value: string | null): LabsSubpage | null {
  return legacyLabPageIds.includes(value as LabsSubpage) ? value as LabsSubpage : null
}

function inferPageFromHash(hash: string): PageId {
  const normalizedHash = hash.replace(/^#/, '')

  const scenarioHashes = [
    sectionIds.sceneReader,
    sectionIds.lessonPack,
    sectionIds.activityPacks,
    sectionIds.missionBoard,
    sectionIds.actorNetwork,
    sectionIds.decisionPanel,
    sectionIds.argumentStudio,
    sectionIds.sourceReader,
    sectionIds.dailyLife,
    sectionIds.experience,
  ] as string[]

  if (scenarioHashes.includes(normalizedHash)) {
    return 'scenario'
  }

  if (evidenceSubpages.some((item) => item.hash === normalizedHash)) return 'evidence'
  if (labsSubpages.some((item) => item.hash === normalizedHash)) return 'labs'
  if (['time-space-atlas', 'atlas-missions', 'atlas-inquiry-paths', sectionIds.compareLab].includes(normalizedHash)) return 'atlas'
  if (tasksSubpages.some((item) => item.hash === normalizedHash)) return 'tasks'
  if (normalizedHash === 'about') return 'about'

  return 'home'
}

function getScenarioTabFromHash(hash: string | null): ScenarioExperienceTab {
  const normalizedHash = (hash ?? '').replace(/^#/, '')

  if (normalizedHash === sectionIds.sceneReader) return 'scenes'
  if (normalizedHash === sectionIds.dailyLife) return 'daily'
  if (normalizedHash === sectionIds.lessonPack) return 'lesson'
  if (normalizedHash === sectionIds.activityPacks) return 'activities'
  if (normalizedHash === sectionIds.missionBoard) return 'missions'
  if (normalizedHash === sectionIds.actorNetwork) return 'actors'
  if (normalizedHash === sectionIds.decisionPanel) return 'decision'
  if (normalizedHash === sectionIds.sourceReader) return 'sources'
  if (normalizedHash === sectionIds.argumentStudio) return 'argument'

  return 'overview'
}

function getHashForScenarioTab(tab: ScenarioExperienceTab): ScenarioSectionId {
  return scenarioExperienceTabs.find((item) => item.id === tab)?.hash ?? sectionIds.experience
}


function getEvidenceSubpageFromHash(hash: string | null): EvidenceSubpage {
  const normalizedHash = (hash ?? '').replace(/^#/, '')

  return evidenceSubpages.find((item) => item.hash === normalizedHash)?.id ?? 'source-atlas'
}

function getHashForEvidenceSubpage(subpage: EvidenceSubpage) {
  return evidenceSubpages.find((item) => item.id === subpage)?.hash ?? 'source-atlas'
}

function getAtlasSubpageFromHash(hash: string | null): AtlasSubpage {
  const normalizedHash = (hash ?? '').replace(/^#/, '')

  if (normalizedHash === 'atlas-missions') return 'missions'
  if (normalizedHash === 'atlas-inquiry-paths') return 'pathways'
  if (normalizedHash === sectionIds.compareLab) return 'compare'

  return 'routes'
}

function getHashForAtlasSubpage(subpage: AtlasSubpage) {
  return atlasSubpages.find((item) => item.id === subpage)?.hash ?? 'time-space-atlas'
}

function getLabsSubpageFromHash(hash: string | null): LabsSubpage {
  const normalizedHash = (hash ?? '').replace(/^#/, '')

  return labsSubpages.find((item) => item.hash === normalizedHash)?.id ?? 'causation'
}

function getHashForLabsSubpage(subpage: LabsSubpage) {
  return labsSubpages.find((item) => item.id === subpage)?.hash ?? sectionIds.causationLab
}

function getTasksSubpageFromHash(hash: string | null): TasksSubpage {
  const normalizedHash = (hash ?? '').replace(/^#/, '')

  return tasksSubpages.find((item) => item.hash === normalizedHash)?.id ?? 'discover'
}

function getHashForTasksSubpage(subpage: TasksSubpage) {
  return tasksSubpages.find((item) => item.id === subpage)?.hash ?? 'task-discovery'
}

function getInitialPage() {
  if (typeof window === 'undefined') {
    return 'home' as PageId
  }

  const pageFromHash = inferPageFromHash(window.location.hash)

  if (pageFromHash === 'labs') {
    return 'labs'
  }

  return getPageFromValue(new URLSearchParams(window.location.search).get('page')) ?? pageFromHash
}

function buildPageUrl(page: PageId, hash?: string) {
  if (typeof window === 'undefined') {
    return `?page=${page}${hash ? `#${hash}` : ''}`
  }

  const url = new URL(window.location.href)
  url.searchParams.set('page', page)
  url.hash = hash ?? ''

  return `${url.pathname}${url.search}${url.hash}`
}

function buildScenarioUrl(scenarioId: string, hash: ScenarioSectionId = defaultScenarioSectionId) {
  if (typeof window === 'undefined') {
    return `?page=scenario&scenario=${scenarioId}#${hash}`
  }

  const url = new URL(window.location.href)
  url.searchParams.set('page', 'scenario')
  url.searchParams.set('scenario', scenarioId)
  url.searchParams.delete('option')
  url.hash = hash

  return `${url.pathname}${url.search}${url.hash}`
}


function getTaskModuleCompletedDetails(progressState: TaskModuleProgressState) {
  return taskModules
    .map((module) => {
      const checkedStepIds = progressState[module.id] ?? []
      const completedSteps = module.steps.filter((step) => checkedStepIds.includes(step.id)).length

      return {
        module,
        completedSteps,
        totalSteps: module.steps.length,
        isComplete: completedSteps === module.steps.length,
        hasProgress: completedSteps > 0,
      }
    })
    .filter((detail) => detail.hasProgress)
}

function getTaskModuleProgressStats(progressState: TaskModuleProgressState) {
  const details = getTaskModuleCompletedDetails(progressState)

  return {
    startedCount: details.length,
    completedCount: details.filter((detail) => detail.isComplete).length,
    checkedStepCount: details.reduce((count, detail) => count + detail.completedSteps, 0),
    totalStepCount: taskModules.reduce((count, module) => count + module.steps.length, 0),
    details,
  }
}

function getTaskModuleActionTargetLabel(action: TaskModuleAction) {
  if (action.type === 'scenario') {
    return `Scenario #${action.hash ?? defaultScenarioSectionId}`
  }

  if (action.type === 'atlas') {
    return `Atlas #${action.hash}`
  }

  if (action.type === 'labs') {
    return `Labs / ${labsSubpages.find((item) => item.id === action.lab)?.label ?? action.lab}`
  }

  if (action.type === 'evidence') {
    return 'Evidence Atlas'
  }

  return 'Synthesis Studio'
}

function formatTaskModuleSheet(module: TaskModule, checkedStepIds: string[] = []) {
  const moduleScenarios = module.scenarioIds.map((id) => getScenarioById(id)).filter((scenario): scenario is Scenario => Boolean(scenario))
  const completedSteps = module.steps.filter((step) => checkedStepIds.includes(step.id)).length

  return [
    `TimeAtlas Task Module / 单元模块：${module.title}`,
    module.subtitle,
    `总时长：${module.totalMinutes} 分钟`,
    `进度：${completedSteps}/${module.steps.length} steps`,
    `Driving question：${module.drivingQuestion}`,
    '',
    '场景路径：',
    ...(moduleScenarios.length ? moduleScenarios.map((scenario) => `- ${scenario.title}（${scenario.era}｜${scenario.location}）`) : ['- 尚未匹配场景']),
    '',
    '模块步骤：',
    ...module.steps.map((step, index) => `- [${checkedStepIds.includes(step.id) ? 'x' : ' '}] ${index + 1}. ${step.title}（${step.minutes} 分钟｜${getTaskModuleActionTargetLabel(step.action)}）：${step.description}`),
    '',
    '标签：',
    ...module.tags.map((tag) => `- ${tag}`),
    '',
    `最终交付物：${module.finalDeliverable}`,
  ].join('\n')
}

function formatGenericLibraryTaskSheet(task: LibraryTask) {
  const checklist = getTaskWorkbenchChecklist(task)
  const evidencePrompts = getTaskWorkbenchEvidencePrompts(task)

  return [
    `TimeAtlas Task Library / Assignment Launcher 11.0：${task.title}`,
    `来源：${task.sourceLabel}`,
    `情境：${task.context}`,
    `类别：${task.category}`,
    `时长：${task.durationMinutes} 分钟（${getDurationBandLabel(task.durationBand)}）`,
    `来源型任务：${task.sourceBased ? '是' : '否'}`,
    '',
    `任务摘要：${task.summary}`,
    `交付物：${task.deliverable}`,
    '',
    '执行清单：',
    ...checklist.map((item, index) => `${index + 1}. ${item}`),
    '',
    '证据提示：',
    ...evidencePrompts.map((item, index) => `${index + 1}. ${item}`),
    '',
    '标签：',
    ...(task.tags.length ? task.tags.map((tag) => `- ${tag}`) : ['- 无']),
  ].join('\n')
}

function formatLessonFlowSheet(scenario: Scenario, mode: LessonPackMode) {
  const flow = scenario.lessonPack.classroomFlow[mode]

  return [
    `TimeAtlas Lesson Flow · ${flow.title}`,
    `${scenario.title}（${scenario.era}，${scenario.location}）`,
    '',
    `模式：${lessonPackModeLabels[mode]}`,
    `探究问题：${scenario.lessonPack.inquiryQuestion}`,
    '',
    'Quick start：',
    ...scenario.lessonPack.quickStart.map((step, index) => `${index + 1}. ${step}`),
    '',
    '课堂流程：',
    ...flow.steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    'Check questions：',
    ...scenario.lessonPack.checkQuestions.map((item, index) => `${index + 1}. ${item.question}`),
    '',
    'Exit tickets：',
    ...scenario.lessonPack.exitTickets.map((ticket, index) => `${index + 1}. ${ticket}`),
  ].join('\n')
}


type DebateRoleCard = {
  title: string
  stance: string
  brief: string
  speakingMove: string
}

type DebateEvidenceCard = {
  id: string
  title: string
  sourceLabel: string
  claimUse: string
  reliabilityNote: string
  tags: string[]
}

type DebateRound = {
  title: string
  minutes: number
  teacherMove: string
  studentMove: string
}

const debateModeLabels: Record<DebateMode, string> = {
  'decision-hearing': 'Decision Hearing / 决策听证',
  'source-challenge': 'Source Challenge / 史料质询',
  'cross-era-forum': 'Cross-era Forum / 跨时代论坛',
}

const debateModeDescriptions: Record<DebateMode, string> = {
  'decision-hearing': '围绕历史岔路口选项组织立场陈述、交叉追问和限制条件判断。',
  'source-challenge': '让学生先质询来源视角、可靠边界和缺席声音，再提出可辩护主张。',
  'cross-era-forum': '把当前身份放入更大的时代问题中，练习跨场景比较与尺度转换。',
}

function buildDebateRoleCards(scenario: Scenario, mode: DebateMode): DebateRoleCard[] {
  const lessonRoles = scenario.lessonPack.discussionRoles.map((role): DebateRoleCard => ({
    title: role.role,
    stance: mode === 'source-challenge' ? '史料质询者' : '课堂讨论角色',
    brief: role.task,
    speakingMove: mode === 'source-challenge'
      ? '发言时必须指出一条来源能证明什么、不能证明什么。'
      : '发言时先说明自己代表的利益、知识限制或风险。',
  }))

  const decisionRoles = scenario.decision.options.map((option): DebateRoleCard => ({
    title: option.label,
    stance: option.stance,
    brief: option.description,
    speakingMove: `用“如果选择 ${option.label}，短期会……但长期可能……”组织发言。`,
  }))

  if (mode === 'cross-era-forum') {
    return [
      ...lessonRoles.slice(0, 3),
      {
        title: `${scenario.identity} 的时代证人`,
        stance: scenario.era,
        brief: scenario.summary,
        speakingMove: '把个人经验连接到制度、市场、风险或知识传播的长期变化。',
      },
      ...decisionRoles.slice(0, 2),
    ]
  }

  return [...lessonRoles, ...decisionRoles]
}

function buildDebateEvidenceCards(scenario: Scenario): DebateEvidenceCard[] {
  const sourceCards = scenario.sources.slice(0, 4).map((source, index): DebateEvidenceCard => ({
    id: `source:${index}:${source.title}`,
    title: source.title,
    sourceLabel: `${sourceTypeLabels[source.sourceType]} · ${source.creator}`,
    claimUse: source.excerpt,
    reliabilityNote: source.reliabilityNote,
    tags: source.evidenceTags,
  }))

  const sceneCards = scenario.sceneBeats.slice(0, 3).map((beat, index): DebateEvidenceCard => ({
    id: `scene:${index}:${beat.title}`,
    title: `${beat.timeLabel} · ${beat.title}`,
    sourceLabel: 'Scene Reader 9.0',
    claimUse: `${beat.historicalTension} ${beat.evidenceHook}`,
    reliabilityNote: beat.learnerPrompt,
    tags: ['scene beat', 'historical tension', ...beat.linkedSourceTitles.slice(0, 2)],
  }))

  const contextCards: DebateEvidenceCard[] = [
    {
      id: `real-history:${scenario.id}`,
      title: '真实历史对照',
      sourceLabel: 'Real history',
      claimUse: scenario.realHistory,
      reliabilityNote: '用于校正角色扮演中的过度想象；不能把结果倒推成当时每个人都知道。',
      tags: ['real history', 'context', scenario.theme],
    },
    {
      id: `interpretation:${scenario.id}`,
      title: '解释边界',
      sourceLabel: 'Interpretation note',
      claimUse: scenario.interpretationNote,
      reliabilityNote: scenario.sourceEvidenceUse,
      tags: ['source limits', 'interpretation', scenario.region],
    },
  ]

  return [...sourceCards, ...sceneCards, ...contextCards]
}

function buildDebateRounds(mode: DebateMode, duration: DebateDuration): DebateRound[] {
  const plans: Record<DebateDuration, number[]> = {
    15: [2, 3, 4, 4, 2],
    30: [4, 6, 7, 8, 5],
    45: [5, 9, 10, 12, 9],
  }
  const [setupMinutes, evidenceMinutes, exchangeMinutes, decisionMinutes, reflectionMinutes] = plans[duration]

  const modeMoves: Record<DebateMode, { evidence: string; exchange: string; decision: string }> = {
    'decision-hearing': {
      evidence: '教师要求每个立场至少绑定一条来源或 scene beat，不许只讲现代价值判断。',
      exchange: '学生用“约束—选择—后果”追问对方方案，记录最强反方理由。',
      decision: '全班投票前先写下“我会怎么选，以及我不确定什么”。',
    },
    'source-challenge': {
      evidence: '教师先分配来源卡，要求学生标注视角、可靠边界和缺席声音。',
      exchange: '每次质询必须引用一条证据，并说明它支持、削弱或限制了哪种主张。',
      decision: '小组提交“可辩护主张 + 来源限制”，而不是单纯胜负判断。',
    },
    'cross-era-forum': {
      evidence: '教师把当前身份连接到跨时代问题：市场、劳动、风险、知识或档案沉默。',
      exchange: '学生代表不同角色解释同一历史压力如何在不同位置上被感受。',
      decision: '论坛用一个比较句收束：这个案例如何改变我们对更大历史主题的理解？',
    },
  }

  return [
    {
      title: '开场定位 / Frame the question',
      minutes: setupMinutes,
      teacherMove: '说明场景、身份和辩论规则：必须引用证据，必须承认限制。',
      studentMove: '选择或领取角色，写下一句初始立场。',
    },
    {
      title: '证据准备 / Evidence prep',
      minutes: evidenceMinutes,
      teacherMove: modeMoves[mode].evidence,
      studentMove: '从证据卡中选择 2 条最能支持自己角色的材料，并记录一条风险或反证。',
    },
    {
      title: '交叉质询 / Cross-examination',
      minutes: exchangeMinutes,
      teacherMove: modeMoves[mode].exchange,
      studentMove: '轮流用证据发问、回应和修正立场。',
    },
    {
      title: '立场裁决 / Deliberation',
      minutes: decisionMinutes,
      teacherMove: modeMoves[mode].decision,
      studentMove: '形成小组结论：主张、证据、限制条件、仍需什么来源。',
    },
    {
      title: '出口反思 / Exit reflection',
      minutes: reflectionMinutes,
      teacherMove: '收束到真实历史对照，提醒学生区分历史同理心与当下投射。',
      studentMove: '完成一句 exit ticket：我改变了什么判断？哪条证据最关键？',
    },
  ]
}

function formatDebateStudentWorksheet(scenario: Scenario, mode: DebateMode, duration: DebateDuration) {
  const roles = buildDebateRoleCards(scenario, mode)
  const evidenceCards = buildDebateEvidenceCards(scenario)
  const rounds = buildDebateRounds(mode, duration)

  return [
    `TimeAtlas Debate Studio / 学生辩论工作纸：${scenario.title}`,
    `模式：${debateModeLabels[mode]}`,
    `时长：${duration} 分钟`,
    `辩题：${scenario.decision.prompt}`,
    `历史情境：${scenario.decision.context}`,
    '',
    '我的角色：________________',
    '初始立场：________________',
    '我必须承认的限制条件：________________',
    '',
    '可选角色卡：',
    ...roles.map((role, index) => `${index + 1}. ${role.title}｜${role.stance}：${role.brief}（发言动作：${role.speakingMove}）`),
    '',
    '证据卡（选择至少 2 条）：',
    ...evidenceCards.map((card, index) => `${index + 1}. ${card.title}｜${card.sourceLabel}：${card.claimUse}｜边界：${card.reliabilityNote}`),
    '',
    '回合计划：',
    ...rounds.map((round, index) => `${index + 1}. ${round.title}（${round.minutes} 分钟）：${round.studentMove}`),
    '',
    '最终发言结构：',
    '1. 我的主张是……',
    '2. 最关键证据是……它能证明……',
    '3. 这条证据/我的角色看不见……',
    '4. 听完质询后，我仍然认为/我修正为……',
  ].join('\n')
}

function formatDebateTeacherGuide(scenario: Scenario, mode: DebateMode, duration: DebateDuration) {
  const rounds = buildDebateRounds(mode, duration)
  const roleCards = buildDebateRoleCards(scenario, mode)
  const evidenceCards = buildDebateEvidenceCards(scenario)

  return [
    `TimeAtlas Debate Studio / 教师指南：${scenario.title}`,
    `模式：${debateModeLabels[mode]}｜${duration} 分钟`,
    `适用问题：${scenario.lessonPack.inquiryQuestion}`,
    '',
    '教师目标：',
    `- ${debateModeDescriptions[mode]}`,
    '- 让学生用证据辩论，而不是表演式站队。',
    '- 每轮都追问：这条来源能证明什么？不能证明什么？',
    '',
    '快速准备：',
    ...scenario.lessonPack.quickStart.map((step, index) => `${index + 1}. ${step}`),
    '',
    '角色配置：',
    ...roleCards.map((role) => `- ${role.title}｜${role.stance}：${role.brief}`),
    '',
    '证据配置：',
    ...evidenceCards.map((card) => `- ${card.title}｜${card.sourceLabel}｜${card.tags.slice(0, 4).join('、')}`),
    '',
    '课堂回合：',
    ...rounds.map((round, index) => `${index + 1}. ${round.title}（${round.minutes}m）\n   教师动作：${round.teacherMove}\n   学生动作：${round.studentMove}`),
    '',
    '评价关注：',
    '- 是否把角色立场放回当时的知识、风险和制度限制中。',
    '- 是否至少引用两条证据并说明可靠边界。',
    '- 是否能复述一个强反方理由，而不是只重复己方结论。',
    '- 是否用真实历史对照修正过度想象或当下主义。',
    '',
    'Exit tickets：',
    ...scenario.lessonPack.exitTickets.map((ticket, index) => `${index + 1}. ${ticket}`),
  ].join('\n')
}

function formatDebateLibraryTaskSheet(scenario: Scenario, mode: DebateMode, duration: DebateDuration) {
  return [
    `TimeAtlas Debate Workflow：${scenario.title}`,
    `模式：${debateModeLabels[mode]}`,
    `时长：${duration} 分钟`,
    `辩题：${scenario.decision.prompt}`,
    `交付物：角色立场卡、2 条证据引用、交叉质询记录、出口判断`,
    '',
    formatDebateStudentWorksheet(scenario, mode, duration),
  ].join('\n')
}

function buildGuidedSessionRoutes() {
  return scenarios.flatMap((scenario, scenarioIndex): GuidedSessionRoute[] => {
    const quickMission = scenario.missions[0]
    const sourceMission = scenario.missions.find((mission) => mission.linkedSourceTitles.length > 0) ?? quickMission
    const activity = scenario.activityPacks[0]
    const sourceActivity = scenario.activityPacks.find((candidate) => candidate.mode === 'source-lab') ?? scenario.activityPacks[1] ?? activity
    const comparePath = atlasInquiryPaths.find((path) => path.scenarioIds.includes(scenario.id))
    const compareScenario = comparePath?.scenarioIds
      .map((id) => getScenarioById(id))
      .find((candidate): candidate is Scenario => Boolean(candidate && candidate.id !== scenario.id))
      ?? scenarios.find((candidate) => candidate.id !== scenario.id)
      ?? scenario
    const keyScene = scenario.sceneBeats[0]
    const routePrefix = `guided:${scenario.id}`

    return [
      {
        id: `${routePrefix}:15`,
        title: `${scenario.title} · 15 分钟快速进入`,
        minutes: 15,
        scenario,
        purpose: '用一个身份卡、一个 scene beat 和一个快速选择建立历史现场感。',
        steps: [
          { title: '定位身份与时代', minutes: 3, description: `${scenario.era} / ${scenario.location} / ${scenario.identity}`, hash: sectionIds.experience },
          { title: '朗读关键场景', minutes: 5, description: keyScene ? `${keyScene.title}：${keyScene.learnerPrompt}` : scenario.atmosphere, hash: sectionIds.sceneReader },
          { title: '完成一个出口判断', minutes: 4, description: scenario.lessonPack.exitTickets[0] ?? scenario.lessonPack.inquiryQuestion, hash: sectionIds.lessonPack },
          { title: '选择一个行动', minutes: 3, description: scenario.decision.prompt, hash: sectionIds.decisionPanel },
        ],
        resources: [scenario.lessonPack.inquiryQuestion, keyScene?.title, scenario.decision.prompt].filter((item): item is string => Boolean(item)),
        linkedSourceTitles: scenario.sources.slice(0, 1).map((source) => source.title),
        deliverable: '一句 60 字出口判断 + 一个历史选择。',
      },
      {
        id: `${routePrefix}:30`,
        title: `${scenario.title} · 30 分钟证据小课`,
        minutes: 30,
        scenario,
        purpose: '把 Scene Reader、来源卡和一个任务串成可提交的证据说明。',
        steps: [
          { title: '读取场景张力', minutes: 6, description: keyScene ? keyScene.evidenceHook : scenario.sourceEvidenceUse, hash: sectionIds.sceneReader },
          { title: '检查来源边界', minutes: 8, description: scenario.sources[0]?.sourceQuestion ?? scenario.interpretationNote, hash: sectionIds.sourceReader },
          { title: '完成任务步骤', minutes: 12, description: sourceMission?.instruction ?? '选择一个来源型任务并写出证据链。', hash: sectionIds.missionBoard },
          { title: '复制或保存学习输出', minutes: 4, description: sourceMission?.deliverable ?? '复制学习输出用于课堂讨论。', hash: sectionIds.missionBoard },
        ],
        resources: [keyScene?.title, scenario.sources[0]?.title, sourceMission?.title].filter((item): item is string => Boolean(item)),
        linkedSourceTitles: sourceMission?.linkedSourceTitles.length ? sourceMission.linkedSourceTitles : scenario.sources.slice(0, 2).map((source) => source.title),
        deliverable: sourceMission?.deliverable ?? '一段来源型证据说明。',
      },
      {
        id: `${routePrefix}:45`,
        title: `${scenario.title} · 45 分钟活动工作坊`,
        minutes: 45,
        scenario,
        purpose: '把 lesson flow、activity pack、任务草稿与论证工作室连成一个完整课堂 chunk。',
        steps: [
          { title: '启动课堂流程', minutes: 8, description: scenario.lessonPack.classroomFlow.source.title, hash: sectionIds.lessonPack },
          { title: '开展活动包', minutes: Math.min(sourceActivity?.durationMinutes ?? 16, 18), description: sourceActivity?.prompt ?? activity?.prompt ?? scenario.lessonPack.inquiryQuestion, hash: sectionIds.activityPacks },
          { title: '写入任务草稿', minutes: 12, description: quickMission?.instruction ?? '选择任务并写下证据、推论和疑问。', hash: sectionIds.missionBoard },
          { title: '生成主张证据', minutes: 7, description: '在 Argument Studio 勾选材料，形成主张—证据—推理。', hash: sectionIds.argumentStudio },
        ],
        resources: [scenario.lessonPack.classroomFlow.source.title, sourceActivity?.title, quickMission?.title, 'Evidence-to-Argument Studio'].filter((item): item is string => Boolean(item)),
        linkedSourceTitles: [...new Set([...(sourceActivity?.linkedSourceTitles ?? []), ...scenario.sources.slice(0, 2).map((source) => source.title)])],
        deliverable: sourceActivity?.deliverable ?? quickMission?.deliverable ?? '一份活动单草稿 + 论证起点。',
      },
      {
        id: `${routePrefix}:75`,
        title: `${scenario.title} · 75 分钟跨场景探究`,
        minutes: 75,
        scenario,
        purpose: '从当前身份出发，加入第二个身份和 Compare Lab，完成一份跨场景比较作业。',
        steps: [
          { title: '快速进入当前身份', minutes: 10, description: scenario.summary, hash: sectionIds.experience },
          { title: '完成来源与任务准备', minutes: 18, description: sourceMission?.instruction ?? scenario.sourceEvidenceUse, hash: sectionIds.missionBoard },
          { title: '连接第二个身份', minutes: 15, description: `对照：${compareScenario.title}（${compareScenario.era}）`, hash: sectionIds.sceneReader },
          { title: '载入比较镜头', minutes: 22, description: comparePath ? comparePath.drivingQuestion : compareLenses[scenarioIndex % compareLenses.length].prompt, hash: sectionIds.compareLab },
          { title: '导出比较作业', minutes: 10, description: comparePath?.subtitle ?? '复制 Compare Lab 作业并写出综合判断。', hash: sectionIds.compareLab },
        ],
        resources: [sourceMission?.title, compareScenario.title, comparePath?.title ?? 'Compare Lab', scenario.sources[0]?.title].filter((item): item is string => Boolean(item)),
        linkedSourceTitles: [...new Set([...(sourceMission?.linkedSourceTitles ?? []), ...scenario.sources.slice(0, 2).map((source) => source.title), ...compareScenario.sources.slice(0, 1).map((source) => source.title)])],
        deliverable: comparePath?.tasks[0] ?? `比较 ${scenario.title} 与 ${compareScenario.title} 的证据作业。`,
      },
    ]
  })
}

function formatGuidedSessionRoute(route: GuidedSessionRoute, checkedStepIds: string[] = []) {
  return [
    `TimeAtlas Guided Session Builder：${route.title}`,
    `建议时长：${route.minutes} 分钟`,
    `当前场景：${route.scenario.title}（${route.scenario.era}，${route.scenario.location}）`,
    `目标：${route.purpose}`,
    '',
    '健康分块步骤：',
    ...route.steps.map((step, index) => `- [${checkedStepIds.includes(`${route.id}:step:${index}`) ? 'x' : ' '}] ${index + 1}. ${step.title}（${step.minutes} 分钟）#${step.hash}：${step.description}`),
    '',
    '关联当前场景资源：',
    ...(route.resources.length ? route.resources.map((resource) => `- ${resource}`) : ['- 当前身份卡与场景摘要']),
    '',
    '关联来源：',
    ...(route.linkedSourceTitles.length ? route.linkedSourceTitles.map((title) => `- ${title}`) : ['- 当前场景来源层']),
    '',
    `交付物：${route.deliverable}`,
  ].join('\n')
}

function formatCompareLensTemplate(lens: CompareLens) {
  return [
    `TimeAtlas Compare Lens Template：${lens.title}`,
    `Short label：${lens.shortLabel}`,
    '',
    `说明：${lens.description}`,
    `作业提示：${lens.prompt}`,
    '',
    '证据清单：',
    ...lens.evidenceChecklist.map((item) => `- ${item}`),
    '',
    '输出结构：',
    ...lens.outputTemplate.map((item, index) => `${index + 1}. ${item}`),
    '',
    '评分标准：',
    ...lens.rubric.map((item) => `- ${item}`),
  ].join('\n')
}

function buildTaskLibraryTasks({
  onOpenScenario,
  onLoadCompare,
  onLoadCompareLens,
  onLoadCausationInquiry,
  onLoadPeriodizationInquiry,
  onLoadPerspectivesInquiry,
  onLoadContextInquiry,
  onLoadSignificanceInquiry,
  onLoadSynthesisPreset,
  onOpenEvidenceCaseFile,
  onOpenDebateStudio,
  onStartTask,
}: {
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
  onLoadCompare: (path: AtlasInquiryPath) => void
  onLoadCompareLens: (lens: CompareLens) => void
  onLoadCausationInquiry: (inquiryId: string) => void
  onLoadPeriodizationInquiry: (inquiryId: string) => void
  onLoadPerspectivesInquiry: (inquiryId: string) => void
  onLoadContextInquiry: (inquiryId: string) => void
  onLoadSignificanceInquiry: (inquiryId: string) => void
  onLoadSynthesisPreset: (presetId: string) => void
  onOpenEvidenceCaseFile?: (caseFileId: string) => void
  onOpenDebateStudio?: (scenarioId: string) => void
  onStartTask?: (taskId: string) => void
}): LibraryTask[] {
  const tasks: LibraryTask[] = []

  scenarios.forEach((scenario) => {
    scenario.missions.forEach((mission) => {
      const durationBand = getDurationBand(mission.estimatedMinutes)
      const tags = [mission.taskType, mission.difficulty, ...mission.linkedSourceTitles.slice(0, 2), scenario.region, scenario.theme]
      const summary = mission.instruction
      const task: LibraryTask = {
        id: `mission:${scenario.id}:${mission.id}`,
        title: mission.title,
        context: `${scenario.title} · ${scenario.era} · ${scenario.location}`,
        scenarioId: scenario.id,
        category: mission.taskType,
        source: 'mission',
        sourceLabel: 'Scenario Mission',
        durationMinutes: mission.estimatedMinutes,
        durationBand,
        summary,
        deliverable: mission.deliverable,
        tags,
        sourceBased: mission.linkedSourceTitles.length > 0 || mission.evidenceChecklist.length > 0,
        searchText: '',
        primaryActionLabel: '打开场景',
        onPrimaryAction: () => onOpenScenario(scenario.id, getOpenScenarioHash(task.source)),
        onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
        workbenchPrompts: [mission.instruction, `交付物：${mission.deliverable}`, `难度：${mission.difficulty}｜任务类型：${mission.taskType}`],
        checklist: mission.steps.length ? mission.steps : [`完成 ${mission.title}`, mission.deliverable],
        evidencePrompts: mission.evidenceChecklist.length ? mission.evidenceChecklist : mission.linkedSourceTitles.map((title) => `引用并解释来源：${title}`),
        formatSheet: () => formatGenericLibraryTaskSheet(task),
      }

      task.searchText = [task.title, task.context, task.category, task.sourceLabel, summary, task.deliverable, ...tags, ...mission.steps, ...mission.evidenceChecklist].join(' ').toLowerCase()
      tasks.push(task)
    })

    scenario.activityPacks.forEach((activity) => {
      const durationBand = getDurationBand(activity.durationMinutes)
      const tags = [activityPackModeLabels[activity.mode], activity.audience, ...activity.materials.slice(0, 2), ...activity.linkedSourceTitles.slice(0, 2)]
      const task: LibraryTask = {
        id: `activity:${scenario.id}:${activity.id}`,
        title: activity.title,
        context: `${scenario.title} · ${scenario.era} · ${scenario.location}`,
        scenarioId: scenario.id,
        category: activityPackModeLabels[activity.mode],
        source: 'activity',
        sourceLabel: 'Activity Pack',
        durationMinutes: activity.durationMinutes,
        durationBand,
        summary: activity.prompt,
        deliverable: activity.deliverable,
        tags,
        sourceBased: activity.mode === 'source-lab' || activity.linkedSourceTitles.length > 0,
        searchText: '',
        primaryActionLabel: '打开场景',
        onPrimaryAction: () => onOpenScenario(scenario.id, getOpenScenarioHash(task.source)),
        onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
        workbenchPrompts: [activity.prompt, `对象：${activity.audience}`, `交付物：${activity.deliverable}`],
        checklist: activity.steps,
        evidencePrompts: activity.linkedSourceTitles.length ? activity.linkedSourceTitles.map((title) => `活动中如何使用或质询来源：${title}`) : activity.successCriteria,
        formatSheet: () => formatActivitySheet(scenario, activity),
      }

      task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, ...tags, ...activity.steps, ...activity.successCriteria].join(' ').toLowerCase()
      tasks.push(task)
    })

    ;(Object.entries(scenario.lessonPack.classroomFlow) as [LessonPackMode, typeof scenario.lessonPack.classroomFlow[LessonPackMode]][]).forEach(([mode, flow]) => {
      const durationMinutes = mode === 'quick' ? 15 : mode === 'source' ? 35 : 40
      const durationBand = getDurationBand(durationMinutes)
      const tags = [lessonPackModeLabels[mode], 'Guided Lesson Pack', `${scenario.lessonPack.checkQuestions.length} check questions`, `${scenario.lessonPack.exitTickets.length} exit tickets`]
      const task: LibraryTask = {
        id: `lesson:${scenario.id}:${mode}`,
        title: flow.title,
        context: `${scenario.title} · ${scenario.era} · ${scenario.location}`,
        scenarioId: scenario.id,
        category: '课堂流程',
        source: 'lesson',
        sourceLabel: 'Lesson Pack',
        durationMinutes,
        durationBand,
        summary: scenario.lessonPack.inquiryQuestion,
        deliverable: `${lessonPackModeLabels[mode]} 流程、检查题与 exit ticket`,
        tags,
        sourceBased: mode === 'source',
        searchText: '',
        primaryActionLabel: '打开场景',
        onPrimaryAction: () => onOpenScenario(scenario.id, getOpenScenarioHash(task.source)),
        onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
        workbenchPrompts: [scenario.lessonPack.inquiryQuestion, flow.title, `流程：${lessonPackModeLabels[mode]}`],
        checklist: [...scenario.lessonPack.quickStart.slice(0, 2), ...flow.steps],
        evidencePrompts: scenario.lessonPack.checkQuestions.map((item) => item.question),
        formatSheet: () => formatLessonFlowSheet(scenario, mode),
      }

      task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, ...tags, ...flow.steps, ...scenario.lessonPack.quickStart, ...scenario.lessonPack.exitTickets].join(' ').toLowerCase()
      tasks.push(task)
    })


    ;(['decision-hearing', 'source-challenge', 'cross-era-forum'] as DebateMode[]).forEach((mode) => {
      const durationMinutes: DebateDuration = mode === 'decision-hearing' ? 30 : mode === 'source-challenge' ? 45 : 30
      const durationBand = getDurationBand(durationMinutes)
      const roleCards = buildDebateRoleCards(scenario, mode)
      const evidenceCards = buildDebateEvidenceCards(scenario)
      const tags = ['Debate Studio', debateModeLabels[mode], 'role debate', 'classroom discussion', scenario.region, scenario.theme]
      const task: LibraryTask = {
        id: `debate:${scenario.id}:${mode}`,
        title: `${scenario.title} · ${debateModeLabels[mode]}`,
        context: `${scenario.title} · ${scenario.era} · ${scenario.location}`,
        scenarioId: scenario.id,
        category: '课堂辩论',
        source: 'debate',
        sourceLabel: 'Debate Studio',
        durationMinutes,
        durationBand,
        summary: scenario.decision.prompt,
        deliverable: '角色立场卡、证据引用、交叉质询记录与出口判断',
        tags,
        sourceBased: true,
        searchText: '',
        primaryActionLabel: onOpenDebateStudio ? '打开辩论工作台' : '打开场景课堂包',
        secondaryActionLabel: '打开场景课堂包',
        onPrimaryAction: () => onOpenDebateStudio ? onOpenDebateStudio(scenario.id) : onOpenScenario(scenario.id, sectionIds.lessonPack),
        onSecondaryAction: () => onOpenScenario(scenario.id, sectionIds.lessonPack),
        onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
        workbenchPrompts: [scenario.decision.prompt, debateModeDescriptions[mode], `模式：${debateModeLabels[mode]}`],
        checklist: ['选择或分配角色立场', '为角色准备至少两条证据', '记录一次交叉质询', '写出出口判断与来源限制'],
        evidencePrompts: evidenceCards.slice(0, 5).map((card) => `${card.title}：${card.reliabilityNote}`),
        formatSheet: () => formatDebateLibraryTaskSheet(scenario, mode, durationMinutes),
      }

      task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, ...tags, ...roleCards.map((role) => `${role.title} ${role.stance} ${role.brief}`), ...evidenceCards.map((card) => `${card.title} ${card.claimUse} ${card.reliabilityNote}`)].join(' ').toLowerCase()
      tasks.push(task)
    })

    scenario.socialEncounters.forEach((encounter) => {
      const encounterActors = scenario.socialActors.filter((actor) => encounter.actorIds.includes(actor.id))
      const durationMinutes = 30
      const durationBand = getDurationBand(durationMinutes)
      const tags = ['Actor Network', 'Social Worlds', '人物网络', scenario.region, scenario.theme, ...encounterActors.map((actor) => actor.role)]
      const task: LibraryTask = {
        id: `actor-network:${scenario.id}:${encounter.id}`,
        title: encounter.title,
        context: `${scenario.title} · ${scenario.era} · ${scenario.location}`,
        scenarioId: scenario.id,
        category: '人物关系与社会世界地图',
        source: 'actor-network',
        sourceLabel: 'Actor Network',
        durationMinutes,
        durationBand,
        summary: encounter.decisionFocus,
        deliverable: 'Actor Network Brief：人物立场、约束/知识边界、协商方案、缺席声音与证据 notes',
        tags,
        sourceBased: true,
        searchText: '',
        primaryActionLabel: '打开人物网络',
        secondaryActionLabel: '打开来源层',
        onPrimaryAction: () => onOpenScenario(scenario.id, sectionIds.actorNetwork),
        onSecondaryAction: () => onOpenScenario(scenario.id, sectionIds.sourceReader),
        onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
        workbenchPrompts: [encounter.decisionFocus, encounter.tension, `人物：${encounterActors.map((actor) => actor.name).join('、')}`],
        checklist: encounter.taskChecklist,
        evidencePrompts: encounterActors.map((actor) => `${actor.name}：目标 ${actor.goals}；限制 ${actor.constraints}；知识边界 ${actor.knowledgeLimits}`),
        formatSheet: () => formatActorNetworkTaskSheet(scenario, encounter),
      }

      task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, encounter.setting, encounter.tension, ...tags, ...encounter.taskChecklist, ...encounterActors.flatMap((actor) => [actor.name, actor.relationship, actor.goals, actor.constraints, actor.knowledgeLimits, actor.risksOrStakes, actor.likelyViewOfDecision])].join(' ').toLowerCase()
      tasks.push(task)
    })
  })

  atlasInquiryPaths.forEach((path) => {
    const lens = getCompareLensByKey(path.lensKey)
    const pathScenarios = path.scenarioIds.map((id) => getScenarioById(id)).filter((scenario): scenario is Scenario => Boolean(scenario))
    const durationMinutes = 75
    const durationBand = getDurationBand(durationMinutes)
    const tags = [lens.title, 'Inquiry Pathway', ...pathScenarios.slice(0, 3).map((scenario) => scenario.title)]
    const task: LibraryTask = {
      id: `inquiry:${path.id}`,
      title: path.title,
      context: pathScenarios.map((scenario) => scenario.title).join(' × ') || '跨场景探究路径',
      category: lens.title,
      source: 'inquiry',
      sourceLabel: 'Inquiry Pathways',
      durationMinutes,
      durationBand,
      summary: path.drivingQuestion,
      deliverable: path.subtitle,
      tags,
      sourceBased: true,
      searchText: '',
      primaryActionLabel: '载入 Compare Lab',
      secondaryActionLabel: '打开首个场景',
      onPrimaryAction: () => onLoadCompare(path),
      onSecondaryAction: () => pathScenarios[0] ? onOpenScenario(pathScenarios[0].id, sectionIds.sceneReader) : undefined,
      onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
      workbenchPrompts: [path.drivingQuestion, path.whyTheseScenarios, path.subtitle],
      checklist: path.tasks,
      evidencePrompts: lens.evidenceChecklist,
      formatSheet: () => formatAtlasInquiryPack(path),
    }

    task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, path.whyTheseScenarios, ...tags, ...path.tasks, ...path.discussionMoves, ...path.rubric].join(' ').toLowerCase()
    tasks.push(task)
  })

  causationInquiryDefinitions.forEach((inquiry) => {
    const inquiryScenarios = inquiry.scenarioIds.map((id) => getScenarioById(id)).filter((scenario): scenario is Scenario => Boolean(scenario))
    const durationMinutes = 45
    const durationBand = getDurationBand(durationMinutes)
    const tags = ['Causation Lab', '因果与变化', ...inquiry.tags, ...inquiry.suggestedCategories.map((category) => causeCategoryLabels[category])]
    const task: LibraryTask = {
      id: `causation:${inquiry.id}`,
      title: inquiry.title,
      context: inquiryScenarios.map((scenario) => scenario.title).join(' × ') || '跨场景因果探究',
      scenarioId: inquiryScenarios[0]?.id,
      category: '因果与历史变化',
      source: 'causation',
      sourceLabel: 'Causation Lab',
      durationMinutes,
      durationBand,
      summary: inquiry.drivingQuestion,
      deliverable: '因果简报：背景条件、触发因素、约束、选择、短期后果、长期变化、偶然性与缺失证据',
      tags,
      sourceBased: true,
      searchText: '',
      primaryActionLabel: '打开 Causation Lab',
      secondaryActionLabel: '打开首个场景',
      onPrimaryAction: () => onLoadCausationInquiry(inquiry.id),
      onSecondaryAction: () => inquiryScenarios[0] ? onOpenScenario(inquiryScenarios[0].id, sectionIds.sceneReader) : undefined,
      onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
      workbenchPrompts: [inquiry.drivingQuestion, inquiry.focus, `建议分类：${inquiry.suggestedCategories.map((category) => causeCategoryLabels[category]).join('、')}`],
      checklist: ['界定背景条件', '区分直接触发与深层原因', '解释约束与人的选择', '写出短期后果与长期变化', '标出偶然性或缺失证据'],
      evidencePrompts: inquiryScenarios.flatMap((scenario) => scenario.sources.slice(0, 2).map((source) => `${source.title}：${source.sourceQuestion}`)),
      formatSheet: () => formatCausationTaskSheet(inquiry),
    }

    task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, inquiry.focus, ...tags].join(' ').toLowerCase()
    tasks.push(task)
  })

  periodizationInquiryDefinitions.forEach((inquiry) => {
    const inquiryScenarios = inquiry.scenarioIds.map((id) => getScenarioById(id)).filter((scenario): scenario is Scenario => Boolean(scenario))
    const durationMinutes = 45
    const durationBand = getDurationBand(durationMinutes)
    const tags = ['Periodization Lab', '历史分期', '连续性与转折', ...inquiry.tags]
    const task: LibraryTask = {
      id: `periodization:${inquiry.id}`,
      title: inquiry.title,
      context: inquiryScenarios.map((scenario) => scenario.title).join(' × ') || '跨场景分期探究',
      scenarioId: inquiryScenarios[0]?.id,
      category: '历史连续性与分期',
      source: 'periodization',
      sourceLabel: 'Periodization Lab',
      durationMinutes,
      durationBand,
      summary: inquiry.drivingQuestion,
      deliverable: '分期简报：时期起止、连续性、变化、转折点、前后证据、分期标签、替代分期与缺失证据',
      tags,
      sourceBased: true,
      searchText: '',
      primaryActionLabel: '打开 Periodization Lab',
      secondaryActionLabel: '打开首个场景',
      onPrimaryAction: () => onLoadPeriodizationInquiry(inquiry.id),
      onSecondaryAction: () => inquiryScenarios[0] ? onOpenScenario(inquiryScenarios[0].id, sectionIds.sceneReader) : undefined,
      onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
      workbenchPrompts: [inquiry.drivingQuestion, inquiry.focus, `建议转折点：${inquiry.suggestedTurningPoint}`],
      checklist: ['确定时期起点与终点', '列出连续性证据', '列出变化或转折证据', '命名分期标签', '提出替代分期或缺失证据'],
      evidencePrompts: inquiryScenarios.flatMap((scenario) => scenario.timeline.slice(0, 2).map((event) => `${event.year}：${event.title}｜${event.text}`)),
      formatSheet: () => formatPeriodizationTaskSheet(inquiry),
    }

    task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, inquiry.focus, inquiry.suggestedTurningPoint, ...tags].join(' ').toLowerCase()
    tasks.push(task)
  })

  perspectivesInquiryDefinitions.forEach((inquiry) => {
    const inquiryScenarios = inquiry.scenarioIds.map((id) => getScenarioById(id)).filter((scenario): scenario is Scenario => Boolean(scenario))
    const durationMinutes = 45
    const durationBand = getDurationBand(durationMinutes)
    const tags = ['Perspectives & Agency Lab', '多视角', '历史能动性', ...inquiry.tags]
    const task: LibraryTask = {
      id: `perspectives:${inquiry.id}`,
      title: inquiry.title,
      context: inquiryScenarios.map((scenario) => scenario.title).join(' × ') || '跨场景多视角探究',
      scenarioId: inquiryScenarios[0]?.id,
      category: '多视角与历史能动性',
      source: 'perspectives',
      sourceLabel: 'Perspectives Lab',
      durationMinutes,
      durationBand,
      summary: inquiry.drivingQuestion,
      deliverable: '多视角简报：行动者视角、约束、可得知识、风险利害、能动性判断、反当下主义警示、来源限制与缺席声音',
      tags,
      sourceBased: true,
      searchText: '',
      primaryActionLabel: '打开 Perspectives Lab',
      secondaryActionLabel: '打开首个场景',
      onPrimaryAction: () => onLoadPerspectivesInquiry(inquiry.id),
      onSecondaryAction: () => inquiryScenarios[0] ? onOpenScenario(inquiryScenarios[0].id, sectionIds.sceneReader) : undefined,
      onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
      workbenchPrompts: [inquiry.drivingQuestion, inquiry.focus, inquiry.agencyFrame],
      checklist: ['界定行动者视角', '记录约束与可得知识', '说明利害与风险', '写出能动性判断', '警惕反当下主义并标出缺席声音'],
      evidencePrompts: inquiryScenarios.flatMap((scenario) => scenario.sources.slice(0, 2).map((source) => `${source.title}：${source.perspective}`)),
      formatSheet: () => formatPerspectivesTaskSheet(inquiry),
    }

    task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, inquiry.focus, inquiry.agencyFrame, ...tags].join(' ').toLowerCase()
    tasks.push(task)
  })

  contextInquiryDefinitions.forEach((inquiry) => {
    const inquiryScenarios = inquiry.scenarioIds.map((id) => getScenarioById(id)).filter((scenario): scenario is Scenario => Boolean(scenario))
    const durationMinutes = 45
    const durationBand = getDurationBand(durationMinutes)
    const tags = ['Context & Scale Lab', '历史情境化', '尺度分析', 'contextualization', ...inquiry.tags]
    const task: LibraryTask = {
      id: `contextualization:${inquiry.id}`,
      title: inquiry.title,
      context: inquiryScenarios.map((scenario) => scenario.title).join(' × ') || '跨场景情境化探究',
      scenarioId: inquiryScenarios[0]?.id,
      category: '历史情境化与尺度',
      source: 'contextualization',
      sourceLabel: 'Context & Scale Lab',
      durationMinutes,
      durationBand,
      summary: inquiry.drivingQuestion,
      deliverable: 'Context Brief：地方现场、区域连接、大尺度力量、来源情境、时代错置风险、情境化判断与缺失情境',
      tags,
      sourceBased: true,
      searchText: '',
      primaryActionLabel: '打开 Context Lab',
      secondaryActionLabel: '打开首个场景',
      onPrimaryAction: () => onLoadContextInquiry(inquiry.id),
      onSecondaryAction: () => inquiryScenarios[0] ? onOpenScenario(inquiryScenarios[0].id, sectionIds.sceneReader) : undefined,
      onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
      workbenchPrompts: [inquiry.drivingQuestion, inquiry.focus, inquiry.scaleFrame],
      checklist: ['描述地方现场', '连接区域网络', '解释大尺度力量', '检查来源情境', '写出情境化判断与时代错置风险'],
      evidencePrompts: inquiryScenarios.flatMap((scenario) => [`地方：${scenario.location}`, `大尺度：${scenario.region}｜${scenario.theme}`, `来源情境：${scenario.sourceEvidenceUse}`]).slice(0, 6),
      formatSheet: () => formatContextTaskSheet(inquiry),
    }

    task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, inquiry.focus, inquiry.scaleFrame, ...tags].join(' ').toLowerCase()
    tasks.push(task)
  })

  significanceInquiryDefinitions.forEach((inquiry) => {
    const inquiryScenarios = inquiry.scenarioIds.map((id) => getScenarioById(id)).filter((scenario): scenario is Scenario => Boolean(scenario))
    const durationMinutes = 45
    const durationBand = getDurationBand(durationMinutes)
    const tags = ['Significance & Memory Lab', '历史意义', '记忆', 'significance', ...inquiry.tags]
    const task: LibraryTask = {
      id: `significance:${inquiry.id}`,
      title: inquiry.title,
      context: inquiryScenarios.map((scenario) => scenario.title).join(' × ') || '跨场景历史意义探究',
      scenarioId: inquiryScenarios[0]?.id,
      category: '历史意义与记忆',
      source: 'significance',
      sourceLabel: 'Significance Lab',
      durationMinutes,
      durationBand,
      summary: inquiry.drivingQuestion,
      deliverable: 'Significance Brief：事件/过程、对谁重要、当时意义、长期意义、影响尺度、争议意义、来源限制与意义主张',
      tags,
      sourceBased: true,
      searchText: '',
      primaryActionLabel: '打开 Significance Lab',
      secondaryActionLabel: '打开首个场景',
      onPrimaryAction: () => onLoadSignificanceInquiry(inquiry.id),
      onSecondaryAction: () => inquiryScenarios[0] ? onOpenScenario(inquiryScenarios[0].id, sectionIds.sceneReader) : undefined,
      onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
      workbenchPrompts: [inquiry.drivingQuestion, inquiry.focus, inquiry.memoryFrame],
      checklist: ['界定事件或过程', '说明对谁重要', '区分当时与长期意义', '判断影响尺度与争议意义', '指出来源限制并写出意义主张'],
      evidencePrompts: inquiryScenarios.flatMap((scenario) => [`当时意义：${scenario.summary}`, `长期意义：${scenario.realHistory}`, `记忆/档案：${scenario.interpretationNote}`]).slice(0, 6),
      formatSheet: () => formatSignificanceTaskSheet(inquiry),
    }

    task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, inquiry.focus, inquiry.memoryFrame, ...tags].join(' ').toLowerCase()
    tasks.push(task)
  })

  synthesisInquiryPresets.forEach((preset) => {
    const durationMinutes = 60
    const durationBand = getDurationBand(durationMinutes)
    const tags = ['Synthesis Studio', '综合论证', 'historical writing', ...preset.tags]
    const task: LibraryTask = {
      id: `synthesis:${preset.id}`,
      title: preset.title,
      context: 'Synthesis & Historical Writing Studio · 全站学习证据池',
      category: '综合历史论证',
      source: 'synthesis',
      sourceLabel: 'Synthesis Studio',
      durationMinutes,
      durationBand,
      summary: preset.drivingQuestion,
      deliverable: 'Synthesis Writing Brief：论文主张、证据组、推理桥、反驳、来源限制、段落计划与修订清单',
      tags,
      sourceBased: true,
      searchText: '',
      primaryActionLabel: '打开 Synthesis Studio',
      onPrimaryAction: () => onLoadSynthesisPreset(preset.id),
      onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
      workbenchPrompts: [preset.drivingQuestion, preset.claimScope, preset.focus],
      checklist: ['选择证据池材料', '写出 working thesis', '解释 reasoning bridge', '加入 counterargument 与 source limits', '完成 paragraph plan 与 revision checklist'],
      evidencePrompts: preset.paragraphFrame,
      formatSheet: () => formatSynthesisTaskSheet(preset),
    }

    task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, preset.focus, preset.claimScope, ...tags, ...preset.paragraphFrame].join(' ').toLowerCase()
    tasks.push(task)
  })

  evidenceCaseFiles.forEach((caseFile) => {
    const caseScenarios = caseFile.scenarioIds.map((id) => getScenarioById(id)).filter((scenario): scenario is Scenario => Boolean(scenario))
    const durationMinutes = 50
    const durationBand = getDurationBand(durationMinutes)
    const tags = ['Evidence Case Files', 'Archive Quests', ...caseFile.tags, ...caseFile.skills]
    const task: LibraryTask = {
      id: `case-file:${caseFile.id}`,
      title: caseFile.title,
      context: caseScenarios.map((scenario) => scenario.title).join(' × ') || 'Evidence Case Files',
      scenarioId: caseScenarios[0]?.id,
      category: 'Evidence Case File / 来源任务档案',
      source: 'case-file',
      sourceLabel: 'Evidence Case Files',
      durationMinutes,
      durationBand,
      summary: caseFile.drivingQuestion,
      deliverable: 'Evidence Case File Brief：证据包、skill ladder、notes、missing voices、working claim 与 confidence',
      tags,
      sourceBased: true,
      searchText: '',
      primaryActionLabel: '打开 Case File',
      secondaryActionLabel: '打开首个场景',
      onPrimaryAction: () => onOpenEvidenceCaseFile?.(caseFile.id),
      onSecondaryAction: () => caseScenarios[0] ? onOpenScenario(caseScenarios[0].id, sectionIds.sourceReader) : undefined,
      onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
      workbenchPrompts: [caseFile.drivingQuestion, caseFile.suggestedClaimFrame, `Skills：${caseFile.skills.join(' → ')}`],
      checklist: caseFile.taskChecklist,
      evidencePrompts: buildEvidenceCasePacket(caseFile).sources.slice(0, 5).map((entry) => `${entry.scenario.title}｜${entry.title}：${entry.text}`),
      formatSheet: () => formatEvidenceCaseFileTaskSheet(caseFile),
    }

    task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, caseFile.subtitle, caseFile.suggestedClaimFrame, ...tags, ...caseFile.taskChecklist, ...caseFile.selectorTerms].join(' ').toLowerCase()
    tasks.push(task)
  })

  compareLenses.forEach((lens) => {
    const durationMinutes = 35
    const durationBand = getDurationBand(durationMinutes)
    const tags = [lens.shortLabel, 'Compare Lab', '跨场景比较']
    const task: LibraryTask = {
      id: `compare:${lens.key}`,
      title: `${lens.title}比较模板`,
      context: 'Compare Lab · 任意两个历史身份',
      category: lens.title,
      source: 'compare',
      sourceLabel: 'Compare Lens',
      durationMinutes,
      durationBand,
      summary: lens.prompt,
      deliverable: '跨场景比较作业：证据清单、输出结构与评分标准',
      tags,
      sourceBased: lens.key === 'source-credibility' || lens.evidenceChecklist.some((item) => item.includes('证据') || item.includes('来源')),
      searchText: '',
      primaryActionLabel: '载入 Compare Lab',
      onPrimaryAction: () => onLoadCompareLens(lens),
      onStartTask: onStartTask ? () => onStartTask(task.id) : undefined,
      workbenchPrompts: [lens.prompt, lens.description, `比较镜头：${lens.shortLabel}`],
      checklist: lens.outputTemplate,
      evidencePrompts: lens.evidenceChecklist,
      formatSheet: () => formatCompareLensTemplate(lens),
    }

    task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, lens.description, ...tags, ...lens.evidenceChecklist, ...lens.outputTemplate, ...lens.rubric].join(' ').toLowerCase()
    tasks.push(task)
  })

  return tasks
}

function getAssignmentSelectedTasks(draft: AssignmentBuilderDraft, libraryTasks: LibraryTask[]) {
  const tasksById = new Map(libraryTasks.map((task) => [task.id, task]))

  return draft.selectedTaskIds.map((id) => tasksById.get(id)).filter((task): task is LibraryTask => Boolean(task))
}

function getAssignmentBuilderSummary(draft: AssignmentBuilderDraft, libraryTasks: LibraryTask[]): AssignmentBuilderSummary {
  const selectedTasks = getAssignmentSelectedTasks(draft, libraryTasks)
  const scenarioCoverage = [...new Set(selectedTasks.map((task) => task.scenarioId ? getScenarioById(task.scenarioId)?.title ?? task.scenarioId : task.context).filter(Boolean))]
  const thinkingKeywords = ['causation', '因果', 'periodization', '分期', 'perspective', '视角', 'agency', '能动性', 'context', '情境', 'scale', '尺度', 'significance', '意义', 'synthesis', '综合', 'compare', '比较', 'source', 'evidence', '来源', '证据', 'corroboration', '互证']
  const historicalThinkingTags = [...new Set(selectedTasks.flatMap((task) => [task.category, task.sourceLabel, ...task.tags]).filter((tag) => thinkingKeywords.some((keyword) => tag.toLowerCase().includes(keyword.toLowerCase()))))]

  return {
    selectedTasks,
    totalMinutes: selectedTasks.reduce((total, task) => total + task.durationMinutes, 0),
    sourceCategories: [...new Set(selectedTasks.map((task) => task.sourceLabel))],
    scenarioCoverage,
    historicalThinkingTags,
  }
}

function formatAssignmentStudentWorksheet(draft: AssignmentBuilderDraft, libraryTasks: LibraryTask[]) {
  const summary = getAssignmentBuilderSummary(draft, libraryTasks)

  return [
    `TimeAtlas Student Worksheet：${draft.title.trim() || '任务组合'}`,
    `适用对象：${draft.audience.trim() || '未填写'}`,
    `建议时间：${draft.timeBox.trim() || `${summary.totalMinutes} 分钟`}`,
    `学习目标：${draft.learningGoal.trim() || '未填写'}`,
    `最终交付物：${draft.finalDeliverable.trim() || '未填写'}`,
    '',
    '任务顺序：',
    ...summary.selectedTasks.map((task, index) => [
      `${index + 1}. ${task.title}（${task.durationMinutes} 分钟｜${task.sourceLabel}｜${task.category}）`,
      `   情境：${task.context}`,
      `   任务：${task.summary}`,
      `   交付物：${task.deliverable}`,
      `   标签：${task.tags.slice(0, 8).join('、') || '无'}`,
    ].join('\n')),
    summary.selectedTasks.length ? '' : '- 尚未选择任务。',
    '',
    '学生说明：',
    draft.studentInstructions.trim() || '按顺序完成任务；每一步至少记录一条证据、一句推理和一个仍不确定的问题。',
    '',
    '自检清单：',
    '- 我是否说明了证据来自哪里？',
    '- 我是否把证据连接到历史情境或历史思维概念？',
    '- 我是否指出来源限制、档案沉默或不确定性？',
    '- 我的最终交付物是否回应学习目标？',
  ].join('\n')
}

function formatAssignmentTeacherGuide(draft: AssignmentBuilderDraft, libraryTasks: LibraryTask[]) {
  const summary = getAssignmentBuilderSummary(draft, libraryTasks)

  return [
    `TimeAtlas Teacher Guide：${draft.title.trim() || '任务组合'}`,
    `适用对象：${draft.audience.trim() || '未填写'}`,
    `时间盒：${draft.timeBox.trim() || `${summary.totalMinutes} 分钟`}（任务估算合计 ${summary.totalMinutes} 分钟）`,
    `学习目标：${draft.learningGoal.trim() || '未填写'}`,
    `最终交付物：${draft.finalDeliverable.trim() || '未填写'}`,
    '',
    '组合概览：',
    `- 任务数量：${summary.selectedTasks.length}/6`,
    `- 来源类别：${summary.sourceCategories.join('、') || '尚未选择'}`,
    `- 场景覆盖：${summary.scenarioCoverage.join('、') || '尚未选择'}`,
    `- 历史思维标签：${summary.historicalThinkingTags.slice(0, 12).join('、') || '尚未识别'}`,
    '',
    '教学流程建议：',
    ...summary.selectedTasks.map((task, index) => `${index + 1}. ${task.title}｜${task.durationMinutes} 分钟｜${task.sourceBased ? '来源型任务' : '概念/产出型任务'}｜${task.deliverable}`),
    summary.selectedTasks.length ? '' : '- 尚未选择任务。',
    '',
    '教师备注：',
    draft.teacherNotes.trim() || '可先用第一项建立情境，再用中段任务强化来源/历史思维，最后用交付物整合证据。',
    '',
    '评分关注：',
    draft.rubricFocus.trim() || '证据选择、历史情境、推理清晰、来源限制、完成度',
  ].join('\n')
}


type AssessmentTargetInfo = {
  title: string
  targetLabel: string
  audience: string
  timeBox: string
  learningGoal: string
  deliverable: string
  context: string
  summary: string
  sourceLabels: string[]
  categories: string[]
  tags: string[]
  tasks: LibraryTask[]
  sourceBased: boolean
  teacherNotes: string
  rubricFocus: string
}

function getAssessmentTargetInfo(assessmentDraft: AssessmentDraft, assignmentDraft: AssignmentBuilderDraft, libraryTasks: LibraryTask[]): AssessmentTargetInfo {
  if (assessmentDraft.targetType === 'task') {
    const task = libraryTasks.find((candidate) => candidate.id === assessmentDraft.taskId) ?? libraryTasks[0]

    if (!task) {
      return getEmptyAssessmentTargetInfo('单个任务')
    }

    return {
      title: task.title,
      targetLabel: '单个 Task Library 任务',
      audience: '可按课堂对象调整',
      timeBox: `${task.durationMinutes} 分钟`,
      learningGoal: task.summary,
      deliverable: task.deliverable,
      context: task.context,
      summary: `${task.sourceLabel} · ${task.category} · ${task.sourceBased ? 'source-based' : 'product / thinking task'}`,
      sourceLabels: [task.sourceLabel],
      categories: [task.category],
      tags: task.tags,
      tasks: [task],
      sourceBased: task.sourceBased,
      teacherNotes: task.formatSheet().split('\n').slice(0, 8).join('；'),
      rubricFocus: '证据使用、历史情境、方法推理、来源限制、表达清晰',
    }
  }

  if (assessmentDraft.targetType === 'module') {
    const module = taskModules.find((candidate) => candidate.id === assessmentDraft.moduleId) ?? taskModules[0]

    if (!module) {
      return getEmptyAssessmentTargetInfo('Task Module')
    }

    const linkedTasks = libraryTasks.filter((task) => module.scenarioIds.includes(task.scenarioId ?? '') || module.tags.some((tag) => task.searchText.includes(tag.toLowerCase())))
    const moduleText = [module.title, module.subtitle, module.drivingQuestion, module.finalDeliverable, ...module.tags, ...module.steps.flatMap((step) => [step.title, step.description, step.actionLabel])].join(' ').toLowerCase()

    return {
      title: module.title,
      targetLabel: 'Task Module 单元模块',
      audience: '跨页面单元学习者 / 小组',
      timeBox: `${module.totalMinutes} 分钟`,
      learningGoal: module.drivingQuestion,
      deliverable: module.finalDeliverable,
      context: module.scenarioIds.map((scenarioId) => getScenarioById(scenarioId)?.title ?? scenarioId).join('、'),
      summary: module.subtitle,
      sourceLabels: [...new Set(linkedTasks.map((task) => task.sourceLabel))],
      categories: [...new Set([...linkedTasks.map((task) => task.category), 'Task Module'])],
      tags: module.tags,
      tasks: linkedTasks,
      sourceBased: moduleText.includes('source') || moduleText.includes('evidence') || moduleText.includes('来源') || moduleText.includes('证据') || moduleText.includes('archive') || module.steps.some((step) => step.action.type === 'evidence'),
      teacherNotes: module.steps.map((step, index) => `${index + 1}. ${step.title}（${step.minutes}m）`).join('；'),
      rubricFocus: '跨步骤证据整合、历史思维方法、来源边界、最终产出质量',
    }
  }

  const summary = getAssignmentBuilderSummary(assignmentDraft, libraryTasks)
  const selectedTasks = summary.selectedTasks

  return {
    title: assignmentDraft.title.trim() || 'Assignment Builder 当前草稿',
    targetLabel: 'Assignment Builder 当前草稿',
    audience: assignmentDraft.audience.trim() || '未填写，可按班级调整',
    timeBox: assignmentDraft.timeBox.trim() || `${summary.totalMinutes} 分钟`,
    learningGoal: assignmentDraft.learningGoal.trim() || '完成已选任务序列，并把证据转化为历史解释。',
    deliverable: assignmentDraft.finalDeliverable.trim() || selectedTasks.map((task) => task.deliverable).join('；') || '课堂任务产出',
    context: summary.scenarioCoverage.join('、') || '尚未选择场景',
    summary: selectedTasks.map((task, index) => `${index + 1}. ${task.title}`).join('；') || '尚未选择任务；可先在 Assignment Builder 中加入任务。',
    sourceLabels: summary.sourceCategories,
    categories: [...new Set(selectedTasks.map((task) => task.category))],
    tags: [...new Set([...summary.historicalThinkingTags, ...selectedTasks.flatMap((task) => task.tags)])],
    tasks: selectedTasks,
    sourceBased: selectedTasks.some((task) => task.sourceBased),
    teacherNotes: assignmentDraft.teacherNotes.trim(),
    rubricFocus: assignmentDraft.rubricFocus.trim() || '证据使用、历史情境、推理清晰、来源限制、完成度',
  }
}

function getEmptyAssessmentTargetInfo(targetLabel: string): AssessmentTargetInfo {
  return {
    title: '尚无可评价目标',
    targetLabel,
    audience: '未填写',
    timeBox: '未填写',
    learningGoal: '请先选择或创建任务目标。',
    deliverable: '未填写',
    context: '未填写',
    summary: '暂无内容',
    sourceLabels: [],
    categories: [],
    tags: [],
    tasks: [],
    sourceBased: false,
    teacherNotes: '',
    rubricFocus: '证据使用、历史情境、推理清晰、来源限制、完成度',
  }
}

function buildAssessmentRubricCriteria(target: AssessmentTargetInfo): RubricCriterion[] {
  const haystack = [target.title, target.targetLabel, target.learningGoal, target.deliverable, target.context, target.summary, target.rubricFocus, target.teacherNotes, ...target.sourceLabels, ...target.categories, ...target.tags].join(' ').toLowerCase()
  const hasCompare = includesAny(haystack, ['compare', 'comparison', '比较', '跨场景'])
  const hasSynthesis = includesAny(haystack, ['synthesis', '综合', '整合', 'capstone'])
  const hasDebate = includesAny(haystack, ['debate', 'roleplay', 'hearing', 'forum', '辩论', '角色'])
  const hasCausation = includesAny(haystack, ['causation', 'cause', '因果', '原因', '后果'])
  const hasPeriodization = includesAny(haystack, ['periodization', 'period', 'turning point', 'continuity', '分期', '转折', '连续'])
  const hasArchiveSilence = includesAny(haystack, ['archive silence', 'silence', 'missing voices', 'nonwritten', 'khipu', '档案沉默', '缺席', '非文字', '结绳'])
  const methodFocus = getAssessmentMethodFocus({ hasCompare, hasSynthesis, hasDebate, hasCausation, hasPeriodization })
  const criteria: RubricCriterion[] = [
    {
      id: 'evidence-use',
      title: 'Evidence use / 证据使用',
      focus: target.sourceBased ? '选择、引用并解释具体来源证据。' : '用任务材料、场景细节或课堂记录支撑判断。',
      levels: {
        exceeds: '使用多条相关证据，说明出处、细节与推理关系，并能区分证据与推测。',
        meets: '使用足够相关证据支撑主要判断，能说明证据如何回应任务。',
        developing: '引用了一些证据，但解释较笼统，或证据与判断之间连接不稳定。',
        beginning: '主要依靠概括或个人意见，证据不足、出处不清或与任务关系弱。',
      },
    },
    {
      id: 'historical-context',
      title: 'Historical context / 历史情境',
      focus: '把人物、制度、地点、时间和权力关系放回历史环境。',
      levels: {
        exceeds: '准确连接地方情境与更大尺度的制度、市场、帝国或文化背景，避免当下主义。',
        meets: '能说明关键时间地点、社会关系和制度背景，并用它们解释选择或变化。',
        developing: '提到背景信息，但背景与论点或产出之间联系不够清楚。',
        beginning: '缺少历史背景，或把现代假设直接套用到过去。',
      },
    },
    {
      id: 'historical-method',
      title: `${methodFocus.title} / 历史思维方法`,
      focus: methodFocus.focus,
      levels: methodFocus.levels,
    },
    {
      id: 'argument-product-clarity',
      title: 'Argument or product clarity / 论证与产出清晰度',
      focus: '最终作品是否有清晰主张、结构和可读性。',
      levels: {
        exceeds: '主张明确、有结构、有过渡，产出形式服务历史解释，并能回应复杂性或反例。',
        meets: '主张或中心任务清楚，结构完整，表达基本准确，能回应学习目标。',
        developing: '有可辨认的中心想法，但组织松散、表达跳跃或部分偏离交付物要求。',
        beginning: '缺少清楚中心、结构或完整产出，读者难以判断历史解释。',
      },
    },
  ]

  if (target.sourceBased || hasArchiveSilence) {
    criteria.splice(3, 0, {
      id: 'source-limits',
      title: hasArchiveSilence ? 'Source limits and archive silence / 来源限制与档案沉默' : 'Source limits / 来源限制',
      focus: hasArchiveSilence ? '指出谁被记录、谁被排除，以及非文字或残缺档案能说明什么、不能说明什么。' : '说明来源视角、可靠边界、缺失信息和不确定性。',
      levels: {
        exceeds: '主动识别来源视角、保存条件和缺席声音，并把限制纳入谨慎结论。',
        meets: '能指出主要来源限制或不确定性，并避免超过证据范围。',
        developing: '提到限制但较公式化，未明显改变或限定自己的判断。',
        beginning: '把来源当作完整事实记录，忽视偏见、沉默或证据边界。',
      },
    })
  }

  return criteria
}

function getAssessmentMethodFocus(flags: { hasCompare: boolean, hasSynthesis: boolean, hasDebate: boolean, hasCausation: boolean, hasPeriodization: boolean }) {
  if (flags.hasDebate) {
    return {
      title: 'Perspective, counterclaim and debate reasoning',
      focus: '区分角色立场、证据责任、反驳与历史可能性，而不是只表演观点。',
      levels: {
        exceeds: '清楚代表立场，同时公平处理对方证据，反驳基于历史证据而非口号。',
        meets: '能用证据表达立场，并回应至少一个相反观点或追问。',
        developing: '有立场但证据或反驳不足，容易停留在角色表演。',
        beginning: '立场、证据和回应混在一起，难以形成历史讨论。',
      },
    }
  }

  if (flags.hasCompare) {
    return {
      title: 'Comparison reasoning',
      focus: '比较相似与差异，并解释这些异同为什么重要。',
      levels: {
        exceeds: '用共同标准比较两个以上案例，解释相似/差异的原因与意义。',
        meets: '能列出并说明关键相似和差异，且大体使用同一比较维度。',
        developing: '有并列描述，但比较标准不稳定，解释异同较少。',
        beginning: '只分别介绍案例，缺少真实比较或比较依据。',
      },
    }
  }

  if (flags.hasCausation) {
    return {
      title: 'Causation reasoning',
      focus: '区分背景、触发、约束、行动者选择和后果。',
      levels: {
        exceeds: '解释多重原因及其相互作用，区分短期/长期后果并承认不确定性。',
        meets: '能识别主要原因和后果，并说明它们之间的合理联系。',
        developing: '列出原因或结果，但链条较单线，机制解释不足。',
        beginning: '把时间先后当作因果，或只给出一个未经证明的原因。',
      },
    }
  }

  if (flags.hasPeriodization) {
    return {
      title: 'Periodization and change-over-time reasoning',
      focus: '判断连续、转折、速度和分期边界。',
      levels: {
        exceeds: '用证据划分阶段，解释转折点、连续性和不同群体经历的不同节奏。',
        meets: '能说明重要变化与连续性，并给出合理分期或转折依据。',
        developing: '提到变化，但分期依据或连续性分析不够清楚。',
        beginning: '只按时间顺序叙述，缺少转折、连续或分期判断。',
      },
    }
  }

  if (flags.hasSynthesis) {
    return {
      title: 'Synthesis reasoning',
      focus: '把多个任务、场景或证据池整合成一个有范围的历史解释。',
      levels: {
        exceeds: '整合多个证据来源与历史思维角度，形成有范围、有复杂性的综合主张。',
        meets: '能把多个材料连接到同一主张，并解释材料之间的关系。',
        developing: '汇集了多个材料，但连接多为罗列，综合主张不够集中。',
        beginning: '只复制或并列材料，未形成综合解释。',
      },
    }
  }

  return {
    title: 'Historical thinking method',
    focus: '根据任务要求运用情境化、互证、视角、意义或变化解释。',
    levels: {
      exceeds: '方法选择清楚，能把证据、概念和限制合成有判断的历史解释。',
      meets: '能使用合适历史思维方法完成任务，并解释基本推理。',
      developing: '尝试使用方法，但步骤不完整或概念使用不稳定。',
      beginning: '缺少明确历史思维方法，主要停留在信息摘录。',
    },
  }
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term.toLowerCase()))
}

function formatAssessmentStudentRubric(target: AssessmentTargetInfo, criteria: RubricCriterion[]) {
  return [
    `TimeAtlas Student-facing Rubric：${target.title}`,
    `评价目标：${target.targetLabel}`,
    `适用对象：${target.audience}`,
    `时间盒：${target.timeBox}`,
    `学习目标：${target.learningGoal}`,
    `最终交付物：${target.deliverable}`,
    '',
    '四级标准：Exceeds / Meets / Developing / Beginning',
    '',
    ...criteria.flatMap((criterion, index) => [
      `${index + 1}. ${criterion.title}`,
      `   关注：${criterion.focus}`,
      `   Exceeds：${criterion.levels.exceeds}`,
      `   Meets：${criterion.levels.meets}`,
      `   Developing：${criterion.levels.developing}`,
      `   Beginning：${criterion.levels.beginning}`,
      '',
    ]),
  ].join('\n')
}

function formatAssessmentTeacherScoringGuide(target: AssessmentTargetInfo, criteria: RubricCriterion[]) {
  return [
    `TimeAtlas Teacher Scoring Guide：${target.title}`,
    `目标类型：${target.targetLabel}`,
    `情境 / 覆盖：${target.context}`,
    `来源类别：${target.sourceLabels.join('、') || '未识别'}`,
    `任务类别：${target.categories.join('、') || '未识别'}`,
    `标签：${target.tags.slice(0, 16).join('、') || '未识别'}`,
    `评分关注：${target.rubricFocus}`,
    '',
    '建议计分：每项 4 分（Exceeds=4, Meets=3, Developing=2, Beginning=1）。总分可按课堂需要折算。',
    '',
    ...criteria.flatMap((criterion, index) => [
      `${index + 1}. ${criterion.title}`,
      `   4｜${criterion.levels.exceeds}`,
      `   3｜${criterion.levels.meets}`,
      `   2｜${criterion.levels.developing}`,
      `   1｜${criterion.levels.beginning}`,
      `   快速反馈关注：${criterion.focus}`,
      '',
    ]),
    '评分提醒：先看证据是否足以支撑主张，再看方法与表达；来源沉默或非文字记录任务不要惩罚“无法确定”，应奖励谨慎限定。',
    target.teacherNotes ? `教师备注：${target.teacherNotes}` : '',
  ].filter(Boolean).join('\n')
}

function formatAssessmentFeedbackStems(target: AssessmentTargetInfo, criteria: RubricCriterion[]) {
  return [
    `TimeAtlas Feedback Sentence Stems：${target.title}`,
    '',
    'Strength / 亮点：',
    '- 你最有力的证据是 ______，因为它直接说明 ______。',
    '- 你把 ______ 放回了 ______ 的历史情境，这让解释更可信。',
    '- 你的产出在 ______ 处显示了清楚的历史思维。',
    '',
    'Next step / 下一步：',
    '- 请选择一条更具体的证据，并补上“这说明……”的推理句。',
    '- 请把 ______ 与更大的制度、市场、文化或权力背景连接起来。',
    '- 请说明这条来源能证明什么、不能证明什么。',
    '- 请把最终主张改成“虽然 ______，但是 ______，因为 ______”。',
    '',
    'Criterion-specific stems / 按标准反馈：',
    ...criteria.map((criterion) => `- ${criterion.title}：现在最接近 ______ 级；要提升一级，请 ______。`),
    '',
    `Deliverable reminder：${target.deliverable}`,
  ].join('\n')
}

function formatAssessmentRevisionChecklist(target: AssessmentTargetInfo, criteria: RubricCriterion[]) {
  return [
    `TimeAtlas Revision Checklist：${target.title}`,
    '',
    `最终交付物：${target.deliverable}`,
    '',
    ...criteria.map((criterion) => `□ ${criterion.title}：我已经检查 ${criterion.focus}`),
    '□ 我已经把每条关键证据后面补上“这说明 / this shows”。',
    '□ 我已经删掉没有证据支撑或超过证据范围的句子。',
    '□ 我已经确认最终主张回应学习目标，而不是只复述材料。',
    target.sourceBased ? '□ 我已经标出来源视角、保存条件、缺席声音或不确定性。' : '□ 我已经把课堂活动细节转成可评分的历史解释。',
  ].join('\n')
}

function downloadTextFile(filename: string, text: string) {
  if (typeof document === 'undefined') {
    return
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function getAssessmentFilename(target: AssessmentTargetInfo, suffix: string) {
  const safeTitle = target.title.toLowerCase().replace(/[^a-z0-9一-龥]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'assessment'

  return `timeatlas-${safeTitle}-${suffix}.txt`
}

async function copyTextToClipboard(text: string) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    throw new Error('Clipboard API unavailable')
  }

  await navigator.clipboard.writeText(text)
}

function getStatusLabel(status: 'not-started' | 'draft' | 'completed') {
  return {
    'not-started': '未开始',
    draft: '草稿',
    completed: '已完成',
  }[status]
}

function getInitialSelection() {
  if (typeof window === 'undefined') {
    return { scenarioId: defaultScenarioId, optionId: null }
  }

  const params = new URLSearchParams(window.location.search)
  const scenario = getScenarioById(params.get('scenario')) ?? getScenarioById(defaultScenarioId) ?? scenarios[0]
  const optionParam = params.get('option')
  const option = scenario.decision.options.find((candidate) => candidate.id === optionParam) ?? null

  return { scenarioId: scenario.id, optionId: option?.id ?? null }
}

function getInitialCompareSelection() {
  if (typeof window === 'undefined') {
    return {
      compareAId: defaultCompareScenarioAId,
      compareBId: defaultCompareScenarioBId,
      lensKey: defaultCompareLensKey,
    }
  }

  const params = new URLSearchParams(window.location.search)
  const scenarioA = getScenarioById(params.get('compareA')) ?? getScenarioById(defaultCompareScenarioAId) ?? scenarios[0]
  const requestedScenarioB = getScenarioById(params.get('compareB'))
  const scenarioB = requestedScenarioB && requestedScenarioB.id !== scenarioA.id
    ? requestedScenarioB
    : getScenarioById(getFallbackCompareScenarioId(scenarioA.id)) ?? scenarioA
  const lens = getCompareLensByKey(params.get('lens'))

  return { compareAId: scenarioA.id, compareBId: scenarioB.id, lensKey: lens.key }
}

function App() {
  const prefersReducedMotion = useReducedMotion()
  const initialSelection = useMemo(getInitialSelection, [])
  const initialCompareSelection = useMemo(getInitialCompareSelection, [])
  const [activePage, setActivePage] = useState<PageId>(getInitialPage)
  const [activeAtlasSubpage, setActiveAtlasSubpage] = useState<AtlasSubpage>(() => (typeof window === 'undefined' ? 'routes' : getAtlasSubpageFromHash(window.location.hash)))
  const [activeEvidenceSubpage, setActiveEvidenceSubpage] = useState<EvidenceSubpage>(() => (typeof window === 'undefined' ? 'source-atlas' : getEvidenceSubpageFromHash(window.location.hash)))
  const [activeLabsSubpage, setActiveLabsSubpage] = useState<LabsSubpage>(() => {
    if (typeof window === 'undefined') {
      return 'causation'
    }

    return getLabsSubpageFromValue(new URLSearchParams(window.location.search).get('page')) ?? getLabsSubpageFromHash(window.location.hash)
  })
  const [activeTasksSubpage, setActiveTasksSubpage] = useState<TasksSubpage>(() => (typeof window === 'undefined' ? 'discover' : getTasksSubpageFromHash(window.location.hash)))
  const [selectedScenarioTab, setSelectedScenarioTab] = useState<ScenarioExperienceTab>(() => (typeof window === 'undefined' ? 'overview' : getScenarioTabFromHash(window.location.hash)))
  const [selectedScenarioId, setSelectedScenarioId] = useState(initialSelection.scenarioId)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(initialSelection.optionId)
  const [compareScenarioAId, setCompareScenarioAId] = useState(initialCompareSelection.compareAId)
  const [compareScenarioBId, setCompareScenarioBId] = useState(initialCompareSelection.compareBId)
  const [selectedLensKey, setSelectedLensKey] = useState(initialCompareSelection.lensKey)
  const [compareDraftState, setCompareDraftState] = useState<CompareDraftState>(loadCompareDraftState)
  const [completedMissionIdsByScenario, setCompletedMissionIdsByScenario] = useState<Record<string, string[]>>(
    loadMissionState,
  )
  const [missionWorkState, setMissionWorkState] = useState<MissionWorkState>(loadMissionWorkState)
  const [argumentDraftState, setArgumentDraftState] = useState<ArgumentDraftState>(loadArgumentDraftState)
  const [corroborationDraftState, setCorroborationDraftState] = useState<CorroborationDraftState>(loadCorroborationDraftState)
  const [causationDraftState, setCausationDraftState] = useState<CausationDraftState>(loadCausationDraftState)
  const [selectedCausationInquiryId, setSelectedCausationInquiryId] = useState(causationInquiryDefinitions[0]?.id ?? '')
  const [periodizationDraftState, setPeriodizationDraftState] = useState<PeriodizationDraftState>(loadPeriodizationDraftState)
  const [selectedPeriodizationInquiryId, setSelectedPeriodizationInquiryId] = useState(periodizationInquiryDefinitions[0]?.id ?? '')
  const [perspectivesDraftState, setPerspectivesDraftState] = useState<PerspectivesDraftState>(loadPerspectivesDraftState)
  const [selectedPerspectivesInquiryId, setSelectedPerspectivesInquiryId] = useState(perspectivesInquiryDefinitions[0]?.id ?? '')
  const [contextDraftState, setContextDraftState] = useState<ContextDraftState>(loadContextDraftState)
  const [significanceDraftState, setSignificanceDraftState] = useState<SignificanceDraftState>(loadSignificanceDraftState)
  const [selectedSignificanceInquiryId, setSelectedSignificanceInquiryId] = useState(significanceInquiryDefinitions[0]?.id ?? '')
  const [synthesisDraftState, setSynthesisDraftState] = useState<SynthesisDraftState>(loadSynthesisDraftState)
  const [caseFileDraftState, setCaseFileDraftState] = useState<EvidenceCaseFileDraftState>(loadEvidenceCaseFileDraftState)
  const [selectedCaseFileId, setSelectedCaseFileId] = useState(evidenceCaseFiles[0]?.id ?? '')
  const [selectedSynthesisPresetId, setSelectedSynthesisPresetId] = useState(synthesisInquiryPresets[0]?.id ?? '')
  const [selectedContextInquiryId, setSelectedContextInquiryId] = useState(contextInquiryDefinitions[0]?.id ?? '')
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>(loadWorkspaceState)
  const [guidedSessionProgressState, setGuidedSessionProgressState] = useState<GuidedSessionProgressState>(
    loadGuidedSessionProgressState,
  )
  const [taskModuleProgressState, setTaskModuleProgressState] = useState<TaskModuleProgressState>(
    loadTaskModuleProgressState,
  )
  const [assignmentBuilderDraft, setAssignmentBuilderDraft] = useState<AssignmentBuilderDraft>(loadAssignmentBuilderDraft)
  const [taskWorkbenchDraftState, setTaskWorkbenchDraftState] = useState<TaskWorkbenchState>(loadTaskWorkbenchDraftState)
  const [actorNetworkDraftState, setActorNetworkDraftState] = useState<ActorNetworkDraftState>(loadActorNetworkDraftState)
  const [activeWorkbenchTaskId, setActiveWorkbenchTaskId] = useState<string>('')
  const [taskLibraryPreset, setTaskLibraryPreset] = useState<TaskLibraryPreset | null>(null)

  const selectedScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0],
    [selectedScenarioId],
  )

  const selectedOption = useMemo(
    () =>
      selectedOptionId
        ? selectedScenario.decision.options.find((option) => option.id === selectedOptionId) ?? null
        : null,
    [selectedOptionId, selectedScenario],
  )
  const compareScenarioA = useMemo(
    () => getScenarioById(compareScenarioAId) ?? scenarios[0],
    [compareScenarioAId],
  )
  const compareScenarioB = useMemo(
    () => getScenarioById(compareScenarioBId) ?? getScenarioById(getFallbackCompareScenarioId(compareScenarioA.id)) ?? compareScenarioA,
    [compareScenarioA, compareScenarioBId],
  )
  const selectedLens = useMemo(() => getCompareLensByKey(selectedLensKey), [selectedLensKey])
  const causationEvidenceByInquiry = useMemo(getCausationInquiryEvidenceMap, [])
  const periodizationEvidenceByInquiry = useMemo(getPeriodizationInquiryEvidenceMap, [])
  const perspectivesEvidenceByInquiry = useMemo(getPerspectivesInquiryEvidenceMap, [])
  const contextEvidenceByInquiry = useMemo(getContextInquiryEvidenceMap, [])
  const significanceEvidenceByInquiry = useMemo(getSignificanceInquiryEvidenceMap, [])
  const synthesisEvidencePool = useMemo(() => buildSynthesisEvidencePool({ corroborationDraftState, causationDraftState, periodizationDraftState, perspectivesDraftState, contextDraftState, significanceDraftState, compareDraftState, caseFileDraftState, actorNetworkDraftState, missionWorkState, workspaceState }), [corroborationDraftState, causationDraftState, periodizationDraftState, perspectivesDraftState, contextDraftState, significanceDraftState, compareDraftState, caseFileDraftState, actorNetworkDraftState, missionWorkState, workspaceState])
  const assignmentLibraryTasks = buildTaskLibraryTasks({ onOpenScenario: selectScenario, onLoadCompare: loadCompareFromInquiryPath, onLoadCompareLens: loadCompareLens, onLoadCausationInquiry: loadCausationInquiry, onLoadPeriodizationInquiry: loadPeriodizationInquiry, onLoadPerspectivesInquiry: loadPerspectivesInquiry, onLoadContextInquiry: loadContextInquiry, onLoadSignificanceInquiry: loadSignificanceInquiry, onLoadSynthesisPreset: loadSynthesisPreset, onOpenEvidenceCaseFile: openEvidenceCaseFile, onOpenDebateStudio: openDebateStudio, onStartTask: startTaskWorkbench })

  const completedMissionIds = completedMissionIdsByScenario[selectedScenario.id] ?? []
  const completedMissionCount = completedMissionIds.length
  const totalCompletedMissionCount = useMemo(
    () => getTotalCompletedMissions(completedMissionIdsByScenario),
    [completedMissionIdsByScenario],
  )
  const workspaceStats = useMemo(() => getWorkspaceStats(workspaceState), [workspaceState])
  const taskModuleStats = useMemo(() => getTaskModuleProgressStats(taskModuleProgressState), [taskModuleProgressState])
  const taskWorkbenchStats = useMemo(() => getTaskWorkbenchStats(taskWorkbenchDraftState), [taskWorkbenchDraftState])
  const labDraftCount = useMemo(() => getLabDraftCount({ corroborationDraftState, causationDraftState, periodizationDraftState, perspectivesDraftState, contextDraftState, significanceDraftState }), [corroborationDraftState, causationDraftState, periodizationDraftState, perspectivesDraftState, contextDraftState, significanceDraftState])
  const compareDraftCount = useMemo(() => getActiveCompareDrafts(compareDraftState).length, [compareDraftState])
  const synthesisDraftCount = useMemo(() => getActiveSynthesisDrafts(synthesisDraftState).length, [synthesisDraftState])
  const caseFileDraftCount = useMemo(() => getActiveEvidenceCaseFileDrafts(caseFileDraftState).length, [caseFileDraftState])
  const missionDraftCount = useMemo(() => getMissionDraftCount(missionWorkState), [missionWorkState])
  const learningCoachSnapshot = useMemo(() => ({
    totalCompletedMissionCount,
    missionDraftCount,
    workspaceStats,
    taskModuleStats,
    taskWorkbenchStats,
    labDraftCount,
    compareDraftCount,
    synthesisDraftCount,
    caseFileDraftCount,
  }), [totalCompletedMissionCount, missionDraftCount, workspaceStats, taskModuleStats, taskWorkbenchStats, labDraftCount, compareDraftCount, synthesisDraftCount, caseFileDraftCount])
  const learningCoachRecommendations = buildLearningCoachRecommendations({
    libraryTasks: assignmentLibraryTasks,
    taskWorkbenchDraftState,
    taskModuleProgressState,
    workspaceState,
    argumentDraftState,
    corroborationDraftState,
    causationDraftState,
    periodizationDraftState,
    perspectivesDraftState,
    contextDraftState,
    significanceDraftState,
    synthesisDraftState,
    caseFileDraftState,
    compareDraftState,
    missionWorkState,
    completedMissionIdsByScenario,
    onStartTask: startTaskWorkbench,
    onSelectTasksSubpage: selectTasksSubpage,
    onSelectScenario: selectScenario,
    onSelectLabsSubpage: selectLabsSubpage,
    onSelectAtlasSubpage: selectAtlasSubpage,
  })
  const missionWorkCountByScenario = useMemo(
    () =>
      Object.fromEntries(
        scenarios.map((scenario) => [scenario.id, countScenarioMissionWork(scenario, missionWorkState)]),
      ) as Record<string, number>,
    [missionWorkState],
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistMissionState(completedMissionIdsByScenario)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [completedMissionIdsByScenario])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistMissionWorkState(missionWorkState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [missionWorkState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistArgumentDraftState(argumentDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [argumentDraftState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistCorroborationDraftState(corroborationDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [corroborationDraftState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistCausationDraftState(causationDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [causationDraftState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistPeriodizationDraftState(periodizationDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [periodizationDraftState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistPerspectivesDraftState(perspectivesDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [perspectivesDraftState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistContextDraftState(contextDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [contextDraftState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistSignificanceDraftState(significanceDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [significanceDraftState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistSynthesisDraftState(synthesisDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [synthesisDraftState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistEvidenceCaseFileDraftState(caseFileDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [caseFileDraftState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistCompareDraftState(compareDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [compareDraftState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistWorkspaceState(workspaceState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [workspaceState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistGuidedSessionProgressState(guidedSessionProgressState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [guidedSessionProgressState])


  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistTaskModuleProgressState(taskModuleProgressState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [taskModuleProgressState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistAssignmentBuilderDraft(assignmentBuilderDraft)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [assignmentBuilderDraft])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistTaskWorkbenchDraftState(taskWorkbenchDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [taskWorkbenchDraftState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      persistActorNetworkDraftState(actorNetworkDraftState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [actorNetworkDraftState])

  useEffect(() => {
    if (compareScenarioA.id !== compareScenarioB.id) {
      return
    }

    setCompareScenarioBId(getFallbackCompareScenarioId(compareScenarioA.id))
  }, [compareScenarioA.id, compareScenarioB.id])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const params = new URLSearchParams(window.location.search)
    params.set('page', activePage)
    params.set('scenario', selectedScenario.id)
    params.set('compareA', compareScenarioA.id)
    params.set('compareB', compareScenarioB.id)
    params.set('lens', selectedLens.key)

    if (selectedOption) {
      params.set('option', selectedOption.id)
    } else {
      params.delete('option')
    }

    const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`

    if (nextUrl !== currentUrl) {
      window.history.replaceState(null, '', nextUrl)
    }
  }, [activePage, compareScenarioA, compareScenarioB, selectedLens, selectedOption, selectedScenario])

  function navigateToPage(page: PageId, hash?: string) {
    setActivePage(page)

    if (page === 'atlas') {
      setActiveAtlasSubpage(hash ? getAtlasSubpageFromHash(hash) : 'routes')
    }

    if (page === 'evidence') {
      setActiveEvidenceSubpage(hash ? getEvidenceSubpageFromHash(hash) : 'source-atlas')
    }

    if (page === 'labs') {
      setActiveLabsSubpage(hash ? getLabsSubpageFromHash(hash) : 'causation')
    }

    if (page === 'tasks') {
      setActiveTasksSubpage(hash ? getTasksSubpageFromHash(hash) : 'discover')
    }

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl(page, hash))
    }

    if (hash) {
      scrollToSection(hash, prefersReducedMotion)
    } else if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }))
    }
  }

  function selectAtlasSubpage(subpage: AtlasSubpage) {
    const hash = getHashForAtlasSubpage(subpage)

    setActiveAtlasSubpage(subpage)

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('atlas', hash))
    }

    scrollToSection(hash, prefersReducedMotion)
  }

  function selectEvidenceSubpage(subpage: EvidenceSubpage) {
    const hash = getHashForEvidenceSubpage(subpage)

    setActiveEvidenceSubpage(subpage)

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('evidence', hash))
    }

    scrollToSection(hash, prefersReducedMotion)
  }

  function openEvidenceCaseFile(caseFileId: string) {
    if (!evidenceCaseFiles.some((caseFile) => caseFile.id === caseFileId)) {
      return
    }

    setSelectedCaseFileId(caseFileId)
    setActivePage('evidence')
    setActiveEvidenceSubpage('case-files')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('evidence', sectionIds.evidenceCaseFiles))
    }

    scrollToSection(sectionIds.evidenceCaseFiles, prefersReducedMotion)
  }

  function selectLabsSubpage(subpage: LabsSubpage) {
    const hash = getHashForLabsSubpage(subpage)

    setActiveLabsSubpage(subpage)

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('labs', hash))
    }

    scrollToSection(hash, prefersReducedMotion)
  }

  function selectTasksSubpage(subpage: TasksSubpage) {
    const hash = getHashForTasksSubpage(subpage)

    setActiveTasksSubpage(subpage)

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('tasks', hash))
    }

    scrollToSection(hash, prefersReducedMotion)
  }

  function openTaskLibraryPreset(preset: TaskLibraryPreset) {
    setTaskLibraryPreset(preset)
    setActiveTasksSubpage('library')

    const hash = getHashForTasksSubpage('library')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('tasks', hash))
    }

    scrollToSection(hash, prefersReducedMotion)
  }

  function startTaskWorkbench(taskId: string) {
    setActivePage('tasks')
    setActiveTasksSubpage('workbench')
    setActiveWorkbenchTaskId(taskId)
    setTaskWorkbenchDraftState((currentState) => currentState[taskId]
      ? currentState
      : {
        ...currentState,
        [taskId]: getEmptyTaskWorkbenchDraft(taskId),
      })

    const hash = getHashForTasksSubpage('workbench')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('tasks', hash))
    }

    scrollToSection(hash, prefersReducedMotion)
  }

  function openAssessmentStudioFromBuilder() {
    setActivePage('tasks')
    setActiveTasksSubpage('assessment')

    const hash = getHashForTasksSubpage('assessment')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('tasks', hash))
    }

    scrollToSection(hash, prefersReducedMotion)
  }

  function openDebateStudio(scenarioId: string = selectedScenario.id) {
    if (getScenarioById(scenarioId)) {
      setSelectedScenarioId(scenarioId)
    }

    setActivePage('tasks')
    setActiveTasksSubpage('debate')

    const hash = getHashForTasksSubpage('debate')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('tasks', hash))
    }

    scrollToSection(hash, prefersReducedMotion)
  }

  function selectScenario(id: string, hash: ScenarioSectionId = defaultScenarioSectionId) {
    if (!getScenarioById(id)) {
      return
    }

    setSelectedScenarioId(id)
    setSelectedOptionId(null)
    setActivePage('scenario')
    setSelectedScenarioTab(getScenarioTabFromHash(hash))

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildScenarioUrl(id, hash))
    }

    scrollToSection(hash, prefersReducedMotion)
  }

  function toggleMission(scenarioId: string, missionId: string) {
    setCompletedMissionIdsByScenario((currentState) => {
      const currentMissionIds = currentState[scenarioId] ?? []
      const nextMissionIds = currentMissionIds.includes(missionId)
        ? currentMissionIds.filter((id) => id !== missionId)
        : [...currentMissionIds, missionId]

      return {
        ...currentState,
        [scenarioId]: nextMissionIds,
      }
    })
  }

  function selectCompareScenarioA(id: string) {
    if (!getScenarioById(id)) {
      return
    }

    setCompareScenarioAId(id)
    setCompareScenarioBId((currentId) => (currentId === id ? getFallbackCompareScenarioId(id) : currentId))
  }

  function selectCompareScenarioB(id: string) {
    if (!getScenarioById(id) || id === compareScenarioAId) {
      return
    }

    setCompareScenarioBId(id)
  }

  function loadCompareFromInquiryPath(path: Pick<AtlasInquiryPath | AtlasMapRoute, 'scenarioIds' | 'lensKey'>) {
    const validScenarioIds = path.scenarioIds.filter((id) => getScenarioById(id))
    const firstScenarioId = validScenarioIds[0] ?? defaultCompareScenarioAId
    const secondScenarioId = validScenarioIds.find((id) => id !== firstScenarioId) ?? getFallbackCompareScenarioId(firstScenarioId)

    setCompareScenarioAId(firstScenarioId)
    setCompareScenarioBId(secondScenarioId)
    setSelectedLensKey(path.lensKey)
    setActivePage('atlas')
    setActiveAtlasSubpage('compare')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('atlas', sectionIds.compareLab))
    }

    window.requestAnimationFrame(() => {
      document.getElementById(sectionIds.compareLab)?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }

  function loadCompareLens(lens: CompareLens) {
    setSelectedLensKey(lens.key)
    setActivePage('atlas')
    setActiveAtlasSubpage('compare')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('atlas', sectionIds.compareLab))
    }

    window.requestAnimationFrame(() => {
      document.getElementById(sectionIds.compareLab)?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }

  function loadCausationInquiry(inquiryId: string) {
    if (!causationInquiryDefinitions.some((inquiry) => inquiry.id === inquiryId)) {
      return
    }

    setSelectedCausationInquiryId(inquiryId)
    setActivePage('labs')
    setActiveLabsSubpage('causation')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('labs', sectionIds.causationLab))
    }

    scrollToSection(sectionIds.causationLab, prefersReducedMotion)
  }

  function loadPeriodizationInquiry(inquiryId: string) {
    if (!periodizationInquiryDefinitions.some((inquiry) => inquiry.id === inquiryId)) {
      return
    }

    setSelectedPeriodizationInquiryId(inquiryId)
    setActivePage('labs')
    setActiveLabsSubpage('periodization')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('labs', sectionIds.periodizationLab))
    }

    scrollToSection(sectionIds.periodizationLab, prefersReducedMotion)
  }

  function loadPerspectivesInquiry(inquiryId: string) {
    if (!perspectivesInquiryDefinitions.some((inquiry) => inquiry.id === inquiryId)) {
      return
    }

    setSelectedPerspectivesInquiryId(inquiryId)
    setActivePage('labs')
    setActiveLabsSubpage('perspectives')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('labs', sectionIds.perspectivesLab))
    }

    scrollToSection(sectionIds.perspectivesLab, prefersReducedMotion)
  }

  function loadContextInquiry(inquiryId: string) {
    if (!contextInquiryDefinitions.some((inquiry) => inquiry.id === inquiryId)) {
      return
    }

    setSelectedContextInquiryId(inquiryId)
    setActivePage('labs')
    setActiveLabsSubpage('context')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('labs', sectionIds.contextLab))
    }

    scrollToSection(sectionIds.contextLab, prefersReducedMotion)
  }

  function loadSignificanceInquiry(inquiryId: string) {
    if (!significanceInquiryDefinitions.some((inquiry) => inquiry.id === inquiryId)) {
      return
    }

    setSelectedSignificanceInquiryId(inquiryId)
    setActivePage('labs')
    setActiveLabsSubpage('significance')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('labs', sectionIds.significanceLab))
    }

    scrollToSection(sectionIds.significanceLab, prefersReducedMotion)
  }

  function loadSynthesisPreset(presetId: string) {
    if (!synthesisInquiryPresets.some((preset) => preset.id === presetId)) {
      return
    }

    setSelectedSynthesisPresetId(presetId)
    setActivePage('labs')
    setActiveLabsSubpage('synthesis')

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildPageUrl('labs', sectionIds.synthesisStudio))
    }

    scrollToSection(sectionIds.synthesisStudio, prefersReducedMotion)
  }


  function launchTaskModuleAction(action: TaskModuleAction) {
    if (action.type === 'scenario') {
      selectScenario(action.scenarioId, action.hash ?? defaultScenarioSectionId)
      return
    }

    if (action.type === 'atlas') {
      if (action.inquiryPathId) {
        const path = atlasInquiryPaths.find((candidate) => candidate.id === action.inquiryPathId)
        if (path) {
          loadCompareFromInquiryPath(path)
          return
        }
      }

      if (action.routeId) {
        const route = atlasMapRoutes.find((candidate) => candidate.id === action.routeId)
        if (route) {
          loadCompareFromInquiryPath(route)
          return
        }
      }

      navigateToPage('atlas', action.hash)
      return
    }

    if (action.type === 'labs') {
      if (action.lab === 'causation' && action.inquiryId) {
        loadCausationInquiry(action.inquiryId)
        return
      }

      if (action.lab === 'periodization' && action.inquiryId) {
        loadPeriodizationInquiry(action.inquiryId)
        return
      }

      if (action.lab === 'perspectives' && action.inquiryId) {
        loadPerspectivesInquiry(action.inquiryId)
        return
      }

      if (action.lab === 'context' && action.inquiryId) {
        loadContextInquiry(action.inquiryId)
        return
      }

      if (action.lab === 'significance' && action.inquiryId) {
        loadSignificanceInquiry(action.inquiryId)
        return
      }

      if (action.lab === 'synthesis') {
        loadSynthesisPreset(action.inquiryId ?? synthesisInquiryPresets[0]?.id ?? '')
        return
      }

      navigateToPage('labs', getHashForLabsSubpage(action.lab))
      return
    }

    if (action.type === 'evidence') {
      navigateToPage('evidence', 'source-atlas')
      return
    }

    loadSynthesisPreset(action.presetId)
  }

  function selectScenarioTab(tab: ScenarioExperienceTab) {
    setSelectedScenarioTab(tab)

    const hash = getHashForScenarioTab(tab)

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', buildScenarioUrl(selectedScenario.id, hash))
    }

    scrollToSection(hash, prefersReducedMotion)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0a08] text-stone-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(215,168,75,0.22),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(124,199,178,0.14),transparent_28%),linear-gradient(180deg,#15110b_0%,#0b0a08_46%,#050505_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:72px_72px]" />

      <AppShell activePage={activePage} onNavigate={navigateToPage}>
        {activePage === 'home' ? (
          <>
            <Hero
              prefersReducedMotion={prefersReducedMotion}
              onStart={() => navigateToPage('home', 'gallery')}
              onOpenAtlas={() => navigateToPage('atlas', 'atlas-inquiry-paths')}
              onOpenAbout={() => navigateToPage('about', 'about')}
            />
            <ScenarioGallery
              selectedScenarioId={selectedScenarioId}
              completedMissionIdsByScenario={completedMissionIdsByScenario}
              missionWorkCountByScenario={missionWorkCountByScenario}
              onSelect={selectScenario}
            />
            <AtlasOverview
              selectedScenarioId={selectedScenarioId}
              totalCompletedMissionCount={totalCompletedMissionCount}
              missionWorkCountByScenario={missionWorkCountByScenario}
              onSelect={selectScenario}
            />
          </>
        ) : null}

        {activePage === 'scenario' ? (
          <ScenarioExperience
            scenario={selectedScenario}
            selectedTab={selectedScenarioTab}
            onSelectTab={selectScenarioTab}
            selectedOption={selectedOption}
            onSelectOption={setSelectedOptionId}
            completedMissionIds={completedMissionIds}
            completedMissionCount={completedMissionCount}
            missionWorkState={missionWorkState}
            argumentDraft={argumentDraftState[selectedScenario.id] ?? getEmptyArgumentDraft()}
            actorNetworkDraftState={actorNetworkDraftState}
            onToggleMission={toggleMission}
            onUpdateMissionWork={setMissionWorkState}
            onUpdateArgumentDraft={setArgumentDraftState}
            onUpdateActorNetworkDraftState={setActorNetworkDraftState}
            prefersReducedMotion={prefersReducedMotion}
            onOpenDebateStudio={openDebateStudio}
          />
        ) : null}

        {activePage === 'atlas' ? (
          <>
            <SubpageNav
              ariaLabel="Atlas 子页面"
              items={atlasSubpages}
              activeId={activeAtlasSubpage}
              onSelect={selectAtlasSubpage}
            />
            {activeAtlasSubpage === 'routes' ? (
              <TimeSpaceAtlasPanel
                selectedScenarioId={selectedScenarioId}
                workspaceState={workspaceState}
                onUpdateWorkspaceState={setWorkspaceState}
                onOpenScenario={selectScenario}
                onLoadCompare={loadCompareFromInquiryPath}
              />
            ) : null}
            {activeAtlasSubpage === 'missions' ? (
              <AtlasMissionsPanel
                workspaceState={workspaceState}
                onUpdateWorkspaceState={setWorkspaceState}
              />
            ) : null}
            {activeAtlasSubpage === 'pathways' ? (
              <AtlasInquiryPathsPanel
                workspaceState={workspaceState}
                onUpdateWorkspaceState={setWorkspaceState}
                onOpenScenario={selectScenario}
                onLoadCompare={loadCompareFromInquiryPath}
              />
            ) : null}
            {activeAtlasSubpage === 'compare' ? (
              <CompareLabPanel
                scenarioA={compareScenarioA}
                scenarioB={compareScenarioB}
                selectedLens={selectedLens}
                draftState={compareDraftState}
                onSelectScenarioA={selectCompareScenarioA}
                onSelectScenarioB={selectCompareScenarioB}
                onSelectLens={setSelectedLensKey}
                onUpdateDraftState={setCompareDraftState}
              />
            ) : null}
          </>
        ) : null}

        {activePage === 'evidence' ? (
          <>
            <SubpageNav
              ariaLabel="Evidence 子页面"
              items={evidenceSubpages}
              activeId={activeEvidenceSubpage}
              onSelect={selectEvidenceSubpage}
            />
            {activeEvidenceSubpage === 'source-atlas' ? (
              <SourceAtlasPanel
                corroborationDraftState={corroborationDraftState}
                onUpdateCorroborationDraftState={setCorroborationDraftState}
                onOpenScenario={selectScenario}
                onLoadCompareLens={loadCompareLens}
              />
            ) : null}
            {activeEvidenceSubpage === 'case-files' ? (
              <EvidenceCaseFilesPanel
                selectedCaseFileId={selectedCaseFileId}
                draftState={caseFileDraftState}
                onSelectCaseFile={setSelectedCaseFileId}
                onUpdateDraftState={setCaseFileDraftState}
                onOpenSourceAtlas={() => selectEvidenceSubpage('source-atlas')}
                onOpenScenario={selectScenario}
              />
            ) : null}
          </>
        ) : null}

        {activePage === 'labs' ? (
          <>
            <LabsMethodChooser
              activeSubpage={activeLabsSubpage}
              causationDraftState={causationDraftState}
              periodizationDraftState={periodizationDraftState}
              perspectivesDraftState={perspectivesDraftState}
              contextDraftState={contextDraftState}
              significanceDraftState={significanceDraftState}
              synthesisDraftState={synthesisDraftState}
              onOpenEvidence={() => navigateToPage('evidence', 'source-atlas')}
              onSelectSubpage={selectLabsSubpage}
            />
            <SubpageNav
              ariaLabel="历史思维子页面"
              items={labsSubpages}
              activeId={activeLabsSubpage}
              onSelect={selectLabsSubpage}
            />
            {activeLabsSubpage === 'causation' ? (
              <CausationLabPanel
                selectedInquiryId={selectedCausationInquiryId}
                evidenceByInquiry={causationEvidenceByInquiry}
                draftState={causationDraftState}
                onSelectInquiry={setSelectedCausationInquiryId}
                onUpdateDraftState={setCausationDraftState}
                onOpenScenario={selectScenario}
              />
            ) : null}
            {activeLabsSubpage === 'periodization' ? (
              <PeriodizationLabPanel
                selectedInquiryId={selectedPeriodizationInquiryId}
                evidenceByInquiry={periodizationEvidenceByInquiry}
                draftState={periodizationDraftState}
                onSelectInquiry={setSelectedPeriodizationInquiryId}
                onUpdateDraftState={setPeriodizationDraftState}
                onOpenScenario={selectScenario}
              />
            ) : null}
            {activeLabsSubpage === 'perspectives' ? (
              <PerspectivesAgencyLabPanel
                selectedInquiryId={selectedPerspectivesInquiryId}
                evidenceByInquiry={perspectivesEvidenceByInquiry}
                draftState={perspectivesDraftState}
                onSelectInquiry={setSelectedPerspectivesInquiryId}
                onUpdateDraftState={setPerspectivesDraftState}
                onOpenScenario={selectScenario}
              />
            ) : null}
            {activeLabsSubpage === 'context' ? (
              <ContextScaleLabPanel
                selectedInquiryId={selectedContextInquiryId}
                evidenceByInquiry={contextEvidenceByInquiry}
                draftState={contextDraftState}
                onSelectInquiry={setSelectedContextInquiryId}
                onUpdateDraftState={setContextDraftState}
                onOpenScenario={selectScenario}
              />
            ) : null}
            {activeLabsSubpage === 'significance' ? (
              <SignificanceMemoryLabPanel
                selectedInquiryId={selectedSignificanceInquiryId}
                evidenceByInquiry={significanceEvidenceByInquiry}
                draftState={significanceDraftState}
                onSelectInquiry={setSelectedSignificanceInquiryId}
                onUpdateDraftState={setSignificanceDraftState}
                onOpenScenario={selectScenario}
              />
            ) : null}
            {activeLabsSubpage === 'synthesis' ? (
              <SynthesisWritingStudioPanel
                selectedPresetId={selectedSynthesisPresetId}
                evidencePool={synthesisEvidencePool}
                draftState={synthesisDraftState}
                onSelectPreset={setSelectedSynthesisPresetId}
                onUpdateDraftState={setSynthesisDraftState}
                onOpenScenario={selectScenario}
              />
            ) : null}
          </>
        ) : null}

        {activePage === 'tasks' ? (
          <>
            <SubpageNav
              ariaLabel="Tasks 子页面"
              items={tasksSubpages}
              activeId={activeTasksSubpage}
              onSelect={selectTasksSubpage}
            />
            {activeTasksSubpage === 'discover' ? (
              <TaskDiscoveryPanel
                learningCoachRecommendations={learningCoachRecommendations}
                learningCoachSnapshot={learningCoachSnapshot}
                onOpenLibraryPreset={openTaskLibraryPreset}
                onOpenScenario={selectScenario}
                onLoadCompare={loadCompareFromInquiryPath}
                onLoadCompareLens={loadCompareLens}
                onLoadCausationInquiry={loadCausationInquiry}
                onLoadPeriodizationInquiry={loadPeriodizationInquiry}
                onLoadPerspectivesInquiry={loadPerspectivesInquiry}
                onLoadContextInquiry={loadContextInquiry}
                onLoadSignificanceInquiry={loadSignificanceInquiry}
                onLoadSynthesisPreset={loadSynthesisPreset}
                onOpenEvidenceCaseFile={openEvidenceCaseFile}
                onOpenDebateStudio={openDebateStudio}
                onStartTask={startTaskWorkbench}
              />
            ) : null}
            {activeTasksSubpage === 'library' ? (
              <TaskLibraryPanel
                preset={taskLibraryPreset}
                onClearPreset={() => setTaskLibraryPreset(null)}
                onOpenScenario={selectScenario}
                onLoadCompare={loadCompareFromInquiryPath}
                onLoadCompareLens={loadCompareLens}
                onLoadCausationInquiry={loadCausationInquiry}
                onLoadPeriodizationInquiry={loadPeriodizationInquiry}
                onLoadPerspectivesInquiry={loadPerspectivesInquiry}
                onLoadContextInquiry={loadContextInquiry}
                onLoadSignificanceInquiry={loadSignificanceInquiry}
                onLoadSynthesisPreset={loadSynthesisPreset}
                onOpenEvidenceCaseFile={openEvidenceCaseFile}
                onOpenDebateStudio={openDebateStudio}
                onStartTask={startTaskWorkbench}
              />
            ) : null}
            {activeTasksSubpage === 'builder' ? (
              <AssignmentBuilderPanel
                draft={assignmentBuilderDraft}
                onUpdateDraft={setAssignmentBuilderDraft}
                libraryTasks={assignmentLibraryTasks}
                onOpenAssessmentStudio={openAssessmentStudioFromBuilder}
                onStartTask={startTaskWorkbench}
              />
            ) : null}
            {activeTasksSubpage === 'workbench' ? (
              <TaskWorkbenchPanel
                libraryTasks={assignmentLibraryTasks}
                draftState={taskWorkbenchDraftState}
                activeTaskId={activeWorkbenchTaskId}
                onSelectTask={setActiveWorkbenchTaskId}
                onUpdateDraftState={setTaskWorkbenchDraftState}
              />
            ) : null}
            {activeTasksSubpage === 'assessment' ? (
              <AssessmentStudioPanel
                assignmentBuilderDraft={assignmentBuilderDraft}
                libraryTasks={assignmentLibraryTasks}
              />
            ) : null}
            {activeTasksSubpage === 'debate' ? (
              <DebateStudioPanel initialScenarioId={selectedScenario.id} />
            ) : null}
            {activeTasksSubpage === 'sessions' ? (
              <GuidedSessionPanel
                selectedScenarioId={selectedScenario.id}
                progressState={guidedSessionProgressState}
                onUpdateProgressState={setGuidedSessionProgressState}
                onOpenScenario={selectScenario}
              />
            ) : null}
            {activeTasksSubpage === 'modules' ? (
              <TaskModulesPanel
                progressState={taskModuleProgressState}
                onUpdateProgressState={setTaskModuleProgressState}
                onLaunchAction={launchTaskModuleAction}
              />
            ) : null}
            {activeTasksSubpage === 'portfolio' ? (
              <PortfolioPanel
                completedMissionIdsByScenario={completedMissionIdsByScenario}
                missionWorkState={missionWorkState}
                workspaceState={workspaceState}
                workspaceStats={workspaceStats}
                taskModuleStats={taskModuleStats}
                taskModuleProgressState={taskModuleProgressState}
                assignmentBuilderDraft={assignmentBuilderDraft}
                assignmentLibraryTasks={assignmentLibraryTasks}
                corroborationDraftState={corroborationDraftState}
                causationDraftState={causationDraftState}
                periodizationDraftState={periodizationDraftState}
                perspectivesDraftState={perspectivesDraftState}
                contextDraftState={contextDraftState}
                significanceDraftState={significanceDraftState}
                synthesisDraftState={synthesisDraftState}
                caseFileDraftState={caseFileDraftState}
                compareDraftState={compareDraftState}
                actorNetworkDraftState={actorNetworkDraftState}
                taskWorkbenchDraftState={taskWorkbenchDraftState}
              />
            ) : null}
          </>
        ) : null}

        {activePage === 'about' ? <About /> : null}
      </AppShell>
    </main>
  )
}


function AppShell({
  activePage,
  onNavigate,
  children,
}: {
  activePage: PageId
  onNavigate: (page: PageId, hash?: string) => void
  children: ReactNode
}) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0a08]/85 backdrop-blur-xl">
        <nav className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-3 sm:px-8 lg:px-10" aria-label="TimeAtlas 页面导航">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-3 text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-300 text-stone-950 shadow-lg shadow-amber-950/25">
                <Compass size={20} />
              </span>
              <span>
                <span className="block text-sm uppercase tracking-[0.28em] text-amber-100">TimeAtlas</span>
                <span className="block text-xs text-stone-500">Interactive history workspace</span>
              </span>
            </button>

            <div className="flex flex-wrap gap-2">
              {primaryPages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => onNavigate(page)}
                  aria-current={activePage === page ? 'page' : undefined}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    activePage === page
                      ? 'border-amber-200/50 bg-amber-200/15 text-amber-100'
                      : 'border-white/10 bg-white/[0.03] text-stone-300 hover:border-amber-100/25 hover:bg-white/[0.06] hover:text-stone-100'
                  }`}
                >
                  {pageLabels[page].label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onNavigate('about')}
                aria-current={activePage === 'about' ? 'page' : undefined}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activePage === 'about'
                    ? 'border-amber-200/50 bg-amber-200/15 text-amber-100'
                    : 'border-white/10 bg-white/[0.03] text-stone-300 hover:border-amber-100/25 hover:bg-white/[0.06] hover:text-stone-100'
                }`}
              >
                {pageLabels.about.label}
              </button>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-3">
            <div className="text-xs uppercase tracking-[0.22em] text-stone-500">{pageLabels[activePage].eyebrow}</div>
            <div className="text-sm text-stone-300">{pageLabels[activePage].description}</div>
          </div>
        </nav>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

function SubpageNav<T extends string>({
  ariaLabel,
  items,
  activeId,
  onSelect,
}: {
  ariaLabel: string
  items: SubpageNavItem<T>[]
  activeId: T
  onSelect: (id: T) => void
}) {
  return (
    <nav className="mx-auto w-full max-w-7xl px-5 pt-6 sm:px-8 lg:px-10" aria-label={ariaLabel}>
      <div className="grid gap-3 rounded-[2rem] border border-white/10 bg-white/[0.035] p-3 backdrop-blur sm:grid-cols-2 lg:grid-cols-4" role="tablist">
        {items.map((item) => {
          const isActive = activeId === item.id

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(item.id)}
              className={`rounded-[1.35rem] border p-4 text-left transition ${
                isActive
                  ? 'border-amber-200/50 bg-amber-200/12 text-stone-50'
                  : 'border-white/10 bg-black/20 text-stone-400 hover:border-amber-100/25 hover:bg-white/[0.05] hover:text-stone-100'
              }`}
            >
              <div className="text-xs uppercase tracking-[0.18em] text-stone-500">{item.eyebrow}</div>
              <div className="mt-1 font-semibold">{item.label}</div>
              <div className="mt-1 text-xs leading-5 text-stone-500">{item.description}</div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

type LabsMethodChooserItem = {
  id: LabsSubpage
  title: string
  eyebrow: string
  question: string
  useCase: string
  availableLabel: string
  draftCount: number
}

function LabsMethodChooser({
  activeSubpage,
  causationDraftState,
  periodizationDraftState,
  perspectivesDraftState,
  contextDraftState,
  significanceDraftState,
  synthesisDraftState,
  onOpenEvidence,
  onSelectSubpage,
}: {
  activeSubpage: LabsSubpage
  causationDraftState: CausationDraftState
  periodizationDraftState: PeriodizationDraftState
  perspectivesDraftState: PerspectivesDraftState
  contextDraftState: ContextDraftState
  significanceDraftState: SignificanceDraftState
  synthesisDraftState: SynthesisDraftState
  onOpenEvidence: () => void
  onSelectSubpage: (subpage: LabsSubpage) => void
}) {
  const methodItems: LabsMethodChooserItem[] = [
    {
      id: 'causation',
      title: '因果与变化',
      eyebrow: 'Causation',
      question: '这个变化为什么发生？哪些条件、触发和选择共同起作用？',
      useCase: '适合把市场、制度、劳动、环境和来源限制拆成因果链。',
      availableLabel: `${causationInquiryDefinitions.length} 个探究`,
      draftCount: getActiveCausationDrafts(causationDraftState).length,
    },
    {
      id: 'periodization',
      title: '连续与分期',
      eyebrow: 'Periodization',
      question: '什么时候算转折？哪些变化背后仍有连续性？',
      useCase: '适合用时间证据轨划分阶段、命名时期并比较替代分期。',
      availableLabel: `${periodizationInquiryDefinitions.length} 个探究`,
      draftCount: getActivePeriodizationDrafts(periodizationDraftState).length,
    },
    {
      id: 'perspectives',
      title: '多视角与能动性',
      eyebrow: 'Perspectives',
      question: '当时的人能看到什么、选择什么，又被哪些力量限制？',
      useCase: '适合避免后见之明，把行动者、缺席声音和来源视角分开。',
      availableLabel: `${perspectivesInquiryDefinitions.length} 个探究`,
      draftCount: getActivePerspectivesDrafts(perspectivesDraftState).length,
    },
    {
      id: 'context',
      title: '情境与尺度',
      eyebrow: 'Context',
      question: '地方现场如何连接到区域网络、帝国制度或全球商品链？',
      useCase: '适合从 local 到 regional / imperial-global 建立解释尺度。',
      availableLabel: `${contextInquiryDefinitions.length} 个探究`,
      draftCount: getActiveContextDrafts(contextDraftState).length,
    },
    {
      id: 'significance',
      title: '历史意义与记忆',
      eyebrow: 'Significance',
      question: '这件事为什么重要？对谁重要，后来又如何被记忆或争议？',
      useCase: '适合把当时影响、长期遗产、公共记忆和档案沉默连起来。',
      availableLabel: `${significanceInquiryDefinitions.length} 个探究`,
      draftCount: getActiveSignificanceDrafts(significanceDraftState).length,
    },
    {
      id: 'synthesis',
      title: '综合写作',
      eyebrow: 'Synthesis',
      question: '如何把互证、因果、分期、视角、情境和意义写成论证？',
      useCase: '适合把各 Lab 草稿和证据池合成为段落计划与历史论证。',
      availableLabel: `${synthesisInquiryPresets.length} 个预设`,
      draftCount: getActiveSynthesisDrafts(synthesisDraftState).length,
    },
  ]

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-8 sm:px-8 lg:px-10" aria-labelledby="labs-method-chooser-title">
      <div className="overflow-hidden rounded-[2.5rem] border border-amber-200/15 bg-[linear-gradient(135deg,rgba(251,191,36,0.13),rgba(20,184,166,0.06)_46%,rgba(15,23,42,0.22))] p-5 shadow-2xl shadow-black/20 backdrop-blur md:p-7">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-amber-100/70">Labs orientation</p>
              <h2 id="labs-method-chooser-title" className="mt-2 text-3xl font-semibold tracking-tight text-stone-50 sm:text-4xl">
                从问题选择历史思维工具
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                先判断你要回答的问题类型，再进入对应 Lab：每个工具都带有策展探究、证据轨、可保存草稿和可复制输出。
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-4" aria-label="推荐 Labs 学习顺序">
              <div className="text-xs uppercase tracking-[0.22em] text-stone-500">Recommended sequence</div>
              <div className="mt-3 flex flex-col gap-2 text-sm font-semibold text-stone-200 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onOpenEvidence}
                  className="rounded-full border border-teal-200/25 bg-teal-100/10 px-4 py-2 text-teal-100 transition hover:border-teal-100/45 hover:bg-teal-100/15"
                >
                  证据互证
                </button>
                <span className="hidden text-stone-500 sm:inline">→</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-stone-300">
                  因果 / 分期 / 多视角 / 情境 / 意义
                </span>
                <span className="hidden text-stone-500 sm:inline">→</span>
                <button
                  type="button"
                  onClick={() => onSelectSubpage('synthesis')}
                  className="rounded-full border border-fuchsia-200/25 bg-fuchsia-100/10 px-4 py-2 text-fuchsia-100 transition hover:border-fuchsia-100/45 hover:bg-fuchsia-100/15"
                >
                  综合写作
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {methodItems.map((item) => {
              const isActive = activeSubpage === item.id

              return (
                <article
                  key={item.id}
                  className={`flex min-h-[15rem] flex-col rounded-[1.6rem] border p-4 transition ${
                    isActive
                      ? 'border-amber-200/55 bg-amber-100/[0.12] shadow-lg shadow-amber-950/20'
                      : 'border-white/10 bg-black/25 hover:border-amber-100/30 hover:bg-white/[0.055]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-stone-500">{item.eyebrow}</div>
                      <h3 className="mt-1 text-lg font-semibold text-stone-50">{item.title}</h3>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? 'bg-amber-200 text-stone-950' : 'bg-white/10 text-stone-300'}`}>
                      {isActive ? '当前' : '可选'}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-amber-50/90">{item.question}</p>
                  <p className="mt-2 text-xs leading-5 text-stone-400">{item.useCase}</p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-4 text-xs font-semibold text-stone-300">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">{item.availableLabel}</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">{item.draftCount} 个草稿</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectSubpage(item.id)}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
                  >
                    进入{item.title}
                    <ArrowRight size={16} />
                  </button>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Hero({
  prefersReducedMotion,
  onStart,
  onOpenAtlas,
  onOpenAbout,
}: {
  prefersReducedMotion: boolean | null
  onStart: () => void
  onOpenAtlas: () => void
  onOpenAbout: () => void
}) {
  const introMotion = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7 } }
  const atlasMotion = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 24 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { delay: 0.15, duration: 0.8 },
      }

  return (
    <section className="relative mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col justify-center px-5 py-10 sm:px-8 lg:px-10">
      <div className="absolute left-1/2 top-8 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-amber-200/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.35em] text-amber-100/70 backdrop-blur md:flex">
        <Compass size={14} />
        TimeAtlas · interactive history
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div {...introMotion} className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-4 py-2 text-sm text-amber-100">
            <Sparkles size={16} />
            不是背年份，而是进入历史现场
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-6xl font-semibold leading-[0.92] tracking-[-0.06em] text-stone-50 sm:text-7xl lg:text-8xl">
              选择一个身份，走进一个时代。
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-300 sm:text-xl">
              TimeAtlas 把历史做成可以体验的现场：你会看到普通人的一天，面对时代岔路口，再把自己的选择放回真实历史中理解。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onStart}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
            >
              开始探索
              <ArrowRight className="transition group-hover:translate-x-1" size={18} />
            </button>
            <button
              type="button"
              onClick={onOpenAtlas}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 font-semibold text-stone-100 transition hover:bg-white/[0.08]"
            >
              探究路径
              <Route size={18} />
            </button>
            <button
              type="button"
              onClick={onOpenAbout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 font-semibold text-stone-300 transition hover:bg-white/[0.06] hover:text-stone-100"
            >
              项目理念
            </button>
          </div>

          <div className="grid max-w-xl grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
            {statItems.map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <div className="text-3xl font-semibold text-amber-200">{item.value}</div>
                <div className="mt-1 text-sm text-stone-400">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...atlasMotion} className="relative">
          <div className="absolute -inset-8 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-amber-100/15 bg-[#15110b]/90 p-5 shadow-2xl shadow-black/50">
            <div className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(215,168,75,0.14),transparent_55%),#0f0d0a] p-6">
              <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-stone-500">
                <span>living archive</span>
                <span>{earliestScenarioYear} → {latestScenarioYear}</span>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-full border border-amber-200/20 bg-[#090806]">
                <div className="absolute inset-8 rounded-full border border-amber-200/20" />
                <div className="absolute inset-20 rounded-full border border-teal-200/10" />
                <div className="absolute left-[18%] top-[32%] h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_28px_rgba(252,211,77,0.8)]" />
                <div className="absolute right-[25%] top-[43%] h-2 w-2 rounded-full bg-teal-200 shadow-[0_0_24px_rgba(153,246,228,0.7)]" />
                <div className="absolute bottom-[25%] left-[36%] h-2.5 w-2.5 rounded-full bg-orange-300 shadow-[0_0_24px_rgba(253,186,116,0.7)]" />
                <div className="absolute left-[16%] top-[34%] h-px w-[62%] rotate-12 bg-gradient-to-r from-amber-300/0 via-amber-200/60 to-amber-300/0" />
                <div className="absolute bottom-[31%] left-[39%] h-px w-[40%] -rotate-[28deg] bg-gradient-to-r from-teal-200/0 via-teal-100/50 to-teal-200/0" />
                <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur">
                  <div className="flex items-center gap-3 text-amber-100">
                    <Route size={18} />
                    <span className="font-medium">从人物命运出发，连接时间、地点与跨区域路线。</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ScenarioGallery({
  selectedScenarioId,
  completedMissionIdsByScenario,
  missionWorkCountByScenario,
  onSelect,
}: {
  selectedScenarioId: string
  completedMissionIdsByScenario: Record<string, string[]>
  missionWorkCountByScenario: Record<string, number>
  onSelect: (id: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [themeFilter, setThemeFilter] = useState('all')

  const filteredScenarios = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return scenarios.filter((scenario) => {
      const searchableText = [
        scenario.title,
        scenario.era,
        scenario.location,
        scenario.identity,
        scenario.theme,
        ...scenario.keyTerms.flatMap((term) => [term.term, term.definition]),
        ...scenario.sceneBeats.flatMap((beat) => [
          beat.timeLabel,
          beat.title,
          beat.sensoryDetail,
          beat.historicalTension,
          beat.evidenceHook,
          beat.learnerPrompt,
          ...beat.linkedSourceTitles,
        ]),
        ...scenario.sources.flatMap((source) => [
          source.title,
          source.creator,
          source.relevance,
          source.excerpt,
          source.perspective,
          ...source.evidenceTags,
        ]),
        ...scenario.missions.flatMap((mission) => [mission.title, mission.taskType, mission.instruction, mission.deliverable]),
        ...scenario.activityPacks.flatMap((activity) => [
          activity.title,
          activityPackModeLabels[activity.mode],
          activity.audience,
          activity.prompt,
          activity.deliverable,
          ...activity.materials,
          ...activity.steps,
          ...activity.successCriteria,
          ...activity.linkedSourceTitles,
          ...activity.linkedSceneBeatTitles,
        ]),
      ].join(' ').toLowerCase()
      const matchesSearch = normalizedQuery ? searchableText.includes(normalizedQuery) : true
      const matchesRegion = regionFilter === 'all' || scenario.region === regionFilter
      const matchesTheme = themeFilter === 'all' || scenario.theme.includes(themeFilter)

      return matchesSearch && matchesRegion && matchesTheme
    })
  }, [regionFilter, searchQuery, themeFilter])

  return (
    <section id="gallery" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <SectionHeader
        eyebrow="选择历史身份"
        title={`浏览 ${filteredScenarios.length}/${scenarios.length} 个历史身份`}
        description="他们不一定出现在史书标题里，却站在贸易、城市、战争、制度变化的交汇处。"
      />

      <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
        <div className="grid gap-3 lg:grid-cols-[1fr_0.42fr_0.42fr]">
          <label className="relative block">
            <span className="sr-only">搜索历史身份</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="搜索标题、时代、地点、身份或主题"
              className="w-full rounded-full border border-white/10 bg-black/25 py-3 pl-11 pr-4 text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-200/60 focus:bg-black/35"
            />
          </label>

          <label className="block">
            <span className="sr-only">按地区筛选</span>
            <select
              value={regionFilter}
              onChange={(event) => setRegionFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
            >
              <option value="all">全部地区</option>
              {regionOptions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">按主题筛选</span>
            <select
              value={themeFilter}
              onChange={(event) => setThemeFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
            >
              <option value="all">全部主题</option>
              {themeOptions.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filteredScenarios.length > 0 ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredScenarios.map((scenario) => {
            const isSelected = selectedScenarioId === scenario.id
            const completedCount = completedMissionIdsByScenario[scenario.id]?.length ?? 0
            const draftedCount = missionWorkCountByScenario[scenario.id] ?? 0
            const progressLabel = `${completedCount}/${scenario.missions.length}`

            return (
              <button
                key={scenario.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`选择场景：${scenario.title}`}
                onClick={() => onSelect(scenario.id)}
                className={`group rounded-[1.75rem] border p-5 text-left transition duration-300 ${
                  isSelected
                    ? 'border-amber-200/50 bg-amber-200/10 shadow-2xl shadow-amber-950/30'
                    : 'border-white/10 bg-white/[0.035] hover:border-amber-100/30 hover:bg-white/[0.06]'
                }`}
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-stone-950 shadow-lg"
                  style={{ backgroundColor: scenario.accent }}
                >
                  <Landmark size={22} />
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-stone-400">{scenario.era} · {scenario.location}</div>
                  <h3 className="text-xl font-semibold leading-tight text-stone-50">{scenario.title}</h3>
                  <p className="line-clamp-4 text-sm leading-6 text-stone-400">{scenario.summary}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Tag>{scenario.theme}</Tag>
                    <Tag>{scenario.region}</Tag>
                    <Tag>{scenario.year}</Tag>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 text-[0.68rem] uppercase tracking-[0.16em] text-stone-500">
                    <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1">{scenario.sceneBeats.length} scenes</span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1">{scenario.activityPacks.length} activities</span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1">{scenario.sources.length} sources</span>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center justify-between gap-3 text-xs text-stone-400">
                      <span>任务完成 {progressLabel}</span>
                      <span>{draftedCount} 个草稿</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/35" aria-hidden="true">
                      <div
                        className="h-full rounded-full bg-amber-300"
                        style={{ width: `${scenario.missions.length ? (completedCount / scenario.missions.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="mt-10 rounded-[2rem] border border-dashed border-white/15 bg-black/20 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-200/10 text-amber-100">
            <Search size={22} />
          </div>
          <h3 className="text-2xl font-semibold text-stone-50">没有找到匹配的历史身份</h3>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-stone-400">
            试着清空搜索词，或把地区和主题筛选调回“全部”。TimeAtlas 会继续扩展更多地点与时代。
          </p>
        </div>
      )}
    </section>
  )
}

function AtlasOverview({
  selectedScenarioId,
  totalCompletedMissionCount,
  missionWorkCountByScenario,
  onSelect,
}: {
  selectedScenarioId: string
  totalCompletedMissionCount: number
  missionWorkCountByScenario: Record<string, number>
  onSelect: (id: string) => void
}) {
  const progressLabel = `${totalCompletedMissionCount}/${totalMissionCount}`

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="atlas-overview-title">
      <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-[1.5rem] border border-amber-200/15 bg-amber-100/[0.055] p-5">
          <div className="mb-4 flex items-center gap-3 text-amber-100">
            <ClipboardList size={20} />
            <span className="text-sm uppercase tracking-[0.3em]">global progress</span>
          </div>
          <h2 id="atlas-overview-title" className="text-3xl font-semibold tracking-tight text-stone-50">
            任务进度与时间地图
          </h2>
          <p className="mt-3 leading-7 text-stone-400">
            你的任务完成情况会优先保存在本机 localStorage；若浏览器限制本地存储，则安全回退到 sessionStorage。
          </p>
          <div className="mt-5 flex items-end gap-4">
            <div className="text-5xl font-semibold text-amber-200">{progressLabel}</div>
            <div className="pb-2 text-sm text-stone-400">全部史证任务</div>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal-200/20 bg-teal-100/[0.06] px-3 py-1.5 text-sm text-teal-100">
            已有 {Object.values(missionWorkCountByScenario).reduce((sum, count) => sum + count, 0)} 个任务草稿
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/35" aria-hidden="true">
            <div
              className="h-full rounded-full bg-amber-300"
              style={{ width: `${totalMissionCount ? (totalCompletedMissionCount / totalMissionCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#090806]/70 p-5">
            <div className="mb-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.25em] text-stone-500">
              <span>atlas points</span>
              <span>{earliestScenarioYear} → {latestScenarioYear}</span>
            </div>
            <div className="relative h-56 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_42%,rgba(252,211,77,0.14),transparent_28%),linear-gradient(135deg,rgba(20,184,166,0.12),transparent_45%),#0f0d0a]">
              <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:32px_32px]" />
              {scenarios.map((scenario) => {
                const [latitude, longitude] = scenario.coordinates
                const x = Math.min(94, Math.max(6, ((longitude + 180) / 360) * 100))
                const y = Math.min(90, Math.max(10, ((90 - latitude) / 180) * 100))
                const isSelected = scenario.id === selectedScenarioId

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => onSelect(scenario.id)}
                    aria-label={`在概览中选择：${scenario.title}`}
                    className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-stone-950 transition focus:outline-none focus:ring-2 focus:ring-amber-200 ${
                      isSelected ? 'scale-125 shadow-[0_0_26px_rgba(252,211,77,0.85)]' : 'hover:scale-125'
                    }`}
                    style={{ backgroundColor: scenario.accent, left: `${x}%`, top: `${y}%` }}
                  />
                )
              })}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
            <div className="mb-4 flex items-center gap-3 text-teal-100">
              <Route size={19} />
              <span className="text-sm uppercase tracking-[0.25em]">timeline overview</span>
            </div>
            <div className="space-y-3">
              {sortedScenarios.map((scenario) => {
                const isSelected = scenario.id === selectedScenarioId
                const draftedCount = missionWorkCountByScenario[scenario.id] ?? 0

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => onSelect(scenario.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? 'border-amber-200/40 bg-amber-200/10'
                        : 'border-white/10 bg-white/[0.025] hover:border-amber-100/25 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="w-14 shrink-0 text-sm font-semibold text-amber-100">{scenario.year}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-stone-50">{scenario.title}</span>
                      <span className="block text-sm text-stone-500">{scenario.location}</span>
                    </span>
                    <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-xs text-stone-400">
                      {draftedCount} 草稿
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function TimeSpaceAtlasPanel({
  selectedScenarioId,
  workspaceState,
  onUpdateWorkspaceState,
  onOpenScenario,
  onLoadCompare,
}: {
  selectedScenarioId: string
  workspaceState: WorkspaceState
  onUpdateWorkspaceState: Dispatch<SetStateAction<WorkspaceState>>
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
  onLoadCompare: (route: AtlasMapRoute) => void
}) {
  const [selectedRouteId, setSelectedRouteId] = useState(atlasMapRoutes[0]?.id ?? '')
  const [regionFilter, setRegionFilter] = useState('all')
  const [themeFilter, setThemeFilter] = useState('all')
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const selectedRoute = atlasMapRoutes.find((route) => route.id === selectedRouteId) ?? atlasMapRoutes[0]
  const routeScenarios = selectedRoute.scenarioIds
    .map((id) => getScenarioById(id))
    .filter((scenario): scenario is Scenario => Boolean(scenario))
  const highlightedScenario = routeScenarios.find((scenario) => scenario.id === selectedScenarioId) ?? routeScenarios[0]
  const visibleScenarios = sortedScenarios.filter((scenario) => {
    const matchesRegion = regionFilter === 'all' || scenario.region === regionFilter
    const matchesTheme = themeFilter === 'all' || scenario.theme.includes(themeFilter)

    return matchesRegion && matchesTheme
  })
  const routeScenarioIds = new Set(routeScenarios.map((scenario) => scenario.id))
  const lens = getCompareLensByKey(selectedRoute.lensKey)
  const routeNotebookEntry = workspaceState.routeNotebooks[selectedRoute.id] ?? getEmptyWorkspaceEntry()
  const routeNotebookStatus = getRouteNotebookStatus(selectedRoute, routeNotebookEntry)
  const routeStopItems = routeScenarios.map((scenario) => `stop:${scenario.id}`)
  const routeEvidenceItems = selectedRoute.evidencePrompts.map((prompt) => `evidence:${prompt}`)

  function updateRouteNotebookEntry(routeId: string, nextEntry: WorkspaceEntry) {
    onUpdateWorkspaceState((currentState) => ({
      ...currentState,
      routeNotebooks: {
        ...currentState.routeNotebooks,
        [routeId]: {
          ...nextEntry,
          updatedAt: new Date().toISOString(),
        },
      },
    }))
  }

  function toggleRouteNotebookItem(item: string) {
    const checkedEvidence = routeNotebookEntry.checkedEvidence.includes(item)
      ? routeNotebookEntry.checkedEvidence.filter((candidate) => candidate !== item)
      : [...routeNotebookEntry.checkedEvidence, item]

    updateRouteNotebookEntry(selectedRoute.id, { ...routeNotebookEntry, checkedEvidence })
  }

  async function copyRouteNotebook(route: AtlasMapRoute, entry: WorkspaceEntry) {
    try {
      await copyTextToClipboard(formatAtlasMapRouteAssignment(route, entry))
      setCopyStatus(`${route.id}:notebook`)
    } catch {
      setCopyStatus('failed')
    }
  }

  async function copyRouteAssignment(route: AtlasMapRoute) {
    try {
      await copyTextToClipboard(formatAtlasMapRouteAssignment(route, workspaceState.routeNotebooks[route.id] ?? getEmptyWorkspaceEntry()))
      setCopyStatus(route.id)
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="time-space-atlas" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="time-space-atlas-title">
      <div className="rounded-[2rem] border border-emerald-200/15 bg-emerald-100/[0.04] p-5">
        <div className="mb-4 flex items-center gap-3 text-emerald-100">
          <MapPin size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">time-space atlas / route explorer</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="time-space-atlas-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Time-Space Atlas / Route Explorer
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              用现有 scenario 的年份、坐标、地区与主题生成互动历史地图、时间轨和 inquiry-route launcher。选择路线后，地图 pins、时间线、场景预览与作业单会同步高亮。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {atlasMapRoutes.length} 条策展路线 · {visibleScenarios.length}/{scenarios.length} 个地图点可见
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_0.7fr_0.7fr]">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">Inquiry route</span>
            <select
              value={selectedRoute.id}
              onChange={(event) => setSelectedRouteId(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-emerald-200/60"
            >
              {atlasMapRoutes.map((route) => <option key={route.id} value={route.id}>{route.title}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">地区筛选</span>
            <select
              value={regionFilter}
              onChange={(event) => setRegionFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-emerald-200/60"
            >
              <option value="all">全部地区</option>
              {regionOptions.map((region) => <option key={region} value={region}>{region}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">主题筛选</span>
            <select
              value={themeFilter}
              onChange={(event) => setThemeFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-emerald-200/60"
            >
              <option value="all">全部主题</option>
              {themeOptions.map((theme) => <option key={theme} value={theme}>{theme}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4">
            <div className="relative h-[29rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_25%_28%,rgba(16,185,129,0.20),transparent_24%),radial-gradient(circle_at_74%_48%,rgba(251,191,36,0.12),transparent_22%),linear-gradient(135deg,rgba(20,184,166,0.12),transparent_48%),#090806]">
              <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:36px_36px]" />
              <div className="absolute left-5 top-5 rounded-full border border-emerald-200/20 bg-black/35 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-emerald-100">
                stylized coordinate atlas
              </div>
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polyline
                  points={routeScenarios.map((scenario) => {
                    const [latitude, longitude] = scenario.coordinates
                    const x = Math.min(94, Math.max(6, ((longitude + 180) / 360) * 100))
                    const y = Math.min(90, Math.max(10, ((90 - latitude) / 180) * 100))

                    return `${x},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(251,191,36,0.72)"
                  strokeWidth="0.65"
                  strokeDasharray="2 2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {visibleScenarios.map((scenario) => {
                const [latitude, longitude] = scenario.coordinates
                const x = Math.min(94, Math.max(6, ((longitude + 180) / 360) * 100))
                const y = Math.min(90, Math.max(10, ((90 - latitude) / 180) * 100))
                const isInRoute = routeScenarioIds.has(scenario.id)
                const isSelected = scenario.id === highlightedScenario?.id || scenario.id === selectedScenarioId

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => onOpenScenario(scenario.id, sectionIds.sceneReader)}
                    aria-label={`打开地图场景：${scenario.title}`}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-emerald-100 ${
                      isSelected
                        ? 'h-6 w-6 border-amber-100 shadow-[0_0_28px_rgba(251,191,36,0.85)]'
                        : isInRoute
                          ? 'h-5 w-5 border-amber-100/80 shadow-[0_0_20px_rgba(16,185,129,0.45)]'
                          : 'h-3.5 w-3.5 border-stone-950 opacity-50 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: scenario.accent, left: `${x}%`, top: `${y}%` }}
                  >
                    <span className="pointer-events-none absolute left-1/2 top-7 z-10 hidden w-48 -translate-x-1/2 rounded-2xl border border-white/10 bg-stone-950/95 p-3 text-left text-xs leading-5 text-stone-300 shadow-2xl group-hover:block">
                      <span className="block font-semibold text-stone-50">{scenario.title}</span>
                      <span>{scenario.year} · {scenario.region} · {scenario.location}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <div className="mb-4 flex items-center gap-3 text-emerald-100">
                <Clock3 size={18} />
                <h3 className="font-semibold text-stone-50">Route timeline rail</h3>
              </div>
              <div className="relative py-3">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/10" aria-hidden="true" />
                <div className="relative flex items-center justify-between gap-3">
                  {routeScenarios.map((scenario, index) => (
                    <button
                      key={`${selectedRoute.id}-${scenario.id}`}
                      type="button"
                      onClick={() => onOpenScenario(scenario.id, sectionIds.experience)}
                      className="group flex min-w-0 flex-1 flex-col items-center gap-2 text-center"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-950 text-xs font-bold text-stone-950 shadow-lg" style={{ backgroundColor: scenario.accent }}>
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-amber-100">{scenario.year}</span>
                      <span className="max-w-32 text-xs leading-5 text-stone-500 transition group-hover:text-stone-300">{scenario.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <article className="rounded-[1.5rem] border border-emerald-200/15 bg-emerald-100/[0.045] p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                <span className="rounded-full border border-emerald-200/20 bg-emerald-100/[0.06] px-3 py-1 text-emerald-100">{lens.title}</span>
                <span>{routeScenarios.length} stops</span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-stone-50">{selectedRoute.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-400">{selectedRoute.subtitle}</p>
              <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-300">
                <span className="font-semibold text-emerald-100">Route question：</span>{selectedRoute.routeQuestion}
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-400">
                  <span className="font-semibold text-stone-100">Map focus：</span>{selectedRoute.mapFocus}
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-400">
                  <span className="font-semibold text-stone-100">Classroom use：</span>{selectedRoute.classroomUse}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs ${
                  routeNotebookStatus === 'completed'
                    ? 'border-teal-200/20 bg-teal-100/[0.08] text-teal-100'
                    : routeNotebookStatus === 'draft'
                      ? 'border-amber-200/20 bg-amber-100/[0.08] text-amber-100'
                      : 'border-white/10 bg-white/[0.035] text-stone-400'
                }`}>
                  Route notebook · {getStatusLabel(routeNotebookStatus)}
                </span>
                {selectedRoute.tags.map((tag) => <Tag key={`${selectedRoute.id}-${tag}`}>{tag}</Tag>)}
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => routeScenarios[0] ? onOpenScenario(routeScenarios[0].id, sectionIds.sceneReader) : undefined}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
                >
                  打开第一站
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => onLoadCompare(selectedRoute)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-100/[0.08] px-5 py-3 font-semibold text-emerald-100 transition hover:bg-emerald-100/[0.14]"
                >
                  <Scale size={18} />
                  载入 Compare Lab
                </button>
                <button
                  type="button"
                  onClick={() => void copyRouteAssignment(selectedRoute)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 font-semibold text-stone-100 transition hover:bg-white/[0.08]"
                >
                  {copyStatus === selectedRoute.id ? <Check size={18} /> : <Copy size={18} />}
                  {copyStatus === selectedRoute.id ? '路线作业单已复制' : copyStatus === 'failed' ? '复制失败' : '复制 / 导出路线作业单'}
                </button>
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-teal-200/15 bg-teal-100/[0.045] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-teal-100">
                    <BookOpen size={16} />
                    route inquiry notebook
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-50">路线探究笔记：{selectedRoute.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">勾选已访问站点与证据提示，写下路线判断，再把 notebook 一起复制到学习档案或课堂提交。</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateRouteNotebookEntry(selectedRoute.id, { ...routeNotebookEntry, completed: !routeNotebookEntry.completed })}
                  aria-pressed={routeNotebookEntry.completed}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
                >
                  {routeNotebookEntry.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  {routeNotebookEntry.completed ? '已完成' : '标记完成'}
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <h4 className="font-semibold text-stone-50">Stop checklist</h4>
                  <div className="mt-3 space-y-2">
                    {routeScenarios.map((scenario, index) => {
                      const item = routeStopItems[index]

                      return (
                        <label key={item} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-sm leading-6 text-stone-400 transition hover:border-teal-100/25">
                          <input
                            type="checkbox"
                            checked={routeNotebookEntry.checkedEvidence.includes(item)}
                            onChange={() => toggleRouteNotebookItem(item)}
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-teal-300 focus:ring-teal-200"
                          />
                          <span>{index + 1}. {scenario.title} · {scenario.year}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <h4 className="font-semibold text-stone-50">Evidence prompt checklist</h4>
                  <div className="mt-3 space-y-2">
                    {selectedRoute.evidencePrompts.map((prompt, index) => {
                      const item = routeEvidenceItems[index]

                      return (
                        <label key={item} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-sm leading-6 text-stone-400 transition hover:border-amber-100/25">
                          <input
                            type="checkbox"
                            checked={routeNotebookEntry.checkedEvidence.includes(item)}
                            onChange={() => toggleRouteNotebookItem(item)}
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200"
                          />
                          <span>{prompt}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>

              <label className="mt-4 block">
                <span className="font-semibold text-stone-50">Route notes / 路线笔记</span>
                <textarea
                  value={routeNotebookEntry.notes}
                  onChange={(event) => updateRouteNotebookEntry(selectedRoute.id, { ...routeNotebookEntry, notes: event.target.value })}
                  rows={6}
                  placeholder={`路线问题：${selectedRoute.routeQuestion}\n证据判断：\n仍不确定的问题：`}
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-teal-200/60"
                />
              </label>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-stone-500" aria-live="polite">
                  状态：{getStatusLabel(routeNotebookStatus)} · {routeNotebookEntry.updatedAt ? `已保存：${new Date(routeNotebookEntry.updatedAt).toLocaleString()}` : '尚未保存编辑。'}
                </p>
                <button
                  type="button"
                  onClick={() => void copyRouteNotebook(selectedRoute, routeNotebookEntry)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 font-semibold text-stone-100 transition hover:bg-white/[0.08]"
                >
                  {copyStatus === `${selectedRoute.id}:notebook` ? <Check size={18} /> : <Copy size={18} />}
                  {copyStatus === `${selectedRoute.id}:notebook` ? 'Route notebook 已复制' : copyStatus === 'failed' ? '复制失败' : '复制 / 导出 route notebook'}
                </button>
              </div>
            </article>

            {highlightedScenario ? (
              <article className="rounded-[1.5rem] border border-amber-200/15 bg-amber-100/[0.045] p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                  <span>{highlightedScenario.year}</span>
                  <span>{highlightedScenario.region}</span>
                  <span>{highlightedScenario.theme}</span>
                </div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-stone-50">场景预览：{highlightedScenario.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-400">{highlightedScenario.summary}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-400">
                    <span className="font-semibold text-amber-100">身份：</span>{highlightedScenario.identity} / {highlightedScenario.role}
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-400">
                    <span className="font-semibold text-amber-100">Scene hook：</span>{highlightedScenario.sceneBeats[0]?.learnerPrompt ?? highlightedScenario.atmosphere}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenScenario(highlightedScenario.id, sectionIds.sceneReader)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/[0.08] px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-100/[0.14]"
                  >
                    打开 Scene Reader
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenScenario(highlightedScenario.id, sectionIds.sourceReader)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
                  >
                    打开 Source Reader
                    <ScrollText size={16} />
                  </button>
                </div>
              </article>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {atlasMapRoutes.map((route) => {
            const isSelected = route.id === selectedRoute.id
            const routeStops = route.scenarioIds.map((id) => getScenarioById(id)).filter((scenario): scenario is Scenario => Boolean(scenario))

            return (
              <button
                key={route.id}
                type="button"
                onClick={() => setSelectedRouteId(route.id)}
                className={`rounded-3xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-emerald-200/45 bg-emerald-100/[0.09]'
                    : 'border-white/10 bg-black/20 hover:border-emerald-100/25 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                  <span>{getCompareLensByKey(route.lensKey).shortLabel} · {routeStops.length} stops</span>
                  {(() => {
                    const entry = workspaceState.routeNotebooks[route.id] ?? getEmptyWorkspaceEntry()
                    const status = getRouteNotebookStatus(route, entry)

                    return (
                      <span className={`rounded-full border px-2 py-0.5 ${
                        status === 'completed'
                          ? 'border-teal-200/20 bg-teal-100/[0.08] text-teal-100'
                          : status === 'draft'
                            ? 'border-amber-200/20 bg-amber-100/[0.08] text-amber-100'
                            : 'border-white/10 bg-white/[0.035] text-stone-500'
                      }`}>
                        {getStatusLabel(status)}
                      </span>
                    )
                  })()}
                </div>
                <h3 className="mt-2 font-semibold text-stone-50">{route.title}</h3>
                <p className="mt-2 text-xs leading-5 text-stone-500">{route.subtitle}</p>
                <div className="mt-3 flex -space-x-1">
                  {routeStops.map((scenario) => (
                    <span key={`${route.id}-${scenario.id}`} className="h-4 w-4 rounded-full border border-stone-950" style={{ backgroundColor: scenario.accent }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        <p className="mt-3 text-sm text-stone-500" aria-live="polite">
          {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : '地图点会打开对应 scenario section；路线作业单包含地图焦点、时间顺序、交付物和 Compare Lab 设置。'}
        </p>
      </div>
    </section>
  )
}

function formatAtlasMapRouteAssignment(route: AtlasMapRoute, entry = getEmptyWorkspaceEntry()) {
  const lens = getCompareLensByKey(route.lensKey)
  const routeScenarios = route.scenarioIds
    .map((id) => getScenarioById(id))
    .filter((scenario): scenario is Scenario => Boolean(scenario))
  const stopItems = routeScenarios.map((scenario) => `stop:${scenario.id}`)
  const evidenceItems = route.evidencePrompts.map((prompt) => `evidence:${prompt}`)

  return [
    `TimeAtlas Route Explorer：${route.title}`,
    route.subtitle,
    '',
    `比较镜头：${lens.title} / ${lens.shortLabel}`,
    `Route question：${route.routeQuestion}`,
    `Map focus：${route.mapFocus}`,
    `Classroom use：${route.classroomUse}`,
    '',
    '路线时间顺序：',
    ...routeScenarios.map((scenario, index) => `${index + 1}. ${scenario.year}｜${scenario.title}｜${scenario.location}｜${scenario.region}｜${scenario.identity}`),
    '',
    '路线任务：',
    route.assignmentPrompt,
    '',
    '交付物：',
    ...route.deliverables.map((deliverable) => `- ${deliverable}`),
    '',
    'Route Inquiry Notebook：',
    `- 状态：${getStatusLabel(getRouteNotebookStatus(route, entry))}`,
    `- 更新时间：${entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : '未记录时间'}`,
    '- Stop checklist：',
    ...routeScenarios.map((scenario, index) => `  - [${entry.checkedEvidence.includes(stopItems[index]) ? 'x' : ' '}] ${index + 1}. ${scenario.title}（${scenario.year}，${scenario.location}）`),
    '- Evidence prompt checklist：',
    ...route.evidencePrompts.map((prompt, index) => `  - [${entry.checkedEvidence.includes(evidenceItems[index]) ? 'x' : ' '}] ${prompt}`),
    '- Route notes：',
    entry.notes.trim() || '  尚未填写',
    '',
    '建议证据起点：',
    ...routeScenarios.flatMap((scenario) => [
      `- ${scenario.title}：${scenario.summary}`,
      `  - Scene Reader：${scenario.sceneBeats[0]?.evidenceHook ?? scenario.atmosphere}`,
      `  - Source Reader：${scenario.sources[0]?.title ?? scenario.sourceEvidenceUse}`,
    ]),
    '',
    'Compare Lab 快速设置：',
    `- compareA：${routeScenarios[0]?.title ?? '请选择第一站'}`,
    `- compareB：${routeScenarios.find((scenario) => scenario.id !== routeScenarios[0]?.id)?.title ?? '请选择第二站'}`,
    `- lens：${lens.title}`,
    '',
    '标签：',
    ...route.tags.map((tag) => `- ${tag}`),
  ].join('\n')
}

function buildSourceAtlasEntries(): SourceAtlasEntry[] {
  return scenarios.flatMap((scenario) =>
    scenario.sources.map((source, sourceIndex) => {
      const searchText = [
        source.title,
        source.creator,
        source.relevance,
        source.excerpt,
        source.reliabilityNote,
        source.perspective,
        source.sourceQuestion,
        sourceTypeLabels[source.sourceType],
        scenario.title,
        scenario.era,
        scenario.location,
        scenario.region,
        scenario.theme,
        scenario.identity,
        ...source.evidenceTags,
      ].join(' ').toLowerCase()

      return {
        id: `${scenario.id}:source:${sourceIndex}`,
        scenario,
        source,
        searchText,
      } satisfies SourceAtlasEntry
    }),
  )
}

function formatSourceJudgmentWorksheet(entries: SourceAtlasEntry[]) {
  return [
    'TimeAtlas Archive & Evidence Atlas / 全站史料证据地图 1.0',
    `生成时间：${new Date().toLocaleString()}`,
    `所选来源数：${entries.length}`,
    '',
    '一、来源清单',
    ...entries.flatMap((entry, index) => [
      `${index + 1}. ${entry.scenario.title}｜${entry.source.title}`,
      `   类型：${sourceTypeLabels[entry.source.sourceType]} / ${entry.source.creator}`,
      `   摘记：${entry.source.excerpt}`,
      `   视角：${entry.source.perspective}`,
      `   可靠边界：${entry.source.reliabilityNote}`,
      `   史料追问：${entry.source.sourceQuestion}`,
      `   标签：${entry.source.evidenceTags.join('、')}`,
      `   URL：${entry.source.url ?? '未提供'}`,
    ]),
    '',
    '二、史料判断',
    '1. 哪一条来源最接近当时人的声音？为什么？',
    '2. 哪一条来源更像后来的解释或机构整理？它的优势和限制是什么？',
    '3. 这些来源共同能支持哪一个历史判断？请区分事实线索与推论。',
    '4. 这些来源共同看不见谁？还需要补充哪类材料？',
    '',
    '三、比较结论模板',
    '我的判断：',
    '最可靠的证据：',
    '最需要谨慎的证据：',
    '仍然缺失的声音 / 材料：',
  ].join('\n')
}

function SourceAtlasPanel({
  corroborationDraftState,
  onUpdateCorroborationDraftState,
  onOpenScenario,
  onLoadCompareLens,
}: {
  corroborationDraftState: CorroborationDraftState
  onUpdateCorroborationDraftState: Dispatch<SetStateAction<CorroborationDraftState>>
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
  onLoadCompareLens: (lens: CompareLens) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceTypeFilter, setSourceTypeFilter] = useState<'all' | Scenario['sources'][number]['sourceType']>('all')
  const [scenarioFilter, setScenarioFilter] = useState('all')
  const [evidenceTagFilter, setEvidenceTagFilter] = useState('all')
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([])
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const sourceAtlasEntries = useMemo(buildSourceAtlasEntries, [])
  const sourceTypeCounts = useMemo(
    () =>
      sourceAtlasEntries.reduce((counts, entry) => {
        counts[entry.source.sourceType] = (counts[entry.source.sourceType] ?? 0) + 1
        return counts
      }, {} as Record<Scenario['sources'][number]['sourceType'], number>),
    [sourceAtlasEntries],
  )
  const evidenceTagCounts = useMemo(() => {
    const counts = new Map<string, number>()

    sourceAtlasEntries.forEach((entry) => {
      entry.source.evidenceTags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      })
    })

    return [...counts.entries()].sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0], 'zh-Hans-CN'))
  }, [sourceAtlasEntries])
  const evidenceTagOptions = evidenceTagCounts.map(([tag]) => tag)
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const visibleEntries = useMemo(
    () => sourceAtlasEntries.filter((entry) => {
      const matchesSearch = !normalizedSearchQuery || entry.searchText.includes(normalizedSearchQuery)
      const matchesType = sourceTypeFilter === 'all' || entry.source.sourceType === sourceTypeFilter
      const matchesScenario = scenarioFilter === 'all' || entry.scenario.id === scenarioFilter
      const matchesTag = evidenceTagFilter === 'all' || entry.source.evidenceTags.includes(evidenceTagFilter)

      return matchesSearch && matchesType && matchesScenario && matchesTag
    }),
    [evidenceTagFilter, normalizedSearchQuery, scenarioFilter, sourceAtlasEntries, sourceTypeFilter],
  )
  const selectedEntries = selectedSourceIds
    .map((id) => sourceAtlasEntries.find((entry) => entry.id === id))
    .filter((entry): entry is SourceAtlasEntry => Boolean(entry))
  const currentBasketKey = getCorroborationBasketKey(selectedSourceIds)
  const currentCorroborationDraft = currentBasketKey
    ? corroborationDraftState[currentBasketKey] ?? getEmptyCorroborationDraft(selectedSourceIds)
    : getEmptyCorroborationDraft()
  const sourceCredibilityLens = compareLenses.find((lens) => lens.key === 'source-credibility')
  const archiveGapCards = [
    {
      title: '缺席声音扫描',
      prompt: '筛选“原始材料”，寻找哪些场景仍主要依赖机构档案或研究著作；写下最需要补充的当事人声音。',
      metric: `${sourceTypeCounts.primary ?? 0} 条原始材料`,
    },
    {
      title: '机构档案偏向',
      prompt: '比较机构材料和研究著作：哪些问题会被制度记录放大，哪些日常经验可能被压低？',
      metric: `${sourceTypeCounts.institution ?? 0} 条机构档案`,
    },
    {
      title: '标签空白追问',
      prompt: `高频标签之外，选择一个低频证据标签，说明它为什么会改变对某个场景的判断。`,
      metric: `${evidenceTagOptions.length} 个证据标签`,
    },
  ]

  function toggleBasket(entryId: string) {
    setCopyStatus('idle')
    setSelectedSourceIds((currentIds) => {
      if (currentIds.includes(entryId)) {
        return currentIds.filter((id) => id !== entryId)
      }

      if (currentIds.length >= 4) {
        return currentIds
      }

      return [...currentIds, entryId]
    })
  }

  function updateCurrentCorroborationDraft(updates: Partial<Omit<CorroborationDraft, 'sourceIds' | 'updatedAt'>>) {
    if (selectedEntries.length < 2 || selectedEntries.length > 4 || !currentBasketKey) {
      return
    }

    const sortedSourceIds = selectedEntries.map((entry) => entry.id).sort()

    onUpdateCorroborationDraftState((currentState) => ({
      ...currentState,
      [currentBasketKey]: {
        ...(currentState[currentBasketKey] ?? getEmptyCorroborationDraft(sortedSourceIds)),
        sourceIds: sortedSourceIds,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  function clearCurrentCorroborationDraft() {
    if (!currentBasketKey) {
      return
    }

    onUpdateCorroborationDraftState((currentState) => {
      const nextState = { ...currentState }
      delete nextState[currentBasketKey]
      return nextState
    })
    setCopyStatus('idle')
  }

  async function copyCorroborationBrief() {
    if (selectedEntries.length < 2 || selectedEntries.length > 4) {
      setCopyStatus('failed')
      return
    }

    try {
      await copyTextToClipboard(formatSourceCorroborationBrief(selectedEntries, currentCorroborationDraft))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  async function copyWorksheet() {
    if (selectedEntries.length < 2 || selectedEntries.length > 4) {
      setCopyStatus('failed')
      return
    }

    try {
      await copyTextToClipboard(formatSourceJudgmentWorksheet(selectedEntries))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="source-atlas" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="source-atlas-title">
      <div className="rounded-[2rem] border border-amber-200/15 bg-amber-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-amber-100">
          <LibraryBig size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">archive & evidence atlas 1.0</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="source-atlas-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Archive & Evidence Atlas / 全站史料证据地图 1.0
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              不改变 scenario 结构，直接汇总现有 scenarios[].sources：搜索标题、作者/机构、场景、标签、摘记、可靠边界、视角和史料追问，快速组成 2-4 条来源的史料判断练习。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {visibleEntries.length}/{sourceAtlasEntries.length} 条来源 · {evidenceTagOptions.length} 个证据标签
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.35fr_0.75fr_0.9fr_0.9fr]">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">全站来源搜索</span>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-3 transition focus-within:border-amber-200/60">
              <Search size={18} className="text-stone-500" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="标题、creator、场景、tags、excerpt、reliability、perspective、question……"
                className="min-w-0 flex-1 bg-transparent text-stone-100 outline-none placeholder:text-stone-600"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">来源类型</span>
            <select
              value={sourceTypeFilter}
              onChange={(event) => setSourceTypeFilter(event.target.value as 'all' | Scenario['sources'][number]['sourceType'])}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
            >
              <option value="all">全部类型</option>
              <option value="primary">原始材料</option>
              <option value="institution">机构档案</option>
              <option value="scholarship">研究著作</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">场景</span>
            <select
              value={scenarioFilter}
              onChange={(event) => setScenarioFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
            >
              <option value="all">全部场景</option>
              {scenarios.map((scenario) => <option key={scenario.id} value={scenario.id}>{scenario.title}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">证据标签</span>
            <select
              value={evidenceTagFilter}
              onChange={(event) => setEvidenceTagFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
            >
              <option value="all">全部标签</option>
              {evidenceTagOptions.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
          <aside className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">来源类型快照</h3>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(Object.entries(sourceTypeLabels) as [Scenario['sources'][number]['sourceType'], string][]).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSourceTypeFilter(type)}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-left transition hover:border-amber-100/25 hover:bg-white/[0.06]"
                  >
                    <div className="text-2xl font-semibold text-amber-100">{sourceTypeCounts[type] ?? 0}</div>
                    <div className="mt-1 text-xs text-stone-500">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">高频证据标签</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {evidenceTagCounts.slice(0, 14).map(([tag, count]) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setEvidenceTagFilter(tag)}
                    className="rounded-full border border-amber-200/20 bg-amber-100/[0.06] px-3 py-1 text-xs text-amber-100 transition hover:bg-amber-100/[0.12]"
                  >
                    {tag} · {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-orange-200/15 bg-orange-100/[0.045] p-4">
              <h3 className="font-semibold text-orange-100">Archive gap prompts</h3>
              <div className="mt-3 space-y-3">
                {archiveGapCards.map((card) => (
                  <article key={card.title} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-stone-500">{card.metric}</div>
                    <h4 className="mt-1 font-semibold text-stone-50">{card.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{card.prompt}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-teal-200/15 bg-teal-100/[0.045] p-4">
              <div className="flex items-center gap-2 text-teal-100">
                <ClipboardList size={18} />
                <h3 className="font-semibold">Evidence Basket</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-400">选择 2-4 条来源后复制“史料判断”工作纸，并在右侧打开史料互证工作台。</p>
              <div className="mt-3 space-y-2">
                {selectedEntries.length > 0 ? selectedEntries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => toggleBasket(entry.id)}
                    className="block w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-left text-sm transition hover:border-teal-100/25"
                  >
                    <span className="block font-medium text-stone-100">{entry.source.title}</span>
                    <span className="mt-1 block text-xs text-stone-500">{entry.scenario.title} · 点击移除</span>
                  </button>
                )) : <p className="rounded-2xl border border-dashed border-white/10 p-3 text-sm text-stone-500">还没有选择来源。</p>}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => void copyWorksheet()}
                  disabled={selectedEntries.length < 2 || selectedEntries.length > 4}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400"
                >
                  {copyStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}
                  {copyStatus === 'copied' ? '工作纸已复制' : '复制史料判断工作纸'}
                </button>
                <button
                  type="button"
                  onClick={() => void copyCorroborationBrief()}
                  disabled={selectedEntries.length < 2 || selectedEntries.length > 4}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/[0.08] px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-100/[0.14] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.02] disabled:text-stone-600"
                >
                  {copyStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}
                  {copyStatus === 'copied' ? '互证简报已复制' : '复制互证简报'}
                </button>
                {sourceCredibilityLens ? (
                  <button
                    type="button"
                    onClick={() => onLoadCompareLens(sourceCredibilityLens)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
                  >
                    <Scale size={16} />
                    载入来源可信度比较镜头
                  </button>
                ) : null}
              </div>
              <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                {copyStatus === 'failed' ? '复制失败，请检查剪贴板权限；工作纸需要选择 2-4 条来源。' : `已选择 ${selectedEntries.length}/4 条来源。`}
              </p>
            </div>
          </aside>

          <div className="grid gap-4 lg:grid-cols-2">
            {visibleEntries.slice(0, 60).map((entry) => {
              const isSelected = selectedSourceIds.includes(entry.id)
              const basketFull = selectedSourceIds.length >= 4 && !isSelected

              return (
                <article key={entry.id} className="flex min-h-full flex-col rounded-[1.5rem] border border-white/10 bg-black/20 p-4 transition hover:border-amber-100/25 hover:bg-black/30">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                    <span className="rounded-full border border-amber-200/20 bg-amber-100/[0.06] px-3 py-1 text-amber-100">{entry.scenario.title}</span>
                    <span>{sourceTypeLabels[entry.source.sourceType]}</span>
                    <span>{entry.source.creator}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-stone-50">{entry.source.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-500">{entry.scenario.era} · {entry.scenario.location} · {entry.scenario.identity}</p>
                  <div className="mt-4 rounded-2xl border border-amber-200/15 bg-amber-100/[0.055] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-amber-100/70">excerpt / 转述摘记</div>
                    <p className="mt-2 text-sm leading-6 text-stone-300">{entry.source.excerpt}</p>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm leading-6 text-stone-400">
                    <div>
                      <dt className="font-semibold text-teal-100">Perspective / 视角</dt>
                      <dd>{entry.source.perspective}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-teal-100">Reliability / 可靠边界</dt>
                      <dd>{entry.source.reliabilityNote}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-teal-100">Source question / 史料追问</dt>
                      <dd>{entry.source.sourceQuestion}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.source.evidenceTags.map((tag) => (
                      <button
                        key={`${entry.id}-${tag}`}
                        type="button"
                        onClick={() => setEvidenceTagFilter(tag)}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400 transition hover:border-amber-100/25 hover:text-amber-100"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {entry.source.url ? (
                    <a href={entry.source.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-medium text-amber-100 underline-offset-4 hover:underline">
                      {entry.source.url}
                    </a>
                  ) : null}
                  <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => onOpenScenario(entry.scenario.id, sectionIds.sourceReader)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
                    >
                      <ScrollText size={16} />
                      打开该场景 Source Reader
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleBasket(entry.id)}
                      disabled={basketFull}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/[0.08] px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-100/[0.14] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.02] disabled:text-stone-600"
                    >
                      {isSelected ? <Check size={16} /> : <Circle size={16} />}
                      {isSelected ? '从 Basket 移除' : basketFull ? 'Basket 已满' : '加入 Evidence Basket'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="mt-5 rounded-[1.75rem] border border-teal-200/15 bg-black/20 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-teal-100">
                <ShieldAlert size={18} />
                <span className="text-xs uppercase tracking-[0.24em]">corroboration studio / 史料互证工作台 1.0</span>
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-50">从证据篮到临时历史判断</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-400">
                选择 2-4 条来源后，用来源判断、情境化、互证和沉默四步记录可支持的判断、张力与还需要补足的材料。同一组来源会按排序后的 basket key 自动恢复草稿。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-stone-400">
              {selectedEntries.length >= 2 && selectedEntries.length <= 4
                ? `当前组合：${currentBasketKey}`
                : '需要 2-4 条来源才能生成互证简报'}
            </div>
          </div>

          {selectedEntries.length >= 2 && selectedEntries.length <= 4 ? (
            <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-3xl border border-white/10">
                  <div className="grid grid-cols-[0.85fr_1.1fr_1fr] bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-stone-500">
                    <div className="p-3">来源 / Source</div>
                    <div className="border-l border-white/10 p-3">视角与可靠边界</div>
                    <div className="border-l border-white/10 p-3">可互证线索</div>
                  </div>
                  {selectedEntries.map((entry) => (
                    <div key={`matrix-${entry.id}`} className="grid grid-cols-[0.85fr_1.1fr_1fr] border-t border-white/10 text-sm leading-6 text-stone-400">
                      <div className="p-3">
                        <div className="font-semibold text-stone-100">{entry.source.title}</div>
                        <div className="mt-1 text-xs text-stone-500">{entry.scenario.title} · {sourceTypeLabels[entry.source.sourceType]}</div>
                      </div>
                      <div className="border-l border-white/10 p-3">
                        <div><span className="text-teal-100">Perspective：</span>{entry.source.perspective}</div>
                        <div className="mt-1"><span className="text-amber-100">Reliability：</span>{entry.source.reliabilityNote}</div>
                      </div>
                      <div className="border-l border-white/10 p-3">
                        <div>{entry.source.excerpt}</div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {entry.source.evidenceTags.slice(0, 4).map((tag) => (
                            <span key={`${entry.id}-matrix-${tag}`} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-stone-500">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {corroborationMethodCards.map((card) => (
                    <article key={card.key} className="rounded-3xl border border-amber-200/15 bg-amber-100/[0.045] p-4">
                      <h4 className="font-semibold text-amber-100">{card.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-stone-400">{card.prompt}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-stone-50">互证草稿</h4>
                    <p className="mt-1 text-xs text-stone-500">
                      {currentCorroborationDraft.updatedAt
                        ? `已恢复：${new Date(currentCorroborationDraft.updatedAt).toLocaleString()}`
                        : '尚未保存此来源组合的草稿'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearCurrentCorroborationDraft}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-orange-200/30 hover:text-orange-100"
                  >
                    清空当前草稿
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">provisional claim / 临时历史判断</span>
                    <textarea
                      value={currentCorroborationDraft.provisionalClaim}
                      onChange={(event) => updateCurrentCorroborationDraft({ provisionalClaim: event.target.value })}
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-teal-200/50"
                      placeholder="这些来源共同支持的、仍可修正的一句话判断……"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">supporting evidence / 支持证据</span>
                    <textarea
                      value={currentCorroborationDraft.supportingEvidence}
                      onChange={(event) => updateCurrentCorroborationDraft({ supportingEvidence: event.target.value })}
                      rows={4}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-teal-200/50"
                      placeholder="列出互相支持的线索，并注明来自哪几条来源……"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">tensions / conflicts / 张力与冲突</span>
                    <textarea
                      value={currentCorroborationDraft.tensions}
                      onChange={(event) => updateCurrentCorroborationDraft({ tensions: event.target.value })}
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-teal-200/50"
                      placeholder="哪些来源之间存在解释差异、记录偏向或时间/身份张力？"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">absent voices / needed sources / 缺席声音与仍需来源</span>
                    <textarea
                      value={currentCorroborationDraft.absentVoices}
                      onChange={(event) => updateCurrentCorroborationDraft({ absentVoices: event.target.value })}
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-teal-200/50"
                      placeholder="哪些人没有留下声音？还需要口述、账簿、考古、法律、报刊或其他材料？"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">confidence / 信心等级</span>
                    <select
                      value={currentCorroborationDraft.confidence}
                      onChange={(event) => updateCurrentCorroborationDraft({ confidence: event.target.value as CorroborationConfidence })}
                      className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-teal-200/50"
                    >
                      {(Object.entries(corroborationConfidenceLabels) as [CorroborationConfidence, string][]).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void copyCorroborationBrief()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
                  >
                    {copyStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}
                    {copyStatus === 'copied' ? '互证简报已复制' : '复制互证简报'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void copyWorksheet()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
                  >
                    <ClipboardList size={16} />
                    复制判断工作纸
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-3xl border border-dashed border-white/10 p-4 text-sm leading-6 text-stone-500">
              Evidence Basket 当前为 {selectedEntries.length}/4。互证工作台和简报生成需要至少 2 条、最多 4 条来源。
            </p>
          )}
        </div>

        {visibleEntries.length > 60 ? (
          <p className="mt-4 text-sm text-stone-500">已显示前 60 条来源；可使用搜索、类型、场景或标签筛选继续缩小范围。</p>
        ) : null}
        {visibleEntries.length === 0 ? (
          <p className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-400">没有匹配的来源。请放宽关键词、来源类型、场景或证据标签筛选。</p>
        ) : null}
      </div>
    </section>
  )
}


function EvidenceCaseFilesPanel({
  selectedCaseFileId,
  draftState,
  onSelectCaseFile,
  onUpdateDraftState,
  onOpenSourceAtlas,
  onOpenScenario,
}: {
  selectedCaseFileId: string
  draftState: EvidenceCaseFileDraftState
  onSelectCaseFile: (id: string) => void
  onUpdateDraftState: Dispatch<SetStateAction<EvidenceCaseFileDraftState>>
  onOpenSourceAtlas: () => void
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const selectedCaseFile = evidenceCaseFiles.find((caseFile) => caseFile.id === selectedCaseFileId) ?? evidenceCaseFiles[0]
  const currentDraft = draftState[selectedCaseFile.id] ?? getEmptyEvidenceCaseFileDraft()
  const packet = useMemo(() => buildEvidenceCasePacket(selectedCaseFile), [selectedCaseFile])
  const packetSections = [
    { key: 'sources', title: 'Sources', items: packet.sources },
    { key: 'sceneBeats', title: 'Scene beats', items: packet.sceneBeats },
    { key: 'decisions', title: 'Decisions', items: packet.decisions },
    { key: 'timelines', title: 'Timeline', items: packet.timelines },
  ]
  const progress = getEvidenceCaseFileProgress(selectedCaseFile, currentDraft)

  function updateDraft(updates: Partial<Omit<EvidenceCaseFileDraft, 'updatedAt'>>) {
    onUpdateDraftState((currentState) => ({
      ...currentState,
      [selectedCaseFile.id]: {
        ...(currentState[selectedCaseFile.id] ?? getEmptyEvidenceCaseFileDraft()),
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
    setCopyStatus('idle')
  }

  function toggleTask(taskId: string) {
    const completedTaskIds = currentDraft.completedTaskIds.includes(taskId)
      ? currentDraft.completedTaskIds.filter((id) => id !== taskId)
      : [...currentDraft.completedTaskIds, taskId]

    updateDraft({ completedTaskIds })
  }

  async function copyBrief() {
    try {
      await copyTextToClipboard(formatEvidenceCaseFileBrief(selectedCaseFile, currentDraft, packet))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  function downloadBrief() {
    const safeTitle = selectedCaseFile.title.toLowerCase().replace(/[^a-z0-9一-龥]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'case-file'
    downloadTextFile(`timeatlas-${safeTitle}-brief.txt`, formatEvidenceCaseFileBrief(selectedCaseFile, currentDraft, packet))
  }

  return (
    <section id={sectionIds.evidenceCaseFiles} className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="evidence-case-files-title">
      <div className="rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-teal-100">
          <ClipboardList size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">evidence case files / archive quests 1.0</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="evidence-case-files-title" className="text-3xl font-semibold tracking-tight text-stone-50">Evidence Case Files / 来源任务档案</h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              6 个轻量 archive quests 直接复用现有 sources、scene beats、decisions 与 timelines 派生证据包；Evidence 页可作为来源任务中心，不新增 schema 或顶层页面。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {getActiveEvidenceCaseFileDrafts(draftState).length} active drafts · {evidenceCaseFiles.length} case files
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
          <aside className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
            {evidenceCaseFiles.map((caseFile) => {
              const draft = draftState[caseFile.id] ?? getEmptyEvidenceCaseFileDraft()
              const caseProgress = getEvidenceCaseFileProgress(caseFile, draft)
              const caseScenarios = caseFile.scenarioIds.map((id) => getScenarioById(id)?.title ?? id)
              const isActive = caseFile.id === selectedCaseFile.id

              return (
                <button
                  key={caseFile.id}
                  type="button"
                  onClick={() => onSelectCaseFile(caseFile.id)}
                  className={`rounded-[1.5rem] border p-4 text-left transition ${isActive ? 'border-amber-200/45 bg-amber-100/[0.08]' : 'border-white/10 bg-black/20 hover:border-teal-100/25 hover:bg-black/30'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-stone-500">{caseFile.subtitle}</div>
                      <h3 className="mt-1 font-semibold text-stone-50">{caseFile.title}</h3>
                    </div>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-amber-100">{caseProgress}%</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-400">{caseFile.drivingQuestion}</p>
                  <p className="mt-2 line-clamp-1 text-xs text-stone-500">{caseScenarios.join(' × ')}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {caseFile.skills.map((skill) => <span key={`${caseFile.id}-${skill}`} className="rounded-full border border-teal-200/20 bg-teal-100/[0.06] px-2 py-0.5 text-xs text-teal-100">{skill}</span>)}
                  </div>
                </button>
              )
            })}
          </aside>

          <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-stone-500">selected case workspace</div>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-stone-50">{selectedCaseFile.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-400">{selectedCaseFile.drivingQuestion}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={onOpenSourceAtlas} className="inline-flex items-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"><LibraryBig size={16} />Source Atlas</button>
                <button type="button" onClick={() => onOpenScenario(selectedCaseFile.scenarioIds[0], sectionIds.sceneReader)} className="inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/[0.08] px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-100/[0.14]"><ArrowRight size={16} />打开场景</button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.92fr]">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {selectedCaseFile.skills.map((skill, index) => (
                    <article key={`${selectedCaseFile.id}-skill-${skill}`} className="rounded-2xl border border-teal-200/15 bg-teal-100/[0.045] p-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-stone-500">step {index + 1}</div>
                      <h4 className="mt-1 font-semibold text-teal-100">{skill}</h4>
                      <p className="mt-1 text-xs leading-5 text-stone-500">先定位来源，再放回情境，最后处理互证、张力或沉默。</p>
                    </article>
                  ))}
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-stone-50">Evidence packet</h4>
                    <span className="text-xs text-stone-500">{[...packet.sources, ...packet.sceneBeats, ...packet.decisions, ...packet.timelines].length} items</span>
                  </div>
                  <div className="mt-3 grid max-h-[34rem] gap-3 overflow-y-auto pr-1 lg:grid-cols-2">
                    {packetSections.flatMap((section) => section.items.slice(0, 5).map((item) => (
                      <article key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                          <span className="text-amber-100">{section.title}</span>
                          <span>{item.scenario.title}</span>
                        </div>
                        <h5 className="mt-2 font-semibold text-stone-100">{item.title}</h5>
                        <p className="mt-2 text-sm leading-6 text-stone-400">{item.text}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.tags.slice(0, 5).map((tag) => <span key={`${item.id}-${tag}`} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-stone-500">{tag}</span>)}
                        </div>
                      </article>
                    )))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-amber-200/15 bg-amber-100/[0.045] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-amber-100">Task checklist</h4>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400">{progress}% complete</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {selectedCaseFile.taskChecklist.map((task, index) => {
                      const taskId = `task:${index}`
                      const checked = currentDraft.completedTaskIds.includes(taskId)
                      return (
                        <button key={taskId} type="button" onClick={() => toggleTask(taskId)} className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-left text-sm leading-6 text-stone-300 transition hover:border-amber-100/25">
                          {checked ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-amber-100" /> : <Circle size={18} className="mt-0.5 shrink-0 text-stone-500" />}
                          <span>{task}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <h4 className="font-semibold text-stone-50">Draft fields</h4>
                  <div className="mt-3 grid gap-3">
                    {([
                      ['sourceNotes', 'source notes / 来源笔记', '哪些来源最关键？它们由谁留下？'],
                      ['contextNotes', 'context notes / 情境笔记', '把证据放回地点、制度、时间和日常压力。'],
                      ['corroborationNotes', 'corroboration notes / 互证笔记', '哪些线索相互支持或修正？'],
                      ['tensions', 'tensions / 张力', '来源之间或解释之间的冲突。'],
                      ['missingVoices', 'missing voices / 缺席声音', '谁没有被记录？还需要什么材料？'],
                      ['workingClaim', 'working claim / 工作主张', selectedCaseFile.suggestedClaimFrame],
                    ] as [keyof Omit<EvidenceCaseFileDraft, 'confidence' | 'completedTaskIds' | 'updatedAt'>, string, string][]).map(([field, label, placeholder]) => (
                      <label key={field} className="block">
                        <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-stone-500">{label}</span>
                        <textarea value={currentDraft[field]} onChange={(event) => updateDraft({ [field]: event.target.value } as Partial<EvidenceCaseFileDraft>)} rows={field === 'workingClaim' ? 3 : 2} placeholder={placeholder} className="w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-teal-200/50" />
                      </label>
                    ))}
                    <label className="block">
                      <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-stone-500">confidence / 信心等级</span>
                      <select value={currentDraft.confidence} onChange={(event) => updateDraft({ confidence: event.target.value as SynthesisConfidence })} className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-teal-200/50">
                        {(Object.entries(evidenceCaseConfidenceLabels) as [SynthesisConfidence, string][]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => void copyBrief()} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200">{copyStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}{copyStatus === 'copied' ? 'Brief 已复制' : '复制 brief'}</button>
                    <button type="button" onClick={downloadBrief} className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"><ScrollText size={16} />下载 .txt</button>
                  </div>
                  <p className="mt-3 text-xs text-stone-500" aria-live="polite">{copyStatus === 'failed' ? '复制失败，请检查剪贴板权限。' : currentDraft.updatedAt ? `已保存：${new Date(currentDraft.updatedAt).toLocaleString()}` : '任意填写或勾选后会保存到本机。'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CausationLabPanel({
  selectedInquiryId,
  evidenceByInquiry,
  draftState,
  onSelectInquiry,
  onUpdateDraftState,
  onOpenScenario,
}: {
  selectedInquiryId: string
  evidenceByInquiry: Record<string, CausationEvidence[]>
  draftState: CausationDraftState
  onSelectInquiry: (id: string) => void
  onUpdateDraftState: Dispatch<SetStateAction<CausationDraftState>>
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const selectedInquiry = causationInquiryDefinitions.find((inquiry) => inquiry.id === selectedInquiryId) ?? causationInquiryDefinitions[0]
  const evidence = evidenceByInquiry[selectedInquiry.id] ?? []
  const currentDraft = draftState[selectedInquiry.id] ?? getEmptyCausationDraft()
  const selectedEvidence = currentDraft.selectedEvidenceIds
    .map((id) => evidence.find((entry) => entry.id === id))
    .filter((entry): entry is CausationEvidence => Boolean(entry))
  const scenarioStops = selectedInquiry.scenarioIds
    .map((id) => getScenarioById(id))
    .filter((scenario): scenario is Scenario => Boolean(scenario))

  function updateDraft(updates: Partial<Omit<CausationDraft, 'updatedAt'>>) {
    onUpdateDraftState((currentState) => ({
      ...currentState,
      [selectedInquiry.id]: {
        ...(currentState[selectedInquiry.id] ?? getEmptyCausationDraft()),
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  function toggleEvidence(evidenceId: string) {
    const nextSelectedEvidenceIds = currentDraft.selectedEvidenceIds.includes(evidenceId)
      ? currentDraft.selectedEvidenceIds.filter((id) => id !== evidenceId)
      : [...currentDraft.selectedEvidenceIds, evidenceId]

    setCopyStatus('idle')
    updateDraft({ selectedEvidenceIds: nextSelectedEvidenceIds })
  }

  function clearDraft() {
    onUpdateDraftState((currentState) => {
      const nextState = { ...currentState }
      delete nextState[selectedInquiry.id]
      return nextState
    })
    setCopyStatus('idle')
  }

  async function copyCausationBrief() {
    try {
      await copyTextToClipboard(formatCausationBrief(selectedInquiry, evidence, currentDraft))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  if (!selectedInquiry) {
    return null
  }

  return (
    <section id={sectionIds.causationLab} className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="causation-lab-title">
      <div className="rounded-[2rem] border border-orange-200/15 bg-orange-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-orange-100">
          <Route size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">causation & change lab 1.0</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="causation-lab-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Causation & Change Lab / 因果与历史变化工作台 1.0
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              从现有 scenarios 派生 6 个因果探究，把时间线、历史选择、Scene Reader、来源和任务证据放入同一条 evidence rail，帮助区分背景条件、直接触发、约束、人的选择、短期后果与长期变化。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {getActiveCausationDrafts(draftState).length} 个因果草稿 · 当前已选 {selectedEvidence.length}/{evidence.length} 条证据
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
          <aside className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {causationInquiryDefinitions.map((inquiry) => {
                const isSelected = inquiry.id === selectedInquiry.id
                const inquiryDraft = draftState[inquiry.id]
                const status = inquiryDraft && hasCausationDraftActivity(inquiryDraft) ? 'draft' : 'not-started'

                return (
                  <button
                    key={inquiry.id}
                    type="button"
                    onClick={() => {
                      onSelectInquiry(inquiry.id)
                      setCopyStatus('idle')
                    }}
                    className={`rounded-3xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-orange-200/45 bg-orange-100/[0.09]'
                        : 'border-white/10 bg-black/20 hover:border-orange-100/25 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                      <span>{inquiry.subtitle}</span>
                      <span className={`rounded-full border px-2 py-0.5 ${status === 'draft' ? 'border-amber-200/20 bg-amber-100/[0.08] text-amber-100' : 'border-white/10 bg-white/[0.035] text-stone-500'}`}>
                        {getStatusLabel(status)}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-stone-50">{inquiry.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{inquiry.drivingQuestion}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {inquiry.suggestedCategories.slice(0, 3).map((category) => <Tag key={`${inquiry.id}-${category}`}>{causeCategoryLabels[category]}</Tag>)}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">场景路径</h3>
              <div className="mt-3 space-y-2">
                {scenarioStops.map((scenario, index) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => onOpenScenario(scenario.id, sectionIds.sceneReader)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-left text-sm transition hover:border-teal-100/25"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-stone-950" style={{ backgroundColor: scenario.accent }}>{index + 1}</span>
                    <span>
                      <span className="block font-medium text-stone-100">{scenario.title}</span>
                      <span className="block text-xs text-stone-500">{scenario.year} · {scenario.location}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <article className="rounded-[1.5rem] border border-orange-200/15 bg-black/20 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-orange-100/70">selected inquiry</div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-50">{selectedInquiry.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{selectedInquiry.focus}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void copyCausationBrief()}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
                >
                  {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                  {copyStatus === 'copied' ? '因果简报已复制' : copyStatus === 'failed' ? '复制失败' : '复制 / 导出因果简报'}
                </button>
              </div>
              <p className="mt-3 rounded-2xl border border-orange-200/15 bg-orange-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                {selectedInquiry.drivingQuestion}
              </p>
            </article>

            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4" aria-labelledby="causation-evidence-rail-title">
                <h3 id="causation-evidence-rail-title" className="font-semibold text-stone-50">Evidence rail / 证据轨</h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">勾选要纳入因果简报的证据；每条证据自动显示原因类别 chips。</p>
                <div className="mt-4 max-h-[760px] space-y-3 overflow-y-auto pr-1">
                  {evidence.map((entry) => {
                    const isSelected = currentDraft.selectedEvidenceIds.includes(entry.id)

                    return (
                      <article key={entry.id} className={`rounded-2xl border p-3 transition ${isSelected ? 'border-amber-200/35 bg-amber-100/[0.07]' : 'border-white/10 bg-white/[0.025]'}`}>
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleEvidence(entry.id)}
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                              <span className="rounded-full border border-teal-200/20 bg-teal-100/[0.06] px-2 py-0.5 text-teal-100">{entry.label}</span>
                              <span>{entry.scenario.title}</span>
                            </div>
                            <h4 className="mt-2 font-semibold text-stone-100">{entry.title}</h4>
                            <p className="mt-2 text-sm leading-6 text-stone-400">{entry.text}</p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {entry.categories.map((category) => (
                                <span key={`${entry.id}-${category}`} className="rounded-full border border-orange-200/20 bg-orange-100/[0.055] px-2.5 py-1 text-[0.68rem] text-orange-100">
                                  {causeCategoryLabels[category]}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4" aria-labelledby="causation-draft-title">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 id="causation-draft-title" className="font-semibold text-stone-50">Causation draft / 因果草稿</h3>
                    <p className="mt-1 text-xs text-stone-500">
                      {currentDraft.updatedAt ? `已保存：${new Date(currentDraft.updatedAt).toLocaleString()}` : '本机保存，受限时回退 sessionStorage。'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearDraft}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-orange-200/30 hover:text-orange-100"
                  >
                    清空
                  </button>
                </div>

                <div className="mt-4 grid gap-3">
                  {([
                    ['backgroundConditions', 'background conditions / 背景条件', '哪些长期结构、环境或制度先存在？'],
                    ['immediateTriggers', 'immediate triggers / 直接触发', '哪些事件或消息让变化开始加速？'],
                    ['constraints', 'constraints / 约束条件', '身份、制度、地理或来源边界怎样限制行动？'],
                    ['humanChoices', 'human choices / 人的选择', '普通人、商人、国家或机构做了哪些选择？'],
                    ['shortTermConsequences', 'short-term consequences / 短期后果', '这些选择立刻改变了什么？'],
                    ['longTermChange', 'long-term change / 长期变化', '这些原因如何汇入更大的历史变化？'],
                    ['contingency', 'contingency / 偶然性', '如果条件改变，结果可能怎样不同？'],
                    ['missingEvidence', 'missing evidence / 缺失证据', '还缺哪些声音、材料或互证？'],
                  ] as [keyof Omit<CausationDraft, 'confidence' | 'selectedEvidenceIds' | 'updatedAt'>, string, string][]).map(([field, label, placeholder]) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">{label}</span>
                      <textarea
                        value={currentDraft[field]}
                        onChange={(event) => updateDraft({ [field]: event.target.value })}
                        rows={field === 'longTermChange' || field === 'missingEvidence' ? 3 : 2}
                        placeholder={placeholder}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-orange-200/50"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">confidence / 信心等级</span>
                    <select
                      value={currentDraft.confidence}
                      onChange={(event) => updateDraft({ confidence: event.target.value as CausationConfidence })}
                      className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-orange-200/50"
                    >
                      {(Object.entries(causationConfidenceLabels) as [CausationConfidence, string][]).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                  {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : '因果简报会优先导出已勾选证据；若未勾选，则导出前 8 条证据起点。'}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function PeriodizationLabPanel({
  selectedInquiryId,
  evidenceByInquiry,
  draftState,
  onSelectInquiry,
  onUpdateDraftState,
  onOpenScenario,
}: {
  selectedInquiryId: string
  evidenceByInquiry: Record<string, PeriodizationEvidence[]>
  draftState: PeriodizationDraftState
  onSelectInquiry: (id: string) => void
  onUpdateDraftState: Dispatch<SetStateAction<PeriodizationDraftState>>
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const selectedInquiry = periodizationInquiryDefinitions.find((inquiry) => inquiry.id === selectedInquiryId) ?? periodizationInquiryDefinitions[0]

  if (!selectedInquiry) {
    return null
  }

  const evidence = evidenceByInquiry[selectedInquiry.id] ?? []
  const currentDraft = draftState[selectedInquiry.id] ?? getEmptyPeriodizationDraft()
  const selectedEvidence = currentDraft.selectedEvidenceIds
    .map((id) => evidence.find((entry) => entry.id === id))
    .filter((entry): entry is PeriodizationEvidence => Boolean(entry))
  const scenarioStops = selectedInquiry.scenarioIds
    .map((id) => getScenarioById(id))
    .filter((scenario): scenario is Scenario => Boolean(scenario))
    .sort((first, second) => first.year - second.year)
  const chronologyStops = scenarioStops.map((scenario) => ({
    scenario,
    evidenceCount: evidence.filter((entry) => entry.scenario.id === scenario.id).length,
  }))

  function updateDraft(updates: Partial<Omit<PeriodizationDraft, 'updatedAt'>>) {
    onUpdateDraftState((currentState) => ({
      ...currentState,
      [selectedInquiry.id]: {
        ...(currentState[selectedInquiry.id] ?? getEmptyPeriodizationDraft()),
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  function toggleEvidence(evidenceId: string) {
    const nextSelectedEvidenceIds = currentDraft.selectedEvidenceIds.includes(evidenceId)
      ? currentDraft.selectedEvidenceIds.filter((id) => id !== evidenceId)
      : [...currentDraft.selectedEvidenceIds, evidenceId]

    setCopyStatus('idle')
    updateDraft({ selectedEvidenceIds: nextSelectedEvidenceIds })
  }

  function clearDraft() {
    onUpdateDraftState((currentState) => {
      const nextState = { ...currentState }
      delete nextState[selectedInquiry.id]
      return nextState
    })
    setCopyStatus('idle')
  }

  async function copyPeriodizationBrief() {
    try {
      await copyTextToClipboard(formatPeriodizationBrief(selectedInquiry, evidence, currentDraft))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id={sectionIds.periodizationLab} className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="periodization-lab-title">
      <div className="rounded-[2rem] border border-sky-200/15 bg-sky-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-sky-100">
          <Clock3 size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">continuity & turning points lab 1.0</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="periodization-lab-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Continuity & Turning Points Lab / 历史连续性与分期工作台 1.0
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              从现有 scenarios 派生 6 个分期探究，把 scenario year、timeline、Scene Reader、决策语境、真实历史和来源放入按年份排序的 chronology rail，帮助提出时期起止、连续性、变化与转折点。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {getActivePeriodizationDrafts(draftState).length} 个分期草稿 · 当前已选 {selectedEvidence.length}/{evidence.length} 条证据
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
          <aside className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {periodizationInquiryDefinitions.map((inquiry) => {
                const isSelected = inquiry.id === selectedInquiry.id
                const inquiryDraft = draftState[inquiry.id]
                const status = inquiryDraft && hasPeriodizationDraftActivity(inquiryDraft) ? 'draft' : 'not-started'

                return (
                  <button
                    key={inquiry.id}
                    type="button"
                    onClick={() => {
                      onSelectInquiry(inquiry.id)
                      setCopyStatus('idle')
                    }}
                    className={`rounded-3xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-sky-200/45 bg-sky-100/[0.09]'
                        : 'border-white/10 bg-black/20 hover:border-sky-100/25 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                      <span>{inquiry.subtitle}</span>
                      <span className={`rounded-full border px-2 py-0.5 ${status === 'draft' ? 'border-amber-200/20 bg-amber-100/[0.08] text-amber-100' : 'border-white/10 bg-white/[0.035] text-stone-500'}`}>
                        {getStatusLabel(status)}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-stone-50">{inquiry.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{inquiry.drivingQuestion}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {inquiry.tags.slice(0, 3).map((tag) => <Tag key={`${inquiry.id}-${tag}`}>{tag}</Tag>)}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">Chronology rail / 时间顺序</h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">按 scenario.year 排序，先看分期跨度，再进入场景阅读证据。</p>
              <div className="mt-4 space-y-3">
                {chronologyStops.map(({ scenario, evidenceCount }, index) => (
                  <div key={scenario.id} className="relative pl-7">
                    {index !== chronologyStops.length - 1 ? <div className="absolute bottom-[-0.9rem] left-[0.32rem] top-4 w-px bg-white/10" /> : null}
                    <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full" style={{ backgroundColor: scenario.accent }} />
                    <div className="text-sm text-sky-100">{scenario.year}</div>
                    <button
                      type="button"
                      onClick={() => onOpenScenario(scenario.id, sectionIds.sceneReader)}
                      className="mt-1 text-left font-semibold text-stone-100 transition hover:text-sky-100"
                    >
                      {scenario.title}
                    </button>
                    <p className="mt-1 text-xs leading-5 text-stone-500">{scenario.location} · {evidenceCount} 条证据</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <article className="rounded-[1.5rem] border border-sky-200/15 bg-black/20 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-sky-100/70">selected inquiry</div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-50">{selectedInquiry.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{selectedInquiry.focus}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void copyPeriodizationBrief()}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
                >
                  {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                  {copyStatus === 'copied' ? '分期简报已复制' : copyStatus === 'failed' ? '复制失败' : '复制 / 导出分期简报'}
                </button>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                <p className="rounded-2xl border border-sky-200/15 bg-sky-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                  {selectedInquiry.drivingQuestion}
                </p>
                <p className="rounded-2xl border border-amber-200/15 bg-amber-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                  <span className="font-semibold text-amber-100">候选转折：</span>{selectedInquiry.suggestedTurningPoint}
                </p>
              </div>
            </article>

            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4" aria-labelledby="periodization-evidence-title">
                <h3 id="periodization-evidence-title" className="font-semibold text-stone-50">Turning-point evidence / 转折点证据卡</h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">勾选要纳入分期简报的证据；证据已按年份排序。</p>
                <div className="mt-4 max-h-[760px] space-y-3 overflow-y-auto pr-1">
                  {evidence.map((entry) => {
                    const isSelected = currentDraft.selectedEvidenceIds.includes(entry.id)

                    return (
                      <article key={entry.id} className={`rounded-2xl border p-3 transition ${isSelected ? 'border-amber-200/35 bg-amber-100/[0.07]' : 'border-white/10 bg-white/[0.025]'}`}>
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleEvidence(entry.id)}
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                              <span className="rounded-full border border-sky-200/20 bg-sky-100/[0.06] px-2 py-0.5 text-sky-100">{entry.year}</span>
                              <span className="rounded-full border border-teal-200/20 bg-teal-100/[0.06] px-2 py-0.5 text-teal-100">{entry.label}</span>
                              <span>{entry.scenario.title}</span>
                            </div>
                            <h4 className="mt-2 font-semibold text-stone-100">{entry.title}</h4>
                            <p className="mt-2 text-sm leading-6 text-stone-400">{entry.text}</p>
                            <p className="mt-3 rounded-2xl border border-sky-200/10 bg-sky-100/[0.04] p-3 text-xs leading-5 text-sky-100/80">
                              {entry.evidenceHint}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => onOpenScenario(entry.scenario.id, sectionIds.sceneReader)}
                                className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-sky-200/30 hover:text-sky-100"
                              >
                                打开 Scene Reader
                              </button>
                              <button
                                type="button"
                                onClick={() => onOpenScenario(entry.scenario.id, sectionIds.sourceReader)}
                                className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-teal-200/30 hover:text-teal-100"
                              >
                                打开 Source Reader
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4" aria-labelledby="periodization-draft-title">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 id="periodization-draft-title" className="font-semibold text-stone-50">Periodization draft / 分期草稿</h3>
                    <p className="mt-1 text-xs text-stone-500">
                      {currentDraft.updatedAt ? `已保存：${new Date(currentDraft.updatedAt).toLocaleString()}` : '本机保存，受限时回退 sessionStorage。'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearDraft}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-sky-200/30 hover:text-sky-100"
                  >
                    清空
                  </button>
                </div>

                <div className="mt-4 grid gap-3">
                  {([
                    ['periodStart', 'period start / 时期起点', '你的分期从哪一年或哪类变化开始？'],
                    ['periodEnd', 'period end / 时期终点', '你的分期到哪一年或哪类变化结束？'],
                    ['continuities', 'continuities / 连续性', '哪些制度、风险、劳动或媒介保持连续？'],
                    ['changes', 'changes / 变化', '哪些条件、速度、规模或行动空间发生变化？'],
                    ['turningPoint', 'turning point / 转折点', '哪一年、事件或结构变化最能说明转折？'],
                    ['beforeAfterEvidence', 'before-after evidence / 前后证据', '用至少两条证据说明转折前后差异。'],
                    ['periodLabel', 'period label / 分期标签', '给这个时期一个可辩护的名称。'],
                    ['alternativePeriodization', 'alternative periodization / 替代分期', '如果用另一个标准划分，会怎样不同？'],
                    ['missingEvidence', 'missing evidence / 缺失证据', '还缺哪些来源、地区、身份或声音？'],
                  ] as [keyof Omit<PeriodizationDraft, 'confidence' | 'selectedEvidenceIds' | 'updatedAt'>, string, string][]).map(([field, label, placeholder]) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">{label}</span>
                      <textarea
                        value={currentDraft[field]}
                        onChange={(event) => updateDraft({ [field]: event.target.value })}
                        rows={field === 'beforeAfterEvidence' || field === 'alternativePeriodization' || field === 'missingEvidence' ? 3 : 2}
                        placeholder={placeholder}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-sky-200/50"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">confidence / 信心等级</span>
                    <select
                      value={currentDraft.confidence}
                      onChange={(event) => updateDraft({ confidence: event.target.value as PeriodizationConfidence })}
                      className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-sky-200/50"
                    >
                      {(Object.entries(periodizationConfidenceLabels) as [PeriodizationConfidence, string][]).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                  {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : '分期简报会优先导出已勾选证据；若未勾选，则导出前 10 条时间证据。'}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PerspectivesAgencyLabPanel({
  selectedInquiryId,
  evidenceByInquiry,
  draftState,
  onSelectInquiry,
  onUpdateDraftState,
  onOpenScenario,
}: {
  selectedInquiryId: string
  evidenceByInquiry: Record<string, PerspectivesEvidence[]>
  draftState: PerspectivesDraftState
  onSelectInquiry: (id: string) => void
  onUpdateDraftState: Dispatch<SetStateAction<PerspectivesDraftState>>
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const selectedInquiry = perspectivesInquiryDefinitions.find((inquiry) => inquiry.id === selectedInquiryId) ?? perspectivesInquiryDefinitions[0]

  if (!selectedInquiry) {
    return null
  }

  const evidence = evidenceByInquiry[selectedInquiry.id] ?? []
  const currentDraft = draftState[selectedInquiry.id] ?? getEmptyPerspectivesDraft()
  const selectedEvidence = currentDraft.selectedEvidenceIds
    .map((id) => evidence.find((entry) => entry.id === id))
    .filter((entry): entry is PerspectivesEvidence => Boolean(entry))
  const scenarioStops = selectedInquiry.scenarioIds
    .map((id) => getScenarioById(id))
    .filter((scenario): scenario is Scenario => Boolean(scenario))

  function updateDraft(updates: Partial<Omit<PerspectivesDraft, 'updatedAt'>>) {
    onUpdateDraftState((currentState) => ({
      ...currentState,
      [selectedInquiry.id]: {
        ...(currentState[selectedInquiry.id] ?? getEmptyPerspectivesDraft()),
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  function toggleEvidence(evidenceId: string) {
    const nextSelectedEvidenceIds = currentDraft.selectedEvidenceIds.includes(evidenceId)
      ? currentDraft.selectedEvidenceIds.filter((id) => id !== evidenceId)
      : [...currentDraft.selectedEvidenceIds, evidenceId]

    setCopyStatus('idle')
    updateDraft({ selectedEvidenceIds: nextSelectedEvidenceIds })
  }

  function clearDraft() {
    onUpdateDraftState((currentState) => {
      const nextState = { ...currentState }
      delete nextState[selectedInquiry.id]
      return nextState
    })
    setCopyStatus('idle')
  }

  async function copyPerspectivesBrief() {
    try {
      await copyTextToClipboard(formatPerspectivesBrief(selectedInquiry, evidence, currentDraft))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id={sectionIds.perspectivesLab} className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="perspectives-lab-title">
      <div className="rounded-[2rem] border border-violet-200/15 bg-violet-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-violet-100">
          <Users size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">perspectives & agency lab 1.0</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="perspectives-lab-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Perspectives & Agency Lab / 多视角与历史能动性工作台 1.0
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              从现有 scenarios 派生 6 个多视角探究，只使用身份/角色/摘要、dailyLife、scene beats、decision context/options、sources 与 sourceEvidenceUse，帮助判断普通人如何在约束、有限知识、风险和来源沉默中行动。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {getActivePerspectivesDrafts(draftState).length} 个多视角草稿 · 当前已选 {selectedEvidence.length}/{evidence.length} 条证据
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
          <aside className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {perspectivesInquiryDefinitions.map((inquiry) => {
                const isSelected = inquiry.id === selectedInquiry.id
                const inquiryDraft = draftState[inquiry.id]
                const status = inquiryDraft && hasPerspectivesDraftActivity(inquiryDraft) ? 'draft' : 'not-started'

                return (
                  <button
                    key={inquiry.id}
                    type="button"
                    onClick={() => {
                      onSelectInquiry(inquiry.id)
                      setCopyStatus('idle')
                    }}
                    className={`rounded-3xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-violet-200/45 bg-violet-100/[0.09]'
                        : 'border-white/10 bg-black/20 hover:border-violet-100/25 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                      <span>{inquiry.subtitle}</span>
                      <span className={`rounded-full border px-2 py-0.5 ${status === 'draft' ? 'border-amber-200/20 bg-amber-100/[0.08] text-amber-100' : 'border-white/10 bg-white/[0.035] text-stone-500'}`}>
                        {getStatusLabel(status)}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-stone-50">{inquiry.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{inquiry.drivingQuestion}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {inquiry.tags.slice(0, 3).map((tag) => <Tag key={`${inquiry.id}-${tag}`}>{tag}</Tag>)}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">场景与反当下主义检查</h3>
              <div className="mt-3 space-y-2">
                {scenarioStops.map((scenario, index) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => onOpenScenario(scenario.id, sectionIds.sceneReader)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-left text-sm transition hover:border-violet-100/25"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-stone-950" style={{ backgroundColor: scenario.accent }}>{index + 1}</span>
                    <span>
                      <span className="block font-medium text-stone-100">{scenario.title}</span>
                      <span className="block text-xs text-stone-500">{scenario.identity} · {scenario.location}</span>
                    </span>
                  </button>
                ))}
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-400">
                {perspectivesAntiPresentismChecklist.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 size={15} className="mt-1 shrink-0 text-violet-100" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="space-y-4">
            <article className="rounded-[1.5rem] border border-violet-200/15 bg-black/20 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-violet-100/70">selected inquiry</div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-50">{selectedInquiry.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{selectedInquiry.focus}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void copyPerspectivesBrief()}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
                >
                  {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                  {copyStatus === 'copied' ? '多视角简报已复制' : copyStatus === 'failed' ? '复制失败' : '复制 / 导出多视角简报'}
                </button>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr]">
                <p className="rounded-2xl border border-violet-200/15 bg-violet-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                  {selectedInquiry.drivingQuestion}
                </p>
                <p className="rounded-2xl border border-amber-200/15 bg-amber-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                  <span className="font-semibold text-amber-100">能动性框架：</span>{selectedInquiry.agencyFrame}
                </p>
              </div>
            </article>

            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4" aria-labelledby="perspectives-evidence-title">
                <h3 id="perspectives-evidence-title" className="font-semibold text-stone-50">Selectable evidence / 可选证据</h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">勾选证据纳入简报；标签覆盖 actor position、constraint、knowledge limit、risk/stake、source perspective 与 absent voice。</p>
                <div className="mt-4 max-h-[760px] space-y-3 overflow-y-auto pr-1">
                  {evidence.map((entry) => {
                    const isSelected = currentDraft.selectedEvidenceIds.includes(entry.id)

                    return (
                      <article key={entry.id} className={`rounded-2xl border p-3 transition ${isSelected ? 'border-amber-200/35 bg-amber-100/[0.07]' : 'border-white/10 bg-white/[0.025]'}`}>
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleEvidence(entry.id)}
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                              <span className="rounded-full border border-violet-200/20 bg-violet-100/[0.06] px-2 py-0.5 text-violet-100">{perspectivesEvidenceLabelText[entry.label]}</span>
                              <span>{entry.scenario.title}</span>
                            </div>
                            <h4 className="mt-2 font-semibold text-stone-100">{entry.title}</h4>
                            <p className="mt-2 text-sm leading-6 text-stone-400">{entry.text}</p>
                            {entry.sourcePerspective || entry.sourceReliability || entry.sourceQuestion ? (
                              <dl className="mt-3 grid gap-2 rounded-2xl border border-violet-200/10 bg-violet-100/[0.035] p-3 text-xs leading-5 text-stone-400">
                                {entry.sourcePerspective ? <div><dt className="font-semibold text-violet-100">来源视角</dt><dd>{entry.sourcePerspective}</dd></div> : null}
                                {entry.sourceReliability ? <div><dt className="font-semibold text-violet-100">可靠边界</dt><dd>{entry.sourceReliability}</dd></div> : null}
                                {entry.sourceQuestion ? <div><dt className="font-semibold text-violet-100">史料追问</dt><dd>{entry.sourceQuestion}</dd></div> : null}
                              </dl>
                            ) : null}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {entry.tags.slice(0, 5).map((tag) => <Tag key={`${entry.id}-${tag}`}>{tag}</Tag>)}
                              <button
                                type="button"
                                onClick={() => onOpenScenario(entry.scenario.id, entry.sourceType === 'source' ? sectionIds.sourceReader : sectionIds.sceneReader)}
                                className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-violet-200/30 hover:text-violet-100"
                              >
                                打开相关场景
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4" aria-labelledby="perspectives-draft-title">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 id="perspectives-draft-title" className="font-semibold text-stone-50">Perspectives draft / 多视角草稿</h3>
                    <p className="mt-1 text-xs text-stone-500">
                      {currentDraft.updatedAt ? `已保存：${new Date(currentDraft.updatedAt).toLocaleString()}` : '本机保存，受限时回退 sessionStorage。'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearDraft}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-violet-200/30 hover:text-violet-100"
                  >
                    清空
                  </button>
                </div>

                <div className="mt-4 grid gap-3">
                  {([
                    ['actorView', 'actor view / 行动者视角', '从这个身份当时的位置看，问题是什么？'],
                    ['constraints', 'constraints / 约束条件', '制度、市场、家庭、身体、语言或暴力如何限制行动？'],
                    ['availableKnowledge', 'available knowledge / 可得知识', '当事人可能知道什么？哪些后果只有后来的我们知道？'],
                    ['stakesAndRisks', 'stakes and risks / 利害与风险', '选择会影响谁的安全、生计、名声或未来？'],
                    ['agencyClaim', 'agency claim / 能动性判断', '在约束中，当事人仍能做出怎样的判断、协商或抵抗？'],
                    ['presentismWarning', 'presentism warning / 反当下主义警示', '我需要避免哪种今天视角的误读？'],
                    ['sourcePerspectiveLimits', 'source perspective limits / 来源视角限制', '材料由谁记录、为谁服务、看不见什么？'],
                    ['missingVoices', 'missing voices / 缺席声音', '哪些人没有直接发声？还需要什么来源？'],
                  ] as [keyof Omit<PerspectivesDraft, 'confidence' | 'selectedEvidenceIds' | 'updatedAt'>, string, string][]).map(([field, label, placeholder]) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">{label}</span>
                      <textarea
                        value={currentDraft[field]}
                        onChange={(event) => updateDraft({ [field]: event.target.value })}
                        rows={field === 'agencyClaim' || field === 'sourcePerspectiveLimits' || field === 'missingVoices' ? 3 : 2}
                        placeholder={placeholder}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-violet-200/50"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">confidence / 信心等级</span>
                    <select
                      value={currentDraft.confidence}
                      onChange={(event) => updateDraft({ confidence: event.target.value as PerspectivesConfidence })}
                      className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-violet-200/50"
                    >
                      {(Object.entries(perspectivesConfidenceLabels) as [PerspectivesConfidence, string][]).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                  {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : '多视角简报会优先导出已勾选证据；若未勾选，则导出前 10 条证据。'}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function ContextScaleLabPanel({
  selectedInquiryId,
  evidenceByInquiry,
  draftState,
  onSelectInquiry,
  onUpdateDraftState,
  onOpenScenario,
}: {
  selectedInquiryId: string
  evidenceByInquiry: Record<string, ContextEvidence[]>
  draftState: ContextDraftState
  onSelectInquiry: (id: string) => void
  onUpdateDraftState: Dispatch<SetStateAction<ContextDraftState>>
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const selectedInquiry = contextInquiryDefinitions.find((inquiry) => inquiry.id === selectedInquiryId) ?? contextInquiryDefinitions[0]

  if (!selectedInquiry) {
    return null
  }

  const evidence = evidenceByInquiry[selectedInquiry.id] ?? []
  const currentDraft = draftState[selectedInquiry.id] ?? getEmptyContextDraft()
  const selectedEvidence = currentDraft.selectedEvidenceIds
    .map((id) => evidence.find((entry) => entry.id === id))
    .filter((entry): entry is ContextEvidence => Boolean(entry))
  const scenarioStops = selectedInquiry.scenarioIds
    .map((id) => getScenarioById(id))
    .filter((scenario): scenario is Scenario => Boolean(scenario))
  const scaleCounts = contextScaleLadder.map((step) => ({
    ...step,
    count: evidence.filter((entry) => entry.label === step.key).length,
    selectedCount: selectedEvidence.filter((entry) => entry.label === step.key).length,
  }))

  function updateDraft(updates: Partial<Omit<ContextDraft, 'updatedAt'>>) {
    onUpdateDraftState((currentState) => ({
      ...currentState,
      [selectedInquiry.id]: {
        ...(currentState[selectedInquiry.id] ?? getEmptyContextDraft()),
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  function toggleEvidence(evidenceId: string) {
    const nextSelectedEvidenceIds = currentDraft.selectedEvidenceIds.includes(evidenceId)
      ? currentDraft.selectedEvidenceIds.filter((id) => id !== evidenceId)
      : [...currentDraft.selectedEvidenceIds, evidenceId]

    setCopyStatus('idle')
    updateDraft({ selectedEvidenceIds: nextSelectedEvidenceIds })
  }

  function clearDraft() {
    onUpdateDraftState((currentState) => {
      const nextState = { ...currentState }
      delete nextState[selectedInquiry.id]
      return nextState
    })
    setCopyStatus('idle')
  }

  async function copyContextBrief() {
    try {
      await copyTextToClipboard(formatContextBrief(selectedInquiry, evidence, currentDraft))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id={sectionIds.contextLab} className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="context-lab-title">
      <div className="rounded-[2rem] border border-cyan-200/15 bg-cyan-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-cyan-100">
          <Compass size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">context & scale lab 1.0</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="context-lab-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Context & Scale Lab / 历史情境化与尺度工作台 1.0
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              从现有场景字段生成 6 个情境化探究，沿 local、regional、imperial-global、source-context 与 presentism-risk 尺度梯组织证据，不改变 scenario schema。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {getActiveContextDrafts(draftState).length} 个情境化草稿 · 当前已选 {selectedEvidence.length}/{evidence.length} 条证据
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
          <aside className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {contextInquiryDefinitions.map((inquiry) => {
                const isSelected = inquiry.id === selectedInquiry.id
                const inquiryDraft = draftState[inquiry.id]
                const status = inquiryDraft && hasContextDraftActivity(inquiryDraft) ? 'draft' : 'not-started'

                return (
                  <button
                    key={inquiry.id}
                    type="button"
                    onClick={() => {
                      onSelectInquiry(inquiry.id)
                      setCopyStatus('idle')
                    }}
                    className={`rounded-3xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-cyan-200/45 bg-cyan-100/[0.09]'
                        : 'border-white/10 bg-black/20 hover:border-cyan-100/25 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                      <span>{inquiry.subtitle}</span>
                      <span className={`rounded-full border px-2 py-0.5 ${status === 'draft' ? 'border-amber-200/20 bg-amber-100/[0.08] text-amber-100' : 'border-white/10 bg-white/[0.035] text-stone-500'}`}>
                        {getStatusLabel(status)}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-stone-50">{inquiry.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{inquiry.drivingQuestion}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {inquiry.tags.slice(0, 3).map((tag) => <Tag key={`${inquiry.id}-${tag}`}>{tag}</Tag>)}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">Scale ladder / 尺度梯</h3>
              <div className="mt-3 space-y-3">
                {scaleCounts.map((step, index) => (
                  <div key={step.key} className="rounded-2xl border border-cyan-200/10 bg-cyan-100/[0.035] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-cyan-100">{index + 1}. {step.title}</span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-stone-400">{step.selectedCount}/{step.count}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{step.prompt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">场景路径</h3>
              <div className="mt-3 space-y-2">
                {scenarioStops.map((scenario, index) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => onOpenScenario(scenario.id, sectionIds.sceneReader)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-left text-sm transition hover:border-cyan-100/25"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-stone-950" style={{ backgroundColor: scenario.accent }}>{index + 1}</span>
                    <span>
                      <span className="block font-medium text-stone-100">{scenario.title}</span>
                      <span className="block text-xs text-stone-500">{scenario.year} · {scenario.location} · {scenario.region}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <article className="rounded-[1.5rem] border border-cyan-200/15 bg-black/20 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">selected inquiry</div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-50">{selectedInquiry.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{selectedInquiry.focus}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void copyContextBrief()}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
                >
                  {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                  {copyStatus === 'copied' ? '情境化简报已复制' : copyStatus === 'failed' ? '复制失败' : '复制 / 导出 Context Brief'}
                </button>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr]">
                <p className="rounded-2xl border border-cyan-200/15 bg-cyan-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                  {selectedInquiry.drivingQuestion}
                </p>
                <p className="rounded-2xl border border-amber-200/15 bg-amber-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                  <span className="font-semibold text-amber-100">尺度框架：</span>{selectedInquiry.scaleFrame}
                </p>
              </div>
            </article>

            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4" aria-labelledby="context-evidence-title">
                <h3 id="context-evidence-title" className="font-semibold text-stone-50">Selectable evidence / 可选情境证据</h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">证据只抽取 year/era/location/region、timeline、keyTerms、dailyLife、sceneBeats、decision、sources、realHistory 与 sourceEvidenceUse。</p>
                <div className="mt-4 max-h-[760px] space-y-3 overflow-y-auto pr-1">
                  {evidence.map((entry) => {
                    const isSelected = currentDraft.selectedEvidenceIds.includes(entry.id)

                    return (
                      <article key={entry.id} className={`rounded-2xl border p-3 transition ${isSelected ? 'border-amber-200/35 bg-amber-100/[0.07]' : 'border-white/10 bg-white/[0.025]'}`}>
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleEvidence(entry.id)}
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                              <span className="rounded-full border border-cyan-200/20 bg-cyan-100/[0.06] px-2 py-0.5 text-cyan-100">{contextEvidenceLabelText[entry.label]}</span>
                              <span>{entry.scenario.title}</span>
                            </div>
                            <h4 className="mt-2 font-semibold text-stone-100">{entry.title}</h4>
                            <p className="mt-2 text-sm leading-6 text-stone-400">{entry.text}</p>
                            <p className="mt-3 rounded-2xl border border-cyan-200/10 bg-cyan-100/[0.035] p-3 text-xs leading-5 text-stone-400">
                              <span className="font-semibold text-cyan-100">尺度用途：</span>{entry.scaleHint}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {entry.tags.slice(0, 5).map((tag) => <Tag key={`${entry.id}-${tag}`}>{tag}</Tag>)}
                              <button
                                type="button"
                                onClick={() => onOpenScenario(entry.scenario.id, entry.sourceType === 'source' || entry.sourceType === 'source-evidence-use' ? sectionIds.sourceReader : sectionIds.sceneReader)}
                                className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-cyan-200/30 hover:text-cyan-100"
                              >
                                打开相关场景
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4" aria-labelledby="context-draft-title">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 id="context-draft-title" className="font-semibold text-stone-50">Context draft / 情境化草稿</h3>
                    <p className="mt-1 text-xs text-stone-500">
                      {currentDraft.updatedAt ? `已保存：${new Date(currentDraft.updatedAt).toLocaleString()}` : '本机保存，受限时回退 sessionStorage。'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearDraft}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-cyan-200/30 hover:text-cyan-100"
                  >
                    清空
                  </button>
                </div>

                <div className="mt-4 grid gap-3">
                  {([
                    ['localSetting', 'local setting / 地方现场', '地点、城市/港口/工厂/家庭秩序如何塑造这一天？'],
                    ['regionalConnections', 'regional connections / 区域连接', '哪些路线、城市、季节、市场或书信网络连接这个地方？'],
                    ['largeScaleForces', 'large-scale forces / 大尺度力量', '帝国、殖民、战争、商品链或制度如何进入地方？'],
                    ['sourceContext', 'source context / 来源情境', '材料由谁记录、保存，为谁服务，能见度怎样？'],
                    ['anachronismRisk', 'anachronism risk / 时代错置风险', '我可能把哪些现代概念或后见之明投射回去？'],
                    ['contextClaim', 'context claim / 情境化判断', '把地方、区域、大尺度与来源情境整合成一句判断。'],
                    ['missingContext', 'missing context / 缺失情境', '还缺哪些地点、群体、来源或尺度证据？'],
                  ] as [keyof Omit<ContextDraft, 'confidence' | 'selectedEvidenceIds' | 'updatedAt'>, string, string][]).map(([field, label, placeholder]) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">{label}</span>
                      <textarea
                        value={currentDraft[field]}
                        onChange={(event) => updateDraft({ [field]: event.target.value })}
                        rows={field === 'contextClaim' || field === 'sourceContext' || field === 'missingContext' ? 3 : 2}
                        placeholder={placeholder}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-cyan-200/50"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">confidence / 信心等级</span>
                    <select
                      value={currentDraft.confidence}
                      onChange={(event) => updateDraft({ confidence: event.target.value as ContextConfidence })}
                      className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-cyan-200/50"
                    >
                      {(Object.entries(contextConfidenceLabels) as [ContextConfidence, string][]).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                  {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : 'Context Brief 会优先导出已勾选证据；若未勾选，则导出前 10 条证据。'}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function SignificanceMemoryLabPanel({
  selectedInquiryId,
  evidenceByInquiry,
  draftState,
  onSelectInquiry,
  onUpdateDraftState,
  onOpenScenario,
}: {
  selectedInquiryId: string
  evidenceByInquiry: Record<string, SignificanceEvidence[]>
  draftState: SignificanceDraftState
  onSelectInquiry: (id: string) => void
  onUpdateDraftState: Dispatch<SetStateAction<SignificanceDraftState>>
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const selectedInquiry = significanceInquiryDefinitions.find((inquiry) => inquiry.id === selectedInquiryId) ?? significanceInquiryDefinitions[0]

  if (!selectedInquiry) {
    return null
  }

  const evidence = evidenceByInquiry[selectedInquiry.id] ?? []
  const currentDraft = draftState[selectedInquiry.id] ?? getEmptySignificanceDraft()
  const selectedEvidence = currentDraft.selectedEvidenceIds
    .map((id) => evidence.find((entry) => entry.id === id))
    .filter((entry): entry is SignificanceEvidence => Boolean(entry))
  const scenarioStops = selectedInquiry.scenarioIds
    .map((id) => getScenarioById(id))
    .filter((scenario): scenario is Scenario => Boolean(scenario))
  const ladderCounts = significanceCriteriaLadder.map((step) => ({
    ...step,
    count: evidence.filter((entry) => entry.label === step.key).length,
    selectedCount: selectedEvidence.filter((entry) => entry.label === step.key).length,
  }))

  function updateDraft(updates: Partial<Omit<SignificanceDraft, 'updatedAt'>>) {
    onUpdateDraftState((currentState) => ({
      ...currentState,
      [selectedInquiry.id]: {
        ...(currentState[selectedInquiry.id] ?? getEmptySignificanceDraft()),
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  function toggleEvidence(evidenceId: string) {
    const nextSelectedEvidenceIds = currentDraft.selectedEvidenceIds.includes(evidenceId)
      ? currentDraft.selectedEvidenceIds.filter((id) => id !== evidenceId)
      : [...currentDraft.selectedEvidenceIds, evidenceId]

    setCopyStatus('idle')
    updateDraft({ selectedEvidenceIds: nextSelectedEvidenceIds })
  }

  function clearDraft() {
    onUpdateDraftState((currentState) => {
      const nextState = { ...currentState }
      delete nextState[selectedInquiry.id]
      return nextState
    })
    setCopyStatus('idle')
  }

  async function copySignificanceBrief() {
    try {
      await copyTextToClipboard(formatSignificanceBrief(selectedInquiry, evidence, currentDraft))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id={sectionIds.significanceLab} className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="significance-lab-title">
      <div className="rounded-[2rem] border border-rose-200/15 bg-rose-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-rose-100">
          <Landmark size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">significance & memory lab 1.0</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="significance-lab-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Significance & Memory Lab / 历史意义与记忆工作台 1.0
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              从现有场景字段生成 6 个历史意义探究，沿 immediate-impact、long-term-change、scale-reach、contested-meaning、memory-archive 与 ordinary-life 标准梯组织证据，不改变 scenario schema。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {getActiveSignificanceDrafts(draftState).length} 个意义草稿 · 当前已选 {selectedEvidence.length}/{evidence.length} 条证据
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
          <aside className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {significanceInquiryDefinitions.map((inquiry) => {
                const isSelected = inquiry.id === selectedInquiry.id
                const inquiryDraft = draftState[inquiry.id]
                const status = inquiryDraft && hasSignificanceDraftActivity(inquiryDraft) ? 'draft' : 'not-started'

                return (
                  <button
                    key={inquiry.id}
                    type="button"
                    onClick={() => {
                      onSelectInquiry(inquiry.id)
                      setCopyStatus('idle')
                    }}
                    className={`rounded-3xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-rose-200/45 bg-rose-100/[0.09]'
                        : 'border-white/10 bg-black/20 hover:border-rose-100/25 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                      <span>{inquiry.subtitle}</span>
                      <span className={`rounded-full border px-2 py-0.5 ${status === 'draft' ? 'border-amber-200/20 bg-amber-100/[0.08] text-amber-100' : 'border-white/10 bg-white/[0.035] text-stone-500'}`}>
                        {getStatusLabel(status)}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-stone-50">{inquiry.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{inquiry.drivingQuestion}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {inquiry.tags.slice(0, 3).map((tag) => <Tag key={`${inquiry.id}-${tag}`}>{tag}</Tag>)}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">Significance criteria ladder / 意义标准梯</h3>
              <div className="mt-3 space-y-3">
                {ladderCounts.map((step, index) => (
                  <div key={step.key} className="rounded-2xl border border-rose-200/10 bg-rose-100/[0.035] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-rose-100">{index + 1}. {step.title}</span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-stone-400">{step.selectedCount}/{step.count}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{step.prompt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">场景路径</h3>
              <div className="mt-3 space-y-2">
                {scenarioStops.map((scenario, index) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => onOpenScenario(scenario.id, sectionIds.sceneReader)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-left text-sm transition hover:border-rose-100/25"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-stone-950" style={{ backgroundColor: scenario.accent }}>{index + 1}</span>
                    <span>
                      <span className="block font-medium text-stone-100">{scenario.title}</span>
                      <span className="block text-xs text-stone-500">{scenario.year} · {scenario.location} · {scenario.region}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <article className="rounded-[1.5rem] border border-rose-200/15 bg-black/20 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-rose-100/70">selected inquiry</div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-50">{selectedInquiry.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{selectedInquiry.focus}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void copySignificanceBrief()}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
                >
                  {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                  {copyStatus === 'copied' ? '意义简报已复制' : copyStatus === 'failed' ? '复制失败' : '复制 / 导出 Significance Brief'}
                </button>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr]">
                <p className="rounded-2xl border border-rose-200/15 bg-rose-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                  {selectedInquiry.drivingQuestion}
                </p>
                <p className="rounded-2xl border border-amber-200/15 bg-amber-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                  <span className="font-semibold text-amber-100">记忆框架：</span>{selectedInquiry.memoryFrame}
                </p>
              </div>
            </article>

            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4" aria-labelledby="significance-evidence-title">
                <h3 id="significance-evidence-title" className="font-semibold text-stone-50">Selectable evidence / 可选意义证据</h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">证据只抽取 identity/summary、前几条 timeline、selected dailyLife、sceneBeats、decision、sources、realHistory、interpretationNote 与 sourceEvidenceUse。</p>
                <div className="mt-4 max-h-[760px] space-y-3 overflow-y-auto pr-1">
                  {evidence.map((entry) => {
                    const isSelected = currentDraft.selectedEvidenceIds.includes(entry.id)

                    return (
                      <article key={entry.id} className={`rounded-2xl border p-3 transition ${isSelected ? 'border-amber-200/35 bg-amber-100/[0.07]' : 'border-white/10 bg-white/[0.025]'}`}>
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleEvidence(entry.id)}
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                              <span className="rounded-full border border-rose-200/20 bg-rose-100/[0.06] px-2 py-0.5 text-rose-100">{significanceEvidenceLabelText[entry.label]}</span>
                              <span>{entry.scenario.title}</span>
                            </div>
                            <h4 className="mt-2 font-semibold text-stone-100">{entry.title}</h4>
                            <p className="mt-2 text-sm leading-6 text-stone-400">{entry.text}</p>
                            <p className="mt-3 rounded-2xl border border-rose-200/10 bg-rose-100/[0.035] p-3 text-xs leading-5 text-stone-400">
                              <span className="font-semibold text-rose-100">意义用途：</span>{entry.significanceHint}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {entry.tags.slice(0, 5).map((tag) => <Tag key={`${entry.id}-${tag}`}>{tag}</Tag>)}
                              <button
                                type="button"
                                onClick={() => onOpenScenario(entry.scenario.id, entry.sourceType === 'source' || entry.sourceType === 'source-evidence-use' || entry.sourceType === 'interpretation-note' ? sectionIds.sourceReader : sectionIds.sceneReader)}
                                className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-rose-200/30 hover:text-rose-100"
                              >
                                打开相关场景
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4" aria-labelledby="significance-draft-title">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 id="significance-draft-title" className="font-semibold text-stone-50">Significance draft / 历史意义草稿</h3>
                    <p className="mt-1 text-xs text-stone-500">
                      {currentDraft.updatedAt ? `已保存：${new Date(currentDraft.updatedAt).toLocaleString()}` : '本机保存，受限时回退 sessionStorage。'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearDraft}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-rose-200/30 hover:text-rose-100"
                  >
                    清空
                  </button>
                </div>

                <div className="mt-4 grid gap-3">
                  {([
                    ['eventOrProcess', 'event or process / 事件或过程', '你要判断其意义的事件、过程或经验是什么？'],
                    ['whoItMatteredTo', 'who it mattered to / 对谁重要', '它对哪些普通人、群体、机构或后世读者重要？'],
                    ['contemporarySignificance', 'contemporary significance / 当时意义', '在当时，它如何改变选择、安全、生计、知识或规则？'],
                    ['longTermSignificance', 'long-term significance / 长期意义', '后来的制度、商品链、知识传播、记忆或身份如何被改变？'],
                    ['scaleOfImpact', 'scale of impact / 影响尺度', '影响停留在个人/社区，还是连接区域、帝国、全球或跨时代？'],
                    ['contestedMeaning', 'contested meaning / 争议意义', '不同群体会怎样解释、纪念、反驳或淡化它？'],
                    ['sourceLimits', 'source limits / 来源限制', '哪些来源保存了它？哪些沉默会改变重要性判断？'],
                    ['significanceClaim', 'significance claim / 意义主张', '用一句可争辩的历史判断总结它为什么重要。'],
                  ] as [keyof Omit<SignificanceDraft, 'confidence' | 'selectedEvidenceIds' | 'updatedAt'>, string, string][]).map(([field, label, placeholder]) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">{label}</span>
                      <textarea
                        value={currentDraft[field]}
                        onChange={(event) => updateDraft({ [field]: event.target.value })}
                        rows={field === 'significanceClaim' || field === 'sourceLimits' || field === 'longTermSignificance' ? 3 : 2}
                        placeholder={placeholder}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-rose-200/50"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">confidence / 信心等级</span>
                    <select
                      value={currentDraft.confidence}
                      onChange={(event) => updateDraft({ confidence: event.target.value as SignificanceConfidence })}
                      className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-rose-200/50"
                    >
                      {(Object.entries(significanceConfidenceLabels) as [SignificanceConfidence, string][]).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                  {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : 'Significance Brief 会优先导出已勾选证据；若未勾选，则导出前 10 条证据。'}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SynthesisWritingStudioPanel({
  selectedPresetId,
  evidencePool,
  draftState,
  onSelectPreset,
  onUpdateDraftState,
  onOpenScenario,
}: {
  selectedPresetId: string
  evidencePool: SynthesisEvidence[]
  draftState: SynthesisDraftState
  onSelectPreset: (id: string) => void
  onUpdateDraftState: Dispatch<SetStateAction<SynthesisDraftState>>
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [originFilter, setOriginFilter] = useState<'all' | SynthesisEvidenceOrigin>('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const selectedPreset = synthesisInquiryPresets.find((preset) => preset.id === selectedPresetId) ?? synthesisInquiryPresets[0]

  if (!selectedPreset) {
    return null
  }

  const currentDraft = draftState[selectedPreset.id] ?? getEmptySynthesisDraft(selectedPreset)
  const selectedEvidence = currentDraft.evidenceIds
    .map((id) => evidencePool.find((entry) => entry.id === id))
    .filter((entry): entry is SynthesisEvidence => Boolean(entry))
  const tagOptions = [...new Set(evidencePool.flatMap((entry) => entry.tags))].sort((first, second) => first.localeCompare(second, 'zh-Hans-CN')).slice(0, 80)
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const visibleEvidence = evidencePool.filter((entry) => {
    const matchesOrigin = originFilter === 'all' || entry.origin === originFilter
    const matchesTag = tagFilter === 'all' || entry.tags.includes(tagFilter)
    const matchesSearch = !normalizedSearchQuery || [entry.title, entry.text, entry.originLabel, entry.scenarioTitle, entry.inquiryTitle, ...entry.tags].filter(Boolean).join(' ').toLowerCase().includes(normalizedSearchQuery)

    return matchesOrigin && matchesTag && matchesSearch
  })

  function updateDraft(updates: Partial<Omit<SynthesisDraft, 'updatedAt'>>) {
    onUpdateDraftState((currentState) => ({
      ...currentState,
      [selectedPreset.id]: {
        ...(currentState[selectedPreset.id] ?? getEmptySynthesisDraft(selectedPreset)),
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  function applyPreset(presetId: string) {
    const preset = synthesisInquiryPresets.find((candidate) => candidate.id === presetId)
    if (!preset) return
    onSelectPreset(preset.id)
    setCopyStatus('idle')
    onUpdateDraftState((currentState) => {
      if (currentState[preset.id]) {
        return currentState
      }

      return {
        ...currentState,
        [preset.id]: {
          ...getEmptySynthesisDraft(preset),
          updatedAt: new Date().toISOString(),
        },
      }
    })
  }

  function toggleEvidence(evidenceId: string) {
    const nextEvidenceIds = currentDraft.evidenceIds.includes(evidenceId)
      ? currentDraft.evidenceIds.filter((id) => id !== evidenceId)
      : [...currentDraft.evidenceIds, evidenceId]
    setCopyStatus('idle')
    updateDraft({ evidenceIds: nextEvidenceIds })
  }

  function clearDraft() {
    onUpdateDraftState((currentState) => {
      const nextState = { ...currentState }
      delete nextState[selectedPreset.id]
      return nextState
    })
    setCopyStatus('idle')
  }

  function buildThesisStarter() {
    const evidenceOrigins = [...new Set(selectedEvidence.map((entry) => entry.originLabel.split(' / ')[0]))].slice(0, 3).join('、') || '所选证据'
    const tagHint = [...new Set(selectedEvidence.flatMap((entry) => entry.tags))].slice(0, 4).join('、') || selectedPreset.tags.slice(0, 3).join('、')
    updateDraft({
      workingThesis: `虽然证据仍有来源限制，${selectedPreset.title}显示：${tagHint}并不是孤立现象，而是通过普通人的选择、制度约束和长期意义相互连接。`,
      reasoningBridge: `推理桥：先用${evidenceOrigins}确立可见证据，再比较不同场景中的因果、分期、视角和意义，最后说明哪些沉默会改变论证信心。`,
    })
  }

  async function copySynthesisBrief() {
    try {
      await copyTextToClipboard(formatSynthesisWritingBrief(selectedPreset, evidencePool, currentDraft))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id={sectionIds.synthesisStudio} className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="synthesis-studio-title">
      <div className="rounded-[2rem] border border-fuchsia-200/15 bg-fuchsia-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-fuchsia-100">
          <ScrollText size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">synthesis & historical writing studio 1.0</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="synthesis-studio-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Synthesis & Historical Writing Studio / 综合历史论证工作台 1.0
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              作为 capstone，它把互证、因果、分期、多视角、情境化、历史意义、任务草稿和跨场景工作区条目归一为综合证据池，用于构建 thesis、段落计划、反驳与来源限制。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {getActiveSynthesisDrafts(draftState).length} 个综合草稿 · 当前已选 {selectedEvidence.length}/{evidencePool.length} 条证据
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {synthesisInquiryPresets.map((preset) => {
                const isSelected = preset.id === selectedPreset.id
                const presetDraft = draftState[preset.id]
                const status = presetDraft && hasSynthesisDraftActivity(presetDraft) ? 'draft' : 'not-started'
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={`rounded-3xl border p-4 text-left transition ${isSelected ? 'border-fuchsia-200/45 bg-fuchsia-100/[0.09]' : 'border-white/10 bg-black/20 hover:border-fuchsia-100/25 hover:bg-white/[0.04]'}`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                      <span>{preset.subtitle}</span>
                      <span className={`rounded-full border px-2 py-0.5 ${status === 'draft' ? 'border-amber-200/20 bg-amber-100/[0.08] text-amber-100' : 'border-white/10 bg-white/[0.035] text-stone-500'}`}>{getStatusLabel(status)}</span>
                    </div>
                    <h3 className="mt-2 font-semibold text-stone-50">{preset.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{preset.drivingQuestion}</p>
                    <div className="mt-3 flex flex-wrap gap-2">{preset.tags.slice(0, 3).map((tag) => <Tag key={`${preset.id}-${tag}`}>{tag}</Tag>)}</div>
                  </button>
                )
              })}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">Paragraph frame / 段落框架</h3>
              <div className="mt-3 space-y-2">
                {selectedPreset.paragraphFrame.map((step, index) => (
                  <div key={step} className="rounded-2xl border border-fuchsia-200/10 bg-fuchsia-100/[0.035] p-3 text-sm leading-6 text-stone-400">
                    <span className="font-semibold text-fuchsia-100">{index + 1}. </span>{step}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <article className="rounded-[1.5rem] border border-fuchsia-200/15 bg-black/20 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-fuchsia-100/70">selected capstone inquiry</div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-50">{selectedPreset.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{selectedPreset.focus}</p>
                </div>
                <button type="button" onClick={() => void copySynthesisBrief()} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200">
                  {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                  {copyStatus === 'copied' ? '综合简报已复制' : copyStatus === 'failed' ? '复制失败' : '复制 / 导出 Synthesis Brief'}
                </button>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr]">
                <p className="rounded-2xl border border-fuchsia-200/15 bg-fuchsia-100/[0.045] p-4 text-sm leading-6 text-stone-300">{currentDraft.drivingQuestion || selectedPreset.drivingQuestion}</p>
                <p className="rounded-2xl border border-amber-200/15 bg-amber-100/[0.045] p-4 text-sm leading-6 text-stone-300"><span className="font-semibold text-amber-100">Claim scope：</span>{currentDraft.claimScope || selectedPreset.claimScope}</p>
              </div>
            </article>

            <div className="grid gap-4 xl:grid-cols-[0.96fr_1.04fr]">
              <section className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4" aria-labelledby="synthesis-evidence-title">
                <h3 id="synthesis-evidence-title" className="font-semibold text-stone-50">Normalized synthesis evidence pool / 综合证据池</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索证据、标签、场景……" className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-fuchsia-200/50 sm:col-span-3" />
                  <select value={originFilter} onChange={(event) => setOriginFilter(event.target.value as 'all' | SynthesisEvidenceOrigin)} className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm text-stone-100 outline-none focus:border-fuchsia-200/50">
                    <option value="all">全部来源</option>
                    <option value="corroboration">互证草稿</option>
                    <option value="causation">因果草稿</option>
                    <option value="periodization">分期草稿</option>
                    <option value="perspectives">多视角草稿</option>
                    <option value="contextualization">情境化草稿</option>
                    <option value="significance">意义草稿</option>
                    <option value="mission-work">任务草稿</option>
                    <option value="workspace">跨场景工作区</option>
                  </select>
                  <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm text-stone-100 outline-none focus:border-fuchsia-200/50 sm:col-span-2">
                    <option value="all">全部标签</option>
                    {tagOptions.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
                  </select>
                </div>
                <p className="mt-2 text-xs text-stone-500">{visibleEvidence.length}/{evidencePool.length} 条可用证据。证据池只使用学习者已经产生或勾选的本机工作。</p>
                <div className="mt-4 max-h-[780px] space-y-3 overflow-y-auto pr-1">
                  {visibleEvidence.length ? visibleEvidence.map((entry) => {
                    const isSelected = currentDraft.evidenceIds.includes(entry.id)
                    return (
                      <article key={entry.id} className={`rounded-2xl border p-3 transition ${isSelected ? 'border-amber-200/35 bg-amber-100/[0.07]' : 'border-white/10 bg-white/[0.025]'}`}>
                        <div className="flex items-start gap-3">
                          <input type="checkbox" checked={isSelected} onChange={() => toggleEvidence(entry.id)} className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                              <span className="rounded-full border border-fuchsia-200/20 bg-fuchsia-100/[0.06] px-2 py-0.5 text-fuchsia-100">{getSynthesisEvidenceOriginLabel(entry)}</span>
                              {entry.scenarioTitle ? <span>{entry.scenarioTitle}</span> : null}
                            </div>
                            <h4 className="mt-2 font-semibold text-stone-100">{entry.title}</h4>
                            <p className="mt-2 text-sm leading-6 text-stone-400">{entry.text}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {entry.tags.slice(0, 6).map((tag) => <Tag key={`${entry.id}-${tag}`}>{tag}</Tag>)}
                              {entry.scenarioId ? <button type="button" onClick={() => onOpenScenario(entry.scenarioId!, sectionIds.sceneReader)} className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-fuchsia-200/30 hover:text-fuchsia-100">打开场景</button> : null}
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  }) : <p className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-sm leading-6 text-stone-500">还没有可综合的学习者工作。先在互证、因果、分期、多视角、情境化、历史意义、任务板或工作区保存草稿。</p>}
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4" aria-labelledby="synthesis-draft-title">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 id="synthesis-draft-title" className="font-semibold text-stone-50">Writing draft / 综合写作草稿</h3>
                    <p className="mt-1 text-xs text-stone-500">{currentDraft.updatedAt ? `已保存：${new Date(currentDraft.updatedAt).toLocaleString()}` : '本机保存，受限时回退 sessionStorage。'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={buildThesisStarter} className="rounded-full border border-amber-200/20 px-3 py-1 text-xs font-semibold text-amber-100 transition hover:bg-amber-100/[0.08]">生成 thesis starter</button>
                    <button type="button" onClick={clearDraft} className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-400 transition hover:border-fuchsia-200/30 hover:text-fuchsia-100">清空</button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {([
                    ['drivingQuestion', 'driving question / 核心问题', selectedPreset.drivingQuestion],
                    ['workingThesis', 'working thesis / 工作论文', '写出一条可争辩、可被证据支撑、范围明确的历史主张。'],
                    ['claimScope', 'claim scope / 论证范围', selectedPreset.claimScope],
                    ['reasoningBridge', 'reasoning bridge / 推理桥', '说明证据如何从“材料”变成“支持主张的理由”。'],
                    ['counterargument', 'counterargument / 反驳或替代解释', '最强的反例、反驳或替代解释是什么？你如何回应？'],
                    ['sourceLimits', 'source limits / 来源限制', '哪些声音、场景或材料缺席？这如何影响信心等级？'],
                    ['paragraphPlan', 'paragraph plan / 段落计划', selectedPreset.paragraphFrame.map((item, index) => `${index + 1}. ${item}`).join('\n')],
                    ['significanceLink', 'significance link / 历史意义连接', '这份综合论证为什么重要？它改变了我们对哪些人、过程或记忆的理解？'],
                    ['revisionChecklist', 'revision checklist / 修订清单', '列出下一轮要检查的证据、逻辑、反驳和来源限制。'],
                  ] as [keyof Omit<SynthesisDraft, 'confidence' | 'evidenceIds' | 'updatedAt'>, string, string][]).map(([field, label, placeholder]) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">{label}</span>
                      <textarea value={currentDraft[field]} onChange={(event) => updateDraft({ [field]: event.target.value })} rows={field === 'paragraphPlan' || field === 'revisionChecklist' ? 4 : field === 'workingThesis' || field === 'reasoningBridge' || field === 'sourceLimits' ? 3 : 2} placeholder={placeholder} className="w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-fuchsia-200/50" />
                    </label>
                  ))}
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">confidence / 信心等级</span>
                    <select value={currentDraft.confidence} onChange={(event) => updateDraft({ confidence: event.target.value as SynthesisConfidence })} className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-fuchsia-200/50">
                      {(Object.entries(synthesisConfidenceLabels) as [SynthesisConfidence, string][]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                </div>
                <p className="mt-3 text-sm text-stone-500" aria-live="polite">{copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : 'Synthesis Brief 会优先导出已选证据；若未勾选，则导出证据池前 12 条。'}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function TaskModulesPanel({
  progressState,
  onUpdateProgressState,
  onLaunchAction,
}: {
  progressState: TaskModuleProgressState
  onUpdateProgressState: Dispatch<SetStateAction<TaskModuleProgressState>>
  onLaunchAction: (action: TaskModuleAction) => void
}) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const stats = getTaskModuleProgressStats(progressState)

  function toggleStep(moduleId: string, stepId: string) {
    onUpdateProgressState((currentState) => {
      const currentModuleProgress = currentState[moduleId] ?? []
      const nextModuleProgress = currentModuleProgress.includes(stepId)
        ? currentModuleProgress.filter((candidate) => candidate !== stepId)
        : [...currentModuleProgress, stepId]

      return {
        ...currentState,
        [moduleId]: nextModuleProgress,
      }
    })
  }

  async function copyModule(module: TaskModule) {
    try {
      await copyTextToClipboard(formatTaskModuleSheet(module, progressState[module.id] ?? []))
      setCopyStatus(module.id)
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="task-modules" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="task-modules-title">
      <div className="rounded-[2rem] border border-emerald-200/15 bg-emerald-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-emerald-100">
          <ClipboardList size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">tasks learning modules / 单元模块</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="task-modules-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              单元模块 / Learning Modules
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              6 个跨页面 learning modules 串联 Scenario、Atlas、Evidence、Labs 与 Synthesis。勾选进度优先保存在 localStorage，受限时回退 sessionStorage。
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-100">
            {stats.startedCount}/{taskModules.length} started · {stats.completedCount} completed · {stats.checkedStepCount}/{stats.totalStepCount} steps
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {taskModules.map((module) => {
            const checkedStepIds = progressState[module.id] ?? []
            const completedSteps = module.steps.filter((step) => checkedStepIds.includes(step.id)).length
            const percent = Math.round((completedSteps / module.steps.length) * 100)
            const moduleScenarios = module.scenarioIds.map((id) => getScenarioById(id)).filter((scenario): scenario is Scenario => Boolean(scenario))

            return (
              <article key={module.id} className="flex min-h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                <div className="h-1.5 bg-gradient-to-r from-emerald-300 via-amber-300 to-fuchsia-300" style={{ width: `${Math.max(percent, 4)}%` }} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                        <span className="rounded-full border border-emerald-200/20 bg-emerald-100/[0.06] px-3 py-1 text-emerald-100">{module.totalMinutes} min</span>
                        <span>{completedSteps}/{module.steps.length} steps</span>
                        <span>{module.scenarioIds.length} scenarios</span>
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-stone-50">{module.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-400">{module.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onLaunchAction(module.steps[0].action)}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
                    >
                      开始模块
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="mt-4 rounded-3xl border border-emerald-200/15 bg-emerald-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                    <span className="font-semibold text-emerald-100">Driving question：</span>{module.drivingQuestion}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {module.tags.map((tag) => <Tag key={`${module.id}-${tag}`}>{tag}</Tag>)}
                  </div>

                  <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.025] p-4">
                    <h4 className="font-semibold text-stone-50">Scenario path</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {moduleScenarios.map((scenario) => (
                        <button key={scenario.id} type="button" onClick={() => onLaunchAction({ type: 'scenario', scenarioId: scenario.id, hash: sectionIds.sceneReader })} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold text-stone-300 transition hover:border-emerald-200/30 hover:text-emerald-100">
                          {scenario.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {module.steps.map((step, index) => {
                      const isChecked = checkedStepIds.includes(step.id)

                      return (
                        <label key={`${module.id}-${step.id}`} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-sm leading-6 text-stone-400 transition hover:border-emerald-100/25">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleStep(module.id, step.id)}
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-emerald-300 focus:ring-emerald-200"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-stone-100">{index + 1}. {step.title} · {step.minutes}m</span>
                            <span className="block">{step.description}</span>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault()
                                onLaunchAction(step.action)
                              }}
                              className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-200/20 bg-emerald-100/[0.06] px-3 py-1 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-100/[0.12]"
                            >
                              {step.actionLabel}
                              <ArrowRight size={13} />
                            </button>
                          </span>
                        </label>
                      )
                    })}
                  </div>

                  <div className="mt-4 rounded-3xl border border-teal-200/15 bg-teal-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                    <span className="font-semibold text-teal-100">最终交付物：</span>{module.finalDeliverable}
                  </div>

                  <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-stone-500" aria-live="polite">
                      {copyStatus === module.id ? '模块学习单已复制。' : copyStatus === 'failed' ? '复制失败，请检查剪贴板权限。' : '复制会包含步骤勾选、跳转目标、场景路径与交付物。'}
                    </p>
                    <button
                      type="button"
                      onClick={() => void copyModule(module)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-100/[0.08] px-5 py-3 font-semibold text-emerald-100 transition hover:bg-emerald-100/[0.14]"
                    >
                      {copyStatus === module.id ? <Check size={18} /> : <Copy size={18} />}
                      {copyStatus === module.id ? '模块学习单已复制' : '复制 / 导出模块学习单'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PortfolioPanel({
  completedMissionIdsByScenario,
  missionWorkState,
  workspaceState,
  workspaceStats,
  taskModuleStats,
  taskModuleProgressState,
  assignmentBuilderDraft,
  assignmentLibraryTasks,
  corroborationDraftState,
  causationDraftState,
  periodizationDraftState,
  perspectivesDraftState,
  contextDraftState,
  significanceDraftState,
  synthesisDraftState,
  caseFileDraftState,
  compareDraftState,
  actorNetworkDraftState,
  taskWorkbenchDraftState,
}: {
  completedMissionIdsByScenario: Record<string, string[]>
  missionWorkState: MissionWorkState
  workspaceState: WorkspaceState
  workspaceStats: WorkspaceStats
  taskModuleStats: ReturnType<typeof getTaskModuleProgressStats>
  taskModuleProgressState: TaskModuleProgressState
  assignmentBuilderDraft: AssignmentBuilderDraft
  assignmentLibraryTasks: LibraryTask[]
  corroborationDraftState: CorroborationDraftState
  causationDraftState: CausationDraftState
  periodizationDraftState: PeriodizationDraftState
  perspectivesDraftState: PerspectivesDraftState
  contextDraftState: ContextDraftState
  significanceDraftState: SignificanceDraftState
  synthesisDraftState: SynthesisDraftState
  caseFileDraftState: EvidenceCaseFileDraftState
  compareDraftState: CompareDraftState
  actorNetworkDraftState: ActorNetworkDraftState
  taskWorkbenchDraftState: TaskWorkbenchState
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const completedCount = getTotalCompletedMissions(completedMissionIdsByScenario)
  const draftCount = scenarios.reduce((count, scenario) => count + countScenarioMissionWork(scenario, missionWorkState), 0)
  const corroborationDraftCount = getActiveCorroborationDrafts(corroborationDraftState).length
  const causationDraftCount = getActiveCausationDrafts(causationDraftState).length
  const periodizationDraftCount = getActivePeriodizationDrafts(periodizationDraftState).length
  const perspectivesDraftCount = getActivePerspectivesDrafts(perspectivesDraftState).length
  const contextDraftCount = getActiveContextDrafts(contextDraftState).length
  const significanceDraftCount = getActiveSignificanceDrafts(significanceDraftState).length
  const synthesisDraftCount = getActiveSynthesisDrafts(synthesisDraftState).length
  const caseFileDraftCount = getActiveEvidenceCaseFileDrafts(caseFileDraftState).length
  const compareDraftCount = getActiveCompareDrafts(compareDraftState).length
  const actorNetworkDraftCount = getActiveActorNetworkDrafts(actorNetworkDraftState).length
  const assignmentSummary = getAssignmentBuilderSummary(assignmentBuilderDraft, assignmentLibraryTasks)
  const taskWorkbenchStats = getTaskWorkbenchStats(taskWorkbenchDraftState)
  const libraryTasksById = new Map(assignmentLibraryTasks.map((task) => [task.id, task]))
  const activeScenarioCount = scenarios.filter((scenario) => {
    const hasCompleted = (completedMissionIdsByScenario[scenario.id] ?? []).length > 0
    const hasDraft = countScenarioMissionWork(scenario, missionWorkState) > 0

    return hasCompleted || hasDraft
  }).length
  const recentEntries = Object.entries(missionWorkState)
    .filter(([, work]) => work.notes.trim() || work.checkedEvidence.length)
    .sort(([, first], [, second]) => (second.updatedAt ?? '').localeCompare(first.updatedAt ?? ''))
    .slice(0, 3)
  const recentCompareDrafts = getActiveCompareDrafts(compareDraftState)
    .sort(([, first], [, second]) => (second.updatedAt ?? '').localeCompare(first.updatedAt ?? ''))
    .slice(0, 3)
  const recentWorkbenchDrafts = taskWorkbenchStats.recentDrafts.slice(0, 3)
  const recentActorNetworkDrafts = getActiveActorNetworkDrafts(actorNetworkDraftState)
    .sort(([, first], [, second]) => (second.updatedAt ?? '').localeCompare(first.updatedAt ?? ''))
    .slice(0, 3)

  async function copyArchive() {
    try {
      await copyTextToClipboard(formatLearningArchive(missionWorkState, completedMissionIdsByScenario, workspaceState, corroborationDraftState, causationDraftState, periodizationDraftState, perspectivesDraftState, contextDraftState, significanceDraftState, synthesisDraftState, caseFileDraftState, compareDraftState, actorNetworkDraftState, taskModuleProgressState, assignmentBuilderDraft, assignmentLibraryTasks, taskWorkbenchDraftState))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="portfolio" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="portfolio-title">
      <div className="grid gap-4 rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-5 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <div className="mb-4 flex items-center gap-3 text-teal-100">
            <LibraryBig size={20} />
            <span className="text-sm uppercase tracking-[0.3em]">learning portfolio</span>
          </div>
          <h2 id="portfolio-title" className="text-3xl font-semibold tracking-tight text-stone-50">
            学习档案袋
          </h2>
          <p className="mt-3 leading-7 text-stone-400">
            汇总所有身份与跨场景工作区中的草稿、证据勾选和完成记录，便于课堂提交或阶段复盘。
          </p>
          <button
            type="button"
            onClick={() => void copyArchive()}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
          >
            {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
            {copyStatus === 'copied' ? '学习档案已复制' : copyStatus === 'failed' ? '复制失败' : '复制全部学习档案'}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '已完成', value: completedCount },
              { label: '有草稿', value: draftCount },
              { label: '已触达身份', value: activeScenarioCount },
              { label: '跨场景条目', value: workspaceStats.totalEntries },
              { label: '跨场景完成', value: workspaceStats.completedEntries },
              { label: '互证草稿', value: corroborationDraftCount },
              { label: '因果草稿', value: causationDraftCount },
              { label: '分期草稿', value: periodizationDraftCount },
              { label: '多视角草稿', value: perspectivesDraftCount },
              { label: '情境化草稿', value: contextDraftCount },
              { label: '意义草稿', value: significanceDraftCount },
              { label: '综合论证', value: synthesisDraftCount },
              { label: 'Case Files', value: caseFileDraftCount },
              { label: '比较草稿', value: compareDraftCount },
              { label: '人物网络', value: actorNetworkDraftCount },
              { label: '任务组合', value: assignmentSummary.selectedTasks.length },
              { label: '组合分钟', value: assignmentSummary.totalMinutes },
              { label: '执行台草稿', value: taskWorkbenchStats.activeCount },
              { label: '执行台完成', value: taskWorkbenchStats.completedCount },
              { label: '模块开始', value: taskModuleStats.startedCount },
              { label: '模块完成', value: taskModuleStats.completedCount },
              { label: '模块步骤', value: taskModuleStats.checkedStepCount },
              { label: '跨场景勾选', value: workspaceStats.checkedEvidenceCount },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-black/20 p-4 text-center">
                <div className="text-3xl font-semibold text-teal-100">{item.value}</div>
                <div className="mt-1 text-xs text-stone-500">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h3 className="font-semibold text-stone-50">最近草稿 / 工作区</h3>
            {recentEntries.length > 0 || workspaceStats.recentEntries.length > 0 || taskModuleStats.details.length > 0 || recentCompareDrafts.length > 0 || recentActorNetworkDrafts.length > 0 || recentWorkbenchDrafts.length > 0 || assignmentSummary.selectedTasks.length > 0 ? (
              <div className="mt-3 space-y-2">
                {assignmentSummary.selectedTasks.length > 0 ? (
                  <div className="rounded-2xl border border-amber-200/15 bg-amber-100/[0.045] p-3 text-sm leading-6 text-stone-400">
                    <div className="font-medium text-stone-100">{assignmentBuilderDraft.title || '任务组合'}</div>
                    <div>Assignment Builder · {assignmentSummary.selectedTasks.length} tasks · {assignmentSummary.totalMinutes} 分钟 · {assignmentBuilderDraft.updatedAt ? new Date(assignmentBuilderDraft.updatedAt).toLocaleString() : '未记录时间'}</div>
                    <div className="mt-1 text-stone-500">{assignmentSummary.selectedTasks.map((task) => task.title).join(' → ')}</div>
                  </div>
                ) : null}
                {recentWorkbenchDrafts.map(([taskId, draft]) => {
                  const task = libraryTasksById.get(taskId)
                  const checklist = task ? getTaskWorkbenchChecklist(task) : []
                  const checkedCount = checklist.filter((_, index) => draft.checkedPromptIds.includes(`checklist:${index}`)).length

                  return (
                    <div key={taskId} className="rounded-2xl border border-emerald-200/15 bg-emerald-100/[0.045] p-3 text-sm leading-6 text-stone-400">
                      <div className="font-medium text-stone-100">{task?.title ?? taskId}</div>
                      <div>Tasks Workbench · {draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'} · {draft.completed ? '已完成' : '草稿'} · {checkedCount}/{checklist.length} checklist</div>
                      <div className="mt-1 text-stone-500">{draft.claimExplanation.trim() || draft.evidenceNotes.trim() || '尚未填写 claim 或 evidence notes'}</div>
                    </div>
                  )
                })}
                {recentActorNetworkDrafts.map(([key, draft]) => {
                  const [scenarioId, encounterId] = key.split(':')
                  const scenario = getScenarioById(scenarioId)
                  const encounter = scenario?.socialEncounters.find((candidate) => candidate.id === encounterId)

                  return (
                    <div key={key} className="rounded-2xl border border-teal-200/15 bg-teal-100/[0.045] p-3 text-sm leading-6 text-stone-400">
                      <div className="font-medium text-stone-100">{encounter?.title ?? key}</div>
                      <div>Actor Network · {scenario?.title ?? scenarioId} · {draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'} · {draft.completed ? '已完成' : '草稿'}</div>
                      <div className="mt-1 text-stone-500">{draft.negotiationPlan.trim() || draft.perspectiveComparison.trim() || '尚未填写协商方案'}</div>
                    </div>
                  )
                })}
                {workspaceStats.recentEntries.map(({ key, title, category, entry }) => (
                  <div key={key} className="rounded-2xl border border-orange-200/15 bg-orange-100/[0.045] p-3 text-sm leading-6 text-stone-400">
                    <div className="font-medium text-stone-100">{title}</div>
                    <div>{category} · {entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : '未记录时间'} · {entry.completed ? '已完成' : '草稿'}</div>
                  </div>
                ))}
                {taskModuleStats.details.slice(0, 3).map(({ module, completedSteps, totalSteps, isComplete }) => (
                  <div key={module.id} className="rounded-2xl border border-emerald-200/15 bg-emerald-100/[0.045] p-3 text-sm leading-6 text-stone-400">
                    <div className="font-medium text-stone-100">{module.title}</div>
                    <div>单元模块 · {isComplete ? '已完成' : '进行中'} · {completedSteps}/{totalSteps} steps</div>
                  </div>
                ))}
                {recentCompareDrafts.map(([key, draft]) => {
                  const scenarioA = getScenarioById(draft.scenarioAId)
                  const scenarioB = getScenarioById(draft.scenarioBId)
                  const lens = getCompareLensByKey(draft.lensKey)

                  return (
                    <div key={key} className="rounded-2xl border border-fuchsia-200/15 bg-fuchsia-100/[0.045] p-3 text-sm leading-6 text-stone-400">
                      <div className="font-medium text-stone-100">{lens.title}：{scenarioA?.title ?? draft.scenarioAId} × {scenarioB?.title ?? draft.scenarioBId}</div>
                      <div>Compare Lab · {draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'} · {draft.selectedEvidenceIdsA.length + draft.selectedEvidenceIdsB.length} 条证据</div>
                    </div>
                  )
                })}
                {recentEntries.map(([key, work]) => {
                  const [scenarioId, missionId] = key.split(':')
                  const scenario = getScenarioById(scenarioId)
                  const mission = scenario?.missions.find((candidate) => candidate.id === missionId)

                  return (
                    <div key={key} className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-stone-400">
                      <div className="font-medium text-stone-100">{mission?.title ?? '未知任务'}</div>
                      <div>{scenario?.title ?? '未知身份'} · {work.updatedAt ? new Date(work.updatedAt).toLocaleString() : '未记录时间'}</div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-stone-500">还没有草稿。进入任一历史任务或跨场景工作区后写下第一条证据即可生成档案。</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}


function LearningCoachPanel({
  recommendations,
  snapshot,
}: {
  recommendations: LearningCoachRecommendation[]
  snapshot: LearningCoachPlanSnapshot
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  async function copyPlan() {
    try {
      await copyTextToClipboard(formatLearningCoachPlan(recommendations, snapshot))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section className="mb-5 rounded-[1.75rem] border border-teal-200/20 bg-teal-100/[0.055] p-4" aria-labelledby="learning-coach-title">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-teal-100">
            <Compass size={18} /> learning coach
          </div>
          <h3 id="learning-coach-title" className="mt-2 text-2xl font-semibold tracking-tight text-stone-50">下一步建议</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-400">
            基于当前浏览器里的任务、Lab、Compare 与工作区草稿即时派生；不新增历史场景、不写入后端，也不会创建新的 Tasks 子页面。
          </p>
        </div>
        <button
          type="button"
          onClick={() => void copyPlan()}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
        >
          {copyStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}
          {copyStatus === 'copied' ? '学习计划已复制' : copyStatus === 'failed' ? '复制失败' : '复制学习计划'}
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
        {recommendations.slice(0, 4).map((recommendation) => (
          <article key={recommendation.id} className="flex min-h-full flex-col rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500">
              <span className="rounded-full border border-teal-200/20 bg-teal-100/[0.06] px-3 py-1 text-teal-100">{recommendation.typeLabel}</span>
              <span>{recommendation.estimatedMinutes} min</span>
            </div>
            <h4 className="mt-3 text-base font-semibold leading-6 text-stone-50">{recommendation.title}</h4>
            <p className="mt-2 text-sm leading-6 text-stone-400">{recommendation.reason}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {recommendation.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-stone-300">{tag}</span>
              ))}
            </div>
            <button
              type="button"
              onClick={recommendation.action}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
            >
              <ArrowRight size={16} />
              {recommendation.ctaLabel}
            </button>
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-stone-500" aria-live="polite">
        {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : `计划包含 ${recommendations.length} 条建议，最多显示 4 条。`}
      </p>
    </section>
  )
}

function TaskDiscoveryPanel({
  learningCoachRecommendations,
  learningCoachSnapshot,
  onOpenLibraryPreset,
  onOpenScenario,
  onLoadCompare,
  onLoadCompareLens,
  onLoadCausationInquiry,
  onLoadPeriodizationInquiry,
  onLoadPerspectivesInquiry,
  onLoadContextInquiry,
  onLoadSignificanceInquiry,
  onLoadSynthesisPreset,
  onOpenEvidenceCaseFile,
  onOpenDebateStudio,
  onStartTask,
}: {
  learningCoachRecommendations: LearningCoachRecommendation[]
  learningCoachSnapshot: LearningCoachPlanSnapshot
  onOpenLibraryPreset: (preset: TaskLibraryPreset) => void
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
  onLoadCompare: (path: AtlasInquiryPath | AtlasMapRoute) => void
  onLoadCompareLens: (lens: CompareLens) => void
  onLoadCausationInquiry: (inquiryId: string) => void
  onLoadPeriodizationInquiry: (inquiryId: string) => void
  onLoadPerspectivesInquiry: (inquiryId: string) => void
  onLoadContextInquiry: (inquiryId: string) => void
  onLoadSignificanceInquiry: (inquiryId: string) => void
  onLoadSynthesisPreset: (presetId: string) => void
  onOpenEvidenceCaseFile?: (caseFileId: string) => void
  onOpenDebateStudio: (scenarioId: string) => void
  onStartTask: (taskId: string) => void
}) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const libraryTasks = useMemo(
    () => buildTaskLibraryTasks({ onOpenScenario, onLoadCompare, onLoadCompareLens, onLoadCausationInquiry, onLoadPeriodizationInquiry, onLoadPerspectivesInquiry, onLoadContextInquiry, onLoadSignificanceInquiry, onLoadSynthesisPreset, onOpenEvidenceCaseFile, onOpenDebateStudio, onStartTask }),
    [onOpenScenario, onLoadCompare, onLoadCompareLens, onLoadCausationInquiry, onLoadPeriodizationInquiry, onLoadPerspectivesInquiry, onLoadContextInquiry, onLoadSignificanceInquiry, onLoadSynthesisPreset, onOpenEvidenceCaseFile, onOpenDebateStudio, onStartTask],
  )
  const collections = useMemo(getTaskDiscoveryCollections, [])
  const featuredRoute = atlasMapRoutes.find((route) => route.id === 'sugar-cotton-empire-route')
  const featuredRouteTasks = featuredRoute
    ? libraryTasks.filter((task) => featuredRoute.tags.some((tag) => task.searchText.includes(tag.toLowerCase())) || taskMatchesAny(task, ['commodity', 'labor', 'labour', 'archive silence', 'source silence', '商品链', '劳动', '来源沉默', '档案沉默']))
    : []

  async function copyFirstTask(collection: TaskDiscoveryCollection, matchingTasks: LibraryTask[]) {
    const firstTask = matchingTasks[0]

    if (!firstTask) {
      return
    }

    try {
      await copyTextToClipboard(firstTask.formatSheet())
      setCopyStatus(collection.id)
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="task-discovery" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="task-discovery-title">
      <div className="rounded-[2rem] border border-amber-200/15 bg-amber-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-amber-100">
          <Sparkles size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">tasks discovery launcher</span>
        </div>
        <LearningCoachPanel recommendations={learningCoachRecommendations} snapshot={learningCoachSnapshot} />

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <h2 id="task-discovery-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Tasks Discovery Launcher / 先按学习目标找任务
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              不必先知道模块名。这里把 Task Library 的现有任务重新策展成学习目标、时间盒和历史思维集合；点击集合会带着 preset 进入任务库并自动套用筛选。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-400">
            <div className="font-semibold text-amber-100">Discovery index</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <span className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">{collections.length}<br />collections</span>
              <span className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">{libraryTasks.length}<br />tasks</span>
              <span className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">{libraryTasks.filter((task) => task.sourceBased).length}<br />source-based</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {collections.map((collection) => {
            const matchingTasks = getMatchingTasksForPreset(libraryTasks, collection)
            const firstTask = matchingTasks[0]

            return (
              <article key={collection.id} className="flex min-h-full flex-col rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                  <span className="rounded-full border border-amber-200/20 bg-amber-100/[0.06] px-3 py-1 text-amber-100">{collection.id}</span>
                  <span>{collection.duration}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-stone-50">{collection.label}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-300">{collection.reason}</p>
                <div className="mt-4 space-y-2 text-sm leading-6 text-stone-400">
                  <p><span className="font-semibold text-stone-200">Audience：</span>{collection.audience}</p>
                  <p><span className="font-semibold text-stone-200">Duration：</span>{collection.duration}</p>
                  <p><span className="font-semibold text-stone-200">Matching tasks：</span>{matchingTasks.length}</p>
                </div>
                <div className="mt-auto flex flex-col gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => onOpenLibraryPreset(collection)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
                  >
                    <LibraryBig size={16} />
                    在任务库查看匹配任务
                  </button>
                  {collection.secondaryAction === 'open-first' && firstTask?.onPrimaryAction ? (
                    <button
                      type="button"
                      onClick={firstTask.onPrimaryAction}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/[0.08]"
                    >
                      <ArrowRight size={16} />
                      打开第一个匹配任务
                    </button>
                  ) : null}
                  {firstTask ? (
                    <button
                      type="button"
                      onClick={() => onStartTask(firstTask.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-100/[0.08] px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-100/[0.14]"
                    >
                      <ClipboardList size={16} />
                      开始首个任务
                    </button>
                  ) : null}
                  {collection.secondaryAction === 'copy-first' ? (
                    <button
                      type="button"
                      onClick={() => void copyFirstTask(collection, matchingTasks)}
                      disabled={!firstTask}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200/25 bg-sky-100/[0.08] px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-100/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {copyStatus === collection.id ? <Check size={16} /> : <Copy size={16} />}
                      {copyStatus === collection.id ? '已复制首个任务单' : '复制首个任务单'}
                    </button>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>

        {featuredRoute ? (
          <article className="mt-6 overflow-hidden rounded-[1.75rem] border border-emerald-200/15 bg-emerald-100/[0.045]">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-emerald-100">
                  <Route size={18} /> featured route module
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-50">商品链、劳动与档案沉默</h3>
                <p className="mt-3 text-sm leading-6 text-stone-400">
                  连接现有 Atlas route「{featuredRoute.title}」、Task Library 中的劳动/商品链任务，以及 Synthesis Studio 的「商品链与劳动」「档案沉默与历史意义」综合写作预设。
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredRoute.tags.map((tag) => <span key={tag} className="rounded-full border border-emerald-200/20 bg-emerald-100/[0.06] px-3 py-1 text-xs text-emerald-100">{tag}</span>)}
                </div>
              </div>
              <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0">
                <p className="text-sm leading-6 text-stone-300"><span className="font-semibold text-emerald-100">Route question：</span>{featuredRoute.routeQuestion}</p>
                <p className="mt-3 text-sm leading-6 text-stone-500">Discovery match：{featuredRouteTasks.length} 个相关任务 · {featuredRoute.scenarioIds.length} 个 Atlas stops · 可延伸到 Labs/Synthesis。</p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => onLoadCompare(featuredRoute)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-100/[0.08] px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-100/[0.14]"
                  >
                    <Scale size={16} />
                    载入 Atlas Compare
                  </button>
                  <button
                    type="button"
                    onClick={() => onLoadSynthesisPreset('commodity-chains-labor')}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/[0.08]"
                  >
                    <ScrollText size={16} />
                    商品链综合写作
                  </button>
                  <button
                    type="button"
                    onClick={() => onLoadSynthesisPreset('archive-silence-significance')}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/[0.08]"
                  >
                    <ShieldAlert size={16} />
                    档案沉默综合写作
                  </button>
                </div>
              </div>
            </div>
          </article>
        ) : null}

        <p className="mt-3 text-sm text-stone-500" aria-live="polite">
          {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : '集合不会创建新 scenario schema；它只复用现有任务库、Atlas route 与 Labs/Synthesis 入口。'}
        </p>
      </div>
    </section>
  )
}


function DebateStudioPanel({ initialScenarioId }: { initialScenarioId: string }) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(initialScenarioId)
  const [selectedMode, setSelectedMode] = useState<DebateMode>('decision-hearing')
  const [selectedDuration, setSelectedDuration] = useState<DebateDuration>(30)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'student' | 'teacher' | 'failed'>('idle')

  useEffect(() => {
    setSelectedScenarioId(initialScenarioId)
    setCopyStatus('idle')
  }, [initialScenarioId])

  const scenario = getScenarioById(selectedScenarioId) ?? scenarios[0]
  const roleCards = buildDebateRoleCards(scenario, selectedMode)
  const evidenceCards = buildDebateEvidenceCards(scenario)
  const roundPlan = buildDebateRounds(selectedMode, selectedDuration)
  const totalRoundMinutes = roundPlan.reduce((total, round) => total + round.minutes, 0)
  const sourceCount = evidenceCards.filter((card) => card.id.startsWith('source:')).length
  const sceneCount = evidenceCards.filter((card) => card.id.startsWith('scene:')).length

  async function copyDebate(kind: 'student' | 'teacher') {
    try {
      await copyTextToClipboard(kind === 'student'
        ? formatDebateStudentWorksheet(scenario, selectedMode, selectedDuration)
        : formatDebateTeacherGuide(scenario, selectedMode, selectedDuration))
      setCopyStatus(kind)
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="debate-studio" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="debate-studio-title">
      <div className="rounded-[2rem] border border-fuchsia-200/15 bg-fuchsia-100/[0.04] p-5">
        <div className="mb-4 flex items-center gap-3 text-fuchsia-100">
          <Users size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">tasks debate & roleplay studio</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <h2 id="debate-studio-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Debate & Roleplay Studio / 辩论工作台
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              从现有 lessonPack discussion roles、历史岔路选项、sources、scene beats、真实历史与解释边界生成紧凑辩论流程；不新增 scenario schema。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: '角色卡', value: roleCards.length },
              { label: '证据卡', value: evidenceCards.length },
              { label: '来源', value: sourceCount },
              { label: '回合分钟', value: totalRoundMinutes },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-black/20 p-4 text-center">
                <div className="text-2xl font-semibold text-fuchsia-100">{item.value}</div>
                <div className="mt-1 text-xs text-stone-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">1. 设置辩论 / Setup</h3>
              <div className="mt-4 grid gap-3">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">场景</span>
                  <select
                    value={scenario.id}
                    onChange={(event) => setSelectedScenarioId(event.target.value)}
                    className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-fuchsia-200/60"
                  >
                    {scenarios.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.title}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">模式</span>
                  <select
                    value={selectedMode}
                    onChange={(event) => setSelectedMode(event.target.value as DebateMode)}
                    className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-fuchsia-200/60"
                  >
                    {(Object.keys(debateModeLabels) as DebateMode[]).map((mode) => <option key={mode} value={mode}>{debateModeLabels[mode]}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">时长</span>
                  <select
                    value={selectedDuration}
                    onChange={(event) => setSelectedDuration(Number(event.target.value) as DebateDuration)}
                    className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-fuchsia-200/60"
                  >
                    <option value={15}>15 分钟</option>
                    <option value={30}>30 分钟</option>
                    <option value={45}>45 分钟</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-amber-200/15 bg-amber-100/[0.045] p-4">
              <h3 className="text-xl font-semibold text-amber-100">2. Debate prompt</h3>
              <p className="mt-3 text-lg leading-8 text-stone-100">{scenario.decision.prompt}</p>
              <p className="mt-3 text-sm leading-6 text-stone-400">{scenario.decision.context}</p>
              <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-stone-400">
                <span className="font-semibold text-fuchsia-100">模式目标：</span>{debateModeDescriptions[selectedMode]}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">3. 复制 / Export</h3>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={() => void copyDebate('student')} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200">
                  {copyStatus === 'student' ? <Check size={16} /> : <Copy size={16} />}
                  {copyStatus === 'student' ? '学生工作纸已复制' : '复制学生工作纸'}
                </button>
                <button type="button" onClick={() => void copyDebate('teacher')} className="inline-flex items-center justify-center gap-2 rounded-full border border-fuchsia-200/25 bg-fuchsia-100/[0.08] px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-100/[0.14]">
                  {copyStatus === 'teacher' ? <Check size={16} /> : <Copy size={16} />}
                  {copyStatus === 'teacher' ? '教师指南已复制' : '复制教师指南'}
                </button>
              </div>
              <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : `${selectedDuration} 分钟 · ${roleCards.length} 张角色卡 · ${evidenceCards.length} 张证据卡（${sceneCount} scene beats）`}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">Role cards / 角色卡</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {roleCards.map((role) => (
                  <article key={`${role.title}-${role.stance}`} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-fuchsia-100">{role.stance}</div>
                    <h4 className="mt-2 font-semibold text-stone-50">{role.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{role.brief}</p>
                    <p className="mt-2 text-xs leading-5 text-stone-500">{role.speakingMove}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-teal-200/15 bg-teal-100/[0.04] p-4">
              <h3 className="text-xl font-semibold text-teal-100">Evidence cards / 证据卡</h3>
              <div className="mt-4 grid max-h-[34rem] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                {evidenceCards.map((card) => (
                  <article key={card.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-stone-500">{card.sourceLabel}</div>
                    <h4 className="mt-2 font-semibold leading-6 text-stone-50">{card.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-stone-300">{card.claimUse}</p>
                    <p className="mt-2 text-xs leading-5 text-stone-500">边界：{card.reliabilityNote}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {card.tags.slice(0, 5).map((tag) => <Tag key={`${card.id}-${tag}`}>{tag}</Tag>)}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">Round plan / 回合计划</h3>
              <div className="mt-4 space-y-3">
                {roundPlan.map((round, index) => (
                  <article key={round.title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                      <span className="rounded-full border border-fuchsia-200/20 bg-fuchsia-100/[0.06] px-3 py-1 text-fuchsia-100">Round {index + 1}</span>
                      <span>{round.minutes}m</span>
                    </div>
                    <h4 className="mt-2 font-semibold text-stone-50">{round.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-stone-400"><span className="font-semibold text-amber-100">Teacher：</span>{round.teacherMove}</p>
                    <p className="mt-1 text-sm leading-6 text-stone-400"><span className="font-semibold text-teal-100">Students：</span>{round.studentMove}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function AssignmentBuilderPanel({
  draft,
  onUpdateDraft,
  libraryTasks,
  onOpenAssessmentStudio,
  onStartTask,
}: {
  draft: AssignmentBuilderDraft
  onUpdateDraft: Dispatch<SetStateAction<AssignmentBuilderDraft>>
  libraryTasks: LibraryTask[]
  onOpenAssessmentStudio: () => void
  onStartTask: (taskId: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState<'all' | TaskLibrarySource>('all')
  const [durationFilter, setDurationFilter] = useState<'all' | DurationBand>('all')
  const [sourceBasedOnly, setSourceBasedOnly] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'student' | 'teacher' | 'pack' | 'failed'>('idle')
  const durationBands = useMemo(() => [...new Set(libraryTasks.map((task) => task.durationBand))], [libraryTasks])
  const selectedTasks = getAssignmentSelectedTasks(draft, libraryTasks)
  const summary = getAssignmentBuilderSummary(draft, libraryTasks)
  const taskPackMatches = useMemo(() => taskPacks.map((pack) => ({ pack, tasks: getTaskPackTasks(pack, libraryTasks) })), [libraryTasks])
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const visibleTasks = useMemo(
    () => libraryTasks.filter((task) => {
      const matchesSearch = !normalizedSearchQuery || task.searchText.includes(normalizedSearchQuery)
      const matchesSource = sourceFilter === 'all' || task.source === sourceFilter
      const matchesDuration = durationFilter === 'all' || task.durationBand === durationFilter
      const matchesSourceBased = !sourceBasedOnly || task.sourceBased

      return matchesSearch && matchesSource && matchesDuration && matchesSourceBased
    }),
    [durationFilter, libraryTasks, normalizedSearchQuery, sourceBasedOnly, sourceFilter],
  )

  function updateDraft(patch: Partial<AssignmentBuilderDraft>) {
    onUpdateDraft((currentDraft) => ({
      ...currentDraft,
      ...patch,
      updatedAt: new Date().toISOString(),
    }))
  }

  function toggleTask(taskId: string) {
    onUpdateDraft((currentDraft) => {
      const isSelected = currentDraft.selectedTaskIds.includes(taskId)
      const selectedTaskIds = isSelected
        ? currentDraft.selectedTaskIds.filter((id) => id !== taskId)
        : currentDraft.selectedTaskIds.length >= 6
          ? currentDraft.selectedTaskIds
          : [...currentDraft.selectedTaskIds, taskId]

      return {
        ...currentDraft,
        selectedTaskIds,
        updatedAt: new Date().toISOString(),
      }
    })
  }

  function moveTask(taskId: string, direction: -1 | 1) {
    onUpdateDraft((currentDraft) => {
      const currentIndex = currentDraft.selectedTaskIds.indexOf(taskId)
      const nextIndex = currentIndex + direction

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentDraft.selectedTaskIds.length) {
        return currentDraft
      }

      const selectedTaskIds = [...currentDraft.selectedTaskIds]
      const [removedTaskId] = selectedTaskIds.splice(currentIndex, 1)
      selectedTaskIds.splice(nextIndex, 0, removedTaskId)

      return {
        ...currentDraft,
        selectedTaskIds,
        updatedAt: new Date().toISOString(),
      }
    })
  }

  async function copyAssignment(kind: 'student' | 'teacher') {
    try {
      await copyTextToClipboard(kind === 'student'
        ? formatAssignmentStudentWorksheet(draft, libraryTasks)
        : formatAssignmentTeacherGuide(draft, libraryTasks))
      setCopyStatus(kind)
    } catch {
      setCopyStatus('failed')
    }
  }

  function loadTaskPack(pack: TaskPack, tasks: LibraryTask[]) {
    onUpdateDraft(buildTaskPackDraft(pack, tasks))
    setCopyStatus('idle')
  }

  async function copyTaskPack(pack: TaskPack, tasks: LibraryTask[]) {
    try {
      await copyTextToClipboard(formatTaskPackSheet(pack, tasks))
      setCopyStatus('pack')
    } catch {
      setCopyStatus('failed')
    }
  }

  function startFirstTaskPackTask(tasks: LibraryTask[]) {
    const firstTask = tasks[0]

    if (firstTask) {
      onStartTask(firstTask.id)
    }
  }

  function clearDraft() {
    onUpdateDraft({
      ...getEmptyAssignmentBuilderDraft(),
      updatedAt: new Date().toISOString(),
    })
    setCopyStatus('idle')
  }

  return (
    <section id="assignment-builder" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="assignment-builder-title">
      <div className="rounded-[2rem] border border-amber-200/15 bg-amber-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-amber-100">
          <ClipboardList size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">assignment builder / 任务组合器 1.0</span>
        </div>
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <h2 id="assignment-builder-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Tasks Assignment Builder / 任务组合器
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              从现有 Task Library 任务中选择最多 6 个，排成课堂任务序列，并复制学生任务单或教师指南。草稿优先保存在 localStorage，受限时回退 sessionStorage。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: '已选任务', value: `${summary.selectedTasks.length}/6` },
              { label: '估算分钟', value: summary.totalMinutes },
              { label: '来源类别', value: summary.sourceCategories.length },
              { label: '场景覆盖', value: summary.scenarioCoverage.length },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-black/20 p-4 text-center">
                <div className="text-2xl font-semibold text-amber-100">{item.value}</div>
                <div className="mt-1 text-xs text-stone-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-sky-200/15 bg-sky-100/[0.045] p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-sky-100">Task Packs / 任务包策展入口</div>
              <h3 className="mt-2 text-xl font-semibold text-stone-50">从策展任务包开始，再进入任务组合器微调</h3>
              <p className="mt-1 text-sm leading-6 text-stone-400">每个任务包从现有 Task Library 可靠匹配最多 6 个任务；载入后会写入当前 Assignment Builder 草稿并自动持久化。</p>
            </div>
            <div className="text-sm text-stone-500" aria-live="polite">{copyStatus === 'pack' ? '任务包已复制。' : `${taskPackMatches.length} packs available`}</div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
            {taskPackMatches.map(({ pack, tasks }) => {
              const matchedMinutes = tasks.reduce((total, task) => total + task.durationMinutes, 0)
              const sourceCoverage = [...new Set(tasks.map((task) => task.sourceLabel))]
              const scenarioCount = new Set(tasks.map((task) => task.scenarioId).filter(Boolean)).size

              return (
                <article key={pack.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-stone-50">{pack.title}</h4>
                      <p className="mt-1 text-xs leading-5 text-stone-500">{pack.audience}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-sky-200/25 bg-sky-100/[0.08] px-3 py-1 text-xs font-semibold text-sky-100">{pack.totalMinutes}m</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-400">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">{tasks.length}/6 matched</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">{matchedMinutes} task minutes</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">{scenarioCount || 'cross'} scenarios</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-300">{pack.learningGoal}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...pack.tags.slice(0, 3), ...pack.coverage.slice(0, 2)].map((tag) => (
                      <span key={tag} className="rounded-full border border-amber-200/15 bg-amber-100/[0.06] px-2.5 py-1 text-xs text-amber-100">{tag}</span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-stone-500">覆盖：{sourceCoverage.slice(0, 4).join('、') || '等待任务库匹配'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => loadTaskPack(pack, tasks)} disabled={tasks.length === 0} className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-300 px-3 py-2 text-xs font-semibold text-stone-950 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40">
                      <ClipboardList size={14} />
                      载入到任务组合
                    </button>
                    <button type="button" onClick={() => void copyTaskPack(pack, tasks)} className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/[0.08] px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-100/[0.14]">
                      <Copy size={14} />
                      复制任务包
                    </button>
                    <button type="button" onClick={() => startFirstTaskPackTask(tasks)} disabled={tasks.length === 0} className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-100/[0.08] px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-100/[0.14] disabled:cursor-not-allowed disabled:opacity-40">
                      <ArrowRight size={14} />
                      开始首个任务
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <h3 className="text-xl font-semibold text-stone-50">1. 选择任务 / Task picker</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">搜索</span>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-3 transition focus-within:border-amber-200/60">
                  <Search size={18} className="text-stone-500" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="标题、交付物、标签、场景或来源……"
                    className="min-w-0 flex-1 bg-transparent text-stone-100 outline-none placeholder:text-stone-600"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">来源</span>
                <select
                  value={sourceFilter}
                  onChange={(event) => setSourceFilter(event.target.value as 'all' | TaskLibrarySource)}
                  className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
                >
                  {taskLibrarySourceFilters.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">时长</span>
                <select
                  value={durationFilter}
                  onChange={(event) => setDurationFilter(event.target.value as 'all' | DurationBand)}
                  className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
                >
                  <option value="all">全部时长</option>
                  {durationBands.map((band) => <option key={band} value={band}>{getDurationBandLabel(band)}</option>)}
                </select>
              </label>
            </div>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-3 rounded-full border border-amber-200/20 bg-amber-100/[0.06] px-4 py-2 text-sm text-amber-100 transition hover:bg-amber-100/[0.1]">
              <input
                type="checkbox"
                checked={sourceBasedOnly}
                onChange={(event) => setSourceBasedOnly(event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200"
              />
              只显示来源型 / source-based 任务
            </label>

            <div className="mt-5 max-h-[46rem] space-y-3 overflow-y-auto pr-1">
              {visibleTasks.slice(0, 64).map((task) => {
                const isSelected = draft.selectedTaskIds.includes(task.id)
                const isDisabled = !isSelected && draft.selectedTaskIds.length >= 6

                return (
                  <article key={task.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                          <span className="rounded-full border border-amber-200/20 bg-amber-100/[0.06] px-3 py-1 text-amber-100">{task.sourceLabel}</span>
                          <span>{task.durationMinutes}m</span>
                          <span>{task.category}</span>
                          {task.sourceBased ? <span>source-based</span> : null}
                        </div>
                        <h4 className="mt-2 font-semibold text-stone-50">{task.title}</h4>
                        <p className="mt-1 text-xs leading-5 text-stone-500">{task.context}</p>
                        <p className="mt-2 text-sm leading-6 text-stone-300">{task.summary}</p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          disabled={isDisabled}
                          className="inline-flex justify-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/[0.08] px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-100/[0.14] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isSelected ? <Check size={16} /> : <Circle size={16} />}
                          {isSelected ? '已选择' : isDisabled ? '最多 6 个' : '加入组合'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onStartTask(task.id)}
                          className="inline-flex justify-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-100/[0.08] px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-100/[0.14]"
                        >
                          <ClipboardList size={16} />
                          开始任务
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
              {visibleTasks.length === 0 ? <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-stone-500">没有匹配任务，请放宽筛选。</p> : null}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">2. 已选序列 / Selected sequence</h3>
              <div className="mt-4 space-y-3">
                {selectedTasks.length > 0 ? selectedTasks.map((task, index) => (
                  <article key={task.id} className="rounded-2xl border border-emerald-200/15 bg-emerald-100/[0.045] p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-emerald-100">Step {index + 1} · {task.durationMinutes}m · {task.sourceLabel}</div>
                        <h4 className="mt-2 font-semibold text-stone-50">{task.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-stone-400">{task.deliverable}</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button type="button" onClick={() => moveTask(task.id, -1)} disabled={index === 0} className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-stone-200 transition hover:bg-white/[0.08] disabled:opacity-35">上移</button>
                        <button type="button" onClick={() => moveTask(task.id, 1)} disabled={index === selectedTasks.length - 1} className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-stone-200 transition hover:bg-white/[0.08] disabled:opacity-35">下移</button>
                        <button type="button" onClick={() => onStartTask(task.id)} className="rounded-full border border-emerald-200/25 bg-emerald-100/[0.08] px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-100/[0.14]">开始任务</button>
                        <button type="button" onClick={() => toggleTask(task.id)} className="rounded-full border border-rose-200/25 bg-rose-100/[0.08] px-3 py-1.5 text-xs font-semibold text-rose-100 transition hover:bg-rose-100/[0.14]">移除</button>
                      </div>
                    </div>
                  </article>
                )) : <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-stone-500">从左侧加入任务后，这里会显示可调整顺序的学习序列。</p>}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">3. 设置 / Settings</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {([
                  ['title', '标题'],
                  ['audience', '对象'],
                  ['timeBox', '时间盒'],
                  ['learningGoal', '学习目标'],
                  ['finalDeliverable', '最终交付物'],
                  ['teacherNotes', '教师备注'],
                  ['studentInstructions', '学生说明'],
                  ['rubricFocus', '评分关注'],
                ] as [keyof AssignmentBuilderDraft, string][]).map(([field, label]) => (
                  <label key={field} className={field === 'teacherNotes' || field === 'studentInstructions' || field === 'rubricFocus' || field === 'finalDeliverable' || field === 'learningGoal' ? 'block md:col-span-2' : 'block'}>
                    <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">{label}</span>
                    {field === 'teacherNotes' || field === 'studentInstructions' || field === 'rubricFocus' || field === 'finalDeliverable' || field === 'learningGoal' ? (
                      <textarea
                        value={draft[field] ?? ''}
                        onChange={(event) => updateDraft({ [field]: event.target.value } as Partial<AssignmentBuilderDraft>)}
                        rows={field === 'rubricFocus' ? 2 : 3}
                        className="w-full rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-200/60"
                      />
                    ) : (
                      <input
                        value={draft[field] ?? ''}
                        onChange={(event) => updateDraft({ [field]: event.target.value } as Partial<AssignmentBuilderDraft>)}
                        className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-200/60"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">4. 汇总与导出 / Summary & copy</h3>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-stone-300 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><span className="font-semibold text-amber-100">Total：</span>{summary.totalMinutes} 分钟</div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><span className="font-semibold text-amber-100">Sources：</span>{summary.sourceCategories.join('、') || '尚未选择'}</div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><span className="font-semibold text-amber-100">Scenarios：</span>{summary.scenarioCoverage.join('、') || '尚未选择'}</div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><span className="font-semibold text-amber-100">Thinking：</span>{summary.historicalThinkingTags.slice(0, 10).join('、') || '尚未识别'}</div>
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={() => void copyAssignment('student')} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200">
                  {copyStatus === 'student' ? <Check size={16} /> : <Copy size={16} />}
                  {copyStatus === 'student' ? '学生任务单已复制' : '复制学生任务单'}
                </button>
                <button type="button" onClick={() => void copyAssignment('teacher')} className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-100/[0.08] px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-100/[0.14]">
                  {copyStatus === 'teacher' ? <Check size={16} /> : <Copy size={16} />}
                  {copyStatus === 'teacher' ? '教师指南已复制' : '复制教师指南'}
                </button>
                <button type="button" onClick={onOpenAssessmentStudio} className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200/25 bg-sky-100/[0.08] px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-100/[0.14]">
                  <Scale size={16} />
                  用当前组合打开评价反馈
                </button>
                <button type="button" onClick={clearDraft} className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/[0.08]">
                  清空草稿
                </button>
              </div>
              <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : copyStatus === 'pack' ? '任务包已复制，可粘贴为课堂准备单。' : draft.updatedAt ? `已保存：${new Date(draft.updatedAt).toLocaleString()}` : '本机保存，受限时回退 sessionStorage。'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function AssessmentStudioPanel({
  assignmentBuilderDraft,
  libraryTasks,
}: {
  assignmentBuilderDraft: AssignmentBuilderDraft
  libraryTasks: LibraryTask[]
}) {
  const [assessmentDraft, setAssessmentDraft] = useState<AssessmentDraft>({
    targetType: 'assignment',
    taskId: libraryTasks[0]?.id ?? '',
    moduleId: taskModules[0]?.id ?? '',
  })
  const [taskSearchQuery, setTaskSearchQuery] = useState('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'student' | 'teacher' | 'feedback' | 'revision' | 'failed'>('idle')
  const normalizedTaskSearch = taskSearchQuery.trim().toLowerCase()
  const visibleTasks = useMemo(
    () => libraryTasks.filter((task) => !normalizedTaskSearch || task.searchText.includes(normalizedTaskSearch)).slice(0, 80),
    [libraryTasks, normalizedTaskSearch],
  )
  const target = getAssessmentTargetInfo(assessmentDraft, assignmentBuilderDraft, libraryTasks)
  const criteria = buildAssessmentRubricCriteria(target)
  const studentRubric = formatAssessmentStudentRubric(target, criteria)
  const teacherGuide = formatAssessmentTeacherScoringGuide(target, criteria)
  const feedbackStems = formatAssessmentFeedbackStems(target, criteria)
  const revisionChecklist = formatAssessmentRevisionChecklist(target, criteria)
  const assessmentExports = [
    { id: 'student' as const, label: '学生 Rubric', text: studentRubric, filename: 'student-rubric' },
    { id: 'teacher' as const, label: '教师评分指南', text: teacherGuide, filename: 'teacher-scoring-guide' },
    { id: 'feedback' as const, label: '反馈句式', text: feedbackStems, filename: 'feedback-stems' },
    { id: 'revision' as const, label: '修改清单', text: revisionChecklist, filename: 'revision-checklist' },
  ]

  function updateTargetType(targetType: AssessmentTargetType) {
    setAssessmentDraft((currentDraft) => ({ ...currentDraft, targetType }))
    setCopyStatus('idle')
  }

  async function copyAssessment(kind: 'student' | 'teacher' | 'feedback' | 'revision', text: string) {
    try {
      await copyTextToClipboard(text)
      setCopyStatus(kind)
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="assessment-studio" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="assessment-studio-title">
      <div className="rounded-[2rem] border border-sky-200/15 bg-sky-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-sky-100">
          <Scale size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">assessment studio / 评价与反馈工作台</span>
        </div>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 id="assessment-studio-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Tasks Assessment Studio / 评价与反馈工作台
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              从当前任务组合、单个 Task Library 任务或 Task Module 生成四级评价标准，并复制或导出学生 rubric、教师评分指南、反馈句式与修改清单。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Rubric 项', value: criteria.length },
              { label: '关联任务', value: target.tasks.length },
              { label: '来源类别', value: target.sourceLabels.length },
              { label: '方法标签', value: target.tags.length },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-black/20 p-4 text-center">
                <div className="text-2xl font-semibold text-sky-100">{item.value}</div>
                <div className="mt-1 text-xs text-stone-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">1. 选择评价目标 / Target</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {([
                  ['assignment', '当前任务组合', 'Assignment Builder draft'],
                  ['task', '单个任务', 'LibraryTask'],
                  ['module', '单元模块', 'Task Module'],
                ] as [AssessmentTargetType, string, string][]).map(([value, label, helper]) => {
                  const isActive = assessmentDraft.targetType === value

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateTargetType(value)}
                      className={`rounded-3xl border p-4 text-left transition ${isActive ? 'border-sky-200/50 bg-sky-100/[0.1] text-sky-50' : 'border-white/10 bg-white/[0.025] text-stone-300 hover:bg-white/[0.06]'}`}
                    >
                      <div className="font-semibold">{label}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-500">{helper}</div>
                    </button>
                  )
                })}
              </div>

              {assessmentDraft.targetType === 'task' ? (
                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">搜索任务</span>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-3 transition focus-within:border-sky-200/60">
                      <Search size={18} className="text-stone-500" />
                      <input
                        type="search"
                        value={taskSearchQuery}
                        onChange={(event) => setTaskSearchQuery(event.target.value)}
                        placeholder="标题、来源、类别、标签……"
                        className="min-w-0 flex-1 bg-transparent text-stone-100 outline-none placeholder:text-stone-600"
                      />
                    </div>
                  </label>
                  <select
                    value={assessmentDraft.taskId}
                    onChange={(event) => setAssessmentDraft((currentDraft) => ({ ...currentDraft, taskId: event.target.value }))}
                    className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-sky-200/60"
                  >
                    {visibleTasks.map((task) => <option key={task.id} value={task.id}>{task.title} · {task.sourceLabel} · {task.durationMinutes}m</option>)}
                  </select>
                </div>
              ) : null}

              {assessmentDraft.targetType === 'module' ? (
                <label className="mt-4 block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">选择 Task Module</span>
                  <select
                    value={assessmentDraft.moduleId}
                    onChange={(event) => setAssessmentDraft((currentDraft) => ({ ...currentDraft, moduleId: event.target.value }))}
                    className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-sky-200/60"
                  >
                    {taskModules.map((module) => <option key={module.id} value={module.id}>{module.title} · {module.totalMinutes}m</option>)}
                  </select>
                </label>
              ) : null}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">2. 目标摘要 / Assessment brief</h3>
              <div className="mt-4 space-y-3 text-sm leading-6 text-stone-300">
                <div className="rounded-2xl border border-sky-200/15 bg-sky-100/[0.045] p-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-sky-100">{target.targetLabel}</div>
                  <h4 className="mt-2 font-semibold text-stone-50">{target.title}</h4>
                  <p className="mt-2 text-stone-400">{target.summary}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><span className="font-semibold text-sky-100">Time：</span>{target.timeBox}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><span className="font-semibold text-sky-100">Audience：</span>{target.audience}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3 sm:col-span-2"><span className="font-semibold text-sky-100">Goal：</span>{target.learningGoal}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3 sm:col-span-2"><span className="font-semibold text-sky-100">Deliverable：</span>{target.deliverable}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><span className="font-semibold text-sky-100">Sources：</span>{target.sourceLabels.join('、') || '未识别'}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><span className="font-semibold text-sky-100">Tags：</span>{target.tags.slice(0, 8).join('、') || '未识别'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">3. Rubric criteria / 四级评价标准</h3>
              <div className="mt-4 grid gap-3">
                {criteria.map((criterion, index) => (
                  <article key={criterion.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                      <span className="rounded-full border border-sky-200/20 bg-sky-100/[0.06] px-3 py-1 text-sky-100">Criterion {index + 1}</span>
                      <span>{criterion.id}</span>
                    </div>
                    <h4 className="mt-2 font-semibold text-stone-50">{criterion.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{criterion.focus}</p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {([
                        ['exceeds', 'Exceeds'],
                        ['meets', 'Meets'],
                        ['developing', 'Developing'],
                        ['beginning', 'Beginning'],
                      ] as [keyof RubricCriterion['levels'], string][]).map(([level, label]) => (
                        <div key={level} className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-stone-300">
                          <span className="font-semibold text-sky-100">{label}：</span>{criterion.levels[level]}
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">4. 复制 / 导出</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {assessmentExports.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="font-semibold text-stone-100">{item.label}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void copyAssessment(item.id, item.text)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-sky-200"
                      >
                        {copyStatus === item.id ? <Check size={16} /> : <Copy size={16} />}
                        {copyStatus === item.id ? '已复制' : '复制'}
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadTextFile(getAssessmentFilename(target, item.filename), item.text)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/[0.08]"
                      >
                        <Share2 size={16} />
                        导出 .txt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限；仍可使用导出按钮下载文本。' : '导出内容由当前目标即时生成，不新增 scenario 数据。'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function TaskWorkbenchPanel({
  libraryTasks,
  draftState,
  activeTaskId,
  onSelectTask,
  onUpdateDraftState,
}: {
  libraryTasks: LibraryTask[]
  draftState: TaskWorkbenchState
  activeTaskId: string
  onSelectTask: (taskId: string) => void
  onUpdateDraftState: Dispatch<SetStateAction<TaskWorkbenchState>>
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'draft' | 'sheet' | 'failed'>('idle')
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const visibleTasks = useMemo(
    () => libraryTasks.filter((task) => !normalizedSearchQuery || task.searchText.includes(normalizedSearchQuery)).slice(0, 80),
    [libraryTasks, normalizedSearchQuery],
  )
  const selectedTask = libraryTasks.find((task) => task.id === activeTaskId) ?? visibleTasks[0] ?? libraryTasks[0]
  const selectedTaskId = selectedTask?.id ?? ''
  const draft = selectedTask ? draftState[selectedTask.id] ?? getEmptyTaskWorkbenchDraft(selectedTask.id) : getEmptyTaskWorkbenchDraft('')
  const checklist = selectedTask ? getTaskWorkbenchChecklist(selectedTask) : []
  const evidencePrompts = selectedTask ? getTaskWorkbenchEvidencePrompts(selectedTask) : []
  const workbenchPrompts = selectedTask ? getTaskWorkbenchPrompts(selectedTask) : []
  const completedChecklistCount = checklist.filter((_, index) => draft.checkedPromptIds.includes(`checklist:${index}`)).length

  useEffect(() => {
    if (!selectedTaskId || activeTaskId === selectedTaskId) {
      return
    }

    onSelectTask(selectedTaskId)
  }, [activeTaskId, onSelectTask, selectedTaskId])

  function updateDraft(patch: Partial<TaskWorkbenchDraft>) {
    if (!selectedTask) {
      return
    }

    onUpdateDraftState((currentState) => {
      const currentDraft = currentState[selectedTask.id] ?? getEmptyTaskWorkbenchDraft(selectedTask.id)

      return {
        ...currentState,
        [selectedTask.id]: {
          ...currentDraft,
          ...patch,
          taskId: selectedTask.id,
          updatedAt: new Date().toISOString(),
        },
      }
    })
  }

  function toggleChecklist(index: number) {
    const promptId = `checklist:${index}`
    const nextCheckedPromptIds = draft.checkedPromptIds.includes(promptId)
      ? draft.checkedPromptIds.filter((id) => id !== promptId)
      : [...draft.checkedPromptIds, promptId]

    updateDraft({ checkedPromptIds: nextCheckedPromptIds })
  }

  async function copyWorkbench(kind: 'draft' | 'sheet') {
    if (!selectedTask) {
      return
    }

    try {
      await copyTextToClipboard(kind === 'draft' ? formatTaskWorkbenchDraft(selectedTask, draft) : selectedTask.formatSheet())
      setCopyStatus(kind)
    } catch {
      setCopyStatus('failed')
    }
  }

  if (!selectedTask) {
    return (
      <section id="task-workbench" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="task-workbench-title">
        <div className="rounded-[2rem] border border-emerald-200/15 bg-emerald-100/[0.045] p-5">
          <h2 id="task-workbench-title" className="text-3xl font-semibold tracking-tight text-stone-50">Tasks Workbench / 任务执行台</h2>
          <p className="mt-3 text-stone-400">暂无可执行任务。</p>
        </div>
      </section>
    )
  }

  return (
    <section id="task-workbench" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="task-workbench-title">
      <div className="rounded-[2rem] border border-emerald-200/15 bg-emerald-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-emerald-100">
          <ClipboardList size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">tasks workbench / 任务执行台</span>
        </div>
        <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
          <div>
            <h2 id="task-workbench-title" className="text-3xl font-semibold tracking-tight text-stone-50">单任务执行台</h2>
            <p className="mt-3 leading-7 text-stone-400">选择一个 Task Library 任务，记录执行清单、证据 notes、claim/explanation、source limits 和最终反思。每个任务草稿独立保存。</p>
            <label className="mt-5 block">
              <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">搜索 / 选择任务</span>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-3 transition focus-within:border-emerald-200/60">
                <Search size={18} className="text-stone-500" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="标题、交付物、标签、来源或场景……"
                  className="min-w-0 flex-1 bg-transparent text-stone-100 outline-none placeholder:text-stone-600"
                />
              </div>
            </label>
            <select
              value={selectedTask.id}
              onChange={(event) => onSelectTask(event.target.value)}
              className="mt-3 w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-emerald-200/60"
            >
              {visibleTasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
            </select>
            <div className="mt-5 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
              {visibleTasks.slice(0, 24).map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onSelectTask(task.id)}
                  className={`block w-full rounded-2xl border p-3 text-left text-sm transition ${task.id === selectedTask.id ? 'border-emerald-200/40 bg-emerald-100/[0.08]' : 'border-white/10 bg-black/20 hover:bg-white/[0.04]'}`}
                >
                  <div className="font-semibold text-stone-100">{task.title}</div>
                  <div className="mt-1 text-xs text-stone-500">{task.sourceLabel} · {task.durationMinutes}m · {draftState[task.id]?.updatedAt ? '有草稿' : '未开始'}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <article className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                    <span className="rounded-full border border-emerald-200/20 bg-emerald-100/[0.06] px-3 py-1 text-emerald-100">{selectedTask.sourceLabel}</span>
                    <span>{selectedTask.category}</span>
                    <span>{selectedTask.durationMinutes}m</span>
                    {selectedTask.sourceBased ? <span>source-based</span> : null}
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-stone-50">{selectedTask.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-500">{selectedTask.context}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-stone-500">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-2"><span className="block text-lg font-semibold text-emerald-100">{completedChecklistCount}/{checklist.length}</span>清单</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-2"><span className="block text-lg font-semibold text-emerald-100">{draft.completed ? 'Done' : 'Draft'}</span>状态</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-2"><span className="block text-lg font-semibold text-emerald-100">{draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString() : '—'}</span>更新</div>
                </div>
              </div>
              <p className="mt-4 rounded-2xl border border-teal-200/15 bg-teal-100/[0.045] p-3 text-sm leading-6 text-stone-300"><span className="font-semibold text-teal-100">交付物：</span>{selectedTask.deliverable}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {workbenchPrompts.map((prompt, index) => (
                  <div key={`${selectedTask.id}:prompt:${index}`} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-sm leading-6 text-stone-400">{prompt}</div>
                ))}
              </div>
            </article>

            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <article className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <h3 className="text-xl font-semibold text-stone-50">Checklist progress</h3>
                <div className="mt-4 space-y-2">
                  {checklist.map((item, index) => {
                    const isChecked = draft.checkedPromptIds.includes(`checklist:${index}`)

                    return (
                      <label key={`${selectedTask.id}:checklist:${index}`} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-sm leading-6 text-stone-400 transition hover:border-emerald-100/25">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleChecklist(index)}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-emerald-300 focus:ring-emerald-200"
                        />
                        <span>{item}</span>
                      </label>
                    )
                  })}
                </div>
                <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-emerald-200/20 bg-emerald-100/[0.06] p-3 text-sm font-semibold text-emerald-100">
                  <input
                    type="checkbox"
                    checked={draft.completed}
                    onChange={(event) => updateDraft({ completed: event.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-black text-emerald-300 focus:ring-emerald-200"
                  />
                  标记任务完成
                </label>
              </article>

              <article className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <h3 className="text-xl font-semibold text-stone-50">Evidence prompts</h3>
                <div className="mt-3 space-y-2 text-sm leading-6 text-stone-400">
                  {evidencePrompts.map((prompt, index) => <p key={`${selectedTask.id}:evidence:${index}`} className="rounded-2xl border border-sky-200/15 bg-sky-100/[0.045] p-3">{index + 1}. {prompt}</p>)}
                </div>
              </article>
            </div>

            <article className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <h3 className="text-xl font-semibold text-stone-50">Draft notes / evidence → claim → reflection</h3>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {([
                  ['evidenceNotes', 'Evidence notes / 证据 notes', 5],
                  ['claimExplanation', 'Claim / explanation', 4],
                  ['sourceLimits', 'Source limits / 来源边界', 3],
                  ['reflection', 'Reflection / 反思与下一步', 3],
                ] as [keyof TaskWorkbenchDraft, string, number][]).map(([field, label, rows]) => (
                  <label key={field} className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">{label}</span>
                    <textarea
                      value={String(draft[field] ?? '')}
                      onChange={(event) => updateDraft({ [field]: event.target.value } as Partial<TaskWorkbenchDraft>)}
                      rows={rows}
                      className="w-full rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-emerald-200/60"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={() => void copyWorkbench('draft')} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200">
                  {copyStatus === 'draft' ? <Check size={16} /> : <Copy size={16} />}
                  {copyStatus === 'draft' ? '执行台草稿已复制' : '复制 / 导出执行台草稿'}
                </button>
                <button type="button" onClick={() => void copyWorkbench('sheet')} className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200/25 bg-sky-100/[0.08] px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-100/[0.14]">
                  {copyStatus === 'sheet' ? <Check size={16} /> : <Copy size={16} />}
                  {copyStatus === 'sheet' ? '原始任务单已复制' : '复制原始任务单'}
                </button>
                {selectedTask.onPrimaryAction ? (
                  <button type="button" onClick={selectedTask.onPrimaryAction} className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-100/[0.08] px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-100/[0.14]">
                    <ArrowRight size={16} />
                    {selectedTask.primaryActionLabel ?? '打开来源目标'}
                  </button>
                ) : null}
              </div>
              <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : draft.updatedAt ? `已保存：${new Date(draft.updatedAt).toLocaleString()}` : '尚未开始；任意勾选或填写后会自动保存。'}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

function TaskLibraryPanel({
  preset,
  onClearPreset,
  onOpenScenario,
  onLoadCompare,
  onLoadCompareLens,
  onLoadCausationInquiry,
  onLoadPeriodizationInquiry,
  onLoadPerspectivesInquiry,
  onLoadContextInquiry,
  onLoadSignificanceInquiry,
  onLoadSynthesisPreset,
  onOpenEvidenceCaseFile,
  onOpenDebateStudio,
  onStartTask,
}: {
  preset: TaskLibraryPreset | null
  onClearPreset: () => void
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
  onLoadCompare: (path: AtlasInquiryPath) => void
  onLoadCompareLens: (lens: CompareLens) => void
  onLoadCausationInquiry: (inquiryId: string) => void
  onLoadPeriodizationInquiry: (inquiryId: string) => void
  onLoadPerspectivesInquiry: (inquiryId: string) => void
  onLoadContextInquiry: (inquiryId: string) => void
  onLoadSignificanceInquiry: (inquiryId: string) => void
  onLoadSynthesisPreset: (presetId: string) => void
  onOpenEvidenceCaseFile?: (caseFileId: string) => void
  onOpenDebateStudio: (scenarioId: string) => void
  onStartTask: (taskId: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [scenarioFilter, setScenarioFilter] = useState('all')
  const [durationFilter, setDurationFilter] = useState<'all' | DurationBand>('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | TaskLibrarySource>('all')
  const [sourceBasedOnly, setSourceBasedOnly] = useState(false)
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const libraryTasks = useMemo(
    () => buildTaskLibraryTasks({ onOpenScenario, onLoadCompare, onLoadCompareLens, onLoadCausationInquiry, onLoadPeriodizationInquiry, onLoadPerspectivesInquiry, onLoadContextInquiry, onLoadSignificanceInquiry, onLoadSynthesisPreset, onOpenEvidenceCaseFile, onOpenDebateStudio, onStartTask }),
    [onOpenScenario, onLoadCompare, onLoadCompareLens, onLoadCausationInquiry, onLoadPeriodizationInquiry, onLoadPerspectivesInquiry, onLoadContextInquiry, onLoadSignificanceInquiry, onLoadSynthesisPreset, onOpenEvidenceCaseFile, onOpenDebateStudio, onStartTask],
  )
  const categoryOptions = useMemo(() => [...new Set(libraryTasks.map((task) => task.category))].sort((first, second) => first.localeCompare(second, 'zh-Hans-CN')), [libraryTasks])
  const durationBands = useMemo(() => [...new Set(libraryTasks.map((task) => task.durationBand))], [libraryTasks])

  useEffect(() => {
    if (!preset) {
      return
    }

    setSearchQuery(preset.searchQuery ?? '')
    setCategoryFilter(preset.category ?? 'all')
    setScenarioFilter('all')
    setDurationFilter(preset.durationBand ?? 'all')
    setSourceFilter(preset.source ?? 'all')
    setSourceBasedOnly(Boolean(preset.sourceBasedOnly))
  }, [preset])

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const visibleTasks = useMemo(
    () => libraryTasks.filter((task) => {
      const matchesSearch = !normalizedSearchQuery || task.searchText.includes(normalizedSearchQuery)
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter
      const matchesScenario = scenarioFilter === 'all' || task.scenarioId === scenarioFilter
      const matchesDuration = durationFilter === 'all' || task.durationBand === durationFilter
      const matchesSource = sourceFilter === 'all' || task.source === sourceFilter
      const matchesSourceBased = !sourceBasedOnly || task.sourceBased
      const matchesPreset = !preset || preset.matcher(task)

      return matchesSearch && matchesCategory && matchesScenario && matchesDuration && matchesSource && matchesSourceBased && matchesPreset
    }),
    [categoryFilter, durationFilter, libraryTasks, normalizedSearchQuery, preset, scenarioFilter, sourceBasedOnly, sourceFilter],
  )

  async function copyTaskSheet(task: LibraryTask) {
    try {
      await copyTextToClipboard(task.formatSheet())
      setCopyStatus(task.id)
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="task-library" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="task-library-title">
      <div className="rounded-[2rem] border border-sky-200/15 bg-sky-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-sky-100">
          <LibraryBig size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">task library / launcher 11.0</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="task-library-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              全站任务库 / Assignment Launcher 11.0
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              汇总 scenario missions、Activity Packs、Lesson Pack 流程、Inquiry Pathways 与 Compare Lens 模板，按关键词、场景、类别、时长和来源型任务快速启动。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {visibleTasks.length}/{libraryTasks.length} 个任务 · {libraryTasks.filter((task) => task.sourceBased).length} 个来源型
          </div>
        </div>

        {preset ? (
          <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-amber-200/20 bg-amber-100/[0.06] p-4 text-sm leading-6 text-stone-300 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-semibold text-amber-100">Discovery preset active：</span>{preset.label}
            </div>
            <button
              type="button"
              onClick={onClearPreset}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 font-semibold text-stone-100 transition hover:bg-white/[0.08]"
            >
              清除 Discovery preset
            </button>
          </div>
        ) : null}

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.25fr_0.8fr_0.8fr] xl:grid-cols-[1.4fr_0.85fr_0.85fr_0.7fr_0.75fr]">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">搜索任务</span>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-3 transition focus-within:border-sky-200/60">
              <Search size={18} className="text-stone-500" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="标题、交付物、标签、来源或步骤……"
                className="min-w-0 flex-1 bg-transparent text-stone-100 outline-none placeholder:text-stone-600"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">类别</span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-sky-200/60"
            >
              <option value="all">全部类别</option>
              {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">场景</span>
            <select
              value={scenarioFilter}
              onChange={(event) => setScenarioFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-sky-200/60"
            >
              <option value="all">全部场景</option>
              {scenarios.map((scenario) => <option key={scenario.id} value={scenario.id}>{scenario.title}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">时长</span>
            <select
              value={durationFilter}
              onChange={(event) => setDurationFilter(event.target.value as 'all' | DurationBand)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-sky-200/60"
            >
              <option value="all">全部时长</option>
              {durationBands.map((band) => <option key={band} value={band}>{getDurationBandLabel(band)}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">来源</span>
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value as 'all' | TaskLibrarySource)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-sky-200/60"
            >
              {taskLibrarySourceFilters.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <label className="mt-4 inline-flex cursor-pointer items-center gap-3 rounded-full border border-sky-200/20 bg-sky-100/[0.06] px-4 py-2 text-sm text-sky-100 transition hover:bg-sky-100/[0.1]">
          <input
            type="checkbox"
            checked={sourceBasedOnly}
            onChange={(event) => setSourceBasedOnly(event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-black text-sky-300 focus:ring-sky-200"
          />
          只显示来源型 / evidence-based 任务
        </label>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {visibleTasks.slice(0, 48).map((task) => (
            <article key={task.id} className="flex min-h-full flex-col rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                <span className="rounded-full border border-sky-200/20 bg-sky-100/[0.06] px-3 py-1 text-sky-100">{task.sourceLabel}</span>
                <span>{task.durationMinutes}m</span>
                <span>{task.category}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-stone-50">{task.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">{task.context}</p>
              <p className="mt-3 text-sm leading-6 text-stone-300">{task.summary}</p>
              <div className="mt-4 rounded-2xl border border-teal-200/15 bg-teal-100/[0.045] p-3 text-sm leading-6 text-stone-300">
                <span className="font-semibold text-teal-100">交付物：</span>{task.deliverable}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {task.tags.slice(0, 6).map((tag) => (
                  <span key={`${task.id}-${tag}`} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-stone-400">{tag}</span>
                ))}
                {task.sourceBased ? <span className="rounded-full border border-amber-200/20 bg-amber-100/[0.06] px-3 py-1 text-xs text-amber-100">source-based</span> : null}
              </div>
              <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row sm:flex-wrap">
                {task.onPrimaryAction ? (
                  <button
                    type="button"
                    onClick={task.onPrimaryAction}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200/25 bg-sky-100/[0.08] px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-100/[0.14]"
                  >
                    {task.source === 'compare' || task.source === 'inquiry' || task.source === 'causation' || task.source === 'periodization' || task.source === 'perspectives' || task.source === 'contextualization' || task.source === 'significance' || task.source === 'synthesis' ? <Scale size={16} /> : <ArrowRight size={16} />}
                    {task.primaryActionLabel}
                  </button>
                ) : null}
                {task.onSecondaryAction ? (
                  <button
                    type="button"
                    onClick={task.onSecondaryAction}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/[0.08]"
                  >
                    <ArrowRight size={16} />
                    {task.secondaryActionLabel}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onStartTask(task.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-100/[0.08] px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-100/[0.14]"
                >
                  <ClipboardList size={16} />
                  开始任务
                </button>
                <button
                  type="button"
                  onClick={() => void copyTaskSheet(task)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
                >
                  {copyStatus === task.id ? <Check size={16} /> : <Copy size={16} />}
                  {copyStatus === task.id ? '已复制' : '复制任务单'}
                </button>
              </div>
            </article>
          ))}
        </div>

        {visibleTasks.length > 48 ? (
          <p className="mt-4 text-sm text-stone-500">已显示前 48 个结果；可继续使用搜索或筛选缩小范围。</p>
        ) : null}
        {visibleTasks.length === 0 ? (
          <p className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-400">没有匹配的任务。请放宽搜索、类别、场景、时长或来源型筛选。</p>
        ) : null}
        <p className="mt-3 text-sm text-stone-500" aria-live="polite">
          {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : '打开场景会保留 URL 参数并滚动到当前场景；Compare / Inquiry 任务可直接载入 Compare Lab。'}
        </p>
      </div>
    </section>
  )
}

function GuidedSessionPanel({
  selectedScenarioId,
  progressState,
  onUpdateProgressState,
  onOpenScenario,
}: {
  selectedScenarioId: string
  progressState: GuidedSessionProgressState
  onUpdateProgressState: Dispatch<SetStateAction<GuidedSessionProgressState>>
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
}) {
  const [durationFilter, setDurationFilter] = useState<'all' | GuidedSessionRoute['minutes']>('all')
  const [scenarioFilter, setScenarioFilter] = useState(selectedScenarioId)
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const routes = useMemo(buildGuidedSessionRoutes, [])

  useEffect(() => {
    setScenarioFilter(selectedScenarioId)
  }, [selectedScenarioId])

  const visibleRoutes = routes.filter((route) => {
    const matchesScenario = scenarioFilter === 'all' || route.scenario.id === scenarioFilter
    const matchesDuration = durationFilter === 'all' || route.minutes === durationFilter

    return matchesScenario && matchesDuration
  })

  function toggleStep(routeId: string, stepIndex: number) {
    const stepId = `${routeId}:step:${stepIndex}`

    onUpdateProgressState((currentState) => {
      const currentRouteProgress = currentState[routeId] ?? []
      const nextRouteProgress = currentRouteProgress.includes(stepId)
        ? currentRouteProgress.filter((candidate) => candidate !== stepId)
        : [...currentRouteProgress, stepId]

      return {
        ...currentState,
        [routeId]: nextRouteProgress,
      }
    })
  }

  async function copyRoute(route: GuidedSessionRoute) {
    try {
      await copyTextToClipboard(formatGuidedSessionRoute(route, progressState[route.id] ?? []))
      setCopyStatus(route.id)
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="guided-session-builder" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="guided-session-builder-title">
      <div className="rounded-[2rem] border border-violet-200/15 bg-violet-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-violet-100">
          <Route size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">guided session builder</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="guided-session-builder-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Guided Session Builder / Healthy Chunking
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              从现有 scenario、Scene Reader、Lesson Pack、Activity Packs、Mission Board、Source Reader 与 Compare Lab 自动生成 15/30/45/75 分钟路线卡，帮你把一次历史学习切成健康小块。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {visibleRoutes.length}/{routes.length} 条路线 · 勾选进度本机保存
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_0.55fr]">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">场景</span>
            <select
              value={scenarioFilter}
              onChange={(event) => setScenarioFilter(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-violet-200/60"
            >
              <option value="all">全部场景</option>
              {scenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>{scenario.title}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">健康时长</span>
            <select
              value={durationFilter}
              onChange={(event) => setDurationFilter(event.target.value === 'all' ? 'all' : Number(event.target.value) as GuidedSessionRoute['minutes'])}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-violet-200/60"
            >
              <option value="all">全部时长</option>
              <option value={15}>15 分钟</option>
              <option value={30}>30 分钟</option>
              <option value={45}>45 分钟</option>
              <option value={75}>75 分钟</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {visibleRoutes.slice(0, 12).map((route) => {
            const checkedStepIds = progressState[route.id] ?? []
            const completedCount = route.steps.filter((_, index) => checkedStepIds.includes(`${route.id}:step:${index}`)).length
            const firstStepHash = route.steps[0]?.hash ?? defaultScenarioSectionId

            return (
              <article key={route.id} className="flex min-h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                <div className="h-1.5" style={{ backgroundColor: route.scenario.accent }} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                        <span className="rounded-full border border-violet-200/20 bg-violet-100/[0.06] px-3 py-1 text-violet-100">{route.minutes} min</span>
                        <span>{route.scenario.era}</span>
                        <span>{completedCount}/{route.steps.length} steps</span>
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-stone-50">{route.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-400">{route.purpose}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenScenario(route.scenario.id, firstStepHash)}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
                    >
                      开始路线
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {route.steps.map((step, index) => {
                      const stepId = `${route.id}:step:${index}`
                      const isChecked = checkedStepIds.includes(stepId)

                      return (
                        <label key={stepId} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-sm leading-6 text-stone-400 transition hover:border-violet-100/25">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleStep(route.id, index)}
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-violet-300 focus:ring-violet-200"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-stone-100">{index + 1}. {step.title} · {step.minutes}m</span>
                            <span className="block">{step.description}</span>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault()
                                onOpenScenario(route.scenario.id, step.hash)
                              }}
                              className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-violet-100 transition hover:bg-white/[0.06]"
                            >
                              跳到 #{step.hash}
                              <ArrowRight size={13} />
                            </button>
                          </span>
                        </label>
                      )
                    })}
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <h4 className="font-semibold text-violet-100">当前场景资源</h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {route.resources.map((resource) => <Tag key={resource}>{resource}</Tag>)}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-amber-200/15 bg-amber-100/[0.045] p-4">
                      <h4 className="font-semibold text-amber-100">Linked sources</h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {route.linkedSourceTitles.map((title) => (
                          <span key={title} className="rounded-full border border-amber-200/20 bg-amber-100/[0.06] px-3 py-1.5 text-xs text-amber-100">{title}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-3xl border border-teal-200/15 bg-teal-100/[0.045] p-4 text-sm leading-6 text-stone-300">
                    <span className="font-semibold text-teal-100">交付物：</span>{route.deliverable}
                  </div>

                  <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-stone-500" aria-live="polite">
                      {copyStatus === route.id ? '路线卡已复制。' : copyStatus === 'failed' ? '复制失败，请检查剪贴板权限。' : '复制会包含勾选状态、步骤 hash、资源与来源。'}
                    </p>
                    <button
                      type="button"
                      onClick={() => void copyRoute(route)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/25 bg-violet-100/[0.08] px-5 py-3 font-semibold text-violet-100 transition hover:bg-violet-100/[0.14]"
                    >
                      {copyStatus === route.id ? <Check size={18} /> : <Copy size={18} />}
                      {copyStatus === route.id ? '路线卡已复制' : '复制 / 导出路线卡'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {visibleRoutes.length > 12 ? (
          <p className="mt-4 text-sm text-stone-500">已显示前 12 条路线；可按场景或时长继续收窄。</p>
        ) : null}
      </div>
    </section>
  )
}

function AtlasMissionsPanel({
  workspaceState,
  onUpdateWorkspaceState,
}: {
  workspaceState: WorkspaceState
  onUpdateWorkspaceState: Dispatch<SetStateAction<WorkspaceState>>
}) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const completedCount = atlasMissions.filter((mission) => workspaceState.atlasMissions[mission.id]?.completed).length

  function updateMissionEntry(missionId: string, nextEntry: WorkspaceEntry) {
    onUpdateWorkspaceState((currentState) => ({
      ...currentState,
      atlasMissions: {
        ...currentState.atlasMissions,
        [missionId]: {
          ...nextEntry,
          updatedAt: new Date().toISOString(),
        },
      },
    }))
  }

  function toggleMissionChecklist(missionId: string, item: string) {
    const currentEntry = workspaceState.atlasMissions[missionId] ?? getEmptyWorkspaceEntry()
    const checkedEvidence = currentEntry.checkedEvidence.includes(item)
      ? currentEntry.checkedEvidence.filter((candidate) => candidate !== item)
      : [...currentEntry.checkedEvidence, item]

    updateMissionEntry(missionId, { ...currentEntry, checkedEvidence })
  }

  async function copyTemplate(mission: typeof atlasMissions[number], entry: WorkspaceEntry) {
    const checklist = mission.checklist.map((item) => `- [${entry.checkedEvidence.includes(item) ? 'x' : ' '}] ${item}`).join('\n')
    const text = [
      `TimeAtlas 跨场景任务：${mission.title}`,
      mission.prompt,
      '',
      '检查清单：',
      checklist,
      '',
      '模板：',
      mission.template,
      '',
      '我的草稿：',
      entry.notes.trim() || '尚未填写',
    ].join('\n')

    try {
      await copyTextToClipboard(text)
      setCopyStatus(mission.id)
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="atlas-missions" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="atlas-missions-title">
      <div className="rounded-[2rem] border border-amber-200/15 bg-amber-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-amber-100">
          <Compass size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">atlas missions</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="atlas-missions-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              跨场景挑战 · Atlas Workspace
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              跨时代比较任务现在可编辑、可勾选、可标记完成，并会优先保存在本机 localStorage；受限时回退 sessionStorage。
            </p>
          </div>
          <div className="rounded-3xl border border-amber-200/20 bg-amber-200/10 px-4 py-3 text-sm text-amber-100">
            {completedCount}/{atlasMissions.length} 已完成
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {atlasMissions.map((mission) => {
            const entry = workspaceState.atlasMissions[mission.id] ?? getEmptyWorkspaceEntry()

            return (
              <article key={mission.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-stone-50">{mission.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{mission.prompt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateMissionEntry(mission.id, { ...entry, completed: !entry.completed })}
                    aria-pressed={entry.completed}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-3 py-1.5 text-xs font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
                  >
                    {entry.completed ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                    {entry.completed ? '已完成' : '完成'}
                  </button>
                </div>
                <div className="mt-4 space-y-2">
                  {mission.checklist.map((item) => (
                    <label key={item} className="flex cursor-pointer gap-2 rounded-2xl border border-white/10 bg-white/[0.025] p-2 text-sm leading-5 text-stone-400 transition hover:border-amber-100/25">
                      <input
                        type="checkbox"
                        checked={entry.checkedEvidence.includes(item)}
                        onChange={() => toggleMissionChecklist(mission.id, item)}
                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-stone-100">草稿笔记</span>
                  <textarea
                    value={entry.notes}
                    onChange={(event) => updateMissionEntry(mission.id, { ...entry, notes: event.target.value })}
                    rows={5}
                    placeholder={mission.template}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-200/60"
                  />
                </label>
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => void copyTemplate(mission, entry)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/[0.08] px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-100/[0.14]"
                  >
                    {copyStatus === mission.id ? <Check size={16} /> : <Copy size={16} />}
                    {copyStatus === mission.id ? '模板与草稿已复制' : '复制模板 + 草稿'}
                  </button>
                  <p className="text-xs text-stone-500" aria-live="polite">
                    {entry.updatedAt ? `已保存：${new Date(entry.updatedAt).toLocaleString()}` : '尚未保存编辑。'}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
        {copyStatus === 'failed' ? <p className="mt-3 text-sm text-stone-500">复制失败，请手动复制模板内容。</p> : null}
      </div>
    </section>
  )
}

function AtlasInquiryPathsPanel({
  workspaceState,
  onUpdateWorkspaceState,
  onOpenScenario,
  onLoadCompare,
}: {
  workspaceState: WorkspaceState
  onUpdateWorkspaceState: Dispatch<SetStateAction<WorkspaceState>>
  onOpenScenario: (id: string, hash?: ScenarioSectionId) => void
  onLoadCompare: (path: AtlasInquiryPath) => void
}) {
  const [expandedPathId, setExpandedPathId] = useState(atlasInquiryPaths[0]?.id ?? '')
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const completedCount = atlasInquiryPaths.filter((path) => workspaceState.inquiryPaths[path.id]?.completed).length

  function updatePathEntry(pathId: string, nextEntry: WorkspaceEntry) {
    onUpdateWorkspaceState((currentState) => ({
      ...currentState,
      inquiryPaths: {
        ...currentState.inquiryPaths,
        [pathId]: {
          ...nextEntry,
          updatedAt: new Date().toISOString(),
        },
      },
    }))
  }

  function togglePathChecklist(pathId: string, item: string) {
    const currentEntry = workspaceState.inquiryPaths[pathId] ?? getEmptyWorkspaceEntry()
    const checkedEvidence = currentEntry.checkedEvidence.includes(item)
      ? currentEntry.checkedEvidence.filter((candidate) => candidate !== item)
      : [...currentEntry.checkedEvidence, item]

    updatePathEntry(pathId, { ...currentEntry, checkedEvidence })
  }

  async function copyInquiryPack(path: AtlasInquiryPath, entry: WorkspaceEntry) {
    try {
      await copyTextToClipboard(formatAtlasInquiryPack(path, entry))
      setCopyStatus(path.id)
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="atlas-inquiry-paths" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="atlas-inquiry-paths-title">
      <div className="rounded-[2rem] border border-orange-200/15 bg-orange-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-orange-100">
          <Route size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">inquiry pathways</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="atlas-inquiry-paths-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              Atlas Connections / Inquiry Pathways 8.0
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">
              策展式跨场景探究路径现在接入 Atlas Workspace：可勾选路径任务、保存探究草稿、标记完成，并复制 inquiry pack + user draft。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {atlasInquiryPaths.length} 条路径 · {completedCount} 条已完成 · 直接连接 Compare Lab
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {atlasInquiryPaths.map((path) => {
            const lens = getCompareLensByKey(path.lensKey)
            const pathScenarios = path.scenarioIds
              .map((id) => getScenarioById(id))
              .filter((scenario): scenario is Scenario => Boolean(scenario))
            const isExpanded = expandedPathId === path.id
            const detailsId = `inquiry-path-${path.id}`
            const entry = workspaceState.inquiryPaths[path.id] ?? getEmptyWorkspaceEntry()
            const checklist = [...path.tasks, ...path.rubric.map((item) => `评分：${item}`)]

            return (
              <article key={path.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 ">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                      <span className="rounded-full border border-orange-200/20 bg-orange-100/[0.06] px-3 py-1 text-orange-100">{lens.title}</span>
                      <span>{pathScenarios.length} scenarios</span>
                      {entry.completed ? <span className="rounded-full border border-teal-200/20 bg-teal-100/[0.06] px-3 py-1 text-teal-100">已完成</span> : null}
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight text-stone-50">{path.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-400">{path.subtitle}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updatePathEntry(path.id, { ...entry, completed: !entry.completed })}
                      aria-pressed={entry.completed}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
                    >
                      {entry.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      {entry.completed ? '已完成' : '标记完成'}
                    </button>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      onClick={() => setExpandedPathId(isExpanded ? '' : path.id)}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/[0.08]"
                    >
                      {isExpanded ? '收起路径' : '展开路径'}
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2" aria-label={`${path.title} 场景列表`}>
                  {pathScenarios.map((scenario) => (
                    <span key={scenario.id} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-stone-300">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: scenario.accent }} />
                      {scenario.title}
                    </span>
                  ))}
                </div>

                {isExpanded ? (
                  <div id={detailsId} className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.92fr]">
                    <div className="space-y-4">
                      <div className="rounded-3xl border border-orange-200/15 bg-orange-100/[0.045] p-4">
                        <h4 className="font-semibold text-orange-100">Driving question</h4>
                        <p className="mt-2 text-sm leading-6 text-stone-300">{path.drivingQuestion}</p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                        <h4 className="font-semibold text-stone-50">为什么是这些场景</h4>
                        <p className="mt-2 text-sm leading-6 text-stone-400">{path.whyTheseScenarios}</p>
                      </div>
                      <CompareAssignmentList title="探究任务" items={path.tasks} ordered />
                      <CompareAssignmentList title="评分标准" items={path.rubric} />
                      <div className="rounded-3xl border border-orange-200/15 bg-orange-100/[0.045] p-4">
                        <h4 className="font-semibold text-orange-100">路径工作清单</h4>
                        <div className="mt-3 space-y-2">
                          {checklist.map((item) => (
                            <label key={item} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-stone-400 transition hover:border-orange-100/25">
                              <input
                                type="checkbox"
                                checked={entry.checkedEvidence.includes(item)}
                                onChange={() => togglePathChecklist(path.id, item)}
                                className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200"
                              />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <label className="block rounded-3xl border border-white/10 bg-black/20 p-4">
                        <span className="font-semibold text-stone-50">User draft / 探究草稿</span>
                        <textarea
                          value={entry.notes}
                          onChange={(event) => updatePathEntry(path.id, { ...entry, notes: event.target.value })}
                          rows={6}
                          placeholder="记录你的路径比较、证据判断、讨论结论或仍不确定的问题……"
                          className="mt-3 w-full rounded-3xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-orange-200/60"
                        />
                        <p className="mt-2 text-xs text-stone-500" aria-live="polite">
                          {entry.updatedAt ? `已保存：${new Date(entry.updatedAt).toLocaleString()}` : '草稿会自动保存在本机。'}
                        </p>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <CompareAssignmentList title="讨论推进" items={path.discussionMoves} />
                      <div className="rounded-3xl border border-teal-200/15 bg-teal-100/[0.045] p-4">
                        <h4 className="font-semibold text-teal-100">Suggested evidence</h4>
                        <div className="mt-3 space-y-3">
                          {pathScenarios.map((scenario) => (
                            <div key={`${path.id}-${scenario.id}`} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                              <div className="text-sm font-semibold text-stone-50">{scenario.title}</div>
                              <ul className="mt-2 space-y-2 text-sm leading-6 text-stone-400">
                                {getLensEvidenceSections(scenario, lens).slice(0, 2).map((section) => (
                                  <li key={`${scenario.id}-${section.label}`}>
                                    <span className="text-teal-100">{section.label}：</span>{section.text}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <button
                          type="button"
                          onClick={() => pathScenarios[0] ? onOpenScenario(pathScenarios[0].id, sectionIds.sceneReader) : undefined}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
                        >
                          打开首个场景
                          <ArrowRight size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onLoadCompare(path)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-5 py-3 font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
                        >
                          <Scale size={18} />
                          载入 Compare Lab
                        </button>
                        <button
                          type="button"
                          onClick={() => void copyInquiryPack(path, entry)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 font-semibold text-stone-100 transition hover:bg-white/[0.08]"
                        >
                          {copyStatus === path.id ? <Check size={18} /> : <Copy size={18} />}
                          {copyStatus === path.id ? 'Inquiry pack + draft 已复制' : copyStatus === 'failed' ? '复制失败' : '复制 inquiry pack + draft'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function formatAtlasInquiryPack(path: AtlasInquiryPath, entry = getEmptyWorkspaceEntry()) {
  const lens = getCompareLensByKey(path.lensKey)
  const pathScenarios = path.scenarioIds
    .map((id) => getScenarioById(id))
    .filter((scenario): scenario is Scenario => Boolean(scenario))
  const checkedItems = entry.checkedEvidence.length
    ? entry.checkedEvidence.map((item) => `- [x] ${item}`)
    : ['- 尚未勾选路径任务或评分标准']

  return [
    `TimeAtlas Inquiry Pack：${path.title}`,
    path.subtitle,
    '',
    `比较镜头：${lens.title} / ${lens.shortLabel}`,
    `Driving question：${path.drivingQuestion}`,
    '',
    '场景路径：',
    ...pathScenarios.map((scenario, index) => `${index + 1}. ${scenario.title}（${scenario.era}，${scenario.location}）｜${scenario.identity}`),
    '',
    `为什么是这些场景：${path.whyTheseScenarios}`,
    '',
    '探究任务：',
    ...path.tasks.map((task, index) => `${index + 1}. ${task}`),
    '',
    '讨论推进：',
    ...path.discussionMoves.map((move) => `- ${move}`),
    '',
    '评分标准：',
    ...path.rubric.map((item) => `- ${item}`),
    '',
    '建议证据：',
    ...pathScenarios.flatMap((scenario) => [
      `- ${scenario.title}：`,
      ...getLensEvidenceSections(scenario, lens).map((section) => `  - ${section.label}｜${section.text}`),
    ]),
    '',
    'Atlas Workspace 用户进度：',
    `- 状态：${entry.completed ? '已完成' : '草稿 / 未完成'}`,
    `- 更新时间：${entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : '未记录时间'}`,
    ...checkedItems,
    '',
    'User draft：',
    entry.notes.trim() || '尚未填写',
    '',
    'Compare Lab 快速设置：',
    `- compareA：${pathScenarios[0]?.title ?? '请选择第一个场景'}`,
    `- compareB：${pathScenarios.find((scenario) => scenario.id !== pathScenarios[0]?.id)?.title ?? '请选择第二个场景'}`,
    `- lens：${lens.title}`,
  ].join('\n')
}

function getLensEvidenceSections(scenario: Scenario, lens: CompareLens) {
  const dailyLifeByKey = Object.fromEntries(scenario.dailyLife.map((section) => [section.key, section])) as Partial<
    Record<Scenario['dailyLife'][number]['key'], Scenario['dailyLife'][number]>
  >
  const firstOption = scenario.decision.options[0]
  const firstSource = scenario.sources[0]

  const sectionsByLens: Record<CompareLens['key'], { label: string; text: string }[]> = {
    'daily-life': [
      ...scenario.sceneBeats.slice(0, 2).map((beat) => ({ label: `场景·${beat.timeLabel}`, text: `${beat.title}：${beat.sensoryDetail}｜${beat.historicalTension}` })),
      ...scenario.dailyLife.slice(0, 3).map((section) => ({ label: section.label, text: `${section.title}：${section.text}` })),
    ],
    'institutional-constraints': [
      { label: '身份边界', text: `${scenario.identity} / ${scenario.role}` },
      ...scenario.sceneBeats.slice(0, 1).map((beat) => ({ label: `场景·${beat.timeLabel}`, text: beat.historicalTension })),
      { label: '制度线索', text: scenario.realHistory },
      { label: '比较角度', text: scenario.compareAngles[0]?.prompt ?? scenario.sourceEvidenceUse },
      { label: '任务线索', text: scenario.missions.find((mission) => mission.taskType === '角色判断' || mission.taskType === '方案设计')?.instruction ?? scenario.interpretationNote },
    ],
    'risk-safety': [
      ...scenario.sceneBeats.filter((beat) => beat.linkedDailyLifeKeys.includes('risks')).slice(0, 1).map((beat) => ({ label: `场景·${beat.timeLabel}`, text: `${beat.title}：${beat.historicalTension}` })),
      { label: dailyLifeByKey.risks?.label ?? '风险', text: dailyLifeByKey.risks ? `${dailyLifeByKey.risks.title}：${dailyLifeByKey.risks.text}` : scenario.atmosphere },
      { label: '岔路口', text: scenario.decision.context },
      { label: '短期风险', text: firstOption ? `${firstOption.label}：${firstOption.immediate}` : scenario.realHistory },
      { label: '长期影响', text: firstOption?.longTerm ?? scenario.realHistory },
    ],
    'knowledge-transmission': [
      ...scenario.sceneBeats.filter((beat) => beat.linkedDailyLifeKeys.includes('education')).slice(0, 1).map((beat) => ({ label: `场景·${beat.timeLabel}`, text: `${beat.title}：${beat.evidenceHook}` })),
      { label: dailyLifeByKey.education?.label ?? '学习', text: dailyLifeByKey.education ? `${dailyLifeByKey.education.title}：${dailyLifeByKey.education.text}` : scenario.interpretationNote },
      { label: '关键术语', text: scenario.keyTerms.map((term) => `${term.term}：${term.definition}`).join('；') },
      { label: '来源线索', text: scenario.sources.map((source) => source.title).join(' / ') },
      { label: '解释边界', text: scenario.sourceEvidenceUse },
    ],
    'market-exchange': [
      ...scenario.sceneBeats.filter((beat) => beat.linkedDailyLifeKeys.includes('work')).slice(0, 1).map((beat) => ({ label: `场景·${beat.timeLabel}`, text: `${beat.title}：${beat.evidenceHook}` })),
      { label: dailyLifeByKey.work?.label ?? '工作', text: dailyLifeByKey.work ? `${dailyLifeByKey.work.title}：${dailyLifeByKey.work.text}` : scenario.role },
      { label: dailyLifeByKey.freedoms?.label ?? '行动空间', text: dailyLifeByKey.freedoms ? `${dailyLifeByKey.freedoms.title}：${dailyLifeByKey.freedoms.text}` : scenario.summary },
      { label: '主题', text: scenario.theme },
      { label: '交换相关任务', text: scenario.missions.find((mission) => mission.taskType === '比较分析' || mission.taskType === '因果链')?.instruction ?? scenario.decision.context },
    ],
    'source-credibility': [
      { label: '来源类型', text: scenario.sources.map((source) => `${source.title}（${sourceTypeLabels[source.sourceType]}）`).join('；') },
      ...scenario.sceneBeats.slice(0, 1).map((beat) => ({ label: '场景证据边界', text: `${beat.title}：${beat.evidenceHook}` })),
      { label: '代表摘记', text: firstSource ? `${firstSource.title}：${firstSource.excerpt}` : scenario.interpretationNote },
      { label: '视角', text: firstSource?.perspective ?? scenario.interpretationNote },
      { label: '可靠边界', text: firstSource?.reliabilityNote ?? scenario.sourceEvidenceUse },
    ],
    'historical-choice': [
      ...scenario.sceneBeats.slice(-1).map((beat) => ({ label: `场景·${beat.timeLabel}`, text: `${beat.title}：${beat.historicalTension}` })),
      { label: '选择情境', text: scenario.decision.context },
      { label: '可选行动', text: scenario.decision.options.map((option) => `${option.label}（${option.stance}）`).join('；') },
      { label: '真实历史对照', text: scenario.realHistory },
      { label: '反思角度', text: scenario.compareAngles[0]?.prompt ?? scenario.interpretationNote },
    ],
  }

  return sectionsByLens[lens.key].map((section, index) => ({
    ...section,
    id: `${scenario.id}:${lens.key}:${index}:${section.label.replace(/\s+/g, '-')}`,
  }))
}

function formatCompareBrief(scenarioA: Scenario, scenarioB: Scenario, lens: CompareLens, draft: CompareDraft) {
  const evidenceA = getLensEvidenceSections(scenarioA, lens).filter((section) => draft.selectedEvidenceIdsA.includes(section.id))
  const evidenceB = getLensEvidenceSections(scenarioB, lens).filter((section) => draft.selectedEvidenceIdsB.includes(section.id))
  const evidenceForExportA = evidenceA.length ? evidenceA : getLensEvidenceSections(scenarioA, lens).slice(0, 3)
  const evidenceForExportB = evidenceB.length ? evidenceB : getLensEvidenceSections(scenarioB, lens).slice(0, 3)

  return [
    'TimeAtlas Compare Lab Workspace 1.0 / 跨场景比较工作区',
    `生成时间：${new Date().toLocaleString()}`,
    `比较对象：${scenarioA.title}（${scenarioA.era}，${scenarioA.location}） × ${scenarioB.title}（${scenarioB.era}，${scenarioB.location}）`,
    `比较镜头：${lens.title}｜${lens.shortLabel}`,
    `核心提示：${lens.prompt}`,
    '',
    '一、Selected evidence / 已选证据',
    `${scenarioA.title}：`,
    ...evidenceForExportA.map((section, index) => `${index + 1}. ${section.label}｜${section.text}`),
    `${scenarioB.title}：`,
    ...evidenceForExportB.map((section, index) => `${index + 1}. ${section.label}｜${section.text}`),
    '',
    '二、Compare brief / 比较简报',
    `Comparative claim：${draft.comparativeClaim.trim() || '尚未填写'}`,
    `Similarity：${draft.similarity.trim() || '尚未填写'}`,
    `Difference：${draft.difference.trim() || '尚未填写'}`,
    `Evidence bridge：${draft.evidenceBridge.trim() || '尚未填写'}`,
    `Source limits：${draft.sourceLimits.trim() || '尚未填写'}`,
    `Confidence：${compareConfidenceLabels[draft.confidence]}`,
    `更新时间：${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未记录时间'}`,
  ].join('\n')
}

function formatCompareAssignment(scenarioA: Scenario, scenarioB: Scenario, lens: CompareLens) {
  return [
    `TimeAtlas 跨场景比较作业：${lens.title}`,
    '',
    `比较对象：${scenarioA.title}（${scenarioA.era}，${scenarioA.location}） × ${scenarioB.title}（${scenarioB.era}，${scenarioB.location}）`,
    '',
    `作业提示：${lens.prompt}`,
    '',
    '证据清单：',
    ...lens.evidenceChecklist.map((item) => `- ${item}`),
    '',
    '输出结构：',
    ...lens.outputTemplate.map((item, index) => `${index + 1}. ${item}`),
    '',
    '评分标准：',
    ...lens.rubric.map((item) => `- ${item}`),
    '',
    '建议引用证据：',
    `- ${scenarioA.title}：${getLensEvidenceSections(scenarioA, lens).map((section) => `${section.label}｜${section.text}`).join('；')}`,
    `- ${scenarioB.title}：${getLensEvidenceSections(scenarioB, lens).map((section) => `${section.label}｜${section.text}`).join('；')}`,
  ].join('\n')
}

function CompareLabPanel({
  scenarioA,
  scenarioB,
  selectedLens,
  draftState,
  onSelectScenarioA,
  onSelectScenarioB,
  onSelectLens,
  onUpdateDraftState,
}: {
  scenarioA: Scenario
  scenarioB: Scenario
  selectedLens: CompareLens
  draftState: CompareDraftState
  onSelectScenarioA: (id: string) => void
  onSelectScenarioB: (id: string) => void
  onSelectLens: (key: CompareLens['key']) => void
  onUpdateDraftState: Dispatch<SetStateAction<CompareDraftState>>
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'assignment-copied' | 'brief-copied' | 'failed'>('idle')
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<CompareWorkspaceTab>('assignment')
  const draftKey = getCompareDraftKey(scenarioA.id, scenarioB.id, selectedLens.key)
  const currentDraft = draftState[draftKey] ?? getEmptyCompareDraft(scenarioA.id, scenarioB.id, selectedLens.key)
  const scenarioAEvidence = getLensEvidenceSections(scenarioA, selectedLens)
  const scenarioBEvidence = getLensEvidenceSections(scenarioB, selectedLens)
  const selectedEvidenceCount = currentDraft.selectedEvidenceIdsA.length + currentDraft.selectedEvidenceIdsB.length
  const workspaceTabs: { id: CompareWorkspaceTab, label: string, eyebrow: string }[] = [
    { id: 'assignment', label: '作业单', eyebrow: 'Assignment' },
    { id: 'evidence', label: '证据草稿', eyebrow: 'Evidence' },
    { id: 'brief', label: '比较简报', eyebrow: 'Brief' },
  ]

  function updateDraft(updates: Partial<Omit<CompareDraft, 'updatedAt'>>) {
    onUpdateDraftState((currentState) => {
      const baseDraft = currentState[draftKey] ?? getEmptyCompareDraft(scenarioA.id, scenarioB.id, selectedLens.key)

      return {
        ...currentState,
        [draftKey]: {
          ...baseDraft,
          scenarioAId: scenarioA.id,
          scenarioBId: scenarioB.id,
          lensKey: selectedLens.key,
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      }
    })
  }

  function toggleEvidence(side: 'A' | 'B', evidenceId: string) {
    const field = side === 'A' ? 'selectedEvidenceIdsA' : 'selectedEvidenceIdsB'
    const currentIds = currentDraft[field]
    const nextIds = currentIds.includes(evidenceId)
      ? currentIds.filter((id) => id !== evidenceId)
      : [...currentIds, evidenceId]

    updateDraft({ [field]: nextIds } as Pick<CompareDraft, typeof field>)
  }

  function clearCurrentDraft() {
    onUpdateDraftState((currentState) => {
      const nextState = { ...currentState }
      delete nextState[draftKey]
      return nextState
    })
    setCopyStatus('idle')
  }

  async function copyAssignment() {
    try {
      await copyTextToClipboard(formatCompareAssignment(scenarioA, scenarioB, selectedLens))
      setCopyStatus('assignment-copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  async function copyCompareBrief() {
    try {
      await copyTextToClipboard(formatCompareBrief(scenarioA, scenarioB, selectedLens, currentDraft))
      setCopyStatus('brief-copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id={sectionIds.compareLab} className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="compare-lab-title">
      <div className="rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-teal-100">
          <Scale size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">compare lab workspace</span>
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <div>
            <h2 id="compare-lab-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              跨场景比较实验室 / Workspace 1.0
            </h2>
            <p className="mt-3 leading-7 text-stone-400">
              选择两个不同历史身份和一个比较镜头，在作业单、证据草稿和比较简报之间切换；草稿会保存在本机。
            </p>

            <div className="mt-5 grid gap-3">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">比较对象 A</span>
                <select
                  value={scenarioA.id}
                  onChange={(event) => onSelectScenarioA(event.target.value)}
                  className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
                >
                  {scenarios.map((scenario) => (
                    <option key={scenario.id} value={scenario.id}>
                      {scenario.title} · {scenario.era}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">比较对象 B</span>
                <select
                  value={scenarioB.id}
                  onChange={(event) => onSelectScenarioB(event.target.value)}
                  className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
                >
                  {scenarios.map((scenario) => (
                    <option key={scenario.id} value={scenario.id} disabled={scenario.id === scenarioA.id}>
                      {scenario.title} · {scenario.era}{scenario.id === scenarioA.id ? '（已选 A）' : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">比较镜头</span>
                <select
                  value={selectedLens.key}
                  onChange={(event) => onSelectLens(event.target.value as CompareLens['key'])}
                  className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
                >
                  {compareLenses.map((lens) => (
                    <option key={lens.key} value={lens.key}>
                      {lens.title} · {lens.shortLabel}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-teal-100">当前镜头</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{selectedLens.description}</p>
                </div>
                <span className="rounded-full border border-teal-200/20 bg-teal-100/[0.08] px-3 py-1 text-xs font-semibold text-teal-100">
                  {getActiveCompareDrafts(draftState).length} 个比较草稿
                </span>
              </div>
              <p className="mt-3 rounded-2xl border border-teal-100/15 bg-teal-100/[0.045] p-3 text-sm leading-6 text-stone-300">
                {selectedLens.prompt}
              </p>
              <p className="mt-3 text-xs text-stone-500">
                当前已选 {selectedEvidenceCount}/{scenarioAEvidence.length + scenarioBEvidence.length} 条证据 · {currentDraft.updatedAt ? `已保存：${new Date(currentDraft.updatedAt).toLocaleString()}` : '本机保存，受限时回退 sessionStorage。'}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-2 rounded-[1.4rem] border border-white/10 bg-black/20 p-2 sm:grid-cols-3" role="tablist" aria-label="Compare Lab workspace tabs">
              {workspaceTabs.map((tab) => {
                const isActive = activeWorkspaceTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveWorkspaceTab(tab.id)}
                    className={`rounded-[1rem] border px-4 py-3 text-left transition ${
                      isActive
                        ? 'border-amber-200/55 bg-amber-100/[0.14] text-stone-50'
                        : 'border-white/10 bg-white/[0.025] text-stone-400 hover:border-amber-100/25 hover:text-stone-100'
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-[0.18em] text-stone-500">{tab.eyebrow}</span>
                    <span className="mt-1 block font-semibold">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {activeWorkspaceTab === 'assignment' ? (
              <section className="rounded-[1.5rem] border border-amber-200/15 bg-amber-100/[0.045] p-5" aria-labelledby="compare-assignment-title">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 id="compare-assignment-title" className="text-2xl font-semibold tracking-tight text-stone-50">
                      课堂比较作业
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-stone-400">复制后可直接发给学生，也可作为小组讨论单。</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void copyAssignment()}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
                  >
                    {copyStatus === 'assignment-copied' ? <Check size={18} /> : <Copy size={18} />}
                    {copyStatus === 'assignment-copied' ? '作业已复制' : copyStatus === 'failed' ? '复制失败' : '复制作业'}
                  </button>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-4 lg:col-span-3">
                    <h4 className="font-semibold text-amber-100">提示</h4>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{selectedLens.prompt}</p>
                  </div>
                  <CompareAssignmentList title="证据清单" items={selectedLens.evidenceChecklist} />
                  <CompareAssignmentList title="输出结构" items={selectedLens.outputTemplate} ordered />
                  <CompareAssignmentList title="评分标准" items={selectedLens.rubric} />
                </div>
                <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                  {copyStatus === 'failed' ? '剪贴板不可用时，请手动复制本区内容。' : '比较对象和镜头会同步到地址栏，便于分享或下次打开。'}
                </p>
              </section>
            ) : null}

            {activeWorkspaceTab === 'evidence' ? (
              <section className="rounded-[1.5rem] border border-teal-200/15 bg-teal-100/[0.045] p-5" aria-labelledby="compare-evidence-title">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 id="compare-evidence-title" className="text-2xl font-semibold tracking-tight text-stone-50">Evidence draft / 证据草稿</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-400">勾选 A/B 两侧可支持比较主张的证据，再在 Brief 中建立共同点、差异与来源边界。</p>
                  </div>
                  <span className="rounded-full border border-teal-200/20 bg-teal-100/[0.08] px-3 py-1 text-xs font-semibold text-teal-100">{selectedEvidenceCount} selected</span>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {[
                    { side: 'A' as const, scenario: scenarioA, evidence: scenarioAEvidence, selectedIds: currentDraft.selectedEvidenceIdsA },
                    { side: 'B' as const, scenario: scenarioB, evidence: scenarioBEvidence, selectedIds: currentDraft.selectedEvidenceIdsB },
                  ].map(({ side, scenario, evidence, selectedIds }) => (
                    <article key={`${side}:${scenario.id}`} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                      <div className="h-1.5" style={{ backgroundColor: scenario.accent }} />
                      <div className="p-5">
                        <div className="mb-3 text-xs uppercase tracking-[0.25em] text-stone-500">Scenario {side} · {scenario.era} · {scenario.location}</div>
                        <h4 className="text-xl font-semibold tracking-tight text-stone-50">{scenario.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-stone-400">{scenario.identity} · {scenario.role}</p>
                        <div className="mt-4 space-y-3">
                          {evidence.map((section) => {
                            const checked = selectedIds.includes(section.id)

                            return (
                              <label key={section.id} className={`block cursor-pointer rounded-2xl border p-3 transition ${checked ? 'border-teal-200/45 bg-teal-100/[0.11]' : 'border-white/10 bg-white/[0.035] hover:border-teal-100/25'}`}>
                                <span className="flex items-start gap-3">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleEvidence(side, section.id)}
                                    className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40 accent-teal-300"
                                  />
                                  <span>
                                    <span className="block text-xs font-medium uppercase tracking-[0.18em] text-amber-100/80">{section.label}</span>
                                    <span className="mt-2 block text-sm leading-6 text-stone-400">{section.text}</span>
                                  </span>
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {activeWorkspaceTab === 'brief' ? (
              <section className="rounded-[1.5rem] border border-fuchsia-200/15 bg-fuchsia-100/[0.04] p-5" aria-labelledby="compare-brief-title">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 id="compare-brief-title" className="text-2xl font-semibold tracking-tight text-stone-50">Compare brief / 比较简报</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-400">把已选证据转成一句比较主张、一组共同点/差异和谨慎的来源限制。</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={clearCurrentDraft} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-red-200/40 hover:text-red-100">清空当前草稿</button>
                    <button type="button" onClick={() => void copyCompareBrief()} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-2 font-semibold text-stone-950 transition hover:bg-amber-200">
                      {copyStatus === 'brief-copied' ? <Check size={18} /> : <Copy size={18} />}
                      {copyStatus === 'brief-copied' ? '简报已复制' : copyStatus === 'failed' ? '复制失败' : '复制 / 导出 Compare Brief'}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  {([
                    ['comparativeClaim', 'Comparative claim / 比较主张', '用一句话回答：这个镜头下两个身份最重要的可比之处是什么？'],
                    ['similarity', 'Similarity / 共同点', '两者在哪些历史条件、经验或证据限制上相似？'],
                    ['difference', 'Difference / 差异', '两者在哪些制度、风险、知识、市场或选择边界上不同？'],
                    ['evidenceBridge', 'Evidence bridge / 证据桥', '明确连接 A 侧证据与 B 侧证据，说明它们如何支持比较。'],
                    ['sourceLimits', 'Source limits / 来源限制', '哪些来源视角、保存条件或缺席声音限制了你的判断？'],
                  ] as [keyof Pick<CompareDraft, 'comparativeClaim' | 'similarity' | 'difference' | 'evidenceBridge' | 'sourceLimits'>, string, string][]).map(([field, label, placeholder]) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">{label}</span>
                      <textarea
                        value={currentDraft[field]}
                        onChange={(event) => updateDraft({ [field]: event.target.value } as Pick<CompareDraft, typeof field>)}
                        placeholder={placeholder}
                        rows={field === 'comparativeClaim' ? 2 : 3}
                        className="w-full rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-fuchsia-200/50"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-stone-500">Confidence / 信心等级</span>
                    <select value={currentDraft.confidence} onChange={(event) => updateDraft({ confidence: event.target.value as CompareConfidence })} className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-fuchsia-200/50">
                      {(Object.entries(compareConfidenceLabels) as [CompareConfidence, string][]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                </div>
                <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                  {copyStatus === 'failed' ? '复制失败，请检查浏览器剪贴板权限。' : 'Compare Brief 会优先导出已选证据；若未勾选，则导出每侧前三条建议证据。'}
                </p>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function CompareAssignmentList({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  const listClassName = 'mt-3 space-y-2 text-sm leading-6 text-stone-400'
  const content = items.map((item, index) => (
    <li key={item} className="flex gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
      <span className="shrink-0 text-teal-100">{ordered ? `${index + 1}.` : '•'}</span>
      <span>{item}</span>
    </li>
  ))

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <h4 className="font-semibold text-teal-100">{title}</h4>
      {ordered ? <ol className={listClassName}>{content}</ol> : <ul className={listClassName}>{content}</ul>}
    </div>
  )
}

function ScenarioExperience({
  scenario,
  selectedTab,
  onSelectTab,
  selectedOption,
  onSelectOption,
  completedMissionIds,
  completedMissionCount,
  missionWorkState,
  argumentDraft,
  actorNetworkDraftState,
  onToggleMission,
  onUpdateMissionWork,
  onUpdateArgumentDraft,
  onUpdateActorNetworkDraftState,
  prefersReducedMotion,
  onOpenDebateStudio,
}: {
  scenario: Scenario
  selectedTab: ScenarioExperienceTab
  onSelectTab: (tab: ScenarioExperienceTab) => void
  selectedOption: DecisionOption | null
  onSelectOption: (id: string) => void
  completedMissionIds: string[]
  completedMissionCount: number
  missionWorkState: MissionWorkState
  argumentDraft: ArgumentDraft
  actorNetworkDraftState: ActorNetworkDraftState
  onToggleMission: (scenarioId: string, missionId: string) => void
  onUpdateMissionWork: Dispatch<SetStateAction<MissionWorkState>>
  onUpdateArgumentDraft: Dispatch<SetStateAction<ArgumentDraftState>>
  onUpdateActorNetworkDraftState: Dispatch<SetStateAction<ActorNetworkDraftState>>
  prefersReducedMotion: boolean | null
  onOpenDebateStudio: (scenarioId: string) => void
}) {
  const scenarioMotion = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -16 },
        transition: { duration: 0.28 },
      }
  const completedLabel = `${completedMissionCount}/${scenario.missions.length}`

  return (
    <section id={sectionIds.experience} className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
              <span>{scenario.era}</span>
              <span>{scenario.location}</span>
              <span>{scenario.year}</span>
            </div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-50">{scenario.title}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-stone-400">{scenario.summary}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:min-w-72">
            <div className="rounded-2xl border border-amber-200/15 bg-amber-100/[0.06] p-3">
              <div className="text-xs uppercase tracking-[0.18em] text-amber-100/70">身份</div>
              <div className="mt-1 text-stone-100">{scenario.identity}</div>
            </div>
            <div className="rounded-2xl border border-teal-200/15 bg-teal-100/[0.06] p-3">
              <div className="text-xs uppercase tracking-[0.18em] text-teal-100/70">任务</div>
              <div className="mt-1 text-stone-100">{completedLabel} 完成</div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" role="tablist" aria-label={`${scenario.title} 的子页面`}>
          {scenarioExperienceTabs.map((tab) => {
            const isSelected = selectedTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectTab(tab.id)}
                className={`rounded-2xl border p-3 text-left transition ${
                  isSelected
                    ? 'border-amber-200/50 bg-amber-200/12 text-stone-50'
                    : 'border-white/10 bg-black/20 text-stone-400 hover:border-amber-100/25 hover:bg-white/[0.05] hover:text-stone-100'
                }`}
              >
                <div className="text-xs uppercase tracking-[0.18em] text-stone-500">{tab.eyebrow}</div>
                <div className="mt-1 font-semibold">{tab.label}</div>
                <div className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">{tab.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${scenario.id}:${selectedTab}`} {...scenarioMotion}>
          {selectedTab === 'overview' ? (
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
              <aside className="space-y-6">
                <ScenarioPassport scenario={scenario} />
                <TimelinePanel scenario={scenario} />
              </aside>
              <div className="space-y-6">
                <NarrativePanel scenario={scenario} />
                <KeyTermsPanel scenario={scenario} />
                <CompareAnglesPanel scenario={scenario} />
              </div>
            </div>
          ) : null}

          {selectedTab === 'scenes' ? <SceneReaderPanel scenario={scenario} /> : null}
          {selectedTab === 'daily' ? <DailyLifeGrid scenario={scenario} /> : null}
          {selectedTab === 'lesson' ? <LessonPackPanel scenario={scenario} /> : null}
          {selectedTab === 'activities' ? <ActivityPackPanel scenario={scenario} /> : null}
          {selectedTab === 'missions' ? (
            <MissionBoard
              scenario={scenario}
              completedMissionIds={completedMissionIds}
              completedMissionCount={completedMissionCount}
              missionWorkState={missionWorkState}
              onToggleMission={onToggleMission}
              onUpdateMissionWork={onUpdateMissionWork}
            />
          ) : null}
          {selectedTab === 'actors' ? (
            <ActorNetworkPanel
              scenario={scenario}
              draftState={actorNetworkDraftState}
              onUpdateDraftState={onUpdateActorNetworkDraftState}
            />
          ) : null}
          {selectedTab === 'decision' ? (
            <DecisionPanel
              scenario={scenario}
              selectedOption={selectedOption}
              onSelectOption={onSelectOption}
              prefersReducedMotion={prefersReducedMotion}
              onOpenDebateStudio={onOpenDebateStudio}
            />
          ) : null}
          {selectedTab === 'sources' ? <SourcesPanel scenario={scenario} /> : null}
          {selectedTab === 'argument' ? (
            <ArgumentStudioPanel
              scenario={scenario}
              selectedOption={selectedOption}
              missionWorkState={missionWorkState}
              argumentDraft={argumentDraft}
              onUpdateArgumentDraft={onUpdateArgumentDraft}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function ActorNetworkPanel({
  scenario,
  draftState,
  onUpdateDraftState,
}: {
  scenario: Scenario
  draftState: ActorNetworkDraftState
  onUpdateDraftState: Dispatch<SetStateAction<ActorNetworkDraftState>>
}) {
  const [selectedEncounterId, setSelectedEncounterId] = useState(scenario.socialEncounters[0]?.id ?? '')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const encounter = scenario.socialEncounters.find((item) => item.id === selectedEncounterId) ?? scenario.socialEncounters[0]

  useEffect(() => {
    setSelectedEncounterId(scenario.socialEncounters[0]?.id ?? '')
    setCopyStatus('idle')
  }, [scenario.id, scenario.socialEncounters])

  if (!encounter) {
    return null
  }

  const draftKey = getActorNetworkDraftKey(scenario.id, encounter.id)
  const draft = draftState[draftKey] ?? getEmptyActorNetworkDraft(encounter)
  const encounterActors = scenario.socialActors.filter((actor) => encounter.actorIds.includes(actor.id))
  const selectedActors = encounterActors.filter((actor) => draft.selectedActorIds.includes(actor.id))

  function updateDraft(patch: Partial<ActorNetworkDraft>) {
    onUpdateDraftState((currentState) => {
      const currentDraft = currentState[draftKey] ?? getEmptyActorNetworkDraft(encounter)

      return {
        ...currentState,
        [draftKey]: {
          ...currentDraft,
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      }
    })
  }

  async function copyBrief() {
    try {
      await copyTextToClipboard(formatActorNetworkBrief(scenario, encounter, encounterActors, draft))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  function downloadBrief() {
    downloadTextFile(`timeatlas-${scenario.id}-${encounter.id}-actor-network.txt`, formatActorNetworkBrief(scenario, encounter, encounterActors, draft))
  }

  return (
    <section id={sectionIds.actorNetwork} className="rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-5 shadow-2xl shadow-black/20" aria-labelledby="actor-network-title">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3 text-teal-100">
            <Users size={20} />
            <span className="text-sm uppercase tracking-[0.3em]">Social Worlds / Actor Network</span>
          </div>
          <h2 id="actor-network-title" className="text-3xl font-semibold tracking-tight text-stone-50">人物关系与社会世界地图</h2>
          <p className="mt-3 max-w-3xl leading-7 text-stone-400">把人物关系、目标、限制、知识边界和证据缺口压缩成一张可协商的社会地图。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void copyBrief()} className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200">
            {copyStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}
            {copyStatus === 'copied' ? '已复制 brief' : copyStatus === 'failed' ? '复制失败' : '复制 brief'}
          </button>
          <button type="button" onClick={downloadBrief} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-amber-100/30 hover:bg-white/[0.05]">下载 txt</button>
          <a href={`#${sectionIds.sourceReader}`} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-teal-100/30 hover:bg-white/[0.05]">打开来源</a>
          <a href={`#${sectionIds.sceneReader}`} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-teal-100/30 hover:bg-white/[0.05]">打开场景</a>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 text-xs uppercase tracking-[0.24em] text-stone-500">encounter workspace</div>
            <div className="grid gap-2">
              {scenario.socialEncounters.map((item) => (
                <button key={item.id} type="button" onClick={() => setSelectedEncounterId(item.id)} className={`rounded-2xl border p-3 text-left transition ${item.id === encounter.id ? 'border-teal-200/45 bg-teal-100/[0.08]' : 'border-white/10 bg-white/[0.025] hover:border-teal-100/25'}`}>
                  <div className="font-semibold text-stone-50">{item.title}</div>
                  <div className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">{item.decisionFocus}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h3 className="font-semibold text-teal-100">Compact social map</h3>
            <div className="mt-4 grid gap-3">
              {encounterActors.map((actor, index) => (
                <div key={actor.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-stone-950">{index + 1}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-stone-50">{actor.name}</div>
                    <div className="line-clamp-1 text-xs text-stone-500">{actor.relationship}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="grid gap-4">
          <div className="grid gap-3 lg:grid-cols-3">
            {encounterActors.map((actor) => {
              const selected = draft.selectedActorIds.includes(actor.id)
              return (
                <button key={actor.id} type="button" onClick={() => updateDraft({ selectedActorIds: selected ? draft.selectedActorIds.filter((id) => id !== actor.id) : [...draft.selectedActorIds, actor.id] })} className={`rounded-3xl border p-4 text-left transition ${selected ? 'border-amber-200/45 bg-amber-100/[0.08]' : 'border-white/10 bg-black/20 hover:border-amber-100/25'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-stone-50">{actor.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-500">{actor.role}</p>
                    </div>
                    {selected ? <CheckCircle2 className="text-amber-100" size={18} /> : <Circle className="text-stone-600" size={18} />}
                  </div>
                  <dl className="mt-3 space-y-2 text-xs leading-5 text-stone-400">
                    <div><dt className="text-teal-100">目标</dt><dd>{actor.goals}</dd></div>
                    <div><dt className="text-teal-100">限制 / 知识边界</dt><dd>{actor.constraints}；{actor.knowledgeLimits}</dd></div>
                    <div><dt className="text-teal-100">风险 / 可能立场</dt><dd>{actor.risksOrStakes}；{actor.likelyViewOfDecision}</dd></div>
                  </dl>
                </button>
              )
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">Draft fields</h3>
              <div className="mt-3 grid gap-3">
                {([
                  ['roleBrief', 'Role brief', 2],
                  ['perspectiveComparison', 'Perspective comparison', 3],
                  ['negotiationPlan', 'Negotiation plan', 3],
                  ['missingVoiceNote', 'Missing voice note', 2],
                  ['evidenceNotes', 'Evidence notes', 3],
                ] as [keyof ActorNetworkDraft, string, number][]).map(([field, label, rows]) => (
                  <label key={field} className="block">
                    <span className="text-xs uppercase tracking-[0.18em] text-stone-500">{label}</span>
                    <textarea value={String(draft[field] ?? '')} onChange={(event) => updateDraft({ [field]: event.target.value } as Partial<ActorNetworkDraft>)} rows={rows} className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-stone-950/70 px-3 py-2 text-sm leading-6 text-stone-100 outline-none transition focus:border-amber-100/50" />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-amber-200/15 bg-amber-100/[0.045] p-4">
                <h3 className="font-semibold text-amber-100">Task checklist</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-300">
                  {encounter.taskChecklist.map((item) => <li key={item} className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-amber-100" />{item}</li>)}
                </ul>
                <button type="button" onClick={() => updateDraft({ completed: !draft.completed })} className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${draft.completed ? 'bg-teal-100 text-stone-950' : 'border border-white/10 text-stone-200 hover:bg-white/[0.05]'}`}>
                  {draft.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  {draft.completed ? '已完成' : '标记完成'}
                </button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <h3 className="font-semibold text-stone-50">Selected voices</h3>
                <p className="mt-2 text-sm leading-6 text-stone-400">{selectedActors.length ? selectedActors.map((actor) => actor.name).join('、') : '尚未选择人物'}</p>
                <p className="mt-3 text-xs leading-5 text-stone-500">证据入口：{encounter.evidenceLinks.join(' / ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ScenarioPassport({ scenario }: { scenario: Scenario }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur">
      <div className="h-2" style={{ backgroundColor: scenario.accent }} />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">identity card</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">{scenario.title}</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-amber-100">
            <Users size={24} />
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <InfoRow icon={<Clock3 size={16} />} label="年份" value={`${scenario.year} · ${scenario.era}`} />
          <InfoRow icon={<MapPin size={16} />} label="地点" value={`${scenario.location} / ${scenario.region}`} />
          <InfoRow icon={<BookOpen size={16} />} label="身份" value={`${scenario.age} 岁 · ${scenario.identity}`} />
          <InfoRow icon={<ScrollText size={16} />} label="角色" value={scenario.role} />
        </div>

        <p className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5 leading-7 text-stone-300">
          {scenario.summary}
        </p>

        <CoordinatePreview scenario={scenario} />
      </div>
    </div>
  )
}

function CoordinatePreview({ scenario }: { scenario: Scenario }) {
  const [latitude, longitude] = scenario.coordinates
  const x = Math.min(92, Math.max(8, ((longitude + 180) / 360) * 100))
  const y = Math.min(88, Math.max(12, ((90 - latitude) / 180) * 100))

  return (
    <div className="mt-4 rounded-3xl border border-white/10 bg-[#090806]/70 p-4" aria-label={`${scenario.location} 坐标预览`}>
      <div className="mb-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.25em] text-stone-500">
        <span>coordinate preview</span>
        <span className="text-amber-100/70">{latitude.toFixed(2)}°, {longitude.toFixed(2)}°</span>
      </div>
      <div className="relative h-28 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_45%,rgba(252,211,77,0.16),transparent_26%),linear-gradient(135deg,rgba(20,184,166,0.12),transparent_45%),#0f0d0a]">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/10" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/10" />
        <div
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-stone-950 bg-amber-300 shadow-[0_0_22px_rgba(252,211,77,0.75)]"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-500">轻量坐标定位：先标出故事发生的大致方位，后续可扩展为完整地图图层。</p>
    </div>
  )
}

function NarrativePanel({ scenario }: { scenario: Scenario }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#13100c]/80 p-6 shadow-2xl shadow-black/20">
      <div className="mb-4 flex items-center gap-3 text-amber-100">
        <Sparkles size={20} />
        <span className="text-sm uppercase tracking-[0.3em]">进入现场</span>
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-stone-50">你今天醒来时，世界是这样的</h2>
      <p className="mt-5 text-lg leading-9 text-stone-300">{scenario.atmosphere}</p>
    </section>
  )
}


function formatSceneObservation(scenario: Scenario, beat: Scenario['sceneBeats'][number]) {
  const linkedDailyLife = scenario.dailyLife.filter((section) => beat.linkedDailyLifeKeys.includes(section.key))
  const linkedSources = scenario.sources.filter((source) => beat.linkedSourceTitles.includes(source.title))

  return [
    `TimeAtlas Scene Observation · ${scenario.title}`,
    `时间：${beat.timeLabel}`,
    `场景：${beat.title}`,
    `感官细节：${beat.sensoryDetail}`,
    `历史张力：${beat.historicalTension}`,
    `证据钩子：${beat.evidenceHook}`,
    `学习追问：${beat.learnerPrompt}`,
    '',
    '关联日常：',
    ...(linkedDailyLife.length ? linkedDailyLife.map((section) => `- ${section.label}｜${section.title}：${section.text}`) : ['- 未关联日常切片']),
    '',
    '关联来源：',
    ...(linkedSources.length ? linkedSources.map((source) => `- ${source.title}（${sourceTypeLabels[source.sourceType]}）：${source.excerpt}`) : beat.linkedSourceTitles.map((title) => `- ${title}`)),
  ].join('\n')
}

function SceneReaderPanel({ scenario }: { scenario: Scenario }) {
  const [selectedBeatIndex, setSelectedBeatIndex] = useState(0)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    setSelectedBeatIndex(0)
    setCopyStatus('idle')
  }, [scenario.id])

  const selectedBeat = scenario.sceneBeats[Math.min(selectedBeatIndex, scenario.sceneBeats.length - 1)]
  const selectedBeatPanelId = `scene-reader-${scenario.id}`
  const linkedDailyLife = selectedBeat
    ? scenario.dailyLife.filter((section) => selectedBeat.linkedDailyLifeKeys.includes(section.key))
    : []
  const linkedSources = selectedBeat
    ? scenario.sources.filter((source) => selectedBeat.linkedSourceTitles.includes(source.title))
    : []

  async function copySceneObservation() {
    if (!selectedBeat) {
      setCopyStatus('failed')
      return
    }

    try {
      await copyTextToClipboard(formatSceneObservation(scenario, selectedBeat))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  if (!selectedBeat) {
    return null
  }

  return (
    <section id={sectionIds.sceneReader} className="rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-6 shadow-2xl shadow-black/20" aria-labelledby="scene-reader-title">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3 text-teal-100">
            <Volume2 size={20} />
            <span className="text-sm uppercase tracking-[0.3em]">scene reader 9.0</span>
          </div>
          <h2 id="scene-reader-title" className="text-3xl font-semibold tracking-tight text-stone-50">Scenario Deep Dive / Scene Reader</h2>
          <p className="mt-3 max-w-3xl leading-7 text-stone-400">
            用四个可切换场景片段把感官细节、历史张力和可引用证据连接起来，再复制为课堂观察卡。
          </p>
        </div>
        <button
          type="button"
          onClick={() => void copySceneObservation()}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
        >
          {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
          {copyStatus === 'copied' ? '场景观察已复制' : copyStatus === 'failed' ? '复制失败' : '复制场景观察'}
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-4" role="tablist" aria-label={`${scenario.title} 的 Scene beats`}>
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-stone-500">scene stepper</div>
          <div className="grid gap-3">
            {scenario.sceneBeats.map((beat, index) => {
              const isSelected = index === selectedBeatIndex

              return (
                <button
                  key={`${beat.timeLabel}-${beat.title}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={selectedBeatPanelId}
                  onClick={() => setSelectedBeatIndex(index)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-teal-200/45 bg-teal-100/[0.08]'
                      : 'border-white/10 bg-white/[0.025] hover:border-teal-100/25 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-stone-950">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs uppercase tracking-[0.18em] text-teal-100/80">{beat.timeLabel}</span>
                      <span className="mt-1 block font-semibold text-stone-50">{beat.title}</span>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <article id={selectedBeatPanelId} role="tabpanel" className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
          <div className="h-1.5" style={{ backgroundColor: scenario.accent }} />
          <div className="p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
              <span className="rounded-full border border-teal-200/20 bg-teal-100/[0.06] px-3 py-1 text-teal-100">{selectedBeat.timeLabel}</span>
              <span>{scenario.era} · {scenario.location}</span>
            </div>
            <h3 className="text-2xl font-semibold tracking-tight text-stone-50">{selectedBeat.title}</h3>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                <h4 className="font-semibold text-teal-100">感官细节</h4>
                <p className="mt-2 text-sm leading-6 text-stone-300">{selectedBeat.sensoryDetail}</p>
              </div>
              <div className="rounded-3xl border border-amber-200/15 bg-amber-100/[0.045] p-4">
                <h4 className="font-semibold text-amber-100">历史张力</h4>
                <p className="mt-2 text-sm leading-6 text-stone-300">{selectedBeat.historicalTension}</p>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4">
              <h4 className="font-semibold text-stone-50">Evidence hook</h4>
              <p className="mt-2 text-sm leading-6 text-stone-400">{selectedBeat.evidenceHook}</p>
            </div>

            <div className="mt-4 rounded-3xl border border-teal-200/15 bg-teal-100/[0.045] p-4">
              <h4 className="font-semibold text-teal-100">Learner prompt</h4>
              <p className="mt-2 text-sm leading-6 text-stone-300">{selectedBeat.learnerPrompt}</p>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <h4 className="font-semibold text-stone-50">Linked daily life</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {linkedDailyLife.map((section) => (
                    <span key={section.key} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-stone-300">
                      {section.label} · {section.title}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <h4 className="font-semibold text-stone-50">Linked sources</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(linkedSources.length ? linkedSources.map((source) => source.title) : selectedBeat.linkedSourceTitles).map((title) => (
                    <span key={title} className="rounded-full border border-amber-200/20 bg-amber-100/[0.06] px-3 py-1.5 text-xs text-amber-100">
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-stone-500" aria-live="polite">
              {copyStatus === 'failed' ? '剪贴板不可用时，请手动复制本场景内容。' : '场景观察会包含感官细节、历史张力、关联日常和来源标题。'}
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

function DailyLifeGrid({ scenario }: { scenario: Scenario }) {
  return (
    <section id={sectionIds.dailyLife} className="grid gap-4 md:grid-cols-2">
      {scenario.dailyLife.map((section) => (
        <article key={section.key} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5">
          <div className="mb-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400">
            {section.label}
          </div>
          <h3 className="text-xl font-semibold text-stone-50">{section.title}</h3>
          <p className="mt-3 leading-7 text-stone-400">{section.text}</p>
        </article>
      ))}
    </section>
  )
}


function LessonPackPanel({ scenario }: { scenario: Scenario }) {
  const [selectedMode, setSelectedMode] = useState<LessonPackMode>('quick')
  const [revealedAnswers, setRevealedAnswers] = useState<string[]>([])
  const [exitTicketStatus, setExitTicketStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const modeLabels: Record<LessonPackMode, string> = {
    quick: 'Quick start',
    source: 'Source lab',
    debate: 'Debate',
  }
  const activeFlow = scenario.lessonPack.classroomFlow[selectedMode]

  function toggleAnswer(question: string) {
    setRevealedAnswers((currentAnswers) =>
      currentAnswers.includes(question)
        ? currentAnswers.filter((candidate) => candidate !== question)
        : [...currentAnswers, question],
    )
  }

  async function copyExitTickets() {
    const exitTicketText = [
      `TimeAtlas Exit Ticket · ${scenario.title}`,
      `探究问题：${scenario.lessonPack.inquiryQuestion}`,
      ...scenario.lessonPack.exitTickets.map((ticket, index) => `${index + 1}. ${ticket}`),
    ].join('\n')

    try {
      await copyTextToClipboard(exitTicketText)
      setExitTicketStatus('copied')
    } catch {
      setExitTicketStatus('failed')
    }
  }

  return (
    <section id={sectionIds.lessonPack} className="rounded-[2rem] border border-amber-200/15 bg-amber-100/[0.045] p-6 shadow-2xl shadow-black/20" aria-labelledby="lesson-pack-title">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3 text-amber-100">
            <ClipboardList size={20} />
            <span className="text-sm uppercase tracking-[0.3em]">guided lesson pack 6.0</span>
          </div>
          <h2 id="lesson-pack-title" className="text-3xl font-semibold tracking-tight text-stone-50">Guided Lesson Pack</h2>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-stone-300">{scenario.lessonPack.inquiryQuestion}</p>
        </div>
        <label className="block min-w-52">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">课堂模式</span>
          <select
            value={selectedMode}
            onChange={(event) => setSelectedMode(event.target.value as LessonPackMode)}
            className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
            aria-label="选择课堂模式"
          >
            {(Object.keys(modeLabels) as LessonPackMode[]).map((mode) => (
              <option key={mode} value={mode}>{modeLabels[mode]}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h3 className="font-semibold text-amber-100">Quick start</h3>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-stone-400">
              {scenario.lessonPack.quickStart.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-2">
                  <span className="shrink-0 text-amber-100">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-teal-200/15 bg-teal-100/[0.045] p-4">
            <h3 className="font-semibold text-teal-100">{activeFlow.title}</h3>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-stone-400">
              {activeFlow.steps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  <span className="shrink-0 text-teal-100">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold text-stone-50">Exit ticket</h3>
              <button
                type="button"
                onClick={() => void copyExitTickets()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/[0.08] px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-100/[0.14]"
              >
                {exitTicketStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}
                {exitTicketStatus === 'copied' ? '已复制' : exitTicketStatus === 'failed' ? '复制失败' : '复制 exit ticket'}
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-400">
              {scenario.lessonPack.exitTickets.map((ticket) => (
                <li key={ticket} className="rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-2">{ticket}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-stone-500" aria-live="polite">
              {exitTicketStatus === 'failed' ? '剪贴板不可用时，请手动复制上方问题。' : '可作为下课前 2 分钟形成性评价。'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h3 className="font-semibold text-stone-50">Check questions</h3>
            <div className="mt-3 space-y-3">
              {scenario.lessonPack.checkQuestions.map((checkQuestion) => {
                const isRevealed = revealedAnswers.includes(checkQuestion.question)

                return (
                  <article key={checkQuestion.question} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <h4 className="font-semibold leading-6 text-stone-100">{checkQuestion.question}</h4>
                      <button
                        type="button"
                        onClick={() => toggleAnswer(checkQuestion.question)}
                        aria-expanded={isRevealed}
                        className="inline-flex shrink-0 items-center justify-center rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-3 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
                      >
                        {isRevealed ? '收起答案' : '揭示答案'}
                      </button>
                    </div>
                    {isRevealed ? (
                      <div className="mt-3 grid gap-2 text-sm leading-6 text-stone-400">
                        <p><span className="font-semibold text-amber-100">参考答案：</span>{checkQuestion.answer}</p>
                        <p><span className="font-semibold text-teal-100">Teacher note：</span>{checkQuestion.teacherNote}</p>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-rose-200/15 bg-rose-100/[0.035] p-4">
              <h3 className="font-semibold text-rose-100">Misconception cards</h3>
              <div className="mt-3 space-y-3 text-sm leading-6 text-stone-400">
                {scenario.lessonPack.misconceptions.map((item) => (
                  <article key={item.misconception} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-stone-300">误区：{item.misconception}</p>
                    <p className="mt-2 text-rose-100/85">校正：{item.correction}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">Discussion roles</h3>
              <div className="mt-3 space-y-3 text-sm leading-6 text-stone-400">
                {scenario.lessonPack.discussionRoles.map((role) => (
                  <article key={role.role} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                    <p className="font-semibold text-teal-100">{role.role}</p>
                    <p className="mt-1">{role.task}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const activityPackModeLabels: Record<ActivityPackMode, string> = {
  warmup: 'Warmup',
  'source-lab': 'Source lab',
  roleplay: 'Roleplay',
  debate: 'Debate',
  writing: 'Writing',
  compare: 'Compare',
  extension: 'Extension',
}

const lessonPackModeLabels: Record<LessonPackMode, string> = {
  quick: 'Quick start',
  source: 'Source lab',
  debate: 'Debate',
}

function formatActivitySheet(scenario: Scenario, activity: ActivityPack) {
  const linkedSources = scenario.sources.filter((source) => activity.linkedSourceTitles.includes(source.title))
  const linkedBeats = scenario.sceneBeats.filter((beat) => activity.linkedSceneBeatTitles.includes(beat.title))

  return [
    `TimeAtlas Activity Sheet · ${activity.title}`,
    `${scenario.title}（${scenario.era}，${scenario.location}）`,
    '',
    `模式：${activityPackModeLabels[activity.mode]}`,
    `时长：${activity.durationMinutes} 分钟`,
    `适用对象：${activity.audience}`,
    '',
    `活动提示：${activity.prompt}`,
    '',
    '材料：',
    ...activity.materials.map((material) => `- ${material}`),
    '',
    '步骤：',
    ...activity.steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    `交付物：${activity.deliverable}`,
    '',
    '成功标准：',
    ...activity.successCriteria.map((item) => `- ${item}`),
    '',
    '关联场景：',
    ...(linkedBeats.length
      ? linkedBeats.map((beat) => `- ${beat.timeLabel}｜${beat.title}：${beat.historicalTension}`)
      : activity.linkedSceneBeatTitles.map((title) => `- ${title}`)),
    '',
    '关联来源：',
    ...(linkedSources.length
      ? linkedSources.map((source) => `- ${source.title}（${sourceTypeLabels[source.sourceType]}）：${source.excerpt}`)
      : activity.linkedSourceTitles.map((title) => `- ${title}`)),
  ].join('\n')
}

function ActivityPackPanel({ scenario }: { scenario: Scenario }) {
  const [modeFilter, setModeFilter] = useState<'all' | ActivityPackMode>('all')
  const [selectedActivityId, setSelectedActivityId] = useState(scenario.activityPacks[0]?.id ?? '')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const modeOptions = useMemo(
    () => [...new Set(scenario.activityPacks.map((activity) => activity.mode))] as ActivityPackMode[],
    [scenario.activityPacks],
  )
  const visibleActivities = useMemo(
    () => scenario.activityPacks.filter((activity) => modeFilter === 'all' || activity.mode === modeFilter),
    [modeFilter, scenario.activityPacks],
  )
  const selectedActivity = scenario.activityPacks.find((activity) => activity.id === selectedActivityId)
    ?? visibleActivities[0]
    ?? scenario.activityPacks[0]
  const selectedActivityPanelId = `activity-pack-${scenario.id}`

  useEffect(() => {
    setModeFilter('all')
    setSelectedActivityId(scenario.activityPacks[0]?.id ?? '')
    setCopyStatus('idle')
  }, [scenario.id, scenario.activityPacks])

  useEffect(() => {
    if (visibleActivities.length > 0 && !visibleActivities.some((activity) => activity.id === selectedActivityId)) {
      setSelectedActivityId(visibleActivities[0].id)
    }
  }, [selectedActivityId, visibleActivities])

  async function copyActivitySheet() {
    if (!selectedActivity) {
      setCopyStatus('failed')
      return
    }

    try {
      await copyTextToClipboard(formatActivitySheet(scenario, selectedActivity))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  if (!selectedActivity) {
    return null
  }

  const linkedSources = scenario.sources.filter((source) => selectedActivity.linkedSourceTitles.includes(source.title))
  const linkedSceneBeats = scenario.sceneBeats.filter((beat) => selectedActivity.linkedSceneBeatTitles.includes(beat.title))

  return (
    <section id={sectionIds.activityPacks} className="rounded-[2rem] border border-orange-200/15 bg-orange-100/[0.045] p-6 shadow-2xl shadow-black/20" aria-labelledby="activity-pack-title">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3 text-orange-100">
            <Compass size={20} />
            <span className="text-sm uppercase tracking-[0.3em]">activity pack / task launcher 10.0</span>
          </div>
          <h2 id="activity-pack-title" className="text-3xl font-semibold tracking-tight text-stone-50">Activity Pack / Task Launcher</h2>
          <p className="mt-3 max-w-3xl leading-7 text-stone-400">
            每个身份提供 3 个可直接启动的课堂活动：筛选模式、选择活动卡，复制 activity sheet，即可带入小组讨论、来源研读或写作任务。
          </p>
        </div>
        <label className="block min-w-52">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">活动模式</span>
          <select
            value={modeFilter}
            onChange={(event) => setModeFilter(event.target.value as 'all' | ActivityPackMode)}
            className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-orange-200/60"
            aria-label="按活动模式筛选"
          >
            <option value="all">全部活动</option>
            {modeOptions.map((mode) => (
              <option key={mode} value={mode}>{activityPackModeLabels[mode]}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-4" role="tablist" aria-label={`${scenario.title} 的活动包`}>
          <div className="mb-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-stone-500">
            <span>launcher cards</span>
            <span>{visibleActivities.length}/{scenario.activityPacks.length}</span>
          </div>
          <div className="grid gap-3">
            {visibleActivities.map((activity) => {
              const isSelected = activity.id === selectedActivity.id

              return (
                <button
                  key={activity.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={selectedActivityPanelId}
                  onClick={() => setSelectedActivityId(activity.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-orange-200/45 bg-orange-100/[0.08]'
                      : 'border-white/10 bg-white/[0.025] hover:border-orange-100/25 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 inline-flex rounded-full border border-orange-200/20 bg-orange-100/[0.06] px-3 py-1 text-xs text-orange-100">
                        {activityPackModeLabels[activity.mode]}
                      </div>
                      <h3 className="font-semibold leading-6 text-stone-50">{activity.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-400">{activity.prompt}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-xs text-stone-400">
                      {activity.durationMinutes}m
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <article id={selectedActivityPanelId} role="tabpanel" className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
          <div className="h-1.5" style={{ backgroundColor: scenario.accent }} />
          <div className="p-5">
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
                  <span className="rounded-full border border-orange-200/20 bg-orange-100/[0.06] px-3 py-1 text-orange-100">{activityPackModeLabels[selectedActivity.mode]}</span>
                  <span>{selectedActivity.durationMinutes} min</span>
                  <span>{selectedActivity.audience}</span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-50">{selectedActivity.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-300">{selectedActivity.prompt}</p>
              </div>
              <button
                type="button"
                onClick={() => void copyActivitySheet()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
              >
                {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                {copyStatus === 'copied' ? '活动单已复制' : copyStatus === 'failed' ? '复制失败' : '复制 activity sheet'}
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                <h4 className="font-semibold text-orange-100">Materials</h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-400">
                  {selectedActivity.materials.map((material) => (
                    <li key={material} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">{material}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-teal-200/15 bg-teal-100/[0.045] p-4">
                <h4 className="font-semibold text-teal-100">Deliverable</h4>
                <p className="mt-3 text-sm leading-6 text-stone-300">{selectedActivity.deliverable}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-stone-400">
                  <Clock3 size={16} />
                  <span>{selectedActivity.durationMinutes} 分钟 · {selectedActivity.audience}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <h4 className="font-semibold text-stone-50">Steps</h4>
                <ol className="mt-3 space-y-2 text-sm leading-6 text-stone-400">
                  {selectedActivity.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-2">
                      <span className="shrink-0 text-orange-100">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <h4 className="font-semibold text-stone-50">Success criteria</h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-400">
                  {selectedActivity.successCriteria.map((criterion) => (
                    <li key={criterion} className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-2">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-teal-100" size={16} />
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <h4 className="font-semibold text-stone-50">Linked scene beats</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(linkedSceneBeats.length ? linkedSceneBeats.map((beat) => beat.title) : selectedActivity.linkedSceneBeatTitles).map((title) => (
                    <span key={title} className="rounded-full border border-orange-200/20 bg-orange-100/[0.06] px-3 py-1.5 text-xs text-orange-100">
                      {title}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <h4 className="font-semibold text-stone-50">Linked sources</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(linkedSources.length ? linkedSources.map((source) => source.title) : selectedActivity.linkedSourceTitles).map((title) => (
                    <span key={title} className="rounded-full border border-amber-200/20 bg-amber-100/[0.06] px-3 py-1.5 text-xs text-amber-100">
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-stone-500" aria-live="polite">
              {copyStatus === 'failed' ? '剪贴板不可用时，请手动复制活动内容。' : 'Activity sheet 会包含提示、材料、步骤、交付物、成功标准与关联证据。'}
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

function MissionBoard({
  scenario,
  completedMissionIds,
  completedMissionCount,
  missionWorkState,
  onToggleMission,
  onUpdateMissionWork,
}: {
  scenario: Scenario
  completedMissionIds: string[]
  completedMissionCount: number
  missionWorkState: MissionWorkState
  onToggleMission: (scenarioId: string, missionId: string) => void
  onUpdateMissionWork: Dispatch<SetStateAction<MissionWorkState>>
}) {
  const [selectedMissionId, setSelectedMissionId] = useState(scenario.missions[0]?.id ?? '')
  const [taskTypeFilter, setTaskTypeFilter] = useState<'all' | MissionTaskType>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'draft' | 'completed'>('all')
  const completedMissionSet = useMemo(() => new Set(completedMissionIds), [completedMissionIds])
  const missionTotal = scenario.missions.length
  const progressLabel = `${completedMissionCount}/${missionTotal}`
  const visibleMissions = useMemo(
    () =>
      scenario.missions.filter((mission) => {
        const status = getMissionStatus(scenario.id, mission, completedMissionIds, missionWorkState)
        const matchesTaskType = taskTypeFilter === 'all' || mission.taskType === taskTypeFilter
        const matchesStatus = statusFilter === 'all' || status === statusFilter

        return matchesTaskType && matchesStatus
      }),
    [completedMissionIds, missionWorkState, scenario, statusFilter, taskTypeFilter],
  )
  const selectedMission = scenario.missions.find((mission) => mission.id === selectedMissionId) ?? visibleMissions[0] ?? scenario.missions[0]
  const selectedMissionWorkKey = selectedMission ? getMissionWorkKey(scenario.id, selectedMission.id) : ''
  const selectedMissionWork = missionWorkState[selectedMissionWorkKey] ?? { notes: '', checkedEvidence: [] }
  const draftedMissionCount = countScenarioMissionWork(scenario, missionWorkState)
  const linkedSources = selectedMission
    ? scenario.sources.filter((source) => selectedMission.linkedSourceTitles.includes(source.title))
    : []
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [starterStatus, setStarterStatus] = useState<'idle' | 'inserted' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (!scenario.missions.some((mission) => mission.id === selectedMissionId)) {
      setSelectedMissionId(scenario.missions[0]?.id ?? '')
    }
  }, [scenario, selectedMissionId])

  useEffect(() => {
    if (visibleMissions.length > 0 && !visibleMissions.some((mission) => mission.id === selectedMissionId)) {
      setSelectedMissionId(visibleMissions[0].id)
    }
  }, [selectedMissionId, visibleMissions])

  function updateSelectedMissionWork(nextEntry: MissionWorkEntry) {
    if (!selectedMission) {
      return
    }

    onUpdateMissionWork((currentState) => ({
      ...currentState,
      [selectedMissionWorkKey]: {
        ...nextEntry,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  function toggleEvidenceItem(item: string) {
    const checkedEvidence = selectedMissionWork.checkedEvidence.includes(item)
      ? selectedMissionWork.checkedEvidence.filter((candidate) => candidate !== item)
      : [...selectedMissionWork.checkedEvidence, item]

    updateSelectedMissionWork({ ...selectedMissionWork, checkedEvidence })
  }

  async function insertSentenceStarter(starter: string) {
    const nextNotes = selectedMissionWork.notes.trim()
      ? `${selectedMissionWork.notes}\n${starter}`
      : starter

    updateSelectedMissionWork({ ...selectedMissionWork, notes: nextNotes })
    setStarterStatus('inserted')

    try {
      await copyTextToClipboard(starter)
      setStarterStatus('copied')
    } catch {
      // Inserting into notes is the primary action; clipboard support is progressive enhancement.
    }
  }

  function appendEvidenceCard(source: Scenario['sources'][number]) {
    const evidenceCard = formatEvidenceCard(source, scenario.title)
    const nextNotes = selectedMissionWork.notes.trim()
      ? `${selectedMissionWork.notes}\n\n${evidenceCard}`
      : evidenceCard

    updateSelectedMissionWork({ ...selectedMissionWork, notes: nextNotes })
  }

  async function copyLearningOutput() {
    if (!selectedMission) {
      setCopyStatus('failed')
      return
    }

    const checkedEvidence = selectedMissionWork.checkedEvidence.length
      ? selectedMissionWork.checkedEvidence.map((item) => `- ${item}`).join('\n')
      : '- 尚未勾选证据'
    const outputTemplate = selectedMission.outputTemplate.map((item) => `- ${item}`).join('\n')
    const linkedSourceText = linkedSources.length
      ? linkedSources.map((source) => formatEvidenceCard(source, scenario.title)).join('\n\n')
      : '- 使用当前场景来源层'
    const selfCheckText = sourceReaderSelfCheck.map((item) => `- ${item}`).join('\n')
    const learningOutput = `TimeAtlas 学习输出\n场景：${scenario.title}\n任务：${selectedMission.title}\n任务类型：${selectedMission.taskType}\n交付物：${selectedMission.deliverable}\n输出结构：\n${outputTemplate}\n关联来源：\n${linkedSourceText}\n证据清单：\n${checkedEvidence}\n草稿笔记：\n${selectedMissionWork.notes || '尚未填写'}\n史料自检：\n${selfCheckText}\n反思：${selectedMission.reflectionPrompt}`

    try {
      await copyTextToClipboard(learningOutput)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  if (!selectedMission) {
    return null
  }

  return (
    <section id={sectionIds.missionBoard} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3 text-amber-100">
            <ClipboardList size={20} />
            <span className="text-sm uppercase tracking-[0.3em]">evidence workbench</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-50">历史任务板</h2>
          <p className="mt-3 max-w-2xl leading-7 text-stone-400">
            不只读情节：选择任务、勾选证据、保存草稿，再复制一段可带走的学习输出。
          </p>
        </div>
        <div
          className="rounded-3xl border border-amber-200/20 bg-amber-200/10 px-5 py-4 text-amber-100"
          aria-label={`当前场景任务完成进度：${progressLabel}，已有 ${draftedMissionCount} 个草稿`}
        >
          <div className="text-xs uppercase tracking-[0.28em] text-amber-100/70">session progress</div>
          <div className="mt-1 text-3xl font-semibold">{progressLabel}</div>
          <div className="text-sm text-stone-400">当前身份已完成任务 · {draftedMissionCount} 个草稿</div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">任务类型</span>
                <select
                  value={taskTypeFilter}
                  onChange={(event) => setTaskTypeFilter(event.target.value as 'all' | MissionTaskType)}
                  className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
                >
                  <option value="all">全部类型</option>
                  {missionTaskTypeOptions.map((taskType) => (
                    <option key={taskType} value={taskType}>
                      {taskType}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">任务状态</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as 'all' | 'not-started' | 'draft' | 'completed')}
                  className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
                >
                  <option value="all">全部状态</option>
                  <option value="not-started">未开始</option>
                  <option value="draft">草稿</option>
                  <option value="completed">已完成</option>
                </select>
              </label>
            </div>
            <p className="mt-3 text-sm text-stone-500">当前显示 {visibleMissions.length}/{missionTotal} 个任务。</p>
          </div>

          <div className="grid content-start gap-3" role="group" aria-label={`${scenario.title} 的历史任务`}>
            {visibleMissions.length > 0 ? visibleMissions.map((mission) => {
            const isComplete = completedMissionSet.has(mission.id)
            const isSelected = selectedMission.id === mission.id
            const status = getMissionStatus(scenario.id, mission, completedMissionIds, missionWorkState)
            const hasDraft = status === 'draft' || status === 'completed'

            return (
              <button
                key={mission.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedMissionId(mission.id)}
                className={`group rounded-3xl border p-5 text-left transition ${
                  isSelected
                    ? 'border-amber-200/45 bg-amber-200/10'
                    : 'border-white/10 bg-black/20 hover:border-amber-100/30 hover:bg-black/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={isComplete ? 'mt-1 text-teal-100' : 'mt-1 text-stone-500 group-hover:text-amber-100'}>
                    {isComplete ? <CheckCircle2 size={21} /> : <Circle size={21} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-stone-50">{mission.title}</h3>
                      {hasDraft ? (
                        <span className="rounded-full border border-teal-200/20 bg-teal-100/[0.06] px-2.5 py-1 text-xs text-teal-100">
                          草稿已保存
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 leading-7 text-stone-400">{mission.instruction}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-400">
                      <Tag>{mission.taskType}</Tag>
                      <Tag>{mission.difficulty}</Tag>
                      <Tag>{mission.estimatedMinutes} 分钟</Tag>
                      <Tag>{getStatusLabel(status)}</Tag>
                    </div>
                  </div>
                </div>
              </button>
            )
          }) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-black/20 p-5 text-sm leading-6 text-stone-400">
              没有符合当前筛选的任务。请调整任务类型或状态筛选。
            </div>
          )}
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-[1.5rem] border border-amber-200/15 bg-[#13100c]/85 p-5" aria-labelledby="active-mission-title">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex flex-wrap gap-2 text-xs text-stone-400">
                  <Tag>{selectedMission.taskType}</Tag>
                  <Tag>{selectedMission.difficulty}</Tag>
                  <Tag>{selectedMission.estimatedMinutes} 分钟</Tag>
                </div>
                <h3 id="active-mission-title" className="text-2xl font-semibold tracking-tight text-stone-50">
                  {selectedMission.title}
                </h3>
                <p className="mt-2 leading-7 text-stone-400">{selectedMission.instruction}</p>
              </div>
              <button
                type="button"
                onClick={() => onToggleMission(scenario.id, selectedMission.id)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
              >
                {completedMissionSet.has(selectedMission.id) ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                {completedMissionSet.has(selectedMission.id) ? '已标记完成' : '标记完成'}
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <h4 className="font-semibold text-amber-100">交付物</h4>
                <p className="mt-2 text-sm leading-6 text-stone-400">{selectedMission.deliverable}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <h4 className="font-semibold text-amber-100">证据用法</h4>
                <p className="mt-2 text-sm leading-6 text-stone-400">{selectedMission.evidenceUse}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-amber-200/15 bg-amber-100/[0.045] p-4">
                <h4 className="font-semibold text-amber-100">输出结构</h4>
                <ol className="mt-3 space-y-2 text-sm leading-6 text-stone-400">
                  {selectedMission.outputTemplate.map((item) => (
                    <li key={item} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-3xl border border-teal-200/15 bg-teal-100/[0.045] p-4">
                <h4 className="font-semibold text-teal-100">好答案标准</h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-400">
                  {selectedMission.rubric.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check size={16} className="mt-1 shrink-0 text-teal-100" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-2xl border border-teal-100/15 bg-black/20 p-3">
                  <h5 className="text-sm font-semibold text-teal-100">史料自检</h5>
                  <ul className="mt-2 space-y-1.5 text-xs leading-5 text-stone-400">
                    {sourceReaderSelfCheck.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Check size={14} className="mt-0.5 shrink-0 text-teal-100/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <h4 className="font-semibold text-stone-50">工作步骤</h4>
                <ol className="mt-3 space-y-3">
                  {selectedMission.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-stone-400">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-semibold text-stone-950">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-stone-50">证据清单</h4>
                <div className="mt-3 space-y-2">
                  {selectedMission.evidenceChecklist.map((item) => {
                    const isChecked = selectedMissionWork.checkedEvidence.includes(item)

                    return (
                      <label key={item} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-stone-400 transition hover:border-teal-100/25">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleEvidenceItem(item)}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200"
                        />
                        <span>{item}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="font-semibold text-stone-50">句子开头</h4>
                <p className="text-xs text-stone-500" aria-live="polite">
                  {starterStatus === 'copied'
                    ? '已插入草稿并复制到剪贴板'
                    : starterStatus === 'inserted'
                      ? '已插入草稿'
                      : starterStatus === 'failed'
                        ? '复制失败，但可手动使用'
                        : '点击后插入草稿；支持时也会复制'}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedMission.sentenceStarters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => void insertSentenceStarter(starter)}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-left text-sm text-stone-300 transition hover:border-amber-100/30 hover:bg-white/[0.07]"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4">
              <h4 className="font-semibold text-stone-50">关联来源</h4>
              <div className="mt-3 grid gap-3">
                {(linkedSources.length ? linkedSources : scenario.sources.slice(0, 2)).map((source) => (
                  <article key={source.title} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="rounded-full border border-teal-100/20 bg-teal-100/10 px-2.5 py-1 text-teal-100">
                        {sourceTypeLabels[source.sourceType]}
                      </span>
                      <span>{source.creator}</span>
                    </div>
                    <h5 className="font-medium text-stone-100">{source.title}</h5>
                    <p className="mt-1 text-sm leading-6 text-stone-400">{source.excerpt}</p>
                    <dl className="mt-3 grid gap-2 text-xs leading-5 text-stone-500 sm:grid-cols-2">
                      <div>
                        <dt className="font-medium text-stone-300">视角</dt>
                        <dd>{source.perspective}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-stone-300">边界</dt>
                        <dd>{source.reliabilityNote}</dd>
                      </div>
                    </dl>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {source.evidenceTags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => appendEvidenceCard(source)}
                      className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/[0.08] px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-100/[0.14]"
                    >
                      <ScrollText size={14} />
                      加入草稿证据
                    </button>
                  </article>
                ))}
              </div>
            </div>

            <label className="mt-5 block">
              <span className="font-semibold text-stone-50">草稿笔记</span>
              <textarea
                value={selectedMissionWork.notes}
                onChange={(event) => updateSelectedMissionWork({ ...selectedMissionWork, notes: event.target.value })}
                rows={5}
                placeholder="写下你的证据链、疑问或课堂讨论要点……"
                className="mt-3 w-full rounded-3xl border border-white/10 bg-black/25 p-4 leading-7 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-200/60"
              />
            </label>

            <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4">
              <h4 className="font-semibold text-stone-50">反思提示</h4>
              <p className="mt-2 text-sm leading-6 text-stone-400">{selectedMission.reflectionPrompt}</p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stone-500" aria-live="polite">
                {selectedMissionWork.updatedAt ? `已保存：${new Date(selectedMissionWork.updatedAt).toLocaleString()}` : '草稿会自动保存在本机。'}
              </p>
              <button
                type="button"
                onClick={copyLearningOutput}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
              >
                {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                {copyStatus === 'copied' ? '学习输出已复制' : copyStatus === 'failed' ? '复制失败' : '复制学习输出'}
              </button>
            </div>
          </section>

          <KeyTermsPanel scenario={scenario} />
          <CompareAnglesPanel scenario={scenario} />
        </div>
      </div>
    </section>
  )
}

function ArgumentStudioPanel({
  scenario,
  selectedOption,
  missionWorkState,
  argumentDraft,
  onUpdateArgumentDraft,
}: {
  scenario: Scenario
  selectedOption: DecisionOption | null
  missionWorkState: MissionWorkState
  argumentDraft: ArgumentDraft
  onUpdateArgumentDraft: Dispatch<SetStateAction<ArgumentDraftState>>
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [teacherPackStatus, setTeacherPackStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const lessonEvidence = [
    {
      id: 'lesson:inquiry',
      label: `探究问题：${scenario.lessonPack.inquiryQuestion}`,
      helper: 'Guided Lesson Pack',
    },
    ...scenario.lessonPack.quickStart.map((step, index) => ({
      id: `lesson:quick:${index}`,
      label: `Quick start ${index + 1}：${step}`,
      helper: '课堂导入步骤',
    })),
    ...Object.entries(scenario.lessonPack.classroomFlow).flatMap(([mode, flow]) =>
      flow.steps.map((step, index) => ({
        id: `lesson:flow:${mode}:${index}`,
        label: `${flow.title} ${index + 1}：${step}`,
        helper: '课堂流程证据',
      })),
    ),
    ...scenario.lessonPack.exitTickets.map((ticket, index) => ({
      id: `lesson:exit:${index}`,
      label: `Exit ticket：${ticket}`,
      helper: '形成性评价提示',
    })),
  ]
  const checkQuestionEvidence = scenario.lessonPack.checkQuestions.map((checkQuestion, index) => ({
    id: `lesson:check:${index}`,
    label: `检查题“${checkQuestion.question}”参考答案：${checkQuestion.answer}`,
    helper: `Check question · ${checkQuestion.teacherNote}`,
  }))
  const missionEvidence = scenario.missions.flatMap((mission) =>
    mission.evidenceChecklist.map((item) => ({
      id: `mission:${mission.id}:${item}`,
      label: item,
      helper: mission.title,
    })),
  )
  const sourceEvidence = scenario.sources.map((source) => ({
    id: `source:${source.title}`,
    label: `${source.title}：${source.excerpt}`,
    helper: `${sourceTypeLabels[source.sourceType]} · ${source.perspective}`,
  }))
  const sceneEvidence = scenario.sceneBeats.map((beat, index) => ({
    id: `scene:${index}:${beat.timeLabel}`,
    label: `${beat.timeLabel} · ${beat.title}：${beat.sensoryDetail}；张力：${beat.historicalTension}；追问：${beat.learnerPrompt}`,
    helper: `Scene Reader 9.0 · ${beat.linkedSourceTitles.join(' / ') || '场景观察'}`,
  }))
  const dailyLifeEvidence = scenario.dailyLife.map((section) => ({
    id: `daily:${section.key}`,
    label: `${section.label}：${section.text}`,
    helper: '日常生活切片',
  }))
  const timelineEvidence = scenario.timeline.slice(0, 3).map((event) => ({
    id: `timeline:${event.year}:${event.title}`,
    label: `${event.year} · ${event.title}：${event.text}`,
    helper: '时间线背景',
  }))
  const decisionEvidence = selectedOption
    ? [{
        id: `decision:${selectedOption.id}`,
        label: `选择“${selectedOption.label}”：${selectedOption.description}；结果：${selectedOption.immediate}`,
        helper: '已选择的历史岔路口',
      }]
    : scenario.decision.options.map((option) => ({
        id: `decision:${option.id}`,
        label: `可选立场“${option.label}”：${option.description}`,
        helper: '历史岔路口选项',
      }))
  const evidenceOptions = [...sourceEvidence, ...sceneEvidence, ...lessonEvidence, ...checkQuestionEvidence, ...missionEvidence, ...dailyLifeEvidence, ...timelineEvidence, ...decisionEvidence]
  const activeMissionWork = Object.entries(missionWorkState).flatMap(([key, work]) => {
    const [scenarioId, missionId] = key.split(':')

    if (scenarioId !== scenario.id || (!work.notes.trim() && work.checkedEvidence.length === 0)) {
      return []
    }

    const mission = scenario.missions.find((candidate) => candidate.id === missionId)

    return [{ missionTitle: mission?.title ?? '任务草稿', work }]
  })
  const selectedEvidenceText = evidenceOptions
    .filter((option) => argumentDraft.evidence.includes(option.id))
    .map((option) => `- ${option.label}`)
  const customEvidenceLines = argumentDraft.customEvidence
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `- ${line}`)
  const fullArgument = [
    'TimeAtlas Evidence-to-Argument Studio 6.0',
    `场景：${scenario.title}（${scenario.era} · ${scenario.location}）`,
    `身份：${scenario.identity}`,
    selectedOption ? `历史选择：${selectedOption.label} — ${selectedOption.stance}` : `历史选择：尚未选择；问题为“${scenario.decision.prompt}”`,
    '',
    `主张：${argumentDraft.claim.trim() || '尚未填写'}`,
    '证据：',
    ...(selectedEvidenceText.length || customEvidenceLines.length ? [...selectedEvidenceText, ...customEvidenceLines] : ['- 尚未选择或记录证据']),
    `推理：${argumentDraft.reasoning.trim() || '尚未填写'}`,
    `反证 / 不确定性：${argumentDraft.counterEvidence.trim() || '尚未填写'}`,
    `来源边界：${scenario.sourceEvidenceUse}`,
  ].join('\n')

  function updateDraft(nextDraft: ArgumentDraft) {
    onUpdateArgumentDraft((currentState) => ({
      ...currentState,
      [scenario.id]: {
        ...nextDraft,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  function toggleEvidence(id: string) {
    const evidence = argumentDraft.evidence.includes(id)
      ? argumentDraft.evidence.filter((candidate) => candidate !== id)
      : [...argumentDraft.evidence, id]

    updateDraft({ ...argumentDraft, evidence })
  }

  function appendMissionDraft(missionTitle: string, notes: string) {
    const nextCustomEvidence = argumentDraft.customEvidence.trim()
      ? `${argumentDraft.customEvidence}\n任务草稿“${missionTitle}”：${notes}`
      : `任务草稿“${missionTitle}”：${notes}`

    updateDraft({ ...argumentDraft, customEvidence: nextCustomEvidence })
  }

  async function copyArgument() {
    try {
      await copyTextToClipboard(fullArgument)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  async function copyTeacherPack() {
    const rubricLines = scenario.missions.flatMap((mission) =>
      mission.rubric.map((item) => `- ${mission.title}：${item}`),
    )
    const sourcePrompts = scenario.sources.map((source) => `- ${source.title}：${source.sourceQuestion}`)
    const lessonFlowLines = (Object.entries(scenario.lessonPack.classroomFlow) as [LessonPackMode, typeof scenario.lessonPack.classroomFlow[LessonPackMode]][]).flatMap(
      ([mode, flow]) => [`- ${mode} · ${flow.title}`, ...flow.steps.map((step) => `  - ${step}`)],
    )
    const teacherPack = [
      `TimeAtlas Teacher Pack 6.0 · ${scenario.title}`,
      `场景：${scenario.era} · ${scenario.location} · ${scenario.identity}`,
      `探究问题：${scenario.lessonPack.inquiryQuestion}`,
      `历史岔路口：${scenario.decision.prompt}`,
      '',
      'Quick start：',
      ...scenario.lessonPack.quickStart.map((step, index) => `${index + 1}. ${step}`),
      '',
      '课堂流程：',
      ...lessonFlowLines,
      '',
      'Check questions：',
      ...scenario.lessonPack.checkQuestions.flatMap((item, index) => [
        `${index + 1}. ${item.question}`,
        `   答案：${item.answer}`,
        `   Teacher note：${item.teacherNote}`,
      ]),
      '',
      'Misconception cards：',
      ...scenario.lessonPack.misconceptions.map((item) => `- 误区：${item.misconception}｜校正：${item.correction}`),
      '',
      'Discussion roles：',
      ...scenario.lessonPack.discussionRoles.map((role) => `- ${role.role}：${role.task}`),
      '',
      '可讨论证据：',
      ...scenario.sources.map((source) => `- ${source.title}（${sourceTypeLabels[source.sourceType]}）：${source.excerpt}`),
      '来源追问：',
      ...sourcePrompts,
      '',
      'Exit tickets：',
      ...scenario.lessonPack.exitTickets.map((ticket, index) => `${index + 1}. ${ticket}`),
      '',
      '检查清单 / Rubric：',
      ...(rubricLines.length ? rubricLines.slice(0, 10) : sourceReaderSelfCheck.map((item) => `- ${item}`)),
      '史料自检：',
      ...sourceReaderSelfCheck.map((item) => `- ${item}`),
    ].join('\n')

    try {
      await copyTextToClipboard(teacherPack)
      setTeacherPackStatus('copied')
    } catch {
      setTeacherPackStatus('failed')
    }
  }

  return (
    <section id={sectionIds.argumentStudio} className="rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-6 shadow-2xl shadow-black/20" aria-labelledby="argument-studio-title">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3 text-teal-100">
            <Scale size={20} />
            <span className="text-sm uppercase tracking-[0.3em]">assessment studio 6.0</span>
          </div>
          <h2 id="argument-studio-title" className="text-3xl font-semibold tracking-tight text-stone-50">Evidence-to-Argument Studio</h2>
          <p className="mt-3 max-w-3xl leading-7 text-stone-400">
            把 Guided Lesson Pack、Source Lab、任务板、日常生活、时间线和历史选择转成一条完整论证：主张、证据、推理，以及反证或不确定性。
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-stone-400" aria-live="polite">
          {argumentDraft.updatedAt ? `草稿已保存：${new Date(argumentDraft.updatedAt).toLocaleString()}` : '草稿会按当前身份自动保存。'}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <label className="block rounded-3xl border border-amber-200/15 bg-amber-100/[0.045] p-4">
            <span className="font-semibold text-amber-100">1. 主张 Claim</span>
            <textarea
              value={argumentDraft.claim}
              onChange={(event) => updateDraft({ ...argumentDraft, claim: event.target.value })}
              rows={3}
              placeholder={`例如：${scenario.title} 的选择空间主要受……限制。`}
              className="mt-3 w-full rounded-3xl border border-white/10 bg-black/25 p-4 leading-7 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-200/60"
            />
          </label>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h3 className="font-semibold text-stone-50">2. 选择证据 Evidence</h3>
            <p className="mt-2 text-sm leading-6 text-stone-500">勾选可支持或挑战主张的来源、Scene Reader、课堂流程、检查题、任务、日常生活、时间线与选择证据。</p>
            <div className="mt-4 max-h-96 space-y-2 overflow-auto pr-1">
              {evidenceOptions.map((option) => (
                <label key={option.id} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-stone-400 transition hover:border-teal-100/25">
                  <input
                    type="checkbox"
                    checked={argumentDraft.evidence.includes(option.id)}
                    onChange={() => toggleEvidence(option.id)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-amber-300 focus:ring-amber-200"
                  />
                  <span>
                    <span className="block text-xs text-teal-100/80">{option.helper}</span>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="block rounded-3xl border border-white/10 bg-black/20 p-4">
            <span className="font-semibold text-stone-50">补充 / 课堂记录证据</span>
            <textarea
              value={argumentDraft.customEvidence}
              onChange={(event) => updateDraft({ ...argumentDraft, customEvidence: event.target.value })}
              rows={4}
              placeholder="记录课堂讨论、自己的观察，或无法用勾选项表达的证据……"
              className="mt-3 w-full rounded-3xl border border-white/10 bg-black/25 p-4 leading-7 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-200/60"
            />
          </label>
        </div>

        <div className="space-y-4">
          <label className="block rounded-3xl border border-teal-200/15 bg-teal-100/[0.045] p-4">
            <span className="font-semibold text-teal-100">3. 推理 Reasoning</span>
            <textarea
              value={argumentDraft.reasoning}
              onChange={(event) => updateDraft({ ...argumentDraft, reasoning: event.target.value })}
              rows={5}
              placeholder="解释证据如何支持主张：哪些是事实，哪些是推论？因果链在哪里？"
              className="mt-3 w-full rounded-3xl border border-white/10 bg-black/25 p-4 leading-7 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-teal-200/60"
            />
          </label>

          <label className="block rounded-3xl border border-white/10 bg-black/20 p-4">
            <span className="font-semibold text-stone-50">4. 反证 / 不确定性</span>
            <textarea
              value={argumentDraft.counterEvidence}
              onChange={(event) => updateDraft({ ...argumentDraft, counterEvidence: event.target.value })}
              rows={4}
              placeholder="哪些来源有偏向？哪些声音缺席？你的主张在什么条件下可能不成立？"
              className="mt-3 w-full rounded-3xl border border-white/10 bg-black/25 p-4 leading-7 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-200/60"
            />
          </label>

          {activeMissionWork.length > 0 ? (
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-stone-50">从任务草稿补证据</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeMissionWork.map(({ missionTitle, work }) => (
                  <button
                    key={missionTitle}
                    type="button"
                    onClick={() => appendMissionDraft(missionTitle, work.notes || work.checkedEvidence.join('；'))}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-left text-sm text-stone-300 transition hover:border-amber-100/30 hover:bg-white/[0.07]"
                  >
                    追加：{missionTitle}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-amber-200/15 bg-amber-100/[0.045] p-4">
            <h3 className="font-semibold text-amber-100">完整论证预览</h3>
            <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-stone-300">{fullArgument}</pre>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stone-500" aria-live="polite">
                {copyStatus === 'copied' ? '论证已复制。' : copyStatus === 'failed' ? '复制失败，请手动选择预览文本。' : '复制后可粘贴到作业、课堂讨论或笔记。'}
              </p>
              <button
                type="button"
                onClick={() => void copyArgument()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
              >
                {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                {copyStatus === 'copied' ? '已复制完整论证' : '复制 / 导出完整论证'}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-teal-200/15 bg-black/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-teal-100">Teacher Pack 6.0</h3>
                <p className="mt-2 text-sm leading-6 text-stone-400">复制整合 lessonPack、来源追问、检查题、误区卡、角色讨论、exit ticket 与 rubric 的课堂包。</p>
              </div>
              <button
                type="button"
                onClick={() => void copyTeacherPack()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-teal-200/25 bg-teal-100/[0.08] px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-100/[0.14]"
              >
                {teacherPackStatus === 'copied' ? <Check size={16} /> : <ClipboardList size={16} />}
                {teacherPackStatus === 'copied' ? 'Teacher Pack 已复制' : teacherPackStatus === 'failed' ? '复制失败' : '复制 Teacher Pack'}
              </button>
            </div>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-stone-400 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                <p className="font-semibold text-amber-100">探究问题</p>
                <p className="mt-1">{scenario.lessonPack.inquiryQuestion}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                <p className="font-semibold text-amber-100">课堂检查</p>
                <p className="mt-1">{scenario.lessonPack.checkQuestions.length} 个 check questions · {scenario.lessonPack.exitTickets.length} 个 exit tickets</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function KeyTermsPanel({ scenario }: { scenario: Scenario }) {
  return (
    <section className="rounded-[1.5rem] border border-teal-200/15 bg-teal-100/[0.045] p-5">
      <div className="mb-4 flex items-center gap-3 text-teal-100">
        <LibraryBig size={19} />
        <span className="text-sm uppercase tracking-[0.25em]">key terms</span>
      </div>
      <div className="grid gap-3">
        {scenario.keyTerms.map((term) => (
          <article key={term.term} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <h3 className="font-semibold text-stone-50">{term.term}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-400">{term.definition}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function CompareAnglesPanel({ scenario }: { scenario: Scenario }) {
  return (
    <section className="rounded-[1.5rem] border border-amber-200/15 bg-amber-100/[0.045] p-5">
      <div className="mb-4 flex items-center gap-3 text-amber-100">
        <Scale size={19} />
        <span className="text-sm uppercase tracking-[0.25em]">compare angles</span>
      </div>
      <div className="grid gap-3">
        {scenario.compareAngles.map((angle) => (
          <article key={angle.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <h3 className="font-semibold text-stone-50">{angle.title}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-400">{angle.prompt}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-400">
        <span className="font-medium text-amber-100/90">来源使用：</span>
        {scenario.sourceEvidenceUse}
      </p>
    </section>
  )
}

function DecisionPanel({
  scenario,
  selectedOption,
  onSelectOption,
  prefersReducedMotion,
  onOpenDebateStudio,
}: {
  scenario: Scenario
  selectedOption: DecisionOption | null
  onSelectOption: (id: string) => void
  prefersReducedMotion: boolean | null
  onOpenDebateStudio: (scenarioId: string) => void
}) {
  const outcomeMotion = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }
  const emptyMotion = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 } }

  return (
    <section id={sectionIds.decisionPanel} className="rounded-[2rem] border border-amber-200/15 bg-amber-100/[0.055] p-6">
      <div className="mb-5 flex items-center gap-3 text-amber-100">
        <ShieldAlert size={20} />
        <span className="text-sm uppercase tracking-[0.3em]">历史岔路口</span>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-50">{scenario.decision.prompt}</h2>
          <p className="mt-4 leading-8 text-stone-300">{scenario.decision.context}</p>
        </div>
        <button
          type="button"
          onClick={() => onOpenDebateStudio(scenario.id)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/[0.08] px-5 py-3 font-semibold text-amber-100 transition hover:bg-amber-100/[0.14]"
        >
          <Users size={18} />
          Launch Debate
        </button>
      </div>

      <div className="mt-6 grid gap-3" role="group" aria-label="选择你的行动">
        {scenario.decision.options.map((option) => {
          const isSelected = selectedOption?.id === option.id

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectOption(option.id)}
              className={`rounded-3xl border p-5 text-left transition ${
                isSelected
                  ? 'border-amber-200/70 bg-amber-200/15'
                  : 'border-white/10 bg-black/20 hover:border-amber-100/35 hover:bg-black/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-amber-100/80">{option.stance}</div>
                  <h3 className="mt-1 text-xl font-semibold text-stone-50">{option.label}</h3>
                  <p className="mt-2 leading-7 text-stone-400">{option.description}</p>
                </div>
                <ArrowRight className="mt-1 shrink-0 text-stone-500" size={18} />
              </div>
            </button>
          )
        })}
      </div>

      <div aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          {selectedOption ? (
            <motion.div key={selectedOption.id} {...outcomeMotion} className="mt-6 grid gap-4 lg:grid-cols-3">
              <OutcomeCard title="短期结果" text={selectedOption.immediate} />
              <OutcomeCard title="长期影响" text={selectedOption.longTerm} />
              <OutcomeCard title="历史反思" text={selectedOption.reflection} />
              <ResultShareAction scenario={scenario} option={selectedOption} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              {...emptyMotion}
              className="mt-6 rounded-3xl border border-dashed border-white/15 p-5 text-stone-400"
            >
              选择一个行动，TimeAtlas 会把你的决定放回这个时代的限制条件里。
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
        <h3 className="font-semibold text-stone-50">真实历史对照</h3>
        <p className="mt-2 leading-7 text-stone-400">{scenario.realHistory}</p>
      </div>

      <SourcesPanel scenario={scenario} />
    </section>
  )
}

const sourceTypeLabels: Record<Scenario['sources'][number]['sourceType'], string> = {
  primary: '原始材料',
  institution: '机构档案',
  scholarship: '研究著作',
}

const sourceReaderSelfCheck = ['已点名引用来源', '已区分事实与推论', '已说明来源限制或缺席声音']

function formatEvidenceCard(source: Scenario['sources'][number], scenarioTitle: string) {
  return [
    `【证据卡】${scenarioTitle} · ${source.title}`,
    `类型：${sourceTypeLabels[source.sourceType]} / ${source.creator}`,
    `可用线索：${source.excerpt}`,
    `视角：${source.perspective}`,
    `可靠边界：${source.reliabilityNote}`,
    `追问：${source.sourceQuestion}`,
    `标签：${source.evidenceTags.join('、')}`,
  ].join('\n')
}

function SourcesPanel({ scenario }: { scenario: Scenario }) {
  const [sourceTypeFilter, setSourceTypeFilter] = useState<'all' | Scenario['sources'][number]['sourceType']>('all')
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const visibleSources = scenario.sources.filter(
    (source) => sourceTypeFilter === 'all' || source.sourceType === sourceTypeFilter,
  )

  async function copyEvidenceCard(source: Scenario['sources'][number]) {
    try {
      await copyTextToClipboard(formatEvidenceCard(source, scenario.title))
      setCopyStatus(source.title)
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id={sectionIds.sourceReader} className="mt-6 rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-6" aria-labelledby="source-lab-title">
      <div className="mb-5 flex items-center gap-3 text-teal-100">
        <ScrollText size={20} />
        <span className="text-sm uppercase tracking-[0.3em]">source lab 4.0</span>
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <h3 id="source-lab-title" className="text-2xl font-semibold tracking-tight text-stone-50">Evidence Lab / Source Reader</h3>
          <p className="mt-3 leading-7 text-stone-400">{scenario.interpretationNote}</p>
          <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-400">
            先问“这条来源能证明什么”，再问“它看不见谁”。下方摘记均为教学化转述，避免长篇原文引用。
          </p>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">来源类型筛选</span>
            <select
              value={sourceTypeFilter}
              onChange={(event) => setSourceTypeFilter(event.target.value as 'all' | Scenario['sources'][number]['sourceType'])}
              className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-200/60"
            >
              <option value="all">全部来源</option>
              <option value="primary">原始材料</option>
              <option value="institution">机构档案</option>
              <option value="scholarship">研究著作</option>
            </select>
          </label>
          <p className="mt-3 text-sm text-stone-500" aria-live="polite">
            当前显示 {visibleSources.length}/{scenario.sources.length} 条来源。
            {copyStatus === 'failed' ? ' 复制失败，请手动选择证据卡内容。' : copyStatus ? ` 已复制：${copyStatus}` : ''}
          </p>
        </div>
        <div className="grid gap-3">
          {visibleSources.map((source) => {
            const content = (
              <article className="rounded-3xl border border-white/10 bg-black/25 p-5 transition hover:border-teal-100/25 hover:bg-black/35">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-teal-100/20 bg-teal-100/10 px-3 py-1 text-xs font-medium text-teal-100">
                    {sourceTypeLabels[source.sourceType]}
                  </span>
                  <span className="text-xs text-stone-500">{source.creator}</span>
                </div>
                <h4 className="font-semibold leading-6 text-stone-50">{source.title}</h4>
                <p className="mt-2 text-sm leading-6 text-stone-400">{source.relevance}</p>
                <div className="mt-4 rounded-2xl border border-amber-200/15 bg-amber-100/[0.055] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-amber-100/70">转述摘记</div>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{source.excerpt}</p>
                </div>
                <dl className="mt-4 grid gap-3 text-sm leading-6 text-stone-400">
                  <div>
                    <dt className="font-semibold text-teal-100">视角</dt>
                    <dd>{source.perspective}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-teal-100">可靠边界</dt>
                    <dd>{source.reliabilityNote}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-teal-100">史料追问</dt>
                    <dd>{source.sourceQuestion}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  {source.evidenceTags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void copyEvidenceCard(source)}
                    className="inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/[0.08] px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-100/[0.14]"
                  >
                    {copyStatus === source.title ? <Check size={16} /> : <Copy size={16} />}
                    {copyStatus === source.title ? '证据卡已复制' : '复制证据卡'}
                  </button>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-teal-100/25 hover:bg-white/[0.07]">
                      打开资料入口
                    </a>
                  ) : null}
                </div>
              </article>
            )

            return <div key={source.title}>{content}</div>
          })}
        </div>
      </div>
    </section>
  )
}

function ResultShareAction({ scenario, option }: { scenario: Scenario; option: DecisionOption }) {
  const [status, setStatus] = useState<'idle' | 'shared' | 'copied' | 'failed'>('idle')

  async function shareResult() {
    if (typeof window === 'undefined') {
      return
    }

    const url = new URL(window.location.href)
    url.searchParams.set('scenario', scenario.id)
    url.searchParams.set('option', option.id)

    const shareData = {
      title: `TimeAtlas · ${scenario.title}`,
      text: `我在「${scenario.title}」选择了「${option.label}」。`,
      url: url.toString(),
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setStatus('shared')
        return
      }

      await navigator.clipboard.writeText(url.toString())
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  const statusText = {
    idle: '分享这个结果',
    shared: '已打开分享面板',
    copied: '链接已复制',
    failed: '复制失败，请手动复制地址栏',
  }[status]

  return (
    <div className="rounded-3xl border border-amber-200/20 bg-amber-200/10 p-5 lg:col-span-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-amber-100">带走你的选择</h3>
          <p className="mt-1 text-sm leading-6 text-stone-400">生成包含当前身份和选择的链接，方便继续讨论或分享给朋友。</p>
        </div>
        <button
          type="button"
          onClick={shareResult}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/30 bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
        >
          {status === 'copied' || status === 'shared' ? <Check size={18} /> : <Share2 size={18} />}
          {statusText}
        </button>
      </div>
    </div>
  )
}

function TimelinePanel({ scenario }: { scenario: Scenario }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
      <div className="mb-5 flex items-center gap-3 text-teal-100">
        <Route size={20} />
        <span className="text-sm uppercase tracking-[0.3em]">timeline</span>
      </div>
      <div className="space-y-5">
        {scenario.timeline.map((event, index) => (
          <div key={`${event.year}-${event.title}`} className="relative pl-7">
            {index !== scenario.timeline.length - 1 ? (
              <div className="absolute bottom-[-1.4rem] left-[0.32rem] top-4 w-px bg-white/10" />
            ) : null}
            <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full" style={{ backgroundColor: scenario.accent }} />
            <div className="text-sm text-stone-500">{event.year}</div>
            <h3 className="mt-1 font-semibold text-stone-100">{event.title}</h3>
            <p className="mt-1 text-sm leading-6 text-stone-400">{event.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function About() {
  return (
    <section id="about" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/20 px-4 py-2 text-sm text-amber-100">
            <Landmark size={16} />
            为什么做这个
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-stone-50">历史不是答案库，是限制条件中的人生。</h2>
        </div>
        <div className="space-y-4 text-lg leading-8 text-stone-300">
          <p>
            TimeAtlas 的第一版先故意不做“大而全”的百科或地图，而是把焦点放在具体的人：他在哪里醒来，能吃什么，怕什么，有什么选择，又被什么制度限制。
          </p>
          <p>
            所有情节都是教育化简化，不声称替代严肃史学。每个场景现在附有来源参考与解释边界，帮助区分史料依据、研究视角和叙事化合成。
          </p>
        </div>
      </div>
    </section>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-3xl">
      <div className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-100/70">{eyebrow}</div>
      <h2 className="text-4xl font-semibold tracking-tight text-stone-50 sm:text-5xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-stone-400">{description}</p>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <div className="text-amber-100">{icon}</div>
      <div>
        <div className="text-xs text-stone-500">{label}</div>
        <div className="text-stone-200">{value}</div>
      </div>
    </div>
  )
}

function OutcomeCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <h3 className="font-semibold text-amber-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-400">{text}</p>
    </article>
  )
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400">{children}</span>
}

export default App
