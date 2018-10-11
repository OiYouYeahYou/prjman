import { EmittingSet } from './EmittingSet'

interface IOptions {
	paths: string[]
}

export class Settings {
	readonly collections = new EmittingSet<string>()

	constructor(options: IOptions) {
		options.paths.map(path => this.collections.add(path, true))
	}
}

function validatePaths(paths: string[]) {
	return paths.some(path => validatePath(path))
}

function validatePath(path: string) {
	return typeof path === 'string'
}
