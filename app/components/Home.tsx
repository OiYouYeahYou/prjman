import * as React from 'react'
import { RouteComponentProps } from 'react-router'

let styles = require('./Home.scss')

export class HomePage extends React.Component<RouteComponentProps<any>, void> {
	render() {
		return (
			<div>
				<div className={styles.container} data-tid="container" />
				home
			</div>
		)
	}
}

export default (HomePage as any) as React.StatelessComponent<
	RouteComponentProps<any>
>
