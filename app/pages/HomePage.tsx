import * as React from 'react'
import { Link } from 'react-router-dom'
import { projectStore } from '../projects'
import RemoteGetter from '../components/RemoteGetter'

export class HomePage extends React.Component<{}, {}> {
	readonly updateFn = () => this.forceUpdate()

	componentWillUnmount() {
		projectStore.removeListener('change', this.updateFn)
	}

	render() {
		projectStore.on('change', this.updateFn)

		const entries = projectStore.entries()
		let list

		if (!projectStore.isReady) {
			list = <b>loading project data</b>
		} else if (entries.length) {
			const items = entries.map(([name]) => (
				<li key={name}>
					<Link to={`/project/${name}`}>{name}</Link>
				</li>
			))

			list = <ul>{items}</ul>
		} else {
			list = <b>cannot find any projects</b>
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
