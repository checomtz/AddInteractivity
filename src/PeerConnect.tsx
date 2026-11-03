import { useEffect, useRef, useState, type ReactNode } from 'react'

export type PeerProfile = { nickname: string; topics: string[]; texts: boolean }

type Msg = { id: number; author: string; text: string; time: string; mine?: boolean; likes: number; liked?: boolean }
type Room = { id: string; name: string; blurb: string; members: number; msgs: Msg[] }

const NICKS = ['Quiet Maple', 'Gentle Harbor', 'Brave Sparrow', 'Calm Lantern', 'Steady Willow', 'Kind Comet']
const TOPICS = ['First visit nerves', 'Questions to ask', 'Costs & insurance', 'Tips & wins']

const btnPrimary =
  "bg-[#426653] rounded-[10px] font-['Inter:Semi_Bold'] font-semibold text-white text-[14px] cursor-pointer hover:bg-[#365545] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
const btnSecondary =
  "bg-white border border-[#d1d5db] rounded-[10px] font-['Inter:Semi_Bold'] font-semibold text-[#1f2937] text-[14px] cursor-pointer hover:bg-[#f9fafb] transition-colors"

const ROOMS: Room[] = [
  {
    id: 'nerves',
    name: 'First visit nerves',
    blurb: 'Feeling anxious about your first session? You are not alone.',
    members: 128,
    msgs: [
      { id: 1, author: 'Steady Willow', text: 'My first visit is Thursday and I keep rehearsing what to say. Anyone else?', time: '9:12 AM', likes: 4 },
      { id: 2, author: 'Calm Lantern', text: 'Totally. I wrote three bullet points on my phone. My therapist said that is a great way to start.', time: '9:20 AM', likes: 7 },
      { id: 3, author: 'Kind Comet', text: 'You do not have to have it figured out. The intro call is mostly just a conversation.', time: '9:31 AM', likes: 5 },
    ],
  },
  {
    id: 'questions',
    name: 'Questions to ask',
    blurb: 'Swap ideas for what to ask a provider before booking.',
    members: 94,
    msgs: [
      { id: 1, author: 'Brave Sparrow', text: 'What do you ask on an intro call? I want to know about their approach but not sound interrogating.', time: '8:40 AM', likes: 3 },
      { id: 2, author: 'Gentle Harbor', text: '“How do you usually structure the first few sessions?” worked really well for me.', time: '8:55 AM', likes: 9 },
    ],
  },
  {
    id: 'costs',
    name: 'Costs & insurance',
    blurb: 'Sliding scale, superbills, and what to confirm up front.',
    members: 71,
    msgs: [
      { id: 1, author: 'Quiet Maple', text: 'Tip: ask if they offer a sliding scale even if it is not listed. A couple of mine did.', time: 'Yesterday', likes: 11 },
      { id: 2, author: 'Calm Lantern', text: 'Also ask whether they can give you a superbill for out-of-network reimbursement.', time: 'Yesterday', likes: 6 },
    ],
  },
  {
    id: 'wins',
    name: 'Tips & wins',
    blurb: 'Celebrate small steps. Booking counts.',
    members: 156,
    msgs: [
      { id: 1, author: 'Kind Comet', text: 'Booked my first appointment today. Took me three weeks to click the button!', time: '10:02 AM', likes: 18 },
      { id: 2, author: 'Steady Willow', text: 'That is huge. Proud of you!', time: '10:05 AM', likes: 8 },
    ],
  },
]

const REPLIES = [
  'Thanks for sharing this. A lot of us feel the same way.',
  'That makes sense. It helped me to take it one step at a time.',
  'Sending good vibes your way. You are doing something really brave.',
  'I had the same question! Following along.',
]

function Overlay({ label, onClose, wide, children }: { label: string; onClose: () => void; wide?: boolean; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`relative w-full ${wide ? 'max-w-[980px] h-[min(720px,92vh)]' : 'max-w-[520px] max-h-[92vh]'} overflow-hidden bg-white rounded-[16px] shadow-2xl flex flex-col`}
      >
        {children}
      </div>
    </div>
  )
}

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return (
    <div
      className="rounded-full shrink-0 flex items-center justify-center text-[#1f2937] font-['Inter:Bold'] font-bold"
      style={{ width: size, height: size, background: `hsl(${hue} 35% 88%)`, fontSize: size * 0.38 }}
    >
      {name
        .split(' ')
        .map((w) => w[0])
        .join('')}
    </div>
  )
}

