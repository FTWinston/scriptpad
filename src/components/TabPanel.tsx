import { StandardTextFieldProps } from '@mui/material';
import Box from '@mui/material/Box';
import type { SxProps } from '@mui/material/styles';
import { PropsWithChildren } from 'react';

export interface Props {
    sx?: SxProps;
    id: string;
    tabId: string;
    hidden: boolean;
}

const rootStyle: SxProps = {
    flexGrow: 1,
    '&:not([hidden])': {
        display: 'flex',
    },
    flexDirection: 'column',
    '& > :last-child': {
        flexGrow: 1,
    },
}

export const TabPanel: React.FC<PropsWithChildren<Props>> = props => (
    <Box
        role="tabpanel"
        hidden={props.hidden}
        id={props.id}
        aria-labelledby={props.tabId}
        sx={rootStyle}
    >
        {props.children}
    </Box>
);