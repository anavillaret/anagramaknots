'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import ContentField from '@/components/admin/ContentField'
import ContentSection from '@/components/admin/ContentSection'
import { translations } from '@/lib/i18n/translations'

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

function defaultState(t: typeof DEF_EN): StoryState {
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

function stateToPayload(en: StoryState, pt: StoryState) {
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

function payloadToState(raw: Record<string, unknown>, defaults: StoryState): StoryState {
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

export default function AdminContentStory() {
  const [en, setEn] = useState<StoryState>(defaultState(DEF_EN))
  const [pt, setPt] = useState<StoryState>(defaultState(DEF_PT))
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
      body: JSON.stringify(stateToPayload(en, pt)),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <AdminShell><p className="text-[13px] text-stone">Loading…</p></AdminShell>

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Story Page Content</h1>
          <p className="text-[13px] text-stone mt-1">
            Edit the full Our Story page.{' '}
            <a href="/story" target="_blank" className="text-teal hover:underline">View page →</a>
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
    </AdminShell>
  )
}
