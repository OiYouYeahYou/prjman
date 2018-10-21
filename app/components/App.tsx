import * as React from 'react'
import { HeaderMenuItem } from './HeaderMenuLink'
import { TaskSelector } from './TaskSelector'

export default class App extends React.Component {
	render() {
		return (
			<div>
				<HeaderMenuItem to="/" text="home" />
				<HeaderMenuItem to="/settings" text="settings" />
				<TaskSelector />
				<br />
				<div>{this.props.children}</div>
			</div>
		)
	}
}
