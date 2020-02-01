import * as React from 'react'

interface PageSectionProps {
	title: string
	subSection?: true
	children: React.ReactNode
}

interface PageSectionState {}

export class PageSection extends React.Component<
	PageSectionProps,
	PageSectionState
> {
	render() {
		const { title, subSection, children } = this.props
		const heading = !subSection ? <h3>{title}</h3> : <h4>{title}</h4>

		return (
			<div style={{ paddingBottom: '1em' }}>
				{heading}
				{children}
			</div>
		)
	}
}
