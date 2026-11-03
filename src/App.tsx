import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { PeerOnboarding, PeerRoom, type PeerProfile } from './PeerConnect'

const A = '/assets'
const imgSearch = `${A}/f3881.svg`
const imgMapPin = `${A}/1eb40.svg`
const imgChevronDown = `${A}/1eb57.svg`
const imgMapPin1 = `${A}/45e43.svg`
const imgClock = `${A}/ed3cb.svg`
const imgShield = `${A}/6d615.svg`
const imgMessage = `${A}/7fd9e.svg`

type Provider = {
  id: number
  name: string
  title: string
  initials: string
  format: 'Online' | 'In-person' | 'Hybrid'
  openings: number
  bio: string
  location: string
  intro: number
  tags: string[]
  specialty: string
  sliding: boolean
  slots: string[]
  insurance: string[]
}

const PROVIDERS: Provider[] = [
  {
    id: 1,
    name: 'Maya Chen, LMFT',
    title: 'Licensed Marriage and Family Therapist',
    initials: 'MC',
    format: 'Online',
    openings: 4,
    bio: 'Specializes in anxiety, depression, and relationship therapy for adults and couples. Warm, collaborative approach with a focus on practical tools and long-term growth.',
    location: 'San Francisco, CA',
    intro: 15,
    tags: ['Anxiety', 'Depression', 'Couples'],
    specialty: 'Anxiety & depression',
    sliding: true,
    slots: ['Tue 10:00 AM', 'Wed 2:30 PM', 'Thu 4:00 PM', 'Fri 9:00 AM'],
    insurance: ['Aetna', 'Cigna', 'Blue Cross Blue Shield'],
  },
  {
    id: 2,
    name: 'Jordan Patel, LCSW',
    title: 'Licensed Clinical Social Worker',
    initials: 'JP',
    format: 'In-person',
    openings: 2,
    bio: 'Focuses on trauma-informed care, stress management, and life transitions. Calm, grounded approach with an emphasis on safety and sustainable progress.',
    location: 'Oakland, CA',
    intro: 30,
    tags: ['Anxiety'],
    specialty: 'Trauma & stress',
    sliding: false,
    slots: ['Mon 1:00 PM', 'Thu 11:30 AM'],
    insurance: ['Aetna', 'Kaiser Permanente', 'UnitedHealthcare'],
  },
  {
    id: 3,
    name: 'Elena Brooks, PsyD',
    title: 'Licensed Clinical Psychologist',
    initials: 'EB',
    format: 'Online',
    openings: 6,
    bio: 'Supports individuals navigating grief, burnout, and major life changes. Structured yet empathetic approach with a focus on clarity, coping skills, and next steps.',
    location: 'Los Angeles, CA',
    intro: 20,
    tags: ['Depression'],
    specialty: 'Grief & burnout',
    sliding: true,
    slots: ['Mon 9:00 AM', 'Tue 3:00 PM', 'Wed 12:00 PM', 'Thu 5:30 PM', 'Fri 10:30 AM', 'Sat 9:30 AM'],
    insurance: ['Cigna', 'UnitedHealthcare', 'Blue Cross Blue Shield'],
  },
  {
    id: 4,
    name: 'Daniel Kim, LPC',
    title: 'Licensed Professional Counselor',
    initials: 'DK',
    format: 'Hybrid',
    openings: 3,
    bio: 'Works with young adults on identity, relationships, and career uncertainty. Engaging, strengths-based approach that balances exploration with practical next steps.',
    location: 'Austin, TX',
    intro: 15,
    tags: ['Couples', 'Anxiety'],
    specialty: 'Identity & relationships',
    sliding: false,
    slots: ['Tue 6:00 PM', 'Wed 11:00 AM', 'Fri 2:00 PM'],
    insurance: ['Kaiser Permanente', 'UnitedHealthcare'],
  },
]

