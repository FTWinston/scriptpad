import { enableMapSet } from 'immer';
import { FunctionId } from '../data/identifiers';
import { UserFunction } from '../models/UserFunction';
import { Workspace } from '../models/Workspace';

enableMapSet();

export interface WorkspaceState {
    workspace: Workspace;
    inputValues: Map<string, string>;
    outputValue: string;
    lastChange: number;
    currentFunctionId: FunctionId | null;
    currentFunction: UserFunction;
}

export function getEmptyState(): WorkspaceState {
    const emptyFunction = new UserFunction(['input'], "return '';");
    return {
        workspace: new Workspace(new Map()),
        inputValues: new Map(emptyFunction.parameters.map(param => [param, ''])),
        outputValue: '',
        lastChange: Date.now(),
        currentFunctionId: null,
        currentFunction: emptyFunction,
    };
}

function resetState(state: WorkspaceState, workspace: Workspace) {
    const emptyState = getEmptyState();
    state.currentFunction = emptyState.currentFunction;
    state.currentFunctionId = emptyState.currentFunctionId;
    state.inputValues = emptyState.inputValues;
    state.lastChange = emptyState.lastChange;
    state.outputValue = emptyState.outputValue;
    state.workspace = workspace;
}

export type WorkspaceAction = {
    type: 'load';
    workspace: Workspace;
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
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): void {
    switch (action.type) {
        case 'load': {
            resetState(state, action.workspace);
            break;
        }

        case 'setInput':
            if (!state.inputValues.has(action.name)) {
                break;
            }

            state.inputValues.set(action.name, action.value);
            state.lastChange = Date.now();
            break;
            
        case 'addInput': {
            if (state.inputValues.has(action.name)) {
                break;
            }

            state.inputValues.set(action.name, '');
            state.currentFunction.parameters = [...state.inputValues.keys()]
            state.lastChange = Date.now();
            break;
        }

        case 'removeInput': {
            state.inputValues.delete(action.name);
            state.currentFunction.parameters = [...state.inputValues.keys()]
            state.lastChange = Date.now();
            break;
        }

        case 'setFunctionBody': {
            if (state.currentFunction) {
                state.currentFunction.body = action.value;
                state.lastChange = Date.now();
            }
            break;
        }

        case 'setOpenFunction': {
            if (action.id === null) {
                resetState(state, state.workspace);
                break;
            }
            
            const functionToOpen = state.workspace.functions.get(action.id);
            if (!functionToOpen) {
                break;
            }

            state.currentFunctionId = action.id;
            state.currentFunction = functionToOpen;
            state.inputValues = new Map(functionToOpen.parameters.map(name => [name, '']));
            state.outputValue = '';
            state.lastChange = Date.now();
            break;
        }

        case 'run': {
            const inputs = [...state.inputValues.values()];
            state.outputValue = state.currentFunction.run(inputs);
            break;
        }
    }
}
