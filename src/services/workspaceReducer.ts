import { enableMapSet } from 'immer';
import { FunctionId, FunctionRecord } from '../data/IFunction';
import { UserFunction } from '../models/UserFunction';
import { functionsFromJson } from './functionsFromJson';

enableMapSet();

export interface WorkspaceState {
    functionLibrary: Map<string, UserFunction>;
    inputValues: Map<string, string>;
    functionError: boolean;
    unsavedChanges: boolean;
    outputValue: string;
    lastUpdated: number;
    currentFunctionId: FunctionId | null;
    currentFunction: UserFunction;
}

export function getEmptyState(): WorkspaceState {
    const emptyFunction = new UserFunction(['input'], "return '';");
    return {
        functionLibrary: new Map(),
        inputValues: new Map(emptyFunction.parameters.map(param => [param, ''])),
        functionError: false,
        unsavedChanges: false,
        outputValue: '',
        lastUpdated: Date.now(),
        currentFunctionId: null,
        currentFunction: emptyFunction,
    };
}

function resetState(state: WorkspaceState, functionLibrary: Map<string, UserFunction>) {
    const emptyState = getEmptyState();
    state.currentFunction = emptyState.currentFunction;
    state.currentFunctionId = emptyState.currentFunctionId;
    state.inputValues = emptyState.inputValues;
    state.lastUpdated = emptyState.lastUpdated;
    state.functionError = emptyState.functionError,
    state.unsavedChanges = emptyState.unsavedChanges;
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
    type: 'setOpenFunction';
    id: FunctionId | null;
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
            state.lastUpdated = Date.now();
            break;
            
        case 'addInput': {
            if (state.inputValues.has(action.name)) {
                break;
            }

            state.inputValues.set(action.name, '');
            state.currentFunction.parameters = [...state.inputValues.keys()]
            state.unsavedChanges = true;
            state.lastUpdated = Date.now();
            break;
        }

        case 'removeInput': {
            state.inputValues.delete(action.name);
            state.currentFunction.parameters = [...state.inputValues.keys()]
            state.unsavedChanges = true;
            state.lastUpdated = Date.now();
            break;
        }

        case 'setFunctionBody': {
            if (state.currentFunction) {
                state.currentFunction.body = action.value;
                state.unsavedChanges = true;
                state.lastUpdated = Date.now();
            }
            break;
        }

        case 'setOpenFunction': {
            if (state.unsavedChanges && action.id !== state.currentFunctionId) {
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
            state.unsavedChanges = false;
            state.lastUpdated = Date.now();
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
            if (!state.unsavedChanges) {
                break;
            }

            state.currentFunctionId = action.id;
            state.functionLibrary.set(action.id, state.currentFunction);
            state.unsavedChanges = false;
            break;
        }
    }
}
