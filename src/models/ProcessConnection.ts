import { IProcessConnection } from '../data/IConnection';
import { Value } from '../data/Value';
import { Connection } from './Connection';
import { Process } from './Process';

export class ProcessConnection extends Connection {
    constructor(
        public input: string,
        private readonly process: Process,
    ) {
        super();
    }
    
    public toJson(): IProcessConnection {
        return {
            type: this.type,
            input: this.input,
        };
    }

    public static fromJson(data: IProcessConnection, process: Process): ProcessConnection {
        if (!process.inputs.has(data.input)) {
            throw new Error(`Process input "${data.input}" not recognised in process ${process.id}`);
        }

        return new ProcessConnection(data.input, process);
    }

    public type: 'process' = 'process';

    public getValue(): Value {
        const inputs = this.process.currentInputs;

        if (inputs === null) {
            throw new Error(`Trying to access input #${this.input} of process ${this.process.id}, but its hasn't yet resolved`);
        }

        return inputs[this.input];
    }
}
