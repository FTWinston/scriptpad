import Paper from '@mui/material/Paper';
import type { SxProps } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { ProcessDisplay, ProcessData } from '../display/ProcessDisplay';
import { OperationConfigEditor, OperationConfigData } from './OperationConfigEditor';
import Drawer from '@mui/material/Drawer';
import { WorkspaceAction } from '../services/workspaceReducer';
import { OperationId } from '../data/identifiers';

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
    const [addMenuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const addMenuIsOpen = Boolean(addMenuAnchor);

    const [connectingFrom, setConnectingFrom] = useState<null | ConnectorInfo>(null);

    const connect = (connector: ConnectorInfo) => {
        // If not connecting from anything, start from the current point.
        if (connectingFrom === null) {
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
        return () => { setMenuAnchor(null); /* props.addOperation(name); */ };
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
                operationInputClicked={(op, input) => {/* TODO */}}
                operationOutputClicked={(op, output) => {/* TODO */}}
                inputClicked={(input) => {/* TODO */}}
                outputClicked={(output) => {/* TODO */}}
            />

            <Fab
                color="secondary"
                id="add-op-button"
                aria-label="add operations"
                aria-controls={addMenuIsOpen ? 'add-op-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={addMenuIsOpen ? 'true' : undefined}
                onClick={e => setMenuAnchor(e.currentTarget)}
                sx={fabStyle}
            >
                <AddIcon />
            </Fab>
            
            <Menu
                id="add-op-menu"
                anchorEl={addMenuAnchor}
                open={addMenuIsOpen}
                onClose={() => setMenuAnchor(null)}
                MenuListProps={{
                    'aria-labelledby': 'add-op-button',
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={addOperation('replace')}>Replace</MenuItem>
                <MenuItem onClick={addOperation('prefix/suffix')}>Prefix/Suffix</MenuItem>
                <MenuItem onClick={addOperation('filter')}>Filter</MenuItem>
            </Menu>

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