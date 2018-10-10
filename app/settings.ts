import { Settings } from './structures/Settings'
import { join } from 'path'
import { homedir } from 'os'

export const settings = new Settings({
	paths: [join(homedir(), 'code')],
})
