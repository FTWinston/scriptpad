import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { SxProps } from '@mui/material/styles';
import produce from 'immer';
import { useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { InputList } from './InputList';
import { Output } from './Output';
import { FunctionEditor } from './FunctionEditor';
import { getEmptyState, workspaceReducer } from '../services/workspaceReducer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FunctionLibrary } from './FunctionLibrary';
import { FunctionRecord } from '../data/IFunction';

interface Props {
    load: () => FunctionRecord;
    save: (functions: FunctionRecord) => void;
}

const rootStyle: SxProps = {
    display: 'flex',
    gap: 1,
    padding: 1,
    backgroundColor: 'background.default',
    minHeight: 'calc(100vh - 2em)',
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
}

export const Workspace: React.FC<Props> = props => {
    const [state, dispatch] = useReducer(produce(workspaceReducer), undefined, getEmptyState);
    
    // On startup, or if the workspace ever changes, load all data from the workspace.
    // This is the only time (outside of the reducer) that we access it.
    const { load, save } = props;
    useLayoutEffect(
        () => dispatch({ type: 'load', functions: load() }), [load]
    );
    
    // Whenever an input or the process body changes, wait until it hasn't changed for short while, then run the process.
    useEffect(() => {
        const timeout = setTimeout(() => dispatch({ type: 'run' }), 500);
        return () => clearTimeout(timeout);
    }, [state.lastChange]);

    const [tab, setTab] = useState<0 | 1>(0);

    return (
        <Box sx={rootStyle}>
            <InputList
                sx={ioListStyle}
                entries={state.inputValues}
                addEntry={name => dispatch({ type: 'addInput', name })}
                removeEntry={(name) => dispatch({ type: 'removeInput', name })}
                setValue={(name, value) => dispatch({ type: 'setInput', name, value })}
            />

            <Paper elevation={3}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tab}
                        onChange={(e, newVal) => setTab(newVal)}
                        aria-label="Mode selection"
                        variant="fullWidth"
                    >
                        <Tab label="Editor" id="codeTab" aria-controls="codeTabContent" />
                        <Tab label="Library" id="libraryTab" aria-controls="libraryTabContent" />
                    </Tabs>
                </Box>
                
                <div
                    role="tabpanel"
                    hidden={tab !== 0}
                    id="codeTabContent"
                    aria-labelledby="codeTab"
                >
                    <FunctionEditor
                        id={state.currentFunctionId}
                        parameters={state.currentFunction.parameters}
                        body={state.currentFunction.body}
                        setBody={value => dispatch({ type: 'setFunctionBody', value })}
                    />
                </div>

                <div
                    role="tabpanel"
                    hidden={tab !== 1}
                    id="libraryTabContent"
                    aria-labelledby="libraryTab"
                >
                    <FunctionLibrary
                        allFunctions={[...state.functionLibrary.keys()]}
                        currentFunction={state.currentFunctionId}
                        selectFunction={id => { dispatch({ type: 'setOpenFunction', id }); setTab(0); }}
                    />
                </div>
            </Paper>

            <Output
                sx={ioListStyle}
                value={state.outputValue}
                error={state.functionError}
            />
        </Box>
    );
}