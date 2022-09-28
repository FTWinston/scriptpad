import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import { ConnectionDisplay } from './ConnectionDisplay';

export default {
  title: 'Workspace/Connection',
  component: ConnectionDisplay,
} as ComponentMeta<typeof ConnectionDisplay>;

const Template: ComponentStory<typeof ConnectionDisplay> = (args) => (
  <svg viewBox="0 0 4 3" style={{maxWidth: '600px', maxHeight: '600px', '--connection': 'black' } as React.CSSProperties}>
      <ConnectionDisplay {...args} />
  </svg>
);

export const Straight = Template.bind({});
Straight.args = {
  from: {
    facing: 'L',
    position: { x: 1, y: 1 }
  },
  to: {
    facing: 'R',
    position: { x: 3, y: 1 }
  },
  type: 'text',
};
