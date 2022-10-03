import { FunctionId } from '../data/identifiers';
import { RawValuesFromTypes, ValueTypes, RawValues } from '../data/Value';
import { ParameterTypes, ParameterDefinitions, ParameterValues, RawParameters } from './FunctionParameter';

const allFunctions = new Map<FunctionId, IFunction>();

export function getFunction(id: FunctionId) {
    return allFunctions.get(id);
}

export interface IFunction {
    readonly id: FunctionId;
    readonly symbol: string;
    parameters: ParameterDefinitions<ParameterTypes>;
    outputs: ValueTypes;
    performRun(inputs: Readonly<RawValues>, parameterValues: Readonly<RawParameters>): RawValues;
}

type RunFunction<
    TParameters extends ParameterTypes,
    TOutputs extends ValueTypes,
> = (parameters: Readonly<ParameterValues<TParameters>>) => RawValuesFromTypes<TOutputs>;

interface Initializer<
    TParameters extends ParameterTypes,
    TOutputs extends ValueTypes,
> {
    id: FunctionId;
    symbol: string;
    parameters: ParameterDefinitions<TParameters>;
    outputs: TOutputs;
    run: RunFunction<TParameters, TOutputs>;
}

export class CodeFunction<
    TParameters extends ParameterTypes,
    TOutputs extends ValueTypes
> implements IFunction {
    constructor(init: Initializer<TParameters, TOutputs>) {
        this.id = init.id;
        this.symbol = init.symbol;
        this.parameters = init.parameters;
        this.outputs = init.outputs;
        this.run = init.run;

        allFunctions.set(this.id, this);
    }

    public readonly id: FunctionId;
    public readonly symbol: string;
    public readonly parameters: ParameterDefinitions<TParameters>;
    public readonly outputs: TOutputs;
    private readonly run: RunFunction<TParameters, TOutputs>;

    public performRun(inputs: Readonly<RawValues>, parameters: ParameterValues<TParameters>): Readonly<RawValues> {
        // Combine inputs with configured parameter values.
        const parameterValues: ParameterValues<TParameters> = {
            ...inputs,
            ...parameters
        };

        // TODO: ensure all parameter values have expected types?

        // Actually run the code function
        return this.run(parameterValues);
    }
}
