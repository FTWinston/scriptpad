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

    const pathData = useMemo(() => resolvePath(from, to), [from, to]);

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
        </g>
    );
}

function resolvePath(from: Endpoint, to: Endpoint): string {
    let output = `M ${from.position.x} ${from.position.y}`;

    // TODO: actually do elbow bracket stuff here

    output += ` L ${to.position.x} ${to.position.y}`;

    return output;
}
