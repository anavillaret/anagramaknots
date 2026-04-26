'use client'

import { useEffect, useState } from 'react'
import ContentField from '@/components/admin/ContentField'
import ContentSection from '@/components/admin/ContentSection'
import { translations } from '@/lib/i18n/translations'
import { Plus, Trash2 } from 'lucide-react'

const PAGE_KEY = 'page_shipping'
const DEF_EN = translations.en.shipping
const DEF_PT = translations.pt.shipping

type FeatureField = { title: string; body: string }
type RowField = { region: string; delivery: string }
type FaqField = { q: string; a: string }

type ShippingState = {
  eyebrow: string
  heading0: string
  heading1: string
  sub: string
  features: [FeatureField, FeatureField, FeatureField]
  tableHeading: string
  colRegion: string
  colDelivery: string
  rows: RowField[]
  disclaimer: string
  faqHeading: string
  faqs: FaqField[]
  stillQuestions: string
  contactCta: string
}

function defaultState(t: typeof DEF_EN): ShippingState {
  return {
    eyebrow: t.eyebrow,
    heading0: t.heading[0],
    heading1: t.heading[1],
    sub: t.sub,
    features: t.features.map(f => ({ title: f.title, body: f.body })) as [FeatureField, FeatureField, FeatureField],
    tableHeading: t.tableHeading,
    colRegion: t.colRegion,
    colDelivery: t.colDelivery,
    rows: t.rows.map(r => ({ region: r.region, delivery: r.delivery })),
    disclaimer: t.disclaimer,
    faqHeading: t.faqHeading,
    faqs: t.faqs.map(f => ({ q: f.q, a: f.a })),
    stillQuestions: t.stillQuestions,
    contactCta: t.contactCta,
  }
}

function stateToPayload(en: ShippingState, pt: ShippingState) {
  const ser = (s: ShippingState) => ({
    eyebrow: s.eyebrow,
    heading: [s.heading0, s.heading1],
    sub: s.sub,
    features: s.features,
    tableHeading: s.tableHeading,
    colRegion: s.colRegion,
    colDelivery: s.colDelivery,
    rows: s.rows,
    disclaimer: s.disclaimer,
    faqHeading: s.faqHeading,
    faqs: s.faqs,
    stillQuestions: s.stillQuestions,
    contactCta: s.contactCta,
  })
  return { en: { shipping: ser(en) }, pt: { shipping: ser(pt) } }
}

function payloadToState(raw: Record<string, unknown>, defaults: ShippingState): ShippingState {
  if (!raw?.shipping || typeof raw.shipping !== 'object') return defaults
  const r = raw.shipping as Record<string, unknown>

  const heading = (r.heading as string[] | undefined) ?? []
  const rawFeatures = (r.features as Array<Record<string, string>> | undefined) ?? []
  const rawRows = (r.rows as Array<Record<string, string>> | undefined) ?? []
  const rawFaqs = (r.faqs as Array<Record<string, string>> | undefined) ?? []

  return {
    eyebrow: (r.eyebrow as string) || defaults.eyebrow,
    heading0: heading[0] || defaults.heading0,
    heading1: heading[1] || defaults.heading1,
    sub: (r.sub as string) || defaults.sub,
    features: defaults.features.map((def, i) => ({
      title: rawFeatures[i]?.title || def.title,
      body: rawFeatures[i]?.body || def.body,
    })) as [FeatureField, FeatureField, FeatureField],
    tableHeading: (r.tableHeading as string) || defaults.tableHeading,
    colRegion: (r.colRegion as string) || defaults.colRegion,
    colDelivery: (r.colDelivery as string) || defaults.colDelivery,
    rows: rawRows.length > 0 ? rawRows.map(rr => ({ region: rr.region || '', delivery: rr.delivery || '' })) : defaults.rows,
    disclaimer: (r.disclaimer as string) || defaults.disclaimer,
    faqHeading: (r.faqHeading as string) || defaults.faqHeading,
    faqs: rawFaqs.length > 0 ? rawFaqs.map(f => ({ q: f.q || '', a: f.a || '' })) : defaults.faqs,
    stillQuestions: (r.stillQuestions as string) || defaults.stillQuestions,
    contactCta: (r.contactCta as string) || defaults.contactCta,
  }
}

