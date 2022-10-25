import { ComponentStoryFn, Meta, StoryObj } from '@storybook/react';
import React, { ComponentProps } from 'react';

import { ConnectionDisplay } from './ConnectionDisplay';

export default {
  title: 'Workspace/Connection',
  component: ConnectionDisplay,
} as Meta<typeof ConnectionDisplay>;

const Template: ComponentStoryFn<typeof ConnectionDisplay> = (args) => (
  <svg viewBox="0 0 4 4" style={{maxWidth: '600px', maxHeight: '600px', '--connection': 'black' } as React.CSSProperties}>
      <ConnectionDisplay {...args} />
  </svg>
);

export const Down: StoryObj<ComponentProps<typeof ConnectionDisplay>> = {
  render: (args) => (
    <svg viewBox="0 0 4 4" style={{maxWidth: '600px', maxHeight: '600px', '--connection': 'black' } as React.CSSProperties}>
      <ConnectionDisplay {...args} />
    </svg>
  ),
  args: {
    from: { x: 0, y: 0 },
    to: { x: 0, y: 2 },
    type: 'text',  
  }
}

export const RightDown = {
  ...Down,
  args: {
    from: { x: 0, y: 0 },
    to: { x: 1, y: 2 },
    type: 'text',
  }
};

export const LeftDown = {
  ...Down,
  args: {
    from: { x: 1, y: 0 },
    to: { x: 0, y: 2 },
    type: 'text',
  }
};

export const Right = {
  ...Down,
  args: {
    from: { x: 0, y: 1 },
    to: { x: 1, y: 1 },
    type: 'text',
  }
};

export const Left = {
  ...Down,
  args: {
    from: { x: 1, y: 1 },
    to: { x: 0, y: 1 },
    type: 'text',
  }
};

export const RightUp = {
  ...Down,
  args: {
    from: { x: 0, y: 2 },
    to: { x: 1, y: 1 },
    type: 'text',
  }
};

export const LeftUp = {
  ...Down,
  args: {
    from: { x: 1, y: 2 },
    to: { x: 0, y: 1 },
    type: 'text',
  }
};
