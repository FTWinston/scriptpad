import { Workspace as WorkspaceDisplay } from './layout/Workspace'
import { Workspace } from './models/Workspace';

const workspace = new Workspace(new Map());

export const App: React.FC = () => {
    return (
        <WorkspaceDisplay workspace={workspace} />
    )
}