const INSURERS = ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Kaiser Permanente', 'UnitedHealthcare']
const SELF_PAY = 'Self-pay'
const NO_INSURANCE = 'Not selected'

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable */
    }
  }, [key, value])
  return [value, setValue] as const
}

const covers = (p: Provider, plan: string) => plan === NO_INSURANCE || (plan === SELF_PAY ? p.sliding : p.insurance.includes(plan))

const CHIPS = ['Anxiety', 'Depression', 'Couples', 'Online', 'Sliding scale']
const SORTS = ['Best match', 'Most openings', 'Shortest intro call', 'Name A–Z']
const TABS = ['Find care', 'Resources', 'Support', 'Account']

const btnSecondary =
  "bg-white border border-[#d1d5db] rounded-[10px] font-['Inter:Semi_Bold'] font-semibold text-[#1f2937] text-[14px] cursor-pointer hover:bg-[#f9fafb] transition-colors focus-visible:outline-2 focus-visible:outline-[#426653]"
const btnPrimary =
  "bg-[#426653] rounded-[10px] font-['Inter:Semi_Bold'] font-semibold text-white text-[14px] cursor-pointer hover:bg-[#365545] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#426653] disabled:opacity-50 disabled:cursor-not-allowed"
const card = 'bg-white border border-[#e5e7eb] rounded-[16px] shadow-[0_8px_12px_rgba(0,0,0,0.04)]'

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-[520px] max-h-[90vh] overflow-auto bg-white rounded-[16px] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="font-['Inter:Bold'] font-bold text-[#1f2937] text-[22px]">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="text-[#6b7280] text-[22px] leading-none cursor-pointer px-2">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Pill({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'gray' }) {
  return (
    <span
      className={`rounded-full px-3 py-2 text-[12px] font-['Inter:Semi_Bold'] font-semibold whitespace-nowrap ${
        tone === 'green' ? 'bg-[#e9f4ee] text-[#426653]' : 'bg-[#f3f4f6] text-[#374151]'
      }`}
    >
      {children}
    </span>
  )
}

