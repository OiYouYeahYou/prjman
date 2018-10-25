import * as React from 'react'
import { Project } from '../structures/Project'
import {
	combinedNameSpecStringListParser,
	CombinedNameSpecParserResult,
} from '../utils/npm'

interface ProjectDependencyInstallerProps {
	project: Project
}

interface ProjectDependencyInstallerState {
	value: string
	type: string
	resolution: string
}

const selectOptions = [
	{
		display: 'Production',
		isDefault: true,
		value: 'dependencies',
	},
	{
		display: 'Development',
		value: 'devDependencies',
	},
	{
		display: 'Peer',
		value: 'peerDependencies',
	},
	{
		display: 'Optional',
		value: 'optionalDependencies',
	},
]

export default class ProjectDependencyInstaller extends React.Component<
	ProjectDependencyInstallerProps,
	ProjectDependencyInstallerState
> {
	readonly state: ProjectDependencyInstallerState = {
		resolution: 'nothing to see',
		type: 'bitbucket',
		value: '',
	}

	updateFn = () => this.forceUpdate()

	componentWillMount() {
		this.props.project.on('update', this.updateFn)
	}

	componentWillUnmount() {
		this.props.project.removeListener('update', this.updateFn)
	}

	handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			value: event.target.value,
		})
	}

	handleSelectChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			type: event.target.value,
		})
	}

	handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		const { value } = this.state

		alert('pretending to get: ' + value)

		this.setState({
			value: '',
		})
		event.preventDefault()
	}

	splitter(value = this.state.value) {
		return combinedNameSpecStringListParser(value).filter(
			Boolean
		) as CombinedNameSpecParserResult[]
	}

	render() {
		return (
			<form onSubmit={event => this.handleSubmit(event)}>
				<div>
					<input
						type={'text'}
						value={this.state.value}
						style={{ width: '24em' }}
						onChange={event => this.handleInputChange(event)}
					/>

					<button type="submit">Install</button>
				</div>

				<div style={{ fontSize: 'small' }}>{this.renderOptions()}</div>
			</form>
		)
	}

	renderOptions() {
		return selectOptions.map(({ value, display, isDefault }) => (
			<label key={value} style={this.typeSelectorStyle(value)}>
				<input
					type="radio"
					name="dependency-install-type"
					value={value}
					onChange={event => this.handleSelectChange(event)}
					checked={isDefault || false}
				/>
				{' ' + display + ' '}
			</label>
		))
	}

	typeSelectorStyle(value: string): React.CSSProperties {
		return this.state.type === value
			? {
					fontWeight: 'bold',
			  }
			: {}
	}
}
