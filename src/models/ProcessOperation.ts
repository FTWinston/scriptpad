import { OperationId, ProcessId } from '../data/identifiers';
import { IProcessOperation } from '../data/IOperation';
import { Values } from '../data/Value';
import { mapToObject } from '../services/maps';
import { Operation } from './Operation';
import { Process } from './Process';

export class ProcessOperation extends Operation {
    constructor(
        id: OperationId,
        public readonly process: Process,
    ) {
        super(id);
    }

    public readonly type: 'process' = 'process';

    public get inputs() { return this.process.inputs; }
    
    public get outputs() { return this.process.outputs; }
    
    public toJson(): IProcessOperation {
        return {
            type: this.type,
            id: this.id,
            process: this.process.id,
            inputs: mapToObject(this.currentInputs, input => input.toJson()),
        };
    }
    
    public static fromJson(data: IProcessOperation, processesById: ReadonlyMap<ProcessId, Process>) {
        const process = processesById.get(data.process);

        if (!process) {
            throw new Error(`Unrecognised process: ${data.process}`);
        }

        return new ProcessOperation(data.id, process);
    }

    public perform(inputs: Readonly<Values>) {
        return this.process.run(inputs);
    }
}