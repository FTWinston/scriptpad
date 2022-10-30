import { IOType } from '../data/Values';
import { Vector2D } from '../data/Vector2D';
import classes from './IODisplay.module.css';

export interface IOProps {
    id?: string;
    type: IOType;
    position: Vector2D;
    connected: boolean;
}

export const IODisplay: React.FC<IOProps> = props => {
    const typeClass = classes[props.type];
    const connectedClass = classes[props.connected ? 'connected' : 'disconnected'];

    return (
        <circle
            id={props.id}
            className={`${classes.io} ${typeClass} ${connectedClass}`}
            cx={props.position.x + 0.5}
            cy={props.position.y}
            r={0.1}
        />
    )
}
