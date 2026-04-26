'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { DbProduct } from '@/lib/supabase'
import Image from 'next/image'
import { Pencil, Trash2, Plus, Check, X, Loader2, ExternalLink } from 'lucide-react'
import ContentField from '@/components/admin/ContentField'
import ContentSection from '@/components/admin/ContentSection'
import { translations } from '@/lib/i18n/translations'

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = ['Hero Slideshow', 'Page Texts', 'Partners'] as const
type Tab = typeof TABS[number]

// ─── Hero Slideshow ───────────────────────────────────────────────────────────

function HeroSlideshow() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [slots, setSlots] = useState<[string, string, string]>(['', '', ''])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data: prods }, { data: config }] = await Promise.all([
        supabase.from('products').select('*').eq('active', true).order('sort_order'),
        supabase.from('site_config').select('value').eq('key', 'hero_products').single(),
      ])
      setProducts(prods ?? [])
      const slugs: string[] = config?.value ?? ['', '', '']
      setSlots([slugs[0] ?? '', slugs[1] ?? '', slugs[2] ?? ''])
      setLoading(false)
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/admin/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs: slots }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const getProduct = (slug: string) => products.find(p => p.slug === slug)

  if (loading) return <p className="text-[13px] text-stone">Loading…</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[13px] text-stone">Choose the 3 animals that rotate on the homepage.</p>
        <button
          onClick={save}
          disabled={saving}
          className="bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {([0, 1, 2] as const).map(i => {
          const selected = getProduct(slots[i])
          return (
            <div key={i} className="bg-white border border-gray-100 rounded-sm overflow-hidden">
              <div className="relative aspect-square bg-linen">
                {selected?.image ? (
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    fill
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[12px] text-stone">No product selected</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-white/90 text-[10px] tracking-[0.15em] uppercase text-teal px-2 py-0.5">
                  Slide {i + 1}
                </div>
                {i === 0 && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-[9px] px-2 py-1 leading-snug">
                    Text: "Every knot tells a story." — generic brand slide, any animal works
                  </div>
                )}
                {i === 1 && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-[9px] px-2 py-1 leading-snug">
                    Text: "Art born from love of nature." — pick an animal with a nature/conservation story
                  </div>
                )}
                {i === 2 && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-[9px] px-2 py-1 leading-snug">
                    Text: "One knot, one creature." — pick any signature piece
                  </div>
                )}
              </div>

              <div className="p-4">
                {selected && (
                  <p className="text-[13px] font-medium text-ink mb-2">{selected.name}</p>
                )}
                <select
                  value={slots[i]}
                  onChange={e => {
                    const next = [...slots] as [string, string, string]
                    next[i] = e.target.value
                    setSlots(next)
                  }}
                  className="w-full text-[12px] border border-gray-200 px-3 py-2 text-stone outline-none hover:border-teal transition-colors bg-white"
                >
                  <option value="">— Choose an animal —</option>
                  {products.map(p => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}{p.badge === 'soldout' ? ' (sold)' : ''}
                    </option>
                  ))}
                </select>
                {selected && (
                  <p className="mt-2 text-[11px] text-stone leading-relaxed line-clamp-3">
                    {selected.fact}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Home Page Texts ───────────────────────────────────────────────────────────

const PAGE_KEY = 'page_home'
const DEF_EN = translations.en
const DEF_PT = translations.pt

type SlideField = {
  label: string
  heading0: string
  heading1: string
  sub: string
  cta: string
  secondary: string
}

type HomeState = {
  slides: [SlideField, SlideField, SlideField]
  mosaicEyebrow: string
  mosaicHeading: string
  mosaicSub: string
  mosaicCta: string
  storyEyebrow: string
  storyHeading0: string
  storyHeading1: string
  storySub: string
  storyCta: string
  commissionEyebrow: string
  commissionHeading0: string
  commissionHeading1: string
  commissionSub: string
  commissionCta: string
}

function defaultSlide(s: typeof DEF_EN.hero.slides[0]): SlideField {
  return {
    label: s.label,
    heading0: s.heading[0],
    heading1: s.heading[1],
    sub: s.sub,
    cta: s.cta,
    secondary: s.secondary,
  }
}

function defaultHomeState(t: typeof DEF_EN): HomeState {
  return {
    slides: [
      defaultSlide(t.hero.slides[0]),
      defaultSlide(t.hero.slides[1]),
      defaultSlide(t.hero.slides[2]),
    ],
    mosaicEyebrow: t.home.mosaic.eyebrow,
    mosaicHeading: t.home.mosaic.heading,
    mosaicSub: t.home.mosaic.sub,
    mosaicCta: t.home.mosaic.cta,
    storyEyebrow: t.home.story.eyebrow,
    storyHeading0: t.home.story.heading[0],
    storyHeading1: t.home.story.heading[1],
    storySub: t.home.story.sub,
    storyCta: t.home.story.cta,
    commissionEyebrow: t.home.commission.eyebrow,
    commissionHeading0: t.home.commission.heading[0],
    commissionHeading1: t.home.commission.heading[1],
    commissionSub: t.home.commission.sub,
    commissionCta: t.home.commission.cta,
  }
}

function homeStateToPayload(en: HomeState, pt: HomeState) {
  return {
    en: {
      hero: {
        slides: en.slides.map(s => ({
          label: s.label,
          heading: [s.heading0, s.heading1],
          sub: s.sub,
          cta: s.cta,
          secondary: s.secondary,
        })),
      },
      home: {
        mosaic: { eyebrow: en.mosaicEyebrow, heading: en.mosaicHeading, sub: en.mosaicSub, cta: en.mosaicCta },
        story: { eyebrow: en.storyEyebrow, heading: [en.storyHeading0, en.storyHeading1], sub: en.storySub, cta: en.storyCta },
        commission: { eyebrow: en.commissionEyebrow, heading: [en.commissionHeading0, en.commissionHeading1], sub: en.commissionSub, cta: en.commissionCta },
      },
    },
    pt: {
      hero: {
        slides: pt.slides.map(s => ({
          label: s.label,
          heading: [s.heading0, s.heading1],
          sub: s.sub,
          cta: s.cta,
          secondary: s.secondary,
        })),
      },
      home: {
        mosaic: { eyebrow: pt.mosaicEyebrow, heading: pt.mosaicHeading, sub: pt.mosaicSub, cta: pt.mosaicCta },
        story: { eyebrow: pt.storyEyebrow, heading: [pt.storyHeading0, pt.storyHeading1], sub: pt.storySub, cta: pt.storyCta },
        commission: { eyebrow: pt.commissionEyebrow, heading: [pt.commissionHeading0, pt.commissionHeading1], sub: pt.commissionSub, cta: pt.commissionCta },
      },
    },
  }
}

function payloadToHomeState(raw: Record<string, unknown>, defaults: HomeState): HomeState {
  if (!raw || typeof raw !== 'object') return defaults
  const r = raw as Record<string, Record<string, unknown>>

  const hero = r.hero as Record<string, unknown> | undefined
  const home = r.home as Record<string, unknown> | undefined

  const rawSlides = (hero?.slides as Array<Record<string, unknown>> | undefined) ?? []
  const slides = defaults.slides.map((defSlide, i) => {
    const rs = rawSlides[i] as Record<string, unknown> | undefined
    const heading = rs?.heading as string[] | undefined
    return {
      label: (rs?.label as string) || defSlide.label,
      heading0: heading?.[0] || defSlide.heading0,
      heading1: heading?.[1] || defSlide.heading1,
      sub: (rs?.sub as string) || defSlide.sub,
      cta: (rs?.cta as string) || defSlide.cta,
      secondary: (rs?.secondary as string) || defSlide.secondary,
    }
  }) as [SlideField, SlideField, SlideField]

  const mosaic = (home?.mosaic as Record<string, string> | undefined) ?? {}
  const story = (home?.story as Record<string, unknown> | undefined) ?? {}
  const storyHeading = (story.heading as string[] | undefined) ?? []
  const commission = (home?.commission as Record<string, unknown> | undefined) ?? {}
  const commissionHeading = (commission.heading as string[] | undefined) ?? []

  return {
    slides,
    mosaicEyebrow: (mosaic.eyebrow as string) || defaults.mosaicEyebrow,
    mosaicHeading: (mosaic.heading as string) || defaults.mosaicHeading,
    mosaicSub: (mosaic.sub as string) || defaults.mosaicSub,
    mosaicCta: (mosaic.cta as string) || defaults.mosaicCta,
    storyEyebrow: (story.eyebrow as string) || defaults.storyEyebrow,
    storyHeading0: storyHeading[0] || defaults.storyHeading0,
    storyHeading1: storyHeading[1] || defaults.storyHeading1,
    storySub: (story.sub as string) || defaults.storySub,
    storyCta: (story.cta as string) || defaults.storyCta,
    commissionEyebrow: (commission.eyebrow as string) || defaults.commissionEyebrow,
    commissionHeading0: commissionHeading[0] || defaults.commissionHeading0,
    commissionHeading1: commissionHeading[1] || defaults.commissionHeading1,
    commissionSub: (commission.sub as string) || defaults.commissionSub,
    commissionCta: (commission.cta as string) || defaults.commissionCta,
  }
}

function HomeTexts() {
  const [en, setEn] = useState<HomeState>(defaultHomeState(DEF_EN))
  const [pt, setPt] = useState<HomeState>(defaultHomeState(DEF_PT))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/content/${PAGE_KEY}`)
      .then(r => r.json())
      .then(d => {
        if (d.content?.en) setEn(payloadToHomeState(d.content.en, defaultHomeState(DEF_EN)))
        if (d.content?.pt) setPt(payloadToHomeState(d.content.pt, defaultHomeState(DEF_PT)))
        setLoading(false)
      })
  }, [])

  function setEnField(field: keyof HomeState, value: string) {
    setEn(s => ({ ...s, [field]: value }))
  }
  function setPtField(field: keyof HomeState, value: string) {
    setPt(s => ({ ...s, [field]: value }))
  }
  function setEnSlide(i: number, field: keyof SlideField, value: string) {
    setEn(s => {
      const slides = s.slides.map((sl, idx) => idx === i ? { ...sl, [field]: value } : sl) as [SlideField, SlideField, SlideField]
      return { ...s, slides }
    })
  }
  function setPtSlide(i: number, field: keyof SlideField, value: string) {
    setPt(s => {
      const slides = s.slides.map((sl, idx) => idx === i ? { ...sl, [field]: value } : sl) as [SlideField, SlideField, SlideField]
      return { ...s, slides }
    })
  }

  async function save() {
    setSaving(true)
    await fetch(`/api/admin/content/${PAGE_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(homeStateToPayload(en, pt)),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <p className="text-[13px] text-stone">Loading…</p>

  const SLIDE_LABELS = ['Slide 1 — Brand / Generic', 'Slide 2 — Animal story', 'Slide 3 — Signature piece']

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[13px] text-stone">
          Edit hero slides, mosaic, story teaser and commission sections.{' '}
          <a href="/" target="_blank" className="text-teal hover:underline">View page →</a>
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
        {([0, 1, 2] as const).map(i => (
          <ContentSection key={i} title={SLIDE_LABELS[i]}>
            <ContentField
              label="Label (small tag above heading)"
              en={en.slides[i].label}
              pt={pt.slides[i].label}
              onChangeEn={v => setEnSlide(i, 'label', v)}
              onChangePt={v => setPtSlide(i, 'label', v)}
            />
            <ContentField
              label="Heading — line 1"
              en={en.slides[i].heading0}
              pt={pt.slides[i].heading0}
              onChangeEn={v => setEnSlide(i, 'heading0', v)}
              onChangePt={v => setPtSlide(i, 'heading0', v)}
            />
            <ContentField
              label="Heading — line 2 (italic teal)"
              en={en.slides[i].heading1}
              pt={pt.slides[i].heading1}
              onChangeEn={v => setEnSlide(i, 'heading1', v)}
              onChangePt={v => setPtSlide(i, 'heading1', v)}
            />
            <ContentField
              label="Subtitle"
              en={en.slides[i].sub}
              pt={pt.slides[i].sub}
              onChangeEn={v => setEnSlide(i, 'sub', v)}
              onChangePt={v => setPtSlide(i, 'sub', v)}
              multiline
            />
            <ContentField
              label="Primary CTA button"
              en={en.slides[i].cta}
              pt={pt.slides[i].cta}
              onChangeEn={v => setEnSlide(i, 'cta', v)}
              onChangePt={v => setPtSlide(i, 'cta', v)}
            />
            <ContentField
              label="Secondary link"
              en={en.slides[i].secondary}
              pt={pt.slides[i].secondary}
              onChangeEn={v => setEnSlide(i, 'secondary', v)}
              onChangePt={v => setPtSlide(i, 'secondary', v)}
            />
          </ContentSection>
        ))}

        <ContentSection title="Product Mosaic Section">
          <ContentField label="Eyebrow" en={en.mosaicEyebrow} pt={pt.mosaicEyebrow} onChangeEn={v => setEnField('mosaicEyebrow', v)} onChangePt={v => setPtField('mosaicEyebrow', v)} />
          <ContentField label="Heading" en={en.mosaicHeading} pt={pt.mosaicHeading} onChangeEn={v => setEnField('mosaicHeading', v)} onChangePt={v => setPtField('mosaicHeading', v)} />
          <ContentField label="Subtitle" en={en.mosaicSub} pt={pt.mosaicSub} onChangeEn={v => setEnField('mosaicSub', v)} onChangePt={v => setPtField('mosaicSub', v)} multiline />
          <ContentField label="CTA button" en={en.mosaicCta} pt={pt.mosaicCta} onChangeEn={v => setEnField('mosaicCta', v)} onChangePt={v => setPtField('mosaicCta', v)} />
        </ContentSection>

        <ContentSection title="Story Teaser Section">
          <ContentField label="Eyebrow" en={en.storyEyebrow} pt={pt.storyEyebrow} onChangeEn={v => setEnField('storyEyebrow', v)} onChangePt={v => setPtField('storyEyebrow', v)} />
          <ContentField label="Heading — line 1" en={en.storyHeading0} pt={pt.storyHeading0} onChangeEn={v => setEnField('storyHeading0', v)} onChangePt={v => setPtField('storyHeading0', v)} />
          <ContentField label="Heading — line 2 (italic teal)" en={en.storyHeading1} pt={pt.storyHeading1} onChangeEn={v => setEnField('storyHeading1', v)} onChangePt={v => setPtField('storyHeading1', v)} />
          <ContentField label="Subtitle" en={en.storySub} pt={pt.storySub} onChangeEn={v => setEnField('storySub', v)} onChangePt={v => setPtField('storySub', v)} multiline />
          <ContentField label="CTA button" en={en.storyCta} pt={pt.storyCta} onChangeEn={v => setEnField('storyCta', v)} onChangePt={v => setPtField('storyCta', v)} />
        </ContentSection>

        <ContentSection title="Commission Teaser Section">
          <ContentField label="Eyebrow" en={en.commissionEyebrow} pt={pt.commissionEyebrow} onChangeEn={v => setEnField('commissionEyebrow', v)} onChangePt={v => setPtField('commissionEyebrow', v)} />
          <ContentField label="Heading — line 1" en={en.commissionHeading0} pt={pt.commissionHeading0} onChangeEn={v => setEnField('commissionHeading0', v)} onChangePt={v => setPtField('commissionHeading0', v)} />
          <ContentField label="Heading — line 2 (italic teal)" en={en.commissionHeading1} pt={pt.commissionHeading1} onChangeEn={v => setEnField('commissionHeading1', v)} onChangePt={v => setPtField('commissionHeading1', v)} />
          <ContentField label="Subtitle" en={en.commissionSub} pt={pt.commissionSub} onChangeEn={v => setEnField('commissionSub', v)} onChangePt={v => setPtField('commissionSub', v)} multiline />
          <ContentField label="CTA button" en={en.commissionCta} pt={pt.commissionCta} onChangeEn={v => setEnField('commissionCta', v)} onChangePt={v => setPtField('commissionCta', v)} />
        </ContentSection>
      </div>
    </div>
  )
}

// ─── Partners Manager ─────────────────────────────────────────────────────────

type Partner = {
  id: string
  name: string
  description: string
  url: string
  logo_url: string
  active: boolean
  sort_order: number
}

const PARTNER_EMPTY: Omit<Partner, 'id'> = {
  name: '',
  description: '',
  url: '',
  logo_url: '',
  active: true,
  sort_order: 0,
}

const inputCls = 'w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">{label}</label>
      {children}
    </div>
  )
}

function LogoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    if (!file.type.startsWith('image/')) { setError('Image files only.'); return }
    setUploading(true); setError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (!res.ok) setError(json.error ?? 'Upload failed')
    else onChange(json.url)
    setUploading(false)
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-24 h-24 border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
          <Image src={value} alt="Logo" fill className="object-contain p-2" />
          <button type="button" onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-white border border-gray-200 rounded-full p-0.5 hover:bg-red-50">
            <X size={11} />
          </button>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { if (e.target.files?.[0]) upload(e.target.files[0]); e.target.value = '' }} />
      <div className="flex gap-2 items-center">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 border border-dashed border-gray-300 text-stone text-[11px] tracking-[0.1em] uppercase px-4 py-2 hover:border-teal hover:text-teal transition-colors disabled:opacity-50">
          {uploading ? <><Loader2 size={12} className="animate-spin" /> Uploading…</> : <><Plus size={12} /> Upload logo</>}
        </button>
        <span className="text-[11px] text-stone">or</span>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder="Paste image URL" className="flex-1 border border-gray-200 px-3 py-2 text-[12px] text-ink outline-none focus:border-teal transition-colors" />
      </div>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  )
}

function PartnersManager() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [form, setForm] = useState<Omit<Partner, 'id'>>(PARTNER_EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/admin/partners')
    if (res.ok) setPartners(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function set(field: keyof typeof PARTNER_EMPTY, value: string | boolean | number) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function openNew() { setEditing(null); setForm(PARTNER_EMPTY); setError(''); setShowForm(true) }

  function openEdit(p: Partner) {
    setEditing(p)
    setForm({ name: p.name, description: p.description, url: p.url, logo_url: p.logo_url, active: p.active, sort_order: p.sort_order })
    setError(''); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancel() { setShowForm(false); setEditing(null); setForm(PARTNER_EMPTY); setError('') }

  async function save() {
    if (!form.name || !form.url) { setError('Name and URL are required.'); return }
    setSaving(true); setError('')
    const url = editing ? `/api/admin/partners/${editing.id}` : '/api/admin/partners'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (!res.ok) { const j = await res.json(); setError(j.error ?? 'Save failed'); setSaving(false); return }
    await load(); cancel(); setSaving(false)
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' })
    if (res.ok) { setPartners(partners.filter(p => p.id !== id)); setConfirmDelete(null) }
  }

  async function toggleActive(p: Partner) {
    await fetch(`/api/admin/partners/${p.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, active: !p.active }),
    })
    await load()
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[13px] text-stone">Partners shown at the bottom of the homepage.</p>
        {!showForm && (
          <button onClick={openNew}
            className="flex items-center gap-2 bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-teal-dark transition-colors">
            <Plus size={14} /> Add Partner
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 p-8 mb-10 space-y-6">
          <h2 className="text-[15px] font-semibold text-ink">{editing ? 'Edit Partner' : 'New Partner'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Name *">
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Studio Nómada" className={inputCls} />
            </Field>
            <Field label="Website URL *">
              <input type="url" value={form.url} onChange={e => set('url', e.target.value)}
                placeholder="https://example.com" className={inputCls} />
            </Field>
          </div>

          <Field label="Short description">
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={2} placeholder="One sentence about the partner and your connection…"
              className={`${inputCls} resize-none`} />
          </Field>

          <Field label="Logo">
            <LogoUpload value={form.logo_url} onChange={url => set('logo_url', url)} />
          </Field>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-[13px] text-stone cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)}
                className="accent-teal w-4 h-4" />
              Visible on homepage
            </label>
            <div className="flex items-center gap-2">
              <label className="text-[11px] tracking-[0.1em] uppercase text-stone">Order</label>
              <input type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))}
                className="w-16 border border-gray-200 px-2 py-1.5 text-[13px] text-center outline-none focus:border-teal" />
            </div>
          </div>

          {error && <p className="text-[12px] text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-6 py-3 hover:bg-teal-dark transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : <><Check size={13} /> {editing ? 'Update' : 'Save Partner'}</>}
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
      ) : partners.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <p className="text-[13px] text-stone mb-4">No partners yet.</p>
          <button onClick={openNew} className="text-[11px] tracking-[0.15em] uppercase text-teal hover:text-teal-dark transition-colors">
            Add your first partner →
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 divide-y divide-gray-100">
          {partners.map(p => (
            <div key={p.id} className="flex items-center gap-5 p-5">
              <div className="w-14 h-14 shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                {p.logo_url
                  ? <img src={p.logo_url} alt={p.name} className="w-full h-full object-contain p-1" />
                  : <span className="text-[20px]">🤝</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-ink">{p.name}</p>
                {p.description && <p className="text-[12px] text-stone mt-0.5 truncate">{p.description}</p>}
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-teal hover:underline flex items-center gap-1 mt-0.5">
                  {p.url} <ExternalLink size={10} />
                </a>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => toggleActive(p)}
                  className={`text-[10px] tracking-[0.12em] uppercase px-3 py-1 border transition-colors ${p.active ? 'border-teal text-teal' : 'border-gray-200 text-stone hover:border-ink'}`}>
                  {p.active ? 'Visible' : 'Hidden'}
                </button>
                <button onClick={() => openEdit(p)} className="text-stone hover:text-ink transition-colors p-1">
                  <Pencil size={15} strokeWidth={1.5} />
                </button>
                {confirmDelete === p.id ? (
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-stone">Delete?</span>
                    <button onClick={() => remove(p.id)} className="text-red-500 hover:text-red-700 font-medium">Yes</button>
                    <button onClick={() => setConfirmDelete(null)} className="text-stone hover:text-ink">No</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(p.id)} className="text-stone hover:text-red-500 transition-colors p-1">
                    <Trash2 size={15} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminHomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('Hero Slideshow')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">Home</h1>
        <p className="text-[13px] text-stone mt-1">Homepage content — hero, texts and partners</p>
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

      {activeTab === 'Hero Slideshow' && <HeroSlideshow />}
      {activeTab === 'Page Texts' && <HomeTexts />}
      {activeTab === 'Partners' && <PartnersManager />}
    </div>
  )
}
