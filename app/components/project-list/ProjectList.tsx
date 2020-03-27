import * as React from 'react'

import { sorterKeys, sorters, ICol } from './colums'
import { filterKeys, filters } from './filters'
import { Headings } from './Headings'
import { Rows } from './Rows'

import { Select } from '../Select'

import { ProjectStore } from '../../structures/ProjectStore'

interface ProjectListProps {
	projectStore: ProjectStore
	columnsToDisplay: ICol[]
}

interface ProjectListState {
	sort: string
	filter: string
}

export class ProjectList extends React.Component<
	ProjectListProps,
	ProjectListState
	> {
	readonly state: ProjectListState = {
		sort: 'activity',
		filter: 'none',
	}
	readonly updateFn = () => this.forceUpdate()

	selectorChange(
		key: keyof ProjectListState,
		{ target: { value } }: React.ChangeEvent<HTMLSelectElement>
	) {
		if (value === this.state[key]) {
			return
		}

		// @ts-ignore
		this.setState({ [key]: value })
		this.forceUpdate()
	}

	componentWillMount() {
		this.props.projectStore.on('change', this.updateFn)
	}

	componentWillUnmount() {
		this.props.projectStore.removeListener('change', this.updateFn)
	}

	render() {
		if (!this.props.projectStore.isReady) {
			return <b>loading project data</b>
		}

		const values = this.props.projectStore.values()

		if (!values.length) {
			return <b>cannot find any projects</b>
		}

		const { columnsToDisplay } = this.props
		const rows = values
			.filter(filters[this.state.filter])
			.sort(sorters[this.state.sort])

		return (
			<div>
				<div>
					Count: {values.length} Showing: {rows.length}
					<Select
						values={sorterKeys.map(castStringTuple)}
						selected={this.state.sort}
						onChange={event => this.selectorChange('sort', event)}
					/>
					<Select
						values={filterKeys.map(castStringTuple)}
						selected={this.state.filter}
						onChange={event => this.selectorChange('filter', event)}
					/>
				</div>

				<table>
					<thead>
						<tr>
							<Headings
								columns={columnsToDisplay}
								click={sort => {
									if (!sorterKeys.includes(sort)) {
										return
									}

									this.setState({ sort })
								}}
							/>
						</tr>
					</thead>
					<tbody>
						<Rows columns={columnsToDisplay} projects={rows} />
					</tbody>
				</table>
			</div>
		)
	}
}

const castStringTuple = (v: string): [string, string] => [v, v]
