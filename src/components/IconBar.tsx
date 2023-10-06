import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';

export const IconBar = styled(Box)(({ theme }) => ({
    position: 'absolute',
    right: 8,
    top: 8,
    borderRadius: 50,
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
}));
