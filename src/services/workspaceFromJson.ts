import { IConnection, IOperationConnection } from '../data/IConnection';
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
        return ProcessConnection.fromJson(data, process);
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
    const outputConnections = objectToMap(data.outputConnections, output => operationConnectionFromJson(output, operationMap));

    const process = new Process(data.id, operationMap, inputs, outputs, outputConnections);

    // We can only populate input connections once we have all the operations.
    for (let i = 0; i < operations.length; i++) {
        const operation = operations[i];
        const inputData = data.operations[i].inputs;

        operation.inputConnections = objectToMap(inputData, input => connectionFromJson(input, process));
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