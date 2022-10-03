// Just the type declaration
export type ValueType = 'text' | 'sequence';

export type RawValue = string | string[];

// A set of type declarations
export type ValueTypes = Record<string, ValueType>;

// A set of values
export type RawValues = Record<string, RawValue>;

// Get a `ValueValue` from a `ValueType`
export type RawValueFromType<TValue extends ValueType>
    = TValue extends 'sequence' ? string[]
    : TValue extends 'text' ? string
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
