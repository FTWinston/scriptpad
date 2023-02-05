import Box from '@mui/material/Box';;
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { FunctionId } from '../data/IFunction'
import { getNameColor } from '../services/getNameColor';
import { getNameInitials } from '../services/getNameInitials';

export interface Props {
    allFunctions: readonly FunctionId[];
    currentFunction: FunctionId | null;
    selectFunction: (id: FunctionId | null) => void;
}

export const FunctionLibrary: React.FC<Props> = props => {
    return (
        <Box>
            <List>
                <ListItemButton selected={props.currentFunction === null} onClick={() => props.selectFunction(null)}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'white' }}><AddIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Add new function" secondary="Write some code and run it immediately." />
                </ListItemButton>

                {props.allFunctions.map(name => (
                    <ListItemButton key={name} selected={name === props.currentFunction} onClick={() => props.selectFunction(name)}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: getNameColor(name) }}>{getNameInitials(name)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={name} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
}