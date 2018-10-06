import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { PageSection } from '../components/PageSection'
import { PathList } from '../components/PathList'

export interface SettingsPageProps
	extends RouteComponentProps<{ projectid: string }> {}

interface SettingsPageState {}

export class SettingsPage extends React.Component<
	SettingsPageProps,
	SettingsPageState
> {
	render() {
		return (
			<>
				<h1>Settings</h1>
				<PageSection title="Main">
					Locations:
					<br />
					<PathList />
				</PageSection>
			</>
		)
	}
}
