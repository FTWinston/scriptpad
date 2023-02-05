import { FunctionRecord } from '../data/IFunction';
import { UserFunction } from '../models/UserFunction';
import { mapToObject } from './maps';

export function functionsToJson(functions: Map<string, UserFunction>): FunctionRecord {
    return mapToObject(functions, userFunction => userFunction.toJson());
}