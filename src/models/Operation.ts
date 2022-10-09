import { OperationId, ProcessId } from '../data/identifiers';
import { IOperation } from '../data/IOperation';
import { Vector2D } from '../data/Vector2D';
import { IOValues, IOType } from '../data/Values';
import { mapToObject } from '../services/maps';
import { Connections } from './Connection';
import { FunctionOperation } from './FunctionOperation';
import { Process } from './Process';
import { ProcessOperation } from './ProcessOperation';

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

    public abstract get inputs(): Array<[string, IOType]>;

    public abstract get outputs(): Array<[string, IOType]>;
    
    public inputConnections: Connections = new Map();

    public outputConnections: Connections = new Map();

    private _currentOutputs: IOValues | null = null;

    public get currentOutputs(): Readonly<IOValues> | null { return this._currentOutputs }

    public clearCurrentOutputs() { this._currentOutputs = null; }

    protected abstract perform(inputs: Readonly<IOValues>): IOValues;
    
    public run() {
        const currentInputs = mapToObject(this.inputConnections, input => input.getValue());

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
