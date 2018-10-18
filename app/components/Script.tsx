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
	readonly state: IScriptState = {
		isVisible: false,
	}

	toggleVisible() {
		this.setState({ ...this.state, isVisible: !this.state.isVisible })
	}

	render() {
		const link = (
			<a onClick={() => this.toggleVisible()}>{this.props.name}</a>
		)
		const buttons = [
			<button key="run-once" onClick={() => alert('computer says no')}>
				Run Once
			</button>,
			<button key="run-watcher" onClick={() => alert('computer says no')}>
				Run with Watcher
			</button>,
		]

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
