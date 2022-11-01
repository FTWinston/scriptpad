import { OperationId } from '../data/identifiers';
import { IOperation } from '../data/IOperation';
import { add, Vector2D } from '../data/Vector2D';
import { IOValues, IOType, ParameterDefinition } from '../data/Values';
import { mapToObject } from '../services/maps';
import { Connections } from './Connection';

export abstract class Operation {
    constructor(
        public readonly id: OperationId,
        public position: Readonly<Vector2D>,
        private _config: Record<string, string>,
    ) {}

    public abstract toJson(): IOperation;

    public abstract type: 'function' | 'process';

    public abstract get name(): string;

    public abstract get symbol(): string;

    public abstract get inputs(): Array<[string, IOType]>;

    public abstract get outputs(): Array<[string, IOType]>;
    
    public abstract get parameters(): Record<string, ParameterDefinition>;

    public get config(): Record<string, string> { return this._config; }

    public inputConnections: Connections = new Map();

    public outputConnections: Connections = new Map();

    private _currentOutputs: IOValues | null = null;

    public get currentOutputs(): Readonly<IOValues> | null { return this._currentOutputs }

    public clearCurrentOutputs() { this._currentOutputs = null; }

    protected abstract perform(inputs: Readonly<IOValues>): IOValues;
    
    public run() {
        const currentInputs = mapToObject(this.inputConnections, input => input.getValue());

        this._currentOutputs = this.perform(currentInputs);
    }
    
    public getInputPosition(name: string): Vector2D {
        const inputNumber = this.inputs
            .findIndex(input => input[0] === name);

        return add(this.position, { x: inputNumber, y: 0 });
    }
}
