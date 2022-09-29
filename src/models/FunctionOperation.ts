import { OperationId } from '../data/identifiers';
import { IFunctionOperation } from '../data/IOperation';
import { Values, ValueType } from '../data/Value';
import { getFunction, IFunction } from './CodeFunction';
import { Operation } from './Operation';
import { mapToObject, objectToMap } from '../services/maps';
import { Vector2D } from '../data/Vector2D';
import { IShape } from '../data/IShape';

export class FunctionOperation extends Operation {
    constructor(
        id: OperationId,
        position: Vector2D,
        public readonly functionToRun: IFunction,
        public parameters: Record<string, string> = {},
    ) {
        super(id, position);

        this.shape = this.possibleShapes[0];

        this.inputs = objectToMap(this.functionToRun.inputs);
        this.outputs = objectToMap(this.functionToRun.outputs);
    }

    public readonly type: 'function' = 'function';

    public get name() { return this.functionToRun.id; }

    public get symbol() { return this.functionToRun.symbol; }

    public shape: IShape;

    public get numConnections() {
        return Object.keys(this.functionToRun.inputs).length + Object.keys(this.functionToRun.outputs).length;
    }

    public readonly inputs: ReadonlyMap<string, ValueType>;

    public readonly outputs: ReadonlyMap<string, ValueType>;
    
    public toJson(): IFunctionOperation {
        return {
            type: this.type,
            id: this.id,
            position: this.position,
            function: this.functionToRun.id,
            config: this.parameters,
            inputs: mapToObject(this.currentInputs, input => input.toJson()),
        };
    }
    
    public static fromJson(data: IFunctionOperation) {
        const functionToPerform = getFunction(data.function);

        if (!functionToPerform) {
            throw new Error(`Unrecognised function: ${data.function}`);
        }

        return new FunctionOperation(data.id, data.position, functionToPerform, data.config);
    }

    public perform(inputs: Readonly<Values>) {
        return this.functionToRun.performRun(inputs, this.parameters);
    }
}