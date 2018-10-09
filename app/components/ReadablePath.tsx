import * as React from 'react'
import { homedir } from 'os'

export interface ReadablePathProps {
	path: string
	children?: void
}

interface ReadablePathState {}

export class ReadablePath extends React.Component<
	ReadablePathProps,
	ReadablePathState
> {
	render() {
		return <span>{this.props.path.replace(homedir(), '~')}</span>
	}
}
