import * as React from 'react'

import { PageSection } from '../components/PageSection'
import { PathList } from '../components/PathList'
import { PageContainerProps } from '../components/page-container'
import { colMap } from '../components/project-list/colums'

import { configSpec } from '../configs'

export interface SettingsPageProps extends PageContainerProps {}

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
					<PathList collections={this.props.settings.collections} />
				</PageSection>
				<TweaksSection settings={this.props.settings} />
				<ColumnSelector settings={this.props.settings} />
			</>
		)
	}
}

interface TweaksSectionProps {
	settings: {
		getConfig(key: string): any
		setConfig(key: string, value: any): void
	}
}

export class TweaksSection extends React.Component<TweaksSectionProps> {
	render() {
		const settings = Object.entries(configSpec)
			.filter(([key]) => /^tweaks\./.test(key))
			.map(([key, spec]) => {
				const value = this.props.settings.getConfig(key)
				const { type } = spec

				if (type === 'boolean') {
					return (
						<Select
							key={'settings page ' + key}
							{...spec}
							value={value}
							onChange={({ target: { checked } }) => {
								this.props.settings.setConfig(key, checked)
								this.forceUpdate()
							}}
						/>
					)
				}

				return null
			})
			.filter(Boolean)

		return <PageSection title="The little things">{settings}</PageSection>
	}
}

interface ColumnSelectorSectionProps {
	settings: {
		getConfig(key: string): any
		setConfig(key: string, value: any): void
	}
}

export class ColumnSelector extends React.Component<
	ColumnSelectorSectionProps
> {
	render() {
		const selectedColumns = this.props.settings.getConfig(
			'project-list.columns'
		) as string[]

		return (
			<PageSection title="Project List columns">
				{Array.from(colMap).map(([key, col]) => {
					const isSelected = selectedColumns.includes(col.id)

					return (
						<div key={'settings project list ' + key}>
							<Select
								value={isSelected}
								text={col.id}
								description={col.description}
								onChange={() => {
									if (isSelected) {
										this.props.settings.setConfig(
											'project-list.columns',
											selectedColumns.filter(
												v => v !== col.id
											)
										)
									} else {
										this.props.settings.setConfig(
											'project-list.columns',
											[...selectedColumns, col.id]
										)
									}

									this.forceUpdate()
								}}
							/>
						</div>
					)
				})}
			</PageSection>
		)
	}
}

interface SelectProps {
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	text: string
	value: boolean
	description?: string
}

export class Select extends React.Component<SelectProps> {
	render() {
		return (
			<label>
				<input
					type="checkbox"
					onChange={this.props.onChange}
					checked={this.props.value}
				/>
				{this.props.text}
			</label>
		)
	}
}
