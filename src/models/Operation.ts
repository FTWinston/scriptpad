import { OperationId, ProcessId } from '../data/identifiers';
import { IOperation } from '../data/IOperation';
import { Vector2D } from '../data/Vector2D';
import { IOValues, IOType } from '../data/Values';
import { mapToObject } from '../services/maps';
import { Connections } from './Connection';
import { FunctionOperation } from './FunctionOperation';
import { Process } from './Process';
import { ProcessOperation } from './ProcessOperation';
import { IShape } from '../data/IShape';
import { possibleShapesByConnections } from './shapes';

export abstract class Operation {
    constructor(
        public readonly id: OperationId,
        public position: Readonly<Vector2D>,
    ) {}

    public abstract toJson(): IOperation;

    public abstract type: 'function' | 'process';

    public abstract get name(): string;

    public abstract get symbol(): string;

    public abstract get numConnections(): number;

    public get possibleShapes() {
        return possibleShapesByConnections.get(this.numConnections)
            ?? possibleShapesByConnections.get(2)!
    }

    public abstract shape: IShape;

    public abstract get inputs(): Array<[string, IOType]>;

    public abstract get outputs(): Array<[string, IOType]>;
    
    public currentInputs: Connections = new Map();

    private _currentOutputs: IOValues | null = null;

    public get currentOutputs(): Readonly<IOValues> | null { return this._currentOutputs }

    public clearCurrentOutputs() { this._currentOutputs = null; }

    protected abstract perform(inputs: Readonly<IOValues>): IOValues;
    
    public run() {
        const currentInputs = mapToObject(this.currentInputs, input => input.getValue());

        this._currentOutputs = this.perform(currentInputs);
    }
}

export function operationFromJson(data: IOperation, processesById: ReadonlyMap<ProcessId, Process>) {
    if (data.type === 'function') {
        return FunctionOperation.fromJson(data);
    }
    else { // if (data.type === 'process') {
        return ProcessOperation.fromJson(data, processesById);
    }
}
