import * as React from 'react'
import RemoteGetter from '../components/RemoteGetter'
import { ProjectList } from '../components/project-list/ProjectList'
import { PageContainerProps } from '../components/page-container'

interface HomePageProps extends PageContainerProps {}

export class HomePage extends React.Component<HomePageProps, {}> {
	render() {
		return (
			<div>
				<h1>Welcome to prjman</h1>
				{process.env.visual || 'bleh'}
				{process.env.editor || 'bleh'}
				<RemoteGetter />
				<hr />
				<ProjectList projectStore={this.props.projectStore} />
			</div>
		)
	}
}
