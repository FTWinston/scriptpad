import { FunctionId } from '../data/identifiers';
import { IOValuesFromTypes, IOTypes, IOValues, ParameterTypes, ParameterDefinitionsFromTypes, ParameterValuesFromTypes, ParameterValues } from '../data/Values';

const allFunctions = new Map<FunctionId, IFunction>();

export function getFunction(id: FunctionId) {
    return allFunctions.get(id);
}

export interface IFunction {
    readonly id: FunctionId;
    readonly symbol: string;
    parameters: ParameterDefinitionsFromTypes<ParameterTypes>;
    defaultConfig: Partial<Record<string, string | string[]>>;
    outputs: IOTypes;
    performRun(inputs: Readonly<IOValues>, parameterValues: Readonly<ParameterValues>): IOValues;
}

type RunFunction<
    TParameters extends ParameterTypes,
    TOutputs extends IOTypes,
> = (parameters: Readonly<ParameterValuesFromTypes<TParameters>>) => IOValuesFromTypes<TOutputs>;

interface Initializer<
    TParameters extends ParameterTypes,
    TOutputs extends IOTypes,
> {
    id: FunctionId;
    symbol: string;
    parameters: ParameterDefinitionsFromTypes<TParameters>;
    outputs: TOutputs;
    defaultConfig: Partial<ParameterValuesFromTypes<TParameters>>;
    run: RunFunction<TParameters, TOutputs>;
}

export class CodeFunction<
    TParameters extends ParameterTypes,
    TOutputs extends IOTypes
> implements IFunction {
    constructor(init: Initializer<TParameters, TOutputs>) {
        this.id = init.id;
        this.symbol = init.symbol;
        this.parameters = init.parameters;
        this.defaultConfig = init.defaultConfig;
        this.outputs = init.outputs;
        this.run = init.run;

        allFunctions.set(this.id, this);
    }

    public readonly id: FunctionId;
    public readonly symbol: string;
    public readonly parameters: ParameterDefinitionsFromTypes<TParameters>;
    public readonly defaultConfig: Partial<ParameterValuesFromTypes<TParameters>>;
    public readonly outputs: TOutputs;
    private readonly run: RunFunction<TParameters, TOutputs>;

    public performRun(inputs: Readonly<IOValues>, parameters: ParameterValuesFromTypes<TParameters>): Readonly<IOValues> {
        // Combine inputs with configured parameter values.
        const parameterValues: ParameterValuesFromTypes<TParameters> = {
            ...inputs,
            ...parameters
        };

        // TODO: ensure all parameter values have expected types?

        // Actually run the code function
        return this.run(parameterValues);
    }
}
