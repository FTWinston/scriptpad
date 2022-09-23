import { IOperationConnection } from './IConnection';
import { IOperation } from './IOperation';
import { ValueType } from './Value';

export interface IProcess {
    id: string;
    inputs: ValueType[];
    operations: IOperation[];
    outputs: IOperationConnection[];
}