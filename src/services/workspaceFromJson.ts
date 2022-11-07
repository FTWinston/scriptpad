import { IConnection, IOperationConnection, IProcessConnection } from '../data/IConnection';
import { ProcessId, OperationId } from '../data/identifiers';
import { IFunctionOperation, IOperation, IProcessOperation } from '../data/IOperation';
import { IProcess } from '../data/IProcess';
import { arrayToMap, objectToMap } from './maps';
import { getFunction } from '../models/CodeFunction';
import { Connection } from '../models/Connection';
import { FunctionOperation } from '../models/FunctionOperation';
import { Operation } from '../models/Operation';
import { OperationConnection } from '../models/OperationConnection';
import { Process } from '../models/Process';
import { ProcessConnection } from '../models/ProcessConnection';
import { ProcessOperation } from '../models/ProcessOperation';
import '../functions'; // Side Effect: load the actual functions!
import { IWorkspace } from '../data/IWorkspace';
import { Workspace } from '../models/Workspace';

function connectionFromJson(data: IConnection, process: Process): Connection {
    if (data.type === 'operation') {
        return operationConnectionFromJson(data, process.operations);
    }
    else { // if (data.type === 'process')
        return processConnectionFromJson(data, process);
    }
}

function operationConnectionFromJson(data: IOperationConnection, operations: ReadonlyMap<OperationId, Operation>): OperationConnection {
    const from = operations.get(data.from);

    if (!from) {
        throw new Error(`Unrecognised operation ID: ${data.from}`);
    }

    // TODO: outputsByName here also?
    //if (!Object.hasOwn(from.outputs, data.output)) {
    if (!from.outputs.some(output => output[0] === data.output)) {
        throw new Error(`Operation output "${data.output}" not recognised for operation ${from.id}`);
    }

    return new OperationConnection(from, data.output);
}

function processConnectionFromJson(data: IProcessConnection, process: Process): ProcessConnection {
    if (!process.inputs.has(data.input)) {
        throw new Error(`Process input "${data.input}" not recognised in process ${process.id}`);
    }

    return new ProcessConnection(data.input, process);
}

function functionOperationFromJson(data: IFunctionOperation) {
    const functionToPerform = getFunction(data.function);

    if (!functionToPerform) {
        throw new Error(`Unrecognised function: ${data.function}`);
    }

    return new FunctionOperation(data.id, data.position, functionToPerform, data.config);
}

function processOperationFromJson(data: IProcessOperation, processesById: ReadonlyMap<ProcessId, Process>) {
    const process = processesById.get(data.process);

    if (!process) {
        throw new Error(`Unrecognised process: ${data.process}`);
    }

    return new ProcessOperation(data.id, data.position, process);
}


function operationFromJson(data: IOperation, processesById: ReadonlyMap<ProcessId, Process>) {
    if (data.type === 'function') {
        return functionOperationFromJson(data);
    }
    else { // if (data.type === 'process') {
        return processOperationFromJson(data, processesById);
    }
}

function processFromJson(data: IProcess, otherProcesses: ReadonlyMap<ProcessId, Process>) {
    const operations = data.operations
        .map(operation => operationFromJson(operation, otherProcesses));
    
    const operationMap = arrayToMap<OperationId, Operation>(operations);
    const inputs = objectToMap(data.inputs);
    const outputs = objectToMap(data.outputs);

    const process = new Process(data.id, operationMap, inputs, outputs, new Map());

    // We can only populate operation input connections once we have the process.
    for (let i = 0; i < operations.length; i++) {
        const operation = operations[i];
        const inputData = data.operations[i].inputs;

        operation.inputConnections = objectToMap(inputData, input => connectionFromJson(input, process));
    }

    // Likewise, now that we have the process, we can do its output connections.
    for (const [name, connection] of Object.entries<IConnection>(data.outputConnections)) {
        process.outputConnections.set(name, connectionFromJson(connection, process));
    }

    return process;
}

export function workspaceFromJson(data: IWorkspace) {
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