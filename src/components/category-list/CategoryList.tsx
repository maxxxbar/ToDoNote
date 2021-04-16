import React, {Component, RefObject} from "react";
import {Text, TextInput as RNTextInput, TouchableOpacity, View} from "react-native";
import {IconButton, RadioButton} from "react-native-paper";
import {Category} from "../../entities/category";
import {SnackbarProject} from "../snackbar-project/SnackbarProject";
import {TextInputProject} from "../text-input-project/TextInputProject";
import {Task} from "../../entities/task";
import {categoryListStyles} from "./category-list-styles";
import {trashColor} from "../../theme/project-theme";

interface IProps {
    type: 'add' | 'delete'
    categories: Category[]
    setVisible?: (b: boolean) => void
    addedSuccessfully?: (title: string) => void
    onUpdate?: (category: Category) => void
    toDelete?: (id: number) => void
    currentCategory?: (listId: number) => void
    task?: Task
}

interface IState {
    text: string
    snackBarVisible: boolean
    errorText: string
    isEmpty: boolean
    category: Category | undefined
    checked?: number | undefined
}

export class CategoryList extends Component<IProps, IState> {
    private readonly textInput: RefObject<RNTextInput> = React.createRef<RNTextInput>()
    private readonly INITIAL_STATE = {
        text: '',
        snackBarVisible: false,
        errorText: '',
        isEmpty: false,
        category: undefined
    }

    constructor(props: IProps) {
        super(props);
        this.state = this.INITIAL_STATE
    }

    componentDidMount() {
        if (this.props.task) {
            this.setChecked(this.props.task.list_id)
        }
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (prevProps.task !== this.props.task && this.props.task) {
            this.setChecked(this.props.task.list_id)
        }
    }

    render() {
        const {
            setChecked,
            setSnackBarVisible,
            updateCategory,
            showSnackbar,
            textInput,
            setText,
            setEmpty,
            setCurrentCategory
        } = this
        const {text, checked, errorText, snackBarVisible, isEmpty, category} = this.state
        const {type, setVisible, toDelete, onUpdate, currentCategory, addedSuccessfully} = this.props

        return (
            <>
                <SnackbarProject
                    text={errorText}
                    isVisible={snackBarVisible}
                    onDismiss={b => setSnackBarVisible(b)}/>
                <View style={categoryListStyles.categoryContentView}>
                    {this.props.categories.map(value => (
                        <View key={value.id.toString()}
                              style={categoryListStyles.categoryView}>
                            <TouchableOpacity
                                style={categoryListStyles.categoryViewTouchableOpacity}
                                onLongPress={() => {
                                    updateCategory?.(value)
                                }}>
                                <Text>{value.title}</Text>
                            </TouchableOpacity>
                            {
                                type === 'delete' ?
                                    deleteButton(
                                        value,
                                        showSnackbar,
                                        toDelete) :
                                    selectButton(
                                        value.id,
                                        checked,
                                        setChecked,
                                        currentCategory)
                            }
                        </View>
                    ))}
                    {
                        type === 'delete'
                        && addCategory(
                            textInput,
                            setText,
                            isEmpty,
                            text,
                            showSnackbar,
                            setEmpty,
                            setText,
                            setCurrentCategory,
                            setVisible,
                            addedSuccessfully,
                            onUpdate,
                            category
                        )
                    }
                </View>
            </>
        )
    }

    private setChecked = (value: number) => {
        this.setState({checked: value})
    }

    private setCurrentCategory = (category: Category | undefined) => {
        this.setState({category: category})
    }

    private setEmpty = (b: boolean) => {
        this.setState({isEmpty: b})
    }

    private setErrorText = (errorText: string) => {
        this.setState({errorText: errorText})
    }

    private setSnackBarVisible = (b: boolean) => {
        this.setState({snackBarVisible: b})
    }

    private setText = (text: string) => {
        this.setState({text: text})
    }

    private showSnackbar = (text: string = 'Успешнно') => {
        this.setSnackBarVisible(true)
        this.setErrorText(text)
    }

    private updateCategory = (category: Category) => {
        this.setCurrentCategory(category)
        this.setText(category.title)
    }
}

const selectButton = (
    listId: number,
    checked: number | undefined,
    setChecked: (listId: number) => void,
    currentCategory?: (listId: number) => void
) => {
    return (
        <RadioButton
            value={listId.toString()}
            status={checked === listId ? 'checked' : 'unchecked'}
            onPress={() => {
                setChecked(listId)
                currentCategory?.(listId)
            }}
        />
    )
}


const deleteButton = (
    category: Category,
    showSnackbar: (text?: string) => void,
    toDelete?: (id: number) => void,
) => (
    <IconButton
        onPress={() => {
            toDelete?.(category.id)
            showSnackbar()
        }}
        color={trashColor}
        icon="trash-can-outline"/>
)

const addCategory = (
    textInput: RefObject<RNTextInput>,
    textHandler: (text: string) => void,
    isEmpty: boolean,
    text: string,
    showSnackbar: (text?: string) => void,
    setEmpty: (b: boolean) => void,
    setText: (text: string) => void,
    setCurrentCategory: (category: Category | undefined) => void,
    setVisible?: (b: boolean) => void,
    addedSuccessfully?: (title: string) => void,
    onUpdate?: (category: Category) => void,
    category?: Category,
) => {
    return (<View style={categoryListStyles.categoryAddView}>
        <View style={{flex: 1}}>
            <TextInputProject
                placeholder={'Новая категория'}
                textInputRef={textInput}
                textHandler={t => textHandler(t)}
                error={isEmpty}
                value={text}
            />
        </View>
        <View>
            <IconButton
                icon={category ? 'check' : 'plus'}
                onPress={() => {
                    const t = text.trim()
                    if (!t) {
                        showSnackbar('Заполните все поля')
                        setEmpty(true)
                    } else {
                        if (category) {
                            onUpdate?.({
                                title: text,
                                id: category.id
                            })
                            setCurrentCategory(undefined)
                            setText('')
                            textInput.current?.clear()
                        } else {
                            setEmpty(false)
                            addedSuccessfully?.(t)
                            showSnackbar()
                            textInput.current?.clear()
                            setText('')
                        }
                    }
                }}
            />
        </View>
    </View>)
}
