import * as React from 'react'

export interface PromiseValueProps<T = any> {
	promise: Promise<T>
}

interface PromiseValueState {
	value?: any
	completed: boolean
	errored: boolean
}

export class PromiseValue<T> extends React.Component<
	PromiseValueProps<T>,
	PromiseValueState
> {
	isMountedXXXX: boolean

	readonly state: PromiseValueState = {
		completed: false,
		errored: false,
	}

	componentWillMount() {
		this.isMountedXXXX = true

		this.props.promise
			.then(value => {
				if (this.isMountedXXXX) {
					this.setState({ value, completed: true })
				}
			})
			.catch(() => {
				if (this.isMountedXXXX) {
					this.setState({ errored: true })
				}
			})
	}

	componentWillUnmount() {
		this.isMountedXXXX = false
	}

	render() {
		let contents

		if (this.state.completed) {
			contents = this.state.value
		} else if (this.state.errored) {
			contents = 'error'
		} else {
			contents = 'waiting'
		}

		return <span>{contents}</span>
	}
}
