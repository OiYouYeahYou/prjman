import { fromUrl } from 'hosted-git-info'

const validatePackageName: (
	input: string
) => {
	validForNewPackages: boolean
	validForOldPackages: boolean
	warnings: string[]
	errors: string[]
} = require('validate-npm-package-name')

interface IResolver {
	validator(input: string): boolean
	getter(input: string): void
}

interface IResolvers {
	[service: string]: IResolver
}

export const resolvers: IResolvers = {
	npm: {
		validator(input) {
			return /^(@\w\/)\w/i.test(input)
		},

		getter() {
			console.log(`Remote Getter isn't smart enough`)
		},
	},

	github: {
		validator(input) {
			try {
				if (!input) {
					return false
				}

				// @ts-ignore
				const info = fromUrl(input, {})
				console.log(info)

				if (!info) {
					return false
				}

				return true
			} catch (error) {
				console.log(error)
				return false
			}
		},

		getter() {
			console.log(`Remote Getter isn't smart enough`)
		},
	},

	gitlab: {
		validator() {
			return true
		},

		getter() {
			console.log(`Remote Getter isn't smart enough`)
		},
	},

	bitbucket: {
		validator() {
			return true
		},

		getter() {
			console.log(`Remote Getter isn't smart enough`)
		},
	},

	file: {
		validator() {
			return true
		},

		getter() {
			console.log(`Remote Getter isn't smart enough`)
		},
	},
}

export const resolverKeys = Object.keys(resolvers)

export function validate(type: keyof IResolvers, value: string) {
	validateType(type)
	return resolvers[type].validator(value)
}

export function getter(type: keyof IResolvers, value: string) {
	if (!validate(type, value)) {
		return
	}

	return resolvers[type].validator(value)
}

function validateType(type: keyof IResolvers) {
	if (!resolvers[type]) {
		throw new Error(`Cannot find resolver for ${type}`)
	}
}
