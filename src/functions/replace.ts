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
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        if (parameters.find.length === 0) {
            return { result: parameters.in };
        }
        
        const findValue = parameters.matchCase === 'true'
            ? new RegExp(escapeRegExp(parameters.find), 'i')
            : parameters.find;

        const result = parameters.in.replaceAll(findValue, parameters.replace);
        
        return { result };
    },
});