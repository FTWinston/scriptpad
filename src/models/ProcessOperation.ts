import { OperationId, ProcessId } from '../data/identifiers';
import { IProcessOperation } from '../data/IOperation';
import { Value } from '../data/Value';
import { Connection } from './Connection';
import { Operation } from './Operation';
import { Process } from './Process';

export class ProcessOperation extends Operation {
    constructor(
        id: OperationId,
        public readonly process: Process,
    ) {
        super(id);
        this.inputs = new Array(process.inputs.length);
    }

    public readonly type: 'process' = 'process';

    public inputs: Connection[];

    public get outputs() { return this.process.outputs.map(output => output.getType()); }
    
    public toJson(): IProcessOperation {
        return {
            type: this.type,
            id: this.id,
            process: this.process.id,
            inputs: this.inputs.map(input => input.toJson()),
        };
    }
    
    public static fromJson(data: IProcessOperation, processesById: ReadonlyMap<ProcessId, Process>) {
        const process = processesById.get(data.process);

        if (!process) {
            throw new Error(`Unrecognised process: ${data.process}`);
        }

        return new ProcessOperation(data.id, process);
    }

    public perform(inputs: readonly Value[]) {
        return this.process.run(inputs);
    }
}