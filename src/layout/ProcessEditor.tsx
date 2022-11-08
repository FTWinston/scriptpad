import Paper from '@mui/material/Paper';
import type { SxProps } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { ProcessDisplay, ProcessData } from '../display/ProcessDisplay';
import { OperationConfigEditor, OperationConfigData } from './OperationConfigEditor';
import Drawer from '@mui/material/Drawer';
import { WorkspaceAction } from '../services/workspaceReducer';
import { OperationId } from '../data/identifiers';
import { AddMenu } from './AddMenu';

export interface Props extends ProcessData {
    editOperation: OperationConfigData | null;
    dispatch: React.Dispatch<WorkspaceAction>
}

const rootStyle: SxProps = {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    alignContent: 'stretch',
    overflow: 'clip',
    '& > *': {
        flexGrow: 1,
    }
}

const fabStyle: SxProps = {
    position: 'absolute',
    bottom: 16,
    right: 16,
    display: 'flex',
    gap: 2,
}

interface ConnectorInfo {
    operation?: OperationId,
    number: number;
    type: 'i' | 'o';
}

export const ProcessEditor: React.FC<Props> = props => {
    const [connectingFrom, setConnectingFrom] = useState<null | ConnectorInfo>(null);

    const connect = (connector: ConnectorInfo) => {
        // If not connecting from anything, start from the current point.
        if (connectingFrom === null) {

            if (connector.type === 'i') {

                if (connector.operation) {
                    const operation = props.operations.find(operation => operation.id === connector.operation);

                    // Click a connected input to disconnect it. This might be a temporary thing.
                    if (operation?.inputs[connector.number].connected) {
                        dispatch({
                            type: 'disconnect',
                            operation: connector.operation,
                            input: connector.number,
                        });
                        return;
                    }
                }
            }

            setConnectingFrom(connector);
            return;
        }

        // Whether we create a connection or not, forget about the previously-selected connector.
        setConnectingFrom(null);

        // If an item of the same type (i/o) as the previous one is clicked, forget about both.
        if (connectingFrom.type === connector.type
        ) {
            return;
        }

        // You can't connect an operation's output to its input.
        if (connectingFrom.operation !== undefined && connector.operation === connectingFrom.operation) {
            return;
        }

        const output = connectingFrom.type === 'o'
            ? connectingFrom : connector;
        const input = connectingFrom === output
            ? connector : connectingFrom;

        dispatch({
            type: 'connect',
            fromOperation: output.operation,
            fromConnector: output.number,
            toOperation: input.operation,
            toConnector: output.number,
        });
    }

    const addOperation = (name: string) => {
        return () => { /* props.addOperation(name); */ };
    }

    const {
        dispatch,
        editOperation: editOperationConfig,
        ...displayProps
    } = props;

    const [configDrawerShowing, showConfigDrawer] = useState(false);

    // The config drawer should show/hide based on whether we have something to show in it.
    const shouldShowConfig = !!editOperationConfig;
    useEffect(() => {
        if (configDrawerShowing !== shouldShowConfig) {
            showConfigDrawer(shouldShowConfig);
        }
    }, [shouldShowConfig])
    
    const configEditor = editOperationConfig
        ? (
            <OperationConfigEditor
                {...editOperationConfig}
                setConfigValue={(config, value) => dispatch({ type: 'setOperationConfigValue', operationId: editOperationConfig.id, config, value })}
            />
        )
        : undefined;

    return (
        <Paper sx={rootStyle}>
            <ProcessDisplay
                {...displayProps}
                operationClicked={id => dispatch({ type: 'setEditOperation', id })}
                operationInputClicked={(operation, number) => connect({ number, operation, type: 'i' })}
                operationOutputClicked={(operation, number) => connect({ number, operation, type: 'o' })}
                inputClicked={(number) => connect({ number, type: 'o' })}
                outputClicked={(number) => connect({ number, type: 'i' })}
            />

            <AddMenu
                addOperation={opFunction => addOperation(opFunction.id)}
            />

            <Drawer
                anchor="bottom"
                open={configDrawerShowing}
                onClose={() => dispatch({ type: 'setEditOperation', id: null })}
            >
                {configEditor}
            </Drawer>
        </Paper>
    );
}