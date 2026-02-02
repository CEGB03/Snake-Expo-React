import { Position } from "../types/type";

export const checkEatFood = (
    snakeHead:Position,
    foodPosition: Position,
    area: number
): boolean => {
    const distanceX = Math.abs(snakeHead.x - foodPosition.x);
    const distanceY = Math.abs(snakeHead.y - foodPosition.y);
    return distanceX < area && distanceY < area;
};