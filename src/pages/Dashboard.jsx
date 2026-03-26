import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL

function Dashboard() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username')
  const token    = localStorage.getItem('acessToken')

  const [fullName, setFullName]         = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [manageOpen, setManageOpen]     = useState(false)
  const [formFullname, setFormFullname] = useState(false)
  const [formPassword, setFormPassword] = useState(false)
  const [newFullname, setNewFullname]   = useState('')
  const [newPassword, setNewPassword]   = useState('')
  const [msg, setMsg]                   = useState('')
  const [tipoMsg, setTipoMsg]           = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/')
      return
    }
    carregarUsuario()
  }, [])

  async function carregarUsuario() {
    const response = await fetch(`${API_URL}/auth/user/` + username, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token }
    })

    if (response.ok) {
      const data = await response.json()
      setFullName(data.fullName)
    } else {
      setFullName(username)
    }
  }

  function handleLogout() {
    localStorage.removeItem('acessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('username')
    navigate('/')
  }

  function showMsg(texto, tipo) {
    setMsg(texto)
    setTipoMsg(tipo)
  }

  async function salvarNome() {
    if (newFullname === '') {
      showMsg('Preencha o novo nome!', 'erro')
      return
    }

    const response = await fetch(`${API_URL}/auth/updateUser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ username, fullName: newFullname, password: null })
    })

    if (response.ok) {
      showMsg('Nome atualizado com sucesso!', 'success')
      setFormFullname(false)
      setNewFullname('')
      setTimeout(() => carregarUsuario(), 1000)
    } else {
      showMsg('Erro ao atualizar nome.', 'erro')
    }
  }

  async function salvarSenha() {
    if (newPassword === '') {
      showMsg('Preencha a nova senha!', 'erro')
      return
    }

    if (newPassword.length < 8) {
      showMsg('A senha deve ter no mínimo 8 caracteres!', 'erro')
      return
    }

    const response = await fetch(`${API_URL}/auth/updateUser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ username, fullName: null, password: newPassword })
    })

    if (response.ok) {
      showMsg('Senha atualizada com sucesso!', 'success')
      setFormPassword(false)
      setNewPassword('')
    } else {
      showMsg('Erro ao atualizar senha.', 'erro')
    }
  }

  return (
    <div onClick={() => setDropdownOpen(false)}>

      <nav className="navbar">
        <span className="nav-logo">Erudio API</span>
        <div className="nav-user">
          <div
            className="user-menu"
            onClick={e => { e.stopPropagation(); setDropdownOpen(!dropdownOpen) }}
          >
            <div className="user-trigger">
              <span id="nav-username">{fullName || username}</span>
              <span id="dropdown-icon">{dropdownOpen ? '▾' : '▸'}</span>
            </div>
            {dropdownOpen && (
              <div className="dropdown">
                <button onClick={() => { setManageOpen(!manageOpen); setDropdownOpen(false) }}>
                  Gerenciar conta
                </button>
                <button onClick={handleLogout}>Sair</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <h1 className="welcome-msg">Bem vindo, {fullName || username}!</h1>

        {manageOpen && (
          <div className="manage-section">
            <h2 className="manage-title">Gerenciar conta</h2>

            <div className="manage-options">
              <div className="manage-card">
                <h3>Nome completo</h3>
                <p>Alterar seu nome de exibição</p>
                <button
                  className="btn-open"
                  onClick={() => { setFormFullname(true); setFormPassword(false); setMsg('') }}
                >
                  <span>Alterar</span>
                </button>
              </div>
              <div className="manage-card">
                <h3>Senha</h3>
                <p>Alterar sua senha de acesso</p>
                <button
                  className="btn-open"
                  onClick={() => { setFormPassword(true); setFormFullname(false); setMsg('') }}
                >
                  <span>Alterar</span>
                </button>
              </div>
            </div>

            {formFullname && (
              <div className="edit-form">
                <div className="field">
                  <label>Novo nome completo</label>
                  <input
                    type="text"
                    placeholder="Digite o novo nome"
                    value={newFullname}
                    onChange={e => setNewFullname(e.target.value)}
                  />
                </div>
                <div className="form-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => { setFormFullname(false); setNewFullname('') }}
                  >
                    <span>Cancelar</span>
                  </button>
                  <button className="btn-save" onClick={salvarNome}>
                    <span>Salvar</span>
                  </button>
                </div>
              </div>
            )}

            {formPassword && (
              <div className="edit-form">
                <div className="field">
                  <label>Nova senha</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="form-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => { setFormPassword(false); setNewPassword('') }}
                  >
                    <span>Cancelar</span>
                  </button>
                  <button className="btn-save" onClick={salvarSenha}>
                    <span>Salvar</span>
                  </button>
                </div>
              </div>
            )}

            {msg && (
              <ul className={`msg ${tipoMsg}`}>
                <li>{msg}</li>
              </ul>
            )}

          </div>
        )}
      </main>

    </div>
  )
}

export default Dashboard
