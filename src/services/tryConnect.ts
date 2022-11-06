import { IOType } from '../data/Values';
import { Connection, Connections } from '../models/Connection';
import { OperationConnection } from '../models/OperationConnection';
import { Process } from '../models/Process';
import { ProcessConnection } from '../models/ProcessConnection';

function createConnection(fromOperationId: number | undefined, process: Process, fromConnectorNumber: number) {
    const fromOperation = fromOperationId === undefined
        ? undefined
        : process.operations.get(fromOperationId);

    let connection: Connection;
    let dataType: IOType;

    if (fromOperation) {
        const [outputName, outputType] = fromOperation.outputs[fromConnectorNumber];
        connection = new OperationConnection(fromOperation, outputName);
        dataType = outputType;
    }
    else {
        // TODO: Don't sometimes use an array, and othertimes a map. Be consistent, to index lookup in a map, or iterating an array for a name.
        const [processInputName, processInputType] = [...process.inputs.entries()][fromConnectorNumber];
        connection = new ProcessConnection(processInputName, process);
        dataType = processInputType;
    }

    return { connection, dataType };
}

export function tryConnect(
    process: Process,
    fromOperationId: number | undefined,
    fromConnectorNumber: number,
    toOperationId: number | undefined,
    toConnectorNumber: number
) {
    const { connection, dataType: fromDataType } = createConnection(fromOperationId, process, fromConnectorNumber);

    const toOperation = toOperationId === undefined
        ? undefined
        : process.operations.get(toOperationId);

    let connections: Connections;
    let toConnectorName: string;
    let toDataType: IOType;

    if (toOperation) {
        [toConnectorName, toDataType] = toOperation.inputs[toConnectorNumber];
        connections = toOperation.inputConnections;
    }
    else {
        // TODO: Don't sometimes use an array, and othertimes a map. Be consistent, to index lookup in a map, or iterating an array for a name.
        [toConnectorName, toDataType] = [...process.outputs.entries()].at(toConnectorNumber)!;
        connections = process.outputConnections
    }

    if (toDataType !== fromDataType) {
        return false;
    }

    connections.set(toConnectorName, connection);
    return true;
}
