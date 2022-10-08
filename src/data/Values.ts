// There's a lot of almost-duplication here, because parameters can have types that IO values cannot.
// So a lot of these definitions end up being done twice, for clarity.

export interface ToggleParameterDefinition {
    readonly type: 'toggle';
}

export interface ChoiceParameterDefinition {
    readonly type: 'choice';
    readonly options: readonly string[];
}

export interface TextParameterDefinition {
    readonly type: 'text';
    readonly inputByDefault: boolean;
    readonly validation?: RegExp;
}

export interface SequenceParameterDefinition {
    readonly type: 'sequence';
    readonly inputByDefault: boolean;
    readonly validation?: RegExp;
}

// Type name and any configuration options for each each type of parameter
export type ParameterDefinition = ToggleParameterDefinition | ChoiceParameterDefinition | TextParameterDefinition | SequenceParameterDefinition;

// Just the type names
export type ParameterType = ParameterDefinition['type'];
export type IOType = 'text' | 'sequence';

// Just the underlying values
export type ParameterValue = string | string[];
export type IOValue = string | string[];

// Type names by parameter name
export type ParameterTypes = Record<string, ParameterType>;
export type IOTypes = Record<string, IOType>;

// Values by parameter name
export type RawParameters = Record<string, ParameterValue>;
export type IOValues = Record<string, IOValue>;

// Get a ParameterValue from a ParameterType
export type ParameterValueFromType<TValue extends ParameterType>
    = TValue extends 'sequence' ? string[]
    : TValue extends 'toggle' ? ('true' | 'false')
    : TValue extends 'text' ? string
    : TValue extends 'choice' ? string
    : never;

// Get an IOValue from an IOType
export type IOValueFromType<TValue extends IOType>
    = TValue extends 'sequence' ? string[]
    : TValue extends 'text' ? string
    : never;

// Parameter names with full definition. Parameter definition type must match corresponding declaration entry's type.
export type ParameterDefinitionsFromTypes<TParameterTypes extends ParameterTypes> = {
    [Property in keyof TParameterTypes]: ParameterDefinition & { type: TParameterTypes[Property] }
}

// Parameter names with their corresponding values
export type ParameterValuesFromTypes<TDeclaration extends ParameterTypes> = {
    [Property in keyof TDeclaration]: ParameterValueFromType<TDeclaration[Property]>;
}

// IO names with their corresponding values
export type IOValuesFromTypes<TValues extends Readonly<IOTypes>> = {
    [Property in keyof TValues]: IOValueFromType<TValues[Property]>;
};
