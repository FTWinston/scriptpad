import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import { FunctionRecord } from './data/IFunction';
import { Workspace } from './components/Workspace'

const savedFunctionKey = 'functions';
const loadFunctions = () => {
    const strFunctions = localStorage.getItem(savedFunctionKey);
    return strFunctions
        ? JSON.parse(strFunctions)
        : {};
};

const saveFunctions = (functions: FunctionRecord) => {
    localStorage.setItem(savedFunctionKey, JSON.stringify(functions))
};

export const App: React.FC = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
        () => createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
            },
        }),
        [prefersDarkMode],
    );
    
    return (
        <ThemeProvider theme={theme}>
            <Workspace load={loadFunctions} save={saveFunctions} />
        </ThemeProvider>
    )
}
