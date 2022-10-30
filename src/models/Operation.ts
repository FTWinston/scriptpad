import { OperationId } from '../data/identifiers';
import { IOperation } from '../data/IOperation';
import { add, Vector2D } from '../data/Vector2D';
import { IOValues, IOType } from '../data/Values';
import { mapToObject } from '../services/maps';
import { Connections } from './Connection';

export abstract class Operation {
    constructor(
        public readonly id: OperationId,
        public position: Readonly<Vector2D>,
    ) {}

    public abstract toJson(): IOperation;

    public abstract type: 'function' | 'process';

    public abstract get name(): string;

    public abstract get symbol(): string;

    public abstract get numConnections(): number;

    public abstract get inputs(): Array<[string, IOType]>;

    public abstract get outputs(): Array<[string, IOType]>;
    
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
        // TODO: this seemingly returning -1?
        // Presumably cos it doesn't specify that these ARE inputs! How do we do that?
        console.log('getInputPosition', name);

        const inputNumber = this.inputs
            .findIndex(input => input[0] === name);

        return add(this.position, { x: inputNumber, y: 0 });
    }
}
