import React, { useEffect, useState, useRef, useCallback } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { api } from '../lib/api'

/* ── brand palette ───────────────────────────────── */
const CHERRY  = '#D2042D'
const INK     = '#050505'
const BONE    = '#FAFAFA'
const MUTED   = '#71717a'
const DIVIDER = '#e5e5e5'

const CHART_COLORS = [
  CHERRY, '#1e293b', '#f59e0b', '#10b981', '#6366f1',
  '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4'
]

/* ── Highcharts base theme ───────────────────────── */
const HC_BASE = {
  chart: {
    backgroundColor: 'transparent',
    style: { fontFamily: 'Manrope, sans-serif' }
  },
  title: { style: { fontSize: '14px', fontWeight: '700', color: INK } },
  credits: { enabled: false },
  colors: CHART_COLORS,
  tooltip: {
    backgroundColor: INK,
    style: { color: BONE, fontSize: '12px' },
    borderRadius: 8,
    borderWidth: 0,
    shadow: false
  },
  legend: {
    itemStyle: { color: INK, fontWeight: '500', fontSize: '11px' }
  },
  xAxis: {
    labels: { style: { color: MUTED, fontSize: '10px' } },
    lineColor: DIVIDER,
    tickColor: DIVIDER
  },
  yAxis: {
    labels: { style: { color: MUTED, fontSize: '10px' } },
    gridLineColor: '#f0f0f0',
    title: { text: '' }
  },
  plotOptions: {
    series: { animation: { duration: 800 } }
  }
}

function merge(base, ext) {
  return Highcharts.merge(base, ext)
}

/* ── animated counter ────────────────────────────── */
function AnimatedCounter({ value, duration = 1200 }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const end = Number(value) || 0
    if (end === 0) { setDisplay(0); return }
    const step = Math.ceil(end / (duration / 16))
    const id = setInterval(() => {
      start += step
      if (start >= end) { start = end; clearInterval(id) }
      setDisplay(start)
    }, 16)
    return () => clearInterval(id)
  }, [value, duration])

  return <span ref={ref}>{display.toLocaleString()}</span>
}

/* ── stat card ───────────────────────────────────── */
function StatCard({ label, value, icon }) {
  return (
    <div className="bb-card p-5 flex flex-col gap-1 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute top-3 right-3 text-2xl opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <div className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">{label}</div>
      <div className="text-3xl font-bold text-ink leading-none mt-1">
        <AnimatedCounter value={value} />
      </div>
    </div>
  )
}

