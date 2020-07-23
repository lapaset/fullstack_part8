import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken, setPage, show, notify }) => {
  const [username, setUsername] = useState('')
  const [password, setPw] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: error => {
      notify(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      console.log('loggin in')
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      setUsername('')
      setPw('')
      setPage('authors')
    }
  }, [result.data]) //eslint-disable-line

  const submit = async event => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  if (!show) {
    return null
  }

  return <div>
          <h2>login</h2>
          <form onSubmit={submit}>
            <div>
              Username: <input 
                          name="username"
                          value={username}
                          onChange={({ target }) => setUsername(target.value)} />
            </div>
            <div>
              Password: <input 
                          name="pw"
                          type="password"
                          value={password}
                          onChange={({ target }) => setPw(target.value)} />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
  }

export default LoginForm