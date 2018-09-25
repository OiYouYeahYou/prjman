import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { resolve, Result } from 'npm-package-arg'

import { OpenInEditor } from './OpenInEditor'
import { Script } from './Script'
import { getProject, PackageJSON, IProject } from '../projects'

export interface ProjectProps
	extends RouteComponentProps<{ projectid: string }> {}

interface ProjectState {}

export default class Project extends React.Component<
	ProjectProps,
	ProjectState
> {
	get id() {
		return this.props.match.params.projectid
	}

	render() {
		const project = getProject(this.id)

		if (project) {
			return this.renderProject(project)
		} else {
			return this.renderNoProjectFound()
		}
	}

	renderNoProjectFound() {
		return (
			<div>
				<h3>Cannot find project </h3>
				No project by the id: {this.id}
			</div>
		)
	}

	renderProject(project: IProject) {
		const { pkg, path } = project
		const {
			name = this.id,
			description = <i>no description</i>,
			scripts = {},
		} = pkg || ({} as PackageJSON)

		return (
			<div>
				<h2>Name: {name}</h2>
				<OpenInEditor path={path}>Open in Editor</OpenInEditor>
				<Link to={`/readme/${this.id}`}>Readme</Link>
				<h2>Descrtipion:</h2>
				{description}
				{this.renderScripts(scripts)}
				{this.renderDependencies(project)}
			</div>
		)
	}

	renderScripts(scripts: { [name: string]: string }): JSX.Element | void {
		const scriptElements = Object.entries(scripts).map(([name, script]) => (
			<Script key={name} name={name} script={script} />
		))

		if (scriptElements.length) {
			return (
				<div>
					<h3>scripts</h3>
					{scriptElements}
				</div>
			)
		}
	}

	renderDependencies(project: IProject) {
		const prod = this.renderDeps(
			'prod',
			project.pkg && project.pkg.dependencies
		)
		const dev = this.renderDeps(
			'dev',
			project.pkg && project.pkg.devDependencies
		)
		const peer = this.renderDeps(
			'peer',
			// @ts-ignore
			project.pkg && project.pkg.peerDependencies
		)
		const opts = this.renderDeps(
			'opts',
			// @ts-ignore
			project.pkg && project.pkg.optionalDependencies
		)

		if (!prod && !dev && !peer && !opts) {
			return (
				<div>
					<i>no dependencies</i>
				</div>
			)
		}

		return (
			<div>
				<h3>Dependencies</h3>
				{prod}
				{dev}
				{peer}
				{opts}
			</div>
		)
	}

	renderDeps(
		title: string,
		dependencies: { [pkg: string]: string } | null | undefined
	) {
		if (!dependencies) {
			return
		}

		const deps = Object.entries(dependencies).map(([pkg, version]) =>
			this.renderDep(pkg, version)
		)

		return (
			<>
				<h4>{title}</h4>
				<ul>{deps}</ul>
			</>
		)
	}

	renderDep(pkg: string, version: string) {
		const result = resolve(pkg, version)
		const { name, rawSpec, type } = result

		return (
			<li
				// @ts-ignore bad typing
				key={name}
			>
				{rawSpec}: {name} - {type}
			</li>
		)
	}
}
