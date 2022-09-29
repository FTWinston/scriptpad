import { OperationId, ProcessId } from '../data/identifiers';
import { IProcessOperation } from '../data/IOperation';
import { Vector2D } from '../data/Vector2D';
import { Values } from '../data/Value';
import { mapToObject } from '../services/maps';
import { Operation } from './Operation';
import { Process } from './Process';
import { IShape } from '../data/IShape';

export class ProcessOperation extends Operation {
    constructor(
        id: OperationId,
        position: Vector2D,
        public readonly process: Process,
    ) {
        super(id, position);
        
        this.shape = this.possibleShapes[0];
    }

    public readonly type: 'process' = 'process';
    
    public get name() { return this.process.id; }

    public get symbol() { return this.process.id.charAt(0); } // TODO: allow this to be specified?

    public shape: IShape;

    public get numConnections() {
        return this.process.inputs.size + this.process.outputs.size;
    }

    public get inputs() { return this.process.inputs; }
    
    public get outputs() { return this.process.outputs; }
    
    public toJson(): IProcessOperation {
        return {
            type: this.type,
            id: this.id,
            position: this.position,
            process: this.process.id,
            inputs: mapToObject(this.currentInputs, input => input.toJson()),
        };
    }
    
    public static fromJson(data: IProcessOperation, processesById: ReadonlyMap<ProcessId, Process>) {
        const process = processesById.get(data.process);

        if (!process) {
            throw new Error(`Unrecognised process: ${data.process}`);
        }

        return new ProcessOperation(data.id, data.position, process);
    }

    public perform(inputs: Readonly<Values>) {
        return this.process.run(inputs);
    }
}