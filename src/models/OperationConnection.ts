import { IOperationConnection } from '../data/IConnection';
import { IOValue, IOType } from '../data/Values';
import { Vector2D } from '../data/Vector2D';
import { Operation } from './Operation';

export class OperationConnection {
    constructor(
        public from: Operation,
        public output: string,
    ) {
        this.outputNumber = from.outputs.findIndex(connection => connection[0] === output);

        from.outputConnections.set(output, this);
    }
    
    private outputNumber: number;

    public get startPosition(): Vector2D {
        return {
            x: this.from.position.x + this.outputNumber,
            y: this.from.position.y,
        }
    }

    public toJson(): IOperationConnection {
        return {
            type: this.type,
            from: this.from.id,
            output: this.output,
        };
    }

    public type: 'operation' = 'operation';

    public get valueType(): IOType {
        return this.from.outputs[this.outputNumber][1];
    }

    public getValue(): IOValue {
        const outputs = this.from.currentOutputs;

        if (outputs === null) {
            throw new Error(`Trying to access output #${this.output} of operation ${this.from.id}, but it hasn't yet resolved`);
        }

        return outputs[this.output];
    }
}
