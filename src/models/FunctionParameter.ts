export interface ToggleParameterDefinition {
    readonly type: 'toggle';
}

export interface ChoiceParameterDefinition {
    readonly type: 'choice';
    readonly options: readonly string[];
}

export interface TextParameterDefinition {
    readonly type: 'text';
    readonly validation?: RegExp;
}

export type ParameterDefinition = ToggleParameterDefinition | ChoiceParameterDefinition | TextParameterDefinition;

export type ParameterType = ParameterDefinition['type'];

// Parameter names with just their corresponding type
export type ParameterDeclaration = Record<string, ParameterType>;

// Parameter names with full definition. Parameter definition type must match corresponding declaration entry's type.
export type ParameterDefinitions<TDeclaration extends ParameterDeclaration> = {
    [Property in keyof TDeclaration]: ParameterDefinition & { type: TDeclaration[Property] }
}

// Parameter names with just their corresponding values
export type ParameterValues<TDeclaration extends ParameterDeclaration> = {
    [Property in keyof TDeclaration]: TDeclaration[Property] extends 'choice' ? string : ('true' | 'false')
}

export class FunctionParameter {
    constructor(
        public readonly definition: ParameterDefinition
    ) {}

    public value: string = '';

    public get isValid(): boolean {
        switch (this.definition.type) {
            case 'toggle':
                return this.value === 'true' || this.value === 'false';
            case 'choice':
                return this.definition.options.includes(this.value);
            case 'text':
                return this.definition.validation?.test(this.value) ?? true;
        }
    }
}