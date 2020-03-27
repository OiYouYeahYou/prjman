import * as React from 'react'

import { AbstractDependency } from './item-Absctract'

import { HiderItem } from '../HiderItem'
import { OpenInEditor } from '../OpenInEditor'

type ResultTypes = 'file' | 'directory'

export class FilePathDependency extends AbstractDependency<ResultTypes> {
	render() {
		const text = (
			<>
				<b>{this.name}</b>{' '}
				<span style={AbstractDependency.specStyle('blue')}>
					{this.rawSpec}
				</span>
			</>
		)
		const buttons = [
			<OpenInEditor path={this.fetchSpec + '/'} key="open-in-editor" />,
		]

		return <HiderItem key={this.name} visible={text} hidden={buttons} />
	}
}
