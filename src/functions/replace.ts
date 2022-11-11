import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';
import { escapeRegExp } from '../services/escapeRegExp';

type Parameters = {
    in: 'text',
    find: 'text',
    replace: 'text',
    matchCase: 'toggle',
    regularExpressions: 'toggle',
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
        },
        find: {
            type: 'text',
            validation: /.+/
        },
        replace: {
            type: 'text',
        },
        matchCase: {
            type: 'toggle'
        },
        regularExpressions: {
            type: 'toggle'
        },
    },
    outputs: {
        result: 'text',
    },
    defaultConfig: {
        find: '',
        replace: '',
        matchCase: 'false',
        regularExpressions: 'false',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        if (parameters.find.length === 0) {
            return { result: parameters.in };
        }
        
        const findValue = parameters.regularExpressions === 'true'
            ? parameters.find
            : escapeRegExp(parameters.find);
        
        const findExpression = new RegExp(findValue, parameters.matchCase === 'true' ? 'g' : 'gi');

        const result = parameters.in.replaceAll(findExpression, parameters.replace);
        
        return { result };
    },
});