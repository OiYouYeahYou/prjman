import * as React from 'react'
import * as Redux from 'react-redux'
import { History } from 'history'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router'

import App from './App'
import HomePage from './Home'
import Project from './Project'

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
						<Route path="/project/:projectid" component={Project} />
						<Route path="/" component={HomePage} />
					</Switch>
				</App>
			</ConnectedRouter>
		</Provider>
	)
}
