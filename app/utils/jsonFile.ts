import { writeFile, readFile } from './fsPath'

export async function readJSON<T = {}>(path: string): Promise<T | void> {
	try {
		const bfr = await readFile(path).catch(() => {})
		return bfr ? JSON.parse(bfr.toString()) : undefined
	} catch {
		return
	}
}

export function writeJSON(path: string, data: any) {
	return writeFile(path, JSON.stringify(data, undefined, '/t'))
}
