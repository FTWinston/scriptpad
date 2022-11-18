import { Vector2D } from '../data/Vector2D';
import { gridSize } from '../display/Constants';

export function moveWithArrowKeys(moveTo: (x: number, y: number) => void, position: Vector2D) {
    return (e: React.KeyboardEvent) => {
        let offset: Vector2D;

        switch (e.key) {
            case 'ArrowUp':
                if (position.y <= gridSize) {
                    return;
                }

                offset = { x: 0, y: -gridSize }; break;
            case 'ArrowDown':
                offset = { x: 0, y: gridSize }; break;
            case 'ArrowLeft':
                if (position.x <= 0) {
                    return;
                }

                offset = { x: -gridSize, y: 0 }; break;
            case 'ArrowRight':
                offset = { x: gridSize, y: 0 }; break;
            default:
                return;
        }

        e.preventDefault();

        if (e.repeat) {
            return;
        }

        moveTo(position.x + offset.x, position.y + offset.y);
    }
}
