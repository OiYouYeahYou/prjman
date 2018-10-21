import { spawn, ChildProcess } from 'child_process'
import { EventEmitter } from 'events'

export interface TaskManager {
	on(event: 'update', listener: () => void): this
}

export class TaskManager extends EventEmitter {
	readonly tasks: { [key: string]: Task } = {}

	createTask(name: string, path: string, command: string, args: string[]) {
		let key = Date.now().toString()
		let iter = 1

		while (this.tasks.hasOwnProperty(key)) {
			key = `${name} ${iter++}`
		}

		this.tasks[key.replace(/\w/, '')] = new Task(
			path,
			command,
			args,
			name,
			iter,
			this
		)

		this.emit('update')
	}

	entries() {
		return Object.entries(this.tasks)
	}
}

export interface TaskManager {
	on(event: 'update', listener: () => void): this
}

export class Task extends EventEmitter {
	output: string[] = []
	running: boolean
	readyToStart = true

	private proc: ChildProcess

	constructor(
		public path: string,
		public command: string,
		public args: string[],
		public name: string,
		public iteration: number,
		public manager: TaskManager
	) {
		super()
	}

	start() {
		if (!this.readyToStart) {
			throw new Error('Unexpected start call')
		}

		this.readyToStart = false

		this.proc = spawn(this.command, this.args, { cwd: this.path })
		this.proc.stdout.on('data', data => this.onData(data))
		this.proc.stderr.on('data', data => this.onData(data))

		this.proc.on('close', code => {
			this.running = false
			this.emit('update')
		})

		this.running = true
		this.emit('update')
	}

	stdin(input: string[]) {
		this.proc.stdin.write(input.join('\n') + '\n')
	}

	private onData(data: Buffer | string) {
		String(data)
			.split('\n')
			.forEach(part => this.output.push(part))

		this.emit('update')
	}
}
