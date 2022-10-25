import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { InputText } from './InputText';
import { OutputText } from './OutputText';

interface Parameter {
    name: string;
    value: string;
}

interface Props {
    inputs: Parameter[];
    outputs: Parameter[];
}

export const Workspace: React.FC<Props> = props => {
    const [input, setInput] = useState('');

    return (
        <Box sx={{
          display: 'flex',
          '& > :not(style)': {
            m: 1,
            width: '30vw',
            minHeight: '80vh',
          }
        }}> 
            <Box>
                <InputText
                    label="Input"
                    value={input}
                    onChange={setInput}
                />
                <button>add input</button>
            </Box>

            <Paper />

            <OutputText
                label="Output"
                value={input}
            />
        </Box>
    );
}