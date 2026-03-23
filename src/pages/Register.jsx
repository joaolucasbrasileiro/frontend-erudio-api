import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import './Register.css'

const API_URL = import.meta.env.VITE_API_URL

function Register() {
  const navigate = useNavigate()
  const captchaRef = useRef(null)

  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [user, setUser]               = useState('')
  const [pass, setPass]               = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')

  const [showPass, setShowPass]           = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const [nameErro, setNameErro]           = useState(false)
  const [emailErro, setEmailErro]         = useState(false)
  const [userErro, setUserErro]           = useState(false)
  const [passErro, setPassErro]           = useState(false)
  const [confirmPassErro, setConfirmPassErro] = useState(false)

  const [erros, setErros]     = useState([])
  const [tipoMsg, setTipoMsg] = useState('')

  // Validação de email em tempo real
  function emailValido(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  }

  // Força da senha
  function forcaSenha(p) {
    if (p.length === 0) return null
    let pontos = 0
    if (p.length >= 8) pontos++
    if (/[A-Z]/.test(p)) pontos++
    if (/[0-9]/.test(p)) pontos++
    if (/[^A-Za-z0-9]/.test(p)) pontos++
    if (pontos <= 1) return 'fraca'
    if (pontos === 2) return 'media'
    return 'forte'
  }

  const forca = forcaSenha(pass)

  async function handleRegister() {
    setNameErro(false)
    setEmailErro(false)
    setUserErro(false)
    setPassErro(false)
    setConfirmPassErro(false)
    setErros([])

    if (captchaToken === '') {
      setErros(['Por favor, complete o CAPTCHA!'])
      setTipoMsg('erro')
      return
    }

    const novosErros = []

    if (name === '') { setNameErro(true); novosErros.push('Preencha o nome!') }

    if (email === '') {
      setEmailErro(true); novosErros.push('Preencha o email!')
    } else if (!emailValido(email)) {
      setEmailErro(true); novosErros.push('Email inválido!')
    }

    if (user === '') {
      setUserErro(true); novosErros.push('Preencha o usuário!')
    } else if (user.length < 4) {
      setUserErro(true); novosErros.push('Usuário deve ter no mínimo 4 caracteres!')
    }

    if (pass === '') {
      setPassErro(true); novosErros.push('Preencha a senha!')
    } else if (pass.length < 8) {
      setPassErro(true); novosErros.push('Senha deve ter no mínimo 8 caracteres!')
    }

    if (confirmPass === '') {
      setConfirmPassErro(true); novosErros.push('Confirme a senha!')
    } else if (pass !== confirmPass) {
      setConfirmPassErro(true); novosErros.push('As senhas não conferem!')
    }

    if (novosErros.length > 0) {
      setErros(novosErros)
      setTipoMsg('erro')
      return
    }

    const response = await fetch(`${API_URL}/auth/createUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: name,
        email: email,
        username: user,
        password: pass,
        captchaToken: captchaToken
      })
    })

    if (response.ok) {
      setErros(['Conta criada! Verifique seu email para confirmar o cadastro.'])
      setTipoMsg('success')
      setTimeout(() => navigate('/'), 3000)
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

        <h1 className="rHeading">Criar conta</h1>
        <p className="rSubHeading">Preencha os dados para se cadastrar</p>

        {erros.length > 0 && (
          <ul className={`msg ${tipoMsg}`}>
            {erros.map((erro, index) => (
              <li key={index}>{erro}</li>
            ))}
          </ul>
        )}

        {/* Nome */}
        <div className="field">
          <label htmlFor="fullname">Nome Completo</label>
          <input
            type="text"
            id="fullname"
            placeholder="Digite seu nome completo"
            className={nameErro ? 'erro' : ''}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <span className="field-hint">Preencha o nome</span>
        </div>

        {/* Email */}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu email"
            className={emailErro ? 'erro' : email && emailValido(email) ? 'valido' : ''}
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailErro(false) }}
          />
          <span className="field-hint">
            {email && !emailValido(email) ? 'Email inválido' : 'Preencha o email'}
          </span>
          {email && emailValido(email) && (
            <span className="field-ok">✓ Email válido</span>
          )}
        </div>

        {/* Usuário */}
        <div className="field">
          <label htmlFor="username">Usuário</label>
          <div className="reg-tooltip-wrapper">
            <input
              type="text"
              id="username"
              placeholder="Digite seu usuário"
              className={userErro ? 'erro' : ''}
              value={user}
              onChange={e => setUser(e.target.value)}
            />
            <div className="reg-tooltip">Mínimo 4 caracteres</div>
          </div>
          <span className="field-hint">Mínimo 4 caracteres</span>
        </div>

        {/* Senha */}
        <div className="field">
          <label htmlFor="password">Senha</label>
          <div className="reg-pass-wrapper">
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
              className="reg-toggle-pass"
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
          {pass && (
            <div className="senha-forca">
              <div className={`forca-bar ${forca}`}>
                <span></span><span></span><span></span>
              </div>
              <span className={`forca-label ${forca}`}>
                {forca === 'fraca' ? 'Senha fraca' : forca === 'media' ? 'Senha média' : 'Senha forte'}
              </span>
            </div>
          )}
          <span className="field-hint">Mínimo 8 caracteres</span>
        </div>

        {/* Confirmar senha */}
        <div className="field">
          <label htmlFor="confirmPassword">Confirmar senha</label>
          <div className="reg-pass-wrapper">
            <input
              type={showConfirmPass ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="••••••••••"
              className={confirmPassErro ? 'erro' : confirmPass && pass === confirmPass ? 'valido' : ''}
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
            />
            <button
              type="button"
              className="reg-toggle-pass"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              tabIndex={-1}
              aria-label={showConfirmPass ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConfirmPass ? (
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
          <span className="field-hint">As senhas não conferem</span>
          {confirmPass && pass === confirmPass && (
            <span className="field-ok">✓ Senhas conferem</span>
          )}
        </div>

        <HCaptcha
          sitekey="e432ce86-a048-4602-b8e4-8486fa44a9c8"
          theme="dark"
          onVerify={token => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken('')}
          ref={captchaRef}
        />

        <div className="form-actions">
          <button className="btn-back" onClick={() => navigate('/')}>
            <span>← Voltar</span>
          </button>
          <button className="btn-register" onClick={handleRegister}>
            <span>Criar conta →</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default Register
