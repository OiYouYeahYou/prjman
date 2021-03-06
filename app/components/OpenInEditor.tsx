import * as React from 'react'

import { openInEditor } from '../api/editors'

interface OpenInEditorProps {
	path: string
	children?: string
}

interface OpenInEditorState {}

export class OpenInEditor extends React.Component<
	OpenInEditorProps,
	OpenInEditorState
> {
	render() {
		return (
			<button onClick={() => openInEditor(this.props.path)}>
				{this.props.children || 'Edit'}
			</button>
		)
	}
}
