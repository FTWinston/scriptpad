import { ProcessId } from './identifiers';
import { IProcess } from './IProcess';

export interface IWorkspace {
    processes: IProcess[];
    entryProcess: ProcessId;
}