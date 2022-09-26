import { OperationId } from './identifiers';

export interface IOperationConnection {
    type: 'operation';
    from: OperationId;
    output: string;
}

export interface IProcessConnection {
    type: 'process';
    input: string;
}

export type IConnection = IOperationConnection | IProcessConnection;

export type ConnectionType = IConnection['type'];