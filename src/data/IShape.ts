
export type Direction = 'U' | 'D' | 'L' | 'R';

export interface IShape {
    width: number;
    height: number;
    connections: Array<Direction | null>; // From bottom left corner, moving clockwise.
}