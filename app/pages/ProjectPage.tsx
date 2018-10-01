import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import { OpenInEditor } from '../components/OpenInEditor'
import { Script } from '../components/Script'
import { getProject, PackageJSON, IProject } from '../projects'
import { DependenciesSection } from '../components/dependencies/Section'
import { PageSection } from '../components/PageSection'

export interface ProjectPageProps
	extends RouteComponentProps<{ projectid: string }> {}

interface ProjectPageState {}

export class ProjectPage extends React.Component<
	ProjectPageProps,
	ProjectPageState
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

				<PageSection title="Description">{description}</PageSection>
				{this.renderScripts(scripts)}
				<DependenciesSection project={project} />
			</div>
		)
	}

	renderScripts(scripts: { [name: string]: string }): JSX.Element | void {
		const scriptElements = Object.entries(scripts).map(([name, script]) => (
			<Script key={name} name={name} script={script} />
		))

		if (scriptElements.length) {
			return (
				<PageSection title="Scripts">
					<small>
						<ul>{scriptElements}</ul>
					</small>
				</PageSection>
			)
		}
	}
}
