import * as React from 'react'

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
		return (
			<div>
				<a onClick={() => this.toggleVisible()}>{this.props.name}</a>
				{' - '}
				<button onClick={() => alert('computer says no')}>
					Run Once
				</button>
				<button onClick={() => alert('computer says no')}>
					Run with Watcher
				</button>
				{this.state.isVisible ? (
					<div
						style={{
							padding: '10px',
							color: 'grey',
							fontSize: 'small',
						}}
					>
						{this.props.script}
					</div>
				) : (
					''
				)}
			</div>
		)
	}
}
