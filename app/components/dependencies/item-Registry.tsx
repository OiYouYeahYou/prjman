import * as React from 'react'

import { AbstractDependency } from './item-Absctract'

import { HiderItem } from '../HiderItem'
import { NavButton } from '../NavButton'

type ResultTypes = 'version' | 'range' | 'tag'

export class RegistryDependency extends AbstractDependency<ResultTypes> {
	render() {
		const text = (
			<>
				<b>{this.name}</b>{' '}
				<span style={AbstractDependency.specStyle('purple')}>
					{this.rawSpec}
				</span>
			</>
		)
		const buttons = [
			<NavButton path="" key="get">
				get
			</NavButton>,
			<NavButton path="" key="readme">
				readme
			</NavButton>,
		]

		return (
			<HiderItem key={this.name + 'hi'} visible={text} hidden={buttons} />
		)
	}
}
