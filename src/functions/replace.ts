import { Value } from '../data/Value';
import { CodeFunction } from '../models/CodeFunction';
import { ParameterValues } from '../models/FunctionParameter';
import { escapeRegExp } from '../services/escapeRegExp';

type Parameters = {
    find: 'text'
    replace: 'text'
    matchCase: 'toggle'
}

export default new CodeFunction<Parameters>({
    id: 'replace',
    inputs: ['text'],
    outputs: ['text'],
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
    run: (inputs: readonly Value[], parameters: ParameterValues<Parameters>) => {
        const input = inputs[0];
        if (input.type !== 'text') {
            throw new Error();
        }

        const findValue = parameters.matchCase === 'true'
            ? new RegExp(escapeRegExp(parameters.find), 'i')
            : parameters.find;

        const value = input.value
            .replaceAll(findValue, parameters.replace);

        return [
            {
                type: 'text',
                value
            }
        ]  
    },
});