import { OperationId, ProcessId } from '../data/identifiers';
import { IProcess } from '../data/IProcess';
import { Value, ValueType } from '../data/Value';
import { Operation, operationFromJson } from './Operation';
import { connectionFromJson } from './Connection';
import { determineOperationExecutionOrder } from '../services/determineOperationExecutionOrder';
import { OperationConnection } from './OperationConnection';

export class Process {
    constructor(
        public readonly id: ProcessId,
        private readonly _operations: Map<OperationId, Operation>,
        public inputs: ValueType[],
        public outputs: OperationConnection[],
    ) {}

    public toJson(): IProcess {
        return {
            id: this.id,
            inputs: [...this.inputs],
            outputs: this.outputs.map(output => output.toJson()),
            operations: [...this.operations.values()]
                .map(operation => operation.toJson())
        };
    }
   
    public static fromJson(data: IProcess, otherProcesses: ReadonlyMap<ProcessId, Process>) {
        const operations = data.operations
                .map(operation => operationFromJson(operation, otherProcesses));
        
        const operationMap = new Map(operations.map(operation => [operation.id, operation]));

        const outputs = data.outputs.map(output => OperationConnection.fromJson(output, operationMap));

        const process = new Process(data.id, operationMap, data.inputs, outputs);

        // We can only populate input connections once we have all the operations.
        for (let i = 0; i < operations.length; i++) {
            const operation = operations[i];
            const inputData = data.operations[i].inputs;

            operation.inputs = inputData.map(input => connectionFromJson(input, process));
        }

        return process;
    }

    public get operations(): ReadonlyMap<OperationId, Operation> { return this._operations; }

    public addOperation(operation: Operation) {
        this.sortedOperations = null;
        this._operations.set(operation.id, operation);
    }

    private sortedOperations: Operation[] | null = null;

    private _currentInputs: readonly Value[] | null = null;

    public get currentInputs(): readonly Value[] | null { return this._currentInputs }
    
    public run(inputs: readonly Value[]) {
        this._currentInputs = inputs;

        if (this.sortedOperations === null) {
            // Get a safe order to execute operations in, so that each only executes once its inputs have resolved their outputs.
            this.sortedOperations = determineOperationExecutionOrder(this.operations);
        }

        // Clear all operations' outputs before executing any of them, just in case.
        for (const operation of this.sortedOperations) {
            operation.clearCurrentOutputs();
        }

        for (const operation of this.sortedOperations) {
            operation.run();
        }

        this._currentInputs = null;

        return this.outputs.map(output => output.getValue());
    }
}