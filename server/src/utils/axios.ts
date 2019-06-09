import Axios from 'axios'
import readPkg from 'read-pkg-up'

const pkg = readPkg.sync()
const version = (pkg && pkg.package.version) || 'unknown'
const userAgent = `beatsaver-reloaded/${version}`

const axios = Axios.create({
  headers: {
    'User-Agent': userAgent,
  },
})

export default axios
