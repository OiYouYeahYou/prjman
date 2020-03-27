import { resolve, Result } from 'npm-package-arg'

import { RegistryResponse } from './npm-registry-response'

const npmFetch: {
	json(path: string): Promise<RegistryResponse>
} = require('npm-registry-fetch')
export const validatePackageName: (
	input: string
) => {
	validForNewPackages: boolean
	validForOldPackages: boolean
	warnings: string[]
	errors: string[]
} = require('validate-npm-package-name')

export async function fetchPackageInfo(name: string) {
	const pkg = await npmFetch.json(name).catch(() => {})

	return pkg
}

export async function getPackageInfo(name: string) {
	const { validForNewPackages, validForOldPackages } = validatePackageName(
		name
	)

	if (!validForNewPackages && !validForOldPackages) {
		return Promise.resolve()
	}

	return fetchPackageInfo(name)
}

export async function getPackageRepo(name: string) {
	const pkg = await getPackageInfo(name)

	if (!pkg) {
		return
	}

	return pkg.repository
}

export interface CombinedNameSpecParserResult {
	name: string
	spec: string
	initialValue: string
	installString: string
	resolution: Result
}

export function combinedNameSpecStringListParser(value: string) {
	return value.split(',').map(combinedNameSpecParser)
}

export function combinedNameSpecParser(
	initialValue: string
): CombinedNameSpecParserResult | undefined {
	let isScoped = false
	initialValue = initialValue.trim()

	if (initialValue[0] === '@') {
		isScoped = true
		initialValue = initialValue.substring(1)
	}

	const stringParts = initialValue.split('@').map(v => v.trim())
	const { length } = stringParts

	if (!(length === 1 || length === 2)) {
		return
	}

	let [name, spec] = stringParts

	if (isScoped) {
		name = '@' + name
	}

	const { validForNewPackages, validForOldPackages } = validatePackageName(
		name
	)

	if (!validForNewPackages && !validForOldPackages) {
		return
	}

	try {
		const resolution = resolve(name, spec)
		const installString = name + (spec ? `@${spec}` : '')

		return { name, spec, initialValue, resolution, installString }
	} catch (error) {
		return
	}
}
