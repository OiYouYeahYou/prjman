import * as React from 'react'

interface SelectProps {
	values: [string, string][]
	selected?: string
	onChange(value: React.ChangeEvent<HTMLSelectElement>): void
}

export class Select extends React.Component<SelectProps, {}> {
	render() {
		return (
			<select
				onChange={this.props.onChange}
				value={this.props.selected || this.props.values[0]}
			>
				{this.props.values.map(([value, display]) => (
					<option key={value} value={value}>
						{display || value}
					</option>
				))}
			</select>
		)
	}
}
