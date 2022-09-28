import { useMemo } from 'react';
import { OperationDisplay, Props as OperationProps } from './OperationDisplay';
import classes from './WorkspaceDisplay.module.css';

export interface Props {
    operations: OperationProps[];
}

export const ProcessDisplay: React.FC<Props> = props => {
    const { operations } = props;

    const viewBox = useMemo(() => determineViewBox(operations), operations);

    return (
        <svg
            className={classes.root}
            viewBox={viewBox}
        >
            {operations.map(operation => <OperationDisplay key={operation.id} {...operation} /> )}
        </svg>
    );
}

function determineViewBox(operations: OperationProps[]) {
    let maxX = Number.MIN_SAFE_INTEGER;
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

    const padding = 1;
    minX = Math.floor(minX - padding);
    minY = Math.floor(minY - padding);
    const width = Math.ceil(maxX + padding) - minX;
    const height = Math.ceil(maxY + padding) - minY;

    return `${minX} ${minY} ${width} ${height}`;
}
