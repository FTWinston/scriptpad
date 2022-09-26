import { IOperationConnection } from './IConnection';
import { IOperation } from './IOperation';
import { ValueTypes } from './Value';

export interface IProcess {
    id: string;
    inputs: ValueTypes;
    outputs: ValueTypes;
    operations: IOperation[];
    outputConnections: Record<string, IOperationConnection>;
}