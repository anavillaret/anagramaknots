'use client'

import { useState, useEffect, useRef } from 'react'
import { Pencil, Trash2, Plus, Check, X, Loader2, ExternalLink } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import Image from 'next/image'

type Partner = {
  id: string
  name: string
  description: string
  url: string
  logo_url: string
  active: boolean
  sort_order: number
}

const EMPTY: Omit<Partner, 'id'> = {
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

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [form, setForm] = useState<Omit<Partner, 'id'>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/admin/partners')
    if (res.ok) setPartners(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function set(field: keyof typeof EMPTY, value: string | boolean | number) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function openNew() { setEditing(null); setForm(EMPTY); setError(''); setShowForm(true) }

  function openEdit(p: Partner) {
    setEditing(p)
    setForm({ name: p.name, description: p.description, url: p.url, logo_url: p.logo_url, active: p.active, sort_order: p.sort_order })
    setError(''); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancel() { setShowForm(false); setEditing(null); setForm(EMPTY); setError('') }

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
    <AdminShell>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Partners</h1>
            <p className="text-[13px] text-stone mt-1">Partners shown at the bottom of the homepage.</p>
          </div>
          {!showForm && (
            <button onClick={openNew}
              className="flex items-center gap-2 bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-teal-dark transition-colors">
              <Plus size={14} /> Add Partner
            </button>
          )}
        </div>

        {/* Form */}
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

        {/* List */}
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
                {/* Logo */}
                <div className="w-14 h-14 shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {p.logo_url
                    ? <img src={p.logo_url} alt={p.name} className="w-full h-full object-contain p-1" />
                    : <span className="text-[20px]">🤝</span>
                  }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-ink">{p.name}</p>
                  {p.description && <p className="text-[12px] text-stone mt-0.5 truncate">{p.description}</p>}
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    className="text-[11px] text-teal hover:underline flex items-center gap-1 mt-0.5">
                    {p.url} <ExternalLink size={10} />
                  </a>
                </div>
                {/* Actions */}
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
    </AdminShell>
  )
}
