import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const IconBar = styled(Box)(({ theme }) => ({
    position: 'absolute',
    right: 8,
    top: 8,
    borderRadius: 50,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(64,64,64,0.9)' : 'rgba(224,224,224,0.9)',
}));
