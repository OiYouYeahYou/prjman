import { VersioningTools } from './structures/versioning/VersioningTools'

import { Git } from './structures/versioning/Git'
import { Hg } from './structures/versioning/Hg'

VersioningTools.register(Git)
VersioningTools.register(Hg)

export default VersioningTools
