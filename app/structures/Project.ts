import { getSize, readdir, rimraf } from '../utils/fsPath'
import { readJSON } from '../utils/jsonFile'
import { join } from 'path'
import { EventEmitter } from 'events'
import VersioningTools from '../versioning'

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

	hasModules: boolean
	hasNpmLock: boolean
	hasYarnLock: boolean
	isNode: boolean
	isUnderRemoval: boolean = false
	isRemoved: boolean = false
	rootFiles: string[]
	versioning: VersioningTools | null

	private _description: string

	private constructor(
		public dirName: string,
		public path: string,
		public parentCollection: string
	) {
		super()
	}

	get name() {
		return (this.pkg && this.pkg.name) || this.dirName
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

	get id() {
		return this.path.replace(/\//g, '_')
	}

	getDependencies(key: dependencyKeys) {
		return this.pkg && this.pkg[key]
	}

	getSize() {
		return getSize(this.path)
	}

	update() {
		return this.apply().catch(err => console.error(err))
	}

	deleteFromDisk() {
		this.isUnderRemoval = true

		return rimraf(this.path)
			.then(code => {
				this.isUnderRemoval = false
				this.isRemoved = true

				this.emit('change')
				this.emit('removed')
			})
			.catch(code => {
				this.isUnderRemoval = false
				console.log(code)
			})
	}

	private async apply() {
		const [rootFiles] = await Promise.all([readdir(this.path)])
		this.rootFiles = rootFiles

		await Promise.all<any>([
			...rootFiles.map(file => {
				const handler = files.get(file)
				if (handler) {
					return handler(this)
				}
			}),
			// Promise.resolve(1.1)
			getSize(this.path)
				.catch(sizeErrorHandle)
				.then(size => (this.size = size)),
		])

		const ver = (this.versioning = await VersioningTools.run(this))

		if (ver) {
			await ver.getCommitCount()
			await ver.getDirtyList()
			await ver.getLastCommitDate()
		}

		this.emit('update')
	}

	static create(dirName: string, path: string, parent: string) {
		const project = new this(dirName, path, parent)

		project.apply()

		return project
	}
}

const sizeErrorHandle = (err: any) => {
	console.error(err)
	return -1
}

type fileNameHandler = (project: Project) => Promise<void> | void

const files = new Map(
	Object.entries<fileNameHandler>({
		'package-lock.json'(project) {
			project.hasNpmLock = true
		},

		'yarn.lock'(project) {
			project.hasYarnLock = true
		},

		node_modules(project) {
			project.hasModules = true
		},

		async 'package.json'(project) {
			project.isNode = true
			project.pkg = (await readJSON(
				join(project.path, 'package.json')
			)) as PackageJSON | undefined
		},
	})
)
