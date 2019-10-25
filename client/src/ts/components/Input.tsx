import clsx from 'clsx'
import React, { FunctionComponent, KeyboardEvent } from 'react'

interface IProps {
  value: string
  type?: 'text' | 'password' | 'email' | 'tel'
  placeholder?: string
  maxLength?: number
  autoFocus?: boolean
  disabled?: boolean
  readOnly?: boolean
  autoComplete?: 'on' | 'off' | 'username' | 'current-password' | 'new-password'
  autoCapitalize?: 'on' | 'off'

  label?: string
  errorLabel?: string

  size?: 'small' | 'normal' | 'medium' | 'large'
  style?: 'primary' | 'info' | 'success' | 'warning' | 'danger'
  rounded?: boolean

  onChange: (value: string) => any
  onSubmit?: (e?: KeyboardEvent<HTMLInputElement>) => any
}

const RawInput: FunctionComponent<IProps> = ({
  type,
  value,
  placeholder,
  maxLength,
  autoFocus,
  disabled,
  readOnly,
  autoComplete,
  autoCapitalize,

  size,
  style,
  rounded,

  onChange,
  onSubmit,
}) => (
  <input
    type={type || 'text'}
    className={clsx(
      'input',
      size && `is-${size}`,
      style && `is-${style}`,
      rounded && `is-rounded`
    )}
    value={value}
    placeholder={placeholder}
    onChange={e => {
      if (typeof onChange !== 'function') return false
      if (maxLength && e.target.value.length > maxLength) return false

      return onChange(e.target.value)
    }}
    autoFocus={autoFocus}
    disabled={disabled}
    readOnly={readOnly}
    autoComplete={autoComplete}
    autoCapitalize={autoCapitalize}
    onKeyPress={e => {
      if (e.key === 'Enter' && typeof onSubmit === 'function') {
        onSubmit()
      }
    }}
  />
)

interface ILabelProps {
  label?: string
  errorLabel?: string
}

const RawLabel: FunctionComponent<ILabelProps> = ({ label, errorLabel }) =>
  label === undefined && errorLabel === undefined ? null : (
    <label
      className={clsx('label', errorLabel && 'has-text-danger')}
      data-error={errorLabel ? `${label ? ' - ' : ''}${errorLabel}` : null}
    >
      {label}
    </label>
  )

export const Input: FunctionComponent<IProps> = props => (
  <div className='field'>
    <RawLabel {...props} />

    <div className='control'>
      <RawInput {...props} />
    </div>
  </div>
)

interface IIconProps {
  iconClass: string
}

export const IconInput: FunctionComponent<IProps & IIconProps> = props => (
  <div className='field'>
    <RawLabel {...props} />

    <div className='control has-icons-left'>
      <RawInput {...props} />

      <span className='icon is-small is-left'>
        <i className={props.iconClass} />
      </span>
    </div>
  </div>
)

interface ITextareaProps extends Omit<IProps, 'rounded'> {
  rows?: number
  maxLength?: number
  fixed?: boolean
}

export const TextareaInput: FunctionComponent<ITextareaProps> = props => (
  <div className='field'>
    <RawLabel {...props} />

    <textarea
      className={clsx(
        'textarea',
        props.size && `is-${props.size}`,
        props.style && `is-${props.style}`,
        props.fixed && 'has-fixed-size'
      )}
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
      autoFocus={props.autoFocus}
      disabled={props.disabled}
      readOnly={props.readOnly}
      autoComplete={props.autoComplete}
      autoCapitalize={props.autoCapitalize}
      rows={props.rows}
      maxLength={props.maxLength}
      onKeyPress={e => {
        if (e.key === 'Enter' && typeof props.onSubmit === 'function') {
          props.onSubmit()
        }
      }}
    />
  </div>
)
