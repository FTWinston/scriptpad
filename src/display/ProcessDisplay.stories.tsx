import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ProcessDisplay } from './ProcessDisplay';

export default {
  title: 'Workspace/Process',
  component: ProcessDisplay,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ProcessDisplay>;

const Template: ComponentStory<typeof ProcessDisplay> = (args) => (
    <ProcessDisplay {...args} />
);

export const Process = Template.bind({});
Process.args = {
  operations: [
    {
      id: 1,
      type: 'function',
      name: 'Some function',
      symbol: 'F',
      position: {
        x: 1,
        y: 1,
      },
      width: 1,
      height: 1,
    },
    {
      id: 2,
      type: 'process',
      name: 'Some process',
      symbol: 'P',
      position: {
        x: 3,
        y: 1,
      },
      width: 1,
      height: 1,
    }
  ],
  connections: [
    {
      id: 'in_to_1',
      from: {
        facing: 'U',
        position: { x: 1.5, y: 0 }
      },
      to: {
        facing: 'D',
        position: { x: 1.5, y: 1.5 }
      },
      type: 'sequence',
    },
    {
      id: '1_to_2',
      from: {
        facing: 'L',
        position: { x: 1.5, y: 1.5 }
      },
      to: {
        facing: 'R',
        position: { x: 3.5, y: 1.5 }
      },
      type: 'text',
    }
  ],
};
