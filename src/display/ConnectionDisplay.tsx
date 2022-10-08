import { useMemo } from 'react';
import { IOType } from '../data/Values';
import { add, Direction, dot, getStep, offset, scale, subtract, Vector2D } from '../data/Vector2D';
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

    const pathData = useMemo(
        () => resolvePath(from, to),
        [from, to]
    );

    return (
        <g
            id={props.id}
            className={classes.connection}
        >
            <path
                d={pathData}
                className={`${classes.line1} ${classes[props.type]}`}
            />

            <path d={pathData} className={`${classes.line2} ${classes[props.type]}`} />
        </g>
    );
}

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

const cornerRadius = 0.125;

function isClockwise(from: Direction, to: Direction) {
    switch (from) {
        case 'U':
            return to !== 'L';
        case 'D':
            return to !== 'R';
        case 'L':
            return to !== 'D';
        case 'R':
            return to !== 'U';
    }
}

function resolveCorner(point: Vector2D, from: Direction, to: Direction) {
    const fromPoint = offset(point, from, -cornerRadius);
    const toPoint = offset(point, to, cornerRadius);
    const sweep = isClockwise(from, to) ? 1 : 0;

    return ` L ${fromPoint.x} ${fromPoint.y} A ${cornerRadius} ${cornerRadius} 0 0 ${sweep} ${toPoint.x} ${toPoint.y}`;
}

function resolvePath(from: Endpoint, to: Endpoint): string {
    const startPos = resolveConnectionPoint(from, 'out');
    const endPos = resolveConnectionPoint(to, 'in');

    const fromStep = getStep(from.facing);
    const toStep = getStep(to.facing);

    // Step half a square out from the starting point.
    let inFrontOfStartPos = add(startPos, scale(fromStep, 0.5));

    // We will end half a square out from the end point.
    const inFrontOfEndPos = add(endPos, scale(toStep, -0.5));

    // Keep moving currentPos in the direction of fromStep, while this leads even vaguely towards targetPos.
    while (dot(subtract(inFrontOfEndPos, inFrontOfStartPos), fromStep) > 0) {
        inFrontOfStartPos = add(inFrontOfStartPos, fromStep);
    }
    
    let output = `M ${startPos.x} ${startPos.y}`;
    
    if (inFrontOfStartPos.x !== inFrontOfEndPos.x) {
        const sideways = inFrontOfStartPos.x > inFrontOfEndPos.x ? 'L' : 'R';
        if (inFrontOfStartPos.y !== inFrontOfEndPos.y) {
            // Add two additional mid points, for a "full elbow" connector.
            // As all connectors are top/bottom, we only need to consider the Y points not matching.
            const midX = (inFrontOfStartPos.x + inFrontOfEndPos.x) / 2;

            // 4 corners
            output += resolveCorner(inFrontOfStartPos, from.facing, sideways);
            output += resolveCorner({ x: midX, y: inFrontOfStartPos.y }, sideways, 'U');
            output += resolveCorner({ x: midX, y: inFrontOfEndPos.y }, 'U', sideways);
            output += resolveCorner(inFrontOfEndPos, sideways, to.facing);
        }
        else {
            // 2 corners
            output += resolveCorner(inFrontOfStartPos, from.facing, sideways);
            output += resolveCorner(inFrontOfEndPos, sideways, to.facing);
        }
    }

    output += ` L ${endPos.x} ${endPos.y}`;

    return output;
}
