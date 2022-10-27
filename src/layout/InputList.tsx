import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { SxProps } from '@mui/material/styles';
import { InputText } from './InputText';
import type { ParameterData } from './workspaceReducer';

export interface Props {
    sx?: SxProps;
    entries: Record<string, ParameterData>;
    setValue: (name: string, value: string) => void;
    addEntry: () => void;
    removeEntry: (name: string) => void;
}

export const InputList: React.FC<Props> = props => {
    const inputEntries = Object.entries(props.entries);

    return (
        <Box sx={props.sx}>
            {inputEntries.map(([name, data]) => (
                <InputText
                    key={name}
                    label={name}
                    value={data.value}
                    canRemove={data.canRemove}
                    onChange={value => props.setValue(name, value)}
                    remove={() => props.removeEntry(name)}
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