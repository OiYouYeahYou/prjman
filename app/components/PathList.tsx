import * as React from 'react'
import { HiderItem } from './HiderItem'
import { settings } from '../settings'

const { paths } = settings

export interface PathListProps {}

interface PathListState {
	newPath: string
	pathsListener?: () => void
}

export class PathList extends React.Component<PathListProps, PathListState> {
	nameInput: HTMLInputElement | null

	constructor(props: PathListProps) {
		super(props)

		this.state = {
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

	submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const path = this.state.newPath

		if (paths.has(path)) {
			return
		}

		if (!isValidPath(path)) {
			return
		}

		this.setState({ newPath: '' })
		paths.add(path)
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
		return paths.map((path, i) => (
			<HiderItem
				key={path + '-' + i}
				visible={path}
				hidden={<button type="submit">remove</button>}
			/>
		))
	}
}

const isValidPath = (path: string) => true
