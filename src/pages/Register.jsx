import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import './Register.css'

function Register() {
  const navigate = useNavigate()
  const captchaRef = useRef(null)

  const [name, setName]       = useState('')
  const [user, setUser]       = useState('')
  const [pass, setPass]       = useState('')
  const [captchaToken, setCaptchaToken] = useState('')

  const [nameErro, setNameErro] = useState(false)
  const [userErro, setUserErro] = useState(false)
  const [passErro, setPassErro] = useState(false)

  const [erros, setErros]   = useState([])
  const [tipoMsg, setTipoMsg] = useState('')

  async function handleRegister() {
    setNameErro(false)
    setUserErro(false)
    setPassErro(false)
    setErros([])

    if (captchaToken === '') {
      setErros(['Por favor, complete o CAPTCHA!'])
      setTipoMsg('erro')
      return
    }

    const novosErros = []

    if (name === '') setNameErro(true)
    if (user === '') setUserErro(true)
    if (pass === '') setPassErro(true)

    if (name === '' && user === '' && pass === '') {
      setErros(['Preencha todos os campos!'])
      setTipoMsg('erro')
      return
    }

    if (name === '') novosErros.push('Preencha o nome!')

    if (user === '') {
      novosErros.push('Preencha o usuário!')
    } else if (user.length < 4) {
      setUserErro(true)
      novosErros.push('Usuário deve ter no mínimo 4 caracteres!')
    }

    if (pass === '') {
      novosErros.push('Preencha a senha!')
    } else if (pass.length < 8) {
      setPassErro(true)
      novosErros.push('Senha deve ter no mínimo 8 caracteres!')
    }

    if (novosErros.length > 0) {
      setErros(novosErros)
      setTipoMsg('erro')
      return
    }

    const response = await fetch('http://localhost:8080/auth/createUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: name,
        username: user,
        password: pass,
        captchaToken: captchaToken
      })
    })

    if (response.ok) {
      setErros(['Usuário registrado com sucesso!'])
      setTipoMsg('success')
      setTimeout(() => navigate('/'), 2000)
    } else {
      setErros(['Erro ao criar usuário. Tente novamente.'])
      setTipoMsg('erro')
      captchaRef.current.resetCaptcha()
      setCaptchaToken('')
    }
  }

  return (
    <div className="page">
      <div className="rContainer">

        <h1 className="rHeading">Bem vindo ao Register!</h1>
        <p className="rSubHeading">Cadastre-se Aqui</p>

        {erros.length > 0 && (
          <ul className={`msg ${tipoMsg}`}>
            {erros.map((erro, index) => (
              <li key={index}>{erro}</li>
            ))}
          </ul>
        )}

        <div className="field">
          <label htmlFor="fullname">Nome Completo</label>
          <input
            type="text"
            id="fullname"
            placeholder="Nome Completo"
            className={nameErro ? 'erro' : ''}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="username">Usuário</label>
          <div className="input-tooltip">
            <input
              type="text"
              id="username"
              placeholder="Username"
              className={userErro ? 'erro' : ''}
              value={user}
              onChange={e => setUser(e.target.value)}
            />
            <div className="tooltip">Mínimo 4 caracteres</div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="password">Senha</label>
          <div className="input-tooltip">
            <input
              type="password"
              id="password"
              placeholder="••••••••••"
              className={passErro ? 'erro' : ''}
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
            <div className="tooltip">Mínimo 8 caracteres</div>
          </div>
        </div>

        <HCaptcha
          sitekey="e432ce86-a048-4602-b8e4-8486fa44a9c8"
          theme="dark"
          onVerify={token => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken('')}
          ref={captchaRef}
        />

        <div className="form-actions">
          <button className="btn-back" onClick={() => navigate('/')}>← Back</button>
          <button className="btn-register" onClick={handleRegister}>Register →</button>
        </div>

      </div>
    </div>
  )
}

export default Register