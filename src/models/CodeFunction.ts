import { FunctionId } from '../data/identifiers';
import { RawValuesFromTypes, createValueFromRaw, ValueValue, ValuesFromTypes, ValueTypes, Value, extractValues, wrapValues, Values } from '../data/Value';
import { ParameterDeclaration, ParameterDefinitions, ParameterValues } from './FunctionParameter';

const allFunctions = new Map<FunctionId, IFunction>();

export function getFunction(id: FunctionId) {
    return allFunctions.get(id);
}

type RunFunction<
    TInputs extends ValueTypes,
    TOutputs extends ValueTypes,
    TParameterValues extends Record<string, string>
> = (inputs: Readonly<RawValuesFromTypes<TInputs>>, parameters: TParameterValues) => RawValuesFromTypes<TOutputs>;


export interface IFunction {
    readonly id: FunctionId;
    performRun(inputs: Readonly<Record<string, Value>>, parameterValues: Readonly<Record<string, string>>): Record<string, Value>;
}

interface Initializer<
    TInputs extends ValueTypes,
    TOutputs extends ValueTypes,
    TParameterDeclaration extends ParameterDeclaration
> {
    id: FunctionId;
    parameters: ParameterDefinitions<TParameterDeclaration>;
    run: RunFunction<TInputs, TOutputs, ParameterValues<TParameterDeclaration>>;
}

export class CodeFunction<
    TInputs extends ValueTypes,
    TOutputs extends ValueTypes,
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

    public performRun(inputs: Readonly<Values>, parameterValues: ParameterValues<TParameterDeclaration>): Readonly<Values> {
        // Unwrap the value objects to just pass the underlying values into run
        const inputValues = extractValues<TInputs>(inputs as Readonly<ValuesFromTypes<TInputs>>);

        // TODO: ensure values have expected types?

        // Actually run the code function
        const outputValues = this.run(inputValues as unknown as RawValuesFromTypes<TInputs>, parameterValues);

        // Wrap the raw output back up again into Value objects
        return wrapValues<TOutputs>(outputValues) as Readonly<Values>; 
    }
}
