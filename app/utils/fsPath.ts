import { homedir } from 'os'
import { normalize } from 'path'
import {
	lstat,
	exists as _exists,
	readdir as _readdir,
	readFile as _readFile,
	writeFile as _writeFile,
} from 'fs'

export function normalise(path: string = '') {
	return path ? normalize(convertToAbsolute(path)) : ''
}

export function convertToAbsolute(path: string = '') {
	return path.replace(/^~/, homedir())
}

export function exists(path: string) {
	return new Promise<boolean>(resolve => _exists(path, resolve))
}

export function isDirectory(path: string) {
	return new Promise<boolean>(resolve =>
		lstat(path, (err, stats) => {
			resolve(err ? false : stats.isDirectory())
		})
	)
}

export function readdir(path: string) {
	return new Promise<string[]>(resolve =>
		_readdir(path, (err, files) => resolve(err ? [] : files))
	)
}

export function readFile(path: string) {
	return new Promise<Buffer>((resolve, reject) =>
		_readFile(path, (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	)
}

export function writeFile(path: string, data: any) {
	return new Promise<void>((resolve, reject) =>
		_writeFile(path, data, err => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		})
	)
}
