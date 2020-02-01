import * as React from 'react'
import { Route } from 'react-router'

interface NavButtonProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	path: string
	state?: { [key: string]: any }
	children: string
	onclick?: undefined
}

export class NavButton extends React.Component<NavButtonProps> {
	render() {
		const { path, state, ...props } = this.props

		return (
			<Route
				render={({ history }) => (
					<button
						{...props}
						onClick={() => history.push(path, state)}
					/>
				)}
			/>
		)
	}
}
