import * as React from 'react'

export interface HiderItemProps {
	visible: any
	hidden: any
	children?: any
}

interface HiderItemState {
	visible: boolean
}

export class HiderItem extends React.Component<HiderItemProps, HiderItemState> {
	readonly state: HiderItemState = {
		visible: false,
	}

	mouseIn() {
		this.setState({ visible: true })
	}

	mouseOut() {
		this.setState({ visible: false })
	}

	render() {
		return (
			<li
				onMouseEnter={() => this.mouseIn()}
				onMouseLeave={() => this.mouseOut()}
			>
				{this.props.visible}{' '}
				{this.state.visible ? this.props.hidden : null}
				{this.props.children}
			</li>
		)
	}
}
