export default function Watermark() {
  return (
    <div className="absolute bottom-3 right-3 pointer-events-none select-none">
      <span className="text-[9px] tracking-[0.2em] uppercase text-white/60 font-medium">
        © Anagrama
      </span>
    </div>
  )
}
