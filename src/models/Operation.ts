import { OperationId } from '../data/identifiers';
import { IOperation } from '../data/IOperation';
import { add, Vector2D } from '../data/Vector2D';
import { IOValues, IOType, ParameterDefinition, ParameterValues } from '../data/Values';
import { mapToObject } from '../services/maps';
import { Connections } from './Connection';

export abstract class Operation {
    constructor(
        public readonly id: OperationId,
        public position: Readonly<Vector2D>,
        private _config: ParameterValues,
    ) {
    }

    public abstract toJson(): IOperation;

    public abstract type: 'function' | 'process';

    public abstract get name(): string;

    public abstract get symbol(): string;

    public abstract get inputs(): ReadonlyArray<[string, IOType]>;

    public abstract get outputs(): Array<[string, IOType]>;
    
    public abstract get parameters(): Record<string, ParameterDefinition>;

    public get config(): Readonly<ParameterValues> { return this._config; }

    public setConfig(config: ParameterValues) {
        this._config = config;

        this.updateInputs();

        // Drop any input connections that reference config parameters, because those are no longer inputs.
        for (const inputName of this.inputConnections.keys()) {
            if (Object.hasOwn(config, inputName)) {
                this.inputConnections.delete(inputName);
            }
        }
    }

    protected abstract updateInputs(): void;

    public inputConnections: Connections = new Map();

    public outputConnections: Connections = new Map();

    public hasValidInputs() {
        return this.inputs.every(([input]) => this.inputConnections.has(input));
    }

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
