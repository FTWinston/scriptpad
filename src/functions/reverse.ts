import { reverse } from 'esrever';
import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';

type Parameters = {
    in: 'text',
}

type Outputs = {
    result: 'text',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'reverse',
    symbol: 'REV',
    parameters: {
        in: {
            type: 'text',
            inputByDefault: true,
        },
    },
    outputs: {
        result: 'text',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        const result = reverse(parameters.in);
        
        return { result };
    },
});