import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { ProcessDisplay } from './ProcessDisplay';

export default {
  title: 'Workspace/Process',
  component: ProcessDisplay,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof ProcessDisplay>;

export const Process: StoryObj<ComponentProps<typeof ProcessDisplay>> = {
  args: {
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
        validConnections: true,
        inputs: [{ type: 'sequence', connected: true }],
        outputs: [{ type: 'text', connected: true }],
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
        validConnections: true,
        inputs: [{ type: 'text', connected: true }],
        outputs: [{ type: 'text', connected: true }],
      },
      {
        id: 3,
        type: 'function',
        name: 'Some function',
        symbol: 'X',
        position: {
          x: 3,
          y: 3,
        },
        width: 2,
        validConnections: true,
        inputs: [{ type: 'text', connected: true }, { type: 'text', connected: true }],
        outputs: [{ type: 'text', connected: false }],
      }
    ],
    connections: [
      {
        id: 'in_to_1',
        from: { x: 1, y: -1 },
        to: { x: 1, y: 1 },
        type: 'sequence',
      },
      {
        id: '1_to_2',
        from: { x: 1, y: 1 },
        to: { x: 3, y: 1 },
        type: 'text',
      },
      {
        id: '1_to_3',
        from: { x: 1, y: 1 },
        to: { x: 3, y: 3 },
        type: 'text',
      },
      {
        id: '2_to_3',
        from: { x: 3, y: 1 },
        to: { x: 4, y: 3 },
        type: 'text',
      }
    ],
  }
};
