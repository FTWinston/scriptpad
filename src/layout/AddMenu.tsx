import type { SxProps } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { IFunction } from '../models/CodeFunction';
import functions from '../functions';

export interface Props {
    addOperation: (operation: IFunction) => void;
}

const fabStyle: SxProps = {
    position: 'absolute',
    bottom: 16,
    right: 16,
    display: 'flex',
    gap: 2,
}

export const AddMenu: React.FC<Props> = props => {
    const [addMenuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const addMenuIsOpen = Boolean(addMenuAnchor);

    const addOperation = (opFunction: IFunction) => {
        return () => { setMenuAnchor(null); props.addOperation(opFunction); };
    }

    return (
        <>
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
                {Object.values(functions).map(opFunction => (
                    <MenuItem key={opFunction.id} onClick={addOperation(opFunction)}>{opFunction.id}</MenuItem>
                ))}
            </Menu>
        </>
    );
}