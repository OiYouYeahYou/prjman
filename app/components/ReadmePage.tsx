import * as React from 'react'
import { exists, readFile } from 'fs'
import ReactMarkdown = require('react-markdown')
import { OpenInEditor } from './OpenInEditor'
import { join } from 'path'
import { getProject } from '../projects'
import { RouteComponentProps } from 'react-router-dom'

export interface ReadmeProps
	extends RouteComponentProps<{ projectid: string }> {}

interface ReadmeState {
	filename: string
	readmeString?: string
	error?: any
	isMissing?: boolean
	unmounted?: boolean
}

export class Readme extends React.Component<ReadmeProps, ReadmeState> {
	constructor(props: ReadmeProps) {
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
				<OpenInEditor path={this.state.filename} />
				<div
					style={{
						borderColor: 'black',
						borderWidth: '3px',
						padding: '3px',
					}}
				>
					{this.renderX()}
				</div>
			</>
		)
	}

	renderX() {
		if (this.state.isMissing) {
			return this.renderIsMissing()
		} else if (this.state.error) {
			return this.renderError()
		} else if (this.state.readmeString) {
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
		return <ReactMarkdown source={this.state.readmeString} />
	}
}
