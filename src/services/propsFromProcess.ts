import type { ConnectionProps } from '../display/ConnectionDisplay';
import type { IOProps } from '../display/ConnectorButton';
import type { OperationData } from '../display/OperationDisplay';
import { Connection } from '../models/Connection';
import { Operation } from '../models/Operation';
import { Process } from '../models/Process';

function propsFromOperation(operation: Operation): OperationData {
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
        validConnections: operation.hasValidInputs(),
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

export function inputsFromProcess(process: Process): IOProps[] {
    const results: IOProps[] = [];

    for (const [name, type] of process.inputs.entries()) {
        results.push({
            type,
            connected: process.isInputConnected(name),
            position: process.getInputPosition(name),
        });
    }

    return results;
}

export function outputsFromProcess(process: Process): IOProps[] {
    const results: IOProps[] = [];

    for (const [name, type] of process.outputs.entries()) {
        results.push({
            type,
            connected: process.isOutputConnected(name),
            position: process.getOutputPosition(name),
        });
    }

    return results;
}

export function propsFromProcess(process: Process) {
    const operations: OperationData[] = [];
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
        inputs: inputsFromProcess(process),
        outputs: outputsFromProcess(process),
    };
}
