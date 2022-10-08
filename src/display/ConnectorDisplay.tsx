import { IOType } from '../data/Values';
import classes from './ConnectorDisplay.module.css';

export interface ConnectorProps {
    type: IOType;
    attachment: 'in' | 'out';
    offset: number;
    connected: boolean;
}

export const ConnectorDisplay: React.FC<ConnectorProps> = props => {
    const typeClass = classes[props.type];
    const attachmentClass = classes[props.attachment];
    const connectedClass = classes[props.connected ? 'connected' : 'disconnected'];

    return (
        <path
            d={resolvePath(props.offset, props.attachment)}
            className={`${classes.connector} ${typeClass} ${connectedClass} ${attachmentClass}`}
        />
    )
}

const arrowWidth = 0.15;
const arrowLength = 0.175;

function resolvePath(xOffset: number, attachment: 'in' | 'out'): string {
    const yOffset = attachment === 'in' ? -0.9125 : 0.0875;
    return `M ${0.5 + xOffset - arrowWidth} ${yOffset + 1 - arrowLength} L ${0.5 + xOffset} ${yOffset + 1} L ${0.5 + xOffset + arrowWidth} ${yOffset + 1 - arrowLength} Z`;
}