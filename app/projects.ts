import { readdirSync, lstatSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { resolve } from 'npm-package-arg'
import { Project, PackageJSON } from './structures/Project'

export interface IProjectStore {
	[id: string]: Project
}

export interface DependencyObj {
	[pkg: string]: string
}

export const projects = (() => {
	const projects: IProjectStore = {}
	const codePath = join(homedir(), 'code')

	readdirSync(codePath).forEach(id => {
		const path = join(codePath, id)

		if (!lstatSync(path).isDirectory()) {
			return
		}

		const pkg =
			readJSON<PackageJSON>(join(path, 'package.json')) || undefined

		projects[id] = Project.create({ id, path, pkg })
	})

	return projects
})()

export const projectEntries = Object.entries(projects).sort(([a], [b]) =>
	a.localeCompare(b)
)

export function getProject(id: string) {
	return projects[id]
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
