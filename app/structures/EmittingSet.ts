import { EventEmitter } from 'events'

export declare interface EmittingSet<T> {
	on(event: 'change', listener: () => void): this
	on(event: 'add', listener: (value: T) => void): this
	on(event: 'remove', listener: (value: T) => void): this
}

export class EmittingSet<T> extends EventEmitter {
	private _data: T[] = []

	get length() {
		return this._data.length
	}
	set length(val: number) {
		this._data.length = val
	}

	constructor() {
		super()
	}

	add(value: T, noEmit = false) {
		if (!this._data.includes(value)) {
			this._data.push(value)

			if (!noEmit) {
				this._emitChange('add', value)
			}
		}
	}

	remove(value: T) {
		const index = this._data.indexOf(value)

		if (index > -1) {
			this._data.splice(index, 1)
			this._emitChange('remove', value)
		}
	}

	sort(fn?: (a: T, b: T) => number) {
		this._data.sort(fn)
	}

	has(value: T) {
		return this._data.includes(value)
	}

	map<M>(fn: (val: T, i: number) => M): M[] {
		return this._data.map((val, i) => fn(val, i))
	}

	forEach(fn: (val: T, i: number) => void) {
		this._data.forEach((val: T, i: number) => fn(val, i))

		return this
	}

	toArray() {
		return Array.from(this._data)
	}

	private _emitChange(type: 'add' | 'remove', value?: T) {
		this.emit(type, value)
		this.emit('change')
	}
}
