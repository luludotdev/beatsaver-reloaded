import React, { FunctionComponent } from 'react'

interface IProps {
  value: string
  type?: 'text' | 'password' | 'email'
  placeholder?: string
  autoFocus?: boolean
  iconClass: string

  onChange: (value: string) => any
}

export const Input: FunctionComponent<IProps> = ({
  value,
  type,
  placeholder,
  autoFocus,
  iconClass,
  onChange,
}) => (
  <div className='field'>
    <div className='control has-icons-left'>
      <input
        type={type || 'text'}
        className='input'
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
      />

      <span className='icon is-small is-left'>
        <i className={iconClass} />
      </span>
    </div>
  </div>
)
