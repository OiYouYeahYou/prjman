import { Project } from '../../structures/Project'

export const filters: { [key: string]: (project: Project) => boolean } = {
	none() {
		return true
	},

	isDirty(p) {
		return !!p.versioning && p.versioning.dirty
	},

	isNode(p) {
		return p.isNode
	},

	isHg(p) {
		// @ts-ignore
		return !!p.versioning && p.versioning.type == 'hg'
	},
}

export const filterKeys = Object.keys(filters)
