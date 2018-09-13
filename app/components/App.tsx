import * as React from 'react'
import { Link } from 'react-router-dom'

export default class App extends React.Component {
	render() {
		return (
			<div>
				<Link to="/project/projectid">project</Link>
				<Link to="/">home</Link>
				<div>{this.props.children}</div>
			</div>
		)
	}
}
