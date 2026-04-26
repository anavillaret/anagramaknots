'use client'

import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import ContentField from '@/components/admin/ContentField'
import ContentSection from '@/components/admin/ContentSection'
import ImageUpload from '@/components/admin/ImageUpload'
import MultiImageUpload from '@/components/admin/MultiImageUpload'
import { translations } from '@/lib/i18n/translations'
import type { StoryPhoto } from '@/app/api/admin/story-photos/route'

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = ['Page Texts', 'Photos', 'Events & Workshops'] as const
type Tab = typeof TABS[number]

// ─── Story Page Texts ─────────────────────────────────────────────────────────

const PAGE_KEY = 'page_story'
const DEF_EN = translations.en.story
const DEF_PT = translations.pt.story

type StepField = { number: string; title: string; body: string }

type StoryState = {
  eyebrow: string
  heading0: string
  heading1: string
  p1: string
  p2: string
  journeyEyebrow: string
  journeyHeading0: string
  journeyHeading1: string
  journeySub: string
  missionEyebrow: string
  missionHeading0: string
  missionHeading1: string
  missionP1: string
  missionP2: string
  processEyebrow: string
  processHeading0: string
  processHeading1: string
  processSub: string
  steps: [StepField, StepField, StepField]
  ctaEyebrow: string
  ctaHeading0: string
  ctaHeading1: string
  ctaButton: string
  ctaSecondary: string
}

function defaultStoryState(t: typeof DEF_EN): StoryState {
  return {
    eyebrow: t.eyebrow,
    heading0: t.heading[0],
    heading1: t.heading[1],
    p1: t.p1,
    p2: t.p2,
    journeyEyebrow: t.journeyEyebrow,
    journeyHeading0: t.journeyHeading[0],
    journeyHeading1: t.journeyHeading[1],
    journeySub: t.journeySub,
    missionEyebrow: t.missionEyebrow,
    missionHeading0: t.missionHeading[0],
    missionHeading1: t.missionHeading[1],
    missionP1: t.missionP1,
    missionP2: t.missionP2,
    processEyebrow: t.processEyebrow,
    processHeading0: t.processHeading[0],
    processHeading1: t.processHeading[1],
    processSub: t.processSub,
    steps: t.steps.map(s => ({ number: s.number, title: s.title, body: s.body })) as [StepField, StepField, StepField],
    ctaEyebrow: t.ctaEyebrow,
    ctaHeading0: t.ctaHeading[0],
    ctaHeading1: t.ctaHeading[1],
    ctaButton: t.ctaButton,
    ctaSecondary: t.ctaSecondary,
  }
}

function storyStateToPayload(en: StoryState, pt: StoryState) {
  const ser = (s: StoryState) => ({
    eyebrow: s.eyebrow,
    heading: [s.heading0, s.heading1],
    p1: s.p1,
    p2: s.p2,
    journeyEyebrow: s.journeyEyebrow,
    journeyHeading: [s.journeyHeading0, s.journeyHeading1],
    journeySub: s.journeySub,
    missionEyebrow: s.missionEyebrow,
    missionHeading: [s.missionHeading0, s.missionHeading1],
    missionP1: s.missionP1,
    missionP2: s.missionP2,
    processEyebrow: s.processEyebrow,
    processHeading: [s.processHeading0, s.processHeading1],
    processSub: s.processSub,
    steps: s.steps,
    ctaEyebrow: s.ctaEyebrow,
    ctaHeading: [s.ctaHeading0, s.ctaHeading1],
    ctaButton: s.ctaButton,
    ctaSecondary: s.ctaSecondary,
  })
  return { en: { story: ser(en) }, pt: { story: ser(pt) } }
}

