import React, {Component} from "react";
import {ScrollView, View} from "react-native";
import Modal from 'react-native-modal';
import {modalProjectStyles} from "./modal-project-styles";


interface IProps {
    visible: boolean
    setVisible: (b: boolean) => void
}

export class ModalProject extends Component<IProps, any> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {visible} = this.props
        const {closeModal} = this
        return (
            <Modal
                style={modalProjectStyles.modal}
                isVisible={visible}
                onBackButtonPress={() => closeModal()}
                onBackdropPress={() => closeModal()}>
                <View style={modalProjectStyles.content}>
                    <ScrollView keyboardShouldPersistTaps={'handled'}>
                        {this.props.children}
                    </ScrollView>
                </View>
            </Modal>
        );
    }

    private closeModal = () => {
        this.props.setVisible(false)
    }
}


