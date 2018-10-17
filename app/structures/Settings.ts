import { readJSON, writeJSON } from '../utils/jsonFile'
import { exists } from '../utils/fsPath'
import { EmittingSet } from './EmittingSet'

interface RawData {
	collections: string[]
}

export class Settings {
	readonly collections = new EmittingSet<string>()

	constructor(private configPath: string) {
		this.collections.on('change', () => this.save())
	}

	async load() {
		let data: RawData | void
		const configExists = await exists(this.configPath)

		if (configExists) {
			data = await readJSON<RawData>(this.configPath)
		}

		if (!data || !configExists) {
			data = Settings.constructNewData()
			await writeJSON(this.configPath, data)
		}

		data.collections.forEach(path => this.collections.add(path))
	}

	async save() {
		await writeJSON(this.configPath, {
			collections: this.collections.toArray(),
		})
	}

	static constructNewData(): RawData {
		return { collections: [] }
	}
}
