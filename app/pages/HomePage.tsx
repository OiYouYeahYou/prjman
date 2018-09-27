import * as React from 'react'
import { Link } from 'react-router-dom'
import { projectEntries } from '../projects'
import RemoteGetter from '../components/RemoteGetter'

export class HomePage extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				<h1>Welcome to prjman</h1>
				<RemoteGetter />
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
