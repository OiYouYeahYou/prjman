import { readJSON, writeJSON } from '../utils/jsonFile'
import { exists } from '../utils/fsPath'
import { EmittingSet } from './EmittingSet'
import { EventEmitter } from 'events'
import { configSpec, specTypes } from '../configs'
import * as _ from 'lodash'

interface RawData {
	collections: string[]
	configs: [string, any][]
}

export class Settings extends EventEmitter {
	readonly collections = new EmittingSet<string>()
	private _configs: Map<string, any>
	private _loaded = false
	private _readFromFile = false

	get loaded() {
		return this._loaded
	}
	get readFromFile() {
		return this._readFromFile
	}

	constructor(private configPath: string) {
		super()
		this.collections.on('change', () => this.save())
	}

	async load() {
		let data: RawData | void
		const configExists = await exists(this.configPath)

		if (configExists && process.env.PM_PREVENT_CONFIG_READ !== 'true') {
			data = await readJSON<RawData>(this.configPath)
			this._readFromFile = true
		}

		if (!data || !configExists) {
			data = Settings.constructNewData()
			await writeJSON(this.configPath, data)
		}

		this._loaded = true
		data.collections.forEach(path => this.collections.add(path))
		this._configs = new Map(data.configs || [])
	}

	async save() {
		this._saveDebounce()
	}

	private _saveDebounce = _.debounce(() => this.writeJSON(), 2.5 * 1000)

	private writeJSON() {
		writeJSON(this.configPath, {
			collections: this.collections.toArray(),
			configs: Array.from(this._configs),
		} as RawData).catch(err => console.error(err))
	}

	getConfig(key: string) {
		const spec = configSpec[key]

		if (!spec) {
			throw new Error(`Unexpected config key: ${key}`)
		}

		return this._configs.has(key)
			? this._configs.get(key)
			: spec.defaultValue
	}

	setConfig(key: string, value: any) {
		const spec = configSpec[key]

		if (!spec) {
			throw new Error(`Unexpected config key: ${key}`)
		}

		const isValid = specTypes[spec.type](value, spec)

		if (!isValid) {
			throw new Error(
				`Unexpected value: ${key}: ${JSON.stringify(value)}`
			)
		}

		this._configs.set(key, value)
		this.save()
	}

	static constructNewData(): RawData {
		return {
			collections: [],
			configs: [],
		}
	}
}
