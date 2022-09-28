import { OperationId, ProcessId } from '../data/identifiers';
import { IOperation } from '../data/IOperation';
import { Vector2D } from '../data/Vector2D';
import { Values, ValueType } from '../data/Value';
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

    public abstract get inputs(): ReadonlyMap<string, ValueType>;

    public abstract get outputs(): ReadonlyMap<string, ValueType>;
    
    public currentInputs: Connections = new Map();

    private _currentOutputs: Values | null = null;

    public get currentOutputs(): Readonly<Values> | null { return this._currentOutputs }

    public clearCurrentOutputs() { this._currentOutputs = null; }

    protected abstract perform(inputs: Readonly<Values>): Values;
    
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
