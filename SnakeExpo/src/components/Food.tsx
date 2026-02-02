import { StyleSheet, Text } from "react-native";
import { useMemo } from "react";
import { Position } from "../types/type";
import { CELL_SIZE } from "../constants/gameConstants";

function getRandomFoodPosition(bounds: {xMin: number, xMax: number, yMin: number, yMax: number}): Position {
    const x = Math.floor(Math.random() * (bounds.xMax - bounds.xMin + 1)) + bounds.xMin;
    const y = Math.floor(Math.random() * (bounds.yMax - bounds.yMin + 1)) + bounds.yMin;
    return { x, y };
}

function getRandomEmoji(): string {
    const fruitEmojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🥝', '🍍'];
    const randomIndex = Math.floor(Math.random() * fruitEmojis.length);
    return fruitEmojis[randomIndex];
}

export default function Food({position}: {position: Position}): React.JSX.Element {
    const emoji = useMemo(() => getRandomEmoji(), [position]);
    
    return <Text style={[styles.food, {left: position.x * CELL_SIZE, top: position.y * CELL_SIZE}]}>{emoji}</Text>;
}

export { getRandomFoodPosition };

const styles = StyleSheet.create({
    food: {
        position: 'absolute',
        width: CELL_SIZE,
        height: CELL_SIZE,
        fontSize: CELL_SIZE,
        lineHeight: CELL_SIZE,
        borderRadius: CELL_SIZE / 2,
    },
});