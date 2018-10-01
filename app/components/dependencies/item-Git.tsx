import * as React from 'react'

import { HiderItem } from '../HiderItem'
import { AbstractDependency } from './item-Absctract'

type ResultTypes = 'remote' | 'git'

export class GitDependency extends AbstractDependency<ResultTypes> {
	componentWillMount() {}

	render() {
		const text = (
			<>
				<b>{this.name}</b>{' '}
				<span style={AbstractDependency.specStyle('green')}>
					{this.rawSpec}
				</span>
			</>
		)
		const buttons = [
			<button key="get">get</button>,
			<button key="readme">readme</button>,
		]

		return <HiderItem key={this.name} visible={text} hidden={buttons} />
	}
}
