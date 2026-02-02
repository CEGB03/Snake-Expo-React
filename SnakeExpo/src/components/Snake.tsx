import { Fragment } from "react";
import { Position } from "../types/type";
import { View, StyleSheet } from "react-native";
import { Colors } from '../styles/colors';
import { CELL_SIZE } from '../constants/gameConstants';

interface SnakeProps {
    snake: Position[];
}

export default function Snake({snake}: SnakeProps): React.JSX.Element {
    return (
        <Fragment>
            {snake.map((segment: any, index: number) => {
                const segmentStyle = {
                    left: segment.x * CELL_SIZE,
                    top: segment.y * CELL_SIZE,
                };
                return <View key={index} style={[styles.snakeSegment, segmentStyle]} />;
            })}
        </Fragment>
    );
}

const styles = StyleSheet.create({
    snakeSegment: {
        position: 'absolute',
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderRadius: CELL_SIZE / 2,
        backgroundColor: Colors.primary,
    }
});
