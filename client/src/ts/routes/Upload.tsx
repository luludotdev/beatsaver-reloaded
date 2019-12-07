import { AxiosError } from 'axios'
import clsx from 'clsx'
import {
  Push,
  push as pushFn,
  Replace,
  replace as replaceFn,
} from 'connected-react-router'
import ms from 'ms'
import React, { FunctionComponent, useRef, useState } from 'react'
import { connect, MapStateToProps } from 'react-redux'
import stringReplace from 'react-string-replace'
import { FileInput } from '../components/FileInput'
import { Input, TextareaInput } from '../components/Input'
import { IState } from '../store'
import { IUser } from '../store/user'
import { axios } from '../utils/axios'
import swal from '../utils/swal'

interface IPassedProps {
  user: IUser | null | undefined
}

interface IDispatchProps {
  push: Push
  replace: Replace
}

type IProps = IPassedProps & IDispatchProps
const Upload: FunctionComponent<IProps> = ({ user, push, replace }) => {
  if (user === null) {
    replace('/')
    return null
  } else if (user && user.verified === false) {
    return (
      <div className='thin'>
        <article className='message is-danger'>
          <div className='message-body'>
            <p>
              You must verify your account before you can upload beatmaps. Check
              your email for a verification URL.
            </p>

            <p>It might be in spam, check there too.</p>
          </div>
        </article>
      </div>
    )
  }

  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [titleErr, setTitleErr] = useState(undefined as string | undefined)

  const [file, setFile] = useState(null as File | null)
  const [fileErr, setFileErr] = useState(undefined as string | undefined)

  const [description, setDescription] = useState('')
  const commonProblems = useRef(null as HTMLDetailsElement | null)

  const submit = async () => {
    if (file === null) {
      setFileErr('You must upload a file!')
      return
    }

    const agreement = await swal.fire({
      confirmButtonText: 'Accept',
      html: <SwalContent />,
      icon: 'warning',
      reverseButtons: true,
      showCancelButton: true,
      title: 'Upload Agreement',
      width: '38em',
    })

    if (agreement.value !== true) {
      setFileErr('You must agree to the Upload Terms to upload this file!')
      return
    }

    const form = new FormData()
    form.set('name', title)
    form.set('description', description)
    form.set('beatmap', file)

    setLoading(true)
    try {
      const resp = await axios.post<IBeatmap>('/upload', form)

      setLoading(false)
      push(`/beatmap/${resp.data.key}`)
    } catch (err) {
      setLoading(false)
      const { response } = err as AxiosError<IFieldsError | IValidationError>
      if (response === undefined) {
        setFileErr('Something went wrong! Try again later.')
        return
      }

      if (response.status === 503) {
        setTitleErr('Uploads have been temporarily disabled. Try again later.')
        return
      }

      if (response.status === 403) {
        setTitleErr('You must verify your account to upload beatmaps!')
        return
      }

      if (response.status === 429) {
        const reset = response.headers['rate-limit-reset']
        const getTimeStr = () => {
          if (!reset) return 'a bit'

          const resetTime = new Date(parseInt(reset, 10) * 1000)
          const offset = resetTime.getTime() - Date.now()

          return ms(offset, { long: true })
        }

        setTitleErr(
          `You are uploading too quickly! Please wait ${getTimeStr()} and try again.`
        )

        return
      }

      const resp = response.data

      if (resp.identifier === 'ERR_SCHEMA_VALIDATION_FAILED') {
        swal.fire({
          html: <ValidationSwalContent {...resp} />,
          icon: 'error',
          showCancelButton: false,
          title: 'Invalid Beatmap',
          width: '45em',
        })

        return setFileErr('Beatmap is invalid!')
      } else if (
        resp.identifier === 'ERR_INVALID_FIELDS' &&
        resp.fields !== undefined
      ) {
        if (resp.fields.some(x => x.path === 'name')) {
          setTitleErr('Title is invalid!')
        } else {
          setFileErr(
            `Beatmap is invalid! Cause: ${resp.fields
              .map(x => x.path)
              .join(', ')}`
          )
          showProblems()
        }

        return
      }

      switch (resp.identifier as string) {
        case 'ERR_DUPLICATE_BEATMAP':
          return setFileErr('Beatmap already exists!')

        case 'ERR_BEATMAP_INFO_NOT_FOUND':
          setFileErr('Beatmap does not contain an info.dat file!')
          return showProblems()

        case 'ERR_BEATMAP_INFO_INVALID':
          setFileErr('Beatmap info.dat file is invalid!')
          return showProblems()

        case 'ERR_BEATMAP_COVER_NOT_FOUND':
          setFileErr('Beatmap cover image was not found!')
          return showProblems()

        case 'ERR_BEATMAP_COVER_INVALID':
          setFileErr('Beatmap cover image is invalid!')
          return showProblems()

        case 'ERR_BEATMAP_COVER_NOT_SQUARE':
          setFileErr('Beatmap cover image is not an exact square!')
          return showProblems()

        case 'ERR_BEATMAP_COVER_TOO_SMOL':
          setFileErr('Beatmap cover image must be at least 256x256px!')
          return showProblems()

        case 'ERR_BEATMAP_AUDIO_NOT_FOUND':
          setFileErr('Beatmap audio file was not found!')
          return showProblems()

        case 'ERR_BEATMAP_AUDIO_INVALID':
          setFileErr('Beatmap audio file is invalid!')
          return showProblems()

        case 'ERR_BEATMAP_DIFF_NOT_FOUND':
          setFileErr('One or more beatmap difficulty files cannot be found!')
          return showProblems()

        case 'ERR_BEATMAP_CONTAINS_ILLEGAL_FILE':
          setFileErr('Beatmap zip contains an illegal file!')
          return showProblems()

        case 'ERR_BEATMAP_CONTAINS_AUTOSAVES':
          setFileErr('Beatmap zip contains autosaves!')
          return showProblems()

        case 'ERR_BEATMAP_AUDIO_READ_FAILURE':
          return setFileErr('Beatmap audio could not be parsed!')

        case 'ERR_BEATMAP_PARSE_TIMEOUT':
          return setFileErr('Beatmap could not be parsed!')

        default:
          setFileErr('Something went wrong! Try again later.')
      }
    }
  }

  const showProblems = () => {
    if (commonProblems.current !== null) {
      commonProblems.current.open = true
    }
  }

  return (
    <div className='thin'>
      <h1 className='has-text-centered is-size-3 has-text-weight-light'>
        Upload Beatmap
      </h1>
      <br />

      <Input
        label='Beatmap Title'
        value={title}
        placeholder='255 character max'
        errorLabel={titleErr}
        maxLength={255}
        autoFocus={true}
        onChange={v => setTitle(v)}
      />

      <TextareaInput
        label='Beatmap Description'
        value={description}
        placeholder=''
        onChange={v => setDescription(v)}
        maxLength={10000}
      />

      <FileInput
        label='Beatmap ZIP'
        errorLabel={fileErr}
        file={file}
        accept='application/zip, .bsl'
        onChange={f => {
          setFileErr(undefined)
          setFile(f)
        }}
      />

      <details className='details' ref={commonProblems}>
        <summary>Common Problems</summary>

        <div className='content'>
          <ul style={{ marginTop: '4px' }}>
            <li>
              <b>Beatmap zip must use the new (2.0.0) format.</b>
            </li>
            <li>Beatmap zip must not be larger than 15MB</li>
            <li>Beatmap zip must contain all beatmap files at the root</li>
            <li>
              Do not include autosaves or any extra non-beatmap files in the zip
            </li>
          </ul>
        </div>
      </details>

      <button
        className={clsx('button', 'is-fullwidth', loading && 'is-loading')}
        disabled={loading}
        onClick={() => submit()}
      >
        Upload
      </button>
    </div>
  )
}

