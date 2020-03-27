import electron = require('electron')
import * as React from 'react'

import { ICol } from './colums'

import { Project } from '../../structures/Project'
import { openInEditor } from '../../api/editors'

interface RowsProps {
	project: Project
	columns: ICol[]
}

export class Row extends React.Component<RowsProps, {}> {
	updateFn = () => this.forceUpdate()

	render() {
		if (this.props.project.isRemoved) {
			return null
		}

		const rowApi = { updateRow: this.updateFn }

		return (
			<tr
				key={this.props.project.dirName}
				onContextMenu={e => {
					e.preventDefault()

					electron.remote.Menu.buildFromTemplate(
						contextTemplate(
							this.props.project,
							e.pageX,
							e.pageY,
							this.updateFn
						)
					).popup({ window: electron.remote.getCurrentWindow() })
				}}
				className="project-list-row"
			>
				{this.props.columns.map(cell => (
					<td
						key={`${this.props.project.dirName}-${cell.id}`}
						title={cell.id}
					>
						{cell.fn(this.props.project, rowApi)}
					</td>
				))}
			</tr>
		)
	}
}

function contextTemplate(
	project: Project,
	x: number,
	y: number,
	update: () => void
) {
	return [
		{
			label: 'Open in editor',
			click() {
				openInEditor(project.path)
			},
		},
		{
			label: 'Update',
			click() {
				project
					.update()
					.catch(err =>
						console.error(
							'Error when manually updating project:',
							err
						)
					)
			},
		},
		{
			label: 'Inspect element',
			click() {
				electron.remote.getCurrentWebContents().inspectElement(x, y)
			},
		},
		{
			label: 'Delete',
			submenu: [
				{
					label: 'SURE!',
					click() {
						project
							.deleteFromDisk()
							.then(() => update())
							.catch(() => update())
					},
				},
			],
		},
	]
}
