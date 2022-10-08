export interface Vector2D {
    x: number;
    y: number;
}

export type Direction = 'U' | 'D' | 'L' | 'R';

export function offset(point: Vector2D, direction: Direction, distance: number) {
    const output = {
        x: point.x,
        y: point.y
    };

    switch (direction) {
        case 'U':
            output.y -= distance;
            break;
        case 'D':
            output.y += distance;
            break;
        case 'L':
            output.x -= distance;
            break;
        case 'R':
            output.x += distance;
            break;
    }

    return output;
}

export function getStep(direction: Direction): Vector2D {
    switch (direction) {
        case 'U':
            return { x: 0, y: -1, };
        case 'D':
            return { x: 0, y: 1, };
        case 'L':
            return { x: -1, y: 0, };
        case 'R':
            return { x: 1, y: 0, };
    }
}

export function scale(vector: Vector2D, scale: number): Vector2D {
    return {
        x: vector.x * scale,
        y: vector.y * scale,
    };
}

export function magnitude(vector: Vector2D): number {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

export function add(vector1: Vector2D, vector2: Vector2D): Vector2D {
    return {
        x: vector1.x + vector2.x,
        y: vector1.y + vector2.y,
    };
}

export function subtract(vector1: Vector2D, vector2: Vector2D): Vector2D {
    return {
        x: vector1.x - vector2.x,
        y: vector1.y - vector2.y,
    };
}

export function normalize(vector: Vector2D) {
    const length = magnitude(vector);
    return scale(vector, 1 / length);
}

export function dot(vector1: Vector2D, vector2: Vector2D): number {
    return vector1.x * vector2.x + vector1.y * vector2.y;
}