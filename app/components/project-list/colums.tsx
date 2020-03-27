/* tslint:disable:curly */
import * as React from 'react'
import { Link } from 'react-router-dom'
import { Project } from '../../structures/Project'
import { leftPad, formatBytes } from '../../utils/reabability'
import moment = require('moment')

export const sorters: { [key: string]: (a: Project, b: Project) => number } = {
	activity(a, b) {
		const A = a.versioning
		const B = b.versioning

		if (!A || !B) {
			if (A && !B) return 1
			if (!A && B) return -1

			return sorters.name(a, b)
		}

		if (A.lastCommitDate && !B.lastCommitDate) return 1
		if (!A.lastCommitDate && B.lastCommitDate) return -1
		if (!A.lastCommitDate && !B.lastCommitDate) return 0

		if (A.lastCommitDate.valueOf() > B.lastCommitDate.valueOf()) return -1
		if (A.lastCommitDate.valueOf() < B.lastCommitDate.valueOf()) return 1

		return sorters.name(a, b)
	},
}

export interface ICol {
	// heading: string
	id: string
	hideheading?: true
	fn(project: Project, api: IBLARG): string | number | null | JSX.Element
	sort?(a: Project, b: Project): number
	description?: string
}
interface IBLARG {
	updateRow(): void
}

export const colKeys: string[] = []
export const colMap = new Map<string, ICol>()

const columns: ICol[] = [
	{
		id: 'name',
		fn: project => (
			<Link
				to={`/project/${project.id}`}
				style={{
					display: 'block',
					textDecoration: project.isUnderRemoval
						? 'line-through'
						: 'none',
				}}
			>
				{project.dirName}
			</Link>
		),
		sort(a, b) {
			return a.name.localeCompare(b.name)
		},
	},
	{
		id: 'versioning',
		hideheading: true,
		fn: project =>
			leftPad(
				// @ts-ignore
				project.versioning ? project.versioning.type : '---',
				3
			),
		sort(a, b) {
			const A = a.versioning
			const B = b.versioning

			if (!A || !B) {
				if (A && !B) return 1
				if (!A && B) return -1

				return sorters.name(a, b)
			}

			return A.type.localeCompare(B.type)
		},
	},
	{
		id: 'size',
		fn: project => (
			<pre style={{ margin: 0 }}>
				{leftPad(formatBytes(project.size || -2, 1), 8)}
			</pre>
		),
		sort({ size: A }, { size: B }) {
			if (A > B) return -1
			if (A < B) return 1

			return 0
		},
	},
	{
		id: 'isNode',
		hideheading: true,
		fn: project => fancySelector(project, 'isNode', 'node'),
	},
	{
		id: 'hasModules',
		hideheading: true,
		fn: project => fancySelector(project, 'hasModules', 'modules'),
		sort(a, b) {
			if (a.hasModules && !b.hasModules) return -1
			if (!a.hasModules && b.hasModules) return 1

			return sorters.name(a, b)
		},
	},
	{
		id: 'lock',
		fn: project =>
			`${fancySelector(project, 'hasNpmLock', 'npm')} ${fancySelector(
				project,
				'hasYarnLock',
				'yarn'
			)}`,
	},
	{
		id: 'commits',
		fn: project =>
			project.versioning ? project.versioning.commitCount || '' : '',
	},
	{
		id: 'dirty',
		fn: project =>
			project.versioning ? project.versioning.dirtyCount || '' : '',
		sort(a, b) {
			const A = a.versioning
			const B = b.versioning

			if (!A || !B) {
				if (A && !B) return 1
				if (!A && B) return -1

				return sorters.name(a, b)
			}

			if (A.dirtyCount > B.dirtyCount) return -1
			if (A.dirtyCount < B.dirtyCount) return 1

			return sorters.name(a, b)
		},
	},
	{
		id: 'lastCommit',
		fn: project =>
			project.versioning &&
			project.versioning.lastCommitDate &&
			moment(project.versioning.lastCommitDate).fromNow(true),
		sort(a, b) {
			const A = a.versioning
			const B = b.versioning

			if (!A || !B) {
				if (A && !B) return 1
				if (!A && B) return -1

				return sorters.name(a, b)
			}

			const X = A.lastCommitDate
			const Y = B.lastCommitDate

			if (!X || !Y) {
				if (X && !Y) return 1
				if (!X && Y) return -1

				return sorters.name(a, b)
			}

			if (X.valueOf() > Y.valueOf()) return -1
			if (X.valueOf() < Y.valueOf()) return 1

			return sorters.name(a, b)
		},
	},
	{
		id: 'update',
		hideheading: true,
		fn: (project, api) => (
			<a onClick={() => project.update().then(api.updateRow)}>up</a>
		),
	},
]

columns.forEach(col => {
	colMap.set(col.id, col)
	colKeys.push(col.id)

	if (sorters[col.id]) {
		return
	} else if (!col.sort) {
		return console.info(`Sorter needed for ${col.id}`)
	}

	sorters[col.id] = col.sort
})

function fancySelector(project: Project, key: string, output?: string) {
	output = output || key
	// @ts-ignore
	return project[key] ? output : '-'
}

export const sorterKeys = Object.keys(sorters)
