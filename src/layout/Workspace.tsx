import Box from '@mui/material/Box';
import type { SxProps } from '@mui/material/styles';
import { useLayoutEffect, useReducer } from 'react';
import { Workspace as WorkspaceData } from '../models/Workspace';
import { InputList } from './InputList';
import { OutputList } from './OutputList';
import { ProcessEditor } from './ProcessEditor';
import { emptyState, workspaceReducer } from './workspaceReducer';

interface Props {
    workspace: WorkspaceData;
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
    const [state, dispatch] = useReducer(workspaceReducer, emptyState);

    const { workspace } = props;

    // On startup, or if the workspace ever changes, load all data from the workspace.
    // This is the only time (outside of the reducer) that we access it.
    useLayoutEffect(
        () => dispatch({ type: 'load', workspace }), [workspace]
    );
    
    return (
        <Box sx={rootStyle}>
            <InputList
                sx={ioListStyle}
                inputs={state.inputValues}
                addInput={() => dispatch({ type: 'addInput' })}
                removeInput={(name) => dispatch({ type: 'removeInput', name })}
                setInput={(name, value) => dispatch({ type: 'setInput', name, value })}
            />

            <ProcessEditor
                operations={state.operations}
                connections={state.connections}
            />

            <OutputList
                sx={ioListStyle}
                outputs={state.outputValues}
            />
        </Box>
    );
}