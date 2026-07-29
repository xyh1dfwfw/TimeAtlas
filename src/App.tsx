import { useEffect, useMemo, useState } from 'react'
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
  compareLenses,
  scenarios,
  type AtlasInquiryPath,
  type CompareLens,
  type ActivityPack,
  type ActivityPackMode,
  type DecisionOption,
  type LessonPackMode,
  type Mission,
  type MissionTaskType,
  type Scenario,
} from './data/scenarios'
import './App.css'

const defaultScenarioId = scenarios[1]?.id ?? scenarios[0].id
const defaultCompareScenarioAId = scenarios[0]?.id ?? defaultScenarioId
const defaultCompareScenarioBId = scenarios.find((scenario) => scenario.id !== defaultCompareScenarioAId)?.id ?? defaultScenarioId
const defaultCompareLensKey = compareLenses[0]?.key ?? 'daily-life'
const missionProgressStorageKey = 'timeatlas:mission-progress'
const missionWorkStorageKey = 'timeatlas:mission-work'
const argumentStudioStorageKey = 'timeatlas:argument-studio-drafts'
const workspaceStorageKey = 'timeatlas:atlas-workspace-8'

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


type WorkspaceEntry = {
  notes: string
  checkedEvidence: string[]
  completed: boolean
  updatedAt?: string
}

type WorkspaceState = {
  atlasMissions: Record<string, WorkspaceEntry>
  inquiryPaths: Record<string, WorkspaceEntry>
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

type TaskLibrarySource = 'mission' | 'activity' | 'lesson' | 'inquiry' | 'compare'
type DurationBand = 'short' | 'medium' | 'long' | 'extended'

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
  formatSheet: () => string
}

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

