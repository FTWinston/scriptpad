import { FunctionRecord } from '../data/IFunction';
import { UserFunction } from '../data/UserFunction';
import { objectToMap } from './maps';

export function functionsFromJson(data: FunctionRecord): Map<string, UserFunction> {
    return objectToMap(data, functionInfo => new UserFunction(functionInfo.parameters, functionInfo.body));
}