import {StyleSheet} from "react-native";
import {Colors, DefaultTheme} from "react-native-paper";

const paddingHorizontal = 40
export const pencilColor = Colors.grey700
export const pencil = 'pencil'
export const trash = 'trash-can-outline'
export const shadowColor = '#0099ff'

export const renderSectionFooterTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000000',
    },
};
export const todoStyles = StyleSheet.create({
    mainContent: {
        flex: 1
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    renderItemView: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        minHeight: 50,
        alignItems: 'center',
        paddingHorizontal: paddingHorizontal,
    },
    renderItemTextView: {
        flex: 80
    },
    renderSectionHeader: {
        fontSize: 18,
        paddingHorizontal: 40,
        marginVertical: 20
    },
    renderSectionFooterView: {
        marginHorizontal: 30,
        marginVertical: 20,
        flex: 1
    },
    renderHiddenItemView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between'
    },
    touchableOpacity: {
        flex: 1,
        backgroundColor: shadowColor,
    },
    placeholderView: {
        paddingHorizontal: paddingHorizontal,
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    }
})
