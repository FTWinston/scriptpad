import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { Workspace } from './Workspace';

export default {
    title: 'Page/Workspace',
    component: Workspace,
    parameters: {
        layout: 'fullscreen',
        background: { default: 'light' }
    },
} as Meta<typeof Workspace>;

export const Simple: StoryObj<ComponentProps<typeof Workspace>> = {
    args: {
        load: () => ({}),
        save: () => {},
    },
}

export const Multiple: StoryObj<ComponentProps<typeof Workspace>> = {
    args: {
        load: () => ({
            'concat': {
                parameters: ['first', 'second'],
                body: 'return first + " " + second;',
            },
            'sql insert': {
                parameters: ['values', 'tableName'],
                body: `return values
    .split('\\n')
    .map(row => row.split('\\t'))
    .map(rowValues => ("insert into [" + tableName + "] select '" + rowValues
        .map(val => val.replace("'", "''"))
        .join("', '")
        .replaceAll(/'null'/ig, 'null')
    ) + "'").join('\\n');`,
            }
        }),
        save: () => {},
    }
}
