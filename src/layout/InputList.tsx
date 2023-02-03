import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { SxProps } from '@mui/material/styles';
import { InputText } from './InputText';

export interface Props {
    sx?: SxProps;
    entries: Map<string, string>;
    setValue: (name: string, value: string) => void;
    addEntry: () => void;
    renameEntry: (oldName: string, newName: string) => void;
    removeEntry: (name: string) => void;
}

export const InputList: React.FC<Props> = props => {
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
                    rename={newName => props.renameEntry(name, newName)}
                />
            ))}
            
            <Button
                variant="outlined"
                color="primary"
                onClick={props.addEntry}
            >
                add input
            </Button>
        </Box>
    );
}