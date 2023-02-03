import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import TabIcon from '@mui/icons-material/KeyboardTab';
import ReturnIcon from '@mui/icons-material/KeyboardReturn';
import ClearIcon from '@mui/icons-material/Delete';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import RenameIcon from '@mui/icons-material/Edit';
import type { SxProps } from '@mui/material/styles';
import { useRef } from 'react';
import { isValidVariableName } from '../services/isValidVariableName';

interface Props {
    label: string;
    minRows?: number;
    placeholder?: string;
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
    remove: () => void;
    rename: (newName: string) => void;
    startAdornment?: React.ReactNode;
}

function insertAtCursor(input: HTMLInputElement, textToInsert: string) {
    if (input.selectionStart === null) {
        return input.value + textToInsert;
    }

    return input.value.substring(0, input.selectionStart) + textToInsert + input.value.substring(input.selectionStart);
}

const rootStyle: SxProps = {
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch'
}

const iconBarStyle: SxProps = {
    position: 'absolute',
    right: 8,
    top: 8
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
            // TODO: useLayoutEffect to set this AFTER the text changes. I guess?
            // And a ref to detect when we just clicked a button?
        }
    }
    
    const promptRename = () => {
        let newName: string | null;
        do {
            newName = prompt('Enter new name', props.label)?.trim() ?? null;
            
            if (newName === null) {
                return;
            }
        } while (!newName || !isValidVariableName(newName));
        
        props.rename(newName);
    }

    const valueIsEmpty = props.value === '';
    const clearOrDelete = valueIsEmpty
        ? (
            <IconButton
                title="remove this input"
                color="warning"
                onClick={() => props.remove()}
                disabled={props.disabled}
            >
                <DeleteIcon />
            </IconButton>
        )
        : (
            <IconButton
                title="clear all text"
                color="secondary"
                disabled={valueIsEmpty || props.disabled}
                onClick={() => props.onChange('')}
            >
                <ClearIcon />
            </IconButton>
        )

    return (
        <Paper sx={rootStyle}>
            <TextField
                inputRef={inputRef}
                label={props.label}
                placeholder={props.placeholder}
                disabled={props.disabled}
                multiline
                fullWidth
                variant="outlined"
                minRows={props.minRows}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
            
            <Box sx={iconBarStyle}>
                <IconButton
                    title="insert tab character"
                    color="primary"
                    onClick={insertText('\t')}
                    disabled={props.disabled}
                >
                    <TabIcon />
                </IconButton>

                <IconButton
                    title="insert new line character"
                    color="primary"
                    onClick={insertText('\n')}
                    disabled={props.disabled}
                >
                    <ReturnIcon />
                </IconButton>

                <IconButton
                    title="rename input"
                    color="secondary"
                    onClick={promptRename}
                    disabled={props.disabled}
                >
                    <RenameIcon />
                </IconButton>

                {clearOrDelete}
            </Box>
        </Paper>
    );
}