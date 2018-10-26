import { join } from 'path'
import { Project } from './Project'
import { settings } from '../stores'
import { isDirectory, readdir } from '../utils/fsPath'
import { EventEmitter } from 'events'
import { EmittingSet } from './EmittingSet'

export declare interface ProjectStore {
	once(event: 'ready', listener: () => void): this
	on(event: 'change', listener: () => void): this
}

export class ProjectStore extends EventEmitter {
	get isReady() {
		return this._isReady
	}

	private _isReady = true
	private _projects: { [id: string]: Project } = {}

	constructor(
		private _collections: EmittingSet<string> = settings.collections
	) {
		super()

		this._collections.on('add', path => this.collectionsToProjects(path))
		this._collections.on('remove', path => this.removeOrphans(path))

		this._collections.forEach(path => this.collectionsToProjects(path))
	}

	getProject(id: string) {
		return this._projects[id]
	}

	entries() {
		return Object.entries(this._projects).sort(([a], [b]) =>
			a.localeCompare(b)
		)
	}

	private async collectionsToProjects(path?: string) {
		this.setNotReady()

		if (path) {
			await this.lookForProjects(path)
		} else {
			await Promise.all(
				this._collections.map(path => this.lookForProjects(path))
			)
		}

		this.setReady()
	}

	private async lookForProjects(parentCollection: string) {
		const files = await readdir(parentCollection)
		const proms = files.map(file =>
			this.lookForProject(parentCollection, file)
		)

		await Promise.all(proms).catch(console.error.bind(console))
	}

	private async lookForProject(parent: string, file: string) {
		const path = join(parent, file)

		if (!(await isDirectory(path))) {
			return
		}

		const project = Project.create(file, path, parent)

		this.addProject(file, project)
	}

	private addProject(id: string, project: Project) {
		this._projects[id] = project

		this.emit('change')
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

	private setNotReady() {
		this._isReady = false
	}

	private setReady() {
		this._isReady = true
		this.emit('change')
		this.emit('ready')
	}
}
