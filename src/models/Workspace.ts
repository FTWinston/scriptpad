import { ProcessId } from '../data/identifiers';
import { IWorkspace } from '../data/IWorkspace';
import { determineProcessImportOrder } from '../services/determineProcessImportOrder';
import { Process } from './Process';

export class Workspace {
    constructor(
        public processes: Map<ProcessId, Process>,
        public entryProcess: Process,
    ) {}

    public toJson(): IWorkspace {
        return {
            processes: determineProcessImportOrder(this.processes)
                .map(process => process.toJson()),
            entryProcess: this.entryProcess.id,
        };
    }
}