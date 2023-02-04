import { IWorkspace } from '../data/IWorkspace';
import { UserFunction } from '../models/UserFunction';
import { Workspace } from '../models/Workspace';
import { objectToMap } from './maps';

export function workspaceFromJson(data: IWorkspace) {
    const functions = objectToMap(data.functions, functionInfo => new UserFunction(functionInfo.parameters, functionInfo.body));

    return new Workspace(functions);
}