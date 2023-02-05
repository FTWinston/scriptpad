import { FunctionRecord } from '../data/IFunction';
import { UserFunction } from '../models/UserFunction';
import { Workspace } from '../models/Workspace';
import { objectToMap } from './maps';

export function workspaceFromJson(data: FunctionRecord) {
    const functions = objectToMap(data, functionInfo => new UserFunction(functionInfo.parameters, functionInfo.body));

    return new Workspace(functions);
}