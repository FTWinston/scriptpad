import type { ConnectionProps } from '../display/ConnectionDisplay';
import type { OperationProps } from '../display/OperationDisplay';
import { Process } from '../models/Process';
import { Workspace } from '../models/Workspace';
import { getUniqueName } from '../services/getUniqueName';
import { mapToObject, objectToObject } from '../services/maps';
import { propsFromProcess } from '../services/propsFromProcess';

export interface ParameterData {
    value: string;
    canRemove: boolean;
}

export interface WorkspaceState {
    workspace: Workspace;
    inputValues: Record<string, ParameterData>;
    outputValues: Record<string, ParameterData>;
    operations: OperationProps[];
    connections: ConnectionProps[];
}

export const emptyState: WorkspaceState = {
    workspace: {} as unknown as Workspace, // This object should never be accessed. Right?
    inputValues: {},
    outputValues: {},
    operations: [],
    connections: [],
}

export type WorkspaceAction = {
    type: 'load';
    workspace: Workspace;
} | {
    type: 'setInput';
    name: string;
    value: string;
} | {
    type: 'addInput';
} | {
    type: 'removeInput';
    name: string;
} | {
    type: 'addOutput';
} | {
    type: 'removeOutput';
    name: string;
} | {
    type: 'setOutputs';
    values: Record<string, string>;
}

function canRemoveInput(process: Process, input: string) {
    if (process.inputs.size <= 1) {
        return false;
    }
    
    // TODO: return false if input is connected

    return true;
}

function canRemoveOutput(process: Process, output: string) {
    if (process.outputs.size <= 1) {
        return false;
    }
    
    // TODO: return false if output is connected

    return true;
}

function refreshInputValues(state: WorkspaceState) {
    return objectToObject(state.inputValues, ({ value }, name) => ({ value, canRemove: canRemoveInput(state.workspace.entryProcess, name) }))
}

function refreshOutputValues(state: WorkspaceState) {
    return objectToObject(state.outputValues, ({ value }, name) => ({ value, canRemove: canRemoveOutput(state.workspace.entryProcess, name) }))
}


export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
    const process = state.workspace.entryProcess;

    switch (action.type) {
        case 'load': {
            const newProcess = action.workspace.entryProcess;
            const { operations, connections } = propsFromProcess(newProcess);

            return {
                workspace: action.workspace,
                inputValues: mapToObject(newProcess.inputs, (_type, name) => ({ value: '', canRemove: canRemoveInput(newProcess, name) })),
                outputValues: mapToObject(newProcess.outputs, (_type, name) => ({ value: '', canRemove: canRemoveInput(newProcess, name) })),
                operations,
                connections,
            }
        }
        case 'setInput':
            const inputValues = refreshInputValues(state);
            inputValues[action.name] = { value: action.value, canRemove: canRemoveInput(process, action.name) };

            return {
                ...state,
                inputValues,
            }
        case 'addInput': {
            const newName = getUniqueName(process.inputs, 'Input');
            process.inputs.set(newName, 'text');
            
            const inputValues = refreshInputValues(state);
            inputValues[newName] = { value: '', canRemove: canRemoveInput(process, newName) };
            
            return {
                ...state,
                inputValues,
            }
        }
        case 'removeInput': {
            process.inputs.delete(action.name);

            const inputValues = refreshInputValues(state);
            delete inputValues[action.name];

            return {
                ...state,
                inputValues
            }
        }
        case 'addOutput': {
            const newName = getUniqueName(process.outputs, 'Output');
            process.outputs.set(newName, 'text');
            
            const outputValues = refreshOutputValues(state);
            outputValues[newName] = { value: '', canRemove: canRemoveOutput(process, newName) };

            return {
                ...state,
                outputValues,
            }
        }
        case 'removeOutput': {
            process.outputs.delete(action.name);

            const outputValues = refreshOutputValues(state);
            delete outputValues[action.name];

            return {
                ...state,
                outputValues
            }
        }
        case 'setOutputs':
            return {
                ...state,
                outputValues: objectToObject(action.values, (value, name) => ({ value, canRemove: canRemoveOutput(process, name) })),
            }
    }
}