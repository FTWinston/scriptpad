import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { SxProps } from '@mui/material/styles';
import { InputText } from './InputText';
import type { Parameter } from './Parameter';

export interface Props {
    sx?: SxProps;
    inputs: Parameter[];
    setInput: (index: number, value: string) => void;
    addInput: () => void;
    removeInput: (index: number) => void;
}

export const InputList: React.FC<Props> = props => (
    <Box sx={props.sx}>
        {props.inputs.map(({ name, value }, index) => (
            <InputText
                key={name}
                label={name}
                value={value}
                canRemove={props.inputs.length > 1}
                onChange={val => props.setInput(index, val)}
                remove={() => props.removeInput(index)}
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