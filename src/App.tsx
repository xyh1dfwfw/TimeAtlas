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
  Compass,
  Landmark,
  LibraryBig,
  MapPin,
  Route,
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

const optionCounts = scenarios.map((scenario) => scenario.decision.options.length)
const minOptionCount = Math.min(...optionCounts)
const maxOptionCount = Math.max(...optionCounts)
const totalSourceCount = scenarios.reduce((count, scenario) => count + scenario.sources.length, 0)
const totalMissionCount = scenarios.reduce((count, scenario) => count + scenario.missions.length, 0)
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

function loadMissionState() {
  if (typeof window === 'undefined') {
    return {} as Record<string, string[]>
  }

  try {
    const rawState = window.sessionStorage.getItem('timeatlas:mission-progress')
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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.sessionStorage.setItem('timeatlas:mission-progress', JSON.stringify(completedMissionIdsByScenario))
    } catch {
      // Session persistence is progressive enhancement; in-memory state still works.
    }
  }, [completedMissionIdsByScenario])

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
      <ScenarioGallery selectedScenarioId={selectedScenarioId} onSelect={selectScenario} />
      <ScenarioExperience
        scenario={selectedScenario}
        selectedOption={selectedOption}
        onSelectOption={setSelectedOptionId}
        completedMissionIds={completedMissionIds}
        completedMissionCount={completedMissionCount}
        onToggleMission={toggleMission}
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
                <span>742 → 1940</span>
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
  onSelect,
}: {
  selectedScenarioId: string
  onSelect: (id: string) => void
}) {
  return (
    <section id="gallery" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <SectionHeader
        eyebrow="选择历史身份"
        title="先从五个普通人的世界开始"
        description="他们不一定出现在史书标题里，却站在贸易、城市、战争、制度变化的交汇处。"
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {scenarios.map((scenario) => {
          const isSelected = selectedScenarioId === scenario.id

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
                  <Tag>{scenario.year}</Tag>
                </div>
              </div>
            </button>
          )
        })}
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
  onToggleMission,
  prefersReducedMotion,
}: {
  scenario: Scenario
  selectedOption: DecisionOption | null
  onSelectOption: (id: string) => void
  completedMissionIds: string[]
  completedMissionCount: number
  onToggleMission: (scenarioId: string, missionId: string) => void
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
              onToggleMission={onToggleMission}
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
  onToggleMission,
}: {
  scenario: Scenario
  completedMissionIds: string[]
  completedMissionCount: number
  onToggleMission: (scenarioId: string, missionId: string) => void
}) {
  const completedMissionSet = useMemo(() => new Set(completedMissionIds), [completedMissionIds])
  const missionTotal = scenario.missions.length
  const progressLabel = `${completedMissionCount}/${missionTotal}`

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
            不只读情节：完成任务、使用证据、比较角度，把这个身份放回更大的历史结构中。
          </p>
        </div>
        <div
          className="rounded-3xl border border-amber-200/20 bg-amber-200/10 px-5 py-4 text-amber-100"
          aria-label={`当前场景任务完成进度：${progressLabel}`}
        >
          <div className="text-xs uppercase tracking-[0.28em] text-amber-100/70">session progress</div>
          <div className="mt-1 text-3xl font-semibold">{progressLabel}</div>
          <div className="text-sm text-stone-400">当前身份已完成任务</div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-3" role="group" aria-label={`${scenario.title} 的历史任务`}>
          {scenario.missions.map((mission) => {
            const isComplete = completedMissionSet.has(mission.id)

            return (
              <button
                key={mission.id}
                type="button"
                aria-pressed={isComplete}
                onClick={() => onToggleMission(scenario.id, mission.id)}
                className={`group rounded-3xl border p-5 text-left transition ${
                  isComplete
                    ? 'border-teal-100/35 bg-teal-100/[0.08]'
                    : 'border-white/10 bg-black/20 hover:border-amber-100/30 hover:bg-black/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={isComplete ? 'mt-1 text-teal-100' : 'mt-1 text-stone-500 group-hover:text-amber-100'}>
                    {isComplete ? <CheckCircle2 size={21} /> : <Circle size={21} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-50">{mission.title}</h3>
                    <p className="mt-2 leading-7 text-stone-400">{mission.instruction}</p>
                    <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-stone-400">
                      <span className="font-medium text-amber-100/90">证据用法：</span>
                      {mission.evidenceUse}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="space-y-4">
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
