import { useMemo } from 'react';
import { Direction } from '../data/IShape';
import { ValueType } from '../data/Value';
import { Vector2D } from '../data/Vector2D';
import classes from './ConnectionDisplay.module.css';

export interface Endpoint {
    position: Vector2D;
    facing: Direction;
}

export interface ConnectionProps {
    id: string;
    from: Endpoint;
    to: Endpoint;
    type: ValueType;
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

            {secondPath}

            <path
                d={endArrowData}
                className={classes.endArrow}
            />
        </g>
    );
}

function resolvePath(from: Endpoint, to: Endpoint): string {
    let output = `M ${from.position.x} ${from.position.y}`;

    // TODO: actually do elbow bracket stuff here
    
    let { x: endX, y: endY } = to.position;

    const shortenEnd = 0.1;
    
    switch (to.facing) {
        case 'U':
            endY += shortenEnd; break;
        case 'D':
            endY -= shortenEnd; break;
        case 'L':
            endX += shortenEnd; break;
        case 'R':
            endX -= shortenEnd; break;
    }

    output += ` L ${endX} ${endY}`;

    return output;
}

function resolveEndArrow(endpoint: Endpoint): string {
    const { x: endX, y: endY } = endpoint.position;
    const width = 0.15;
    const length = 0.15;

    switch (endpoint.facing) {
        case 'U':
            return `M ${endX} ${endY} L ${endX - width} ${endY + length} L ${endX + width} ${endY + length} Z`;
        case 'D':
            return `M ${endX} ${endY} L ${endX - width} ${endY - length} L ${endX + width} ${endY - length} Z`;
        case 'L':
            return `M ${endX} ${endY} L ${endX + length} ${endY + width} L ${endX + length} ${endY - width} Z`;
        case 'R':
            return `M ${endX} ${endY} L ${endX - length} ${endY + width} L ${endX - length} ${endY - width} Z`;
    }
}
