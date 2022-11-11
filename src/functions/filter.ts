import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';
import { escapeRegExp } from '../services/escapeRegExp';

type Parameters = {
    items: 'sequence',
    find: 'text',
    type: 'choice',
    matchCase: 'toggle',
    regularExpressions: 'toggle',
}

type Outputs = {
    items: 'sequence',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'filter',
    symbol: 'FIL',
    parameters: {
        items: {
            type: 'sequence',
        },
        find: {
            type: 'text',
            validation: /.+/
        },
        type: {
            type: 'choice',
            options: ['contains', 'starts with', 'ends with', 'exact match']
        },
        matchCase: {
            type: 'toggle'
        },
        regularExpressions: {
            type: 'toggle'
        },
    },
    outputs: {
        items: 'sequence',
    },
    defaultConfig: {
        find: '',
        type: 'contains',
        matchCase: 'false',
        regularExpressions: 'false',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        let findValue = parameters.regularExpressions === 'true'
            ? parameters.find
            : escapeRegExp(parameters.find);

        switch (parameters.type) {
            case 'starts with':
                findValue = `^${findValue}`;
                break;
            case 'ends with':
                findValue = `${findValue}$`;
                break;
            case 'exact match':
                findValue = `^${findValue}$`;
                break;
        }

        const findExpression = new RegExp(findValue, parameters.matchCase === 'true' ? '' : 'i');

        const filteredItems = parameters.items
            .filter(item => findExpression.test(item));

        return { items: filteredItems };
    },
});