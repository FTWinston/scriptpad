import { enableMapSet } from 'immer';
import { FunctionId, FunctionRecord } from '../data/IFunction';
import { UserFunction } from '../data/UserFunction';
import { functionsFromJson } from './functionsFromJson';

enableMapSet();

export interface WorkspaceState {
    functionLibrary: Map<string, UserFunction>;
    inputValues: Map<string, string>;
    functionError: boolean;
    unsavedChangesToCurrentFunction: boolean;
    outputValue: string;
    lastRunTrigger: number;
    lastSaveTrigger?: number;
    currentFunctionId: FunctionId | null;
    currentFunction: UserFunction;
}

export function getEmptyState(): WorkspaceState {
    const emptyFunction = new UserFunction(['input'], "return input\n  .split('\\n') // Separate each line.\n  .filter(line => line.length > 0) // Remove empty lines.\n  .map(line => `\"${line}\"`) // Wrap each in quotes.\n  .join(', '); // Join them back together with commas.");
    return {
        functionLibrary: new Map(),
        inputValues: new Map(emptyFunction.parameters.map(param => [param, ''])),
        functionError: false,
        unsavedChangesToCurrentFunction: false,
        outputValue: '',
        lastRunTrigger: Date.now(),
        lastSaveTrigger: undefined,
        currentFunctionId: null,
        currentFunction: emptyFunction,
    };
}

function resetState(state: WorkspaceState, functionLibrary: Map<string, UserFunction>) {
    const emptyState = getEmptyState();
    state.currentFunction = emptyState.currentFunction;
    state.currentFunctionId = emptyState.currentFunctionId;
    state.inputValues = emptyState.inputValues;
    state.lastRunTrigger = emptyState.lastRunTrigger;
    state.lastSaveTrigger = emptyState.lastSaveTrigger;
    state.functionError = emptyState.functionError,
    state.unsavedChangesToCurrentFunction = emptyState.unsavedChangesToCurrentFunction;
    state.outputValue = emptyState.outputValue;
    state.functionLibrary = functionLibrary;
}

export type WorkspaceAction = {
    type: 'load';
    functions: FunctionRecord;
} | {
    type: 'setInput';
    name: string;
    value: string;
} | {
    type: 'setFunctionBody';
    value: string;
} | {
    type: 'addInput';
    name: string;
} | {
    type: 'removeInput';
    name: string;
} | {
    type: 'renameInput';
    oldName: string;
    newName: string;
} | {
    type: 'openFunction';
    id: FunctionId | null;
} | {
    type: 'renameFunction';
    id: FunctionId;
    newId: FunctionId;
} | {
    type: 'deleteFunction';
    id: FunctionId;
} | {
    type: 'run';
} | {
    type: 'save';
    id: FunctionId;
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): void {
    switch (action.type) {
        case 'load': {
            resetState(state, functionsFromJson(action.functions));
            break;
        }

        case 'setInput':
            if (!state.inputValues.has(action.name)) {
                break;
            }

            state.inputValues.set(action.name, action.value);
            state.lastRunTrigger = Date.now();
            break;
            
        case 'addInput': {
            if (state.inputValues.has(action.name)) {
                break;
            }

            state.inputValues.set(action.name, '');
            state.currentFunction.parameters = [...state.inputValues.keys()]
            state.unsavedChangesToCurrentFunction = true;
            state.lastRunTrigger = Date.now();
            break;
        }

        case 'removeInput': {
            state.inputValues.delete(action.name);
            state.currentFunction.parameters = [...state.inputValues.keys()]
            state.unsavedChangesToCurrentFunction = true;
            state.lastRunTrigger = Date.now();
            break;
        }

        case 'setFunctionBody': {
            if (state.currentFunction) {
                state.currentFunction.body = action.value;
                state.unsavedChangesToCurrentFunction = true;
                state.lastRunTrigger = Date.now();
            }
            break;
        }

        case 'openFunction': {
            if (state.unsavedChangesToCurrentFunction && action.id !== state.currentFunctionId) {
                // TODO: confirm discard changes?
            }

            if (action.id === null) {
                resetState(state, state.functionLibrary);
                break;
            }
            
            const functionToOpen = state.functionLibrary.get(action.id);
            if (!functionToOpen) {
                break;
            }

            state.currentFunctionId = action.id;
            state.currentFunction = functionToOpen;
            state.inputValues = new Map(functionToOpen.parameters.map(name => [name, '']));
            state.outputValue = '';
            state.functionError = false;
            state.unsavedChangesToCurrentFunction = false;
            state.lastRunTrigger = Date.now();
            break;
        }

        case 'renameFunction': {
            if (state.functionLibrary.has(action.newId)) {
                return;
            }

            const renameFunction = state.functionLibrary.get(action.id);

            if (!renameFunction) {
                return;
            }

            state.functionLibrary.delete(action.id);
            state.functionLibrary.set(action.newId, renameFunction);
            if (state.currentFunctionId === action.id) {
                state.currentFunctionId = action.newId;
            }

            state.lastSaveTrigger = Date.now();
            break;
        }

        case 'deleteFunction': {
            state.functionLibrary.delete(action.id);

            if (state.currentFunctionId === action.id) {
                resetState(state, state.functionLibrary);
            }

            state.lastSaveTrigger = Date.now();
            break;
        }

        case 'run': {
            const inputs = [...state.inputValues.values()];
            const result = state.currentFunction.run(inputs);

            if (result.success) {
                state.outputValue = result.output;
                state.functionError = false;
            }
            else {
                state.outputValue = result.error;
                state.functionError = true;
            }
            break;
        }

        case 'save': {
            if (!state.unsavedChangesToCurrentFunction) {
                break;
            }

            state.currentFunctionId = action.id;
            state.functionLibrary.set(action.id, state.currentFunction);
            state.unsavedChangesToCurrentFunction = false;
            state.lastSaveTrigger = Date.now();
            break;
        }
    }
}
