import { ComponentStory, ComponentMeta } from '@storybook/react';
import { processFromJson } from '../services/processFromJson';
import { ProcessAdaptor } from './ProcessAdaptor';

export default {
  title: 'Workspace/Process Adaptor',
  component: ProcessAdaptor,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ProcessAdaptor>;

const Template: ComponentStory<typeof ProcessAdaptor> = (args) => (
    <ProcessAdaptor {...args} />
);

export const SimpleProcess = Template.bind({});
SimpleProcess.args = {
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
};
