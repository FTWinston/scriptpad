import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';
import { escapeRegExp } from '../services/escapeRegExp';

type Parameters = {
    in: 'text',
    find: 'text',
    remove: 'choice',
    matchCase: 'toggle',
    regularExpressions: 'toggle',
}

type Outputs = {
    result: 'text',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'truncate',
    symbol: 'TRU',
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
        remove: {
            type: 'choice',
            options: ['before match', 'after match', 'before and after'],
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
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        if (parameters.find.length === 0) {
            return { result: parameters.in };
        }
        
        const findValue = parameters.regularExpressions
            ? parameters.find
            : escapeRegExp(parameters.find);
        
        const findExpression = new RegExp(findValue, parameters.matchCase === 'true' ? '' : 'i');

        const match = parameters.in.match(findExpression);

        let result = parameters.in;

        if (match === null || match.index === undefined) {
            return { result };    
        }

        const matchStart = match.index;
        const matchEnd = matchStart + match[0].length;

        if (parameters.remove !== 'before match') {
            // Remove after match
            result = result.substring(0, matchEnd);
        }
        
        if (parameters.remove !== 'after match') {
            // Remove before match
            result = result.substring(matchStart);
        }

        return { result };
    },
});