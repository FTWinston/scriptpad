import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { SxProps } from '@mui/material/styles';
import { getUniqueName } from '../services/getUniqueName';
import { isValidVariableName } from '../services/isValidVariableName';
import { InputText } from './InputText';

export interface Props {
    sx?: SxProps;
    entries: Map<string, string>;
    setValue: (name: string, value: string) => void;
    addEntry: (name: string) => void;
    removeEntry: (name: string) => void;
}

export const InputList: React.FC<Props> = props => {        
    const promptRename = () => {
        const defaultName = getUniqueName(props.entries, 'input');

        let newName: string | null;

        do {
            newName = prompt('Enter new name', defaultName)?.trim() ?? null;
            
            if (newName === null) {
                return;
            }
        } while (!newName || !isValidVariableName(newName));
        
        props.addEntry(newName);
    }

    return (
        <Box sx={props.sx} role="region" aria-label="Inputs">
            {[...props.entries.entries()].map(([name, value]) => (
                <InputText
                    key={name}
                    label={name}
                    value={value}
                    minRows={6}
                    onChange={value => props.setValue(name, value)}
                    remove={() => props.removeEntry(name)}
                />
            ))}
            
            <Button
                variant="outlined"
                color="primary"
                onClick={promptRename}
            >
                add input
            </Button>
        </Box>
    );
}