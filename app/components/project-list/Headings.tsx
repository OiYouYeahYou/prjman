import * as React from 'react'

import { ICol } from './colums'

export class Headings extends React.Component<
	{
		columns: ICol[]
		click(id: string): void
	},
	{}
> {
	render() {
		return this.props.columns.map(cell => {
			return (
				<th
					key={`${name}-${cell.id}`}
					onClick={() => {
						this.props.click(cell.id)
					}}
				>
					{cell.hideheading ? '-' : cell.id}
				</th>
			)
		})
	}
}
