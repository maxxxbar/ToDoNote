import React, {Component, ReactNode} from "react";
import {Snackbar} from "react-native-paper";
import {Text} from "react-native";

interface IProps {
    children?: ReactNode
    text: string
    isVisible: boolean
    onDismiss: (b: boolean) => void
    duration?: number
}

export class SnackbarProject extends Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {duration, isVisible, onDismiss, children, text} = this.props
        return (
            <Snackbar
                duration={duration ? duration : 1000}
                visible={isVisible}
                onDismiss={() => {
                    onDismiss(false)
                }}>
                {children ? children : <Text>{text}</Text>}
            </Snackbar>
        );
    }
}
