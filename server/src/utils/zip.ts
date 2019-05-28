import AdmZIP from 'adm-zip'

export function getDataPromise(
  entry: AdmZIP.IZipEntry,
  stringify?: false
): Promise<Buffer>
export function getDataPromise(
  entry: AdmZIP.IZipEntry,
  stringify: true
): Promise<string>
export function getDataPromise(
  entry: AdmZIP.IZipEntry,
  stringify?: boolean
): Promise<Buffer | string> {
  return new Promise(resolve =>
    entry.getDataAsync(data => {
      const body = stringify === true ? data.toString('utf8') : data
      return resolve(body)
    })
  )
}
