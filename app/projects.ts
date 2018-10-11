import { readdirSync, lstatSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { Project, PackageJSON } from './structures/Project'
import { settings } from './settings'

export interface IProjectStore {
	[id: string]: Project
}

export interface DependencyObj {
	[pkg: string]: string
}

const projects: IProjectStore = {}
const { collections } = settings
collections.forEach(lookForProjects)
collections.on('add', lookForProjects)
collections.on('remove', removeListedProjects)

function lookForProjects(parentCollection: string) {
	readdirSync(parentCollection).forEach(id => {
		const path = join(parentCollection, id)

		if (!lstatSync(path).isDirectory()) {
			return
		}

		const pkg = readJSON<PackageJSON>(join(path, 'package.json'))

		projects[id] = Project.create({ id, path, pkg, parentCollection })
	})
}

function removeListedProjects(collectionPath: string) {
	Object.entries(projects).forEach(([key, { parentCollection }]) => {
		if (parentCollection === collectionPath) {
			delete projects[key]
		}
	})
}

export const projectEntries = () =>
	Object.entries(projects).sort(([a], [b]) => a.localeCompare(b))

export function getProject(id: string) {
	return projects[id]
}

function readJSON<T = {}>(path: string): T | void {
	let json: T

	try {
		json = JSON.parse(readFileSync(path).toString())
	} catch {
		return
	}

	return json
}
