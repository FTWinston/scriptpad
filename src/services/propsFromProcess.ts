import type { ConnectionProps } from '../display/ConnectionDisplay';
import type { OperationProps } from '../display/OperationDisplay';
import { Connection } from '../models/Connection';
import { Operation } from '../models/Operation';
import { Process } from '../models/Process';

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

export function propsFromProcess(process: Process) {
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

    console.log('parsed stuff from process:', { operations, connections });
    return {
        operations,
        connections,
    };
}
