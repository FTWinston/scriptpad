import { OperationId } from './identifiers';

export interface IOperationConnection {
    type: 'operation';
    from: OperationId;
    output: number;
}

export interface IProcessConnection {
    type: 'process';
    input: number;
}

export type IConnection = IOperationConnection | IProcessConnection;

export type ConnectionType = IConnection['type'];