import Box from '@mui/material/Box';
import type { SxProps } from '@mui/material/styles';
import { useEffect, useLayoutEffect, useReducer } from 'react';
import { Workspace as WorkspaceData } from '../models/Workspace';
import { objectToObject } from '../services/maps';
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
    
    // Whenever an input or the entry process (view!?) changes, wait until it hasn't changed for short while, then run the process.
    // Don't do this on account of the outputs changing, or it'll just re-run forever.
    useEffect(() => {
        const timeout = setTimeout(() => {
            const justInputValues = objectToObject(state.inputValues, value => value.value);
            const justOutputValues = state.workspace.entryProcess.run(justInputValues) as Record<string, string>; // TODO: what about string[] types?
            dispatch({ type: 'setOutputValues', values: justOutputValues });
        }, 500);

        return () => clearTimeout(timeout);
    }, [state.lastFunctionalChange]);

    return (
        <Box sx={rootStyle}>
            <InputList
                sx={ioListStyle}
                entries={state.inputValues}
                addEntry={() => dispatch({ type: 'addInput' })}
                removeEntry={(name) => dispatch({ type: 'removeInput', name })}
                setValue={(name, value) => dispatch({ type: 'setInput', name, value })}
            />

            <ProcessEditor
                operations={state.operations}
                connections={state.connections}
                inputs={state.inputs}
                outputs={state.outputs}
            />

            <OutputList
                sx={ioListStyle}
                entries={state.outputValues}
                addEntry={() => dispatch({ type: 'addOutput' })}
                removeEntry={(name) => dispatch({ type: 'removeOutput', name })}
            />
        </Box>
    );
}