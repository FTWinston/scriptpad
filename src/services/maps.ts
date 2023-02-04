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