import { OperationId } from '../data/identifiers';
import { IOperation } from '../data/IOperation';
import { Vector2D } from '../data/Vector2D';
import { ConnectorDisplay, ConnectorProps } from './ConnectorDisplay';
import classes from './OperationDisplay.module.css';

type IOProps = Pick<ConnectorProps, 'type' | 'connected'>;

export interface OperationProps {
    id: OperationId;
    position: Vector2D;
    width: number;
    height: number;
    name: string;
    symbol: string;
    type: IOperation['type'];
    inputs: IOProps[];
    outputs: IOProps[];
}

export const OperationDisplay: React.FC<OperationProps> = props => {
    const typeBackground = props.type + 'Background';

    return (
        <g
            id={`operation-${props.id}`}
            className={classes.operation}
            tabIndex={0}
            transform={`translate(${props.position.x},${props.position.y})`}
        >
            <title>{props.name}</title>

            <rect
                className={`${classes.background} ${classes[typeBackground]}`}
                width={props.width}
                height={props.height}
            />

            <text
                className={classes.symbol}
                x={props.width / 2}
                y={props.height / 2}
                aria-hidden
            >
                {props.symbol}
            </text>

            {props.inputs.map((connector, index) => <ConnectorDisplay key={index} attachment="in" connected={connector.connected} offset={index} type={connector.type} />)}
            {props.outputs.map((connector, index) => <ConnectorDisplay key={index} attachment="out" connected={connector.connected} offset={index} type={connector.type} />)}
        </g>
    );
}