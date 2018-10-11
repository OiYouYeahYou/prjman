import * as React from 'react'
import { HiderItem } from './HiderItem'
import { settings } from '../settings'
import { ReadablePath } from './ReadablePath'
import {
	normalise,
	convertToAbsolute,
	exists,
	isDirectory,
} from '../utils/fsPath'

const { paths } = settings

export interface PathListProps {}

interface PathListState {
	newPath: string
	disabled: boolean
	error?: string
	pathsListener?: () => void
}

enum sumbitErrors {
	ERROR_BLANK = 'path is blank',
	ERROR_ALREADY_COLLECTION = 'already exists',
	ERROR_NO_EXISTS = 'does not exist',
	ERROR_NOT_DIRECTORY = 'is not directory',
}

export class PathList extends React.Component<PathListProps, PathListState> {
	nameInput: HTMLInputElement | null
	timer: any

	constructor(props: PathListProps) {
		super(props)

		this.state = {
			disabled: false,
			newPath: '',
		}
	}

	componentDidUpdate() {
		if (this.nameInput) {
			this.nameInput.focus()
		}
	}

	componentWillMount() {
		const pathsListener = () => this.forceUpdate()

		paths.on('change', pathsListener)
		this.setState({ pathsListener })
	}

	componentWillUnmount() {
		if (this.state.pathsListener) {
			paths.removeListener('change', this.state.pathsListener)
			this.setState({ pathsListener: undefined })
		}
	}

	async submitNewPath(event: React.FormEvent<HTMLFormElement>) {
		this.setState({ disabled: true })
		event.preventDefault()

		const path = normalise(this.state.newPath)

		if (!path) {
			this.setError(sumbitErrors.ERROR_BLANK)
		} else if (paths.has(path)) {
			this.setError(sumbitErrors.ERROR_ALREADY_COLLECTION)
		} else if (!(await exists(path))) {
			this.setError(sumbitErrors.ERROR_NO_EXISTS)
		} else if (!(await isDirectory(path))) {
			this.setError(sumbitErrors.ERROR_NOT_DIRECTORY)
		} else {
			this.setState({ newPath: '' })
			paths.add(path)
		}

		this.setState({ disabled: false })
	}

	setError(error: string) {
		clearTimeout(this.timer)
		this.setState({ error })
		this.timer = setTimeout(
			() => this.setState({ error: undefined }),
			10 * 1000
		)
	}

	inputChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ newPath: convertToAbsolute(event.target.value) })
	}

	render() {
		return (
			<ul>
				{this.renderAdderItem()}
				{this.renderPaths()}
			</ul>
		)
	}

	renderAdderItem() {
		return (
			<li>
				<form onSubmit={event => this.submitNewPath(event)}>
					<input
						ref={input => (this.nameInput = input)}
						type="text"
						onChange={event => this.inputChange(event)}
						value={this.state.newPath}
						disabled={this.state.disabled}
					/>
					<button type="submit" disabled={this.state.disabled}>
						Add
					</button>
					{this.state.error ? <div>{this.state.error}</div> : ''}
				</form>
			</li>
		)
	}

	renderPaths() {
		return paths.map((path, i) => (
			<HiderItem
				key={path + '-' + i}
				visible={<ReadablePath path={path} />}
				hidden={
					<button onClick={() => paths.remove(path)}>remove</button>
				}
			/>
		))
	}
}
