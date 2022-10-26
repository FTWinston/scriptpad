import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useState } from 'react';
import { Workspace } from './Workspace';
import type { Parameter } from './Parameter';
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
        const [inputs, setInputs] = useState<Parameter[]>(args.inputs);

        const setInput = (index: number, value: string) => {
            setInputs(inputs => {
                const newInputs = [...inputs];
                newInputs[index].value = value;
                return newInputs;
            })
        }

        const addInput = () => {
            setInputs(inputs => ([
                ...inputs,
                {
                    name: 'new input',
                    value: '',
                }
            ]))
        }

        const removeInput = (index: number) => {
            setInputs(inputs => {
                const newInputs = [...inputs];
                newInputs.splice(index, 1);
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
        inputs: [
            {
                name: 'Input',
                value: '',
            }
        ],
        outputs: [
            {
                name: 'Output',
                value: '',
            }
        ],
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
        inputs: [
            {
                name: 'Input 1',
                value: '',
            },
            {
                name: 'Input 2',
                value: 'Some val',
            },
            {
                name: 'Input 3',
                value: 'Yo',
            }
        ],
        outputs: [
            {
                name: 'Output 1',
                value: 'Something',
            },
            {
                name: 'Output 2',
                value: 'Something else',
            }
        ],
        
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
