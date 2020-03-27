import * as React from 'react'

import { HeaderMenuItem } from './HeaderMenuLink'
import { TaskSelector } from './TaskSelector'

import { TaskManager } from '../structures/TaskManager'

interface AppProps {
	tasks: TaskManager
}

export default class App extends React.Component<AppProps> {
	render() {
		return (
			<div>
				<HeaderMenuItem to="/" text="home" />
				<HeaderMenuItem to="/search" text="search" />
				<HeaderMenuItem to="/settings" text="settings" />
				<TaskSelector tasks={this.props.tasks} />
				<br />
				<div>{this.props.children}</div>
			</div>
		)
	}
}
