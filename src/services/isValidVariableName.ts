export function isValidVariableName(name: string) {    
	try {
		new Function(name, 'var ' + name);
	}
    catch {
		return false;
	}

	return true;
}
