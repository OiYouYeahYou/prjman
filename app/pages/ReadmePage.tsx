import * as React from 'react'
import { exists, readFile } from '../utils/fsPath'
import ReactMarkdown = require('react-markdown')
import { OpenInEditor } from '../components/OpenInEditor'
import { join } from 'path'
import { Link } from 'react-router-dom'
import { PageContainerProps } from '../components/page-container'

export interface ReadmePageProps
	extends PageContainerProps<{ projectid: string }> {}

interface State<T extends States> {
	state: T
	unmounted?: boolean
	filename?: string
}

type states =
	| BlankState
	| NoProject
	| ReadmeReadState
	| NonexistantState
	| ProjectStroeStillLoadingState
	| LoadingReadmeState
	| ErroredState

interface BlankState extends State<States.BLANK> {}
interface NoProject extends State<States.NO_PROJECT_FOUND> {}
interface ReadmeReadState extends State<States.README_FOUND_AND_READ> {
	filename: string
	readmeString: string
}
interface NonexistantState extends State<States.NO_README_EXISTS> {
	filename: string
}
interface ProjectStroeStillLoadingState
	extends State<States.PROJECT_STORE_NOT_READY> {}
interface LoadingReadmeState extends State<States.LOADING_README> {
	filename: string
}
interface ErroredState extends State<States.ERRORED> {
	error: any
	filename: string
}

enum States {
	BLANK,
	NO_PROJECT_FOUND,
	README_FOUND_AND_READ,
	NO_README_EXISTS,
	PROJECT_STORE_NOT_READY,
	LOADING_README, // Readme exists, but not yet loaded
	ERRORED,
}

export class ReadmePage extends React.Component<ReadmePageProps, states> {
	readonly state: states = { state: States.BLANK }

	componentDidMount() {
		if (!this.props.projectStore.isReady) {
			this.setState({ state: States.PROJECT_STORE_NOT_READY })
			this.props.projectStore.once('ready', () => this.xxx())
		} else {
			this.xxx()
		}
	}

	async xxx() {
		const project = this.props.projectStore.getProject(
			this.props.match.params.projectid
		)

		if (!project) {
			this.setState({ state: States.NO_PROJECT_FOUND })
		}

		const filename = join(project.path, 'README.md')

		this.setState({
			state: States.LOADING_README,
			filename,
		})

		const doesExists = await exists(filename)

		if (this.state.unmounted) {
			return
		}

		if (!doesExists) {
			return this.setState({ state: States.NO_README_EXISTS })
		}

		return readFile(filename)
			.then(contents =>
				this.safeSet({
					state: States.README_FOUND_AND_READ,
					readmeString: contents.toString(),
					filename,
				})
			)
			.catch(error =>
				this.safeSet({
					state: States.ERRORED,
					error,
					filename,
				})
			)
	}

	safeSet(state: states) {
		if (!this.state.unmounted) {
			this.setState(state)
		}
	}

	componentWillUnmount() {
		this.setState({ unmounted: true })
	}

	render() {
		return (
			<>
				<Link to={`/project/${this.props.match.params.projectid}`}>
					Back to project
				</Link>

				{this.state.filename ? (
					<OpenInEditor path={this.state.filename} />
				) : null}

				<div
					style={{
						borderColor: 'black',
						borderWidth: '3px',
						padding: '3px',
					}}
				>
					{this.renderChooser()}
				</div>
			</>
		)
	}

	renderChooser() {
		switch (this.state.state) {
			case States.README_FOUND_AND_READ: {
				const { readmeString } = this.state

				if (!readmeString) {
					return <i>readme is blank</i>
				}

				return (
					<ReactMarkdown source={this.state.readmeString} skipHtml />
				)
			}

			case States.NO_README_EXISTS:
				return `cannot find readme at: ${this.state.filename}`

			case States.PROJECT_STORE_NOT_READY:
				return `Waiting for project data to load`

			case States.LOADING_README:
				return `loading readme at: ${this.state.filename}`

			case States.ERRORED:
				return `an error occured when reading readme: ${
					this.state.filename
				}`

			case States.BLANK:
				return `getting some things in order`

			case States.NO_PROJECT_FOUND:
				return `cannot find the project you are looking for`

			default: {
				// @ts-ignore
				const { state } = this.state

				throw new Error(
					`Unexpected Readme state ${state}: ${States[state]}`
				)
			}
		}
	}
}
