import { TouchableOpacity, StyleSheet, View }  from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from "../styles/colors";

interface HeaderProps {
    reloadGame: () => void;
    pauseGame: () => void;
    children: React.JSX.Element;
    isPaused: boolean;
}
export default function Header({ 
    reloadGame, 
    pauseGame, 
    children, 
    isPaused 
}: HeaderProps ): React.JSX.Element {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={reloadGame}>
                <Ionicons name="reload" size={35} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={pauseGame}>
                <FontAwesome
                    name={isPaused ? "play-circle" : "pause-circle"}
                    size={35}
                    color={Colors.primary}
                />
            </TouchableOpacity>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.05,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Colors.primary,
        borderWidth: 12,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomWidth: 0,
        padding: 15,
        backgroundColor: Colors.background,
        
    },

    header: {
        width: '100%',
        height: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.primary,
    },
});