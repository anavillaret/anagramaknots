'use client'

import { useEffect, useState } from 'react'
import ContentField from '@/components/admin/ContentField'
import ContentSection from '@/components/admin/ContentSection'
import { translations } from '@/lib/i18n/translations'

const PAGE_KEY = 'page_contact'
const DEF_EN = translations.en.contact
const DEF_PT = translations.pt.contact

type ContactState = {
  eyebrow: string
  heading0: string
  heading1: string
  sub: string
  emailLabel: string
  instagramLabel: string
  basedLabel: string
  fieldName: string
  fieldNamePlaceholder: string
  fieldEmail: string
  fieldEmailPlaceholder: string
  fieldSubject: string
  fieldSubjectPlaceholder: string
  fieldMessage: string
  fieldMessagePlaceholder: string
  fieldSubmit: string
  fieldSending: string
  success: string
  error: string
}

function defaultState(t: typeof DEF_EN): ContactState {
  return {
    eyebrow: t.eyebrow,
    heading0: t.heading[0],
    heading1: t.heading[1],
    sub: t.sub,
    emailLabel: t.emailLabel,
    instagramLabel: t.instagramLabel,
    basedLabel: t.basedLabel,
    fieldName: t.fields.name,
    fieldNamePlaceholder: t.fields.namePlaceholder,
    fieldEmail: t.fields.email,
    fieldEmailPlaceholder: t.fields.emailPlaceholder,
    fieldSubject: t.fields.subject,
    fieldSubjectPlaceholder: t.fields.subjectPlaceholder,
    fieldMessage: t.fields.message,
    fieldMessagePlaceholder: t.fields.messagePlaceholder,
    fieldSubmit: t.fields.submit,
    fieldSending: t.fields.sending,
    success: t.success,
    error: t.error,
  }
}

function stateToPayload(en: ContactState, pt: ContactState) {
  const ser = (s: ContactState) => ({
    eyebrow: s.eyebrow,
    heading: [s.heading0, s.heading1],
    sub: s.sub,
    emailLabel: s.emailLabel,
    instagramLabel: s.instagramLabel,
    basedLabel: s.basedLabel,
    fields: {
      name: s.fieldName,
      namePlaceholder: s.fieldNamePlaceholder,
      email: s.fieldEmail,
      emailPlaceholder: s.fieldEmailPlaceholder,
      subject: s.fieldSubject,
      subjectPlaceholder: s.fieldSubjectPlaceholder,
      message: s.fieldMessage,
      messagePlaceholder: s.fieldMessagePlaceholder,
      submit: s.fieldSubmit,
      sending: s.fieldSending,
    },
    success: s.success,
    error: s.error,
  })
  return { en: { contact: ser(en) }, pt: { contact: ser(pt) } }
}

function payloadToState(raw: Record<string, unknown>, defaults: ContactState): ContactState {
  if (!raw?.contact || typeof raw.contact !== 'object') return defaults
  const r = raw.contact as Record<string, unknown>
  const heading = (r.heading as string[] | undefined) ?? []
  const fields = (r.fields as Record<string, string> | undefined) ?? {}

  return {
    eyebrow: (r.eyebrow as string) || defaults.eyebrow,
    heading0: heading[0] || defaults.heading0,
    heading1: heading[1] || defaults.heading1,
    sub: (r.sub as string) || defaults.sub,
    emailLabel: (r.emailLabel as string) || defaults.emailLabel,
    instagramLabel: (r.instagramLabel as string) || defaults.instagramLabel,
    basedLabel: (r.basedLabel as string) || defaults.basedLabel,
    fieldName: fields.name || defaults.fieldName,
    fieldNamePlaceholder: fields.namePlaceholder || defaults.fieldNamePlaceholder,
    fieldEmail: fields.email || defaults.fieldEmail,
    fieldEmailPlaceholder: fields.emailPlaceholder || defaults.fieldEmailPlaceholder,
    fieldSubject: fields.subject || defaults.fieldSubject,
    fieldSubjectPlaceholder: fields.subjectPlaceholder || defaults.fieldSubjectPlaceholder,
    fieldMessage: fields.message || defaults.fieldMessage,
    fieldMessagePlaceholder: fields.messagePlaceholder || defaults.fieldMessagePlaceholder,
    fieldSubmit: fields.submit || defaults.fieldSubmit,
    fieldSending: fields.sending || defaults.fieldSending,
    success: (r.success as string) || defaults.success,
    error: (r.error as string) || defaults.error,
  }
}

export default function AdminContactPage() {
  const [en, setEn] = useState<ContactState>(defaultState(DEF_EN))
  const [pt, setPt] = useState<ContactState>(defaultState(DEF_PT))
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

  function f(field: keyof ContactState) {
    return {
      en: en[field] as string,
      pt: pt[field] as string,
      onChangeEn: (v: string) => setEn(s => ({ ...s, [field]: v })),
      onChangePt: (v: string) => setPt(s => ({ ...s, [field]: v })),
    }
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

  if (loading) return <p className="text-[13px] text-stone">Loading…</p>

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Contact</h1>
          <p className="text-[13px] text-stone mt-1">
            Edit all text on the contact page including form labels and messages.{' '}
            <a href="/contact" target="_blank" className="text-teal hover:underline">View page →</a>
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
          <ContentField label="Subtitle" {...f('sub')} multiline />
        </ContentSection>

        <ContentSection title="Contact Info Labels">
          <ContentField label="Email label" {...f('emailLabel')} />
          <ContentField label="Instagram label" {...f('instagramLabel')} />
          <ContentField label="Based in label" {...f('basedLabel')} />
        </ContentSection>

        <ContentSection title="Form Fields">
          <ContentField label="Name field label" {...f('fieldName')} />
          <ContentField label="Name field placeholder" {...f('fieldNamePlaceholder')} />
          <ContentField label="Email field label" {...f('fieldEmail')} />
          <ContentField label="Email field placeholder" {...f('fieldEmailPlaceholder')} />
          <ContentField label="Subject field label" {...f('fieldSubject')} />
          <ContentField label="Subject field placeholder" {...f('fieldSubjectPlaceholder')} />
          <ContentField label="Message field label" {...f('fieldMessage')} />
          <ContentField label="Message field placeholder" {...f('fieldMessagePlaceholder')} multiline />
          <ContentField label="Submit button" {...f('fieldSubmit')} />
          <ContentField label="Sending state label" {...f('fieldSending')} />
        </ContentSection>

        <ContentSection title="Response Messages">
          <ContentField label="Success message" {...f('success')} multiline />
          <ContentField label="Error message" {...f('error')} multiline />
        </ContentSection>

      </div>
    </div>
  )
}
