import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AccessibilityProvider } from './components/accessibility/AccessibilityContext'
import AccessibilityButton from './components/accessibility/AccessibilityButton'
import Signin from './pages/Signin'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import ValidateCode from './pages/ValidateCode'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    // AccessibilityProvider envolve tudo — o estado persiste em todas as páginas
    <AccessibilityProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/validate-code" element={<ValidateCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>

      {/*
        O botão fica FORA do BrowserRouter mas DENTRO do Provider.
        position: fixed — aparece em todas as páginas automaticamente.
      */}
      <AccessibilityButton />
    </AccessibilityProvider>
  )
}

export default App
