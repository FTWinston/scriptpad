import Paper from '@mui/material/Paper';
import type { SxProps } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { IFunction } from '../data/IFunction';

export interface Props extends IFunction {
    setBody: (body: string) => void;
}

const rootStyle: SxProps = {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    alignContent: 'stretch',
    overflow: 'clip',
    '& > *': {
        flexGrow: 1,
    }
}

export const FunctionEditor: React.FC<Props> = props => {
    return (
        <Paper sx={rootStyle}>
            <div>Show parameters here. TODO: as an adornment?</div>
            <TextField
                label="Function body"
                multiline
                fullWidth
                variant="outlined"
                minRows={10}
                value={props.body}
                onChange={e => props.setBody(e.target.value)}
            />
        </Paper>
    );
}