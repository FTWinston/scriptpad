import type { ConnectionProps } from '../display/ConnectionDisplay';
import type { OperationProps } from '../display/OperationDisplay';
import { Connection } from '../models/Connection';
import { Operation } from '../models/Operation';
import { Process } from '../models/Process';
import { Workspace } from '../models/Workspace';
import { mapToObject } from '../services/maps';

export interface WorkspaceState {
    workspace: Workspace;
    inputValues: Record<string, string>;
    outputValues: Record<string, string>;
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
    type: 'run';
}

function propsFromOperation(operation: Operation): OperationProps {
    return {
        id: operation.id,
        type: operation.type,
        symbol: operation.symbol,
        name: operation.name,
        width: Math.max(operation.inputs.length, operation.outputs.length, 2),
        height: 1,
        position: operation.position,
        inputs: operation.inputs.map(input => ({ type: input[1], connected: operation.inputConnections.has(input[0]) })),
        outputs: operation.outputs.map(output => ({ type: output[1], connected: operation.outputConnections.has(output[0]) })),
    }
}

function propsFromConnection(operation: Operation, connectionName: string, connection: Connection): ConnectionProps {
    return {
        id: `${operation.id}_${connectionName}`,
        type: connection.valueType,
        from: connection.startPosition,
        to: operation.getInputPosition(connectionName),
    }
}

function propsFromOutputConnection(process: Process, connectionName: string, connection: Connection): ConnectionProps {
    return {
        id: `${process.id}_${connectionName}`,
        type: connection.valueType,
        from: connection.startPosition,
        to: process.getOutputPosition(connectionName),
    }
}

function propsFromProcess(process: Process) {
    const operations: OperationProps[] = [];
    const connections: ConnectionProps[] = [];

    for (const operation of process.operations.values()) {
        operations.push(propsFromOperation(operation));
        
        for (const [name, connection] of operation.inputConnections) {
            connections.push(propsFromConnection(operation, name, connection));
        }
    }

    for (const [name, connection] of process.outputConnections.entries()) {
        connections.push(propsFromOutputConnection(process, name, connection));
    }

    return {
        operations,
        connections,
    };
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
    switch (action.type) {
        case 'load': {
            const { operations, connections } = propsFromProcess(action.workspace.entryProcess);

            return {
                workspace: action.workspace,
                inputValues: mapToObject(action.workspace.entryProcess.inputs, () => ''),
                outputValues: mapToObject(action.workspace.entryProcess.outputs, () => ''),
                operations,
                connections,
            }
        }
        case 'setInput':
            return {
                ...state,
                inputValues: {
                    ...state.inputValues,
                    [action.name]: action.value,
                }
            }
        case 'addInput': {
            // TODO: amend state.workspace.entryProcess.inputs ... only that's readonly
            return {
                ...state,
                inputValues: {
                    ...state.inputValues,
                    'new input': '',
                }
            }
        }
        case 'removeInput': {
            // TODO: amend state.workspace.entryProcess.inputs ... only that's readonly
            const inputValues = { ...state.inputValues };
            delete inputValues[action.name];

            return {
                ...state,
                inputValues
            }
        }
        case 'run':
            return {
                ...state,
                outputValues: state.workspace.entryProcess.run(state.inputValues) as Record<string, string>, // TODO: what about string[] types?
            }
    }
}