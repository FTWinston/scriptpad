import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import type { SxProps } from '@mui/material/styles';

interface Props {
    label: string;
    value: string;
}

const rootStyle: SxProps = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
}

const textStyle: SxProps = {
    flexGrow: 1,
    display: 'flex',
}

const iconBarStyle: SxProps = {
    position: 'absolute',
    right: 8,
    top: 8
}

export const OutputText: React.FC<Props> = props => {
    return (
        <Paper sx={rootStyle}>
            <TextField
                sx={textStyle}
                label={props.label}
                multiline
                InputProps={{
                    readOnly: true,
                }}
                fullWidth
                variant="filled"
                minRows={6}
                value={props.value}
            />

            <Box sx={iconBarStyle}>
                <IconButton
                    color="primary"
                    title="copy text to clipboard"
                    onClick={() => navigator.clipboard.writeText(props.value)}
                >
                    <ContentCopyIcon />
                </IconButton >
            </Box>
        </Paper>
    );
}