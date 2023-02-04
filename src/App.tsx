import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import { Workspace as WorkspaceDisplay } from './layout/Workspace'
import { Workspace } from './models/Workspace';

const workspace = new Workspace(new Map());

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
            <WorkspaceDisplay workspace={workspace} />
        </ThemeProvider>
    )
}