function payloadToStoryState(raw: Record<string, unknown>, defaults: StoryState): StoryState {
  if (!raw?.story || typeof raw.story !== 'object') return defaults
  const r = raw.story as Record<string, unknown>

  const heading = (r.heading as string[] | undefined) ?? []
  const journeyHeading = (r.journeyHeading as string[] | undefined) ?? []
  const missionHeading = (r.missionHeading as string[] | undefined) ?? []
  const processHeading = (r.processHeading as string[] | undefined) ?? []
  const ctaHeading = (r.ctaHeading as string[] | undefined) ?? []
  const rawSteps = (r.steps as Array<Record<string, string>> | undefined) ?? []

  return {
    eyebrow: (r.eyebrow as string) || defaults.eyebrow,
    heading0: heading[0] || defaults.heading0,
    heading1: heading[1] || defaults.heading1,
    p1: (r.p1 as string) || defaults.p1,
    p2: (r.p2 as string) || defaults.p2,
    journeyEyebrow: (r.journeyEyebrow as string) || defaults.journeyEyebrow,
    journeyHeading0: journeyHeading[0] || defaults.journeyHeading0,
    journeyHeading1: journeyHeading[1] || defaults.journeyHeading1,
    journeySub: (r.journeySub as string) || defaults.journeySub,
    missionEyebrow: (r.missionEyebrow as string) || defaults.missionEyebrow,
    missionHeading0: missionHeading[0] || defaults.missionHeading0,
    missionHeading1: missionHeading[1] || defaults.missionHeading1,
    missionP1: (r.missionP1 as string) || defaults.missionP1,
    missionP2: (r.missionP2 as string) || defaults.missionP2,
    processEyebrow: (r.processEyebrow as string) || defaults.processEyebrow,
    processHeading0: processHeading[0] || defaults.processHeading0,
    processHeading1: processHeading[1] || defaults.processHeading1,
    processSub: (r.processSub as string) || defaults.processSub,
    steps: defaults.steps.map((def, i) => ({
      number: def.number,
      title: rawSteps[i]?.title || def.title,
      body: rawSteps[i]?.body || def.body,
    })) as [StepField, StepField, StepField],
    ctaEyebrow: (r.ctaEyebrow as string) || defaults.ctaEyebrow,
    ctaHeading0: ctaHeading[0] || defaults.ctaHeading0,
    ctaHeading1: ctaHeading[1] || defaults.ctaHeading1,
    ctaButton: (r.ctaButton as string) || defaults.ctaButton,
    ctaSecondary: (r.ctaSecondary as string) || defaults.ctaSecondary,
  }
}

