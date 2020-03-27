import * as React from 'react'
import RemoteGetter from '../components/RemoteGetter'
import { ProjectList } from '../components/project-list/ProjectList'
import { PageContainerProps } from '../components/page-container'
import { colMap, colKeys } from '../components/project-list/colums'

interface HomePageProps extends PageContainerProps {}

export class HomePage extends React.Component<HomePageProps, {}> {
	render() {
		const veiwableColumns = this.props.settings.getConfig(
			'project-list.columns'
		) as string[]
		const columnsToDisplay = colKeys
			.filter(key => veiwableColumns.includes(key))
			.map((id: string) => colMap.get(id)!)

		return (
			<div>
				<h1>Welcome to prjman</h1>
				<RemoteGetter />
				<hr />
				<ProjectList
					projectStore={this.props.projectStore}
					columnsToDisplay={columnsToDisplay}
				/>
			</div>
		)
	}
}