const SwalContent: FunctionComponent = () => (
  <div className='content'>
    <p>
      Please confirm that you have all the applicable rights to publish this
      beatmap, including but not limited to:
    </p>

    <ul style={{ textAlign: 'left' }}>
      <li>Music distribution rights</li>
      <li>Rights to the beatmap data (notes and lighting)</li>
      <li>
        Rights to publish any additional content included in the beatmap zip
      </li>
      <li>
        Permission to grant BeatSaver distribution rights to all files contained
        within the beatmap zip
      </li>
    </ul>

    <p>
      By clicking accept, you agree to grant BeatSaver rights to publish and
      distribute this beatmap and everything contained within the zip.
    </p>
  </div>
)

interface IValidationProps {
  filename: string
  path: string | null
  message: string
}

const ValidationSwalContent: FunctionComponent<IValidationProps> = ({
  filename,
  path,
  message,
}) => {
  const parsed = stringReplace(message, /`(.+)`/g, match => (
    <code>{match}</code>
  ))

  return (
    <div className='swal-validation-content'>
      <p>
        <b>
          Error in <code>{filename}</code>
        </b>
      </p>

      <p style={{ fontSize: '0.9em' }}>
        {path === null ? (
          <>Root {parsed}.</>
        ) : (
          <>
            Field <code>{path}</code> {parsed}.
          </>
        )}
      </p>
    </div>
  )
}

const mapStateToProps: MapStateToProps<IProps, {}, IState> = state => ({
  user: state.user.login,

  push: pushFn,
  replace: replaceFn,
})

const mapDispatchToProps: IDispatchProps = {
  push: pushFn,
  replace: replaceFn,
}

const ConnectedUpload = connect(mapStateToProps, mapDispatchToProps)(Upload)

export { ConnectedUpload as Upload }
