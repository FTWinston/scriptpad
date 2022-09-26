import { FunctionId } from '../data/identifiers';
import { Value, RawValuesFromTypes, ValueType, createValueFromRaw } from '../data/Value';
import { ParameterDeclaration, ParameterDefinitions, ParameterValues } from './FunctionParameter';

const allFunctions = new Map<FunctionId, IFunction>();

export function getFunction(id: FunctionId) {
    return allFunctions.get(id);
}

type RunFunction<
    TInputs extends readonly ValueType[],
    TOutputs extends readonly ValueType[],
    TParameterValues extends Record<string, string>
> = (inputs: RawValuesFromTypes<TInputs>, parameters: TParameterValues) => RawValuesFromTypes<TOutputs>;


export interface IFunction {
    readonly id: FunctionId;
    performRun(inputs: readonly Value[], parameterValues: Readonly<Record<string, string>>): Value[];
}

interface Initializer<
    TInputs extends readonly ValueType[],
    TOutputs extends readonly ValueType[],
    TParameterDeclaration extends ParameterDeclaration
> {
    id: FunctionId;
    parameters: ParameterDefinitions<TParameterDeclaration>;
    run: RunFunction<TInputs, TOutputs, ParameterValues<TParameterDeclaration>>;
}

export class CodeFunction<
    TInputs extends readonly ValueType[],
    TOutputs extends readonly ValueType[],
    TParameterDeclaration extends ParameterDeclaration
> implements IFunction {
    constructor(init: Initializer<TInputs, TOutputs, TParameterDeclaration>) {
        this.id = init.id;
        this.parameters = init.parameters;
        this.run = init.run;

        allFunctions.set(this.id, this);
    }

    public readonly id: FunctionId;
    public readonly parameters: ParameterDefinitions<TParameterDeclaration>;
    private readonly run: RunFunction<TInputs, TOutputs, ParameterValues<TParameterDeclaration>>;

    public performRun(inputs: Value[], parameterValues: ParameterValues<TParameterDeclaration>): Value[] {
        // Unwrap the value objects to just pass the underlying values into run
        const inputValues = inputs.map(input => input.value);

        // TODO: ensure values have expected types?

        // Actually run the code function
        const outputValues = this.run(inputValues as unknown as RawValuesFromTypes<TInputs>, parameterValues);

        // Wrap the raw output back up again into Value objects
        return outputValues
            .map(value => createValueFromRaw(value as unknown as string | string[]));
    }
}
