import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import type { SxProps } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import CopyIcon from '@mui/icons-material/ContentCopy';
import { IconBar } from './IconBar';

export interface Props {
    sx?: SxProps;
    value: string;
    error: boolean;
}

const rootStyle: SxProps = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
}

const textStyle: SxProps = {
    flexGrow: 1,
    display: 'flex',
    '& > .MuiInputBase-root': {
        flexGrow: 1,
        flexDirection: 'column',

        '& > textarea': {
            flexGrow: 1,
        },
    },
}

export const Output: React.FC<Props> = props => {
    const valueIsEmpty = props.value === '';

    return (
        <Paper sx={props.sx ? { ...rootStyle, ...props.sx } : rootStyle} role="region">
            <TextField
                sx={textStyle}
                label="output"
                multiline
                error={props.error}
                InputProps={{
                    readOnly: true,
                }}
                fullWidth
                variant="filled"
                value={props.value}
            />

            <IconBar>
                <IconButton
                    color="primary"
                    title="copy text to clipboard"
                    disabled={valueIsEmpty}
                    onClick={() => navigator.clipboard.writeText(props.value)}
                >
                    <CopyIcon />
                </IconButton >
            </IconBar>
        </Paper>
    );
}