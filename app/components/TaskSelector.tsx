import * as React from 'react'
import { tasks } from '../tasks'
import { Link } from 'react-router-dom'

export interface TaskSelectorProps {}

interface TaskSelectorState {
	task: string
}

export class TaskSelector extends React.Component<
	TaskSelectorProps,
	TaskSelectorState
> {
	readonly state: TaskSelectorState = { task: tasks.entries()[0][0] }
	readonly updateFn = () => this.forceUpdate()

	componentWillMount() {
		tasks.on('update', this.updateFn)
	}

	componentWillUnmount() {
		tasks.removeListener('update', this.updateFn)
	}

	selectChange(event: React.ChangeEvent<HTMLSelectElement>) {
		this.setState({ task: event.target.value })
	}

	render() {
		const entries = tasks.entries()

		if (!entries.length) {
			return <i>no tasks running</i>
		}

		return (
			<span>
				<select
					onChange={event => this.selectChange(event)}
					value={this.state.task}
				>
					{entries.map(([key, task]) => (
						<option key={key} value={key}>
							{task.name}
						</option>
					))}
				</select>

				<Link to={'/tasks/' + this.state.task}>
					<button>Go</button>
				</Link>
			</span>
		)
	}
}
