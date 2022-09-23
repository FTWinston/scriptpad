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
