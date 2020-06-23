import React, { FunctionComponent } from 'react'
import { connect, MapStateToProps } from 'react-redux'
import { IState } from '../../store'
import {
  ToggleShowAutos,
  toggleShowAutos as toggleShowAutosFn,
} from '../../store/prefs'
import { canUseDom } from '../../utils/dom'
import { IBeatmapSearch } from './BeatmapAPI'
import { BeatmapAPI } from './BeatmapAPI'
import { BeatmapScroller } from './BeatmapScroller'

interface IMappedProps {
  showAutos: boolean
}

interface IDispatchProps {
  toggleShowAutos: ToggleShowAutos
}

type IProps = IBeatmapSearch & IMappedProps & IDispatchProps

const BeatmapList: FunctionComponent<IProps> = props => {
  const { showAutos, toggleShowAutos } = props

  const isFirefox = canUseDom()
    ? navigator.userAgent.toLowerCase().includes('firefox')
    : false

  return (
    <div>
      <div className='box automapper'>
        <label className='checkbox'>
          <input
            type='checkbox'
            checked={props.showAutos}
            onChange={() => toggleShowAutos()}
          />
          &nbsp;Show auto-generated Beatmaps
        </label>
      </div>

      <BeatmapAPI
        {...props}
        render={api => (
          <BeatmapScroller {...api} showAutos={showAutos} finite={isFirefox} />
        )}
      />
    </div>
  )
}

const mapStateToProps: MapStateToProps<IMappedProps, {}, IState> = state => ({
  showAutos: state.prefs.showAutos,
})

const mapDispatchToProps: IDispatchProps = {
  toggleShowAutos: toggleShowAutosFn,
}

const ConnectedBeatmapList = connect(
  mapStateToProps,
  mapDispatchToProps
)(BeatmapList)

export { ConnectedBeatmapList as BeatmapList }
