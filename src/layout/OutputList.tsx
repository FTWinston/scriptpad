import Box from '@mui/material/Box';
import type { SxProps } from '@mui/material/styles';
import { OutputText } from './OutputText';

export interface Props {
    sx?: SxProps;
    outputs: Record<string, string>;
}

export const OutputList: React.FC<Props> = props => {
    const outputEntries = Object.entries(props.outputs);

    return (
        <Box sx={props.sx}>
            {outputEntries.map(([name, value]) => (
                <OutputText
                    key={name}
                    label={name}
                    value={value}
                />
            ))}
        </Box>
    );
}