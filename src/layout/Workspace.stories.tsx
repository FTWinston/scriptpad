import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { Workspace } from './Workspace';
import { workspaceFromJson } from '../services/workspaceFromJson';

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
        workspace: workspaceFromJson({
            processes: [
                {
                    id: 'My process',
                    operations: [
                        {
                            id: 1,
                            type: 'function',
                            function: 'replace',
                            config: {            
                                find: 'this',
                                replace: 'that',
                                matchCase: 'false',
                            },
                            inputs: {
                                'in': {
                                    type: 'process',
                                    input: 'content',
                                },
                            },
                            position: { x: 1, y: 1 },
                        }
                    ],
                    inputs: { content: 'text' },
                    outputs: { content: 'text' },
                    outputConnections: {
                        'content': {
                            type: 'operation',
                            from: 1,
                            output: 'result',
                        }
                    },
                },
            ],
            entryProcess: 'My process',
        })
    },
}

export const Multiple: StoryObj<ComponentProps<typeof Workspace>> = {
    args: {
        workspace: workspaceFromJson({
            processes: [
                {
                    id: 'My process',
                    operations: [
                        {
                            id: 1,
                            type: 'function',
                            function: 'replace',
                            config: {            
                                find: 'this',
                                replace: 'that',
                                matchCase: 'false',
                            },
                            inputs: {
                                'in': {
                                    type: 'process',
                                    input: 'content',
                                },
                            },
                            position: { x: 1, y: 2 },
                        }
                    ],
                    inputs: { content: 'text', someValue: 'text', someOther: 'text' },
                    outputs: { result1: 'text', output2: 'text' },
                    outputConnections: {
                        'content': {
                            type: 'operation',
                            from: 1,
                            output: 'result',
                        }
                    },
                }
            ],
            entryProcess: 'My process',
        }),
    }
}
