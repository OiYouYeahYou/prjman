import * as React from 'react'
import { Result } from 'npm-package-arg'
import { GitDependency } from './item-Git'
import { RegistryDependency } from './item-Registry'
import { FilePathDependency } from './item-FilePath'
import { AliasDependency } from './item-Alias'

export interface DepsItemProps {
	result: Result
	name: string
	children?: void
}

interface DepsItemState {}

export class DependencyItem extends React.Component<
	DepsItemProps,
	DepsItemState
> {
	readonly state: DepsItemState = {
		result: this.props.result,
	}

	render() {
		let Handler: typeof React.Component

		switch (this.props.result.type) {
			case 'remote':
			case 'git':
				// git
				Handler = GitDependency
				break
			case 'version':
			case 'range':
			case 'tag':
				// registry
				Handler = RegistryDependency
				break
			case 'file':
			case 'directory':
				// file path
				Handler = FilePathDependency
				break
			// @ts-ignore bad typing
			case 'alias':
				// alias
				Handler = AliasDependency
				break
			default:
				throw new Error(
					`Unrecognised dependency type: ${this.props.result.type}`
				)
		}

		return <Handler result={this.props.result} name={this.props.name} />
	}
}
