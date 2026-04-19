import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import './Dashboard.css'

const sparkData = [
  { j: 'L', v: 30 }, { j: 'M', v: 55 }, { j: 'M', v: 40 },
  { j: 'J', v: 70 }, { j: 'V', v: 60 }, { j: 'S', v: 90 }, { j: 'D', v: 75 },
]

/* Icons — declared BEFORE kpis so JSX references resolve correctly */
function UserIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/></svg>
}
function RevenueIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
}
function OrderIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
}
function BounceIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
}

const kpis = [
  { label: 'Utilisateurs', value: 8420,  suffix: '',  change: '+12%', up: true,  color: '#6c63ff', icon: <UserIcon /> },
  { label: 'Revenu',       value: 45600, suffix: ' €', change: '+21%', up: true,  color: '#10b981', icon: <RevenueIcon /> },
  { label: 'Commandes',    value: 1280,  suffix: '',  change: '+5%',  up: true,  color: '#f59e0b', icon: <OrderIcon /> },
  { label: 'Taux rebond',  value: 38,    suffix: '%', change: '-3%',  up: false, color: '#ef4444', icon: <BounceIcon /> },
]

const activity = [
  { id: 1, text: 'Nouvel utilisateur inscrit', sub: 'Leanne Graham', time: 'il y a 2 min',  dot: '#6c63ff' },
  { id: 2, text: 'Commande passée',            sub: '#1042 — 120 €', time: 'il y a 8 min',  dot: '#10b981' },
  { id: 3, text: 'Rapport généré',             sub: 'Analytiques Juin', time: 'il y a 15 min', dot: '#f59e0b' },
  { id: 4, text: 'Utilisateur désactivé',      sub: 'Chelsey Dietrich', time: 'il y a 30 min', dot: '#ef4444' },
  { id: 5, text: 'Commande passée',            sub: '#1041 — 89 €', time: 'il y a 1 h',    dot: '#10b981' },
]

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setCount(Math.floor(p * target))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])
  return count
}

function KpiCard({ kpi, index }) {
  const count = useCountUp(kpi.value, 900 + index * 100)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 100)
    return () => clearTimeout(t)
  }, [index])

  return (
    <div className={`dash-kpi-card ${visible ? 'visible' : ''}`} style={{ '--accent': kpi.color }}>
      <div className="dash-kpi-top">
        <div className="dash-kpi-icon">{kpi.icon}</div>
        <span className={`dash-kpi-change ${kpi.up ? 'up' : 'down'}`}>{kpi.change}</span>
      </div>
      <div className="dash-kpi-value">{count.toLocaleString('fr-FR')}{kpi.suffix}</div>
      <div className="dash-kpi-label">{kpi.label}</div>
    </div>
  )
}

export default function Dashboard() {
  const [chartVisible, setChartVisible] = useState(false)
  const [activityVisible, setActivityVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setChartVisible(true), 300)
    const t2 = setTimeout(() => setActivityVisible(true), 450)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="page-title">Bonjour, Medoune</h1>
          <p className="page-subtitle">Voici ce qui se passe aujourd'hui.</p>
        </div>
        <Link to="/analytics" className="dash-btn">Voir les analytiques</Link>
      </div>

      {/* KPIs */}
      <div className="dash-kpi-grid">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} kpi={kpi} index={i} />)}
      </div>

      <div className="dash-bottom">
        {/* Graphique */}
        <div className={`dash-chart-card ${chartVisible ? 'visible' : ''}`}>
          <h3 className="dash-section-title">Activité cette semaine</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id="gDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="j" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }} />
              <Area type="monotone" dataKey="v" name="Sessions" stroke="#6c63ff" strokeWidth={2.5} fill="url(#gDash)" dot={{ r: 4, fill: '#6c63ff', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activité récente */}
        <div className={`dash-activity-card ${activityVisible ? 'visible' : ''}`}>
          <h3 className="dash-section-title">Activité récente</h3>
          <ul className="dash-activity-list">
            {activity.map((a, i) => (
              <li key={a.id} className="dash-activity-item" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="dash-dot" style={{ background: a.dot }} />
                <div className="dash-activity-body">
                  <span className="dash-activity-text">{a.text}</span>
                  <span className="dash-activity-sub">{a.sub}</span>
                </div>
                <span className="dash-activity-time">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
