import { useState, useEffect, useCallback } from 'react'
import './Settings.css'

function useVisible(delay = 0) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return visible
}

/* Bug #20 fix: Toggle now has an associated aria-label */
function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
    />
  )
}

function Section({ title, children, delay }) {
  const visible = useVisible(delay)
  return (
    <div className={`settings-section ${visible ? 'visible' : ''}`}>
      <h3 className="settings-section-title">{title}</h3>
      <div className="settings-card">{children}</div>
    </div>
  )
}

function Row({ label, sub, children }) {
  return (
    <div className="settings-row">
      <div className="settings-row-info">
        <span className="settings-row-label">{label}</span>
        {sub && <span className="settings-row-sub">{sub}</span>}
      </div>
      <div className="settings-row-control">{children}</div>
    </div>
  )
}

/* Storage key for settings persistence (Bug #8 fix) */
const SETTINGS_KEY = 'dashboard-admin-settings'

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export default function Settings() {
  const headerVisible = useVisible(0)

  const defaults = loadSettings() || {
    name: 'Medoune',
    email: 'medoune@admin.com',
    lang: 'fr',
    notifEmail: true,
    notifPush: false,
    notifSms: false,
    darkMode: false,
    compact: false,
  }

  const [name, setName]       = useState(defaults.name)
  const [email, setEmail]     = useState(defaults.email)
  const [lang, setLang]       = useState(defaults.lang)
  const [notifEmail, setNotifEmail] = useState(defaults.notifEmail)
  const [notifPush, setNotifPush]   = useState(defaults.notifPush)
  const [notifSms, setNotifSms]     = useState(defaults.notifSms)
  const [darkMode, setDarkMode]     = useState(defaults.darkMode)
  const [compact, setCompact]       = useState(defaults.compact)
  const [saved, setSaved]           = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  /* Bug #6 fix: Apply dark mode class to body */
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
    return () => document.body.classList.remove('dark-mode')
  }, [darkMode])

  /* Bug #7 fix: Apply compact mode class to body */
  useEffect(() => {
    document.body.classList.toggle('compact-mode', compact)
    return () => document.body.classList.remove('compact-mode')
  }, [compact])

  /* Bug #8 fix: handleSave actually persists to localStorage */
  const handleSave = useCallback((e) => {
    e.preventDefault()
    saveSettings({
      name, email, lang,
      notifEmail, notifPush, notifSms,
      darkMode, compact,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }, [name, email, lang, notifEmail, notifPush, notifSms, darkMode, compact])

  /* Bug #9 fix: Delete account handler with confirmation */
  function handleDeleteAccount() {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }
    // Perform account deletion
    localStorage.removeItem(SETTINGS_KEY)
    // Reset to defaults
    setName('Medoune')
    setEmail('medoune@admin.com')
    setLang('fr')
    setNotifEmail(true)
    setNotifPush(false)
    setNotifSms(false)
    setDarkMode(false)
    setCompact(false)
    setShowDeleteConfirm(false)
    alert('Compte supprimé avec succès. Toutes les données ont été réinitialisées.')
  }

  return (
    <div>
      <div className={`settings-header ${headerVisible ? 'visible' : ''}`}>
        <div>
          <h1 className="page-title">Paramètres</h1>
          <p className="page-subtitle">Gérez vos préférences et votre compte.</p>
        </div>
        <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
          {saved ? <><CheckIcon /> Enregistré</> : 'Enregistrer'}
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Profil */}
        <Section title="Profil" delay={80}>
          <Row label="Nom complet" sub="Votre nom affiché dans le dashboard">
            <input
              id="settings-name"
              className="settings-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Nom complet"
            />
          </Row>
          <Row label="Adresse email" sub="Utilisée pour les notifications">
            <input
              id="settings-email"
              className="settings-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Adresse email"
            />
          </Row>
          <Row label="Langue" sub="Langue de l'interface">
            <select
              id="settings-lang"
              className="settings-input"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Langue de l'interface"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </Row>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" delay={180}>
          <Row label="Notifications email" sub="Recevoir les alertes par email">
            <Toggle checked={notifEmail} onChange={setNotifEmail} label="Activer les notifications email" />
          </Row>
          <Row label="Notifications push" sub="Alertes dans le navigateur">
            <Toggle checked={notifPush} onChange={setNotifPush} label="Activer les notifications push" />
          </Row>
          <Row label="Notifications SMS" sub="Alertes par message texte">
            <Toggle checked={notifSms} onChange={setNotifSms} label="Activer les notifications SMS" />
          </Row>
        </Section>

        {/* Apparence */}
        <Section title="Apparence" delay={280}>
          <Row label="Mode sombre" sub="Interface en thème sombre">
            <Toggle checked={darkMode} onChange={setDarkMode} label="Activer le mode sombre" />
          </Row>
          <Row label="Vue compacte" sub="Réduire l'espacement des éléments">
            <Toggle checked={compact} onChange={setCompact} label="Activer la vue compacte" />
          </Row>
        </Section>

        {/* Danger zone */}
        <Section title="Zone de danger" delay={380}>
          <Row label="Supprimer le compte" sub="Action irréversible — toutes vos données seront perdues">
            <div className="delete-actions">
              {showDeleteConfirm && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Annuler
                </button>
              )}
              <button
                type="button"
                className={`danger-btn ${showDeleteConfirm ? 'confirm' : ''}`}
                onClick={handleDeleteAccount}
              >
                {showDeleteConfirm ? 'Confirmer la suppression' : 'Supprimer'}
              </button>
            </div>
          </Row>
        </Section>
      </form>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