function Meta({ p }: { p: Provider }) {
  const t = "font-['Inter:Regular'] text-[#6b7280] text-[13px] whitespace-nowrap"
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      <span className="flex items-center gap-1.5">
        <img alt="" src={imgMapPin1} className="size-4" />
        <span className={t}>{p.location}</span>
      </span>
      <span className="flex items-center gap-1.5">
        <img alt="" src={imgClock} className="size-4" />
        <span className={t}>{p.intro} min intro call</span>
      </span>
      <span className="flex items-center gap-1.5">
        <img alt="" src={imgShield} className="size-4" />
        <span className={t}>Demo credentials</span>
      </span>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('Find care')
  const [queryInput, setQueryInput] = useState('')
  const [locInput, setLocInput] = useState('')
  const [query, setQuery] = useState('')
  const [loc, setLoc] = useState('')
  const [chips, setChips] = useState<string[]>([])
  const [sort, setSort] = useState('Best match')
  const [sortOpen, setSortOpen] = useState(false)
  const [selectedId, setSelectedId] = useStored<number>('mc-selected', 1)
  const [saved, setSaved] = useStored<number[]>('mc-saved', [])
  const [plan, setPlan] = useStored<string>('mc-insurance', NO_INSURANCE)
  const [planFlash, setPlanFlash] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [booked, setBooked] = useState<string | null>(null)
  const [profileId, setProfileId] = useState<number | null>(null)
  const [peer, setPeer] = useState<PeerProfile | null>(null)
  const [peerStage, setPeerStage] = useState<'onboarding' | 'room' | null>(null)
  const [learnMore, setLearnMore] = useState(false)
  const [chat, setChat] = useState(false)
  const [chatLog, setChatLog] = useState<{ from: 'me' | 'support'; text: string }[]>([
    { from: 'support', text: 'Hi! I can help with filters, availability, and next steps. What are you looking for?' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [call, setCall] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const runSearch = () => {
    setQuery(queryInput.trim().toLowerCase())
    setLoc(locInput.trim().toLowerCase())
  }

  const results = useMemo(() => {
    const list = PROVIDERS.filter((p) => {
      if (!covers(p, plan)) return false
      if (query && !`${p.name} ${p.title} ${p.bio} ${p.specialty} ${p.tags.join(' ')}`.toLowerCase().includes(query)) return false
      if (loc && loc !== 'near me' && !p.location.toLowerCase().includes(loc)) return false
      for (const c of chips) {
        if (c === 'Online' && p.format === 'In-person') return false
        if (c === 'Sliding scale' && !p.sliding) return false
        if (['Anxiety', 'Depression', 'Couples'].includes(c) && !p.tags.includes(c)) return false
      }
      return true
    })
    if (sort === 'Most openings') list.sort((a, b) => b.openings - a.openings)
    if (sort === 'Shortest intro call') list.sort((a, b) => a.intro - b.intro)
    if (sort === 'Name A–Z') list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [query, loc, chips, sort, plan])

  useEffect(() => {
    if (results.length > 0 && !results.some((p) => p.id === selectedId)) setSelectedId(results[0].id)
  }, [results, selectedId, setSelectedId])

  useEffect(() => {
    if (!planFlash) return
    const t = setTimeout(() => setPlanFlash(false), 2200)
    return () => clearTimeout(t)
  }, [planFlash])

  const acceptingCount = PROVIDERS.filter((p) => covers(p, plan)).length

  const selected = PROVIDERS.find((p) => p.id === selectedId) ?? PROVIDERS[0]
  const booking = PROVIDERS.find((p) => p.id === bookingId)
  const profile = PROVIDERS.find((p) => p.id === profileId)

  const toggleChip = (c: string) => setChips((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]))
  const toggleSave = (id: number) => {
    const has = saved.includes(id)
    setSaved((s) => (has ? s.filter((x) => x !== id) : [...s, id]))
    setToast(has ? 'Removed from saved providers' : 'Provider saved')
  }
  const openBooking = (id: number) => {
    setBookingId(id)
    setSelectedId(id)
    setSlot(null)
    setBooked(null)
  }
  const sendChat = () => {
    const text = chatInput.trim()
    if (!text) return
    setChatLog((l) => [
      ...l,
      { from: 'me', text },
      { from: 'support', text: 'Thanks! A care guide will follow up shortly. In the meantime, try the filter chips to narrow your matches.' },
    ])
    setChatInput('')
  }

  const firstBookable = results[0] ?? selected

  return (
    <div className="min-h-screen bg-[#f7f8f8] font-['Inter:Regular'] text-[#1f2937]">
      <header className="bg-white border-b border-[#e5e7eb] px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 min-h-[72px]">
        <div className="flex items-center gap-3">
          <div className="bg-[#426653] rounded-[10px] size-9 flex items-center justify-center text-white text-[18px] font-['Inter:Bold'] font-bold">
            MC
          </div>
          <span className="font-['Inter:Bold'] font-bold text-[22px]">mind connect</span>
        </div>
        <nav className="flex items-center gap-7 text-[14px] order-3 lg:order-none w-full lg:w-auto overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`cursor-pointer whitespace-nowrap hover:text-[#426653] transition-colors ${
                tab === t ? "font-['Inter:Semi_Bold'] font-semibold text-[#426653]" : "font-['Inter:Medium'] font-medium text-[#6b7280]"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => setDrawer(true)} className={`${btnSecondary} px-4 py-2.5`}>
            Saved providers{saved.length > 0 && <span className="ml-2 text-[#426653]">({saved.length})</span>}
          </button>
          <button onClick={() => openBooking(selectedId)} className={`${btnPrimary} px-4 py-2.5`}>
            Book a visit
          </button>
        </div>
      </header>

      {tab !== 'Find care' ? (
        <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
          <div className={`${card} p-8 max-w-[720px]`}>
            <h1 className="font-['Inter:Bold'] font-bold text-[24px] mb-2">{tab}</h1>
            <p className="text-[#6b7280] text-[14px] leading-[1.5] mb-6">
              {tab === 'Resources' && 'Guides on preparing for your first session, understanding insurance, and finding the right fit. (Sample content.)'}
              {tab === 'Support' && 'Our care guides can help with filters, availability, and booking. Reach us by chat or phone anytime.'}
              {tab === 'Account' && 'Sign in to manage appointments, saved providers, and preferences. (Demo — no account required.)'}
            </p>
            <div className="flex gap-3">
              {tab === 'Support' ? (
                <>
                  <button className={`${btnSecondary} px-4 py-3`} onClick={() => setChat(true)}>Chat support</button>
                  <button className={`${btnPrimary} px-4 py-3`} onClick={() => setCall(true)}>Call support</button>
                </>
              ) : (
                <button className={`${btnPrimary} px-4 py-3`} onClick={() => setTab('Find care')}>Back to find care</button>
              )}
            </div>
          </div>
        </main>
      ) : (
        <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 grid gap-6 lg:grid-cols-[minmax(0,840px)_minmax(0,472px)] lg:items-start">
          <section className="flex flex-col gap-5 min-w-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                runSearch()
              }}
              className={`${card} p-4 flex flex-col sm:flex-row gap-4`}
            >
              <label className="flex-1 min-w-0 flex items-center gap-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[12px] px-4 py-3.5 focus-within:border-[#426653]">
                <img alt="" src={imgSearch} className="size-[18px]" />
                <input
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Search therapists, specialties, or concerns"
                  className="flex-1 min-w-0 bg-transparent outline-none text-[15px] placeholder:text-[#6b7280]"
                />
              </label>
              <label className="sm:w-[220px] flex items-center gap-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-[12px] px-4 py-3.5 focus-within:border-[#426653]">
                <img alt="" src={imgMapPin} className="size-[18px]" />
                <input
                  value={locInput}
                  onChange={(e) => setLocInput(e.target.value)}
                  placeholder="Near me"
                  className="flex-1 min-w-0 bg-transparent outline-none text-[15px] placeholder:text-[#6b7280]"
                />
              </label>
              <button type="submit" className={`${btnPrimary} rounded-[12px] px-[18px] py-3.5 text-[15px]`}>
                Search
              </button>
            </form>

            <div className={`${card} shadow-none p-4 flex flex-wrap items-center justify-between gap-3`}>
              <div className="flex flex-wrap gap-2.5">
                {CHIPS.map((c) => {
                  const on = chips.includes(c)
                  return (
                    <button
                      key={c}
                      aria-pressed={on}
                      onClick={() => toggleChip(c)}
                      className={`rounded-full px-3 py-2 text-[13px] font-['Inter:Semi_Bold'] font-semibold cursor-pointer transition-colors border ${
                        on ? 'bg-[#426653] text-white border-[#426653]' : 'bg-[#e9f4ee] text-[#426653] border-transparent hover:border-[#426653]'
                      }`}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center gap-2 text-[#6b7280] text-[13px]">
                <span>{results.length === PROVIDERS.length ? 24 : results.length} providers</span>
                <span>•</span>
                <span>Updated today</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="font-['Inter:Bold'] font-bold text-[24px]">Recommended providers</h1>
                <p className="text-[#6b7280] text-[14px]">Curated matches based on your search and availability</p>
              </div>
              <div className="relative flex items-center gap-2">
                <span className="text-[#6b7280] text-[13px]">Sort by</span>
                <button
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                  onClick={() => setSortOpen((o) => !o)}
                  className="bg-white border border-[#e5e7eb] rounded-full px-3 py-2 flex items-center gap-2 text-[13px] font-['Inter:Semi_Bold'] font-semibold cursor-pointer"
                >
                  {sort}
                  <img alt="" src={imgChevronDown} className="size-4" />
                </button>
                {sortOpen && (
                  <ul role="listbox" className="absolute right-0 top-full mt-2 z-20 w-[200px] bg-white border border-[#e5e7eb] rounded-[12px] shadow-lg p-1">
                    {SORTS.map((s) => (
                      <li key={s}>
                        <button
                          role="option"
                          aria-selected={s === sort}
                          onClick={() => {
                            setSort(s)
                            setSortOpen(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-[8px] text-[13px] cursor-pointer hover:bg-[#f3f4f6] ${
                            s === sort ? "font-['Inter:Semi_Bold'] font-semibold text-[#426653]" : ''
                          }`}
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {results.length === 0 && (
                <div className={`${card} p-8 text-center`}>
                  <p className="font-['Inter:Bold'] font-bold text-[18px] mb-1">No providers match</p>
                  <p className="text-[#6b7280] text-[14px] mb-4">Try removing a filter, searching a different term{plan !== NO_INSURANCE ? ', or changing your insurance' : ''}.</p>
                  <button
                    className={`${btnSecondary} px-4 py-2.5`}
                    onClick={() => {
                      setPlan(NO_INSURANCE)
                      setChips([])
                      setQuery('')
                      setLoc('')
                      setQueryInput('')
                      setLocInput('')
                    }}
                  >
                    Clear all
                  </button>
                </div>
              )}
              {results.map((p) => {
                const active = p.id === selectedId
                return (
                  <article
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`${card} p-4 flex gap-4 cursor-pointer transition-colors ${active ? 'border-[#426653] ring-1 ring-[#426653]' : 'hover:border-[#c9d3cd]'}`}
                  >
                    <div className="hidden sm:flex bg-[#f9fafb] border border-[#e5e7eb] rounded-[14px] size-[88px] shrink-0 items-center justify-center text-[#6b7280] text-[14px] font-['Inter:Bold'] font-bold">
                      {p.initials}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                          <h2 className="font-['Inter:Bold'] font-bold text-[18px]">{p.name}</h2>
                          <p className="text-[#6b7280] text-[14px]">{p.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Pill>{p.format}</Pill>
                          <Pill tone="gray">{p.openings} openings</Pill>
                        </div>
                      </div>
                      <p className="text-[#6b7280] text-[14px] leading-[1.5]">{p.bio}</p>
                      <Meta p={p} />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[#6b7280] text-[13px]">
                          {plan !== NO_INSURANCE ? <span className="text-[#426653] font-['Inter:Semi_Bold'] font-semibold">✓ Accepts {plan}</span> : 'Demo availability'}
                        </span>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleSave(p.id)}
                            aria-pressed={saved.includes(p.id)}
                            className={`${btnSecondary} px-3.5 py-2.5 ${saved.includes(p.id) ? 'text-[#426653] border-[#426653]' : ''}`}
                          >
                            {saved.includes(p.id) ? 'Saved' : 'Save'}
                          </button>
                          <button onClick={() => setProfileId(p.id)} className={`${btnSecondary} px-3.5 py-2.5`}>
                            View profile
                          </button>
                          <button onClick={() => openBooking(p.id)} className={`${btnPrimary} px-3.5 py-2.5`}>
                            Book visit
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <aside className="flex flex-col gap-5 min-w-0 lg:sticky lg:top-6">
            <div className={`${card} p-5 flex flex-col gap-4`}>
              <div className="flex flex-col gap-1.5">
                <h2 className="font-['Inter:Bold'] font-bold text-[22px]">Health Care Provider</h2>
                <p className="text-[#6b7280] text-[14px] leading-[1.5]">
                  Review your selected provider before moving forward. This panel summarizes the current match and helps you prepare for your first visit.
                </p>
              </div>
              <div className="rounded-[12px] border border-[#cfe0d6] bg-[#f4faf6] p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="insurance" className="font-['Inter:Semi_Bold'] font-semibold text-[13px]">Your insurance</label>
                  <span
                    role="status"
                    className={`text-[12px] font-['Inter:Medium'] font-medium transition-opacity ${planFlash ? 'text-[#426653] opacity-100' : 'text-[#6b7280] opacity-80'}`}
                  >
                    {planFlash ? 'Updated and saved ✓' : plan === NO_INSURANCE ? 'Not saved yet' : 'Saved on this device'}
                  </span>
                </div>
                <select
                  id="insurance"
                  value={plan}
                  onChange={(e) => {
                    setPlan(e.target.value)
                    setPlanFlash(true)
                  }}
                  className="w-full bg-white border border-[#d1d5db] rounded-[10px] px-3 py-2.5 text-[14px] cursor-pointer outline-none focus:border-[#426653]"
                >
                  <option value={NO_INSURANCE}>Not selected (show all)</option>
                  {INSURERS.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                  <option value={SELF_PAY}>Self-pay (sliding scale only)</option>
                </select>
                <p className="text-[12px] text-[#4b5563]">
                  {plan === NO_INSURANCE
                    ? 'Choose a plan to see only therapists you can book.'
                    : `${acceptingCount} of ${PROVIDERS.length} therapists match ${plan}.`}
                </p>
              </div>
              <div>
                <p className="font-['Inter:Bold'] font-bold text-[16px]">{selected.name}</p>
                <p className="text-[12px] text-[#6b7280] mt-1">
                  {selected.sliding ? 'Sliding scale · ' : ''}Accepts {selected.insurance.join(', ')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 font-['Inter:Semi_Bold'] font-semibold">
                {[
                  ['Specialty', selected.specialty],
                  ['Format', selected.format === 'Online' ? 'Online video' : selected.format],
                  ['Location', selected.location],
                  ['Intro call', `${selected.intro} minutes`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-[#f9fafb] rounded-[12px] p-3 flex flex-col gap-1 min-w-0">
                    <span className="text-[#6b7280] text-[12px]">{k}</span>
                    <span className="text-[14px]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#f9fafb] rounded-[12px] p-3.5 flex flex-col gap-1.5 text-[13px]">
                <p className="font-['Inter:Semi_Bold'] font-semibold">Before you book</p>
                <p className="text-[#6b7280] leading-[1.5]">
                  This is sample provider information. In a real experience, review credentials, insurance, and availability details before confirming a visit.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setProfileId(selected.id)} className={`${btnSecondary} flex-1 px-4 py-3`}>
                  View profile
                </button>
                <button onClick={() => openBooking(selected.id)} className={`${btnPrimary} flex-1 px-4 py-3`}>
                  Book visit
                </button>
              </div>
            </div>

            <div className="bg-[#f3f3f3] rounded-[14px] p-6 flex flex-col gap-3">
              <h2 className="font-['Inter:Medium'] font-medium text-[18px]">Connect with other patients</h2>
              <p className="text-[#626262] text-[14px] leading-[1.5]">
                Opt in to text with people who are also preparing for their first visit. Share questions, tips, and encouragement in a private, anonymous space.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPeerStage(peer ? 'room' : 'onboarding')}
                  className={`flex-1 h-11 rounded-[8px] px-3.5 text-left text-[14px] font-['Inter:Medium'] font-medium cursor-pointer border-[1.5px] transition-colors ${
                    peer ? 'bg-[#e9f4ee] border-[#426653]' : 'bg-white border-[#dcdcdc] hover:border-[#426653]'
                  }`}
                >
                  {peer ? 'Open group ✓' : 'Opt in'}
                </button>
                <button
                  onClick={() => setLearnMore(true)}
                  className="w-[132px] h-11 rounded-[8px] px-3.5 text-left bg-white border border-[#dcdcdc] text-[14px] font-['Inter:Medium'] font-medium cursor-pointer hover:bg-[#fafafa]"
                >
                  Learn more
                </button>
              </div>
              <p className="text-[#626262] text-[12px] leading-[1.45]">
                {peer ? `You're in as ${peer.nickname}. You can leave from inside the group.` : 'Participation is optional. You can leave the group at any time.'}
              </p>
            </div>

            <div className={`${card} p-5 flex flex-col gap-3`}>
              <div className="flex items-center gap-3">
                <div className="bg-[#e9f4ee] rounded-[20px] size-10 shrink-0 flex items-center justify-center">
                  <img alt="" src={imgMessage} className="size-5" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <h2 className="font-['Inter:Bold'] font-bold text-[16px]">Need help finding care?</h2>
                  <p className="text-[#6b7280] text-[14px] leading-[1.5]">Chat with support for guidance on filters, availability, and next steps.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setChat(true)} className={`${btnSecondary} flex-1 px-4 py-3`}>
                  Chat support
                </button>
                <button onClick={() => setCall(true)} className={`${btnPrimary} flex-1 px-4 py-3`}>
                  Call support
                </button>
              </div>
            </div>
          </aside>
        </main>
      )}

      {drawer && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[400px] bg-white shadow-2xl p-6 flex flex-col gap-4 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-['Inter:Bold'] font-bold text-[22px]">Saved providers</h2>
              <button aria-label="Close" className="text-[22px] text-[#6b7280] cursor-pointer px-2" onClick={() => setDrawer(false)}>×</button>
            </div>
            {saved.length === 0 ? (
              <p className="text-[#6b7280] text-[14px]">Nothing saved yet. Use “Save” on a provider card to keep them here.</p>
            ) : (
              saved.map((id) => {
                const p = PROVIDERS.find((x) => x.id === id)!
                return (
                  <div key={id} className="border border-[#e5e7eb] rounded-[12px] p-4 flex flex-col gap-3">
                    <div>
                      <p className="font-['Inter:Bold'] font-bold text-[16px]">{p.name}</p>
                      <p className="text-[#6b7280] text-[13px]">{p.location} · {p.format}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className={`${btnSecondary} px-3 py-2`} onClick={() => toggleSave(id)}>Remove</button>
                      <button className={`${btnPrimary} px-3 py-2`} onClick={() => { setDrawer(false); openBooking(id) }}>Book visit</button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {booking && (
        <Modal title={booked ? 'Visit requested' : `Book with ${booking.name}`} onClose={() => setBookingId(null)}>
          {booked ? (
            <div className="flex flex-col gap-4">
              <p className="text-[#6b7280] text-[14px] leading-[1.5]">
                Your {booking.intro}-minute intro call is requested for <strong className="text-[#1f2937]">{booked}</strong>. This is a demo, so no confirmation will be sent.
              </p>
              <button className={`${btnPrimary} px-4 py-3`} onClick={() => setBookingId(null)}>Done</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-[#6b7280] text-[14px]">Pick a time for a {booking.intro}-minute intro call ({booking.format.toLowerCase()}).</p>
              <div className="grid grid-cols-2 gap-2">
                {booking.slots.map((s) => (
                  <button
                    key={s}
                    aria-pressed={slot === s}
                    onClick={() => setSlot(s)}
                    className={`rounded-[10px] border px-3 py-3 text-[14px] cursor-pointer ${
                      slot === s ? 'bg-[#e9f4ee] border-[#426653] font-semibold' : 'border-[#d1d5db] hover:border-[#426653]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button className={`${btnPrimary} px-4 py-3`} disabled={!slot} onClick={() => setBooked(slot)}>
                Confirm request
              </button>
            </div>
          )}
        </Modal>
      )}

      {profile && (
        <Modal title={profile.name} onClose={() => setProfileId(null)}>
          <div className="flex flex-col gap-4">
            <p className="text-[#6b7280] text-[14px]">{profile.title}</p>
            <div className="flex gap-2">
              <Pill>{profile.format}</Pill>
              <Pill tone="gray">{profile.openings} openings</Pill>
              {profile.sliding && <Pill tone="gray">Sliding scale</Pill>}
            </div>
            <p className="text-[14px] leading-[1.5]">{profile.bio}</p>
            <Meta p={profile} />
            <div className="flex gap-3">
              <button className={`${btnSecondary} flex-1 px-4 py-3`} onClick={() => toggleSave(profile.id)}>
                {saved.includes(profile.id) ? 'Unsave' : 'Save provider'}
              </button>
              <button className={`${btnPrimary} flex-1 px-4 py-3`} onClick={() => { setProfileId(null); openBooking(profile.id) }}>
                Book visit
              </button>
            </div>
          </div>
        </Modal>
      )}

      {learnMore && (
        <Modal title="Patient connections" onClose={() => setLearnMore(false)}>
          <ul className="list-disc pl-5 text-[14px] text-[#374151] leading-[1.6] flex flex-col gap-1 mb-5">
            <li>Text-based group for people preparing for a first visit.</li>
            <li>Anonymous: only a generated nickname is shown.</li>
            <li>Not a substitute for professional care or crisis support.</li>
            <li>Leave any time from this card.</li>
          </ul>
          <button
            className={`${btnPrimary} px-4 py-3 w-full`}
            onClick={() => {
              setLearnMore(false)
              setPeerStage(peer ? 'room' : 'onboarding')
            }}
          >
            Opt in
          </button>
        </Modal>
      )}

      {peerStage === 'onboarding' && (
        <PeerOnboarding
          onClose={() => setPeerStage(null)}
          onJoin={(p) => {
            setPeer(p)
            setPeerStage('room')
            setToast(`Welcome, ${p.nickname}!`)
          }}
        />
      )}

      {peerStage === 'room' && peer && (
        <PeerRoom
          profile={peer}
          onClose={() => setPeerStage(null)}
          onToggleTexts={() => setPeer({ ...peer, texts: !peer.texts })}
          onLeave={() => {
            setPeer(null)
            setPeerStage(null)
            setToast('You left the peer group')
          }}
        />
      )}

      {call && (
        <Modal title="Call support" onClose={() => setCall(false)}>
          <p className="text-[#6b7280] text-[14px] leading-[1.5] mb-4">Care guides are available Mon–Fri, 8am–8pm. This is a demo number.</p>
          <p className="font-['Inter:Bold'] font-bold text-[24px] mb-5">(555) 010-0199</p>
          <button className={`${btnPrimary} px-4 py-3 w-full`} onClick={() => { setCall(false); setToast('Calling support… (demo)') }}>
            Start call
          </button>
        </Modal>
      )}

      {chat && (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-[360px] bg-white border border-[#e5e7eb] rounded-[16px] shadow-2xl flex flex-col h-[460px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e7eb]">
            <span className="font-['Inter:Bold'] font-bold text-[16px]">Chat support</span>
            <button aria-label="Close chat" className="text-[20px] text-[#6b7280] cursor-pointer px-2" onClick={() => setChat(false)}>×</button>
          </div>
          <div className="flex-1 overflow-auto p-4 flex flex-col gap-2">
            {chatLog.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-[12px] px-3 py-2 text-[14px] leading-[1.4] ${
                  m.from === 'me' ? 'self-end bg-[#426653] text-white' : 'self-start bg-[#f3f4f6]'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form
            className="p-3 border-t border-[#e5e7eb] flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              sendChat()
            }}
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message"
              className="flex-1 min-w-0 border border-[#d1d5db] rounded-[10px] px-3 py-2 text-[14px] outline-none focus:border-[#426653]"
            />
            <button type="submit" className={`${btnPrimary} px-4 py-2`}>Send</button>
          </form>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#1f2937] text-white text-[14px] rounded-full px-5 py-3 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
