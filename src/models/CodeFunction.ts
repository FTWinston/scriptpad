import { FunctionId } from '../data/identifiers';
import { Value, ValueType } from '../data/Value';
import { ParameterDeclaration, ParameterDefinitions, ParameterValues } from './FunctionParameter';

const allFunctions = new Map<FunctionId, IFunction>();

export function getFunction(id: FunctionId) {
    return allFunctions.get(id);
}

type RunFunction<TParameterValues extends Record<string, string>> = (inputs: readonly Value[], parameters: TParameterValues) => Value[];


export interface IFunction {
    readonly id: FunctionId;
    readonly inputs: readonly ValueType[];
    readonly outputs: readonly ValueType[];

    performRun(inputs: readonly Value[], parameterValues: Readonly<Record<string, string>>): Value[];
}

interface Initializer<TParameterDeclaration extends ParameterDeclaration> {
    id: FunctionId;
    inputs: readonly ValueType[];
    outputs: readonly ValueType[];
    parameters: ParameterDefinitions<TParameterDeclaration>;
    run: RunFunction<ParameterValues<TParameterDeclaration>>;
}

export class CodeFunction<TParameterDeclaration extends ParameterDeclaration> implements IFunction {
    constructor(init: Initializer<TParameterDeclaration>) {
        this.id = init.id;
        this.inputs = init.inputs;
        this.outputs = init.outputs;
        this.parameters = init.parameters;
        this.run = init.run;

        allFunctions.set(this.id, this);
    }

    public readonly id: FunctionId;
    public readonly inputs: readonly ValueType[];
    public readonly outputs: readonly ValueType[];
    public readonly parameters: ParameterDefinitions<TParameterDeclaration>;
    private readonly run: RunFunction<ParameterValues<TParameterDeclaration>>;

    public performRun(inputs: readonly Value[], parameterValues: Readonly<Record<string, string>>) {
        return this.run(inputs, parameterValues as ParameterValues<TParameterDeclaration>);
    }
}
