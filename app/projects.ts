import { readdirSync, lstatSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

interface IProjects {
	[id: string]: IProject
}

export interface PackageJSON {
	name?: string
	description?: string
	scripts?: { [name: string]: string }
}

interface IProject {
	id: string
	path: string
	pkg: PackageJSON | null
	readmePath: string | null
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
		const readmePath = ''
		const rmexists = existsSync(readmePath)

		projects[id] = {
			id,
			path,
			pkg,
			readmePath: rmexists ? readmePath : null,
		}
	})

	return projects
})()

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
