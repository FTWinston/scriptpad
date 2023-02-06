import Box from '@mui/material/Box';;
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { FunctionId } from '../data/IFunction'
import { FunctionLibraryItem } from './FunctionLibraryItem';
import { promptFunctionName } from '../utils/promptFunctionName';

export interface Props {
    allFunctions: readonly FunctionId[];
    currentFunction: FunctionId | null;
    selectFunction: (id: FunctionId | null) => void;
    renameFunction: (id: FunctionId, newId: FunctionId) => void;
    deleteFunction: (id: FunctionId) => void;
}

export const FunctionLibrary: React.FC<Props> = props => {
    return (
        <Box>
            <List>
                <ListItemButton
                    selected={props.currentFunction === null}
                    onClick={() => props.selectFunction(null)}
                >
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'white' }}><AddIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Add new function" secondary="Write some code and run it immediately." />
                </ListItemButton>

                {props.allFunctions.map(id => (
                    <FunctionLibraryItem
                        key={id}
                        id={id}
                        selected={id === props.currentFunction}
                        select={() => props.selectFunction(id)}
                        rename={() => { const newId = promptFunctionName(id, props.allFunctions); if (newId) { props.renameFunction(id, newId); }}}
                        delete={() => { if (confirm(`Delete function: ${id}?`)) { props.deleteFunction(id); }}}
                    />
                ))}
            </List>
        </Box>
    );
}