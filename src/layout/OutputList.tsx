import Box from '@mui/material/Box';
import type { SxProps } from '@mui/material/styles';
import { OutputText } from './OutputText';

export interface Props {
    sx?: SxProps;
    value: string;
}

export const OutputList: React.FC<Props> = props => {
    return (
        <Box sx={props.sx} role="region" aria-label="Output">
            <OutputText
                label="Output"
                value={props.value}
            />
        </Box>
    );
}