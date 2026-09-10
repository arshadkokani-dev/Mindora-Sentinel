import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
  e.preventDefault()

  try {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    const data = await response.json()

    console.log(data)

    if (response.ok) {
      console.log('Signup successful')
      navigate('/login')
    } else {
      console.error('Signup failed:', data)
    }
  } catch (error) {
    console.error('Signup error:', error)
  }
}

  return (
    <div className="login-container">
      <h1>Create Account</h1>

      <p className="subtitle">
        Start your wellness journey today.
      </p>

      <form className="login-form" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button type="submit">Create Account</button>
        <p className="switch-text">
  Already have an account?{' '}
  <Link to="/login">Login</Link>
</p>
      </form>
    </div>
  )
}

export default Signup