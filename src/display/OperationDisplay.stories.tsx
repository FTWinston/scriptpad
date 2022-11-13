import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { OperationDisplay } from './OperationDisplay';

export default {
  title: 'Workspace/New Operation',
  component: OperationDisplay,
} as Meta<typeof OperationDisplay>;

export const Function: StoryObj<ComponentProps<typeof OperationDisplay>> = {
  render: (args) => (
      <OperationDisplay {...args} />
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
    validConnections: true,
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
    validConnections: true,
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
    validConnections: false,
    width: 3,
    height: 1,
    inputs: [{ type: 'text', connected: false }, { type: 'sequence', connected: false }, { type: 'text', connected: false }],
    outputs: [{ type: 'sequence', connected: false }, { type: 'text', connected: false }],
  }
};
