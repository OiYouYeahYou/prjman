import * as React from 'react'

interface HiderItemProps {
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

	handleEvent = ({ type }: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		switch (type) {
			case 'mouseenter':
				this.setState({ visible: true })
			case 'mouseleave':
				this.setState({ visible: false })
			default:
				return console.warn(`No case for event type "${type}"`)
		}
	}

	render() {
		return (
			<li onMouseEnter={this.handleEvent} onMouseLeave={this.handleEvent}>
				{this.props.visible}{' '}
				{this.state.visible ? this.props.hidden : null}
				{this.props.children}
			</li>
		)
	}
}
