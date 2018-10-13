import { join } from 'path'
import { Project, PackageJSON } from './Project'
import { settings } from '../settings'
import { readJSON } from '../utils/jsonFile'
import { isDirectory, readdir } from '../utils/fsPath'
import { EventEmitter } from 'events'
import { EmittingSet } from './EmittingSet'

export declare interface ProjectStore {
	once(event: 'ready', listener: () => void): this
}

export class ProjectStore extends EventEmitter {
	isReady: boolean = true

	private _projects: { [id: string]: Project } = {}

	constructor(
		private _collections: EmittingSet<string> = settings.collections
	) {
		super()

		this._collections.on('add', path => this.lookForProjects(path))
		this._collections.on('remove', path => this.removeOrphans(path))

		Promise.all(this._collections.map(path => this.lookForProjects(path)))
	}

	getProject(id: string) {
		return this._projects[id]
	}

	entries() {
		return Object.entries(this._projects).sort(([a], [b]) =>
			a.localeCompare(b)
		)
	}

	private async lookForProjects(parentCollection: string) {
		this.isReady = false

		const files = await readdir(parentCollection)
		const proms = files.map(file =>
			this.lookForProject(parentCollection, file)
		)

		return Promise.all(proms)
			.catch(console.error.bind(console))
			.then(() => this.setReady())
	}

	private async lookForProject(parentCollection: string, file: string) {
		const path = join(parentCollection, file)

		if (!(await isDirectory(path))) {
			return
		}

		const pkg = await readJSON<PackageJSON>(join(path, 'package.json'))

		this._projects[file] = Project.create({
			id: file,
			path,
			pkg,
			parentCollection,
		})
	}

	private removeOrphans(collectionPath: string) {
		Object.entries(this._projects).forEach(
			([key, { parentCollection }]) => {
				if (parentCollection === collectionPath) {
					delete this._projects[key]
				}
			}
		)
	}

	private setReady() {
		this.isReady = true
		this.emit('ready')
	}
}
