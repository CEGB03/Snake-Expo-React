import * as React from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { SafeAreaView, View, StyleSheet, Dimensions, Text } from 'react-native';
import { Colors } from '../styles/colors';
import Header from './Header';
import { Direction, GestureEventType, Position } from '../types/type';
import Snake from './Snake';
import { checkGameOver } from '../utils/checkGameOver';
import { CELL_SIZE, BORDER_WIDTH, MOVE_INTERVAL, SCORE_INCREMENT } from '../constants/gameConstants';
import Food from './Food';
import { getRandomFoodPosition } from './Food';
import { checkEatFood } from '../utils/checkEatFood';
import { useWindowDimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];

// Función para validar si el movimiento es permitido
function isValidMove(currentDirection: Direction, newDirection: Direction): boolean {
    const oppositeDirections: { [key in Direction]: Direction } = {
        [Direction.UP]: Direction.DOWN,
        [Direction.DOWN]: Direction.UP,
        [Direction.LEFT]: Direction.RIGHT,
        [Direction.RIGHT]: Direction.LEFT,
    };
    
    return oppositeDirections[currentDirection] !== newDirection;
}

// Calcular el área jugable disponible (sin reservar espacio para header)
const usableWidth = width - (BORDER_WIDTH * 2);
const usableHeight = height - (BORDER_WIDTH * 2);

const GAME_BOUNDS = { 
    xMin: 0, 
    xMax: Math.floor(usableWidth / CELL_SIZE) - 1, 
    yMin: 0, 
    yMax: Math.floor(usableHeight / CELL_SIZE) - 1 
};

// Función para generar comida evitando la trayectoria inicial
function getInitialFoodPosition(): Position {
    let foodPosition: Position;
    const forbiddenPositions = [
        { x: 5, y: 5 },   // Posición inicial de la cabeza
        { x: 6, y: 5 },   // Primer movimiento a la derecha
        { x: 7, y: 5 },   // Segundo movimiento a la derecha
        { x: 8, y: 5 },   // Tercer movimiento a la derecha
    ];
    
    do {
        foodPosition = getRandomFoodPosition(GAME_BOUNDS);
    } while (forbiddenPositions.some(pos => pos.x === foodPosition.x && pos.y === foodPosition.y));
    
    return foodPosition;
}

const GameGrid = () => {
    const { width, height } = Dimensions.get('window');
    const usableWidth = width - (BORDER_WIDTH * 2);
    const usableHeight = height - (BORDER_WIDTH * 2);
    const gridCells = [];

    const cols = Math.floor(usableWidth / CELL_SIZE);
    const rows = Math.floor(usableHeight / CELL_SIZE);

    // Crear celdas con patrón de ajedrez
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const isEven = (row + col) % 2 === 0;
            gridCells.push(
                <View
                    key={`cell-${row}-${col}`}
                    style={{
                        position: 'absolute',
                        left: col * CELL_SIZE,
                        top: row * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: isEven ? Colors.secondary : Colors.tertiary,
                    }}
                />
            );
        }
    }

    return <>{gridCells}</>;
};

