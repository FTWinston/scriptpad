import { Workspace } from '../models/Workspace';

export interface WorkspaceState {
    workspace: Workspace;
    inputValues: Record<string, string>;
    outputValues: Record<string, string>;
}

export type WorkspaceAction = {
    type: 'setInput';
    input: string;
    value: string;
} | {
    type: 'addInput';
} | {
    type: 'run';
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
    switch (action.type) {
        case 'setInput':
            return {
                ...state,
                inputValues: {
                    ...state.inputValues,
                    [action.input]: action.value,
                }
            }
        case 'addInput':
            return {
                ...state,
                inputValues: {
                    ...state.inputValues,
                    'new input': '',
                }
            }
        case 'run':
            return {
                ...state,
                outputValues: state.workspace.entryProcess.run(state.inputValues) as Record<string, string>, // TODO: what about string[] types?
            }
    }
}