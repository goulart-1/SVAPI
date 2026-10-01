import { login, signup } from './actions'

export default function LoginPage() {
  return <main className="auth-card"><h1>SVAPI</h1><p>Entre para acessar o painel.</p><form><label>Email<input name="email" type="email" required /></label><label>Senha<input name="password" type="password" minLength={6} required /></label><div className="actions"><button formAction={login}>Entrar</button><button formAction={signup} className="secondary">Criar conta</button></div></form></main>
}
