import * as React from 'react'

import { Select } from './Select'

import { resolverKeys, validate, getter } from '../api/remote-resolvers'

interface RemoteGetterProps {}

interface RemoteGetterSate {
	value: string
	type: string
	resolution: string
}

export default class RemoteGetter extends React.Component<
	RemoteGetterProps,
	RemoteGetterSate
> {
	readonly state: RemoteGetterSate = {
		resolution: 'nothing to see',
		type: 'bitbucket',
		value: '',
	}

	handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ value: event.target.value })
	}

	handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({ type: event.target.value })
	}

	handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const { type, value } = this.state

		getter(type, value)

		this.setState({ value: '' })
		event.preventDefault()
	}

	render() {
		const isValid = validate(this.state.type, this.state.value)

		return (
			<form onSubmit={this.handleSubmit}>
				<div>
					<input
						type="text"
						value={this.state.value}
						onChange={this.handleInputChange}
					/>

					<Select
						values={resolverKeys.map<[string, string]>(v => [v, v])}
						selected={this.state.type}
						onChange={this.handleSelectChange}
					/>

					<button type="submit" disabled={!isValid}>
						Get
					</button>

					{isValid ? 'valid' : 'invalid'}
				</div>
			</form>
		)
	}
}
