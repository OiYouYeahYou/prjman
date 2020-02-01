import * as React from 'react'
import { PageContainerProps } from '../components/page-container'
import { Select } from '../components/Select'

interface SearchPageProps extends PageContainerProps {}

const options = [
	'npm',
	'npm user',
	'github user',
	'github repo',
	'github ',
	'github ',
	'github ',
	'github ',
	'github ',
	'github ',
].map<[string, string]>(v => [v, v])

export class SearchPage extends React.Component<SearchPageProps, {}> {
	render() {
		return (
			<div>
				{/* 
					search input
					location sleector
					results
				*/}

				<Select values={options} onChange={() => {}} />
			</div>
		)
	}
}
