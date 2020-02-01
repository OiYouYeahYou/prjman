import { RouteComponentProps } from 'react-router'
import { ProjectStore } from '../structures/ProjectStore'
import { Settings } from '../structures/Settings'
import { TaskManager } from '../structures/TaskManager'
import React = require('react')

export interface PageContainerProps<K = {}> extends RouteComponentProps<K> {
	projectStore: ProjectStore
	settings: Settings
	tasks: TaskManager
}

export interface IStores {
	projectStore: ProjectStore
	settings: Settings
	tasks: TaskManager
}

export function PageContainer({
	projectStore,
	settings,
	tasks,
}: {
	projectStore: ProjectStore
	settings: Settings
	tasks: TaskManager
}) {
	return function _<K>(PageComponent: typeof React.Component) {
		return class PageContainer extends React.Component<
			PageContainerProps<K>,
			{ hasError: any }
		> {
			constructor(props: any) {
				super(props)
				this.state = { hasError: null }
			}

			static getDerivedStateFromError(error: any) {
				return { hasError: error }
			}

			componentDidCatch(error: any, info: any) {
				console.error(error)
				console.error(info)
			}

			render() {
				if (this.state.hasError) {
					return (
						<b onClick={() => this.setState({ hasError: null })}>
							WHAO! We just hit a bug, Click to refresh
						</b>
					)
				}

				return (
					<PageComponent
						projectStore={projectStore}
						settings={settings}
						tasks={tasks}
						{...this.props}
					/>
				)
			}
		}
	}
}
