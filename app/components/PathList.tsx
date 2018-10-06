import * as React from 'react'
import { HiderItem } from './HiderItem'

export interface PathListProps {}

interface PathListState {
	paths: string[]
	newPath: string
}

export class PathList extends React.Component<PathListProps, PathListState> {
	nameInput: HTMLInputElement | null

	constructor(props: PathListProps) {
		super(props)

		this.state = {
			newPath: '',
			paths: ['~/code/'],
		}
	}

	componentDidUpdate() {
		if (this.nameInput) {
			this.nameInput.focus()
		}
	}

	submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const path = this.state.newPath

		if (this.state.paths.indexOf(path) !== -1) {
			return
		}

		if (!isValidPath(path)) {
			return
		}

		this.setState({
			newPath: '',
			paths: this.state.paths.concat(path).sort(),
		})
	}

	change({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			newPath: value,
		})
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
				<form onSubmit={event => this.submit(event)}>
					<input
						ref={input => (this.nameInput = input)}
						type="text"
						onChange={event => this.change(event)}
						value={this.state.newPath}
					/>
					<button>Add</button>
				</form>
			</li>
		)
	}

	renderPaths() {
		return this.state.paths.map((path, i) => (
			<HiderItem
				key={path + '-' + i}
				visible={path}
				hidden={<button type="submit">remove</button>}
			/>
		))
	}
}

const isValidPath = (path: string) => true
