import { IShape } from '../data/IShape';

const twoConnections: IShape[] = [
    {
        width: 1,
        height: 1,
        connections: [null, 'U', null, 'D'],
    },
    {
        width: 1,
        height: 1,
        connections: ['L', null, 'R', null],
    },
    {
        width: 1,
        height: 1,
        connections: ['L', 'U', null, null],
    },
    {
        width: 1,
        height: 1,
        connections: [null, 'U', 'R', null],
    },
    {
        width: 1,
        height: 1,
        connections: [null, null, 'R', 'D'],
    },
    {
        width: 1,
        height: 1,
        connections: ['L', null, null, 'D'],
    }
];

const threeConnections: IShape[] = [
    {
        width: 1,
        height: 1,
        connections: [null, 'U', 'R', 'D'],
    },
    {
        width: 1,
        height: 1,
        connections: ['L', null, 'R', 'D'],
    },
    {
        width: 1,
        height: 1,
        connections: ['L', 'U', null, 'D'],
    },
    {
        width: 1,
        height: 1,
        connections: ['L', 'U', 'R', null],
    },
    {
        width: 2,
        height: 1,
        connections: [null, 'U', 'U', null, 'D', null],
    },
    {
        width: 1,
        height: 2,
        connections: ['L', 'L', null, 'R', null, null],
    }
];

export const possibleShapesByConnections = new Map([
    [2, twoConnections],
    [3, threeConnections],
]);