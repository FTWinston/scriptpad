import { IOperationConnection } from '../data/IConnection';
import { OperationId } from '../data/identifiers';
import { Value, ValueType } from '../data/Value';
import { Connection } from './Connection';
import { Operation } from './Operation';

export class OperationConnection extends Connection {
    constructor(
        public from: Operation,
        public output: string,
    ) {
        super();
    }
    
    public toJson(): IOperationConnection {
        return {
            type: this.type,
            from: this.from.id,
            output: this.output,
        };
    }

    public static fromJson(data: IOperationConnection, operations: ReadonlyMap<OperationId, Operation>): OperationConnection {
        const from = operations.get(data.from);

        if (!from) {
            throw new Error(`Unrecognised operation ID: ${data.from}`);
        }

        if (data.output < 0 || data.output >= from.outputs.length) {
            throw new Error(`Operation output index #${data.output} out-of-bounds for operation ${from.id}`);
        }

        return new OperationConnection(from, data.output);
    }

    public type: 'operation' = 'operation';

    public getType(): ValueType {
        return this.from.outputs[this.output];
    }

    public getValue(): Value {
        const outputs = this.from.currentOutputs;

        if (outputs === null) {
            throw new Error(`Trying to access output #${this.output} of operation ${this.from.id}, but it hasn't yet resolved`);
        }

        return outputs[this.output];
    }
}
