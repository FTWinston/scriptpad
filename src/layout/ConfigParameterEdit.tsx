import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { SxProps } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { ParameterDefinition } from '../data/Values';

export interface Props {
    id: string;
    definition: ParameterDefinition;
    fixedValue: string | null;
    setFixedValue: (value: string | null) => void;
}

const rootStyle: SxProps = {
    margin: 1,
    display: 'flex',
    flexDirection: 'column',
};

export const ConfigParameterEdit: React.FC<Props> = props => {
        
    return (
        <Box component="fieldset" sx={rootStyle}>
            <FormLabel component="legend">{props.id}</FormLabel>
            <FormControlLabel
                control={<Checkbox checked={props.fixedValue !== null} onChange={e => props.setFixedValue(e.currentTarget.checked ? '' : null)} />}
                label="Use fixed value"
            />
            <TextField
                label="Value"
                disabled={props.fixedValue === null}
                variant="outlined"
                value={props.fixedValue}
                onChange={e => props.setFixedValue(e.currentTarget.value)}
            />
        </Box>
    );
}