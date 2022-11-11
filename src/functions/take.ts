import { ParameterValuesFromTypes, IOValuesFromTypes} from '../data/Values';
import { CodeFunction } from '../models/CodeFunction';

type Parameters = {
    items: 'sequence',
    indices: 'text',
}

type Outputs = {
    items: 'sequence',
}

export default new CodeFunction<Parameters, Outputs>({
    id: 'Take',
    symbol: 'TAK',
    parameters: {
        items: {
            type: 'sequence',
        },
        indices: {
            type: 'text',
            validation: /\d+(\-\d+)?(,\d+(\-\d+)?)*/,
        },
    },
    outputs: {
        items: 'sequence',
    },
    defaultConfig: {
        indices: '',
    },
    run: (parameters: Readonly<ParameterValuesFromTypes<Parameters>>): IOValuesFromTypes<Outputs> => {
        const indicesToKeep = parseIndices(parameters.indices);

        const filteredItems = parameters.items.filter((_item, index) => indicesToKeep.has(index + 1));
        
        return { items: filteredItems };
    },
});

function parseIndices(strIndices: string) {
    const indices = new Set<number>();

    // Match each bit between the commas.
    const matches = strIndices.matchAll(/(\d+)(?:\-(\d+))?/);
    
    // Iterate all matches. If only group 1 is present, it's a single index. If group 2 is present, it's a range.
    for (const match of matches) {
        if (!match.groups) {
            continue;
        }

        const group1 = match.groups[1];
        const group2 = match.groups[2];

        if (!group1) {
            continue;
        }

        let firstNumber = parseInt(group1, 10);

        if (group2) {
            let secondNumber = parseInt(group2, 10);

            // Swap ranges where the first is bigger than the second.
            if (secondNumber < firstNumber) {
                let tmp = firstNumber;
                firstNumber = secondNumber;
                secondNumber = firstNumber;
            }

            for (let index=firstNumber; index<=secondNumber; index++) {
                indices.add(index);
            }
        }
        else {
            indices.add(firstNumber);
        }
    }
    
    return indices;
}
