import { Identifiable } from '../data/Identifiable';

type MapKey = string | number | symbol;

export function objectToMap<TKey extends MapKey, TValue, TResult>(
    object: Readonly<Record<TKey, TValue>>,
    transform: (value: TValue, key: TKey) => TResult | undefined
): Map<TKey, TResult>;
export function objectToMap<TKey extends MapKey, TValue>(
    object: Readonly<Record<TKey, TValue>>
): Map<TKey, TValue>;
export function objectToMap<TKey extends MapKey, TValue, TResult>(
    object: Readonly<Record<TKey, TValue>>,
    transform?: (value: TValue, key: TKey) => TResult | undefined
): Map<TKey, TValue | TResult> {
    const result = new Map<TKey, TValue | TResult>();

    for (const [key, sourceValue] of Object.entries<TValue>(object)) {
        const destinationValue = transform === undefined ? sourceValue : transform(sourceValue, key as TKey);

        if (destinationValue !== undefined) {
            result.set(key as TKey, destinationValue);
        }
    }

    return result;
}

export function mapToObject<TKey extends MapKey, TValue, TResult>(
    map: ReadonlyMap<TKey, TValue>,
    transform: (value: TValue, key: TKey) => TResult | undefined
): Record<TKey, TResult>;
export function mapToObject<TKey extends MapKey, TValue>(
    map: ReadonlyMap<TKey, TValue>
): Record<TKey, TValue>;
export function mapToObject<TKey extends MapKey, TValue, TResult = TValue>(
    map: ReadonlyMap<TKey, TValue>,
    transform?: (value: TValue, key: TKey) => TResult | undefined
): Record<TKey, TValue | TResult> {
    const result = {} as Record<TKey, TValue | TResult>;

    for (const [key, sourceValue] of map.entries()) {
        const destinationValue = transform === undefined ? sourceValue : transform(sourceValue, key as TKey);
        
        if (destinationValue !== undefined) {
            result[key] = destinationValue;
        }
    }

    return result;
}


export function mapToMap<TKey extends MapKey, TValueFrom, TValueTo>(
    map: ReadonlyMap<TKey, TValueFrom>,
    transform: (value: TValueFrom, key: TKey) => TValueTo | undefined
): Map<TKey, TValueTo> {
    const result = new Map<TKey, TValueTo>();

    for (const [key, sourceValue] of map.entries()) {
        const destinationValue = transform(sourceValue, key);

        if (destinationValue !== undefined) {
            result.set(key as TKey, destinationValue);
        }
    }

    return result;
}

export function arrayToMap<TKey, TValue extends Identifiable<TKey>>(
    items: readonly TValue[]
): Map<TKey, TValue> {
    return new Map<TKey, TValue>(
        items.map(item => [item.id, item])
    );
}

export function mapToArray<TKey extends MapKey, TValue, TResult>(
    map: ReadonlyMap<TKey, TValue>,
    transform: (value: TValue, key: TKey) => TResult
): TResult[] {
    return [...map.entries()]
        .map(([key, value]) => transform(value, key));
}

export function objectToArray<TKey extends MapKey, TValue, TResult>(
    object: Readonly<Record<TKey, TValue>>,
    transform: (value: TValue, key: TKey) => TResult | undefined
): TResult[] {
    const result: TResult[] = [];

    for (const [key, sourceValue] of Object.entries<TValue>(object)) {
        const destinationValue = transform(sourceValue, key as TKey);

        if (destinationValue !== undefined) {
            result.push(destinationValue);
        }
    }

    return result;
}

export function getMaxValue<TValue>(map: ReadonlyMap<unknown, TValue>, getValue: (value: TValue) => number): number {
    let maxValue = Number.MIN_SAFE_INTEGER;

    for (const entry of map.values()) {
        const value = getValue(entry);
        if (value > maxValue) {
            maxValue = value;
        }
    }

    return maxValue;
}