interface UserAndEmail {
	name: string
	email: string
}

export interface RegistryResponse {
	_id: string
	_rev: string
	name: string
	time: {
		modified: string
		created: string
		[version: string]: string
	}
	maintainers: UserAndEmail[]
	'dist-tags': { latest: string }
	description: string
	readme: string
	versions: {
		[version: string]: {
			name: string
			version: string
			description: string
			main: string
			scripts: { [name: string]: string }
			repository: {
				type: string
				url: string
			}
			keywords: string[]
			author: UserAndEmail
			license: string
			bugs: { url: string }
			homepage: string
			dependencies: { [version: string]: string }
			gitHead: string
			_id: string
			_shasum: string
			_from: string
			_npmVersion: string
			_nodeVersion: string
			_npmUser: UserAndEmail
			dist: {
				shasum: string
				tarball: string
			}
			maintainers: UserAndEmail[]
			directories: {}
			deprecated: string
		}
	}
	homepage: string
	keywords: string[]
	repository: {
		type: string
		url: string
	}
	author: UserAndEmail
	bugs: { url: string }
	license: string
	readmeFilename: string
	users: { [name: string]: true }
	_attachments: {}
}
