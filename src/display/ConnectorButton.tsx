import { IconButton } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import NoOperationConnectedIcon from '@mui/icons-material/Circle';
import NoOperationUnconnectedIcon from '@mui/icons-material/TripOrigin';
import OperationConnectedIcon from '@mui/icons-material/PlayArrow';
import OperationUnconnectedIcon from '@mui/icons-material/PlayArrowTwoTone';
import { IOType } from '../data/Values';
import { Vector2D } from '../data/Vector2D';

export interface IOProps {
    id?: string;
    type: IOType;
    position: Vector2D;
    connected: boolean;
    onClick?: () => void;
}

export const connectorButtonSize = 56;

const operationRootStyle: SxProps<Theme> = {
    transform: 'rotate(90deg)',
}

const noOperationRootStyle: SxProps<Theme> = {
    position: 'relative',
    top: -28,
    left: 7,
}

const iconStyle: SxProps<Theme> = {
    width: 32,
    height: 32,
}

interface ConnectorButtonProps {
    onClick: () => void;
    name: string;
    connected: boolean;
    onOperation: boolean;
    dataType: IOType;
}

export const ConnectorButton: React.FC<ConnectorButtonProps> = props => {
    const color = props.dataType === 'text'
        ? 'primary'
        : 'secondary';
        
    const label = `${props.name}, ${props.dataType}, ${props.connected ? 'connected' : 'disconnected'}`;

    const icon = props.onOperation
        ? props.connected
            ? <OperationConnectedIcon sx={iconStyle} />
            : <OperationUnconnectedIcon sx={iconStyle} />
        : props.connected
            ? <NoOperationConnectedIcon sx={iconStyle} />
            : <NoOperationUnconnectedIcon sx={iconStyle} />

    return (
        <IconButton
            aria-label={label}
            color={color}
            onClick={props.onClick}
            size='large'
            sx={props.onOperation ? operationRootStyle : noOperationRootStyle}
        >
            {icon}
        </IconButton>
    )
}
