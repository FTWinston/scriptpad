import Box from '@mui/material/Box';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

interface Props {
    label: string;
    value: string;
}

export const OutputText: React.FC<Props> = props => {
    return (
        <Box sx={{position: 'relative'}}>
            <TextField
                label={props.label}
                multiline
                InputProps={{
                readOnly: true,
                }}
                fullWidth
                variant="filled"
                minRows={8}
                value={props.value}
            />

            <Box sx={{position: 'absolute', right: 8, top: 8}}>
                <Button
                    color="secondary"
                    variant="outlined"
                    title="copy text to clipboard"
                    endIcon={<ContentCopyIcon />}
                    onClick={() => navigator.clipboard.writeText(props.value)}
                >
                    copy
                </Button >
            </Box>
        </Box>
    );
}