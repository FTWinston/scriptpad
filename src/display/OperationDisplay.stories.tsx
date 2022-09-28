import { ComponentStory, ComponentMeta } from '@storybook/react';

import { OperationDisplay } from './OperationDisplay';

export default {
  title: 'Workspace/Operation',
  component: OperationDisplay,
} as ComponentMeta<typeof OperationDisplay>;

const Template: ComponentStory<typeof OperationDisplay> = (args) => (
  <svg>
    <g transform="scale(40,40)">
      <OperationDisplay {...args} />
    </g>
  </svg>
);

export const Function = Template.bind({});
Function.args = {
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
};

export const Process = Template.bind({});
Process.args = {
  id: 2,
  type: 'process',
  name: 'Some process',
  symbol: 'P',
  position: {
    x: 1,
    y: 1,
  },
  width: 1,
  height: 1,
};
