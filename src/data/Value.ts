export type TextValue = {
    type: 'text';
    value: string;
}

export type SequenceValue = {
    type: 'sequence';
    value: string[];
}

export type Value = TextValue | SequenceValue;

export type ValueType = Value['type'];

type RawValueFromType<TValue extends ValueType> = TValue extends 'sequence' ? string[] : TValue extends 'text' ? string : never;

export type RawValuesFromTypes<TValues extends readonly ValueType[]> =
{
    [Property in keyof TValues]: RawValueFromType<TValues[Property]>;
};

export function createValueFromRaw(value: string | string[]): Value {
    return {
        type: Array.isArray(value) ? 'sequence' : 'text',
        value,
    } as Value;
}