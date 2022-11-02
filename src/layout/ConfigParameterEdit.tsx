import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputIcon from '@mui/icons-material/VerticalAlignBottom';
import ConfigIcon from '@mui/icons-material/TextRotationNone';
import { canBeInput, ParameterDefinition } from '../data/Values';
import { InputText } from './InputText';

export interface Props {
    id: string;
    definition: ParameterDefinition;
    fixedValue: string | null;
    setFixedValue: (value: string | null) => void;
}

export const ConfigParameterEdit: React.FC<Props> = props => {
    const parameterTypeToggle = canBeInput(props.definition)
        ? (
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
        )
        : undefined;
    
    // TODO: different component for different parameter types?

    return (
        <InputText
            label={props.id}
            value={props.fixedValue ?? ''}
            onChange={props.setFixedValue}
            canRemove={false}
            disabled={props.fixedValue === null}
            placeholder={props.fixedValue === null ? 'This is an input, it doesn\'t have a fixed value.' : undefined}
            remove={() => {}}
            startAdornment={parameterTypeToggle}
        />
    );
}