import { FunctionId, FunctionRecord } from '../data/IFunction';
import { UserFunction } from './UserFunction';
import { mapToObject } from '../services/maps';

export class Workspace {
    constructor(
        public functions: Map<FunctionId, UserFunction>,
    ) {}

    public toJson(): FunctionRecord {
        return mapToObject(this.functions, userFunction => userFunction.toJson());
    }
}