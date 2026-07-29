import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Compass,
  Landmark,
  MapPin,
  Route,
  ScrollText,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react'
import { scenarios, type DecisionOption, type Scenario } from './data/scenarios'
import './App.css'

const statItems = [
  { value: '5', label: '历史身份' },
  { value: '3', label: '选择分支 / 身份' },
  { value: '0', label: '后端依赖' },
]

function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(scenarios[1].id)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)

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

  function selectScenario(id: string) {
    setSelectedScenarioId(id)
    setSelectedOptionId(null)
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0a08] text-stone-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(215,168,75,0.22),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(124,199,178,0.14),transparent_28%),linear-gradient(180deg,#15110b_0%,#0b0a08_46%,#050505_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:72px_72px]" />

      <Hero />
      <ScenarioGallery selectedScenarioId={selectedScenarioId} onSelect={selectScenario} />
      <ScenarioExperience
        scenario={selectedScenario}
        selectedOption={selectedOption}
        onSelectOption={setSelectedOptionId}
      />
      <About />
    </main>
  )
}

function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col justify-center px-5 py-10 sm:px-8 lg:px-10">
      <div className="absolute left-1/2 top-8 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-amber-200/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.35em] text-amber-100/70 backdrop-blur md:flex">
        <Compass size={14} />
        TimeAtlas · interactive history
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
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

          <div className="grid max-w-xl grid-cols-3 gap-3 pt-4">
            {statItems.map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <div className="text-3xl font-semibold text-amber-200">{item.value}</div>
                <div className="mt-1 text-sm text-stone-400">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="relative"
        >
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
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => onSelect(scenario.id)}
            className={`group rounded-[1.75rem] border p-5 text-left transition duration-300 ${
              selectedScenarioId === scenario.id
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
        ))}
      </div>
    </section>
  )
}

function ScenarioExperience({
  scenario,
  selectedOption,
  onSelectOption,
}: {
  scenario: Scenario
  selectedOption: DecisionOption | null
  onSelectOption: (id: string) => void
}) {
  return (
    <section id="experience" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]"
        >
          <aside className="space-y-6">
            <div className="sticky top-6 space-y-6">
              <ScenarioPassport scenario={scenario} />
              <TimelinePanel scenario={scenario} />
            </div>
          </aside>

          <div className="space-y-6">
            <NarrativePanel scenario={scenario} />
            <DailyLifeGrid scenario={scenario} />
            <DecisionPanel
              scenario={scenario}
              selectedOption={selectedOption}
              onSelectOption={onSelectOption}
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
      </div>
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

function DecisionPanel({
  scenario,
  selectedOption,
  onSelectOption,
}: {
  scenario: Scenario
  selectedOption: DecisionOption | null
  onSelectOption: (id: string) => void
}) {
  return (
    <section className="rounded-[2rem] border border-amber-200/15 bg-amber-100/[0.055] p-6">
      <div className="mb-5 flex items-center gap-3 text-amber-100">
        <ShieldAlert size={20} />
        <span className="text-sm uppercase tracking-[0.3em]">历史岔路口</span>
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-stone-50">{scenario.decision.prompt}</h2>
      <p className="mt-4 leading-8 text-stone-300">{scenario.decision.context}</p>

      <div className="mt-6 grid gap-3">
        {scenario.decision.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectOption(option.id)}
            className={`rounded-3xl border p-5 text-left transition ${
              selectedOption?.id === option.id
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
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedOption ? (
          <motion.div
            key={selectedOption.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 grid gap-4 lg:grid-cols-3"
          >
            <OutcomeCard title="短期结果" text={selectedOption.immediate} />
            <OutcomeCard title="长期影响" text={selectedOption.longTerm} />
            <OutcomeCard title="历史反思" text={selectedOption.reflection} />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-3xl border border-dashed border-white/15 p-5 text-stone-400"
          >
            选择一个行动，TimeAtlas 会把你的决定放回这个时代的限制条件里。
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
        <h3 className="font-semibold text-stone-50">真实历史对照</h3>
        <p className="mt-2 leading-7 text-stone-400">{scenario.realHistory}</p>
        <p className="mt-3 text-sm leading-6 text-stone-500">{scenario.sourceNote}</p>
      </div>
    </section>
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
            所有情节都是教育化简化，不声称替代严肃史学。后续版本会为每个场景补充引用来源、地图图层、多语言和更多历史身份。
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
