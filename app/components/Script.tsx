import * as React from 'react'
import { HiderItem } from './HiderItem'

interface IScriptProps {
	name: string
	script: string
}

interface IScriptState {
	isVisible: boolean
}

export class Script extends React.Component<IScriptProps, IScriptState> {
	constructor(props: IScriptProps) {
		super(props)

		this.state = {
			isVisible: false,
		}
	}

	toggleVisible() {
		this.setState({ ...this.state, isVisible: !this.state.isVisible })
	}

	render() {
		const link = (
			<a onClick={() => this.toggleVisible()}>{this.props.name}</a>
		)
		const buttons = (
			<>
				<button onClick={() => alert('computer says no')}>
					Run Once
				</button>
				<button onClick={() => alert('computer says no')}>
					Run with Watcher
				</button>
			</>
		)

		return (
			<HiderItem visible={link} hidden={buttons}>
				{this.state.isVisible ? (
					<div
						style={{
							color: 'grey',
							fontSize: 'small',
							padding: '10px',
						}}
					>
						{this.props.script}
					</div>
				) : (
					''
				)}
			</HiderItem>
		)
	}
}
