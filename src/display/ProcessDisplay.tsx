import { OperationId } from '../data/identifiers';
import { ConnectionDisplay, ConnectionProps } from './ConnectionDisplay';
import { OperationDisplay, OperationData } from './OperationDisplay';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { HtmlInSvg } from './HtmlInSvg';
import { ConnectorButton, connectorButtonSize, IOProps } from './ConnectorButton';
import { gridSize } from './Constants';

export interface ProcessData {
    operations: OperationData[];
    connections: ConnectionProps[];
    inputs: IOProps[];
    outputs: IOProps[];
}

interface ProcessProps extends ProcessData {
    operationClicked: (id: OperationId) => void;
    operationInputClicked: (id: OperationId, index: number) => void;
    operationOutputClicked: (id: OperationId, index: number) => void;
    inputClicked: (index: number) => void;
    outputClicked: (index: number) => void;
}

const rootStyle: SxProps<Theme> = {
    overflow: 'scroll',
    display: 'flex',
    padding: '25px',
    backgroundColor: 'var(--background)',
    '--operation-bg': '#333',
    '--operation-fg': '#ddd',
    '--operation-fg-focus': '#f00',
    '--connection': '#000',
    '--connector-text': '#099',
    '--connector-sequence': '#e06900',
    '--background': '#aaa',
}

const svgStyle: SxProps<Theme> = {
    overflow: 'visible',
    '& *:focus': {
       outline: 'none',
       fill: theme => theme.palette.secondary.main,
    }
}

export const ProcessDisplay: React.FC<ProcessProps> = props => {
    const { connections, operations, inputs, outputs } = props;

    return (
        <Box sx={rootStyle}>
            <Box
                component="svg"
                sx={svgStyle}
            >
                {connections.map(connection => <ConnectionDisplay key={connection.id} {...connection} />)}
                {operations.map(operation => (
                    <HtmlInSvg
                        x={operation.position.x}
                        y={operation.position.y}
                        width={operation.width * gridSize}
                        height={operation.height * gridSize}
                        key={operation.id}
                    >
                        <OperationDisplay
                            {...operation}
                            onClicked={() => props.operationClicked(operation.id)}
                            onInputClicked={input => props.operationInputClicked(operation.id, input)}
                            onOutputClicked={output => props.operationInputClicked(operation.id, output)}
                        />
                    </HtmlInSvg>
                ))}
                {inputs.map((io, index) => (
                    <HtmlInSvg
                        x={io.position.x}
                        y={io.position.y}
                        width={connectorButtonSize}
                        height={connectorButtonSize}
                        key={index}
                    >
                        <ConnectorButton
                            onOperation={false}
                            connected={io.connected}
                            dataType={io.type}
                            name="SOME INPUT"
                            onClick={() => props.inputClicked(index)}
                        />
                    </HtmlInSvg>
                ))}
                {outputs.map((io, index) => (
                    <HtmlInSvg
                        x={io.position.x}
                        y={io.position.y}
                        width={connectorButtonSize}
                        height={connectorButtonSize}
                        key={index}
                    >
                        <ConnectorButton
                            onOperation={false}
                            connected={io.connected}
                            dataType={io.type}
                            name="SOME INPUT"
                            onClick={() => props.outputClicked(index)}
                        />
                    </HtmlInSvg>
                ))}
            </Box>
        </Box>
    );
}