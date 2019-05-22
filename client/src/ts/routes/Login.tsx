import { push as pushFn } from 'connected-react-router'
import React, { FunctionComponent, useState } from 'react'
import { connect, MapStateToProps } from 'react-redux'
import { Input } from '../components/Input'
import { IState } from '../store'
import { login as loginFn } from '../store/user'

interface IProps {
  login: typeof loginFn
  push: typeof pushFn
}

const Login: FunctionComponent<IProps> = ({ login, push }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async () => {
    try {
      await login(username, password)
      push('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='thin'>
      <h1 className='has-text-centered is-size-3 has-text-weight-semibold'>
        Login
      </h1>
      <br />

      <Input
        placeholder='Username'
        value={username}
        onChange={v => setUsername(v)}
        iconClass='fas fa-user'
      />

      <Input
        placeholder='Password'
        value={password}
        type='password'
        onChange={v => setPassword(v)}
        iconClass='fas fa-lock'
      />

      <button className='button is-fullwidth' onClick={() => submit()}>
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
