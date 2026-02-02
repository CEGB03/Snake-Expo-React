import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
export const CELL_SIZE = Math.floor(Math.min(width, height) / 20);
export const BORDER_WIDTH = 12;
export const MOVE_INTERVAL = 150;
export const SCORE_INCREMENT = 10;