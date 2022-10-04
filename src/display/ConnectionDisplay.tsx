import { useMemo } from 'react';
import { IOType } from '../data/Values';
import { add, Direction, dot, getStep, scale, subtract, Vector2D } from '../data/Vector2D';
import classes from './ConnectionDisplay.module.css';

export interface Endpoint {
    position: Vector2D;
    facing: Direction;
}

export interface ConnectionProps {
    id: string;
    from: Endpoint;
    to: Endpoint;
    type: IOType;
}

export const ConnectionDisplay: React.FC<ConnectionProps> = props => {
    const { from, to } = props;

    const [pathData, endArrowData] = useMemo(
        () => [
            resolvePath(from, to),
            resolveEndArrow(to)
        ],
        [from, to]
    );

    const secondPath = props.type === 'sequence'
        ? <path d={pathData} className={classes.sequenceLine2} />
        : undefined

    return (
        <g
            id={props.id}
            className={classes.connection}
        >
            <path
                d={pathData}
                className={`${classes.line} ${classes[props.type]}`}
            />

            <path
                d={endArrowData}
                className={classes.endArrow}
            />

            {secondPath}
        </g>
    );
}

const arrowWidth = 0.15;
const arrowLength = 0.175;

function resolveConnectionPoint(endpoint: Endpoint, type: 'in' | 'out'): Vector2D {
    switch (endpoint.facing) {
        case 'U':
            return {
                x: endpoint.position.x + 0.5,
                y: endpoint.position.y + (type === 'in' ? 1 : 0),
            };
        case 'D':
            return {
                x: endpoint.position.x + 0.5,
                y: endpoint.position.y + (type === 'in' ? 0 : 1),
            };
        case 'L':
            return {
                x: endpoint.position.x + (type === 'in' ? 1 : 0),
                y: endpoint.position.y + 0.5,
            };
        case 'R':
            return {
                x: endpoint.position.x + (type === 'in' ? 0 : 1),
                y: endpoint.position.y + 0.5,
            };
    }
}

function resolvePath(from: Endpoint, to: Endpoint): string {
    const startPos = resolveConnectionPoint(from, 'out');
    let endPos = resolveConnectionPoint(to, 'in');

    let output = `M ${startPos.x} ${startPos.y}`;

    const fromStep = getStep(from.facing);
    const toStep = getStep(to.facing);

    // Step half a square out from the starting point.
    let currentPos = add(startPos, scale(fromStep, 0.5));

    // We will end half a square out from the end point.
    const inFrontOfEndPos = add(endPos, scale(toStep, -0.5));

    // Keep moving currentPos in the direction of fromStep, while this leads even vaguely towards targetPos.
    while (dot(subtract(inFrontOfEndPos, currentPos), fromStep) > 0) {
        currentPos = add(currentPos, fromStep);
    }

    output += ` L ${currentPos.x} ${currentPos.y}`;

    output += ` L ${inFrontOfEndPos.x} ${inFrontOfEndPos.y}`;
    
    const shortenAmount = arrowLength * 0.99;

    switch (to.facing) {
        case 'U':
            endPos.y += shortenAmount; break;
        case 'D':
            endPos.y -= shortenAmount; break;
        case 'L':
            endPos.x += shortenAmount; break;
        case 'R':
            endPos.x -= shortenAmount; break;
    }

    output += ` L ${endPos.x} ${endPos.y}`;

    return output;
}

function resolveEndArrow(endpoint: Endpoint): string {
    let { x: endX, y: endY } = resolveConnectionPoint(endpoint, 'in')

    switch (endpoint.facing) {
        case 'U':
            return `M ${endX} ${endY} L ${endX - arrowWidth} ${endY + arrowLength} L ${endX + arrowWidth} ${endY + arrowLength} Z`;
        case 'D':
            return `M ${endX} ${endY} L ${endX - arrowWidth} ${endY - arrowLength} L ${endX + arrowWidth} ${endY - arrowLength} Z`;
        case 'L':
            return `M ${endX} ${endY} L ${endX + arrowLength} ${endY + arrowWidth} L ${endX + arrowLength} ${endY - arrowWidth} Z`;
        case 'R':
            return `M ${endX} ${endY} L ${endX - arrowLength} ${endY + arrowWidth} L ${endX - arrowLength} ${endY - arrowWidth} Z`;
    }
}
