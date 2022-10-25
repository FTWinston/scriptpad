import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import TabIcon from '@mui/icons-material/KeyboardTab';
import ReturnIcon from '@mui/icons-material/KeyboardReturn';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef } from 'react';

interface Props {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

function insertAtCursor(input: HTMLInputElement, textToInsert: string) {
    if (input.selectionStart === null) {
        return input.value + textToInsert;
    }

    return input.value.substring(0, input.selectionStart) + textToInsert + input.value.substring(input.selectionStart);
}

export const InputText: React.FC<Props> = props => {
    const inputRef = useRef<HTMLInputElement>(null);

    const insertText = (text: string) => {
        return () => {
            if (!inputRef.current) {
                return;
            }
             
            let nextCursorPos = inputRef.current.selectionStart ?? 0 + text.length;
            props.onChange(insertAtCursor(inputRef.current, text));
            inputRef.current.focus();
            inputRef.current.selectionStart = inputRef.current.selectionEnd = nextCursorPos;
            // TODO: useLayoutEffet to set this AFTER the text changes. I guess?
            // And a ref to detect when we just clicked a button?
        }
    }

    return (
        <Box sx={{position: 'relative'}}>
            <TextField
                inputRef={inputRef}
                label={props.label}
                multiline
                fullWidth
                variant="outlined"
                minRows={8}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
            
            <Box sx={{position: 'absolute', right: 8, top: 8}}>
                <IconButton
                    title="insert tab character"
                    onClick={insertText('\t')}
                >
                    <TabIcon />
                </IconButton>

                <IconButton
                    title="insert line break character"
                    onClick={insertText('\n')}
                >
                    <ReturnIcon />
                </IconButton>

                <IconButton
                    title="clear all text"
                    onClick={() => props.onChange('')}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Box>
    );
}