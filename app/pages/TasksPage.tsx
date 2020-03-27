import * as React from 'react'

import { Task } from '../structures/TaskManager'
import { PageContainerProps } from '../components/page-container'

export interface TasksPageProps extends PageContainerProps<{ task: string }> {}

interface TasksPageState {
	task: Task
	input: string
}

export class TasksPage extends React.Component<TasksPageProps, TasksPageState> {
	readonly updateFn = () => this.forceUpdate()

	// tslint:disable-next-line:member-ordering
	constructor(props: TasksPageProps) {
		super(props)

		this.state = {
			task: this.props.tasks.tasks[props.match.params.task],
			input: '',
		}

		if (this.state.task) {
			this.state.task.on('update', this.updateFn)
		}
	}

	componentWillUnmount() {
		if (this.state.task) {
			this.state.task.removeListener('update', this.updateFn)
		}
	}

	inputSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		this.state.task.stdin((this.state.input + '\n\n').split('\n'))
		this.setState({ input: '' })
	}

	inputChange(event: React.ChangeEvent<HTMLInputElement>) {
		event.preventDefault()

		this.setState({ input: event.target.value })
	}

	render() {
		if (!this.state.task) {
			return <i>Task is missing</i>
		}

		const {
			name,
			command,
			args,
			output,
			readyToStart,
			running,
		} = this.state.task

		return (
			<>
				<b>Task:</b> {name}
				<br />
				<b>Command:</b> {command}
				<br />
				<b>Args:</b> {args.join(' ')}
				<br />
				{readyToStart ? (
					<>
						<button onClick={() => this.state.task.start()}>
							start
						</button>
						<br />
					</>
				) : (
					undefined
				)}
				<b>Output:</b>
				<div>
					{output.map((ln, i) => (
						<div key={name + 'output' + i}>{ln}</div>
					))}
				</div>
				{running ? (
					<form onSubmit={event => this.inputSubmit(event)}>
						<input
							type="text"
							onChange={event => this.inputChange(event)}
							value={this.state.input}
						/>
					</form>
				) : (
					undefined
				)}
			</>
		)
	}
}
