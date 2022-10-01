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

export const Right = Template.bind({});
Right.args = {
  from: {
    facing: 'R',
    position: { x: 0, y: 0 }
  },
  to: {
    facing: 'R',
    position: { x: 2, y: 0 }
  },
  type: 'text',
};

export const Left = Template.bind({});
Left.args = {
  from: {
    facing: 'L',
    position: { x: 2, y: 0 }
  },
  to: {
    facing: 'L',
    position: { x: 0, y: 0 }
  },
  type: 'text',
};

export const Up = Template.bind({});
Up.args = {
  from: {
    facing: 'U',
    position: { x: 0, y: 2 }
  },
  to: {
    facing: 'U',
    position: { x: 0, y: 0 }
  },
  type: 'text',
};

export const Down = Template.bind({});
Down.args = {
  from: {
    facing: 'D',
    position: { x: 0, y: 0 }
  },
  to: {
    facing: 'D',
    position: { x: 0, y: 2 }
  },
  type: 'text',
};

export const RightDown = Template.bind({});
RightDown.args = {
  from: {
    facing: 'R',
    position: { x: 0, y: 0 }
  },
  to: {
    facing: 'D',
    position: { x: 2, y: 2 }
  },
  type: 'text',
};

export const LeftDown = Template.bind({});
LeftDown.args = {
  from: {
    facing: 'L',
    position: { x: 2, y: 0 }
  },
  to: {
    facing: 'D',
    position: { x: 0, y: 2 }
  },
  type: 'text',
};

export const RightUp = Template.bind({});
RightUp.args = {
  from: {
    facing: 'R',
    position: { x: 0, y: 2 }
  },
  to: {
    facing: 'U',
    position: { x: 2, y: 0 }
  },
  type: 'text',
};

export const UpLeft = Template.bind({});
UpLeft.args = {
  from: {
    facing: 'U',
    position: { x: 2, y: 2 }
  },
  to: {
    facing: 'L',
    position: { x: 0, y: 0 }
  },
  type: 'text',
};

export const DownRight = Template.bind({});
DownRight.args = {
  from: {
    facing: 'D',
    position: { x: 0, y: 0 }
  },
  to: {
    facing: 'R',
    position: { x: 2, y: 2 }
  },
  type: 'text',
};

export const DownLeft = Template.bind({});
DownLeft.args = {
  from: {
    facing: 'D',
    position: { x: 2, y: 0 }
  },
  to: {
    facing: 'L',
    position: { x: 0, y: 2 }
  },
  type: 'text',
};

export const UpRight = Template.bind({});
UpRight.args = {
  from: {
    facing: 'U',
    position: { x: 0, y: 2 }
  },
  to: {
    facing: 'R',
    position: { x: 2, y: 0 }
  },
  type: 'text',
};

export const LeftUp = Template.bind({});
LeftUp.args = {
  from: {
    facing: 'L',
    position: { x: 2, y: 2 }
  },
  to: {
    facing: 'U',
    position: { x: 0, y: 0 }
  },
  type: 'text',
};

export const RightDownRight = Template.bind({});
RightDownRight.args = {
  from: {
    facing: 'R',
    position: { x: 0, y: 0 }
  },
  to: {
    facing: 'R',
    position: { x: 2, y: 1 }
  },
  type: 'text',
};

export const LeftDownLeft = Template.bind({});
LeftDownLeft.args = {
  from: {
    facing: 'L',
    position: { x: 2, y: 0 }
  },
  to: {
    facing: 'L',
    position: { x: 0, y: 1 }
  },
  type: 'text',
};

export const RightUpRight = Template.bind({});
RightUpRight.args = {
  from: {
    facing: 'R',
    position: { x: 0, y: 1 }
  },
  to: {
    facing: 'R',
    position: { x: 2, y: 0 }
  },
  type: 'text',
};

export const LeftUpLeft = Template.bind({});
LeftUpLeft.args = {
  from: {
    facing: 'L',
    position: { x: 2, y: 1 }
  },
  to: {
    facing: 'L',
    position: { x: 0, y: 0 }
  },
  type: 'text',
};

export const RightDownLeft = Template.bind({});
RightDownLeft.args = {
  from: {
    facing: 'R',
    position: { x: 0, y: 0 }
  },
  to: {
    facing: 'L',
    position: { x: 0, y: 1 }
  },
  type: 'text',
};

export const LeftDownRight = Template.bind({});
LeftDownRight.args = {
  from: {
    facing: 'L',
    position: { x: 1, y: 0 }
  },
  to: {
    facing: 'R',
    position: { x: 1, y: 1 }
  },
  type: 'text',
};

export const RightUpLeft = Template.bind({});
RightUpLeft.args = {
  from: {
    facing: 'R',
    position: { x: 0, y: 1 }
  },
  to: {
    facing: 'L',
    position: { x: 0, y: 0 }
  },
  type: 'text',
};

export const LeftUpRight = Template.bind({});
LeftUpRight.args = {
  from: {
    facing: 'L',
    position: { x: 1, y: 1 }
  },
  to: {
    facing: 'R',
    position: { x: 1, y: 0 }
  },
  type: 'text',
};