import { useMemo, useRef } from 'react';
import { gsap, Power3 } from 'gsap';
import { OperationId } from '../data/identifiers';
import { ConnectionDisplay, ConnectionProps } from './ConnectionDisplay';
import { IODisplay, IOProps } from './IODisplay';
import { OperationDisplay, OperationData } from './OperationDisplay';
import classes from './ProcessDisplay.module.css';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

export interface ProcessData {
    operations: OperationData[];
    connections: ConnectionProps[];
    inputs: IOProps[];
    outputs: IOProps[];
}

interface ProcessProps {
    operationClicked: (id: OperationId) => void;
    operationInputClicked: (id: OperationId, index: number) => void;
    operationOutputClicked: (id: OperationId, index: number) => void;
    inputClicked: (index: number) => void;
    outputClicked: (index: number) => void;
}

const rootStyle: SxProps<Theme> = {
    '& *:focus': {
       outline: 'none',
       fill: theme => theme.palette.secondary.main,
    }
}

const emptyViewBox = '0 0 1 1';

export const ProcessDisplay: React.FC<ProcessProps> = props => {
    const { connections, operations, inputs, outputs } = props;

    const svgRef = useRef<SVGSVGElement>(null);
    const nextViewBox = useMemo(() => determineViewBox(operations, inputs.length, outputs.length), [operations, inputs.length, outputs.length]);
    const viewBoxRef = useRef(nextViewBox);

    // Account for changes to viewBox.
    if (nextViewBox !== viewBoxRef.current) {
        if (viewBoxRef.current === emptyViewBox) {
            // Initial render is empty, so don't animate from that: jump straight to the first "proper" viewbox.
            viewBoxRef.current = nextViewBox;
        }
        else {
            // Use gsap to animate any (non-initial) viewbox changes.
            gsap.to(svgRef.current, {
                attr: {
                    viewBox: nextViewBox,
                },
                duration: 1,
                ease: Power3.easeInOut,
                onComplete: () => {
                    viewBoxRef.current = nextViewBox;
                },
            });
        }
    }
    
    return (
        <Box
            component="svg"
            ref={svgRef}
            className={classes.root}
            sx={rootStyle}
            viewBox={viewBoxRef.current}
        >
            {connections.map(connection => <ConnectionDisplay key={connection.id} {...connection} />)}
            {operations.map(operation => (
                <OperationDisplay
                    key={operation.id}
                    {...operation}
                    onClicked={() => props.operationClicked(operation.id)}
                    onInputClicked={input => props.operationInputClicked(operation.id, input)}
                    onOutputClicked={output => props.operationInputClicked(operation.id, output)}
                />
            ))}
            {inputs.map((io, index) => <IODisplay key={index} {...io} onClick={() => props.inputClicked(index)} />)}
            {outputs.map((io, index) => <IODisplay key={index} {...io} onClick={() => props.outputClicked(index)} />)}
        </Box>
    );
}

function determineViewBox(operations: OperationData[], numInputs: number, numOutputs: number) {
    if (operations.length === 0) {
        return emptyViewBox;
    }

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
