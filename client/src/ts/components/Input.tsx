import React, { FunctionComponent, KeyboardEvent } from 'react'

interface IProps {
  value: string
  type?: 'text' | 'password' | 'email' | 'tel'
  placeholder?: string
  autoFocus?: boolean
  disabled?: boolean
  readOnly?: boolean

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
  autoFocus,
  disabled,
  readOnly,

  size,
  style,
  rounded,

  onChange,
  onSubmit,
}) => {
  const sizeClass = size ? `is-${size}` : undefined
  const styleClass = style ? `is-${style}` : undefined
  const roundClass = rounded ? 'is-rounded' : undefined

  const classes = ['input', sizeClass, styleClass, roundClass]
    .filter(x => x !== undefined)
    .join(' ')

  return (
    <input
      type={type || 'text'}
      className={classes}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      autoFocus={autoFocus}
      disabled={disabled}
      readOnly={readOnly}
      onKeyPress={e => {
        if (e.key === 'Enter' && typeof onSubmit === 'function') {
          onSubmit()
        }
      }}
    />
  )
}

interface ILabelProps {
  label?: string
  errorLabel?: string
}

const RawLabel: FunctionComponent<ILabelProps> = ({ label, errorLabel }) =>
  label === undefined && errorLabel === undefined ? null : (
    <label
      className={`label ${errorLabel ? 'has-text-danger' : ''}`}
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
