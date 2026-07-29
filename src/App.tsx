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
} from 'lucide-react'
import { scenarios, type DecisionOption, type Scenario } from './data/scenarios'
import './App.css'

const defaultScenarioId = scenarios[1]?.id ?? scenarios[0].id
const missionProgressStorageKey = 'timeatlas:mission-progress'
const missionWorkStorageKey = 'timeatlas:mission-work'

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
const sortedScenarios = [...scenarios].sort((first, second) => first.year - second.year)
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

function App() {
  const prefersReducedMotion = useReducedMotion()
  const initialSelection = useMemo(getInitialSelection, [])
  const [selectedScenarioId, setSelectedScenarioId] = useState(initialSelection.scenarioId)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(initialSelection.optionId)
  const [completedMissionIdsByScenario, setCompletedMissionIdsByScenario] = useState<Record<string, string[]>>(
    loadMissionState,
  )
  const [missionWorkState, setMissionWorkState] = useState<MissionWorkState>(loadMissionWorkState)

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

  const completedMissionIds = completedMissionIdsByScenario[selectedScenario.id] ?? []
  const completedMissionCount = completedMissionIds.length
  const totalCompletedMissionCount = useMemo(
    () => getTotalCompletedMissions(completedMissionIdsByScenario),
    [completedMissionIdsByScenario],
  )
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

    const params = new URLSearchParams(window.location.search)
    params.set('scenario', selectedScenario.id)

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
  }, [selectedOption, selectedScenario])

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
      <ScenarioExperience
        scenario={selectedScenario}
        selectedOption={selectedOption}
        onSelectOption={setSelectedOptionId}
        completedMissionIds={completedMissionIds}
        completedMissionCount={completedMissionCount}
        missionWorkState={missionWorkState}
        onToggleMission={toggleMission}
        onUpdateMissionWork={setMissionWorkState}
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
              href="#about"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 font-semibold text-stone-100 transition hover:bg-white/[0.08]"
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
      const matchesSearch = normalizedQuery
        ? [scenario.title, scenario.era, scenario.location, scenario.identity, scenario.theme]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery)
        : true
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

function ScenarioExperience({
  scenario,
  selectedOption,
  onSelectOption,
  completedMissionIds,
  completedMissionCount,
  missionWorkState,
  onToggleMission,
  onUpdateMissionWork,
  prefersReducedMotion,
}: {
  scenario: Scenario
  selectedOption: DecisionOption | null
  onSelectOption: (id: string) => void
  completedMissionIds: string[]
  completedMissionCount: number
  missionWorkState: MissionWorkState
  onToggleMission: (scenarioId: string, missionId: string) => void
  onUpdateMissionWork: React.Dispatch<React.SetStateAction<MissionWorkState>>
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
            <DailyLifeGrid scenario={scenario} />
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
  const completedMissionSet = useMemo(() => new Set(completedMissionIds), [completedMissionIds])
  const missionTotal = scenario.missions.length
  const progressLabel = `${completedMissionCount}/${missionTotal}`
  const selectedMission = scenario.missions.find((mission) => mission.id === selectedMissionId) ?? scenario.missions[0]
  const selectedMissionWorkKey = selectedMission ? getMissionWorkKey(scenario.id, selectedMission.id) : ''
  const selectedMissionWork = missionWorkState[selectedMissionWorkKey] ?? { notes: '', checkedEvidence: [] }
  const draftedMissionCount = countScenarioMissionWork(scenario, missionWorkState)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (!scenario.missions.some((mission) => mission.id === selectedMissionId)) {
      setSelectedMissionId(scenario.missions[0]?.id ?? '')
    }
  }, [scenario, selectedMissionId])

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

  async function copyLearningOutput() {
    if (!selectedMission || typeof navigator === 'undefined' || !navigator.clipboard) {
      setCopyStatus('failed')
      return
    }

    const checkedEvidence = selectedMissionWork.checkedEvidence.length
      ? selectedMissionWork.checkedEvidence.map((item) => `- ${item}`).join('\n')
      : '- 尚未勾选证据'
    const learningOutput = `TimeAtlas 学习输出\n场景：${scenario.title}\n任务：${selectedMission.title}\n交付物：${selectedMission.deliverable}\n证据清单：\n${checkedEvidence}\n草稿笔记：\n${selectedMissionWork.notes || '尚未填写'}\n反思：${selectedMission.reflectionPrompt}`

    try {
      await navigator.clipboard.writeText(learningOutput)
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
        <div className="grid content-start gap-3" role="group" aria-label={`${scenario.title} 的历史任务`}>
          {scenario.missions.map((mission) => {
            const isComplete = completedMissionSet.has(mission.id)
            const isSelected = selectedMission.id === mission.id
            const work = missionWorkState[getMissionWorkKey(scenario.id, mission.id)]
            const hasDraft = Boolean(work?.notes.trim() || work?.checkedEvidence.length)

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
                      <Tag>{mission.difficulty}</Tag>
                      <Tag>{mission.estimatedMinutes} 分钟</Tag>
                      <Tag>{isComplete ? '已完成' : '进行中'}</Tag>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="space-y-4">
          <section className="rounded-[1.5rem] border border-amber-200/15 bg-[#13100c]/85 p-5" aria-labelledby="active-mission-title">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex flex-wrap gap-2 text-xs text-stone-400">
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

function SourcesPanel({ scenario }: { scenario: Scenario }) {
  return (
    <section className="mt-6 rounded-[2rem] border border-teal-200/15 bg-teal-100/[0.045] p-6">
      <div className="mb-5 flex items-center gap-3 text-teal-100">
        <ScrollText size={20} />
        <span className="text-sm uppercase tracking-[0.3em]">sources & boundaries</span>
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-stone-50">可信来源层</h3>
          <p className="mt-3 leading-7 text-stone-400">{scenario.interpretationNote}</p>
        </div>
        <div className="grid gap-3">
          {scenario.sources.map((source) => {
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
              </article>
            )

            return source.url ? (
              <a key={source.title} href={source.url} target="_blank" rel="noreferrer" className="block">
                {content}
              </a>
            ) : (
              <div key={source.title}>{content}</div>
            )
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
