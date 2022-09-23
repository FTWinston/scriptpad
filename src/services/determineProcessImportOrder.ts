import { Process } from '../models/Process';
import { ProcessOperation } from '../models/ProcessOperation';
import { sortDependencyArray } from './sortDependencyArray';

export function determineProcessImportOrder(processes: ReadonlyMap<unknown, Process>): Process[] {
    const importOrder = sortDependencyArray([...processes.values()], getProcessesFromOperations);

    if (importOrder === null) {
        throw new Error('Cyclic process dependencies detected, cannot import');
    }

    return importOrder;
}

function getProcessesFromOperations(process: Process) {
    const processOperations = [...process.operations.values()]
        .filter(operation => operation.type === 'process') as ProcessOperation[];

    return processOperations
        .map(operation => operation.process);
}
