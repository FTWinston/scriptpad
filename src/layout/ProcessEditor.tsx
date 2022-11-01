import Paper from '@mui/material/Paper';
import type { SxProps } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { ProcessDisplay, ProcessProps } from '../display/ProcessDisplay';
import { OperationId } from '../data/identifiers';
import { OperationConfigEditor, OperationConfigProps } from './OperationConfigEditor';
import Drawer from '@mui/material/Drawer';

export interface Props extends Omit<ProcessProps, 'onOpenOperation'> {
    setEditOperation: (id: OperationId | null) => void;
    editOperationConfig: OperationConfigProps | null;
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

export const ProcessEditor: React.FC<Props> = props => {
    const [addMenuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const addMenuIsOpen = Boolean(addMenuAnchor);

    const addOperation = (name: string) => {
        return () => { setMenuAnchor(null); /* props.addOperation(name); */ };
    }

    const { setEditOperation, editOperationConfig, ...displayProps } = props;

    const [configDrawerShowing, showConfigDrawer] = useState(false);

    // The config drawer should show/hide based on whether we have something to show in it.
    const shouldShowConfig = !!editOperationConfig;
    useEffect(() => {
        if (configDrawerShowing !== shouldShowConfig) {
            showConfigDrawer(shouldShowConfig);
        }
    }, [shouldShowConfig])

    const configEditor = props.editOperationConfig
        ? (
            <OperationConfigEditor
                {...props.editOperationConfig}
            />
        )
        : undefined;

    return (
        <Paper sx={rootStyle}>
            <ProcessDisplay
                {...displayProps}
                onOpenOperation={setEditOperation}
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
                onClose={() => setEditOperation(null)}
            >
                {configEditor}
            </Drawer>
        </Paper>
    );
}