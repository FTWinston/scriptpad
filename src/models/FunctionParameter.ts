export interface ToggleParameterDefinition {
    readonly type: 'toggle';
}

export interface ChoiceParameterDefinition {
    readonly type: 'choice';
    readonly options: readonly string[];
}

export interface TextParameterDefinition {
    readonly type: 'text';
    readonly inputByDefault?: true;
    readonly validation?: RegExp;
}

export interface SequenceParameterDefinition {
    readonly type: 'sequence';
    readonly inputByDefault?: true;
    readonly validation?: RegExp;
}

export type ParameterDefinition = ToggleParameterDefinition | ChoiceParameterDefinition | TextParameterDefinition | SequenceParameterDefinition;

// TODO: from here there's huge overlap with the types in Value.ts

export type ParameterType = ParameterDefinition['type'];

export type RawParameterFromType<TValue extends ParameterType>
    = TValue extends 'sequence' ? string[]
    : TValue extends 'toggle' ? ('true' | 'false')
    : TValue extends 'text' ? string
    : TValue extends 'choice' ? string
    : never;

export type RawParameter = string | string[];

export type RawParameters = Record<string, RawParameter>;

// Parameter names with just their corresponding type
export type ParameterTypes = Record<string, ParameterType>;

// Parameter names with full definition. Parameter definition type must match corresponding declaration entry's type.
export type ParameterDefinitions<TDeclaration extends ParameterTypes> = {
    [Property in keyof TDeclaration]: ParameterDefinition & { type: TDeclaration[Property] }
}

// Parameter names with just their corresponding values
export type ParameterValues<TDeclaration extends ParameterTypes> = {
    [Property in keyof TDeclaration]: RawParameterFromType<TDeclaration[Property]>;
}
