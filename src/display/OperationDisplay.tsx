import { IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/MoreVert';
import MoveIcon from '@mui/icons-material/OpenWith';
import { useId } from 'react';
import { OperationId } from '../data/identifiers';
import { IOperation } from '../data/IOperation';
import { IOType } from '../data/Values';
import { Vector2D } from '../data/Vector2D';
import { ConnectorButton } from './ConnectorButton';
import { gridSize } from './Constants';

export type ConnectorProps = {
    type: IOType;
    connected: boolean;
}

export interface OperationData {
    id: OperationId;
    position: Vector2D;
    width: number;
    height: number; // TODO: remove?
    name: string;
    symbol: string; // TODO: remove?
    type: IOperation['type'];
    inputs: ConnectorProps[];
    outputs: ConnectorProps[];
    validConnections: boolean;
}

interface OperationProps extends OperationData {
    onClicked: () => void;
    onInputClicked: (index: number) => void;
    onOutputClicked: (index: number) => void;
}

const rootStyle: SxProps<Theme> = {
    overflow: 'visible',
    height: gridSize,
    display: 'flex',
    flexDirection: 'column',
}

const invalidRootStyle: SxProps<Theme> = {
    ...rootStyle,
    borderColor: 'red',
    backgroundColor: '#fdd',
    color: 'red',
}

const connectorsStyle: SxProps<Theme> = {
    paddingTop: 0,
    paddingBottom: 0,
    height: 8,
}

const topConnectorsStyle: SxProps<Theme> = {
    ...connectorsStyle,
    '& > *': {
        position: 'relative',
        top: -5,
    }
};

const bottomConnectorsStyle: SxProps<Theme> = {
    ...connectorsStyle,
    '& > *': {
        position: 'relative',
        top: 5,
    }
};

const contentWrapperStyle: SxProps<Theme> = {
    alignSelf: 'stretch',
}

const contentStyle: SxProps<Theme> = {
    paddingTop: 0,
    paddingBottom: 0,
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}

const actionButtonStyle: SxProps<Theme> = {
    paddingTop: 0.5,
    paddingBottom: 0.5,
}

export const OperationDisplay: React.FC<OperationProps> = props => {
    const titleId = useId();

    const style = {
        ...(props.validConnections ? rootStyle : invalidRootStyle),
        //transform: `translate(${props.position.x},${props.position.y})`,
    }

    return (
        <Card
            variant="outlined"
            sx={style}
            id={`operation-${props.id}`}
            aria-labelledby={titleId}
        >
            <CardActions sx={topConnectorsStyle}>
                {props.inputs.map((connector, index) => (
                    <ConnectorButton
                        key={index}
                        name={'SOME INPUT'}
                        onOperation={true}
                        connected={connector.connected}
                        dataType={connector.type}
                        onClick={() => props.onInputClicked(index)}
                    />
                ))}
            </CardActions>
            <CardContent sx={contentStyle}>
                <IconButton
                    aria-label="move"
                    edge="start"
                    sx={actionButtonStyle}
                    onClick={e => {  }}
                >
                    <MoveIcon />
                </IconButton>

                <CardActionArea
                    sx={contentWrapperStyle}
                    onClick={props.onClicked}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { props.onClicked(); }}}
                >
                    <Typography
                        id={titleId}
                        variant="h5"
                    >
                        {props.name}
                    </Typography>
                </CardActionArea>
                <IconButton
                    aria-label="more"
                    edge="end"
                    sx={actionButtonStyle}
                    onClick={e => {  }}
                >
                    <MenuIcon />
                </IconButton>
            </CardContent>
            <CardActions sx={bottomConnectorsStyle}>
                {props.outputs.map((connector, index) => (
                    <ConnectorButton
                        key={index}
                        name={'SOME OUTPUT'}
                        onOperation={true}
                        connected={connector.connected}
                        dataType={connector.type}
                        onClick={() => props.onOutputClicked(index)}
                    />
                ))}
            </CardActions>
        </Card>
    );
}