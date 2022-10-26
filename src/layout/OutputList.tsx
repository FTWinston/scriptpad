import Box from '@mui/material/Box';
import type { SxProps } from '@mui/material/styles';
import { OutputText } from './OutputText';
import type { Parameter } from './Parameter';

export interface Props {
    sx?: SxProps;
    outputs: Parameter[];
}

export const OutputList: React.FC<Props> = props => (
    <Box sx={props.sx}>
        {props.outputs.map(({ name, value }) => (
            <OutputText
                key={name}
                label={name}
                value={value}
            />
        ))}
    </Box>
);