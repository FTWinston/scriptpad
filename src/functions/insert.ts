import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';

type Parameters = {
    source: 'text',
    add: 'text',
    index: 'text',
    fromEnd: 'toggle',
}

type Outputs = {
    result: 'text',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'insert',
    symbol: 'INS',
    parameters: {
        source: {
            type: 'text',
        },
        add: {
            type: 'text',
            validation: /.+/
        },
        index: {
            type: 'text',
            validation: /\d+/
        },
        fromEnd: {
            type: 'toggle',
        }
    },
    outputs: {
        result: 'text',
    },
    defaultConfig: {
        add: '',
        index: '0',
        fromEnd: 'false',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        let index = parseInt(parameters.index);

        const { source, add, fromEnd } = parameters;

        // Do nothing if the index given is bigger than the length of the source.
        if (index > source.length) {
            return { result: source };
        }

        if (fromEnd) {
            index = source.length - index;
        }

        const result = `${source.substring(0, index)}${add}${source.substring(index)}`;

        return { result };
    },
});