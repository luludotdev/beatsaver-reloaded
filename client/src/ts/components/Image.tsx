import React, { FunctionComponent, useEffect } from 'react'
import { connect, MapStateToProps } from 'react-redux'
import { IState } from '../store'
import { LoadImage, loadImage as loadImageFn } from '../store/images'

import Placeholder from '../../images/placeholder.svg'

interface IPassedProps {
  src: string
  alt?: string
  draggable?: boolean
}

interface IConnectedProps {
  valid: boolean | undefined
}

interface IDispatchProps {
  loadImage: LoadImage
}

type IProps = IPassedProps & IConnectedProps & IDispatchProps

const Image: FunctionComponent<IProps> = ({
  src,
  alt,
  draggable,
  valid,
  loadImage,
}) => {
  useEffect(() => {
    if (valid === undefined) loadImage(src)
  }, [src])

  return <img src={valid ? src : Placeholder} alt={alt} draggable={draggable} />
}

const mapStateToProps: MapStateToProps<
  IConnectedProps,
  IPassedProps,
  IState
> = (state, props) => ({
  valid: state.images[props.src],
})

const mapDispatchToProps: IDispatchProps = {
  loadImage: loadImageFn,
}

const ConnectedImage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Image)
export { ConnectedImage as Image }
