// tslint:disable:no-var-requires

import { RegistryResponse } from './npm-registry-response'

const npmFetch: {
	json(path: string): Promise<RegistryResponse>
} = require('npm-registry-fetch')
const _validatePackageName: (
	input: string
) => {
	validForNewPackages: boolean
	validForOldPackages: boolean
	warnings: string[]
	errors: string[]
} = require('validate-npm-package-name')

export function validatePackageName(name: string) {
	const result = _validatePackageName(name)

	return result.validForNewPackages || result.validForOldPackages
}

export async function fetchPackageInfo(name: string) {
	const pkg = await npmFetch.json(name).catch(() => {})

	return pkg
}

export async function getPackageInfo(name: string) {
	if (!validatePackageName(name)) {
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
