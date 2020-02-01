import { Project } from '../Project'
import { spawn } from 'child_process'

interface VersioningStatics {
	readonly type: string
	test(project: Project): Promise<boolean>
}

export abstract class VersioningTools {
	protected isNode: boolean
	protected removed = false

	protected constructor(project: Project) {
		this.path = project.path
		this._spawnOptions = Object.freeze({ cwd: this.path })
	}

	protected readonly path: any
	protected readonly _spawnOptions: Readonly<{ cwd: string }>

	static register(klass: typeof VersioningTools & VersioningStatics) {
		const key = klass.type

		if (this.tools.has(key)) {
			throw new Error(
				`A versioning tool has already been registered with the key ${key}`
			)
		}

		this.toolkeys.push(key)
		this.tools.set(key, klass)
	}

	static async run(project: Project): Promise<VersioningTools | null> {
		for (const toolKey of this.toolkeys) {
			const Tool = this.tools.get(toolKey)
			if (!Tool) {
				continue
			}
			if (!(await Tool.test(project))) {
				continue
			}

			const tool = new Tool(project)
			// @ts-ignore
			tool.type = Tool.type
			return tool
		}

		return null
	}
	dirty: boolean = false
	dirtyCount = 0
	dirtyWashing: string[] = []
	commitCount = 0
	lastCommitDate: Date
	readonly tool: string
	type: string

	abstract getCommitCount(): Promise<void>
	abstract getDirtyList(): Promise<void>
	abstract getLastCommitDate(): Promise<void>

	protected spawn<R = void>(
		cmd: string,
		args: string[] | ReadonlyArray<string> | undefined,
		cb: (err: any, d: string[]) => R
	) {
		return new Promise<R>((resolve, reject) => {
			const status = spawn(cmd, args, this._spawnOptions)

			const d: any[] = []

			status.stdout.on('data', data => {
				d.push(
					...data
						.toString()
						.split('\n')
						.map(s => s.trim())
				)
			})

			status.stderr.on('data', data => {
				d.push(
					...data
						.toString()
						.split('\n')
						.map(s => s.trim())
				)
			})

			status.on('close', code => {
				if (code != 0) {
					// @ts-ignore
					return resolve(cb(d, undefined))
				}

				resolve(cb(null, d))
			})
		})
	}

	private static readonly tools = new Map<
		string,
		typeof VersioningTools & VersioningStatics
	>()
	private static readonly toolkeys: string[] = []
}
