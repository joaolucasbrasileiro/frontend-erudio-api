import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './AuthFlow.css'

const API_URL = import.meta.env.VITE_API_URL

function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const email    = location.state?.email || ''
  const code     = location.state?.code  || ''

  const [newPass, setNewPass]         = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passErro, setPassErro]       = useState(false)
  const [confirmErro, setConfirmErro] = useState(false)
  const [erros, setErros]             = useState([])
  const [tipoMsg, setTipoMsg]         = useState('')
  const [loading, setLoading]         = useState(false)

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

  const forca = forcaSenha(newPass)

  async function handleReset() {
    setPassErro(false)
    setConfirmErro(false)
    setErros([])

    const novosErros = []

    if (newPass === '') {
      setPassErro(true); novosErros.push('Preencha a nova senha!')
    } else if (newPass.length < 8) {
      setPassErro(true); novosErros.push('A senha deve ter no mínimo 8 caracteres!')
    }

    if (confirmPass === '') {
      setConfirmErro(true); novosErros.push('Confirme a nova senha!')
    } else if (newPass !== confirmPass) {
      setConfirmErro(true); novosErros.push('As senhas não conferem!')
    }

    if (novosErros.length > 0) {
      setErros(novosErros)
      setTipoMsg('erro')
      return
    }

    setLoading(true)

    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword: newPass })
    })

    setLoading(false)

    if (response.ok) {
      setErros(['Senha redefinida com sucesso! Redirecionando...'])
      setTipoMsg('success')
      setTimeout(() => navigate('/'), 2000)
    } else {
      setErros(['Erro ao redefinir senha. O código pode ter expirado.'])
      setTipoMsg('erro')
    }
  }

  return (
    <div className="page">
      <div className="auth-container">

        <button className="back-btn" onClick={() => navigate('/validate-code', { state: { email } })}>
          ← Voltar
        </button>

        <h1 className="heading">Nova senha</h1>
        <p className="subheading">Escolha uma senha forte para sua conta</p>

        {erros.length > 0 && (
          <ul className={`msg ${tipoMsg}`}>
            {erros.map((erro, index) => (
              <li key={index}>{erro}</li>
            ))}
          </ul>
        )}

        <div className="field">
          <label htmlFor="newPass">Nova senha</label>
          <div className="flow-pass-wrapper">
            <input
              type={showPass ? 'text' : 'password'}
              id="newPass"
              placeholder="••••••••••"
              className={passErro ? 'erro' : ''}
              value={newPass}
              onChange={e => { setNewPass(e.target.value); setPassErro(false) }}
            />
            <button
              type="button"
              className="flow-toggle-pass"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
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
          {newPass && (
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

        <div className="field">
          <label htmlFor="confirmPass">Confirmar senha</label>
          <div className="flow-pass-wrapper">
            <input
              type={showConfirm ? 'text' : 'password'}
              id="confirmPass"
              placeholder="••••••••••"
              className={confirmErro ? 'erro' : confirmPass && newPass === confirmPass ? 'valido' : ''}
              value={confirmPass}
              onChange={e => { setConfirmPass(e.target.value); setConfirmErro(false) }}
            />
            <button
              type="button"
              className="flow-toggle-pass"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
            >
              {showConfirm ? (
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
          {confirmPass && newPass === confirmPass && (
            <span className="field-ok">✓ Senhas conferem</span>
          )}
        </div>

        <div className="form-actions">
          <button className="btn-secondary" onClick={() => navigate('/')}>
            <span>Cancelar</span>
          </button>
          <button className="btn" onClick={handleReset} disabled={loading}>
            <span>{loading ? 'Salvando...' : 'Confirmar →'}</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default ResetPassword