function StoryTexts() {
  const [en, setEn] = useState<StoryState>(defaultStoryState(DEF_EN))
  const [pt, setPt] = useState<StoryState>(defaultStoryState(DEF_PT))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/content/${PAGE_KEY}`)
      .then(r => r.json())
      .then(d => {
        if (d.content?.en) setEn(payloadToStoryState(d.content.en, defaultStoryState(DEF_EN)))
        if (d.content?.pt) setPt(payloadToStoryState(d.content.pt, defaultStoryState(DEF_PT)))
        setLoading(false)
      })
  }, [])

  function f(field: keyof StoryState) {
    return {
      en: en[field] as string,
      pt: pt[field] as string,
      onChangeEn: (v: string) => setEn(s => ({ ...s, [field]: v })),
      onChangePt: (v: string) => setPt(s => ({ ...s, [field]: v })),
    }
  }

  function setStep(lang: 'en' | 'pt', i: number, key: keyof StepField, value: string) {
    const setter = lang === 'en' ? setEn : setPt
    setter(s => {
      const steps = s.steps.map((st, idx) => idx === i ? { ...st, [key]: value } : st) as [StepField, StepField, StepField]
      return { ...s, steps }
    })
  }

  async function save() {
    setSaving(true)
    await fetch(`/api/admin/content/${PAGE_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storyStateToPayload(en, pt)),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <p className="text-[13px] text-stone">Loading…</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[13px] text-stone">
          Edit the full Our Story page.{' '}
          <a href="/story" target="_blank" className="text-teal hover:underline">View page →</a>
        </p>
        <button
          onClick={save}
          disabled={saving}
          className="bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <ContentSection title="Hero Section">
          <ContentField label="Eyebrow" {...f('eyebrow')} />
          <ContentField label="Heading — line 1" {...f('heading0')} />
          <ContentField label="Heading — line 2 (italic teal)" {...f('heading1')} />
          <ContentField label="Paragraph 1" {...f('p1')} multiline />
          <ContentField label="Paragraph 2" {...f('p2')} multiline />
        </ContentSection>

        <ContentSection title="Journey / Carousel Section">
          <ContentField label="Eyebrow" {...f('journeyEyebrow')} />
          <ContentField label="Heading — line 1" {...f('journeyHeading0')} />
          <ContentField label="Heading — line 2 (italic teal)" {...f('journeyHeading1')} />
          <ContentField label="Subtitle" {...f('journeySub')} multiline />
        </ContentSection>

        <ContentSection title="Mission Section">
          <ContentField label="Eyebrow" {...f('missionEyebrow')} />
          <ContentField label="Heading — line 1" {...f('missionHeading0')} />
          <ContentField label="Heading — line 2 (italic teal)" {...f('missionHeading1')} />
          <ContentField label="Paragraph 1" {...f('missionP1')} multiline />
          <ContentField label="Paragraph 2" {...f('missionP2')} multiline />
        </ContentSection>

        <ContentSection title="Process Section">
          <ContentField label="Eyebrow" {...f('processEyebrow')} />
          <ContentField label="Heading — line 1" {...f('processHeading0')} />
          <ContentField label="Heading — line 2 (italic teal)" {...f('processHeading1')} />
          <ContentField label="Subtitle" {...f('processSub')} multiline />
        </ContentSection>

        {en.steps.map((step, i) => (
          <ContentSection key={i} title={`Process Step ${step.number}`}>
            <ContentField
              label="Step number (read-only)"
              en={step.number}
              pt={pt.steps[i].number}
              onChangeEn={() => {}}
              onChangePt={() => {}}
              readOnly
            />
            <ContentField
              label="Title"
              en={step.title}
              pt={pt.steps[i].title}
              onChangeEn={v => setStep('en', i, 'title', v)}
              onChangePt={v => setStep('pt', i, 'title', v)}
            />
            <ContentField
              label="Body"
              en={step.body}
              pt={pt.steps[i].body}
              onChangeEn={v => setStep('en', i, 'body', v)}
              onChangePt={v => setStep('pt', i, 'body', v)}
              multiline
            />
          </ContentSection>
        ))}

        <ContentSection title="CTA Section (dark band at bottom)">
          <ContentField label="Eyebrow" {...f('ctaEyebrow')} />
          <ContentField label="Heading — line 1" {...f('ctaHeading0')} />
          <ContentField label="Heading — line 2 (italic teal)" {...f('ctaHeading1')} />
          <ContentField label="Primary button" {...f('ctaButton')} />
          <ContentField label="Secondary link" {...f('ctaSecondary')} />
        </ContentSection>
      </div>
    </div>
  )
}

// ─── Story Photos ─────────────────────────────────────────────────────────────

const PHOTO_DEFAULTS: StoryPhoto[] = [
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776190677242-img_8751.jpg', alt: 'Crochet heart' },
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776190678839-img_8562.jpg', alt: 'Crochet square' },
  { src: '/images/process-3.jpeg', alt: 'Green animals' },
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776191359279-img_6360.jpg', alt: 'Crochet granny squares in progress' },
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776191361270-img_0356.jpg', alt: 'Yarn and granny squares' },
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776191363725-img_7408.jpg', alt: 'Crocheting in progress' },
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776191365240-img_8400.jpg', alt: 'Crochet bookmarks' },
]

