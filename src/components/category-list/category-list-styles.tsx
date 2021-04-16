import {StyleSheet} from "react-native";

export const categoryListStyles = StyleSheet.create({
    categoryAddView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    categoryContentView: {
        padding: 10
    },
    categoryView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    categoryViewTouchableOpacity: {
        marginStart: 10,
        flex: 80
    }
})
