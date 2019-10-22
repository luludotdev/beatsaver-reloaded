import { ErrorObject, ValidateFunction } from 'ajv'

export class SchemaValidationError extends Error {
  public readonly filename: string
  public readonly path: string
  public readonly validationError: ErrorObject

  constructor(filename: string, error: ErrorObject, message: string) {
    super(message)

    this.name = 'SchemaValidationError'
    this.filename = filename
    this.path = error.dataPath
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
    default:
      parseDefaultError(filename, error)
  }
}

type ParseError = (filename: string, error: ErrorObject) => void
const parseDefaultError: ParseError = (filename, error) => {
  throw new SchemaValidationError(
    filename,
    error,
    error.message || 'Unknown validation error.'
  )
}