const PHOTO_LABELS: { label: string; hint: string }[] = [
  { label: 'Photo 1 — Hero portrait',    hint: 'Appears on the right of the hero section (tall portrait format).' },
  { label: 'Photo 2 — Carousel photo 1', hint: 'First photo in the journey carousel.' },
  { label: 'Photo 3 — Mission portrait', hint: 'Appears on the left of the mission/philosophy section (tall portrait).' },
  { label: 'Photo 4 — Carousel photo 2', hint: 'Second photo in the journey carousel.' },
  { label: 'Photo 5 — Carousel photo 3', hint: 'Third photo in the journey carousel.' },
  { label: 'Photo 6 — Carousel photo 4', hint: 'Fourth photo in the journey carousel.' },
  { label: 'Photo 7 — Carousel photo 5', hint: 'Fifth photo in the journey carousel.' },
]

function StoryPhotos() {
  const [photos, setPhotos] = useState<StoryPhoto[]>(PHOTO_DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/story-photos')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.photos) && d.photos.length === 7) {
          setPhotos(d.photos)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function setPhoto(index: number, patch: Partial<StoryPhoto>) {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, ...patch } : p))
  }

  async function save() {
    setSaving(true)
    await fetch('/api/admin/story-photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <p className="text-[13px] text-stone">Loading…</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[13px] text-stone">
          Photos shown on the Story page.{' '}
          <a href="/story" target="_blank" className="text-teal hover:underline">View page →</a>
        </p>
        <button
          onClick={save}
          disabled={saving}
          className="bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Photos'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PHOTO_LABELS.map(({ label, hint }, i) => (
          <div key={i} className="bg-white border border-gray-100 p-5 space-y-3">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase font-semibold text-ink mb-1">{label}</p>
              <p className="text-[11px] text-stone leading-relaxed">{hint}</p>
            </div>
            <ImageUpload
              value={photos[i]?.src ?? ''}
              onChange={url => setPhoto(i, { src: url })}
            />
            <div>
              <label className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-1">Alt text</label>
              <input
                type="text"
                value={photos[i]?.alt ?? ''}
                onChange={e => setPhoto(i, { alt: e.target.value })}
                placeholder="Describe the photo…"
                className="w-full border border-gray-200 px-3 py-2 text-[12px] text-ink outline-none focus:border-teal transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Events & Workshops ───────────────────────────────────────────────────────

type Event = {
  id: string
  title: string
  title_pt: string
  date: string
  place: string
  description: string
  description_pt: string
  photos: string[]
  link: string
  active: boolean
  sort_order: number
}

const EVENT_EMPTY: Omit<Event, 'id'> = {
  title: '',
  title_pt: '',
  date: '',
  place: '',
  description: '',
  description_pt: '',
  photos: [],
  link: '',
  active: true,
  sort_order: 0,
}

const REQUIRED_TO_PUBLISH: { key: keyof typeof EVENT_EMPTY; label: string }[] = [
  { key: 'title',          label: 'Title (EN)' },
  { key: 'title_pt',       label: 'Title (PT)' },
  { key: 'date',           label: 'Date' },
  { key: 'place',          label: 'Place' },
  { key: 'description',    label: 'Description (EN)' },
  { key: 'description_pt', label: 'Description (PT)' },
]

function missingFields(form: Omit<Event, 'id'>) {
  return REQUIRED_TO_PUBLISH.filter(r => !String(form[r.key] ?? '').trim())
}

function EventField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">{label}</label>
      {children}
    </div>
  )
}

const eventInputCls = 'w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors'

