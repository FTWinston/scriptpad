import Paper from '@mui/material/Paper';
import type { SxProps } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import { useState } from 'react';
import { ProcessDisplay } from '../display/ProcessDisplay';
import type { OperationProps } from '../display/OperationDisplay';
import type { ConnectionProps } from '../display/ConnectionDisplay';

export interface Props {
    operations: OperationProps[];
    connections: ConnectionProps[];
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
}

export const ProcessEditor: React.FC<Props> = props => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const open = Boolean(menuAnchor);

    const addOperation = (name: string) => {
        return () => { setMenuAnchor(null); /* props.addOperation(name); */ };
    }

    return (
        <Paper sx={rootStyle}>
            <ProcessDisplay
                operations={props.operations}
                connections={props.connections}
            />
               
            <Fab
                color="secondary"
                id="add-op-button"
                aria-label="add operations"
                aria-controls={open ? 'add-op-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={e => setMenuAnchor(e.currentTarget)}
                sx={fabStyle}
            >
                <AddIcon />
            </Fab>
            <Menu
                id="add-op-menu"
                anchorEl={menuAnchor}
                open={open}
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
        </Paper>
    );
}