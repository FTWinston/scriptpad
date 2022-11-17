import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { SxProps } from '@mui/material/styles';
import { OutputText } from './OutputText';
import type { ParameterData } from '../services/workspaceReducer';

export interface Props {
    sx?: SxProps;
    entries: Record<string, ParameterData>;
    addEntry: () => void;
    removeEntry: (name: string) => void;
}

export const OutputList: React.FC<Props> = props => {
    const outputEntries = Object.entries(props.entries);

    return (
        <Box sx={props.sx} role="region" aria-label="Outputs">
            {outputEntries.map(([name, data]) => (
                <OutputText
                    key={name}
                    label={name}
                    value={data.value}
                    canRemove={data.canRemove}
                    remove={() => props.removeEntry(name)}
                />
            ))}
            
            <Button
                variant="outlined"
                color="primary"
                onClick={props.addEntry}
            >
                add output
            </Button>
        </Box>
    );
}