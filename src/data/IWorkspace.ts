import { FunctionId } from './identifiers';
import { IFunction } from './IFunction';

export interface IWorkspace {
    functions: Record<FunctionId, IFunction>;
}