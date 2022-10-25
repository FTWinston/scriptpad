import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { Workspace } from './Workspace';

export default {
    title: 'Page/Workspace',
    component: Workspace,
    parameters: {
        layout: 'fullscreen',
    },
} as Meta<typeof Workspace>;

export const SimpleWorkspace: StoryObj<ComponentProps<typeof Workspace>> = {
    args: {
      
    }
}
