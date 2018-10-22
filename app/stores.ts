import { Settings } from './structures/Settings'
import { homedir } from 'os'
import { join } from 'path'
import { ProjectStore } from './structures/ProjectStore'

export const prjmanMainConfigPath = join(
	homedir(),
	process.env.NODE_ENV === 'production' ? '.prjman' : '.prjman-dev'
)

export const settings = new Settings(prjmanMainConfigPath)
export const projectStore = new ProjectStore(settings.collections)
settings.load()
