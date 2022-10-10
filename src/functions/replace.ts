import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';
import { escapeRegExp } from '../services/escapeRegExp';

type Parameters = {
    in: 'text',
    find: 'text',
    replace: 'text',
    matchCase: 'toggle',
}

type Outputs = {
    result: 'text',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'replace',
    symbol: 'RPL',
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
    run: (inputs: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        if (inputs.find.length === 0) {
            return { result: inputs.in };
        }
        
        const findValue = inputs.matchCase === 'true'
            ? new RegExp(escapeRegExp(inputs.find), 'i')
            : inputs.find;

        const result = inputs.in.replaceAll(findValue, inputs.replace);
        
        return { result };
    },
});