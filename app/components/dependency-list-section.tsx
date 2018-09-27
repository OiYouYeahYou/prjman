import * as React from 'react'

import { IProject } from '../projects'
import { DependencyItem } from './dependency-list-item'

export interface DepsSectionProps {
	project: IProject
}

interface DepsSectionState {}

type dependencyKeys =
	| 'dependencies'
	| 'devDependencies'
	| 'peerDependencies'
	| 'optionalDependencies'

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

		return (
			<div>
				<h3>Dependencies</h3>
				{sections}
			</div>
		)
	}

	renderDepsSubSection(title: string, key: dependencyKeys) {
		const { pkg, path } = this.props.project
		const dependencies = pkg && pkg[key]

		if (!dependencies) {
			return
		}

		const subSection = Object.entries(dependencies).map(
			([pkg, version]) => (
				<DependencyItem
					key={pkg}
					pkg={pkg}
					version={version}
					path={path}
				/>
			)
		)

		if (!subSection.length) {
			return
		}

		return (
			<React.Fragment key={title}>
				<h4>{title}</h4>
				<ul>{subSection}</ul>
			</React.Fragment>
		)
	}
}
