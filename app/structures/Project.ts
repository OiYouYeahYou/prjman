import { getSize } from '../utils/fsPath'
import { readJSON } from '../utils/jsonFile'
import { join } from 'path'
import { EventEmitter } from 'events'

export interface PackageJSON {
	name?: string
	version?: string
	description?: string
	scripts?: { [name: string]: string }
	dependencies?: DependencyObj
	devDependencies?: DependencyObj
	peerDependencies?: DependencyObj
	optionalDependencies?: DependencyObj
}

export interface DependencyObj {
	[pkg: string]: string
}

export type dependencyKeys =
	| 'dependencies'
	| 'devDependencies'
	| 'peerDependencies'
	| 'optionalDependencies'

export class Project extends EventEmitter {
	pkg?: PackageJSON
	size: number

	private _description: string

	private constructor(
		public id: string,
		public path: string,
		public parentCollection: string
	) {
		super()
	}

	get name() {
		return (this.pkg && this.pkg.name) || this.id
	}

	get version() {
		return (this.pkg && this.pkg.version) || 'no versioned'
	}

	get description() {
		return this._description || (this.pkg && this.pkg.description) || ''
	}

	get scripts() {
		return (this.pkg && this.pkg.scripts) || {}
	}

	getDependencies(key: dependencyKeys) {
		return this.pkg && this.pkg[key]
	}

	getSize() {
		return getSize(this.path)
	}

	private apply({ pkg, size }: { pkg: PackageJSON | void; size: number }) {
		this.pkg = pkg as PackageJSON | undefined
		this.size = size

		this.emit('update')
	}

	static create(id: string, path: string, parent: string) {
		const project = new this(id, path, parent)

		Promise.all([
			readJSON<PackageJSON>(join(path, 'package.json')),
			getSize(path),
		]).then(([pkg, size]) => project.apply({ pkg, size }))

		return project
	}
}
