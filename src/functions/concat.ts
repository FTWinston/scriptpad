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
        },
        second: {
            type: 'text',
        },
        third: {
            type: 'text',
        },
        fourth: {
            type: 'text',
        },
        fifth: {
            type: 'text',
        },
    },
    outputs: {
        result: 'text',
    },
    defaultConfig: {
        first: '',
        third: '',
        fourth: '',
        fifth: '',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        return { result: `${parameters.first}${parameters.second}${parameters.third}${parameters.fourth}${parameters.fifth}` };
    },
});