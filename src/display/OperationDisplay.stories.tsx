import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { OperationDisplay } from './OperationDisplay';

export default {
  title: 'Workspace/Operation',
  component: OperationDisplay,
} as Meta<typeof OperationDisplay>;

export const Function: StoryObj<ComponentProps<typeof OperationDisplay>> = {
  render: (args) => (
    <svg viewBox="0.75 0.75 3.25 1.5" style={{maxWidth: '400px', maxHeight: '400px', '--background': '#aaa', '--operation-bg': '#333', '--operation-fg': '#ddd', '--operation-fg-focus': '#f00'} as React.CSSProperties}>
      <OperationDisplay {...args} />
    </svg>
  ),

  args: {
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
  }
};

export const Process = {
  ...Function,
  args: {
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
  }
};

export const Wide = {
  ...Function,
  args: {
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
  }
};
