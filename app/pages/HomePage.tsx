import * as React from 'react'
import { Link } from 'react-router-dom'
import { projectStore } from '../projects'
import RemoteGetter from '../components/RemoteGetter'

export class HomePage extends React.Component<{}, {}> {
	render() {
		let list

		if (!projectStore.isReady) {
			projectStore.once('ready', () => this.forceUpdate())

			list = <b>loading project data</b>
		} else {
			list = (
				<ul>
					{projectStore.entries().map(([name]) => (
						<li key={name}>
							<Link to={`/project/${name}`}>{name}</Link>
						</li>
					))}
				</ul>
			)
		}

		return (
			<div>
				<h1>Welcome to prjman</h1>
				<RemoteGetter />
				{list}
			</div>
		)
	}
}
