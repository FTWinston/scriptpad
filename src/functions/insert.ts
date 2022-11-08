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
            inputByDefault: true,
        },
        add: {
            type: 'text',
            inputByDefault: false,
            validation: /.+/
        },
        index: {
            type: 'text',
            inputByDefault: false,
            validation: /\d+/
        },
        fromEnd: {
            type: 'toggle',
        }
    },
    outputs: {
        result: 'text',
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