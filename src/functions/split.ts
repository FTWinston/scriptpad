import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';

type Parameters = {
    text: 'text',
    separator: 'text',
}

type Outputs = {
    sequence: 'sequence',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'split',
    symbol: 'SPL',
    parameters: {
        text: {
            type: 'text',
            inputByDefault: true,
        },
        separator: {
            type: 'text',
            inputByDefault: false,
        },
    },
    outputs: {
        sequence: 'sequence',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        const sequence = parameters.text.split(parameters.separator);

        return { sequence };
    },
});