import * as React from 'react'
import { Link } from 'react-router-dom'

import { OpenInEditor } from '../components/OpenInEditor'
import { Script } from '../components/Script'
import { DependenciesSection } from '../components/dependencies/Section'
import { PageSection } from '../components/PageSection'
import { PageContainerProps } from '../components/page-container'

import { Project } from '../structures/Project'

import { formatBytes } from '../utils/reabability'

export interface ProjectPageProps
	extends PageContainerProps<{ projectid: string }> {}

interface ProjectPageState {
	project?: Project
}

export class ProjectPage extends React.Component<
	ProjectPageProps,
	ProjectPageState
> {
	readonly state: ProjectPageState = {}
	updateFn = () => this.forceUpdate()

	componentWillMount() {
		const project = this.props.projectStore.getProject(this.id)

		if (project) {
			project.on('update', this.updateFn)
		}
		this.setState({ project })
	}

	componentWillUnmount() {
		if (this.state.project) {
			this.state.project.removeListener('update', this.updateFn)
		}
	}

	get id() {
		return this.props.match.params.projectid
	}

	render() {
		if (!this.props.projectStore.isReady) {
			this.props.projectStore.once('ready', () => this.forceUpdate())

			return this.renderWaitingToLoadProjects()
		}

		const { project } = this.state

		if (project) {
			return this.renderProject(project)
		} else {
			return this.renderNoProjectFound()
		}
	}

	renderWaitingToLoadProjects() {
		return <b>waiting to load projects</b>
	}

	renderNoProjectFound() {
		return (
			<div>
				<h3>Cannot find project </h3>
				No project by the id: {this.id}
			</div>
		)
	}

	renderProject(project: Project) {
		const {
			path,
			name,
			version,
			description = <i>no description</i>,
			scripts,
			size,
		} = project

		return (
			<div>
				<h2>
					Name: {name} <small>{version}</small>
				</h2>

				<OpenInEditor path={path}>Open in Editor</OpenInEditor>
				<Link to={`/readme/${this.id}`}>Readme</Link>

				<pre>
					{(
						(project.versioning &&
							project.versioning.dirtyWashing) ||
						[]
					).join('\n')}
				</pre>

				<div>
					<strong>Size: </strong> {formatBytes(size)}
				</div>

				<PageSection title="Description">{description}</PageSection>
				{this.renderScripts(scripts)}
				<DependenciesSection project={project} />
			</div>
		)
	}

	renderScripts(scripts: { [name: string]: string }): JSX.Element | void {
		const scriptElements = Object.entries(scripts)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([name, script]) => (
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
