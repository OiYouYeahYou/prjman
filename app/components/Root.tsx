import * as React from 'react'
import * as Redux from 'react-redux'
import { History } from 'history'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router'

import App from './App'
import { HomePage } from '../pages/HomePage'
import { ProjectPage } from '../pages/ProjectPage'
import { ReadmePage } from '../pages/ReadmePage'
import { SettingsPage } from '../pages/Settings'
import { TasksPage } from '../pages/TasksPage'

interface IRootType {
	store: Redux.Store<any>
	history: History
}

export default function Root({ store, history }: IRootType) {
	return (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<App>
					<Switch>
						<Route
							path="/project/:projectid/"
							component={ProjectPage}
						/>
						<Route
							path="/readme/:projectid/"
							component={ReadmePage}
						/>
						<Route path="/tasks/:task/" component={TasksPage} />
						<Route path="/settings/" component={SettingsPage} />
						<Route path="/" component={HomePage} />
					</Switch>
				</App>
			</ConnectedRouter>
		</Provider>
	)
}
