import { FunctionId } from '../data/identifiers';
import { RawValuesFromTypes, ValuesFromTypes, ValueTypes, Value, unwrapValues, wrapValues, Values, TextValue } from '../data/Value';
import { ParameterDeclaration, ParameterDefinitions, ParameterValues } from './FunctionParameter';

const allFunctions = new Map<FunctionId, IFunction>();

export function getFunction(id: FunctionId) {
    return allFunctions.get(id);
}

export interface IFunction {
    readonly id: FunctionId;
    readonly symbol: string;
    inputs: ValueTypes;
    outputs: ValueTypes;
    performRun(inputs: Readonly<Record<string, Value>>, parameterValues: Readonly<Record<string, string>>): Record<string, Value>;
}

type RunFunction<
    TInputs extends ValueTypes,
    TOutputs extends ValueTypes,
    TParameterValues extends Record<string, string>
> = (inputs: Readonly<RawValuesFromTypes<TInputs>>, parameters: TParameterValues) => RawValuesFromTypes<TOutputs>;

interface Initializer<
    TInputs extends ValueTypes,
    TOutputs extends ValueTypes,
    TParameterDeclaration extends ParameterDeclaration
> {
    id: FunctionId;
    symbol: string;
    inputs: TInputs;
    outputs: TOutputs;
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
        this.symbol = init.symbol;
        this.inputs = init.inputs;
        this.outputs = init.outputs;
        this.parameters = init.parameters;
        this.run = init.run;

        allFunctions.set(this.id, this);
    }

    public readonly id: FunctionId;
    public readonly symbol: string;
    public readonly inputs: TInputs;
    public readonly outputs: TOutputs;
    public readonly parameters: ParameterDefinitions<TParameterDeclaration>;
    private readonly run: RunFunction<TInputs, TOutputs, ParameterValues<TParameterDeclaration>>;

    public performRun(inputs: Readonly<Values>, parameterValues: ParameterValues<TParameterDeclaration>): Readonly<Values> {
        // Unwrap the value objects to just pass the underlying values into run
        const inputValues = unwrapValues<TInputs>(inputs as Readonly<ValuesFromTypes<TInputs>>);

        // TODO: ensure values have expected types?

        // Actually run the code function
        const outputValues = this.run(inputValues as unknown as RawValuesFromTypes<TInputs>, parameterValues);

        // Wrap the raw output back up again into Value objects
        return wrapValues<TOutputs>(outputValues) as Readonly<Values>; 
    }
}
