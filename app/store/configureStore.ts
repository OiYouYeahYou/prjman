import { Store } from 'redux'

let configureStore: {
	history: any
	configureStore(initialState?: object | void): Store<void | object>
}

if (process.env.NODE_ENV === 'production') {
	configureStore = require('./configureStore.production')
} else {
	configureStore = require('./configureStore.development')
}

export = configureStore
