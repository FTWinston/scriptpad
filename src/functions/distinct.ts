import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';

type Parameters = {
    items: 'sequence',
    type: 'choice',
    matchCase: 'toggle',
}

type Outputs = {
    items: 'sequence',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'distinct',
    symbol: 'DIS',
    parameters: {
        items: {
            type: 'sequence',
        },
        type: {
            type: 'choice',
            options: ['distinct items', 'duplicate items', 'unique items']
        },
        matchCase: {
            type: 'toggle'
        },
    },
    outputs: {
        items: 'sequence',
    },
    defaultConfig: {
        type: 'distinct items',
        matchCase: 'false',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        const countsByKey = new Map<string, number>();
        const itemsByKey = new Map<string, string>();

        const getCountKey = parameters.matchCase === 'true'
            ? (item: string) => item
            : (item: string) => item.toLocaleUpperCase();

        for (const item of parameters.items) {
            const key = getCountKey(item);
            const prevCount = countsByKey.get(key);

            if (prevCount === undefined) {
                countsByKey.set(key, 1);
                itemsByKey.set(key, item);
            }
            else {
                countsByKey.set(key, prevCount + 1);
            }
        }
        
        switch (parameters.type) {
            case 'duplicate items': {
                for (const [key, count] of countsByKey) {
                    if (count <= 1) {
                        itemsByKey.delete(key);
                    }
                }
                break;
            }
            case 'unique items': {
                for (const [key, count] of countsByKey) {
                    if (count > 1) {
                        itemsByKey.delete(key);
                    }
                }
                break;
            }
        }

        const filteredItems = [...itemsByKey.values()];
        return { items: filteredItems };
    },
});