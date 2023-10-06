import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { SxProps } from '@mui/material/styles';
import produce from 'immer';
import { useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { InputList } from './InputList';
import { Output } from './Output';
import { FunctionEditor } from './FunctionEditor';
import { getEmptyState, workspaceReducer } from '../utils/workspaceReducer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FunctionLibrary } from './FunctionLibrary';
import { FunctionRecord } from '../data/IFunction';
import { functionsToJson } from '../utils/functionsToJson';
import { TabPanel } from './TabPanel';
import { promptFunctionName } from '../utils/promptFunctionName';

interface Props {
    load: () => FunctionRecord;
    save: (functions: FunctionRecord) => void;
}

const rootStyle: SxProps = {
    display: 'grid',
    gap: 1,
    padding: 1,
    gridTemplate: '1fr / 1fr 1fr 1fr',
    backgroundColor: 'background.default',
    alignItems: 'stretch',
    overflow: 'hidden',
}

const columnStyle: SxProps = {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    flexGrow: 1,
    position: 'relative',
    minHeight: 'calc(100vh - 2em)',
    maxHeight: 'calc(100vh - 2em)',
}

const ioColumnStyle: SxProps = {
    ...columnStyle,
    overflowY: 'auto',
}

export const Workspace: React.FC<Props> = props => {
    const [state, dispatch] = useReducer(produce(workspaceReducer), undefined, getEmptyState);
    
    // On startup, load saved functions.
    const { load, save } = props;
    useLayoutEffect(
        () => dispatch({ type: 'load', functions: load() }), []
    );

    // Save changes after the function library is updated
    useEffect(() => {
        if (state.lastSaveTrigger === undefined) {
            return;
        }

        save(functionsToJson(state.functionLibrary));
    }, [state.lastSaveTrigger]);

    // Whenever an input or the function body changes, wait until it hasn't changed for short while, then run the function.
    useEffect(() => {
        const timeout = setTimeout(() => dispatch({ type: 'run' }), 500);
        return () => clearTimeout(timeout);
    }, [state.lastRunTrigger]);

    const [tab, setTab] = useState<0 | 1>(0);

    const saveChanges = () => {
        const id = state.currentFunctionId ?? promptFunctionName(state.currentFunctionId, [...state.functionLibrary.keys()]);

        if (id === null) {
            return;
        }

        dispatch({ type: 'save', id });
    };

    return (
        <Box sx={rootStyle}>
            <InputList
                sx={ioColumnStyle}
                entries={state.inputValues}
                addEntry={name => dispatch({ type: 'addInput', name })}
                removeEntry={(name) => dispatch({ type: 'removeInput', name })}
                setValue={(name, value) => dispatch({ type: 'setInput', name, value })}
            />

            <Paper sx={columnStyle} elevation={3}>
                <Tabs
                    value={tab}
                    onChange={(_, newVal) => setTab(newVal)}
                    aria-label="Mode selection"
                    variant="fullWidth"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Editor" id="codeTab" aria-controls="codeTabContent" />
                    <Tab label="Library" id="libraryTab" aria-controls="libraryTabContent" />
                </Tabs>

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
                        hasChanges={state.unsavedChangesToCurrentFunction}
                        saveChanges={saveChanges}
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
                        selectFunction={id => { dispatch({ type: 'openFunction', id }); setTab(0); }}
                        renameFunction={(oldId, newId) => dispatch({ type: 'renameFunction', id: oldId, newId })}
                        deleteFunction={id => dispatch({ type: 'deleteFunction', id })}
                    />
                </TabPanel>
            </Paper>

            <Output
                sx={ioColumnStyle}
                value={state.outputValue}
                error={state.functionError}
            />
        </Box>
    );
}
