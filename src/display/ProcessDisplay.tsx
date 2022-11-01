import { useMemo } from 'react';
import { OperationId } from '../data/identifiers';
import { ConnectionDisplay, ConnectionProps } from './ConnectionDisplay';
import { IODisplay, IOProps } from './IODisplay';
import { OperationDisplay, OperationProps } from './OperationDisplay';
import classes from './ProcessDisplay.module.css';

type OperationDataProps = Omit<OperationProps, 'onOpen'>;

export interface ProcessProps {
    operations: OperationDataProps[];
    connections: ConnectionProps[];
    inputs: IOProps[];
    outputs: IOProps[];
    onOpenOperation: (id: OperationId) => void;
}

export const ProcessDisplay: React.FC<ProcessProps> = props => {
    const { connections, operations, inputs, outputs } = props;

    const viewBox = useMemo(() => determineViewBox(operations, inputs.length, outputs.length), [operations, inputs.length, outputs.length]);

    return (
        <svg
            className={classes.root}
            viewBox={viewBox}
        >
            {connections.map(connection => <ConnectionDisplay key={connection.id} {...connection} />)}
            {operations.map(operation => <OperationDisplay key={operation.id} {...operation} onOpen={() => props.onOpenOperation(operation.id)} />)}
            {inputs.map((io, index) => <IODisplay key={index} {...io} />)}
            {outputs.map((io, index) => <IODisplay key={index} {...io} />)}
        </svg>
    );
}

function determineViewBox(operations: OperationDataProps[], numInputs: number, numOutputs: number) {
    let maxX = Math.max(numInputs, numOutputs) + 1;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = -0.15;

    for (const operation of operations) {
        if (operation.position.x + operation.width > maxX) {
            maxX = operation.position.x + operation.width;
        }
        if (operation.position.x < minX) {
            minX = operation.position.x;
        }
        if (operation.position.y + operation.height > maxY) {
            maxY = operation.position.y + operation.height;
        }
    }

    const xPadding = 0.6;
    minX = minX - xPadding;
    maxY += 1.15;
    const width = Math.max(maxX + xPadding - minX, 1);
    const height = Math.max(maxY - minY, 1);

    return `${minX} ${minY} ${width} ${height}`;
}
