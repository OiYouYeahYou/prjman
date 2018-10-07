import { EventEmitter } from 'events'

export declare interface EmittingSet<T> {
	on(event: 'change', listener: (value: T) => void): this
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
				this._emitChange(value)
			}
		}
	}

	sort() {}

	has(value: T) {
		return this._data.includes(value)
	}

	map<M>(fn: (val: T, i: number) => M): M[] {
		return this._data.map((val, i) => fn(val, i))
	}

	remove(value: T) {}

	private _emitChange(value?: T) {
		this.emit('change', value)
	}
}
