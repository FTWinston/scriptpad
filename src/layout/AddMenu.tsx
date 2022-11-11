import type { SxProps } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { NestedMenuItem } from 'mui-nested-menu';
import { useState } from 'react';
import { textFunctions, sequenceFunctions, conversionFunctions } from '../functions';
import { FunctionId } from '../data/identifiers';

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
                <NestedMenuItem label="Text operations" parentMenuOpen={addMenuIsOpen} nonce="text">
                    {Object.values(textFunctions).map(opFunction => (
                        <MenuItem key={opFunction.id} onClick={addOperation(opFunction.id)}>{opFunction.id}</MenuItem>
                    ))}
                </NestedMenuItem>
                <NestedMenuItem label="Sequence operations" parentMenuOpen={addMenuIsOpen} nonce="sequence">
                    {Object.values(sequenceFunctions).map(opFunction => (
                        <MenuItem key={opFunction.id} onClick={addOperation(opFunction.id)}>{opFunction.id}</MenuItem>
                    ))}
                </NestedMenuItem>
                <NestedMenuItem label="Conversions" parentMenuOpen={addMenuIsOpen} nonce="convert">
                    {Object.values(conversionFunctions).map(opFunction => (
                        <MenuItem key={opFunction.id} onClick={addOperation(opFunction.id)}>{opFunction.id}</MenuItem>
                    ))}
                </NestedMenuItem>
            </Menu>
        </>
    );
}