import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useState } from 'react';
import { Workspace } from './Workspace';
import { processFromJson } from '../services/processFromJson';

export default {
    title: 'Page/Workspace',
    component: Workspace,
    parameters: {
        layout: 'fullscreen',
        background: { default: 'light' }
    },
} as Meta<typeof Workspace>;

export const Simple: StoryObj<ComponentProps<typeof Workspace>> = {
    render: (args) => {
        const [inputs, setInputs] = useState<Record<string, string>>(args.inputs);

        const setInput = (name: string, value: string) => {
            setInputs(inputs => {
                return {
                    ...inputs,
                    [name]: value
                };
            })
        }

        const addInput = () => {
            setInputs(inputs => ({
                ...inputs,
                'new input': '',
            }))
        }

        const removeInput = (name: string) => {
            setInputs(inputs => {
                const newInputs = { ...inputs };
                delete newInputs[name];
                return newInputs;
            })
        }

        return (
            <Workspace
                {...args}
                inputs={inputs}
                setInput={setInput}
                addInput={addInput}
                removeInput={removeInput}
            />
        );
    },
    args: {
        inputs: {
            'Input': ''
        },
        outputs: {
            'Output': ''
        },
        process: processFromJson({
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
            inputs: { content: 'text' },
            outputs: { content: 'text' },
            outputConnections: {
              'content': {
                type: 'operation',
                from: 1,
                output: 'result',
              }
            },
        }, new Map()),
    }
}

export const Multiple: StoryObj<ComponentProps<typeof Workspace>> = {
    ...Simple,
    args: {
        inputs: {
            'Input 1': '',
            'Input 2': 'Some val',
            'Input 3': 'Yo'
        },
        outputs: {
            'Output 1': 'Something',
            'Output 2': 'Something else',
        },
        process: processFromJson({
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
        }, new Map()),
    }
}
