import * as React from 'react'
import { Link } from 'react-router-dom'
import { projectEntries } from '../projects'

export default class HomePage extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				<h1>Welcome to prjman</h1>
				<ul>
					{projectEntries.map(([name]) => (
						<li key={name}>
							<Link to={`/project/${name}`}>{name}</Link>
						</li>
					))}
				</ul>
			</div>
		)
	}
}
