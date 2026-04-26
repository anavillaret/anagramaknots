'use client'

interface Props {
  label: string
  en: string
  pt: string
  onChangeEn: (v: string) => void
  onChangePt: (v: string) => void
  multiline?: boolean
  hint?: string
  readOnly?: boolean
}

export default function ContentField({
  label,
  en,
  pt,
  onChangeEn,
  onChangePt,
  multiline = false,
  hint,
  readOnly = false,
}: Props) {
  const baseInput =
    'border border-gray-200 text-[13px] px-3 py-2 text-ink outline-none focus:border-teal transition-colors w-full bg-white disabled:bg-gray-50 disabled:text-stone'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label className="text-[11px] text-stone uppercase tracking-[0.08em]">{label}</label>
        {hint && <span className="text-[10px] text-stone/60 normal-case tracking-normal">{hint}</span>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {/* English */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-stone/70 tracking-[0.06em]">🇬🇧 EN</span>
          {multiline ? (
            <textarea
              value={en}
              onChange={e => onChangeEn(e.target.value)}
              disabled={readOnly}
              rows={3}
              className={`${baseInput} resize-y`}
            />
          ) : (
            <input
              type="text"
              value={en}
              onChange={e => onChangeEn(e.target.value)}
              disabled={readOnly}
              className={baseInput}
            />
          )}
        </div>
        {/* Portuguese */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-stone/70 tracking-[0.06em]">🇵🇹 PT</span>
          {multiline ? (
            <textarea
              value={pt}
              onChange={e => onChangePt(e.target.value)}
              disabled={readOnly}
              rows={3}
              className={`${baseInput} resize-y`}
            />
          ) : (
            <input
              type="text"
              value={pt}
              onChange={e => onChangePt(e.target.value)}
              disabled={readOnly}
              className={baseInput}
            />
          )}
        </div>
      </div>
    </div>
  )
}
