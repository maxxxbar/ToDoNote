import React, {Component, RefObject} from "react";
import {TextInput} from "react-native-paper";
import {TextInput as RNTextInput, View} from 'react-native';
import {textInputColors, textInputProjectStyles} from "./text-input-project-styles";

interface IProps {
    textHandler: (text: string) => void
    placeholder: string
    error: boolean
    value?: string
    textInputRef?: RefObject<RNTextInput>
}

interface IState {
    text: string
}

export class TextInputProject extends Component<IProps, IState> {
    private readonly INITIAL_STATE = {text: ''}

    constructor(props: IProps) {
        super(props);
        this.state = this.INITIAL_STATE
    }

    render() {
        const {setText} = this
        const {text} = this.state
        const {textHandler, value, placeholder} = this.props
        return (
            <View style={textInputProjectStyles.textInputProjectView}>
                <View>
                    <TextInput
                        ref={this.props.textInputRef}
                        style={textInputProjectStyles.textInputProject}
                        value={value ? value : text}
                        underlineColor={textInputColors.underlineColors}
                        underlineColorAndroid={textInputColors.underlineColors}
                        selectionColor={textInputColors.selectionColor}
                        onChangeText={it => {
                            setText(it)
                            textHandler(it)
                        }}
                        placeholder={placeholder}
                    >
                    </TextInput>
                </View>
            </View>
        );
    }

    private setText = (text: string) => {
        this.setState({text: text})
    }
}
