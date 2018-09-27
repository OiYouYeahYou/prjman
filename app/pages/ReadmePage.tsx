import * as React from 'react'
import { exists, readFile } from 'fs'
import ReactMarkdown = require('react-markdown')
import { OpenInEditor } from '../components/OpenInEditor'
import { join } from 'path'
import { getProject } from '../projects'
import { RouteComponentProps, Link } from 'react-router-dom'

export interface ReadmePageProps
	extends RouteComponentProps<{ projectid: string }> {}

interface ReadmeState {
	filename: string
	readmeString?: string
	error?: any
	isMissing?: boolean
	unmounted?: boolean
}

export class ReadmePage extends React.Component<ReadmePageProps, ReadmeState> {
	constructor(props: ReadmePageProps) {
		super(props)

		const project = getProject(this.props.match.params.projectid)
		this.state = {
			filename: join(project.path, 'README.md'),
		}
	}

	componentDidMount() {
		const { filename } = this.state

		exists(filename, exists => this.existenceHandler(exists))
	}

	existenceHandler(exists: boolean) {
		if (this.state.unmounted) {
			return
		} else if (!exists) {
			this.setState({ isMissing: true })
		} else {
			readFile(this.state.filename, (error, data) =>
				this.fileHandler(error, data)
			)
		}
	}

	fileHandler(error: any, data: Buffer) {
		if (this.state.unmounted) {
			return
		}

		this.setState({ error, readmeString: data.toString() })
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
				<OpenInEditor path={this.state.filename} />
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
		if (this.state.isMissing) {
			return this.renderIsMissing()
		} else if (this.state.error) {
			return this.renderError()
		} else if (typeof this.state.readmeString === 'string') {
			return this.renderReadme()
		} else {
			return this.renderLoading()
		}
	}

	renderIsMissing() {
		return `cannot find readme at: ${this.state.filename}`
	}

	renderError() {
		return `an error occured when reading readme: ${this.state.filename}`
	}

	renderLoading() {
		return `loading readme at: ${this.state.filename}`
	}

	renderReadme() {
		const { readmeString } = this.state

		if (readmeString) {
			return <i>readme is blank</i>
		}

		return <ReactMarkdown source={this.state.readmeString} skipHtml />
	}
}
