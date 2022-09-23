import { IConnection } from './IConnection';
import { OperationId, FunctionId, ProcessId } from './identifiers';

interface IBaseOperation {
    id: OperationId;
    inputs: IConnection[];
}

export interface IFunctionOperation extends IBaseOperation {
    type: 'function';
    function: FunctionId;
    config: Record<string, string>;
}

export interface IProcessOperation extends IBaseOperation {
    type: 'process';
    process: ProcessId;
}

export type IOperation = IFunctionOperation | IProcessOperation;