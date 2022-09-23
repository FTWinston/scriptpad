import { OperationId, ProcessId } from '../data/identifiers';
import { IOperation } from '../data/IOperation';
import { Value, ValueType } from '../data/Value';
import { Connection } from './Connection';
import { FunctionOperation } from './FunctionOperation';
import { Process } from './Process';
import { ProcessOperation } from './ProcessOperation';

export abstract class Operation {
    constructor(
        public readonly id: OperationId,
    ) {}

    public abstract toJson(): IOperation;

    public abstract type: 'function' | 'process';

    public abstract inputs: Connection[];

    public abstract get outputs(): readonly ValueType[];
    
    private _currentOutputs: Value[] | null = null;

    public get currentOutputs(): readonly Value[] | null { return this._currentOutputs }

    public clearCurrentOutputs() { this._currentOutputs = null; }

    protected abstract perform(inputs: readonly Value[]): Value[];
    
    public execute() {
        const currentInputs = this.inputs.map(input => input.getValue());

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
