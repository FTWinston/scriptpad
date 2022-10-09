import { ProcessId } from '../data/identifiers';
import { IWorkspace } from '../data/IWorkspace';
import { determineProcessImportOrder } from '../services/determineProcessImportOrder';
import { processFromJson } from '../services/processFromJson';
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
   
    public static fromJson(data: IWorkspace) {
        const processes = new Map<ProcessId, Process>();

        for (const processData of data.processes) {
            const process = processFromJson(processData, processes);
            processes.set(process.id, process);
        }

        const entryProcess = processes.get(data.entryProcess);

        if (!entryProcess) {
            throw new Error(`Entry process is not part of workspace: ${data.entryProcess}`);
        }

        return new Workspace(processes, entryProcess);
    }
}