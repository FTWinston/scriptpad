export function makeValidFunctionName(name: string) {
	let result = '';
	let nextUpper = false;

	for (let i=0; i<name.length; i++) {
		const char = name[i];

		if (char === ' ') {
			nextUpper = true;
		}
		else {
			result += nextUpper
				? char.toUpperCase()
				: char.toLowerCase();

			nextUpper = false;
		}
	}

	return result;
}
