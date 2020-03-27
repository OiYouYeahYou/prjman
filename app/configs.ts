import { colKeys } from './components/project-list/colums'

type specValidator = (v: any, spec: configItem) => boolean

export const specTypes: { [key: string]: specValidator } = {
	boolean: v => typeof v === 'boolean',
	string: v => typeof v === 'string',
	'enum-array': (v, spec) =>
		Array.isArray(v) &&
		v.every(
			item =>
				'string' === typeof item &&
				(spec.acceptableValues as string[]).includes(item)
		),
}

interface configItem {
	type: string
	text: string
	description?: string
	defaultValue: any
	acceptableValues?: any
}

/**
 * Defines the settings you are able to configure in prjman
 */
export const configSpec: { [key: string]: configItem } = {
	'tweaks.mouseNav': {
		type: 'boolean',
		text: 'Disable mouse navigation buttons',
		description:
			'Some mice have back and forward buttons, this disables it',
		defaultValue: true,
	},

	'project-list.columns': {
		type: 'enum-array',
		text: 'Select what columns are visible',
		description: 'Decide which columns are shown by default',
		defaultValue: [
			'name',
			'size',
			'isNode',
			'dirty',
			'lastCommit',
			'update',
		],
		acceptableValues: colKeys,
	},
}
