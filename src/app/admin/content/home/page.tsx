'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import ContentField from '@/components/admin/ContentField'
import ContentSection from '@/components/admin/ContentSection'
import { translations } from '@/lib/i18n/translations'

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

function defaultState(t: typeof DEF_EN): HomeState {
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

function stateToPayload(en: HomeState, pt: HomeState) {
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

function payloadToState(raw: Record<string, unknown>, defaults: HomeState): HomeState {
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

export default function AdminContentHome() {
  const [en, setEn] = useState<HomeState>(defaultState(DEF_EN))
  const [pt, setPt] = useState<HomeState>(defaultState(DEF_PT))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/content/${PAGE_KEY}`)
      .then(r => r.json())
      .then(d => {
        if (d.content?.en) setEn(payloadToState(d.content.en, defaultState(DEF_EN)))
        if (d.content?.pt) setPt(payloadToState(d.content.pt, defaultState(DEF_PT)))
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
    const payload = stateToPayload(en, pt)
    await fetch(`/api/admin/content/${PAGE_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return (
    <AdminShell>
      <p className="text-[13px] text-stone">Loading…</p>
    </AdminShell>
  )

  const SLIDE_LABELS = ['Slide 1 — Brand / Generic', 'Slide 2 — Animal story', 'Slide 3 — Signature piece']

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Home Page Content</h1>
          <p className="text-[13px] text-stone mt-1">
            Edit hero slides, mosaic, story teaser and commission sections.{' '}
            <a href="/" target="_blank" className="text-teal hover:underline">View page →</a>
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">

        {/* Hero Slides */}
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

        {/* Mosaic section */}
        <ContentSection title="Product Mosaic Section">
          <ContentField
            label="Eyebrow"
            en={en.mosaicEyebrow} pt={pt.mosaicEyebrow}
            onChangeEn={v => setEnField('mosaicEyebrow', v)} onChangePt={v => setPtField('mosaicEyebrow', v)}
          />
          <ContentField
            label="Heading"
            en={en.mosaicHeading} pt={pt.mosaicHeading}
            onChangeEn={v => setEnField('mosaicHeading', v)} onChangePt={v => setPtField('mosaicHeading', v)}
          />
          <ContentField
            label="Subtitle"
            en={en.mosaicSub} pt={pt.mosaicSub}
            onChangeEn={v => setEnField('mosaicSub', v)} onChangePt={v => setPtField('mosaicSub', v)}
            multiline
          />
          <ContentField
            label="CTA button"
            en={en.mosaicCta} pt={pt.mosaicCta}
            onChangeEn={v => setEnField('mosaicCta', v)} onChangePt={v => setPtField('mosaicCta', v)}
          />
        </ContentSection>

        {/* Story teaser */}
        <ContentSection title="Story Teaser Section">
          <ContentField
            label="Eyebrow"
            en={en.storyEyebrow} pt={pt.storyEyebrow}
            onChangeEn={v => setEnField('storyEyebrow', v)} onChangePt={v => setPtField('storyEyebrow', v)}
          />
          <ContentField
            label="Heading — line 1"
            en={en.storyHeading0} pt={pt.storyHeading0}
            onChangeEn={v => setEnField('storyHeading0', v)} onChangePt={v => setPtField('storyHeading0', v)}
          />
          <ContentField
            label="Heading — line 2 (italic teal)"
            en={en.storyHeading1} pt={pt.storyHeading1}
            onChangeEn={v => setEnField('storyHeading1', v)} onChangePt={v => setPtField('storyHeading1', v)}
          />
          <ContentField
            label="Subtitle"
            en={en.storySub} pt={pt.storySub}
            onChangeEn={v => setEnField('storySub', v)} onChangePt={v => setPtField('storySub', v)}
            multiline
          />
          <ContentField
            label="CTA button"
            en={en.storyCta} pt={pt.storyCta}
            onChangeEn={v => setEnField('storyCta', v)} onChangePt={v => setPtField('storyCta', v)}
          />
        </ContentSection>

        {/* Commission teaser */}
        <ContentSection title="Commission Teaser Section">
          <ContentField
            label="Eyebrow"
            en={en.commissionEyebrow} pt={pt.commissionEyebrow}
            onChangeEn={v => setEnField('commissionEyebrow', v)} onChangePt={v => setPtField('commissionEyebrow', v)}
          />
          <ContentField
            label="Heading — line 1"
            en={en.commissionHeading0} pt={pt.commissionHeading0}
            onChangeEn={v => setEnField('commissionHeading0', v)} onChangePt={v => setPtField('commissionHeading0', v)}
          />
          <ContentField
            label="Heading — line 2 (italic teal)"
            en={en.commissionHeading1} pt={pt.commissionHeading1}
            onChangeEn={v => setEnField('commissionHeading1', v)} onChangePt={v => setPtField('commissionHeading1', v)}
          />
          <ContentField
            label="Subtitle"
            en={en.commissionSub} pt={pt.commissionSub}
            onChangeEn={v => setEnField('commissionSub', v)} onChangePt={v => setPtField('commissionSub', v)}
            multiline
          />
          <ContentField
            label="CTA button"
            en={en.commissionCta} pt={pt.commissionCta}
            onChangeEn={v => setEnField('commissionCta', v)} onChangePt={v => setPtField('commissionCta', v)}
          />
        </ContentSection>

      </div>
    </AdminShell>
  )
}
