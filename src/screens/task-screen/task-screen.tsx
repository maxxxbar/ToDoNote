import React, {Component} from "react";
import {ScrollView, Text, View} from "react-native";
import {TextInputProject} from "../../components/text-input-project/TextInputProject";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootRouteStack} from "../main/main";
import {Screens} from "../../entities/screens";
import {RouteProp} from "@react-navigation/native";
import {IconButton} from "react-native-paper";
import {CategoryList} from "../../components/category-list/CategoryList";
import {Lists} from "../../entities/lists";
import {connect} from "react-redux";
import {Category} from "../../entities/category";
import {addTask, deleteTask, updateTask} from "../../redux/actions/lists-actions";
import {Api} from "../../network/api";
import {Task} from "../../entities/task";
import {headerIcon, headerIconColor, taskScreenStyles} from "./task-screen-styles";
import {SnackbarProject} from "../../components/snackbar-project/SnackbarProject";

type TodoScreenNavigationProps = StackNavigationProp<RootRouteStack, Screens.TaskScreen>
type TodoScreenRouteProps = RouteProp<RootRouteStack, Screens.TaskScreen>

interface IProps {
    navigation: TodoScreenNavigationProps
    route: TodoScreenRouteProps
    lists: Lists[]
    addTask: typeof addTask
    updateTask: typeof updateTask
    deleteTask: typeof deleteTask
}

interface IState {
    text: string
    currentCategory: number
    currentTask: Task | undefined
    thisUpdate: boolean
    errorText: string
    showSnackbar: boolean
}

class TaskScreen extends Component<IProps, IState> {
    private api: Api
    private readonly INITIAL_STATE: IState = {
        text: '',
        currentCategory: -1,
        currentTask: undefined,
        thisUpdate: false,
        errorText: '',
        showSnackbar: false
    }

    constructor(props: IProps) {
        super(props);
        this.api = new Api()
        this.state = this.INITIAL_STATE
    }

    componentDidMount() {
        this.appBarConfiguration()
        this.updateHandler()
    }

    render() {
        const {setCurrentCategory, setText, setShowSnackbar} = this
        const {text, currentTask, errorText, showSnackbar} = this.state
        const categories: Category[] = this.props.lists?.map(value => {
            return ({id: value.id, title: value.title})
        })

        return (
            <View style={taskScreenStyles.mainView}>
                <SnackbarProject
                    text={errorText}
                    isVisible={showSnackbar}
                    onDismiss={b => setShowSnackbar(b)}/>
                <ScrollView>
                    <TextInputProject
                        value={text}
                        placeholder={'Название задачи'}
                        textHandler={text => {
                            setText(text)
                        }}
                        error={false}/>
                    <Text style={taskScreenStyles.headerText}>
                        Категория
                    </Text>
                    <CategoryList
                        type={'add'}
                        categories={categories}
                        task={currentTask}
                        currentCategory={listId => {
                            setCurrentCategory(listId)
                        }}
                    />
                </ScrollView>
            </View>
        );
    }

    private setUpdate = (b: boolean) => {
        this.setState({thisUpdate: b})
    }

    private setCurrentCategory = (id: number) => {
        this.setState({currentCategory: id})
    }

    private setText = (text: string) => {
        this.setState({text: text})
    }

    private setCurrentTask = (task: Task) => {
        this.setState({currentTask: task})
    }

    private setErrorText = (errorText: string) => {
        this.setState({errorText: errorText})
    }

    private setShowSnackbar = (b: boolean) => {
        this.setState({showSnackbar: b})
    }

    private appBarConfiguration = () => {
        this.props.navigation.setOptions({
            headerRight: () => <IconButton
                icon={headerIcon}
                color={headerIconColor}
                onPress={() => {
                    this.editTask()
                }}
            />
        })
    }

    private updateHandler = () => {
        if (this.props.route.params) {
            this.setCurrentTask(this.props.route.params)
            this.setUpdate(true)
            this.setText(this.props.route.params.text)
            this.setCurrentCategory(this.props.route.params.list_id)
        }
    }

    private editTask = () => {
        const t = this.state.text.trim()
        if (t && this.state.currentCategory > 0) {
            if (this.state.thisUpdate && this.state.currentTask) {
                this.api.deleteTask(this.state.currentTask, this.props.deleteTask)
            }
            this.api.addTask(t, this.state.currentCategory, this.props.addTask)
            this.setErrorText('Успешно')
            this.props.navigation.goBack()
        } else {
            if (!t) {
                this.setErrorText('Введите текст')
            } else if (this.state.currentCategory < 0) {
                this.setErrorText('Выберите категорию')
            }
        }
        this.setShowSnackbar(true)
    }
}

const mapToStateProps = (store: { lists: { lists: Lists[] } }) => ({
    lists: store.lists.lists
})

export default connect(mapToStateProps, {addTask, updateTask, deleteTask})(TaskScreen)
