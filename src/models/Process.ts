import { OperationId, ProcessId } from '../data/identifiers';
import { IProcess } from '../data/IProcess';
import { IOValues, IOType } from '../data/Values';
import { Operation } from './Operation';
import { determineOperationExecutionOrder } from '../services/determineOperationExecutionOrder';
import { getMaxValue, mapToArray, mapToObject } from '../services/maps';
import { Connection } from './Connection';
import { gridSize } from '../display/Constants';

export class Process {
    constructor(
        public readonly id: ProcessId,
        private readonly _operations: Map<OperationId, Operation>,
        public inputs: Map<string, IOType>,
        public outputs: Map<string, IOType>,
        public outputConnections: Map<string, Connection>
    ) {}

    public toJson(): IProcess {
        return {
            id: this.id,
            inputs: mapToObject(this.inputs),
            outputs: mapToObject(this.outputs),
            outputConnections: mapToObject(this.outputConnections, output => output.toJson()),
            operations: mapToArray(this.operations, operation => operation.toJson()),
        };
    }

    public getInputPosition(name: string) {
        return {
            x: [...this.inputs.keys()].indexOf(name) * gridSize,
            y: 0,
        }
    }

    public getMaxOperationPositionY() {
        return Math.max(0, getMaxValue(this.operations.values(), operation => operation.position.y));
    }

    public getOutputPosition(name: string) {
        return {
            x: [...this.outputs.keys()].indexOf(name) * gridSize,
            y: this.getMaxOperationPositionY() + 2 * gridSize,
        }
    }

    public get operations(): ReadonlyMap<OperationId, Operation> { return this._operations; }

    public getNextOperationId(): OperationId {
        return getMaxValue(this.operations.keys(), id => id) + 1;
    }

    public addOperation(operation: Operation) {
        this.sortedOperations = null;
        this._operations.set(operation.id, operation);
    }

    private sortedOperations: Operation[] | null = null;

    private _currentInputs: Readonly<IOValues> | null = null;

    public get currentInputs(): Readonly<IOValues> | null { return this._currentInputs }

    public isInputConnected(name: string) {
        return [...this.operations.values()]
            .some(op => [...op.inputConnections.values()]
                            .some(con => con.type === 'process' && con.input === name)
            );
    }

    public isOutputConnected(name: string) { return this.outputConnections.has(name); }

    public run(inputs: Readonly<IOValues>): IOValues {
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

        return mapToObject(this.outputConnections, output => output.getValue());
    }
}