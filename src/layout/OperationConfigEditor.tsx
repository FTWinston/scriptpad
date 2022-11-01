import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';
import { OperationId } from '../data/identifiers';
import { ParameterDefinition } from '../data/Values';
import { ConfigParameterEdit } from './ConfigParameterEdit';

export interface OperationConfigProps {
    id: OperationId;
    name: string;
    symbol: string;
    config: Record<string, string>;
    parameters: Record<string, ParameterDefinition>;
    setConfig: (id: string, value: string | null) => void;
}

const rootStyle: SxProps = {
    margin: 1,
};

const listStyle: SxProps = {
    display: 'flex',
    flexDirection: 'column',
};

export const OperationConfigEditor: React.FC<OperationConfigProps> = props => {
    const configValues = Object.entries(props.parameters).map(([id, definition]) => (
        <ConfigParameterEdit
            key={id}
            id={id}
            definition={definition}
            fixedValue={Object.hasOwn(props.config, id) ? props.config[id] : null}
            setFixedValue={value => props.setConfig(id, value)}
        />
    ));

    return (
        <Box sx={rootStyle}>
            <p>Edit config for <strong>{props.name}</strong> operation #{props.id} here!</p>
            
            <Box sx={listStyle}>
                {configValues}
            </Box>
        </Box>
    );
}