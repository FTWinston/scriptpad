import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import { ConnectionDisplay } from './ConnectionDisplay';

export default {
  title: 'Workspace/Connection',
  component: ConnectionDisplay,
} as ComponentMeta<typeof ConnectionDisplay>;

const Template: ComponentStory<typeof ConnectionDisplay> = (args) => (
  <svg viewBox="0 0 4 4" style={{maxWidth: '600px', maxHeight: '600px', '--connection': 'black' } as React.CSSProperties}>
      <ConnectionDisplay {...args} />
  </svg>
);

export const Down = Template.bind({});
Down.args = {
  from: { x: 0, y: 0 },
  to: { x: 0, y: 2 },
  type: 'text',
};

export const RightDown = Template.bind({});
RightDown.args = {
  from: { x: 0, y: 0 },
  to: { x: 1, y: 2 },
  type: 'text',
};

export const LeftDown = Template.bind({});
LeftDown.args = {
  from: { x: 1, y: 0 },
  to: { x: 0, y: 2 },
  type: 'text',
};

export const Right = Template.bind({});
Right.args = {
  from: { x: 0, y: 1 },
  to: { x: 1, y: 1 },
  type: 'text',
};

export const Left = Template.bind({});
Left.args = {
  from: { x: 1, y: 1 },
  to: { x: 0, y: 1 },
  type: 'text',
};

export const RightUp = Template.bind({});
RightUp.args = {
  from: { x: 0, y: 2 },
  to: { x: 1, y: 1 },
  type: 'text',
};

export const LeftUp = Template.bind({});
LeftUp.args = {
  from: { x: 1, y: 2 },
  to: { x: 0, y: 1 },
  type: 'text',
};
