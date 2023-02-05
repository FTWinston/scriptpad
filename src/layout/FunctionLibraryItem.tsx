import MenuIcon from '@mui/icons-material/MoreVert';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { FunctionId } from '../data/IFunction'
import { getNameColor } from '../services/getNameColor';
import { getNameInitials } from '../services/getNameInitials';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export interface Props {
    id: FunctionId;
    selected: boolean;
    select: () => void;
    rename: () => void;
    delete: () => void;
}

export const FunctionLibraryItem: React.FC<Props> = props => {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const open = Boolean(anchor);

    const menuButtonId = `${props.id}OptionsButton`;
    const menuId = `${props.id}OptionsMenu`;

    return (
        <ListItem
            disablePadding
            secondaryAction={
                <>
                    <IconButton
                        edge="end"
                        id={menuButtonId}
                        aria-label="function options"
                        aria-controls={open ? menuId : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={e => setAnchor(e.currentTarget)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id={menuId}
                        anchorEl={anchor}
                        open={open}
                        onClose={() => setAnchor(null)}
                        MenuListProps={{
                            'aria-labelledby': menuButtonId,
                        }}
                    >
                        <MenuItem onClick={() => { props.rename(); setAnchor(null); }}>Rename</MenuItem>
                        <MenuItem onClick={() => { props.delete(); setAnchor(null) }}>Delete</MenuItem>
                    </Menu>
                </>
            }
        >
            <ListItemButton 
                selected={props.selected}
                onClick={props.select}
            >
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getNameColor(props.id) }}>{getNameInitials(props.id)}</Avatar>
                </ListItemAvatar>
            
                <ListItemText primary={props.id} />
            </ListItemButton>
        </ListItem>
    );
}