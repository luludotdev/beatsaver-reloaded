import { AdditionalPropertiesParams, ErrorObject, ValidateFunction } from 'ajv'

export class SchemaValidationError extends Error {
  public readonly filename: string
  public readonly path: string | null
  public readonly validationError: ErrorObject

  constructor(filename: string, error: ErrorObject, message: string) {
    super(message)

    this.name = 'SchemaValidationError'
    this.filename = filename
    this.path = error.dataPath === '' ? null : error.dataPath
    this.validationError = error
  }
}

export const parseValidationError = (
  filename: string,
  errors: ValidateFunction['errors']
) => {
  if (errors === null) return
  if (errors === undefined) return

  const [error] = errors
  switch (error.keyword) {
    case 'pattern':
      parsePattern(filename, error)
    case 'additionalProperties':
      parseAdditionalProps(filename, error)
    default:
      parseDefaultError(filename, error)
  }
}

type ParseError = (filename: string, error: ErrorObject) => void
const parseDefaultError: ParseError = (filename, error) => {
  throw new SchemaValidationError(
    filename,
    error,
    error.message || 'has an unknown validation error'
  )
}

const parsePattern: ParseError = (filename, error) => {
  if (error.message === undefined) {
    throw new SchemaValidationError(filename, error, 'is invalid')
  }

  // Version Validation
  if (error.message.includes('^(0|[2-9]\\d*)')) {
    throw new SchemaValidationError(filename, error, 'is invalid')
  }

  if (error.message.includes('^(.+)$')) {
    throw new SchemaValidationError(filename, error, 'cannot be blank')
  }

  // File Regex
  if (error.message.includes('com[1-9]')) {
    throw new SchemaValidationError(
      filename,
      error,
      'contains an invalid filename'
    )
  }

  parseDefaultError(filename, error)
}

const parseAdditionalProps: ParseError = (filename, error) => {
  const params = error.params as AdditionalPropertiesParams
  const property = params.additionalProperty

  throw new SchemaValidationError(
    filename,
    error,
    `should NOT have additional property: \`${property}\``
  )
}
