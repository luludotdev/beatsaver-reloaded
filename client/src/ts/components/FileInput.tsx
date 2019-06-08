import React, { ChangeEvent, FunctionComponent } from 'react'

interface IProps {
  label: string
  errorLabel?: string
  file: File | null
  accept?: string

  onChange: (e: File | null) => any
}

export const FileInput: FunctionComponent<IProps> = ({
  label,
  errorLabel,
  file,
  accept,
  onChange,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (typeof onChange !== 'function') return
    if (e.target.files === null || e.target.files[0] === undefined) {
      onChange(null)
      return
    }

    onChange(e.target.files[0])
  }

  return (
    <div className='field'>
      <label
        className={`label ${errorLabel ? 'has-text-danger' : ''}`}
        data-error={errorLabel ? `${label ? ' - ' : ''}${errorLabel}` : null}
      >
        {label}
      </label>

      <div className='file has-name is-fullwidth'>
        <label className='file-label'>
          <input
            className='file-input'
            type='file'
            accept={accept}
            onChange={e => handleChange(e)}
          />

          <span className='file-cta'>
            <span className='file-icon'>
              <i className='fas fa-upload' />
            </span>

            <span className='file-label'>Choose a file...</span>
          </span>

          <span className='file-name'>
            {(file && file.name) || 'No file selected.'}
          </span>
        </label>
      </div>
    </div>
  )
}
