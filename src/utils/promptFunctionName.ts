import { FunctionId } from '../data/IFunction';

export function promptFunctionName(currentId: FunctionId | null, existingFunctionIds: readonly string[]): string | null {
    let id: string | null;

    do {
        id = prompt('Name this function', currentId ?? 'New Function')?.trim() ?? null;
        if (id === null || id === currentId) {
            return null;
        }
    } while (!id || existingFunctionIds.includes(id));

	return id;
}
