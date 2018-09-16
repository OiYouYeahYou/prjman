import * as React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from './components/Root'
import { configureStore, history } from './store/configureStore'
import './app.global.scss'

const store = configureStore()

render(
	<AppContainer>
		<Root store={store} history={history} />
	</AppContainer>,
	document.getElementById('root')
)

if ((module as any).hot) {
	; (module as any).hot.accept('./components/Root', () => {
		const NextRoot = require('./components/Root').default
		render(
			<AppContainer>
				<NextRoot store={store} history={history} />
			</AppContainer>,
			document.getElementById('root')
		)
	})
}
