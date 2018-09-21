import { spawnSync } from 'child_process'

export function openInEditor(path: string) {
	return spawnSync('code', [path])
}
