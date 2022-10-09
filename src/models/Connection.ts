import { IConnection } from '../data/IConnection';
import { IOValue, IOType } from '../data/Values';
import { Vector2D } from '../data/Vector2D';

export abstract class Connection {
    public abstract toJson(): IConnection;

    public abstract type: 'process' | 'operation';

    public abstract get valueType(): IOType;

    public abstract getValue(): IOValue;

    public abstract get startPosition(): Vector2D;
}

export type Connections = Map<string, Connection>;
