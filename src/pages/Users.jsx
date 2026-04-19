import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Users.css'

/* Bug #2 fix: Determine user status based on user data instead of hardcoding */
function getUserStatus(user) {
  // Simulate status: users with odd IDs are active, even IDs are inactive
  // In a real app, this would come from backend data
  return user.id % 2 !== 0 ? 'active' : 'inactive'
}

function getStatusLabel(status) {
  return status === 'active' ? 'Actif' : 'Inactif'
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement')
        return res.json()
      })
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Utilisateurs</h1>
          <p className="page-subtitle">{users.length} utilisateurs au total</p>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input
            id="search-users"
            type="text"
            className="search-input"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher un utilisateur"
          />
          <span className="result-count">{filtered.length} résultat(s)</span>
        </div>

        {loading && (
          <div className="state-box">
            <div className="spinner" />
            <span>Chargement...</span>
          </div>
        )}

        {error && (
          <div className="state-box error">
            <span>Erreur : {error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Entreprise</th>
                  <th>Ville</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-row">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const status = getUserStatus(user)
                    return (
                      <tr key={user.id}>
                        <td className="id-cell">{user.id}</td>
                        <td>
                          <div className="user-cell">
                            <div className="avatar-sm">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <Link to={`/users/${user.id}`} className="user-fullname user-link">
                                {user.name}
                              </Link>
                              <div className="user-username">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="muted">{user.email}</td>
                        <td className="muted">{user.phone}</td>
                        <td>{user.company.name}</td>
                        <td className="muted">{user.address.city}</td>
                        <td>
                          <span className={`badge ${status}`}>{getStatusLabel(status)}</span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
