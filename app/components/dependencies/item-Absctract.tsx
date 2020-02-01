import * as React from 'react'

import { Result } from 'npm-package-arg'

type resultTypes =
	| 'version'
	| 'range'
	| 'tag'
	| 'file'
	| 'directory'
	| 'remote'
	| 'git'
	| 'alias'

interface AbstractDependencyProps<ResultType extends resultTypes> {
	result: ResgistryResult<ResultType>
	name: string
}

interface AbstractDependencyState {}

// @ts-ignore
interface ResgistryResult<ResultType extends resultTypes> extends Result {
	type: ResultType
}

export abstract class AbstractDependency<
	ResultType extends resultTypes
> extends React.Component<
	AbstractDependencyProps<ResultType>,
	AbstractDependencyState
> {
	get name() {
		return this.props.name
	}

	get rawSpec() {
		return this.props.result.rawSpec
	}

	get fetchSpec() {
		return this.props.result.fetchSpec as string
	}

	static specStyle(color: string): React.CSSProperties {
		return { color, fontStyle: 'italic', fontSize: 'small' }
	}
}
