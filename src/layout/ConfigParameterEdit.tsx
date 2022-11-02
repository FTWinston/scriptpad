import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputIcon from '@mui/icons-material/VerticalAlignBottom';
import ConfigIcon from '@mui/icons-material/TextRotationNone';
import { ParameterDefinition } from '../data/Values';
import { InputText } from './InputText';
import { InputChoice } from './InputChoice';

export interface Props {
    id: string;
    definition: ParameterDefinition;
    fixedValue: string | null;
    setFixedValue: (value: string | null) => void;
}

export const ConfigParameterEdit: React.FC<Props> = props => {
    switch (props.definition.type) {
        case 'toggle':
            return (
                <InputChoice
                    label={props.id}
                    options={['true', 'false']}
                    value={props.fixedValue ?? 'true'}
                    onChange={props.setFixedValue}
                />
            );
        case 'choice':
            return (
                <InputChoice
                    label={props.id}
                    options={props.definition.options}
                    value={props.fixedValue ?? props.definition.options[0]}
                    onChange={props.setFixedValue}
                />
            );
        case 'text':
        case 'sequence':
            return (
                <InputText
                    label={props.id}
                    value={props.fixedValue ?? ''}
                    onChange={props.setFixedValue}
                    canRemove={false}
                    disabled={props.fixedValue === null}
                    placeholder={props.fixedValue === null ? 'This is an input, it doesn\'t have a fixed value.' : undefined}
                    remove={() => {}}
                    startAdornment={(
                        <ToggleButtonGroup
                            value={props.fixedValue === null ? 'input' : 'config'}
                            size="small"
                            color="secondary"
                            exclusive
                            onChange={(_e, value) => props.setFixedValue(value === 'input' ? null : '')}
                            aria-label="parameter type"
                        >
                            <ToggleButton value="input" aria-label="dynamic input value">
                                <InputIcon />
                            </ToggleButton>
                            <ToggleButton value="config" aria-label="fixed configuration value">
                                <ConfigIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    )}
                />
            );
    }
}