import { AxiosError } from 'axios'
import { push as pushFn } from 'connected-react-router'
import React, { FunctionComponent, useState } from 'react'
import { connect, MapStateToProps } from 'react-redux'
import { IconInput } from '../components/Input'
import { IState } from '../store'
import { Login, login as loginFn } from '../store/user'

interface IProps {
  login: Login
  push: typeof pushFn
}

const Login: FunctionComponent<IProps> = ({ login, push }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [usernameErr, setUsernameErr] = useState(undefined as
    | string
    | undefined)

  const [passwordErr, setPasswordErr] = useState(undefined as
    | string
    | undefined)

  const submit = async () => {
    try {
      await login(username, password)
      push('/')
    } catch (err) {
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
      <h1 className='has-text-centered is-size-3 has-text-weight-semibold'>
        Login
      </h1>
      <br />

      <IconInput
        label='Username'
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
        className='button is-fullwidth'
        disabled={!username || !password}
        onClick={() => submit()}
      >
        Login
      </button>
    </div>
  )
}

const mapStateToProps: MapStateToProps<IProps, {}, IState> = () => ({
  login: loginFn,
  push: pushFn,
})

const ConnectedLogin = connect(
  mapStateToProps,
  {
    login: loginFn,
    push: pushFn,
  }
)(Login)

export default ConnectedLogin
