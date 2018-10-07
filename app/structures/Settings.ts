import { EmittingSet } from './EmittingSet'

interface IOptions {
	paths: string[]
}

export class Settings {
	readonly paths = new EmittingSet()

	constructor(options: IOptions) {
		options.paths.map(path => this.paths.add(path, true))
	}
}

function validatePaths(paths: string[]) {
	return paths.some(path => validatePath(path))
}

function validatePath(path: string) {
	return typeof path === 'string'
}
