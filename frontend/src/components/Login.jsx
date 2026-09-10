import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
  e.preventDefault()

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await response.json()

    console.log(data)
    if (response.ok) {
  localStorage.setItem('token', data.token)
  console.log('Login successful')
  navigate('/dashboard')
}
  } catch (error) {
    console.error('Login error:', error)
  }
}

  return (
    <div className="login-container">
      <h1>AI Mental Wellness Tracker</h1>

      <p className="subtitle">
        A safe space to understand how you feel.
      </p>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
        <p className="switch-text">
  Don't have an account?{' '}
  <Link to="/signup">Sign up</Link>
</p>
      </form>
    </div>
  )
}

export default Login