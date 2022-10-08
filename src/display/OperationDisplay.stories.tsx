import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OperationDisplay } from './OperationDisplay';

export default {
  title: 'Workspace/Operation',
  component: OperationDisplay,
} as ComponentMeta<typeof OperationDisplay>;

const Template: ComponentStory<typeof OperationDisplay> = (args) => (
  <svg viewBox="0.75 0.75 3.25 1.5" style={{maxWidth: '400px', maxHeight: '400px', '--background': '#aaa', '--operation-bg': '#333', '--operation-fg': '#ddd', '--operation-fg-focus': '#f00'} as React.CSSProperties}>
    <OperationDisplay {...args} />
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
  inputs: [{ type: 'text', connected: true }],
  outputs: [{ type: 'text', connected: true }],
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
  inputs: [{ type: 'text', connected: true }],
  outputs: [{ type: 'text', connected: true }],
};

export const Wide = Template.bind({});
Wide.args = {
  id: 2,
  type: 'function',
  name: 'Wide function',
  symbol: 'W',
  position: {
    x: 1,
    y: 1,
  },
  width: 3,
  height: 1,
  inputs: [{ type: 'text', connected: true }, { type: 'sequence', connected: true }, { type: 'text', connected: true }],
  outputs: [{ type: 'sequence', connected: true }, { type: 'text', connected: true }],
};
