import { replace as replaceFn } from 'connected-react-router'
import { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

interface IProps {
  replace: typeof replaceFn
}

interface IParams {
  key: string
}

const Legacy: FunctionComponent<IProps & RouteComponentProps<IParams>> = ({
  match,
  replace,
}) => {
  try {
    const [, oldKey] = match.params.key.split('-')
    const newKey = parseInt(oldKey, 10).toString(16)

    replace(`/beatmap/${newKey}`)
  } catch (err) {
    replace('/')
  }

  return null
}

const ConnectedLegacy = connect(
  null,
  {
    replace: replaceFn,
  }
)(Legacy)
export default ConnectedLegacy
