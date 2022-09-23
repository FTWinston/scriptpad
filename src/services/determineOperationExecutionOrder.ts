import { Operation } from '../models/Operation';
import { OperationConnection } from '../models/OperationConnection';
import { sortDependencyArray } from './sortDependencyArray';

export function determineOperationExecutionOrder(operations: ReadonlyMap<unknown, Operation>): Operation[] {
    const executionOrder = sortDependencyArray([...operations.values()], getInputOperationsFromConnections);

    if (executionOrder === null) {
        throw new Error('Cyclic operation dependencies detected, cannot execute');
    }

    return executionOrder;
}

function getInputOperationsFromConnections(operation: Operation) {
    const operationInputs = operation.inputs
        .filter(input => input.type === 'operation') as OperationConnection[];

    return operationInputs
        .map(input => input.from);
}
