import * as React from 'react'

import { ICol } from './colums'
import { Row } from './Row'

import { Project } from '../../structures/Project'

interface RowsProps {
	projects: Project[]
	columns: ICol[]
}

export class Rows extends React.Component<RowsProps, {}> {
	render() {
		return this.props.projects.map((project, i) => (
			<Row
				key={`project list row: ${i}`}
				project={project}
				columns={this.props.columns}
			/>
		))
	}
}
