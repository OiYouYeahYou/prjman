import { homedir } from 'os'
import { normalize, isAbsolute, resolve } from 'path'
import {
	lstat,
	exists as _exists,
	readdir as _readdir,
	readFile as _readFile,
	writeFile as _writeFile,
} from 'fs'
import reject = require('lodash/reject')
import { spawn } from 'child_process'
import { inherits } from 'util'

const _getSize: (
	path: string,
	regex: RegExp | undefined,
	cb: (err: any, size: number) => void
) => void = require('get-folder-size')

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

export function getSize(path: string, regex?: RegExp) {
	return new Promise<number>((resolve, reject) => {
		_getSize(path, regex, (err, size) => {
			if (err) {
				reject(err)
			}

			resolve(size)
		})
	})
}

export function rimraf(...paths: string[]) {
	// Using relative paths may lead to unexpected affects
	// So we don't want allow anything but absolute paths
	const invalidPaths = paths.filter(p => !isAbsolute(p))
	if (invalidPaths.length) {
		return Promise.reject(
			new Error(`Only use absolute paths: ${invalidPaths.join(',')}`)
		)
	}

	return new Promise((resolve, reject) => {
		const rm = spawn('rm', ['-rfv', ...paths])

		rm.stdout.on('data', data => {
			console.log(`stdout: ${data}`)
		})

		rm.stderr.on('data', data => {
			console.log(`stderr: ${data}`)
		})

		rm.on('close', code => (code === 0 ? resolve : reject)(code))
	})
}
