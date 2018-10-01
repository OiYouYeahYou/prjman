import * as React from 'react'

import { AbstractDependency } from './item-Absctract'

type ResultTypes = 'alias'

export class AliasDependency extends AbstractDependency<ResultTypes> {
	render() {
		return (
			<li key={this.name}>
				<b>{this.name}</b>{' '}
				<span style={AbstractDependency.specStyle('red')}>
					{this.rawSpec}
				</span>
			</li>
		)
	}
}
