import { spawn } from 'child_process'

import { VersioningTools } from './VersioningTools'

import { Project } from '../Project'

export class Hg extends VersioningTools {
	getCommitCount() {
		return new Promise<void>((resolve, reject) => {
			const status = spawn(
				'hg',
				['id', '--num', '--rev', 'tip'],
				this._spawnOptions
			)

			status.stdout.on('data', data => {
				this.commitCount = Number(String(data))
			})

			status.on('close', code => {
				if (code !== 0) {
					reject(new Error(`hg code ${code} for ${this.path}`))
				}

				resolve()
			})
		})
	}

	getDirtyList() {
		return new Promise<void>((resolve, reject) => {
			const status = spawn('hg', ['status'], this._spawnOptions)

			const d: any[] = []

			status.stdout.on('data', data => {
				d.push(
					...data
						.toString()
						.split('\n')
						.map(s => s.trim())
				)
			})

			status.on('close', code => {
				if (code !== 0) {
					reject(new Error(`hg code ${code} for ${this.path}`))
				}

				this.dirty = d.length !== 0
				this.dirtyCount = d.length
				this.dirtyWashing = d

				resolve()
			})
		})
	}

	getLastCommitDate() {
		// hg log -l 1
		return new Promise<void>((resolve, reject) => {
			if (this.commitCount === 0) {
				return
			}
			const status = spawn('hg', ['log', '-l', '1'], this._spawnOptions)

			const d: any[] = []

			status.stdout.on('data', data => {
				d.push(
					...data
						.toString()
						.split('\n')
						.map(s => s.trim())
				)
			})

			status.on('close', code => {
				if (code !== 0) {
					reject(new Error(`hg code ${code} for ${this.path}`))
				}

				const dateLine = d.filter(ln => /date:/.test(ln))[0]

				if (!dateLine) {
					resolve()
				}
				this.lastCommitDate = new Date(
					String(dateLine)
						.replace(/date:/, '')
						.trim()
				)

				resolve()
			})
		})
	}

	static readonly type = 'hg'

	static async test(project: Project) {
		return project.rootFiles.includes('.hg')
	}
}
