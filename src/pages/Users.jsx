import { useState, useEffect } from 'react'
import './Users.css'

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
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Utilisateurs</h1>
          <p className="page-subtitle">{users.length} utilisateurs au total</p>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                  filtered.map((user) => (
                    <tr key={user.id}>
                      <td className="id-cell">{user.id}</td>
                      <td>
                        <div className="user-cell">
                          <div className="avatar-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="user-fullname">{user.name}</div>
                            <div className="user-username">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="muted">{user.email}</td>
                      <td className="muted">{user.phone}</td>
                      <td>{user.company.name}</td>
                      <td className="muted">{user.address.city}</td>
                      <td>
                        <span className="badge active">Actif</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
