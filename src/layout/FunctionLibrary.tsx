import Box from '@mui/material/Box';
import { FunctionId } from '../data/identifiers';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import { getNameColor } from '../services/getNameColor';
import { getNameInitials } from '../services/getNameInitials';

export interface Props {
    allFunctions: readonly FunctionId[];
    currentFunction: FunctionId | null;
    selectFunction: (id: FunctionId) => void;
}

export const FunctionLibrary: React.FC<Props> = props => {
    const listItems = props.allFunctions.length === 0
        ? (
            <ListItem>
                <ListItemText primary="Your function library is empty" secondary="Write a new function in the editor" />
            </ListItem>
        )
        :  props.allFunctions.map(name => (
                <ListItemButton key={name} selected={name === props.currentFunction} onClick={() => props.selectFunction(name)}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getNameColor(name) }}>{getNameInitials(name)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={name} />
                </ListItemButton>
            ));

    return (
        <Box>
            <List>
                {listItems}
            </List>
        </Box>
    );
}