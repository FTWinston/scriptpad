import { PropsWithChildren } from 'react';

export interface Props {
    x: number;
    y: number;
    width: number;
    height: number;
}

const style = {
    overflow: 'visible',
}

export const HtmlInSvg: React.FC<PropsWithChildren<Props>> = ({ x, y, width, height, children }) => (
    <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        style={style}
    >
        {children}
    </foreignObject>
);