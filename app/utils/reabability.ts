const k = 1024
const magnitude = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

export function formatBytes(bytes: number, fractions = 0) {
	if (bytes === 0) {
		return '0 B'
	}

	const fractionalPoints = fractions <= 0 ? 0 : fractions
	const orderOfMagnitude = Math.floor(Math.log(bytes) / Math.log(k))

	const n = parseFloat(
		(bytes / Math.pow(k, orderOfMagnitude)).toFixed(fractionalPoints)
	)
	const me = magnitude[orderOfMagnitude]

	return `${n} ${me}`
}