export default function AdminShippingPage() {
  const [en, setEn] = useState<ShippingState>(defaultState(DEF_EN))
  const [pt, setPt] = useState<ShippingState>(defaultState(DEF_PT))
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

  function f(field: keyof ShippingState) {
    return {
      en: en[field] as string,
      pt: pt[field] as string,
      onChangeEn: (v: string) => setEn(s => ({ ...s, [field]: v })),
      onChangePt: (v: string) => setPt(s => ({ ...s, [field]: v })),
    }
  }

  function setFeature(lang: 'en' | 'pt', i: number, key: keyof FeatureField, value: string) {
    const setter = lang === 'en' ? setEn : setPt
    setter(s => {
      const features = s.features.map((ft, idx) => idx === i ? { ...ft, [key]: value } : ft) as [FeatureField, FeatureField, FeatureField]
      return { ...s, features }
    })
  }

  function setRow(lang: 'en' | 'pt', i: number, key: keyof RowField, value: string) {
    const setter = lang === 'en' ? setEn : setPt
    setter(s => {
      const rows = s.rows.map((r, idx) => idx === i ? { ...r, [key]: value } : r)
      return { ...s, rows }
    })
  }

  function setFaq(lang: 'en' | 'pt', i: number, key: keyof FaqField, value: string) {
    const setter = lang === 'en' ? setEn : setPt
    setter(s => {
      const faqs = s.faqs.map((faq, idx) => idx === i ? { ...faq, [key]: value } : faq)
      return { ...s, faqs }
    })
  }

  function addFaq() {
    setEn(s => ({ ...s, faqs: [...s.faqs, { q: '', a: '' }] }))
    setPt(s => ({ ...s, faqs: [...s.faqs, { q: '', a: '' }] }))
  }

  function removeFaq(i: number) {
    setEn(s => ({ ...s, faqs: s.faqs.filter((_, idx) => idx !== i) }))
    setPt(s => ({ ...s, faqs: s.faqs.filter((_, idx) => idx !== i) }))
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
          <h1 className="text-2xl font-semibold text-ink">Shipping</h1>
          <p className="text-[13px] text-stone mt-1">
            Edit all shipping information, delivery times and FAQs.{' '}
            <a href="/shipping" target="_blank" className="text-teal hover:underline">View page →</a>
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

        {en.features.map((feat, i) => (
          <ContentSection key={i} title={`Packaging Feature ${i + 1}`}>
            <ContentField
              label="Title"
              en={feat.title}
              pt={pt.features[i].title}
              onChangeEn={v => setFeature('en', i, 'title', v)}
              onChangePt={v => setFeature('pt', i, 'title', v)}
            />
            <ContentField
              label="Body"
              en={feat.body}
              pt={pt.features[i].body}
              onChangeEn={v => setFeature('en', i, 'body', v)}
              onChangePt={v => setFeature('pt', i, 'body', v)}
              multiline
            />
          </ContentSection>
        ))}

        <ContentSection title="Delivery Times Table">
          <ContentField label="Section heading" {...f('tableHeading')} />
          <ContentField label="Column: Region" {...f('colRegion')} />
          <ContentField label="Column: Delivery" {...f('colDelivery')} />
          {en.rows.map((row, i) => (
            <div key={i} className="border border-gray-100 rounded-sm p-4 flex flex-col gap-3">
              <p className="text-[11px] text-stone uppercase tracking-[0.08em]">Row {i + 1}</p>
              <ContentField
                label="Region"
                en={row.region}
                pt={pt.rows[i]?.region ?? ''}
                onChangeEn={v => setRow('en', i, 'region', v)}
                onChangePt={v => setRow('pt', i, 'region', v)}
              />
              <ContentField
                label="Delivery time & price"
                en={row.delivery}
                pt={pt.rows[i]?.delivery ?? ''}
                onChangeEn={v => setRow('en', i, 'delivery', v)}
                onChangePt={v => setRow('pt', i, 'delivery', v)}
              />
            </div>
          ))}
          <ContentField label="Disclaimer (below table)" {...f('disclaimer')} multiline />
        </ContentSection>

        <ContentSection title="FAQs">
          <ContentField label="Section heading" {...f('faqHeading')} />
          {en.faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-sm p-4 flex flex-col gap-3 relative">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] text-stone uppercase tracking-[0.08em]">FAQ {i + 1}</p>
                <button type="button" onClick={() => removeFaq(i)}
                  className="text-stone hover:text-red-500 transition-colors" title="Remove this FAQ">
                  <Trash2 size={14} />
                </button>
              </div>
              <ContentField
                label="Question"
                en={faq.q}
                pt={pt.faqs[i]?.q ?? ''}
                onChangeEn={v => setFaq('en', i, 'q', v)}
                onChangePt={v => setFaq('pt', i, 'q', v)}
              />
              <ContentField
                label="Answer"
                en={faq.a}
                pt={pt.faqs[i]?.a ?? ''}
                onChangeEn={v => setFaq('en', i, 'a', v)}
                onChangePt={v => setFaq('pt', i, 'a', v)}
                multiline
              />
            </div>
          ))}
          <button type="button" onClick={addFaq}
            className="flex items-center gap-2 text-[12px] text-teal hover:text-teal-dark transition-colors border border-dashed border-teal/40 px-4 py-2.5 hover:border-teal">
            <Plus size={14} />
            Add FAQ
          </button>
        </ContentSection>

        <ContentSection title="Bottom CTA">
          <ContentField label="Text (e.g. Still have a question?)" {...f('stillQuestions')} />
          <ContentField label="Button label" {...f('contactCta')} />
        </ContentSection>

      </div>
    </div>
  )
}
