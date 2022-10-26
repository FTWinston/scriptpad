import Box from '@mui/material/Box';
import type { SxProps } from '@mui/material/styles';
import { Process } from '../models/Process';
import { InputList, Props as InputListProps } from './InputList';
import { OutputList } from './OutputList';
import { ProcessEditor } from './ProcessEditor';

interface Props extends InputListProps {
    outputs: Record<string, string>;
    process: Process;
}

const rootStyle: SxProps = {
    display: 'flex',
    gap: 1,
    padding: 1,
    backgroundColor: 'background.default',
    minHeight: 'calc(100vh - 1em)',
    alignItems: 'stretch',
    '& > *': {
      width: '30vw',
      flexGrow: 1,
    }
}

const ioListStyle: SxProps = {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    /*
    '& > *': {
        flexGrow: 1,
    }
    */
}

export const Workspace: React.FC<Props> = props => {
    const { outputs, ...inputProps } = props;

    return (
        <Box sx={rootStyle}>
            <InputList
                sx={ioListStyle}
                {...inputProps}
            />

            <ProcessEditor
                process={props.process}
            />

            <OutputList
                sx={ioListStyle}
                outputs={outputs}
            />
        </Box>
    );
}