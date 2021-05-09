import React, { FunctionComponent } from 'react'

interface IStatTextProps {
  type: 'text'
  text: string
  emoji: string
}

interface IStatNumberProps {
  type: 'num'
  number: number
  emoji: string

  fixed?: number
  percentage?: boolean
}

interface IStatCommonProps {
  hover?: string
}

type IStatProps = (IStatTextProps | IStatNumberProps) & IStatCommonProps

export const Statistic: FunctionComponent<IStatProps> = props => {
  if (props.type === 'num') {
    const { number: n, emoji, fixed, percentage, hover } = props

    const multiplied = percentage !== undefined ? n * 100 : n
    const num =
      fixed !== undefined
        ? multiplied.toLocaleString(undefined, { maximumFractionDigits: 1 })
        : multiplied.toLocaleString()

    return (
      <li className='mono' title={hover}>
        <span className='text'>{num}{percentage !== undefined ? '%' : ''}</span>
        <span className='emoji'>{emoji}</span>
      </li>
    )
  } else if (props.type === 'text') {
    const { text, emoji, hover } = props

    return (
      <li className='mono' title={hover}>
        <span className='text'>{text}</span><span className='emoji'>{emoji}</span>
      </li>
    )
  }

  return null
}
