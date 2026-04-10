'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import MultiImageUpload from '@/components/admin/MultiImageUpload'

type Event = {
  id: string
  title: string
  title_pt: string
  date: string
  place: string
  description: string
  description_pt: string
  photos: string[]
  active: boolean
  sort_order: number
}

const EMPTY: Omit<Event, 'id'> = {
  title: '',
  title_pt: '',
  date: '',
  place: '',
  description: '',
  description_pt: '',
  photos: [],
  active: true,
  sort_order: 0,
}

const REQUIRED_TO_PUBLISH: { key: keyof typeof EMPTY; label: string }[] = [
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors'

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [form, setForm] = useState<Omit<Event, 'id'>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/admin/events')
    if (res.ok) setEvents(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function set(field: keyof typeof EMPTY, value: string | boolean | string[]) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function openNew() {
    setEditing(null)
    setForm(EMPTY)
    setError('')
    setShowForm(true)
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
      active:         event.active,
      sort_order:     event.sort_order,
    })
    setError('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancel() {
    setShowForm(false)
    setEditing(null)
    setForm(EMPTY)
    setError('')
  }

  const missing = missingFields(form)
  const isComplete = missing.length === 0

  async function save() {
    if (!form.title || !form.date || !form.place) {
      setError('Title, date and place are required.')
      return
    }
    setSaving(true)
    setError('')
    // Force draft if not complete
    const payload = { ...form, active: isComplete ? form.active : false }
    const url = editing ? `/api/admin/events/${editing.id}` : '/api/admin/events'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const j = await res.json()
      setError(j.error ?? 'Save failed')
      setSaving(false)
      return
    }
    await load()
    cancel()
    setSaving(false)
  }

  async function deleteEvent(id: string) {
    const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setEvents(events.filter(e => e.id !== id))
      setConfirmDelete(null)
    }
  }

  async function toggleActive(event: Event) {
    // Only allow activating if complete
    const allFields = { ...event }
    const eventMissing = REQUIRED_TO_PUBLISH.filter(r => !String((allFields as Record<string, unknown>)[r.key] ?? '').trim())
    if (!event.active && eventMissing.length > 0) return // can't publish incomplete
    await fetch(`/api/admin/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...event, active: !event.active }),
    })
    await load()
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-ink">Events & Workshops</h1>
        {!showForm && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-teal-dark transition-colors"
          >
            <Plus size={14} /> New Event
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 p-8 mb-10 space-y-6">
          <h2 className="text-[15px] font-semibold text-ink">
            {editing ? 'Edit Event' : 'New Event'}
          </h2>

          {/* Date + Place (shared, no translation needed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Date *">
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className={inputCls} />
            </Field>
            <Field label="Place *">
              <input type="text" value={form.place} onChange={e => set('place', e.target.value)}
                placeholder="e.g. Porto, Portugal" className={inputCls} />
            </Field>
          </div>

          {/* Title EN + PT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Title (EN) *">
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. Craft Fair Porto" className={inputCls} />
            </Field>
            <Field label="Title (PT) *">
              <input type="text" value={form.title_pt} onChange={e => set('title_pt', e.target.value)}
                placeholder="ex. Feira de Artesanato Porto" className={inputCls} />
            </Field>
          </div>

          {/* Description EN + PT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Description (EN)">
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={4} placeholder="What happened, what was shown, any highlights…"
                className={`${inputCls} resize-none`} />
            </Field>
            <Field label="Description (PT)">
              <textarea value={form.description_pt} onChange={e => set('description_pt', e.target.value)}
                rows={4} placeholder="O que aconteceu, o que foi mostrado, os destaques…"
                className={`${inputCls} resize-none`} />
            </Field>
          </div>

          <Field label="Photos">
            <MultiImageUpload values={form.photos} onChange={urls => set('photos', urls)} />
          </Field>

          {/* Visibility + completeness */}
          <div className="space-y-3">
            <div className={`flex items-center gap-3 ${!isComplete ? 'opacity-50' : ''}`}>
              <input
                type="checkbox"
                id="active"
                checked={isComplete && form.active}
                disabled={!isComplete}
                onChange={e => set('active', e.target.checked)}
                className="accent-teal w-4 h-4 disabled:cursor-not-allowed"
              />
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

      {/* Events list */}
      {loading ? (
        <p className="text-[13px] text-stone">Loading…</p>
      ) : events.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <p className="text-[13px] text-stone mb-4">No events yet.</p>
          <button onClick={openNew}
            className="text-[11px] tracking-[0.15em] uppercase text-teal hover:text-teal-dark transition-colors">
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
                  <button onClick={() => openEdit(event)}
                    className="text-stone hover:text-ink transition-colors p-1" title="Edit">
                    <Pencil size={15} strokeWidth={1.5} />
                  </button>
                  {confirmDelete === event.id ? (
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-stone">Delete?</span>
                      <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700 font-medium">Yes</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-stone hover:text-ink">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(event.id)}
                      className="text-stone hover:text-red-500 transition-colors p-1" title="Delete">
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
