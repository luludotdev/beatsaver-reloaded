import { AxiosError } from 'axios'
import { push as pushFn } from 'connected-react-router'
import React, { FunctionComponent, useState } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { IconInput } from '../components/Input'
import { Register, register as registerFn } from '../store/user'

interface IProps {
  register: Register
  push: typeof pushFn
}

const Register: FunctionComponent<IProps> = ({ register, push }) => {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [usernameErr, setUsernameErr] = useState(undefined as
    | string
    | undefined)

  const [emailErr, setEmailErr] = useState(undefined as string | undefined)

  const [passwordErr, setPasswordErr] = useState(undefined as
    | string
    | undefined)

  const submit = async () => {
    setLoading(true)

    try {
      await register(username, email, password)

      setLoading(false)
      push('/')
    } catch (err) {
      setLoading(false)

      const { response } = err as AxiosError
      if (response === undefined) {
        setUsernameErr('Unknown server error!')
        return
      }

      if (response.status === 422) {
        return setUsernameErr('Username or email already exists!')
      } else if (
        response.status === 400 &&
        response.data.identifier === 'ERR_INVALID_FIELDS'
      ) {
        for (const field of response.data.fields) {
          if (field.path === 'email') setEmailErr('Invalid email address!')
        }

        return
      }
    }
  }

  return (
    <div className='thin'>
      <Helmet>
        <title>BeatSaver - Register</title>
      </Helmet>

      <h1 className='has-text-centered is-size-3 has-text-weight-semibold'>
        Register
      </h1>
      <br />

      <IconInput
        label='Username'
        autoComplete='username'
        value={username}
        onChange={v => {
          setUsername(v)
          setUsernameErr(undefined)
          setEmailErr(undefined)
          setPasswordErr(undefined)
        }}
        onSubmit={() => submit()}
        iconClass='fas fa-user'
        errorLabel={usernameErr}
      />

      <IconInput
        label='Email'
        value={email}
        type='email'
        onChange={v => {
          setEmail(v)
          setUsernameErr(undefined)
          setEmailErr(undefined)
          setPasswordErr(undefined)
        }}
        onSubmit={() => submit()}
        iconClass='fas fa-user'
        errorLabel={emailErr}
      />

      <IconInput
        label='Password'
        autoComplete='new-password'
        value={password}
        type='password'
        onChange={v => {
          setPassword(v)
          setUsernameErr(undefined)
          setEmailErr(undefined)
          setPasswordErr(undefined)
        }}
        onSubmit={() => submit()}
        iconClass='fas fa-lock'
        errorLabel={passwordErr}
      />

      <button
        className={`button is-fullwidth ${loading ? 'is-loading' : ''}`}
        disabled={loading || !username || !email || !password}
        onClick={() => submit()}
      >
        Register
      </button>

      <Link
        className='button is-fullwidth'
        to='/auth/login'
        style={{ marginTop: '8px' }}
      >
        Already have an account?
      </Link>
    </div>
  )
}

const mapDispatchToProps: IProps = {
  push: pushFn,
  register: registerFn,
}

const ConnectedRegister = connect(
  undefined,
  mapDispatchToProps
)(Register)

export { ConnectedRegister as Register }
