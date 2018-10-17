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
