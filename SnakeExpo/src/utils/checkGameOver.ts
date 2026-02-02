import { Position } from "../types/type";

export const checkGameOver = (
    snake: Position[], 
    bounds: { xMin: number; xMax: number; yMin: number; yMax: number }
): boolean => {
    const head = snake[0];

    // Verificar colisión con los límites del juego
    if (head.x < bounds.xMin || head.x > bounds.xMax || head.y < bounds.yMin || head.y > bounds.yMax) {
        return true;
    }

    // Verificar colisión con el cuerpo de la serpiente
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}