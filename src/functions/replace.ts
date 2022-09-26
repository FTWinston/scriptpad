import { RawValuesFromTypes } from '../data/Value';
import { CodeFunction } from '../models/CodeFunction';
import { ParameterValues } from '../models/FunctionParameter';
import { escapeRegExp } from '../services/escapeRegExp';

type Parameters = {
    find: 'text'
    replace: 'text'
    matchCase: 'toggle'
}

type Inputs = {
    replaceIn: 'text',
}

type Outputs = {
    result: 'text',
}

export default new CodeFunction<Inputs, Outputs, Parameters>({
    id: 'replace',
    inputs: {
        replaceIn: 'text',
    },
    outputs: {
        result: 'text',
    },
    parameters: {
        find: {
            type: 'text',
            validation: /.+/
        },
        replace: {
            type: 'text'
        },
        matchCase: {
            type: 'toggle'
        },
    },
    run: (inputs: Readonly<RawValuesFromTypes<Inputs>>, parameters: ParameterValues<Parameters>): RawValuesFromTypes<Outputs> => {
        const findValue = parameters.matchCase === 'true'
            ? new RegExp(escapeRegExp(parameters.find), 'i')
            : parameters.find;

        const result = inputs.replaceIn.replaceAll(findValue, parameters.replace);
        
        return { result };
    },
});