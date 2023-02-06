import { FunctionRecord } from '../data/IFunction';
import { UserFunction } from '../data/UserFunction';
import { mapToObject } from './maps';

export function functionsToJson(functions: Map<string, UserFunction>): FunctionRecord {
    return mapToObject(functions, userFunction => userFunction.toJson());
}