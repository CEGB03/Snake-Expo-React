export enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

export interface GestureEventType {
    nativeEvent: {
        translationX: number;
        translationY: number;
    };
}

export interface Position {
    x: number;
    y: number;
}