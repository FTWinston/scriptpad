import { IConnection } from './IConnection';
import { IOperation } from './IOperation';
import { IOTypes } from './Values';

export interface IProcess {
    id: string;
    inputs: IOTypes;
    outputs: IOTypes;
    operations: IOperation[];
    outputConnections: Record<string, IConnection>;
}