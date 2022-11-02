import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NotchedOutline from '@mui/material/OutlinedInput/NotchedOutline';
import Paper from '@mui/material/Paper';
import type { SxProps } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

interface Props {
    label: string;
    disabled?: boolean;
    options: readonly string[];
    value: string;
    onChange: (value: string) => void;
}

const rootStyle: SxProps = {
    display: 'flex',
}

const wrapperStyle: SxProps = {
    flexGrow: 1,
    borderRadius: 'inherit',
    '& legend': {
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif', // TODO: get this from the theme
    }
}

const groupStyle: SxProps = {
    marginLeft: 12.5,
    borderRadius: 0,
    '& > button': {
        borderRadius: '0 !important',
    }
}

const labelStyle: SxProps = {
    display: 'flex',
}

export const InputChoice: React.FC<Props> = props => {
    const optionButtons = props.options
        .map(option => (
            <ToggleButton key={option} value={option}>
                {option}
            </ToggleButton>
        ));

    return (
        <Paper sx={rootStyle}>
            <FormControl variant="outlined" sx={wrapperStyle}>
                <InputLabel sx={labelStyle} shrink htmlFor={props.label + ' options'}>{props.label}</InputLabel>
                <ToggleButtonGroup
                    id={props.label + ' options'}
                    sx={groupStyle}
                    value={props.value}
                    color="primary"
                    exclusive
                    onChange={(_e, value) => props.onChange(value)}
                >
                    {optionButtons}
                </ToggleButtonGroup>
                <NotchedOutline notched label={props.label} />
            </FormControl>
        </Paper>
    );
}