import { FunctionId } from '../data/identifiers';
import { UserFunction } from '../data/IFunction';
import { IWorkspace } from '../data/IWorkspace';
import { mapToObject } from '../services/maps';

export class Workspace {
    constructor(
        public functions: Map<FunctionId, UserFunction>,
    ) {}

    public toJson(): IWorkspace {
        return {
            functions: mapToObject(this.functions, userFunction => userFunction.toJson()),
        };
    }
}