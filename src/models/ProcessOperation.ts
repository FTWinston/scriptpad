import { OperationId } from '../data/identifiers';
import { IProcessOperation } from '../data/IOperation';
import { Vector2D } from '../data/Vector2D';
import { IOType, IOValues } from '../data/Values';
import { mapToArray, mapToObject } from '../services/maps';
import { Operation } from './Operation';
import { Process } from './Process';

export class ProcessOperation extends Operation {
    constructor(
        id: OperationId,
        position: Vector2D,
        public readonly process: Process,
    ) {
        super(id, position);
        
        this.inputs = mapToArray(this.process.inputs, (type, id) => [id, type]);
        this.outputs = mapToArray(this.process.outputs, (type, id) => [id, type]);
    }

    public readonly type: 'process' = 'process';
    
    public get name() { return this.process.id; }

    public get symbol() { return this.process.id.charAt(0); } // TODO: allow this to be specified?

    public get numConnections() {
        return this.process.inputs.size + this.process.outputs.size;
    }

    public readonly inputs: Array<[string, IOType]>;

    public readonly outputs: Array<[string, IOType]>;
    
    public toJson(): IProcessOperation {
        return {
            type: this.type,
            id: this.id,
            position: this.position,
            process: this.process.id,
            inputs: mapToObject(this.inputConnections, input => input.toJson()),
        };
    }
    
    public perform(inputs: Readonly<IOValues>) {
        return this.process.run(inputs);
    }
}