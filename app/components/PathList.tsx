import * as React from 'react'

import { HiderItem } from './HiderItem'
import { ReadablePath } from './ReadablePath'

import {
	normalise,
	convertToAbsolute,
	exists,
	isDirectory,
} from '../utils/fsPath'
import { EmittingSet } from '../structures/EmittingSet'

interface PathListProps {
	collections: EmittingSet<string>
}

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

	get collections() {
		return this.props.collections
	}

	readonly state: PathListState = {
		disabled: false,
		newPath: '',
	}

	pathsListener = () => this.forceUpdate()

	componentDidUpdate() {
		if (this.nameInput) {
			this.nameInput.focus()
		}
	}

	componentWillMount() {
		this.collections.on('change', this.pathsListener)
	}

	componentWillUnmount() {
		this.collections.removeListener('change', this.pathsListener)
	}

	async submitNewPath(event: React.FormEvent<HTMLFormElement>) {
		this.setState({ disabled: true })
		event.preventDefault()

		const path = normalise(this.state.newPath)

		if (!path) {
			this.setError(sumbitErrors.ERROR_BLANK)
		} else if (this.collections.has(path)) {
			this.setError(sumbitErrors.ERROR_ALREADY_COLLECTION)
		} else if (!(await exists(path))) {
			this.setError(sumbitErrors.ERROR_NO_EXISTS)
		} else if (!(await isDirectory(path))) {
			this.setError(sumbitErrors.ERROR_NOT_DIRECTORY)
		} else {
			this.setState({ newPath: '' })
			this.collections.add(path)
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
		return this.collections.map((path, i) => (
			<HiderItem
				key={path + '-' + i}
				visible={<ReadablePath path={path} />}
				hidden={
					<button onClick={() => this.collections.remove(path)}>
						remove
					</button>
				}
			/>
		))
	}
}