export default function Game(): React.JSX.Element {
    const [direction, setDirection] = React.useState<Direction>(Direction.RIGHT);
    const [snake, setSnake] = React.useState<Position[]>(SNAKE_INITIAL_POSITION);
    const [food, setFood] = React.useState<Position>(getInitialFoodPosition());
    const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
    const [isPaused, setIsPaused] = React.useState<boolean>(false);
    const [score, setScore] = React.useState<number>(0);

    const nextDirectionRef = React.useRef<Direction | null>(null);
    const directionRef = React.useRef<Direction>(direction);

    React.useEffect(() => {
        directionRef.current = direction;
    }, [direction]);

    const canQueueDirection = React.useCallback((newDirection: Direction) => {
        const current = nextDirectionRef.current ?? directionRef.current;
        return isValidMove(current, newDirection);
    }, []);

    const moveSnake = React.useCallback(() => {
        setSnake(prevSnake => {
            const head = prevSnake[0];

            const effectiveDirection = nextDirectionRef.current ?? directionRef.current;
            if (nextDirectionRef.current) {
                const next = nextDirectionRef.current;
                nextDirectionRef.current = null;
                setDirection(next);
                directionRef.current = next;
            }

            let newHead = { ...head };
            switch (effectiveDirection) {
                case Direction.UP:
                    newHead.y -= 1;
                    break;
                case Direction.DOWN:
                    newHead.y += 1;
                    break;
                case Direction.LEFT:
                    newHead.x -= 1;
                    break;
                case Direction.RIGHT:
                    newHead.x += 1;
                    break;
            }

            if (checkGameOver([newHead, ...prevSnake.slice(0, -1)], GAME_BOUNDS)) {
                setIsGameOver(true);
                return prevSnake;
            }

            if (checkEatFood(newHead, food, 1)) {
                setFood(getRandomFoodPosition(GAME_BOUNDS));
                setScore(prevScore => prevScore + SCORE_INCREMENT);
                return [newHead, ...prevSnake];
            }

            return [newHead, ...prevSnake.slice(0, -1)];
        });
    }, [food]);

    React.useEffect(() => {
        if (!isGameOver){
            const intervalID = setInterval(() => {
                !isPaused && moveSnake();
            }, MOVE_INTERVAL);
            return () => clearInterval(intervalID);
        }
    }, [isGameOver, moveSnake, isPaused]);

    const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
        let newDirection: Direction | null = null;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                newDirection = Direction.UP;
                break;
            case 'ArrowDown':
                e.preventDefault();
                newDirection = Direction.DOWN;
                break;
            case 'ArrowLeft':
                e.preventDefault();
                newDirection = Direction.LEFT;
                break;
            case 'ArrowRight':
                e.preventDefault();
                newDirection = Direction.RIGHT;
                break;
        }

        if (newDirection && canQueueDirection(newDirection) && !nextDirectionRef.current) {
            nextDirectionRef.current = newDirection;
        }
    }, [canQueueDirection]);

    // Solo en web: listener de teclado
    React.useEffect(() => {
        // Verificar si estamos en web
        const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';
        
        if (!isWeb) return;
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleGestureEnd = (event: GestureEventType & { nativeEvent: { translationX: number; translationY: number; state: State } }) => {
        const { translationX, translationY, state } = event.nativeEvent;

        if (state !== State.END) return;

        let newDirection: Direction | null = null;

        if (Math.abs(translationX) > Math.abs(translationY)) {
            newDirection = translationX > 0 ? Direction.RIGHT : Direction.LEFT;
        } else {
            newDirection = translationY > 0 ? Direction.DOWN : Direction.UP;
        }

        if (newDirection && canQueueDirection(newDirection) && !nextDirectionRef.current) {
            nextDirectionRef.current = newDirection;
        }
    };

    const pauseGame = () => {
        setIsPaused(!isPaused);
    };

    const reloadGame = () => {
        setSnake(SNAKE_INITIAL_POSITION);
        setFood(getInitialFoodPosition());
        setIsGameOver(false);
        setDirection(Direction.RIGHT);
        setScore(0);
        setIsPaused(false);
    };

    return (
        <PanGestureHandler onHandlerStateChange={handleGestureEnd}>
            <SafeAreaView style={styles.container}>
                <Header 
                    reloadGame={reloadGame} 
                    pauseGame={pauseGame} 
                    isPaused={isPaused} 
                >
                    <Text style={{ color: Colors.text, fontSize: 20 }}>Score: {score}</Text>
                </Header>
                <View style={styles.boundaries}>
                    <GameGrid />
                    <Snake snake={snake} />
                    <Food position={food} />
                </View>
            </SafeAreaView>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    boundaries: {
        flex: 1,
        borderWidth: BORDER_WIDTH,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderColor: Colors.primary,
        backgroundColor: Colors.background,
        overflow: 'hidden',
    }
});