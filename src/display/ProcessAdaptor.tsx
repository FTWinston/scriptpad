import { Process } from '../models/Process';
import { ConnectionProps } from './ConnectionDisplay';
import { OperationProps } from './OperationDisplay';
import { ProcessDisplay } from './ProcessDisplay';

interface Props {
    process: Process;
}

export const ProcessAdaptor: React.FC<Props> = ({ process }) => {
    const operations: OperationProps[] = [];
    const connections: ConnectionProps[] = [];

    for (const operation of process.operations.values()) {
        operations.push({
            id: operation.id,
            type: operation.type,
            symbol: operation.symbol,
            name: operation.name,
            width: operation.shape.width,
            height: operation.shape.height,
            position: operation.position,
            inputs: operation.inputs.map(input => ({ type: input[1], connected: operation.inputConnections.has(input[0]) })),
            outputs: operation.outputs.map(output => ({ type: output[1], connected: operation.outputConnections.has(output[0]) })),
        });
        
        for (const [name, connection] of operation.inputConnections) {
            connections.push({
                id: `${operation.id}_${name}}`,
                type: connection.valueType,
                from: connection.startPosition,
                to: connection.getEndPosition(operation, name),
            })
        }

        // TODO: process outputs?
    }

    return (
        <ProcessDisplay
            operations={operations}
            connections={connections}
        />
    );
}