import { useMemo } from 'react';
import { ConnectionDisplay, ConnectionProps } from './ConnectionDisplay';
import { ConnectorDisplay } from './ConnectorDisplay';
import { IOProps, OperationDisplay, OperationProps } from './OperationDisplay';
import classes from './ProcessDisplay.module.css';

export interface ProcessProps {
    operations: OperationProps[];
    connections: ConnectionProps[];
    inputs: IOProps[];
    outputs: IOProps[];
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
            {operations.map(operation => <OperationDisplay key={operation.id} {...operation} />)}
            {inputs.map((io, index) => <ConnectorDisplay key={index} type={io.type} connected={io.connected} attachment="in" xOffset={index + 1} yOffset={1} />)}
            {/*
                TODO: how do we determine the yOffset for inputs and outputs?
                Ideally we want these to fit not to the VIEW BOX attribute, but to a calculated viewbox, based on the svg's size.
                See e.g. https://stackoverflow.com/questions/23664967/determining-the-svg-viewport-in-global-root-coordinates

                Also... why are we calculating these HERE, and also in propsFromProcess, for corresponding connectors? Seems iffy.
            */
            }
            {outputs.map((io, index) => <ConnectorDisplay key={index} type={io.type} connected={io.connected} attachment="out" xOffset={index + 1} yOffset={3} />)}
        </svg>
    );
}

function determineViewBox(operations: OperationProps[], numInputs: number, numOutputs: number) {
    let maxX = Math.max(numInputs, numOutputs) + 1;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;

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
        if (operation.position.y < minY) {
            minY = operation.position.y;
        }
    }

    const padding = 0.6;
    minX = minX - padding;
    minY = minY - padding;
    const width = maxX + padding - minX;
    const height = maxY + padding - minY;

    return `${minX} ${minY} ${width} ${height}`;
}
