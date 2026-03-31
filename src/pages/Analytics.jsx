import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import './Analytics.css'

const visitData = [
  { mois: 'Jan', visites: 1200, nouveaux: 400 },
  { mois: 'Fév', visites: 1900, nouveaux: 600 },
  { mois: 'Mar', visites: 1500, nouveaux: 500 },
  { mois: 'Avr', visites: 2400, nouveaux: 900 },
  { mois: 'Mai', visites: 2200, nouveaux: 750 },
  { mois: 'Juin', visites: 3100, nouveaux: 1100 },
  { mois: 'Juil', visites: 2800, nouveaux: 950 },
]

const revenueData = [
  { mois: 'Jan', revenu: 4200 },
  { mois: 'Fév', revenu: 5800 },
  { mois: 'Mar', revenu: 4900 },
  { mois: 'Avr', revenu: 7200 },
  { mois: 'Mai', revenu: 6500 },
  { mois: 'Juin', revenu: 8900 },
  { mois: 'Juil', revenu: 8100 },
]

const sourceData = [
  { name: 'Direct', value: 35 },
  { name: 'Recherche', value: 28 },
  { name: 'Réseaux sociaux', value: 22 },
  { name: 'Email', value: 15 },
]

const deviceData = [
  { appareil: 'Mobile', sessions: 5400 },
  { appareil: 'Desktop', sessions: 3800 },
  { appareil: 'Tablette', sessions: 1200 },
]

const COLORS = ['#6c63ff', '#22d3ee', '#f59e0b', '#10b981']

const kpis = [
  { label: 'Visites totales', value: '15 100', change: '+12%', up: true },
  { label: 'Nouveaux utilisateurs', value: '5 205', change: '+8%', up: true },
  { label: 'Revenu', value: '45 600 €', change: '+21%', up: true },
  { label: 'Taux de rebond', value: '38%', change: '-3%', up: false },
]

export default function Analytics() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytiques</h1>
          <p className="page-subtitle">Aperçu des performances — Juillet 2025</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card">
            <span className="kpi-label">{k.label}</span>
            <span className="kpi-value">{k.value}</span>
            <span className={`kpi-change ${k.up ? 'up' : 'down'}`}>{k.change} vs mois dernier</span>
          </div>
        ))}
      </div>

      {/* Ligne : visites */}
      <div className="charts-row">
        <div className="chart-card wide">
          <h3 className="chart-title">Visites & Nouveaux utilisateurs</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={visitData}>
              <defs>
                <linearGradient id="gVisites" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gNouveaux" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="visites" name="Visites" stroke="#6c63ff" strokeWidth={2} fill="url(#gVisites)" />
              <Area type="monotone" dataKey="nouveaux" name="Nouveaux" stroke="#22d3ee" strokeWidth={2} fill="url(#gNouveaux)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie : sources */}
        <div className="chart-card">
          <h3 className="chart-title">Sources de trafic</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                {sourceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-row">
        {/* Bar : revenus */}
        <div className="chart-card">
          <h3 className="chart-title">Revenu mensuel (€)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }} />
              <Bar dataKey="revenu" name="Revenu" fill="#6c63ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar : appareils */}
        <div className="chart-card">
          <h3 className="chart-title">Sessions par appareil</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deviceData} barSize={36} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="appareil" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }} />
              <Bar dataKey="sessions" name="Sessions" fill="#22d3ee" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
