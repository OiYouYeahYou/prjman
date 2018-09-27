import * as React from 'react'
import { resolve, Result } from 'npm-package-arg'

export interface DepsItemProps {
	pkg: string
	version: string
	path: string
	children?: void
}

interface DepsItemState {
	result: Result
}

export class DependencyItem extends React.Component<
	DepsItemProps,
	DepsItemState
> {
	constructor(props: DepsItemProps) {
		super(props)

		this.state = {
			result: resolve(this.props.pkg, this.props.version),
		}
	}

	render() {
		const { name, rawSpec, type } = this.state.result

		return (
			<li>
				<b>{name}</b>{' '}
				<i>
					<small>{rawSpec}</small>
				</i>
			</li>
		)
	}
}
