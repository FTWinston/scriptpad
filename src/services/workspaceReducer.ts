import { OperationId } from '../data/identifiers';
import type { ConnectionProps } from '../display/ConnectionDisplay';
import type { IOProps } from '../display/IODisplay';
import type { OperationData } from '../display/OperationDisplay';
import { OperationConfigData } from '../layout/OperationConfigEditor';
import { Process } from '../models/Process';
import { Workspace } from '../models/Workspace';
import { getUniqueName } from './getUniqueName';
import { mapToObject, objectToObject } from './maps';
import { inputsFromProcess, outputsFromProcess, propsFromProcess } from './propsFromProcess';

export interface ParameterData {
    value: string;
    canRemove: boolean;
}

export interface WorkspaceState {
    workspace: Workspace;
    lastFunctionalChange: number;
    inputValues: Record<string, ParameterData>;
    outputValues: Record<string, ParameterData>;
    operations: OperationProps[];
    connections: ConnectionProps[];
    inputs: IOProps[];
    outputs: IOProps[];
    editOperation: OperationConfigData | null;
}

export const emptyState: WorkspaceState = {
    workspace: {} as unknown as Workspace, // This object should never be accessed. Right?
    lastFunctionalChange: Date.now(),
    inputValues: {},
    outputValues: {},
    operations: [],
    connections: [],
    inputs: [],
    outputs: [],
    editOperation: null,
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
    type: 'setOutputValues';
    values: Record<string, string>;
} | {
    type: 'setEditOperation';
    id: OperationId | null;
} | {
    type: 'setOperationConfigValue';
    operationId: OperationId;
    config: string;
    value: string | null;
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

            return {
                workspace: action.workspace,
                lastFunctionalChange: Date.now(),
                editOperation: null,
                inputValues: mapToObject(newProcess.inputs, (_type, name) => ({ value: '', canRemove: canRemoveInput(newProcess, name) })),
                outputValues: mapToObject(newProcess.outputs, (_type, name) => ({ value: '', canRemove: canRemoveInput(newProcess, name) })),
                ...propsFromProcess(newProcess),
            }
        }
        case 'setInput':
            const inputValues = refreshInputValues(state);
            inputValues[action.name] = { value: action.value, canRemove: canRemoveInput(process, action.name) };

            return {
                ...state,
                lastFunctionalChange: Date.now(),
                inputValues,
            }
        case 'addInput': {
            const newName = getUniqueName(process.inputs, 'Input');
            process.inputs.set(newName, 'text');
            
            const inputValues = refreshInputValues(state);
            inputValues[newName] = { value: '', canRemove: canRemoveInput(process, newName) };
            
            return {
                ...state,
                lastFunctionalChange: Date.now(),
                inputValues,
                inputs: inputsFromProcess(process),
            }
        }
        case 'removeInput': {
            process.inputs.delete(action.name);

            const inputValues = refreshInputValues(state);
            delete inputValues[action.name];

            return {
                ...state,
                lastFunctionalChange: Date.now(),
                inputValues,
                inputs: inputsFromProcess(process),
            }
        }
        case 'addOutput': {
            const newName = getUniqueName(process.outputs, 'Output');
            process.outputs.set(newName, 'text');
            
            const outputValues = refreshOutputValues(state);
            outputValues[newName] = { value: '', canRemove: canRemoveOutput(process, newName) };

            return {
                ...state,
                lastFunctionalChange: Date.now(),
                outputValues,
                outputs: outputsFromProcess(process),
            }
        }
        case 'removeOutput': {
            process.outputs.delete(action.name);

            const outputValues = refreshOutputValues(state);
            delete outputValues[action.name];

            return {
                ...state,
                lastFunctionalChange: Date.now(),
                outputValues,
                outputs: outputsFromProcess(process),
            }
        }
        case 'setOutputValues':
            // Any unconnected output won't get a value here. Ensure that we don't accidentally lose these from the output display,
            // cos the process will run as a result of adding a new output, and that would just remove it again.
            return {
                ...state,
                outputValues: {
                    ...objectToObject(state.outputValues, (_value, name) => ({ value: '', canRemove: canRemoveOutput(process, name) })),
                    ...objectToObject(action.values, (value, name) => ({ value, canRemove: canRemoveOutput(process, name) }))
                },
            }
        case 'setEditOperation': {
            const operation = action.id === null
                ? null
                : process.operations.get(action.id) ?? null;

            let newEditOperation = operation === null
                ? null
                : {
                    id: operation.id,
                    name: operation.name,
                    symbol: operation.symbol,
                    parameters: operation.parameters,
                    config: { ...operation.config }
                };

            let updatedProcessDisplay: Partial<WorkspaceState> = {};

            let changedPrevConfig = false;

            if (state.editOperation) {
                // User has just finished editing an operation's config.
                // Apply the updated config to the actual operation being edited now.
                const operation = process.operations.get(state.editOperation.id);
                if (operation) {
                    operation.setConfig(state.editOperation.config);

                    updatedProcessDisplay = propsFromProcess(process),

                    changedPrevConfig = true;
                }
            }

            return {
                ...state,
                ...updatedProcessDisplay,
                lastFunctionalChange: changedPrevConfig ? Date.now() : state.lastFunctionalChange,
                editOperation: newEditOperation,
            }
        }
        case 'setOperationConfigValue':
            if (state.editOperation?.id !== action.operationId) {
                return state;
            }

            // We update the "currently editing" operation config, but don't apply this
            // to the real operation's config until we finish editing.
            const config = {
                ...state.editOperation.config,
            };

            if (action.value === null) {
                delete config[action.config];
            }
            else {
                config[action.config] = action.value;
            }

            return {
                ...state,
                editOperation: {
                    ...state.editOperation,
                    config,
                }
            }
    }
}