function EventsWorkshops() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [form, setForm] = useState<Omit<Event, 'id'>>(EVENT_EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/admin/events')
    if (res.ok) setEvents(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function set(field: keyof typeof EVENT_EMPTY, value: string | boolean | string[]) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function openNew() {
    setEditing(null); setForm(EVENT_EMPTY); setError(''); setShowForm(true)
  }

  function openEdit(event: Event) {
    setEditing(event)
    setForm({
      title:          event.title,
      title_pt:       event.title_pt ?? '',
      date:           event.date,
      place:          event.place,
      description:    event.description,
      description_pt: event.description_pt ?? '',
      photos:         event.photos ?? [],
      link:           event.link ?? '',
      active:         event.active,
      sort_order:     event.sort_order,
    })
    setError(''); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancel() { setShowForm(false); setEditing(null); setForm(EVENT_EMPTY); setError('') }

  const missing = missingFields(form)
  const isComplete = missing.length === 0

  async function save() {
    if (!form.title || !form.date || !form.place) { setError('Title, date and place are required.'); return }
    setSaving(true); setError('')
    const payload = { ...form, active: isComplete ? form.active : false }
    const url = editing ? `/api/admin/events/${editing.id}` : '/api/admin/events'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) { const j = await res.json(); setError(j.error ?? 'Save failed'); setSaving(false); return }
    await load(); cancel(); setSaving(false)
  }

  async function deleteEvent(id: string) {
    const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    if (res.ok) { setEvents(events.filter(e => e.id !== id)); setConfirmDelete(null) }
  }

  async function toggleActive(event: Event) {
    const allFields = { ...event }
    const eventMissing = REQUIRED_TO_PUBLISH.filter(r => !String((allFields as Record<string, unknown>)[r.key] ?? '').trim())
    if (!event.active && eventMissing.length > 0) return
    await fetch(`/api/admin/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...event, active: !event.active }),
    })
    await load()
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[13px] text-stone">Events and workshops shown on the Story page.</p>
        {!showForm && (
          <button onClick={openNew}
            className="flex items-center gap-2 bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-teal-dark transition-colors">
            <Plus size={14} /> New Event
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 p-8 mb-10 space-y-6">
          <h2 className="text-[15px] font-semibold text-ink">{editing ? 'Edit Event' : 'New Event'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EventField label="Date *">
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={eventInputCls} />
            </EventField>
            <EventField label="Place *">
              <input type="text" value={form.place} onChange={e => set('place', e.target.value)}
                placeholder="e.g. Porto, Portugal" className={eventInputCls} />
            </EventField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EventField label="Title (EN) *">
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. Craft Fair Porto" className={eventInputCls} />
            </EventField>
            <EventField label="Title (PT) *">
              <input type="text" value={form.title_pt} onChange={e => set('title_pt', e.target.value)}
                placeholder="ex. Feira de Artesanato Porto" className={eventInputCls} />
            </EventField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EventField label="Description (EN)">
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={4} placeholder="What happened, what was shown, any highlights…"
                className={`${eventInputCls} resize-none`} />
            </EventField>
            <EventField label="Description (PT)">
              <textarea value={form.description_pt} onChange={e => set('description_pt', e.target.value)}
                rows={4} placeholder="O que aconteceu, o que foi mostrado, os destaques…"
                className={`${eventInputCls} resize-none`} />
            </EventField>
          </div>

          <EventField label="Photos">
            <MultiImageUpload values={form.photos} onChange={urls => set('photos', urls)} />
          </EventField>

          <EventField label="Link (optional)">
            <input type="url" value={form.link} onChange={e => set('link', e.target.value)}
              placeholder="e.g. https://instagram.com/p/… or https://eventhost.com" className={eventInputCls} />
            <p className="mt-1.5 text-[11px] text-stone">
              Link to the event page, host website, or social media post. Shown as a subtle button on the Story page.
            </p>
          </EventField>

          <div className="space-y-3">
            <div className={`flex items-center gap-3 ${!isComplete ? 'opacity-50' : ''}`}>
              <input type="checkbox" id="active" checked={isComplete && form.active} disabled={!isComplete}
                onChange={e => set('active', e.target.checked)} className="accent-teal w-4 h-4 disabled:cursor-not-allowed" />
              <label htmlFor="active" className={`text-[13px] text-stone ${!isComplete ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                Visible on the Story page
              </label>
            </div>

            {!isComplete && (
              <div className="bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
                <p className="text-[11px] font-semibold text-amber-800 mb-2 tracking-wide uppercase">
                  Will be saved as draft — fill in to publish:
                </p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {missing.map(f => (
                    <li key={f.key} className="text-[11px] text-amber-700 flex items-center gap-1">
                      <span className="text-amber-400">○</span> {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isComplete && (
              <div className="bg-teal/5 border border-teal/20 rounded-sm px-4 py-3">
                <p className="text-[11px] text-teal font-semibold tracking-wide uppercase">
                  ✓ Event is complete — ready to publish.
                </p>
              </div>
            )}
          </div>

          {error && <p className="text-[12px] text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-6 py-3 hover:bg-teal-dark transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : <><Check size={13} /> {editing ? 'Update' : 'Save Event'}</>}
            </button>
            <button onClick={cancel}
              className="flex items-center gap-2 border border-gray-200 text-stone text-[11px] tracking-[0.15em] uppercase px-6 py-3 hover:border-ink hover:text-ink transition-colors">
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-[13px] text-stone">Loading…</p>
      ) : events.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <p className="text-[13px] text-stone mb-4">No events yet.</p>
          <button onClick={openNew} className="text-[11px] tracking-[0.15em] uppercase text-teal hover:text-teal-dark transition-colors">
            Add your first event →
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 divide-y divide-gray-100">
          {events.map(event => {
            const eventMissing = REQUIRED_TO_PUBLISH.filter(r => !String((event as unknown as Record<string, unknown>)[r.key] ?? '').trim())
            const eventComplete = eventMissing.length === 0
            return (
              <div key={event.id} className="flex items-start gap-5 p-5">
                {event.photos?.[0] ? (
                  <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-linen">
                    <img src={event.photos[0]} alt={event.title} className="w-full h-full object-cover object-top" />
                  </div>
                ) : (
                  <div className="w-16 h-16 shrink-0 bg-linen flex items-center justify-center">
                    <span className="text-[20px]">📸</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-ink truncate">{event.title}</p>
                  <p className="text-[12px] text-stone mt-0.5">
                    {new Date(event.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' · '}{event.place}
                  </p>
                  {!eventComplete && (
                    <p className="text-[10px] text-amber-600 mt-1">
                      ○ Missing: {eventMissing.map(f => f.label).join(', ')}
                    </p>
                  )}
                  {event.photos?.length > 0 && (
                    <p className="text-[11px] text-stone mt-1">{event.photos.length} photo{event.photos.length !== 1 ? 's' : ''}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toggleActive(event)}
                    title={!eventComplete && !event.active ? 'Complete all fields to publish' : ''}
                    className={`text-[10px] tracking-[0.12em] uppercase px-3 py-1 border transition-colors ${
                      event.active
                        ? 'border-teal text-teal'
                        : !eventComplete
                        ? 'border-gray-200 text-stone/40 cursor-not-allowed'
                        : 'border-gray-200 text-stone hover:border-ink'
                    }`}
                  >
                    {event.active ? 'Visible' : 'Hidden'}
                  </button>
                  <button onClick={() => openEdit(event)} className="text-stone hover:text-ink transition-colors p-1" title="Edit">
                    <Pencil size={15} strokeWidth={1.5} />
                  </button>
                  {confirmDelete === event.id ? (
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-stone">Delete?</span>
                      <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700 font-medium">Yes</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-stone hover:text-ink">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(event.id)} className="text-stone hover:text-red-500 transition-colors p-1" title="Delete">
                      <Trash2 size={15} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminStoryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Page Texts')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">Story</h1>
        <p className="text-[13px] text-stone mt-1">Story page content and events</p>
      </div>

      <div className="flex gap-1 mb-8 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-[12px] tracking-[0.08em] uppercase transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-teal text-teal font-medium'
                : 'border-transparent text-stone hover:text-ink'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Page Texts' && <StoryTexts />}
      {activeTab === 'Photos' && <StoryPhotos />}
      {activeTab === 'Events & Workshops' && <EventsWorkshops />}
    </div>
  )
}
