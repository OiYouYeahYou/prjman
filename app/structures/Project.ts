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

export class Project {
	id: string
	path: string
	pkg?: PackageJSON
	parentCollection: string

	private _description: string

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

	static create(options: {
		id: string
		path: string
		pkg: PackageJSON | void
		parentCollection: string
	}): Project {
		return Object.assign(new this(), options)
	}
}
