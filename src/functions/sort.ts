import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';

type Parameters = {
    items: 'sequence',
    sortBy: 'choice',
    direction: 'choice',
}

type Outputs = {
    items: 'sequence',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'SORT',
    symbol: 'SRT',
    parameters: {
        items: {
            type: 'sequence',
            inputByDefault: true,
        },
        sortBy: {
            type: 'choice',
            options: ['text', 'text (ignore case)', 'length'],
        },
        direction: {
            type: 'choice',
            options: ['ascending', 'descending'],
        },
    },
    outputs: {
        items: 'sequence',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        let sortFunc: (a: string, b: string) => number;

        switch (parameters.sortBy) {
            case 'text':
                sortFunc = (a: string, b: string) => {
                    if (parameters.direction === 'descending') {
                        let tmp = a;
                        a = b;
                        b = tmp;
                    }
                    if (a < b) {
                        return -1;
                    } else if (b < a) {
                        return 1;
                    } else {
                        return 0;
                    }
                };
                break;
            case 'text (ignore case)':
                sortFunc = (a: string, b: string) => {
                    if (parameters.direction === 'descending') {
                        let tmp = a;
                        a = b;
                        b = tmp;
                    }
                    a = a.toLowerCase();
                    b = b.toLowerCase();
                    if (a < b) {
                        return -1;
                    } else if (b < a) {
                        return 1;
                    } else {
                        return 0;
                    }
                };
                break;
            case 'line length':
                sortFunc = (a: string, b: string) => {
                    if (parameters.direction === 'descending') {
                        let tmp = a;
                        a = b;
                        b = tmp;
                    }
                    if (a.length < b.length) {
                        return -1;
                    } else if (b.length < a.length) {
                        return 1;
                    } else {
                        return 0;
                    }
                };
                break;
            default:
                return { items: parameters.items };
        }

        const items = parameters.items.sort(sortFunc);

        return { items };
    },
});
