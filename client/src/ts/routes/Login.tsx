import { AxiosError } from 'axios'
import { push as pushFn } from 'connected-react-router'
import React, { FunctionComponent, useState } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { IconInput } from '../components/Input'
import { Login, login as loginFn } from '../store/user'

interface IProps {
  login: Login
  push: typeof pushFn
}

const Login: FunctionComponent<IProps> = ({ login, push }) => {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [usernameErr, setUsernameErr] = useState(undefined as
    | string
    | undefined)

  const [passwordErr, setPasswordErr] = useState(undefined as
    | string
    | undefined)

  const submit = async () => {
    setLoading(true)

    try {
      await login(username, password)

      setLoading(false)
      push('/')
    } catch (err) {
      setLoading(false)

      const { response } = err as AxiosError
      if (response === undefined) {
        setUsernameErr('Unknown server error!')
        return
      }

      if (response.status === 400) return setUsernameErr('Invalid username!')
      if (response.status === 401) return setPasswordErr('Incorrect password!')
      if (response.status === 404) return setUsernameErr('Username not found!')
    }
  }

  return (
    <div className='thin'>
      <Helmet>
        <title>BeatSaver - Login</title>
      </Helmet>

      <h1 className='has-text-centered is-size-3 has-text-weight-semibold'>
        Login
      </h1>
      <br />

      <IconInput
        label='Username'
        autoComplete='username'
        value={username}
        onChange={v => {
          setUsername(v)
          setUsernameErr(undefined)
          setPasswordErr(undefined)
        }}
        onSubmit={() => submit()}
        iconClass='fas fa-user'
        errorLabel={usernameErr}
      />

      <IconInput
        label='Password'
        autoComplete='current-password'
        value={password}
        type='password'
        onChange={v => {
          setPassword(v)
          setUsernameErr(undefined)
          setPasswordErr(undefined)
        }}
        onSubmit={() => submit()}
        iconClass='fas fa-lock'
        errorLabel={passwordErr}
      />

      <button
        className={`button is-fullwidth ${loading ? 'is-loading' : ''}`}
        disabled={loading || !username || !password}
        onClick={() => submit()}
      >
        Login
      </button>

      <Link
        className='button is-fullwidth'
        to='/auth/register'
        style={{ marginTop: '8px' }}
      >
        Don&#39;t have an account?
      </Link>
    </div>
  )
}

const mapDispatchToProps: IProps = {
  login: loginFn,
  push: pushFn,
}

const ConnectedLogin = connect(
  undefined,
  mapDispatchToProps
)(Login)

export { ConnectedLogin as Login }
