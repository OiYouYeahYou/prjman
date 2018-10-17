import { Settings } from './structures/Settings'
import { prjmanMainConfigPath } from './utils/constants'

export let settings = new Settings(prjmanMainConfigPath)
settings.load()
