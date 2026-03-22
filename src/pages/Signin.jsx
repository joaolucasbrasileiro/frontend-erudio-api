import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Signin.css'

const API_URL = import.meta.env.VITE_API_URL

function Signin() {
  const navigate = useNavigate()

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [erros, setErros] = useState([])
  const [tipoMsg, setTipoMsg] = useState('')
  const [userErro, setUserErro] = useState(false)
  const [passErro, setPassErro] = useState(false)

  async function handleLogin() {
    setUserErro(false)
    setPassErro(false)
    setErros([])

    if (user === '' && pass === '') {
      setUserErro(true)
      setPassErro(true)
      setErros(['Preencha todos os campos!'])
      setTipoMsg('erro')
      return
    }

    if (user === '') {
      setUserErro(true)
      setErros(['Preencha o usuário!'])
      setTipoMsg('erro')
      return
    }

    if (pass === '') {
      setPassErro(true)
      setErros(['Preencha a senha!'])
      setTipoMsg('erro')
      return
    }

    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    })

    if (response.status === 401) {
      setUserErro(true)
      setPassErro(true)
      setErros(['Usuário ou senha incorretos!'])
      setTipoMsg('erro')
      return
    }

    const data = await response.json()

    localStorage.setItem('acessToken', data.acessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('username', data.username)

    setErros(['Credenciais autorizadas! Redirecionando...'])
    setTipoMsg('success')

    setTimeout(() => {
      navigate('/dashboard')
    }, 1500)
  }

  return (
    <div className="page">
      <div className="container">

        <h1 className="heading">Bem vindo!</h1>
        <p className="subheading">Faça o login para acessar o painel</p>

        {erros.length > 0 && (
          <ul className={`msg ${tipoMsg}`}>
            {erros.map((erro, index) => (
              <li key={index}>{erro}</li>
            ))}
          </ul>
        )}

        <div className="field">
          <label htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            placeholder="Digite seu usuário"
            className={userErro ? 'erro' : ''}
            value={user}
            onChange={e => setUser(e.target.value)}
          />
          <span className="field-hint">Preencha o usuário</span>
        </div>

        <div className="field">
          <label htmlFor="password">Senha</label>
          <div className="signin-pass-wrapper">
            <input
              type={showPass ? 'text' : 'password'}
              id="password"
              placeholder="••••••••••"
              className={passErro ? 'erro' : ''}
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
            <button
              type="button"
              className="signin-toggle-pass"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
              aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPass ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          <span className="field-hint">Preencha a senha</span>
        </div>

        <button className="btn" onClick={handleLogin}>
          <span>Entrar →</span>
        </button>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">não tem uma conta?</span>
          <div className="divider-line"></div>
        </div>

        <button className="btn-register-link" onClick={() => navigate('/register')}>
          <span>Criar conta</span>
        </button>

      </div>
    </div>
  )
}

export default Signin
