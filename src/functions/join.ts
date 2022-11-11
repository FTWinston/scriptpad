import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';

type Parameters = {
    sequence: 'sequence',
    separator: 'text',
}

type Outputs = {
    text: 'text',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'join',
    symbol: 'JOI',
    parameters: {
        sequence: {
            type: 'sequence',
        },
        separator: {
            type: 'text',
        },
    },
    outputs: {
        text: 'text',
    },
    defaultConfig: {
        separator: '\n',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        const text = parameters.sequence.join(parameters.separator);
        
        return { text };
    },
});