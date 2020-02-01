import { VersioningTools } from './VersioningTools'
import { Project } from '../Project'

export class Git extends VersioningTools {
	async getCommitCount() {
		// git rev-list --all --count
		return this.spawn<void>(
			'git',
			['rev-list', '--all', '--count'],
			(err, d) => {
				if (err) {
					return
				}

				this.commitCount = Number(d[0])
			}
		)
	}

	getDirtyList() {
		return this.spawn<void>('git', ['status', '-s'], (err, d) => {
			this.dirty = err ? false : d.length !== 0
			this.dirtyCount = err ? 0 : d.length
			this.dirtyWashing = err ? [] : d
		})
	}

	getLastCommitDate() {
		// git log -1 --format=%cd
		return this.spawn<void>(
			'git',
			['log', '-1', '--format=%cd'],
			(err, d) => {
				try {
					this.lastCommitDate = new Date(d.join())
				} catch (error) {}
			}
		)
	}

	static readonly type = 'git'

	static async test(project: Project) {
		// It is possible that git looks for a different path than `.git`
		// But for now I'm not chasing edge cases, like `.whtevr_git`
		return project.rootFiles.includes('.git')
	}
}
