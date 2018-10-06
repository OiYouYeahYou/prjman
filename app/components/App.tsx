import * as React from 'react'
import { HeaderMenuItem } from './HeaderMenuLink'

export default class App extends React.Component {
	render() {
		return (
			<div>
				<HeaderMenuItem to="/" text="home" />
				<HeaderMenuItem to="/settings" text="settings" />
				<div>{this.props.children}</div>
			</div>
		)
	}
}
