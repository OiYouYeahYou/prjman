import * as React from 'react'
import { resolve, Result } from 'npm-package-arg'

import { Project, dependencyKeys } from '../../structures/Project'
import { PageSection } from '../PageSection'
import { DependencyItem } from './Item'

export interface DepsSectionProps {
	project: Project
}

interface DepsSectionState {}

interface ScopedProjects {
	[scope: string]: Result[]
}

const SCOPABLE_TYPES = ['version', 'range', 'tag']

export class DependenciesSection extends React.Component<
	DepsSectionProps,
	DepsSectionState
> {
	render() {
		if (!this.props.project.pkg) {
			return null
		}

		const sections = [
			this.renderDepsSubSection('prod', 'dependencies'),
			this.renderDepsSubSection('dev', 'devDependencies'),
			this.renderDepsSubSection('peer', 'peerDependencies'),
			this.renderDepsSubSection('opts', 'optionalDependencies'),
		].filter(Boolean)

		if (!sections.length) {
			return null
		}

		return <PageSection title="Dependencies">{sections}</PageSection>
	}

	renderDepsSubSection(title: string, key: dependencyKeys) {
		const dependencies = this.props.project.getDependencies(key)

		if (!dependencies) {
			return
		}

		const filterdPackages = this.filterPackages(dependencies)

		if (!filterdPackages) {
			return
		}

		const { scoped, other } = filterdPackages
		const scopedElements = this.scopedelements(scoped)
		const unscopetElments = other.map(result => {
			const name = result.name as string

			return <DependencyItem name={name} key={name} result={result} />
		})

		return (
			<PageSection key={title} title={title} subSection>
				<small>
					<ul>
						{unscopetElments}
						{scopedElements}
					</ul>
				</small>
			</PageSection>
		)
	}

	filterPackages(dependencies: { [name: string]: string }) {
		const entries = Object.entries(dependencies)

		if (!entries.length) {
			return
		}

		const { path } = this.props.project
		const scoped: ScopedProjects = {}
		const other: Result[] = []

		entries
			.sort(([a], [b]) => a.localeCompare(b))
			.forEach(([pkg, version]) => {
				const result = resolve(pkg, version, path)
				const { type, scope } = result
				//
				;(SCOPABLE_TYPES.includes(type) && scope
					? scoped[scope] || (scoped[scope] = [])
					: other
				).push(result)
			})

		return { scoped, other }
	}

	scopedelements(scoped: ScopedProjects) {
		return Object.entries(scoped).map(([scope, pkgs]) => {
			const replaceString = scope + '/'

			const items = pkgs.map(result => {
				const name = (result.name as string).replace(replaceString, '')

				return <DependencyItem name={name} key={name} result={result} />
			})

			return (
				<li key={scope}>
					{scope}
					<ul>{items}</ul>
				</li>
			)
		})
	}

	item(name: string, result: Result) {
		// // prettier-ignore
		// const text = <><b>{name}</b> <i><small>{rawSpec}</small></i></>

		// return <HiderItem key={name} visible={text} hidden={buttons} />
		return <DependencyItem name={name} key={name} result={result} />
	}
}

const buttons = (
	<>
		<button>get</button>
		<button>readme</button>
	</>
)
