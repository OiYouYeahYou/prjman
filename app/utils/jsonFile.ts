import { writeFile, readFile, exists } from './fsPath'

const detectIndent: (
	json: string
) => {
	amount: number
	type: null | 'space' | 'tab'
	indent: string
} = require('detect-indent')

export async function readJSON<T = {}>(path: string): Promise<T | void> {
	try {
		const bfr = await readFile(path).catch(() => {})
		return bfr ? JSON.parse(bfr.toString()) : undefined
	} catch {
		return
	}
}

export async function writeJSON(path: string, data: any, indent = '\t') {
	if (await exists(path)) {
		const contents = await readFile(path)

		if (contents) {
			const text = contents.toString()

			try {
				// Check if text parses as JSON
				JSON.parse(text)

				indent = detectIndent(text).indent
			} catch (e) {}
		}
	}

	return writeFile(path, JSON.stringify(data, undefined, indent) + '\n')
}
