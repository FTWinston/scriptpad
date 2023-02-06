function isUpperCase(char: string) {
	return char !== char.toLowerCase();
}

export function getNameInitials(name: string) {    
	// TODO: include second character, if there's an upper case one after the first.

	const [firstChar, ...restOfName] = name;

	let secondChar = '';

	const spaceIndex = restOfName.indexOf(' ');
	if (spaceIndex !== -1) {
		secondChar = restOfName[spaceIndex + 1];
	}
	else {
		secondChar = restOfName.find(isUpperCase) ?? '';
	}

	return `${firstChar}${secondChar}`.toUpperCase();
}
