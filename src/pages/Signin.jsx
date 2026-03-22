import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Signin.css'

function Signin() {
  const navigate = useNavigate()

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
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

    const response = await fetch('http://localhost:8080/auth/signin', {
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
            placeholder="Username"
            className={userErro ? 'erro' : ''}
            value={user}
            onChange={e => setUser(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••••"
            className={passErro ? 'erro' : ''}
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
        </div>

        <button className="btn" onClick={handleLogin}>Sign in →</button>

        <h3 className="qRegister">Não tem uma conta? Crie uma aqui ↓</h3>
        <button className="btn-register-link" onClick={() => navigate('/register')}>
          Register
        </button>

      </div>
    </div>
  )
}

export default Signin