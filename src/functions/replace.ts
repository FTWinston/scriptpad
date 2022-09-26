import { RawValuesFromTypes } from '../data/Value';
import { CodeFunction } from '../models/CodeFunction';
import { ParameterValues } from '../models/FunctionParameter';
import { escapeRegExp } from '../services/escapeRegExp';

type Parameters = {
    find: 'text'
    replace: 'text'
    matchCase: 'toggle'
}

type Inputs = ['text'];

type Outputs = ['text'];

export default new CodeFunction<Inputs, Outputs, Parameters>({
    id: 'replace',
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
    run: (inputs: RawValuesFromTypes<Inputs>, parameters: ParameterValues<Parameters>): RawValuesFromTypes<Outputs> => {
        const input = inputs[0];

        const findValue = parameters.matchCase === 'true'
            ? new RegExp(escapeRegExp(parameters.find), 'i')
            : parameters.find;

        const output = input.replaceAll(findValue, parameters.replace);
        
        return [output];
    },
});