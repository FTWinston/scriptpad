import { OperationConnection } from './OperationConnection';
import { ProcessConnection } from './ProcessConnection';

export type Connection = OperationConnection | ProcessConnection;

export type Connections = Map<string, Connection>;