export function PeerOnboarding({ onClose, onJoin }: { onClose: () => void; onJoin: (p: PeerProfile) => void }) {
  const [step, setStep] = useState(0)
  const [nickname, setNickname] = useState(NICKS[0])
  const [topics, setTopics] = useState<string[]>(['First visit nerves'])
  const [texts, setTexts] = useState(true)
  const [agree, setAgree] = useState(false)

  const toggleTopic = (t: string) => setTopics((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))

  return (
    <Overlay label="Join patient connections" onClose={onClose}>
      <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4 border-b border-[#e5e7eb]">
        <div>
          <p className="text-[12px] text-[#6b7280] font-['Inter:Semi_Bold'] font-semibold mb-1">Step {step + 1} of 3</p>
          <h2 className="font-['Inter:Bold'] font-bold text-[22px] text-[#1f2937]">
            {['Pick an anonymous name', 'What would you like to talk about?', 'Ground rules'][step]}
          </h2>
        </div>
        <button aria-label="Close" onClick={onClose} className="text-[22px] text-[#6b7280] cursor-pointer px-2 leading-none">×</button>
      </div>
      <div className="h-1 bg-[#e9f4ee]">
        <div className="h-full bg-[#426653] transition-all" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>

      <div className="p-6 overflow-auto flex flex-col gap-4">
        {step === 0 && (
          <>
            <p className="text-[14px] text-[#6b7280] leading-[1.5]">Only this nickname is shown to others. We never share your real name, number, or provider.</p>
            <div className="grid grid-cols-2 gap-2">
              {NICKS.map((n) => (
                <button
                  key={n}
                  aria-pressed={nickname === n}
                  onClick={() => setNickname(n)}
                  className={`flex items-center gap-3 rounded-[12px] border px-3 py-3 text-left text-[14px] cursor-pointer transition-colors ${
                    nickname === n ? 'border-[#426653] bg-[#e9f4ee]' : 'border-[#e5e7eb] hover:border-[#426653]'
                  }`}
                >
                  <Avatar name={n} />
                  <span className="font-['Inter:Medium'] font-medium">{n}</span>
                </button>
              ))}
            </div>
            <button
              className="self-start text-[13px] text-[#426653] font-['Inter:Semi_Bold'] font-semibold cursor-pointer hover:underline"
              onClick={() => setNickname(NICKS[Math.floor(Math.random() * NICKS.length)])}
            >
              Surprise me
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-[14px] text-[#6b7280]">Choose the rooms to follow. You can change this any time.</p>
            <div className="flex flex-col gap-2">
              {TOPICS.map((t) => {
                const on = topics.includes(t)
                return (
                  <button
                    key={t}
                    aria-pressed={on}
                    onClick={() => toggleTopic(t)}
                    className={`flex items-center justify-between rounded-[12px] border px-4 py-3 text-[14px] cursor-pointer transition-colors ${
                      on ? 'border-[#426653] bg-[#e9f4ee]' : 'border-[#e5e7eb] hover:border-[#426653]'
                    }`}
                  >
                    <span className="font-['Inter:Medium'] font-medium">{t}</span>
                    <span
                      className={`size-5 rounded-full border flex items-center justify-center text-[12px] ${
                        on ? 'bg-[#426653] border-[#426653] text-white' : 'border-[#d1d5db] text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                )
              })}
            </div>
            <label className="flex items-start gap-3 bg-[#f9fafb] rounded-[12px] p-4 cursor-pointer">
              <input type="checkbox" checked={texts} onChange={(e) => setTexts(e.target.checked)} className="mt-1 accent-[#426653]" />
              <span className="text-[14px] leading-[1.5]">
                <span className="font-['Inter:Semi_Bold'] font-semibold">Send me text notifications</span>
                <span className="block text-[#6b7280] text-[13px]">Get a text when someone replies. Message and data rates may apply. Reply STOP to opt out.</span>
              </span>
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <ul className="flex flex-col gap-3 text-[14px] leading-[1.5]">
              {[
                ['Be kind', 'Everyone here is preparing for something hard.'],
                ['Keep it anonymous', 'No full names, phone numbers, or provider names.'],
                ['Not medical advice', 'Peers can share experience, not diagnoses or treatment.'],
                ['In crisis?', 'Call or text 988 (U.S.) for immediate help.'],
              ].map(([h, b]) => (
                <li key={h} className="flex gap-3">
                  <span className="mt-1.5 size-2 rounded-full bg-[#426653] shrink-0" />
                  <span>
                    <span className="font-['Inter:Semi_Bold'] font-semibold">{h}. </span>
                    <span className="text-[#6b7280]">{b}</span>
                  </span>
                </li>
              ))}
            </ul>
            <label className="flex items-start gap-3 cursor-pointer text-[14px]">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-[#426653]" />
              <span>I agree to follow the community guidelines and understand participation is optional.</span>
            </label>
          </>
        )}
      </div>

      <div className="px-6 py-4 border-t border-[#e5e7eb] flex justify-between gap-3">
        <button className={`${btnSecondary} px-4 py-2.5`} onClick={() => (step === 0 ? onClose() : setStep(step - 1))}>
          {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < 2 ? (
          <button className={`${btnPrimary} px-5 py-2.5`} disabled={step === 1 && topics.length === 0} onClick={() => setStep(step + 1)}>
            Continue
          </button>
        ) : (
          <button className={`${btnPrimary} px-5 py-2.5`} disabled={!agree} onClick={() => onJoin({ nickname, topics, texts })}>
            Join group
          </button>
        )}
      </div>
    </Overlay>
  )
}

export function PeerRoom({ profile, onClose, onLeave, onToggleTexts }: { profile: PeerProfile; onClose: () => void; onLeave: () => void; onToggleTexts: () => void }) {
  const [rooms, setRooms] = useState<Room[]>(ROOMS)
  const [activeId, setActiveId] = useState(ROOMS[0].id)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [showSide, setShowSide] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const active = rooms.find((r) => r.id === activeId)!

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [active.msgs.length, typing, activeId])

  const update = (id: string, fn: (m: Msg[]) => Msg[]) => setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, msgs: fn(r.msgs) } : r)))

  const send = () => {
    const text = draft.trim()
    if (!text) return
    const roomId = activeId
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    update(roomId, (m) => [...m, { id: Date.now(), author: profile.nickname, text, time, mine: true, likes: 0 }])
    setDraft('')
    setTyping(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setTyping(false)
      const who = NICKS.filter((n) => n !== profile.nickname)[Math.floor(Math.random() * 5)]
      update(roomId, (m) => [
        ...m,
        { id: Date.now() + 1, author: who, text: REPLIES[Math.floor(Math.random() * REPLIES.length)], time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), likes: 0 },
      ])
    }, 1600)
  }

  const like = (mid: number) =>
    update(activeId, (ms) => ms.map((m) => (m.id === mid ? { ...m, liked: !m.liked, likes: m.likes + (m.liked ? -1 : 1) } : m)))

  return (
    <Overlay label="Patient connections" onClose={onClose} wide>
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-3 min-w-0">
          <button className="md:hidden text-[13px] text-[#426653] font-['Inter:Semi_Bold'] font-semibold cursor-pointer" onClick={() => setShowSide((s) => !s)}>
            {showSide ? 'Chat' : 'Rooms'}
          </button>
          <div className="min-w-0">
            <h2 className="font-['Inter:Bold'] font-bold text-[18px] text-[#1f2937] truncate">Patient connections</h2>
            <p className="text-[12px] text-[#6b7280] flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#4ca37a]" /> 42 online · you are <strong className="font-['Inter:Semi_Bold'] font-semibold text-[#1f2937]">{profile.nickname}</strong>
            </p>
          </div>
        </div>
        <button aria-label="Close" onClick={onClose} className="text-[22px] text-[#6b7280] cursor-pointer px-2 leading-none">×</button>
      </div>

      <div className="flex-1 min-h-0 flex">
        <aside className={`${showSide ? 'flex' : 'hidden'} md:flex w-full md:w-[260px] shrink-0 flex-col gap-4 bg-[#f9fafb] border-r border-[#e5e7eb] p-4 overflow-auto`}>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] tracking-wide uppercase text-[#6b7280] font-['Inter:Semi_Bold'] font-semibold mb-1">Rooms</p>
            {rooms.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveId(r.id)
                  setShowSide(false)
                }}
                className={`text-left rounded-[10px] px-3 py-2.5 cursor-pointer transition-colors ${active.id === r.id ? 'bg-white border border-[#e5e7eb] shadow-sm' : 'border border-transparent hover:bg-white'}`}
              >
                <span className="flex items-center justify-between gap-2 text-[14px] font-['Inter:Semi_Bold'] font-semibold">
                  <span className="truncate"># {r.name}</span>
                  <span className="text-[11px] text-[#6b7280] font-['Inter:Regular']">{r.members}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="bg-[#e9f4ee] rounded-[12px] p-3 text-[12px] leading-[1.5] text-[#2f4a3b]">
            <p className="font-['Inter:Semi_Bold'] font-semibold mb-1">Need urgent help?</p>
            Call or text <strong>988</strong> any time. This group is peer support, not crisis care.
          </div>
          <div className="mt-auto flex flex-col gap-2">
            <label className="flex items-center justify-between text-[13px] cursor-pointer">
              Text notifications
              <button
                role="switch"
                aria-checked={profile.texts}
                onClick={onToggleTexts}
                className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${profile.texts ? 'bg-[#426653]' : 'bg-[#d1d5db]'}`}
              >
                <span className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${profile.texts ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </label>
            {confirmLeave ? (
              <div className="flex gap-2">
                <button className={`${btnSecondary} flex-1 py-2 text-[13px]`} onClick={() => setConfirmLeave(false)}>Stay</button>
                <button className="flex-1 py-2 rounded-[10px] bg-[#b4432f] text-white text-[13px] font-['Inter:Semi_Bold'] font-semibold cursor-pointer" onClick={onLeave}>Leave</button>
              </div>
            ) : (
              <button className={`${btnSecondary} py-2 text-[13px]`} onClick={() => setConfirmLeave(true)}>Leave group</button>
            )}
          </div>
        </aside>

        <section className={`${showSide ? 'hidden' : 'flex'} md:flex flex-1 min-w-0 flex-col`}>
          <div className="px-5 py-3 border-b border-[#e5e7eb] bg-white">
            <p className="font-['Inter:Bold'] font-bold text-[15px]"># {active.name}</p>
            <p className="text-[13px] text-[#6b7280]">{active.blurb}</p>
          </div>
          <div className="flex-1 overflow-auto px-5 py-4 flex flex-col gap-4 bg-white">
            <p className="self-center text-[12px] text-[#6b7280] bg-[#f3f4f6] rounded-full px-3 py-1">Messages are anonymous and may be moderated</p>
            {active.msgs.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.mine ? 'flex-row-reverse' : ''}`}>
                <Avatar name={m.author} />
                <div className={`max-w-[78%] flex flex-col gap-1 ${m.mine ? 'items-end' : ''}`}>
                  <p className="text-[12px] text-[#6b7280]">
                    <span className="font-['Inter:Semi_Bold'] font-semibold text-[#1f2937]">{m.mine ? 'You' : m.author}</span> · {m.time}
                  </p>
                  <div className={`rounded-[14px] px-3.5 py-2.5 text-[14px] leading-[1.5] ${m.mine ? 'bg-[#426653] text-white rounded-tr-[4px]' : 'bg-[#f3f4f6] rounded-tl-[4px]'}`}>{m.text}</div>
                  {!m.mine && (
                    <button
                      aria-pressed={!!m.liked}
                      onClick={() => like(m.id)}
                      className={`text-[12px] rounded-full px-2 py-0.5 cursor-pointer border transition-colors ${m.liked ? 'bg-[#e9f4ee] border-[#426653] text-[#426653]' : 'border-[#e5e7eb] text-[#6b7280] hover:border-[#426653]'}`}
                    >
                      ♥ {m.likes}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {typing && <p className="text-[12px] text-[#6b7280] italic">Someone is typing…</p>}
            <div ref={endRef} />
          </div>
          <form
            className="p-3 border-t border-[#e5e7eb] flex gap-2 bg-white"
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message # ${active.name.toLowerCase()}`}
              maxLength={280}
              className="flex-1 min-w-0 border border-[#d1d5db] rounded-[10px] px-3.5 py-2.5 text-[14px] outline-none focus:border-[#426653]"
            />
            <button type="submit" className={`${btnPrimary} px-5`} disabled={!draft.trim()}>Send</button>
          </form>
        </section>
      </div>
    </Overlay>
  )
}
