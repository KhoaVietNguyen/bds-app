'use client'

import { useState, useRef } from 'react'
import { Slider } from '@base-ui/react/slider'

const VND_PRESETS = [
  { label: '100tr', value: 0.1 },
  { label: '500tr', value: 0.5 },
  { label: '1 tỷ', value: 1 },
]
const USD_PRESETS = [
  { label: '$5K', value: 5 },
  { label: '$20K', value: 20 },
  { label: '$50K', value: 50 },
]

function calcStep(max: number, cur: 'vnd' | 'usd') {
  const rough = max / 100
  if (cur === 'vnd') {
    if (rough <= 0.01) return 0.01
    if (rough <= 0.05) return 0.05
    if (rough <= 0.1) return 0.1
    if (rough <= 0.5) return 0.5
    if (rough <= 1) return 1
    if (rough <= 5) return 5
    return 10
  }
  if (rough <= 0.2) return 1
  if (rough <= 0.5) return 5
  if (rough <= 5) return 10
  if (rough <= 10) return 50
  if (rough <= 50) return 500
  return 1000
}

function parseVnd(raw: string): number | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, '')
  if (!s) return null
  const n = parseFloat(s)
  if (isNaN(n) || n <= 0) return null
  if (s.match(/triệu|trieu|tr$/)) return n / 1000
  if (s.match(/tỷ|ty|t$/)) return n
  return n < 10 ? n : n / 1000
}

function parseUsd(raw: string): number | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, '')
  if (!s) return null
  const n = parseFloat(s)
  if (isNaN(n) || n <= 0) return null
  if (s.endsWith('m')) return n * 1000
  return n
}

function fmtVnd(val: number) {
  if (val === 0) return '0'
  if (val < 1) return `${Math.round(val * 1000)} triệu`
  return `${val} tỷ`
}
function fmtUsd(val: number) {
  if (val === 0) return '$0'
  if (val >= 1000) return `$${(val / 1000).toFixed(1).replace('.0', '')}M`
  return `$${val}K`
}

export default function PriceRangeSlider({
  pmin, pmax, cur, sliderMax,
  onPminChange, onPmaxChange, onCurChange, onSliderMaxChange,
}: {
  pmin: string; pmax: string; cur: 'vnd' | 'usd'; sliderMax: number | null
  onPminChange: (v: string) => void
  onPmaxChange: (v: string) => void
  onCurChange: (v: 'vnd' | 'usd') => void
  onSliderMaxChange: (v: number | null) => void
}) {
  const presets = cur === 'vnd' ? VND_PRESETS : USD_PRESETS
  const [customInput, setCustomInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const step = sliderMax ? calcStep(sliderMax, cur) : 1
  const minVal = pmin ? parseFloat(pmin) : 0
  const maxVal = pmax ? parseFloat(pmax) : (sliderMax ?? 0)
  const fmt = cur === 'vnd' ? fmtVnd : fmtUsd
  const thumbBorder = cur === 'vnd' ? 'border-orange-500' : 'border-emerald-500'
  const accent = cur === 'vnd' ? 'bg-orange-500' : 'bg-emerald-500'
  const accentMuted = cur === 'vnd'
    ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-400/40'
    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-400/40'
  const noFilter = sliderMax !== null && minVal === 0 && maxVal >= sliderMax

  function applyMax(val: number) {
    const s = calcStep(val, cur)
    const snapped = Math.ceil(val / s) * s
    onSliderMaxChange(snapped)
    if (maxVal > snapped) onPmaxChange('')
    if (minVal > snapped) onPminChange('')
  }

  function handleCurChange(newCur: 'vnd' | 'usd') {
    onCurChange(newCur)
    onSliderMaxChange(null)
    onPminChange('')
    onPmaxChange('')
  }

  function commitCustom() {
    const parsed = cur === 'vnd' ? parseVnd(customInput) : parseUsd(customInput)
    if (parsed) applyMax(parsed)
    setCustomInput('')
  }

  function handleSlider(values: number[]) {
    const [lo, hi] = values
    onPminChange(lo === 0 ? '' : String(lo))
    onPmaxChange(hi >= (sliderMax ?? 0) ? '' : String(hi))
  }

  const rangeLabel = sliderMax
    ? noFilter ? 'Tất cả' : `${fmt(minVal)} — ${fmt(maxVal)}`
    : null

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Row 1: currency + preset chips + custom input */}
      <div className="flex items-center gap-1.5 min-w-0">
        <div className="flex rounded-md overflow-hidden border border-border text-xs h-7 shrink-0">
          <button type="button" onClick={() => handleCurChange('vnd')}
            className={`px-2 font-semibold transition-colors ${cur === 'vnd' ? 'bg-orange-500 text-white' : 'bg-card/60 text-muted-foreground hover:bg-muted'}`}>₫</button>
          <button type="button" onClick={() => handleCurChange('usd')}
            className={`px-2 font-semibold transition-colors ${cur === 'usd' ? 'bg-emerald-500 text-white' : 'bg-card/60 text-muted-foreground hover:bg-muted'}`}>$</button>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1 min-w-0">
          {presets.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={(e) => { e.stopPropagation(); applyMax(p.value) }}
              className={`shrink-0 h-7 px-2 rounded-md text-xs font-semibold border transition-colors whitespace-nowrap ${
                sliderMax === p.value ? accentMuted : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
              }`}
            >
              {p.label}
            </button>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onBlur={commitCustom}
            onKeyDown={(e) => { if (e.key === 'Enter') { commitCustom(); inputRef.current?.blur() } }}
            placeholder={cur === 'vnd' ? '500tr / 5ty…' : '500K / 2M…'}
            aria-label="Giá tối đa tuỳ chỉnh"
            className="shrink-0 w-24 h-7 text-xs px-2 rounded-md border border-dashed border-border bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40"
          />
        </div>

        {rangeLabel && (
          <span className={`text-xs font-medium tabular-nums shrink-0 ${noFilter ? 'text-muted-foreground/50' : 'text-foreground'}`}>
            {rangeLabel}
          </span>
        )}
      </div>

      {/* Row 2: slider + labels */}
      {sliderMax && (
        <div className="flex flex-col gap-1">
          <Slider.Root
            min={0} max={sliderMax} step={step}
            value={[minVal, Math.min(maxVal, sliderMax)]}
            onValueChange={handleSlider}
            thumbAlignment="edge"
            className="w-full"
          >
            <Slider.Control className="relative flex w-full touch-none items-center select-none py-2">
              <Slider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-border">
                <Slider.Indicator className={`h-full rounded-full absolute ${accent}`} />
              </Slider.Track>
              {[0, 1].map((i) => (
                <Slider.Thumb key={i}
                  className={`relative block size-4 shrink-0 rounded-full border-2 bg-background shadow ring-ring/50 transition-shadow select-none after:absolute after:-inset-2 hover:ring-2 focus-visible:ring-2 focus-visible:outline-none active:ring-2 ${thumbBorder}`}
                />
              ))}
            </Slider.Control>
          </Slider.Root>
          {/* Labels below thumbs */}
          <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-0.5">
            <span>{fmt(minVal)}</span>
            <span>{fmt(Math.min(maxVal, sliderMax))}</span>
          </div>
        </div>
      )}
    </div>
  )
}
