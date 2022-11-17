import type { SxProps } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { textFunctions, sequenceFunctions, conversionFunctions } from '../functions';
import { FunctionId } from '../data/identifiers';
import Divider from '@mui/material/Divider';

export interface Props {
    addOperation: (id: FunctionId) => void;
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

    const addOperation = (opFunction: FunctionId) => {
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
                <MenuItem disabled>Text operations</MenuItem>

                {Object.values(textFunctions).map(opFunction => (
                    <MenuItem key={opFunction.id} onClick={addOperation(opFunction.id)}>{opFunction.id}</MenuItem>
                ))}

                <Divider />

                <MenuItem disabled>Sequence operations</MenuItem>

                {Object.values(sequenceFunctions).map(opFunction => (
                    <MenuItem key={opFunction.id} onClick={addOperation(opFunction.id)}>{opFunction.id}</MenuItem>
                ))}

                <Divider />

                <MenuItem disabled>Conversion operations</MenuItem>
                {Object.values(conversionFunctions).map(opFunction => (
                    <MenuItem key={opFunction.id} onClick={addOperation(opFunction.id)}>{opFunction.id}</MenuItem>
                ))}
            </Menu>
        </>
    );
}