import { RawValuesFromTypes } from '../data/Value';
import { CodeFunction } from '../models/CodeFunction';
import { ParameterValues } from '../models/FunctionParameter';
import { escapeRegExp } from '../services/escapeRegExp';

type Inputs = {
    in: 'text',
    find: 'text',
    replace: 'text',
    matchCase: 'toggle',
}

type Outputs = {
    result: 'text',
}

export default new CodeFunction<Inputs, Outputs>({
    id: 'replace',
    symbol: 'R',
    parameters: {
        in: {
            type: 'text',
            inputByDefault: true,
        },
        find: {
            type: 'text',
            inputByDefault: false,
            validation: /.+/
        },
        replace: {
            type: 'text',
            inputByDefault: false,
        },
        matchCase: {
            type: 'toggle'
        },
    },
    outputs: {
        result: 'text',
    },
    run: (inputs: Readonly<ParameterValues<Inputs>>): RawValuesFromTypes<Outputs> => {
        const findValue = inputs.matchCase === 'true'
            ? new RegExp(escapeRegExp(inputs.find), 'i')
            : inputs.find;

        const result = inputs.in.replaceAll(findValue, inputs.replace);
        
        return { result };
    },
});