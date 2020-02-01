export const specTypes: { [key: string]: (v: any) => boolean } = {
	boolean: v => typeof v === 'boolean',
	string: v => typeof v === 'string',
}

export const configSpec: {
	[key: string]: {
		type: string
		text: string
		description?: string
		defaultValue: any
	}
} = {
	'tweaks.mouseNav': {
		type: 'boolean',
		text: 'Disable mouse navigation buttons',
		description:
			'Some mice have back and forward buttons, this disables it',
		defaultValue: true,
	},
}