function formatLearningArchive(
  missionWorkState: MissionWorkState,
  completedMissionIdsByScenario: Record<string, string[]>,
  workspaceState: WorkspaceState,
) {
  const workspaceStats = getWorkspaceStats(workspaceState)
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

  const workspaceEntries = getWorkspaceEntries(workspaceState).filter(({ entry }) => hasWorkspaceEntryActivity(entry))

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

  if (lines.length <= 12) {
    lines.push('尚未保存任何任务草稿、跨场景草稿或完成记录。')
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

function formatGenericLibraryTaskSheet(task: LibraryTask) {
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
}: {
  onOpenScenario: (id: string) => void
  onLoadCompare: (path: AtlasInquiryPath) => void
  onLoadCompareLens: (lens: CompareLens) => void
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
        onPrimaryAction: () => onOpenScenario(scenario.id),
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
        onPrimaryAction: () => onOpenScenario(scenario.id),
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
        onPrimaryAction: () => onOpenScenario(scenario.id),
        formatSheet: () => formatLessonFlowSheet(scenario, mode),
      }

      task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, ...tags, ...flow.steps, ...scenario.lessonPack.quickStart, ...scenario.lessonPack.exitTickets].join(' ').toLowerCase()
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
      onSecondaryAction: () => pathScenarios[0] ? onOpenScenario(pathScenarios[0].id) : undefined,
      formatSheet: () => formatAtlasInquiryPack(path),
    }

    task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, path.whyTheseScenarios, ...tags, ...path.tasks, ...path.discussionMoves, ...path.rubric].join(' ').toLowerCase()
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
      formatSheet: () => formatCompareLensTemplate(lens),
    }

    task.searchText = [task.title, task.context, task.category, task.sourceLabel, task.summary, task.deliverable, lens.description, ...tags, ...lens.evidenceChecklist, ...lens.outputTemplate, ...lens.rubric].join(' ').toLowerCase()
    tasks.push(task)
  })

  return tasks
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
  const [selectedScenarioId, setSelectedScenarioId] = useState(initialSelection.scenarioId)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(initialSelection.optionId)
  const [compareScenarioAId, setCompareScenarioAId] = useState(initialCompareSelection.compareAId)
  const [compareScenarioBId, setCompareScenarioBId] = useState(initialCompareSelection.compareBId)
  const [selectedLensKey, setSelectedLensKey] = useState(initialCompareSelection.lensKey)
  const [completedMissionIdsByScenario, setCompletedMissionIdsByScenario] = useState<Record<string, string[]>>(
    loadMissionState,
  )
  const [missionWorkState, setMissionWorkState] = useState<MissionWorkState>(loadMissionWorkState)
  const [argumentDraftState, setArgumentDraftState] = useState<ArgumentDraftState>(loadArgumentDraftState)
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>(loadWorkspaceState)

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

  const completedMissionIds = completedMissionIdsByScenario[selectedScenario.id] ?? []
  const completedMissionCount = completedMissionIds.length
  const totalCompletedMissionCount = useMemo(
    () => getTotalCompletedMissions(completedMissionIdsByScenario),
    [completedMissionIdsByScenario],
  )
  const workspaceStats = useMemo(() => getWorkspaceStats(workspaceState), [workspaceState])
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
      persistWorkspaceState(workspaceState)
    } catch {
      // Browser storage persistence is progressive enhancement; in-memory state still works.
    }
  }, [workspaceState])

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
  }, [compareScenarioA, compareScenarioB, selectedLens, selectedOption, selectedScenario])

  function selectScenario(id: string) {
    if (!getScenarioById(id)) {
      return
    }

    setSelectedScenarioId(id)
    setSelectedOptionId(null)
    document.getElementById('experience')?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
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

  function loadCompareFromInquiryPath(path: AtlasInquiryPath) {
    const validScenarioIds = path.scenarioIds.filter((id) => getScenarioById(id))
    const firstScenarioId = validScenarioIds[0] ?? defaultCompareScenarioAId
    const secondScenarioId = validScenarioIds.find((id) => id !== firstScenarioId) ?? getFallbackCompareScenarioId(firstScenarioId)

    setCompareScenarioAId(firstScenarioId)
    setCompareScenarioBId(secondScenarioId)
    setSelectedLensKey(path.lensKey)

    window.requestAnimationFrame(() => {
      document.getElementById('compare-lab')?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }

  function loadCompareLens(lens: CompareLens) {
    setSelectedLensKey(lens.key)

    window.requestAnimationFrame(() => {
      document.getElementById('compare-lab')?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0a08] text-stone-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(215,168,75,0.22),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(124,199,178,0.14),transparent_28%),linear-gradient(180deg,#15110b_0%,#0b0a08_46%,#050505_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:72px_72px]" />

      <Hero prefersReducedMotion={prefersReducedMotion} />
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
      <PortfolioPanel
        completedMissionIdsByScenario={completedMissionIdsByScenario}
        missionWorkState={missionWorkState}
        workspaceState={workspaceState}
        workspaceStats={workspaceStats}
      />
      <TaskLibraryPanel
        onOpenScenario={selectScenario}
        onLoadCompare={loadCompareFromInquiryPath}
        onLoadCompareLens={loadCompareLens}
      />
      <AtlasMissionsPanel
        workspaceState={workspaceState}
        onUpdateWorkspaceState={setWorkspaceState}
      />
      <AtlasInquiryPathsPanel
        workspaceState={workspaceState}
        onUpdateWorkspaceState={setWorkspaceState}
        onOpenScenario={selectScenario}
        onLoadCompare={loadCompareFromInquiryPath}
      />
      <CompareLabPanel
        scenarioA={compareScenarioA}
        scenarioB={compareScenarioB}
        selectedLens={selectedLens}
        onSelectScenarioA={selectCompareScenarioA}
        onSelectScenarioB={selectCompareScenarioB}
        onSelectLens={setSelectedLensKey}
      />
      <ScenarioExperience
        scenario={selectedScenario}
        selectedOption={selectedOption}
        onSelectOption={setSelectedOptionId}
        completedMissionIds={completedMissionIds}
        completedMissionCount={completedMissionCount}
        missionWorkState={missionWorkState}
        argumentDraft={argumentDraftState[selectedScenario.id] ?? getEmptyArgumentDraft()}
        onToggleMission={toggleMission}
        onUpdateMissionWork={setMissionWorkState}
        onUpdateArgumentDraft={setArgumentDraftState}
        prefersReducedMotion={prefersReducedMotion}
      />
      <About />
    </main>
  )
}

function Hero({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
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
            <a
              href="#gallery"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 font-semibold text-stone-950 transition hover:bg-amber-200"
            >
              开始探索
              <ArrowRight className="transition group-hover:translate-x-1" size={18} />
            </a>
            <a
              href="#atlas-inquiry-paths"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 font-semibold text-stone-100 transition hover:bg-white/[0.08]"
            >
              探究路径
              <Route size={18} />
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 font-semibold text-stone-300 transition hover:bg-white/[0.06] hover:text-stone-100"
            >
              项目理念
            </a>
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
                    <span className="font-medium">地图以后会长出来，第一版先从人的命运开始。</span>
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

function PortfolioPanel({
  completedMissionIdsByScenario,
  missionWorkState,
  workspaceState,
  workspaceStats,
}: {
  completedMissionIdsByScenario: Record<string, string[]>
  missionWorkState: MissionWorkState
  workspaceState: WorkspaceState
  workspaceStats: WorkspaceStats
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const completedCount = getTotalCompletedMissions(completedMissionIdsByScenario)
  const draftCount = scenarios.reduce((count, scenario) => count + countScenarioMissionWork(scenario, missionWorkState), 0)
  const activeScenarioCount = scenarios.filter((scenario) => {
    const hasCompleted = (completedMissionIdsByScenario[scenario.id] ?? []).length > 0
    const hasDraft = countScenarioMissionWork(scenario, missionWorkState) > 0

    return hasCompleted || hasDraft
  }).length
  const recentEntries = Object.entries(missionWorkState)
    .filter(([, work]) => work.notes.trim() || work.checkedEvidence.length)
    .sort(([, first], [, second]) => (second.updatedAt ?? '').localeCompare(first.updatedAt ?? ''))
    .slice(0, 3)

  async function copyArchive() {
    try {
      await copyTextToClipboard(formatLearningArchive(missionWorkState, completedMissionIdsByScenario, workspaceState))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="portfolio-title">
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
            {recentEntries.length > 0 || workspaceStats.recentEntries.length > 0 ? (
              <div className="mt-3 space-y-2">
                {workspaceStats.recentEntries.map(({ key, title, category, entry }) => (
                  <div key={key} className="rounded-2xl border border-orange-200/15 bg-orange-100/[0.045] p-3 text-sm leading-6 text-stone-400">
                    <div className="font-medium text-stone-100">{title}</div>
                    <div>{category} · {entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : '未记录时间'} · {entry.completed ? '已完成' : '草稿'}</div>
                  </div>
                ))}
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

function TaskLibraryPanel({
  onOpenScenario,
  onLoadCompare,
  onLoadCompareLens,
}: {
  onOpenScenario: (id: string) => void
  onLoadCompare: (path: AtlasInquiryPath) => void
  onLoadCompareLens: (lens: CompareLens) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [scenarioFilter, setScenarioFilter] = useState('all')
  const [durationFilter, setDurationFilter] = useState<'all' | DurationBand>('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | TaskLibrarySource>('all')
  const [sourceBasedOnly, setSourceBasedOnly] = useState(false)
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const libraryTasks = useMemo(
    () => buildTaskLibraryTasks({ onOpenScenario, onLoadCompare, onLoadCompareLens }),
    [onOpenScenario, onLoadCompare, onLoadCompareLens],
  )
  const categoryOptions = useMemo(() => [...new Set(libraryTasks.map((task) => task.category))].sort((first, second) => first.localeCompare(second, 'zh-Hans-CN')), [libraryTasks])
  const durationBands = useMemo(() => [...new Set(libraryTasks.map((task) => task.durationBand))], [libraryTasks])
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const visibleTasks = useMemo(
    () => libraryTasks.filter((task) => {
      const matchesSearch = !normalizedSearchQuery || task.searchText.includes(normalizedSearchQuery)
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter
      const matchesScenario = scenarioFilter === 'all' || task.scenarioId === scenarioFilter
      const matchesDuration = durationFilter === 'all' || task.durationBand === durationFilter
      const matchesSource = sourceFilter === 'all' || task.source === sourceFilter
      const matchesSourceBased = !sourceBasedOnly || task.sourceBased

      return matchesSearch && matchesCategory && matchesScenario && matchesDuration && matchesSource && matchesSourceBased
    }),
    [categoryFilter, durationFilter, libraryTasks, normalizedSearchQuery, scenarioFilter, sourceBasedOnly, sourceFilter],
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
              <option value="all">全部来源</option>
              <option value="mission">Scenario Missions</option>
              <option value="activity">Activity Packs</option>
              <option value="lesson">Lesson Pack</option>
              <option value="inquiry">Inquiry Paths</option>
              <option value="compare">Compare Lenses</option>
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
          {visibleTasks.slice(0, 36).map((task) => (
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
                    {task.source === 'compare' || task.source === 'inquiry' ? <Scale size={16} /> : <ArrowRight size={16} />}
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

        {visibleTasks.length > 36 ? (
          <p className="mt-4 text-sm text-stone-500">已显示前 36 个结果；可继续使用搜索或筛选缩小范围。</p>
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

function AtlasMissionsPanel({
  workspaceState,
  onUpdateWorkspaceState,
}: {
  workspaceState: WorkspaceState
  onUpdateWorkspaceState: React.Dispatch<React.SetStateAction<WorkspaceState>>
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
    <section className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="atlas-missions-title">
      <div className="rounded-[2rem] border border-amber-200/15 bg-amber-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-amber-100">
          <Compass size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">atlas missions</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="atlas-missions-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              跨场景挑战 · Atlas Workspace 8.0
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
  onUpdateWorkspaceState: React.Dispatch<React.SetStateAction<WorkspaceState>>
  onOpenScenario: (id: string) => void
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
              五条策展式跨场景探究路径现在接入 Atlas Workspace：可勾选路径任务、保存探究草稿、标记完成，并复制 inquiry pack + user draft。
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            {atlasInquiryPaths.length} 条路径 · {completedCount} 条已完成 · 直接连接 Compare Lab
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-5">
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
              <article key={path.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 xl:col-span-5">
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
                          onClick={() => pathScenarios[0] ? onOpenScenario(pathScenarios[0].id) : undefined}
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
    'Atlas Workspace 8.0 用户进度：',
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

  return sectionsByLens[lens.key]
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
  onSelectScenarioA,
  onSelectScenarioB,
  onSelectLens,
}: {
  scenarioA: Scenario
  scenarioB: Scenario
  selectedLens: CompareLens
  onSelectScenarioA: (id: string) => void
  onSelectScenarioB: (id: string) => void
  onSelectLens: (key: CompareLens['key']) => void
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const scenarioAEvidence = getLensEvidenceSections(scenarioA, selectedLens)
  const scenarioBEvidence = getLensEvidenceSections(scenarioB, selectedLens)

  async function copyAssignment() {
    try {
      await copyTextToClipboard(formatCompareAssignment(scenarioA, scenarioB, selectedLens))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section id="compare-lab" className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-labelledby="compare-lab-title">
      <div className="rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-5">
        <div className="mb-4 flex items-center gap-3 text-teal-100">
          <Scale size={20} />
          <span className="text-sm uppercase tracking-[0.3em]">compare lab</span>
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <div>
            <h2 id="compare-lab-title" className="text-3xl font-semibold tracking-tight text-stone-50">
              跨场景比较实验室 / 作业生成器
            </h2>
            <p className="mt-3 leading-7 text-stone-400">
              选择两个不同历史身份和一个比较镜头，TimeAtlas 会抽取相关字段，生成可直接用于课堂的比较作业。
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
              <h3 className="font-semibold text-teal-100">当前镜头</h3>
              <p className="mt-2 text-sm leading-6 text-stone-400">{selectedLens.description}</p>
              <p className="mt-3 rounded-2xl border border-teal-100/15 bg-teal-100/[0.045] p-3 text-sm leading-6 text-stone-300">
                {selectedLens.prompt}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
              {[{ scenario: scenarioA, evidence: scenarioAEvidence }, { scenario: scenarioB, evidence: scenarioBEvidence }].map(({ scenario, evidence }) => (
                <article key={scenario.id} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                  <div className="h-1.5" style={{ backgroundColor: scenario.accent }} />
                  <div className="p-5">
                    <div className="mb-3 text-xs uppercase tracking-[0.25em] text-stone-500">{scenario.era} · {scenario.location}</div>
                    <h3 className="text-2xl font-semibold tracking-tight text-stone-50">{scenario.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{scenario.identity} · {scenario.role}</p>
                    <div className="mt-4 space-y-3">
                      {evidence.map((section) => (
                        <div key={`${scenario.id}-${section.label}`} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                          <div className="text-xs font-medium uppercase tracking-[0.18em] text-amber-100/80">{section.label}</div>
                          <p className="mt-2 text-sm leading-6 text-stone-400">{section.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

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
                  {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                  {copyStatus === 'copied' ? '作业已复制' : copyStatus === 'failed' ? '复制失败' : '复制作业'}
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
  selectedOption,
  onSelectOption,
  completedMissionIds,
  completedMissionCount,
  missionWorkState,
  argumentDraft,
  onToggleMission,
  onUpdateMissionWork,
  onUpdateArgumentDraft,
  prefersReducedMotion,
}: {
  scenario: Scenario
  selectedOption: DecisionOption | null
  onSelectOption: (id: string) => void
  completedMissionIds: string[]
  completedMissionCount: number
  missionWorkState: MissionWorkState
  argumentDraft: ArgumentDraft
  onToggleMission: (scenarioId: string, missionId: string) => void
  onUpdateMissionWork: React.Dispatch<React.SetStateAction<MissionWorkState>>
  onUpdateArgumentDraft: React.Dispatch<React.SetStateAction<ArgumentDraftState>>
  prefersReducedMotion: boolean | null
}) {
  const scenarioMotion = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -16 },
        transition: { duration: 0.35 },
      }

  return (
    <section id="experience" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <AnimatePresence mode="wait">
        <motion.div key={scenario.id} {...scenarioMotion} className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="space-y-6">
            <div className="sticky top-6 space-y-6">
              <ScenarioPassport scenario={scenario} />
              <TimelinePanel scenario={scenario} />
            </div>
          </aside>

          <div className="space-y-6">
            <NarrativePanel scenario={scenario} />
            <SceneReaderPanel scenario={scenario} />
            <DailyLifeGrid scenario={scenario} />
            <LessonPackPanel scenario={scenario} />
            <ActivityPackPanel scenario={scenario} />
            <MissionBoard
              scenario={scenario}
              completedMissionIds={completedMissionIds}
              completedMissionCount={completedMissionCount}
              missionWorkState={missionWorkState}
              onToggleMission={onToggleMission}
              onUpdateMissionWork={onUpdateMissionWork}
            />
            <DecisionPanel
              scenario={scenario}
              selectedOption={selectedOption}
              onSelectOption={onSelectOption}
              prefersReducedMotion={prefersReducedMotion}
            />
            <ArgumentStudioPanel
              scenario={scenario}
              selectedOption={selectedOption}
              missionWorkState={missionWorkState}
              argumentDraft={argumentDraft}
              onUpdateArgumentDraft={onUpdateArgumentDraft}
            />
          </div>
        </motion.div>
      </AnimatePresence>
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
    <section className="rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-6 shadow-2xl shadow-black/20" aria-labelledby="scene-reader-title">
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
    <section className="grid gap-4 md:grid-cols-2">
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
    <section className="rounded-[2rem] border border-amber-200/15 bg-amber-100/[0.045] p-6 shadow-2xl shadow-black/20" aria-labelledby="lesson-pack-title">
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
    <section id="activity-packs" className="rounded-[2rem] border border-orange-200/15 bg-orange-100/[0.045] p-6 shadow-2xl shadow-black/20" aria-labelledby="activity-pack-title">
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
  onUpdateMissionWork: React.Dispatch<React.SetStateAction<MissionWorkState>>
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
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
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
  onUpdateArgumentDraft: React.Dispatch<React.SetStateAction<ArgumentDraftState>>
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
    <section className="rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-6 shadow-2xl shadow-black/20" aria-labelledby="argument-studio-title">
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
}: {
  scenario: Scenario
  selectedOption: DecisionOption | null
  onSelectOption: (id: string) => void
  prefersReducedMotion: boolean | null
}) {
  const outcomeMotion = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }
  const emptyMotion = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 } }

  return (
    <section className="rounded-[2rem] border border-amber-200/15 bg-amber-100/[0.055] p-6">
      <div className="mb-5 flex items-center gap-3 text-amber-100">
        <ShieldAlert size={20} />
        <span className="text-sm uppercase tracking-[0.3em]">历史岔路口</span>
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-stone-50">{scenario.decision.prompt}</h2>
      <p className="mt-4 leading-8 text-stone-300">{scenario.decision.context}</p>

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
    <section className="mt-6 rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-6" aria-labelledby="source-lab-title">
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

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400">{children}</span>
}

export default App