/* ── date range pills ────────────────────────────── */
const RANGE_OPTIONS = [
  { label: '7d',  value: 7  },
  { label: '14d', value: 14 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
]

function RangePills({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {RANGE_OPTIONS.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md transition-all
            ${value === opt.value
              ? 'bg-cherry text-white shadow-sm'
              : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

/* ── chart card with optional header + filter ────── */
function ChartCard({ children, title, range, onRangeChange, className = '' }) {
  return (
    <div className={`bb-card p-5 ${className}`}>
      {(title || range !== undefined) && (
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          {title && <h3 className="text-sm font-bold text-ink uppercase tracking-widest">{title}</h3>}
          {range !== undefined && onRangeChange && (
            <RangePills value={range} onChange={onRangeChange} />
          )}
        </div>
      )}
      {children}
    </div>
  )
}

/* ── activity feed ───────────────────────────────── */
function ActivityFeed({ items = [] }) {
  return (
    <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
      {items.length === 0 && (
        <p className="text-sm text-zinc-400">No recent activity.</p>
      )}
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.type === 'order' ? 'bg-cherry' : 'bg-zinc-400'}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-ink leading-snug truncate">{item.text}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── format day labels ───────────────────────────── */
function dayLabels(arr, maxTicks = 7) {
  const cats = arr.map(d => {
    const dt = new Date(d.day + 'T00:00:00')
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
  const interval = Math.max(1, Math.floor(cats.length / maxTicks))
  return { categories: cats, tickInterval: interval }
}

/* ═══════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════ */
export default function DashboardAdmin() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  // Global date range
  const [globalDays, setGlobalDays] = useState(30)

  // Per-chart overrides (null = use global)
  const [trendDays, setTrendDays] = useState(null)
  const [visitsDays, setVisitsDays] = useState(null)

  const effectiveTrend = trendDays ?? globalDays
  const effectiveVisits = visitsDays ?? globalDays

  const load = useCallback(async (days) => {
    setLoading(true)
    setErr('')
    try {
      const d = await api.getAnalytics(days)
      setData(d)
    } catch (e) {
      setErr(e.message || 'Failed to load analytics.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Re-fetch when global range changes
  useEffect(() => { load(globalDays) }, [globalDays, load])

  // If a per-chart range exceeds what we fetched, refetch with larger window
  useEffect(() => {
    const maxNeeded = Math.max(effectiveTrend, effectiveVisits)
    if (data && maxNeeded > globalDays) {
      load(maxNeeded)
    }
  }, [effectiveTrend, effectiveVisits])

  if (loading && !data) {
    return (
      <section className="py-12">
        <div className="bb-container text-center text-zinc-400">Loading analytics…</div>
      </section>
    )
  }

  if (err && !data) {
    return (
      <section className="py-12">
        <div className="bb-container text-center text-cherry">{err}</div>
      </section>
    )
  }

  if (!data) return null

  const {
    totals, order_statuses, orders_by_day, inquiries_by_day,
    visits_by_day, visits_by_page, dessert_types, event_types,
    inquiry_subjects, activity
  } = data

  /* ── helper: filter day-series to N days from today ── */
  function filterDays(arr, n) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - n)
    const cutoffStr = cutoff.toISOString().slice(0, 10)
    return arr.filter(d => d.day >= cutoffStr)
  }

  const filteredOrders = filterDays(orders_by_day, effectiveTrend)
  const filteredInquiries = filterDays(inquiries_by_day, effectiveTrend)
  const filteredVisitsTime = filterDays(visits_by_day, effectiveVisits)

  /* ── chart options ─────────────────────────────── */

  // 1. Orders & Inquiries Trend
  const trendLabels = dayLabels(filteredOrders)
  const trendOpts = merge(HC_BASE, {
    chart: { type: 'areaspline', height: 300 },
    title: { text: null },
    xAxis: { ...trendLabels },
    yAxis: { allowDecimals: false },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.08,
        marker: { enabled: true, symbol: 'circle', radius: 4, lineWidth: 2, lineColor: '#ffffff' },
        lineWidth: 2.5
      }
    },
    series: [
      { name: 'Orders', data: filteredOrders.map(d => d.count), color: CHERRY },
      { name: 'Inquiries', data: filteredInquiries.map(d => d.count), color: '#1e293b' }
    ]
  })

  // 2. Order Status Breakdown (donut)
  const statusData = Object.entries(order_statuses).map(([name, y]) => ({ name, y }))
  const statusOpts = merge(HC_BASE, {
    chart: { type: 'pie', height: 300 },
    title: { text: 'Order Status' },
    plotOptions: {
      pie: {
        innerSize: '60%',
        borderWidth: 2,
        borderColor: '#ffffff',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
          style: { fontSize: '11px', fontWeight: '500', color: INK, textOutline: 'none' }
        }
      }
    },
    series: [{ name: 'Status', data: statusData }]
  })

  // 3. Dessert Type Popularity (bar)
  const dessertOpts = merge(HC_BASE, {
    chart: { type: 'bar', height: 300 },
    title: { text: 'Dessert Types Ordered' },
    xAxis: { categories: dessert_types.map(d => d.type || 'Unknown') },
    yAxis: { allowDecimals: false },
    legend: { enabled: false },
    plotOptions: { bar: { borderRadius: 4, borderWidth: 0, colorByPoint: true } },
    series: [{ name: 'Orders', data: dessert_types.map(d => d.count) }]
  })

  // 4. Event Type Distribution (column)
  const eventOpts = merge(HC_BASE, {
    chart: { type: 'column', height: 300 },
    title: { text: 'Event Types' },
    xAxis: { categories: event_types.map(d => d.type || 'Unknown') },
    yAxis: { allowDecimals: false },
    legend: { enabled: false },
    plotOptions: { column: { borderRadius: 4, borderWidth: 0, colorByPoint: true } },
    series: [{ name: 'Events', data: event_types.map(d => d.count) }]
  })

  // 5. Page Visits Over Time (area)
  const visitsLabels = dayLabels(filteredVisitsTime)
  const visitsTimeOpts = merge(HC_BASE, {
    chart: { type: 'area', height: 280 },
    title: { text: null },
    xAxis: { ...visitsLabels },
    yAxis: { allowDecimals: false },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [[0, 'rgba(210,4,45,0.2)'], [1, 'rgba(210,4,45,0.01)']]
        },
        marker: { enabled: false },
        lineWidth: 2.5,
        lineColor: CHERRY
      }
    },
    series: [{ name: 'Visits', data: filteredVisitsTime.map(d => d.count), color: CHERRY }]
  })

  // 6. Most Visited Pages (horizontal bar)
  const topPages = visits_by_page.slice(0, 8)
  const pagesOpts = merge(HC_BASE, {
    chart: { type: 'bar', height: 280 },
    title: { text: 'Most Visited Pages' },
    xAxis: { categories: topPages.map(d => d.page || '/') },
    yAxis: { allowDecimals: false },
    legend: { enabled: false },
    plotOptions: { bar: { borderRadius: 4, borderWidth: 0, color: CHERRY } },
    series: [{ name: 'Visits', data: topPages.map(d => d.count) }]
  })

  // 7. Inquiry Subjects (donut)
  const subjectData = inquiry_subjects.map(d => ({ name: d.subject || 'Other', y: d.count }))
  const subjectOpts = merge(HC_BASE, {
    chart: { type: 'pie', height: 280 },
    title: { text: 'Inquiry Subjects' },
    plotOptions: {
      pie: {
        innerSize: '55%',
        borderWidth: 2,
        borderColor: '#ffffff',
        dataLabels: {
          format: '<b>{point.name}</b>: {point.y}',
          style: { fontSize: '11px', fontWeight: '500', color: INK, textOutline: 'none' }
        }
      }
    },
    series: [{ name: 'Subject', data: subjectData }]
  })

  /* ── render ────────────────────────────────────── */
  return (
    <section className="py-10">
      <div className="bb-container space-y-8">

        {/* ── global date range bar ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            Dashboard Range
          </div>
          <div className="flex items-center gap-3">
            <RangePills
              value={globalDays}
              onChange={(v) => { setGlobalDays(v); setTrendDays(null); setVisitsDays(null) }}
            />
            <button
              className="bb-btn text-xs px-3 py-1.5"
              type="button"
              onClick={() => load(Math.max(globalDays, effectiveTrend, effectiveVisits))}
            >
              {loading ? '⟳' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* ── stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Orders" value={totals.orders} icon="📦" />
          <StatCard label="Inquiries" value={totals.inquiries} icon="💬" />
          <StatCard label="Page Visits" value={totals.visits} icon="👁" />
          <StatCard label="Gallery Items" value={totals.gallery} icon="🖼" />
          <StatCard label="Reviews" value={totals.reviews} icon="⭐" />
        </div>

        {/* ── row 1: trend + status ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            className="lg:col-span-2"
            title="Orders & Inquiries"
            range={effectiveTrend}
            onRangeChange={setTrendDays}
          >
            <HighchartsReact highcharts={Highcharts} options={trendOpts} />
          </ChartCard>
          <ChartCard>
            <HighchartsReact highcharts={Highcharts} options={statusOpts} />
          </ChartCard>
        </div>

        {/* ── row 2: dessert types + event types ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard>
            <HighchartsReact highcharts={Highcharts} options={dessertOpts} />
          </ChartCard>
          <ChartCard>
            <HighchartsReact highcharts={Highcharts} options={eventOpts} />
          </ChartCard>
        </div>

        {/* ── row 3: visits over time + most visited pages ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Page Visits"
            range={effectiveVisits}
            onRangeChange={setVisitsDays}
          >
            <HighchartsReact highcharts={Highcharts} options={visitsTimeOpts} />
          </ChartCard>
          <ChartCard>
            <HighchartsReact highcharts={Highcharts} options={pagesOpts} />
          </ChartCard>
        </div>

        {/* ── row 4: inquiry subjects + activity feed ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard>
            <HighchartsReact highcharts={Highcharts} options={subjectOpts} />
          </ChartCard>
          <ChartCard title="Recent Activity">
            <ActivityFeed items={activity} />
          </ChartCard>
        </div>
      </div>
    </section>
  )
}
