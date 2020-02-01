import * as React from 'react'
import * as Redux from 'react-redux'
import { History } from 'history'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router'

// Pages
import { HomePage } from '../pages/HomePage'
import { ProjectPage } from '../pages/ProjectPage'
import { ReadmePage } from '../pages/ReadmePage'
import { SettingsPage } from '../pages/SettingsPage'
import { TasksPage } from '../pages/TasksPage'
import { SearchPage } from '../pages/SearchPage'

import App from './App'
import { PageContainer, IStores } from './page-container'
import { projectStore, settings, tasks } from '../stores'

interface IRootType {
	store: Redux.Store<any>
	history: History
}

const stores: IStores = { projectStore, settings, tasks }

export default function Root({ store, history }: IRootType) {
	const pageContainer = PageContainer(stores)

	return (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<App tasks={stores.tasks}>
					<Switch>
						<Route
							path="/project/:projectid/"
							component={pageContainer(ProjectPage)}
						/>
						<Route
							path="/readme/:projectid/"
							component={pageContainer(ReadmePage)}
						/>
						<Route
							path="/tasks/:task/"
							component={pageContainer(TasksPage)}
						/>
						<Route
							path="/settings/"
							component={pageContainer(SettingsPage)}
						/>
						<Route
							path="/search/"
							component={pageContainer(SearchPage)}
						/>
						<Route path="/" component={pageContainer(HomePage)} />
					</Switch>
				</App>
			</ConnectedRouter>
		</Provider>
	)
}
