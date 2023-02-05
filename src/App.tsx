import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import { Workspace } from './layout/Workspace'

const loadFunctions = () => ({});
const saveFunctions = () => {};

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
