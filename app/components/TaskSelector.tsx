import * as React from 'react'
import { Link } from 'react-router-dom'

import { Select } from './Select'

import { Task, TaskManager } from '../structures/TaskManager'

export interface TaskSelectorProps {
	tasks: TaskManager
}

interface TaskSelectorState {
	task: string
}

export class TaskSelector extends React.Component<
	TaskSelectorProps,
	TaskSelectorState
> {
	constructor(props: TaskSelectorProps) {
		super(props)

		const entries = this.props.tasks.entries()
		const task = entries.length ? entries[0][0] : ''

		this.state = { task }
	}
	readonly updateFn = () => this.forceUpdate()

	componentWillMount() {
		this.props.tasks.on('update', this.updateFn)
	}

	componentWillUnmount() {
		this.props.tasks.removeListener('update', this.updateFn)
	}

	selectChange(event: React.ChangeEvent<HTMLSelectElement>) {
		this.setState({ task: event.target.value })
	}

	render() {
		const entries = this.props.tasks.entries()

		if (!entries.length) {
			return <i>no tasks running</i>
		}

		return (
			<span>
				<Select
					onChange={event => this.selectChange(event)}
					selected={this.state.task}
					values={entries.map(castTaskEntryToStringTuple)}
				/>

				<Link to={'/tasks/' + this.state.task}>
					<button>Go</button>
				</Link>
			</span>
		)
	}
}

const castTaskEntryToStringTuple = ([key, task]: [string, Task]): [
	string,
	string
] => [key, task.name]
