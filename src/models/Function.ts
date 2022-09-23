import { FunctionId } from '../data/identifiers';
import { Value, ValueType } from '../data/Value';

export class Function {
    static allFunctions = new Map<FunctionId, Function>();

    constructor(
        readonly id: FunctionId,
        readonly inputs: readonly ValueType[],
        readonly outputs: readonly ValueType[],
        readonly run: (inputs: readonly Value[], configuration: Readonly<Record<string, string>>) => Value[]
    ) {
        Function.allFunctions.set(id, this);
    }
}