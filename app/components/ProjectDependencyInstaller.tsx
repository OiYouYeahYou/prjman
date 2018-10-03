import * as React from 'react'
import { Project } from '../structures/Project'

const validatePackageName: (
	input: string
) => {
	validForNewPackages: boolean
	validForOldPackages: boolean
	warnings: string[]
	errors: string[]
	// tslint:disable-next-line:no-var-requires
} = require('validate-npm-package-name')

interface ProjectDependencyInstallerProps {
	project: Project
}

interface ProjectDependencyInstallerState {
	value: string
	type: string
	resolution: string
	validity: boolean
}

const selectOptions = [
	{
		display: 'Production',
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
	constructor(props: ProjectDependencyInstallerProps) {
		super(props)

		this.state = {
			resolution: 'nothing to see',
			type: 'bitbucket',
			validity: false,
			value: '',
		}
	}

	handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const validity = validatePackageName(event.target.value)

		console.log(validity)

		this.setState({
			validity:
				validity.validForNewPackages || validity.validForOldPackages,
			value: event.target.value,
		})
	}

	handleSelectChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ type: event.target.value })
	}

	handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		const { value } = this.state

		alert('pretending to get: ' + value)

		this.setState({ value: '' })
		event.preventDefault()
	}

	render() {
		return (
			<form onSubmit={event => this.handleSubmit(event)}>
				<div>
					<input
						type={'text'}
						value={this.state.value}
						onChange={event => this.handleInputChange(event)}
					/>

					<button type="submit" disabled={!this.state.validity}>
						Install
					</button>
				</div>

				<div style={{ fontSize: 'small' }}>{this.renderOptions()}</div>
			</form>
		)
	}

	renderOptions() {
		return selectOptions.map(({ value, display }) => (
			<label key={value} style={this.typeSelectorStyle(value)}>
				<input
					type="radio"
					name="dependency-install-type"
					value={value}
					onChange={event => this.handleSelectChange(event)}
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
