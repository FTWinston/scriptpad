export type TextValue = {
    type: 'text';
    value: string;
}

export type SequenceValue = {
    type: 'sequence';
    value: string[];
}

// A value with its type declaration
export type Value = TextValue | SequenceValue;

// Just the type declaration
export type ValueType = Value['type'];

// Just the value
export type ValueValue = Value['value'];

// A set of type declarations
export type ValueTypes = Record<string, ValueType>;

// A set of values
export type RawValues = Record<string, ValueValue>;

// A set of values with their type declarations
export type Values = Record<string, Value>;

// Get a `ValueValue` from a `ValueType`
export type RawValueFromType<TValue extends ValueType>
    = TValue extends 'sequence' ? SequenceValue['value']
    : TValue extends 'text' ? TextValue['value']
    : never;

// Get a `Value` from a `ValueType`
export type ValueFromType<TValue extends ValueType> = { type: TValue, value: RawValueFromType<TValue> };

// Get a `RawValues` from a `ValueTypes`
export type RawValuesFromTypes<TValues extends Readonly<ValueTypes>> = {
    [Property in keyof TValues]: RawValueFromType<TValues[Property]>;
};

// Get a `Values` from a `ValueTypes`
export type ValuesFromTypes<TValues extends Readonly<ValueTypes>> = {
    [Property in keyof TValues]: ValueFromType<TValues[Property]>;
};

export function createValueFromRaw(value: string | string[]): Value {
    return {
        type: Array.isArray(value) ? 'sequence' : 'text',
        value,
    } as Value;
}

export function wrapValues<TValues extends ValueTypes>(values: RawValuesFromTypes<TValues>): ValuesFromTypes<TValues> {
    const output = {} as ValuesFromTypes<TValues>;

    for (const [key, value] of Object.entries(values)) {
        (output as any)[key] = createValueFromRaw(value);
    }

    return output;
}

export function extractValues<TValues extends ValueTypes>(values: ValuesFromTypes<TValues>): RawValuesFromTypes<TValues> {
    const output = {} as RawValuesFromTypes<TValues>;

    for (const [key, value] of Object.entries(values)) {
        (output as any)[key] = value.value;
    }

    return output;
}