import { IConnections } from './IConnection';
import { OperationId, FunctionId, ProcessId } from './identifiers';
import { IOValues } from './Values';
import { Vector2D } from './Vector2D';

interface IBaseOperation {
    id: OperationId;
    inputs: IConnections;
    position: Vector2D;
}

export interface IFunctionOperation extends IBaseOperation {
    type: 'function';
    function: FunctionId;
    config: Partial<IOValues>;
}

export interface IProcessOperation extends IBaseOperation {
    type: 'process';
    process: ProcessId;
}

export type IOperation = IFunctionOperation | IProcessOperation;