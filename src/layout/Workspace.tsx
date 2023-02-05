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
import { functionsToJson } from '../services/functionsToJson';
import { TabPanel } from './TabPanel';

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

const functionsStyle: SxProps = {
    display: 'flex',
    flexDirection: 'column',
}

const ioListStyle: SxProps = {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
}

export const Workspace: React.FC<Props> = props => {
    const [state, dispatch] = useReducer(produce(workspaceReducer), undefined, getEmptyState);
    
    // On startup, load saved functions.
    const { load, save } = props;
    useLayoutEffect(
        () => dispatch({ type: 'load', functions: load() }), []
    );
    
    // Whenever an input or the function body changes, wait until it hasn't changed for short while, then run the function.
    useEffect(() => {
        const timeout = setTimeout(() => dispatch({ type: 'run' }), 500);
        return () => clearTimeout(timeout);
    }, [state.lastUpdated]);

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

            <Paper sx={functionsStyle} elevation={3}>
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
                
                <TabPanel
                    hidden={tab !== 0}
                    id="codeTabContent"
                    tabId="codeTab"
                >
                    <FunctionEditor
                        id={state.currentFunctionId}
                        parameters={state.currentFunction.parameters}
                        body={state.currentFunction.body}
                        setBody={value => dispatch({ type: 'setFunctionBody', value })}
                        hasChanges={state.unsavedChanges}
                        saveChanges={() => {
                            let currentFunctionId: string | null;
                            do {
                                currentFunctionId = prompt('Name this function', 'New Function')?.trim() ?? null;
                                if (currentFunctionId === null) {
                                    return;
                                }
                            } while (!currentFunctionId || state.functionLibrary.has(currentFunctionId));

                            dispatch({ type: 'save', id: currentFunctionId });
                            // TODO: library hasnt' yet updated!
                            save(functionsToJson(state.functionLibrary));
                        }}
                    />
                </TabPanel>

                <TabPanel
                    hidden={tab !== 1}
                    id="libraryTabContent"
                    tabId="libraryTab"
                >
                    <FunctionLibrary
                        allFunctions={[...state.functionLibrary.keys()]}
                        currentFunction={state.currentFunctionId}
                        selectFunction={id => { dispatch({ type: 'setOpenFunction', id }); setTab(0); }}
                    />
                </TabPanel>
            </Paper>

            <Output
                sx={ioListStyle}
                value={state.outputValue}
                error={state.functionError}
            />
        </Box>
    );
}