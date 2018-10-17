import { homedir } from 'os'
import { join } from 'path'

export const prjmanMainConfigPath = join(
	homedir(),
	process.env.NODE_ENV === 'production' ? '.prjman' : '.prjman-dev'
)
