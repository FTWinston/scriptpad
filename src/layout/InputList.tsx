import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { SxProps } from '@mui/material/styles';
import { InputText } from './InputText';

export interface Props {
    sx?: SxProps;
    inputs: Record<string, string>;
    setInput: (name: string, value: string) => void;
    addInput: () => void;
    removeInput: (name: string) => void;
}

export const InputList: React.FC<Props> = props => {
    const inputEntries = Object.entries(props.inputs);

    return (
        <Box sx={props.sx}>
            {inputEntries.map(([name, value]) => (
                <InputText
                    key={name}
                    label={name}
                    value={value}
                    canRemove={inputEntries.length > 1}
                    onChange={val => props.setInput(name, val)}
                    remove={() => props.removeInput(name)}
                />
            ))}
            
            <Button
                variant="outlined"
                color="primary"
                onClick={props.addInput}
            >
                add input
            </Button>
        </Box>
    );
}