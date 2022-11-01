import { OperationId } from '../data/identifiers';
import { IFunctionOperation } from '../data/IOperation';
import { IOValues, IOType, ParameterDefinition } from '../data/Values';
import type { IFunction } from './CodeFunction';
import { Operation } from './Operation';
import { mapToObject, objectToArray } from '../services/maps';
import { Vector2D } from '../data/Vector2D';

export class FunctionOperation extends Operation {
    constructor(
        id: OperationId,
        position: Vector2D,
        public readonly functionToRun: IFunction,
        config: Record<string, string> = {},
    ) {
        super(id, position, config);
        this.updateInputs();
        this.outputs = objectToArray(functionToRun.outputs, (value, key) => [key, value]);
    }

    public readonly type: 'function' = 'function';

    public get name() { return this.functionToRun.id; }

    public get symbol() { return this.functionToRun.symbol; }

    public get parameters(): Record<string, ParameterDefinition> { return this.functionToRun.parameters; }

    private _inputs: Array<[string, IOType]> = [];
    public get inputs() { return this._inputs; }

    public readonly outputs: Array<[string, IOType]>;

    protected updateInputs() {
        // Update which things count as inputs, based on them not being in the config
        this._inputs = objectToArray(this.parameters, (definition, id) => filterInputs(definition, id, this.config));
    }

    public toJson(): IFunctionOperation {
        return {
            type: this.type,
            id: this.id,
            position: this.position,
            function: this.functionToRun.id,
            config: this.config,
            inputs: mapToObject(this.inputConnections, input => input.toJson()),
        };
    }
    
    public perform(inputs: Readonly<IOValues>) {
        return this.functionToRun.performRun(inputs, this.config);
    }
}

function filterDefaultInputs(definition: ParameterDefinition, id: string): [string, IOType] | undefined {
    if (definition.type === 'choice' || definition.type === 'toggle' || !definition.inputByDefault) {
        return undefined;
    }

    return [id, definition.type];
}

function filterInputs(definition: ParameterDefinition, id: string, config: Record<string, string>): [string, IOType] | undefined {
    if (config[id] !== undefined || definition.type === 'choice' || definition.type === 'toggle') {
        return undefined;
    }

    return [id, definition.type];
}