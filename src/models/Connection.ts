import { IConnection } from '../data/IConnection';
import { IOValue, IOType } from '../data/Values';
import { OperationConnection } from './OperationConnection';
import { Process } from './Process';
import { ProcessConnection } from './ProcessConnection';

export abstract class Connection {
    public abstract toJson(): IConnection;

    public abstract type: 'process' | 'operation';

    public abstract get valueType(): IOType;

    public abstract getValue(): IOValue;
}

export type Connections = Map<string, Connection>;

export function connectionFromJson(data: IConnection, process: Process): Connection {
    if (data.type === 'operation') {
        return OperationConnection.fromJson(data, process.operations);
    }
    else { // if (data.type === 'process')
        return ProcessConnection.fromJson(data, process);
    }
}
