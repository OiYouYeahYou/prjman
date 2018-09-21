import { readdirSync, lstatSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

export interface IProjects {
	[id: string]: IProject
}

export interface PackageJSON {
	name?: string
	description?: string
	scripts?: { [name: string]: string }
}

export interface IProject {
	id: string
	path: string
	pkg: PackageJSON | null
}

export const projects = (() => {
	const projects: IProjects = {}
	const codePath = join(homedir(), 'code')

	readdirSync(codePath).forEach(id => {
		const path = join(codePath, id)

		if (!lstatSync(path).isDirectory()) {
			return
		}

		const pkg = readJSON(join(path, 'package.json'))

		projects[id] = {
			id,
			path,
			pkg,
		}
	})

	return projects
})()

export const projectEntries = Object.entries(projects).sort(([a], [b]) =>
	a.localeCompare(b)
)

export function getProject(id: string) {
	return projects[id]
}

export function getPath(id: string) {
	return projects[id].path
}

function readJSON<T = {}>(path: string): T | null {
	let json: T

	try {
		json = JSON.parse(readFileSync(path).toString())
	} catch {
		return null
	}

	return json
}
