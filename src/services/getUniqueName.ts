export function getUniqueName(entries: ReadonlyMap<string, unknown>, baseName: string) {
    let name = baseName;
    let number = 1;
    
    while (entries.has(name)) {
        name = `${baseName} ${++number}`;
    }

    return name;
}
