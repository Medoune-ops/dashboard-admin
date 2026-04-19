import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './UserDetail.css'

/* Bug #2 fix: Same status logic as Users.jsx */
function getUserStatus(user) {
  return user.id % 2 !== 0 ? 'active' : 'inactive'
}

function getStatusLabel(status) {
  return status === 'active' ? 'Actif' : 'Inactif'
}

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* Bug #3 fix: Validate ID before fetching */
  useEffect(() => {
    const numId = Number(id)
    if (!id || isNaN(numId) || numId < 1 || !Number.isInteger(numId)) {
      setError(`ID invalide : "${id}". L'ID doit être un nombre entier positif.`)
      setLoading(false)
      return
    }

    Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then((r) => {
        if (!r.ok) throw new Error('Utilisateur introuvable')
        return r.json()
      }),
      fetch(`https://jsonplaceholder.typicode.com/users/${id}/posts`).then((r) =>
        r.json()
      ),
    ])
      .then(([userData, postsData]) => {
        // Additional validation: API may return empty object for non-existent IDs
        if (!userData || !userData.id) {
          throw new Error('Utilisateur introuvable')
        }
        setUser(userData)
        setPosts(postsData)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="state-box">
        <div className="spinner" />
        <span>Chargement...</span>
      </div>
    )
  }

  /* Bug #3 fix: Better error display with navigation */
  if (error) {
    return (
      <div className="error-page">
        <h2>⚠️ {error}</h2>
        <p>Vérifiez l'URL ou retournez à la liste des utilisateurs.</p>
        <Link to="/users" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Retour aux utilisateurs
        </Link>
      </div>
    )
  }

  const status = getUserStatus(user)

  return (
    <div>
      {/* Bug #4 fix: Back button */}
      <button className="back-btn" onClick={() => navigate('/users')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Retour
      </button>

      <div className="breadcrumb">
        <Link to="/users">Utilisateurs</Link>
        <span>/</span>
        <span>{user.name}</span>
      </div>

      <div className="detail-grid">
        {/* Profil */}
        <div className="card profile-card">
          <div className="profile-avatar">{user.name.charAt(0)}</div>
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-username">@{user.username}</p>
          <span className={`badge ${status}`}>{getStatusLabel(status)}</span>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{posts.length}</span>
              <span className="stat-label">Articles</span>
            </div>
            <div className="stat">
              <span className="stat-value">{id}</span>
              <span className="stat-label">ID</span>
            </div>
          </div>
        </div>

        {/* Infos */}
        <div className="detail-right">
          <div className="card info-card">
            <h3 className="card-title">Informations</h3>
            <div className="info-grid">
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Téléphone" value={user.phone} />
              <InfoRow label="Site web" value={user.website} />
              <InfoRow
                label="Adresse"
                value={`${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}`}
              />
              <InfoRow label="Entreprise" value={user.company.name} />
              <InfoRow label="Activité" value={user.company.catchPhrase} />
            </div>
          </div>

          <div className="card posts-card">
            <h3 className="card-title">Articles récents ({posts.length})</h3>
            <ul className="posts-list">
              {posts.slice(0, 5).map((post) => (
                <li key={post.id} className="post-item">
                  <span className="post-id">#{post.id}</span>
                  <span className="post-title">{post.title}</span>
                </li>
              ))}
            </ul>
            {posts.length > 5 && (
              <p className="posts-more">+ {posts.length - 5} autres articles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  )
}
