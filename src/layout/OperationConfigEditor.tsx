import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';
import { OperationId } from '../data/identifiers';

export interface OperationConfigProps {
    id: OperationId;
    type: 'function' | 'process',
    name: string;
    symbol: string;
}

const rootStyle: SxProps = {
    margin: 1,
};

export const OperationConfigEditor: React.FC<OperationConfigProps> = props => {
    return (
        <Box sx={rootStyle}>
            Edit config for <strong>{props.name}</strong> {props.type} operation #{props.id} here!
        </Box>
    );
}