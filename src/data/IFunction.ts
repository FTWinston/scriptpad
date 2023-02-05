export interface IFunction {
    parameters: readonly string[];
    body: string;
}

export type FunctionId = string;

export type FunctionRecord = Record<FunctionId, IFunction>;