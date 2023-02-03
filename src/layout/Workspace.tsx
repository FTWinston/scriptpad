import Box from '@mui/material/Box';
import type { SxProps } from '@mui/material/styles';
import produce from 'immer';
import { useEffect, useLayoutEffect, useReducer } from 'react';
import { Workspace as WorkspaceData } from '../models/Workspace';
import { InputList } from './InputList';
import { OutputList } from './OutputList';
import { FunctionEditor } from './FunctionEditor';
import { getEmptyState, workspaceReducer } from '../services/workspaceReducer';

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
    const [state, dispatch] = useReducer(produce(workspaceReducer), undefined, getEmptyState);
    const { workspace } = props;

    // On startup, or if the workspace ever changes, load all data from the workspace.
    // This is the only time (outside of the reducer) that we access it.
    useLayoutEffect(
        () => dispatch({ type: 'load', workspace }), [workspace]
    );
    
    // Whenever an input or the process body changes, wait until it hasn't changed for short while, then run the process.
    useEffect(() => {
        const timeout = setTimeout(() => dispatch({ type: 'run' }), 500);
        return () => clearTimeout(timeout);
    }, [state.lastChange]);

    return (
        <Box sx={rootStyle}>
            <InputList
                sx={ioListStyle}
                entries={state.inputValues}
                addEntry={() => dispatch({ type: 'addInput' })}
                removeEntry={(name) => dispatch({ type: 'removeInput', name })}
                setValue={(name, value) => dispatch({ type: 'setInput', name, value })}
            />

            <FunctionEditor
                parameters={state.currentFunction.parameters}
                body={state.currentFunction.body}
                setBody={value => dispatch({ type: 'setFunctionBody', value })}
            />

            <OutputList
                sx={ioListStyle}
                value={state.outputValue}
            />
        </Box>
    );
}