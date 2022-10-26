import Paper from '@mui/material/Paper';
import type { SxProps } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { ProcessAdaptor } from '../display/ProcessAdaptor';
import { Process } from '../models/Process';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import Fab from '@mui/material/Fab';

export interface Props {
    process: Process;
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

const menuButtonStyle: SxProps = {
    position: 'absolute',
    bottom: 16,
    left: 16,
}


export const ProcessEditor: React.FC<Props> = props => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const open = Boolean(menuAnchor);

    const addOperation = (name: string) => {
        return () => { setMenuAnchor(null); /* props.addOperation(name); */ };
    }

    return (
        <Paper sx={rootStyle}>
            <ProcessAdaptor
                process={props.process}
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