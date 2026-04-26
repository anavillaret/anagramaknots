'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import ContentField from '@/components/admin/ContentField'
import ContentSection from '@/components/admin/ContentSection'
import { translations } from '@/lib/i18n/translations'

const PAGE_KEY = 'page_commission'
const DEF_EN = translations.en.commission
const DEF_PT = translations.pt.commission

type StepField = { n: string; title: string; body: string }

type CommissionState = {
  eyebrow: string
  heading0: string
  heading1: string
  sub: string
  sub2: string
  sub2Bold: string
  sub2Suffix: string
  howTitle: string
  steps: [StepField, StepField, StepField, StepField]
  successEyebrow: string
  successHeading: string
  successSub: string
  upsellEyebrow: string
  upsellHeading: string
  upsellSub: string
}

function defaultState(t: typeof DEF_EN): CommissionState {
  return {
    eyebrow: t.eyebrow,
    heading0: t.heading[0],
    heading1: t.heading[1],
    sub: t.sub,
    sub2: t.sub2,
    sub2Bold: t.sub2Bold,
    sub2Suffix: t.sub2Suffix,
    howTitle: t.howTitle,
    steps: t.steps.map(s => ({ n: s.n, title: s.title, body: s.body })) as [StepField, StepField, StepField, StepField],
    successEyebrow: t.successEyebrow,
    successHeading: t.successHeading,
    successSub: t.successSub,
    upsellEyebrow: t.upsellEyebrow,
    upsellHeading: t.upsellHeading,
    upsellSub: t.upsellSub,
  }
}

function stateToPayload(en: CommissionState, pt: CommissionState) {
  const ser = (s: CommissionState) => ({
    eyebrow: s.eyebrow,
    heading: [s.heading0, s.heading1],
    sub: s.sub,
    sub2: s.sub2,
    sub2Bold: s.sub2Bold,
    sub2Suffix: s.sub2Suffix,
    howTitle: s.howTitle,
    steps: s.steps,
    successEyebrow: s.successEyebrow,
    successHeading: s.successHeading,
    successSub: s.successSub,
    upsellEyebrow: s.upsellEyebrow,
    upsellHeading: s.upsellHeading,
    upsellSub: s.upsellSub,
  })
  return { en: { commission: ser(en) }, pt: { commission: ser(pt) } }
}

function payloadToState(raw: Record<string, unknown>, defaults: CommissionState): CommissionState {
  if (!raw?.commission || typeof raw.commission !== 'object') return defaults
  const r = raw.commission as Record<string, unknown>

  const heading = (r.heading as string[] | undefined) ?? []
  const rawSteps = (r.steps as Array<Record<string, string>> | undefined) ?? []

  return {
    eyebrow: (r.eyebrow as string) || defaults.eyebrow,
    heading0: heading[0] || defaults.heading0,
    heading1: heading[1] || defaults.heading1,
    sub: (r.sub as string) || defaults.sub,
    sub2: (r.sub2 as string) || defaults.sub2,
    sub2Bold: (r.sub2Bold as string) || defaults.sub2Bold,
    sub2Suffix: (r.sub2Suffix as string) || defaults.sub2Suffix,
    howTitle: (r.howTitle as string) || defaults.howTitle,
    steps: defaults.steps.map((def, i) => ({
      n: def.n,
      title: rawSteps[i]?.title || def.title,
      body: rawSteps[i]?.body || def.body,
    })) as [StepField, StepField, StepField, StepField],
    successEyebrow: (r.successEyebrow as string) || defaults.successEyebrow,
    successHeading: (r.successHeading as string) || defaults.successHeading,
    successSub: (r.successSub as string) || defaults.successSub,
    upsellEyebrow: (r.upsellEyebrow as string) || defaults.upsellEyebrow,
    upsellHeading: (r.upsellHeading as string) || defaults.upsellHeading,
    upsellSub: (r.upsellSub as string) || defaults.upsellSub,
  }
}

export default function AdminContentCommission() {
  const [en, setEn] = useState<CommissionState>(defaultState(DEF_EN))
  const [pt, setPt] = useState<CommissionState>(defaultState(DEF_PT))
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

  function f(field: keyof CommissionState) {
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
      const steps = s.steps.map((st, idx) => idx === i ? { ...st, [key]: value } : st) as [StepField, StepField, StepField, StepField]
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
          <h1 className="text-2xl font-semibold text-ink">Commission Page Content</h1>
          <p className="text-[13px] text-stone mt-1">
            Edit all text on the commission / made-for-you page.{' '}
            <a href="/commission" target="_blank" className="text-teal hover:underline">View page →</a>
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

        <ContentSection title="Header">
          <ContentField label="Eyebrow" {...f('eyebrow')} />
          <ContentField label="Heading — line 1" {...f('heading0')} />
          <ContentField label="Heading — line 2 (italic teal)" {...f('heading1')} />
          <ContentField label="Main subtitle" {...f('sub')} multiline />
          <ContentField label="Response time prefix (e.g. Ana will reply within)" {...f('sub2')} />
          <ContentField label="Response time bold (e.g. 3–5 working days)" {...f('sub2Bold')} />
          <ContentField label="Response time suffix" {...f('sub2Suffix')} />
          <ContentField label="How it works — section title" {...f('howTitle')} />
        </ContentSection>

        {en.steps.map((step, i) => (
          <ContentSection key={i} title={`Step ${step.n}`}>
            <ContentField
              label="Step number (read-only)"
              en={step.n}
              pt={pt.steps[i].n}
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

        <ContentSection title="Success Message (after form submission)">
          <ContentField label="Eyebrow" {...f('successEyebrow')} />
          <ContentField label="Heading" {...f('successHeading')} />
          <ContentField label="Subtitle" {...f('successSub')} multiline />
        </ContentSection>

        <ContentSection title="Upsell Section (available products at bottom)">
          <ContentField label="Eyebrow" {...f('upsellEyebrow')} />
          <ContentField label="Heading" {...f('upsellHeading')} />
          <ContentField label="Subtitle" {...f('upsellSub')} multiline />
        </ContentSection>

      </div>
    </AdminShell>
  )
}
