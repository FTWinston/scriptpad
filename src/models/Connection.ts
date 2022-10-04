import { IConnection } from '../data/IConnection';
import { IOValue, IOType } from '../data/Values';
import { add, Vector2D } from '../data/Vector2D';
import { Operation } from './Operation';
import { OperationConnection } from './OperationConnection';
import { Process } from './Process';
import { ProcessConnection } from './ProcessConnection';

export abstract class Connection {
    
    public abstract toJson(): IConnection;

    public abstract type: 'process' | 'operation';

    public abstract get valueType(): IOType;

    public abstract getValue(): IOValue;

    public abstract get startPosition(): Vector2D;
    
    public getEndPosition(operation: Operation, name: string): Vector2D {
        const inputNumber = operation.inputs
            .findIndex(input => input[0] === name);

        return add(operation.position, { x: inputNumber, y: 0 });
    }
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
