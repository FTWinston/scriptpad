import { Direction } from './Vector2D';

export interface IShape {
    width: number;
    height: number;
    connections: Array<Direction | null>; // From bottom left corner, moving clockwise.
}