import * as React from 'react'
import { Link } from 'react-router-dom'

export interface HeaderMenuItemProps {
	text: string
	to: string
	children?: undefined
}

interface HeaderMenuItemState {}

export class HeaderMenuItem extends React.Component<
	HeaderMenuItemProps,
	HeaderMenuItemState
> {
	constructor(props: HeaderMenuItemProps) {
		super(props)
	}

	render() {
		return (
			<Link
				to={this.props.to}
				style={{
					display: 'inline-block',
					paddingRight: '0.5em',
				}}
			>
				{this.props.text}
			</Link>
		)
	}
}
