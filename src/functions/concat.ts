import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';

type Parameters = {
    first: 'text',
    second: 'text',
    third: 'text',
    fourth: 'text',
    fifth: 'text',
}

type Outputs = {
    result: 'text',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'concat',
    symbol: 'CON',
    parameters: {
        first: {
            type: 'text',
            inputByDefault: false,
        },
        second: {
            type: 'text',
            inputByDefault: true,
        },
        third: {
            type: 'text',
            inputByDefault: false,
        },
        fourth: {
            type: 'text',
            inputByDefault: false,
        },
        fifth: {
            type: 'text',
            inputByDefault: false,
        },
    },
    outputs: {
        result: 'text',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        return { result: `${parameters.first}${parameters.second}${parameters.third}${parameters.fourth}${parameters.fifth}` };
    },
});