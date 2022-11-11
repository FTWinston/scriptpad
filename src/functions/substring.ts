import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';

type Parameters = {
    in: 'text',
    startIndex: 'text',
    length: 'text',
    keep: 'choice',
}

type Outputs = {
    result: 'text',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'substring',
    symbol: 'SUB',
    parameters: {
        in: {
            type: 'text',
        },
        startIndex: {
            type: 'text',
            validation: /\d+/
        },
        length: {
            type: 'text',
            validation: /\d?/
        },
        keep: {
            type: 'choice',
            options: ['matched section', 'everything outside the match'],
        },
    },
    outputs: {
        result: 'text',
    },
    defaultConfig: {
        startIndex: '0',
        length: '0',
        keep: 'matched section',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        const startIndex = parseInt(parameters.startIndex);
        const endIndex = parameters.length === ''
            ? undefined
            : parseInt(parameters.length) + startIndex;

        let result: string;

        if (parameters.keep === 'matched section') {
            result = parameters.in.slice(startIndex, endIndex);
        }
        else if (endIndex === undefined) {
            result = parameters.in.slice(0, startIndex);
        }
        else {
            result = parameters.in.slice(0, startIndex) + parameters.in.slice(endIndex);
        }

        return { result };
    },
});