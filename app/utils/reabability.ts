const k = 1024
// prettier-ignore
const magnitude = Object.freeze([' B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'])

export function formatBytes(bytes: number, fractions = 0): string {
	if (bytes === 0) {
		return `0 ${rightPad('', fractions + 4)} B`
	}

	if (bytes < 0) {
		return '-' + formatBytes(-bytes, fractions)
	}

	const fractionalPoints = fractions <= 0 ? 0 : fractions
	const orderOfMagnitude = Math.floor(Math.log(bytes) / Math.log(k))

	let n: number | string = parseFloat(
		(bytes / Math.pow(k, orderOfMagnitude)).toFixed(fractionalPoints)
	)
	const me = magnitude[orderOfMagnitude]

	if (fractions !== 0) {
		let [a, b] = n.toString().split('.')

		if (b) {
			b = rightPad(b, fractions)
			n = `${a}.${b}`
		} else {
			b = rightPad('', fractions)
			n = `${a} ${b}`
		}
	}

	return `${n} ${me}`
}

export function rightPad(val: string | number, len: number, padder = ' ') {
	val = String(val)
	while (val.length < len) { val += padder }
	return val
}

export function leftPad(val: string | number, len: number, padder = ' ') {
	val = String(val)
	while (val.length < len) { val = padder + val }
	return val
}
