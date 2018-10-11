import { homedir } from 'os'
import { normalize } from 'path'
import { lstat, exists as _exists } from 'fs'

export function normalise(path: string = '') {
	return path ? normalize(convertToAbsolute(path)) : ''
}

export function convertToAbsolute(path: string = '') {
	return path.replace(/^~/, homedir())
}

export function exists(path: string) {
	return new Promise(resolve => _exists(path, resolve))
}

export function isDirectory(path: string) {
	return new Promise(resolve =>
		lstat(path, (err, stats) => {
			resolve(err ? false : stats.isDirectory())
		})
	)
}
