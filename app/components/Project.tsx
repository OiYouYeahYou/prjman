import * as React from 'react'
import { Script } from './Script'

let pkg = require('../../package.json')

export interface ProjectProps {
	projectid: string
}

interface ProjectState {}

export default class Project extends React.Component<
	ProjectProps,
	ProjectState
> {
	constructor(props: ProjectProps) {
		super(props)

		this.state = {}
	}

	render() {
		const scripts = Object.keys(pkg.scripts).map(name => (
			<Script key={name} name={name} script={pkg.scripts[name]} />
		))

		return (
			<div>
				<h2>Name: {pkg.name}</h2>
				<h2>Descrtipion:</h2>
				{pkg.description}
				<h3>scripts</h3>
				{scripts}
			</div>
		)
	}
}
