import React, {Component} from "react";
import {
    ListRenderItemInfo,
    SectionListData,
    SectionListRenderItemInfo,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Api} from "../../network/api";
import {Task} from "../../entities/task";
import {Lists} from "../../entities/lists";
import {RowMap, SwipeListView} from "react-native-swipe-list-view";
import {FAB, IconButton, List, RadioButton} from "react-native-paper";
import {pencil, pencilColor, renderSectionFooterTheme, todoStyles, trash} from "./todo-styles";
import {connect} from "react-redux";
import {CategoryList} from "../../components/category-list/CategoryList";
import {Category} from "../../entities/category";
import {ModalProject} from "../../components/modal-project/ModalProject";
import {ListItem} from "../../entities/list-item";
import {addAllLists, addList, deleteList, deleteTask, updateList, updateTask} from "../../redux/actions/lists-actions";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootRouteStack} from "../main/main";
import {Screens} from "../../entities/screens";
import {RouteProp} from '@react-navigation/native';
import {trashColor} from "../../theme/project-theme";

type TodoScreenNavigationProps = StackNavigationProp<RootRouteStack, Screens.TodoScreen>
type TodoScreenRouteProps = RouteProp<RootRouteStack, Screens.TodoScreen>

interface IProps {
    navigation: TodoScreenNavigationProps
    route: TodoScreenRouteProps
    lists: Lists[]
    addAllLists: typeof addAllLists
    deleteList: typeof deleteList
    addList: typeof addList
    updateList: typeof updateList
    deleteTask: typeof deleteTask
    updateTask: typeof updateTask
}

interface IState {
    listItem: ListItem[]
    modalVisible: boolean
    categories: Category[]
    mainRowMap: { rowMap: RowMap<Task>, rowKey: number }
    nestedRowMap: { rowMap: RowMap<Task>, rowKey: number }
}

class TodoListScreen extends Component<IProps, IState> {
    private readonly api: Api
    private readonly INITIAL_STATE: IState = {
        listItem: [], modalVisible: false, categories: [],
        mainRowMap: {rowMap: {}, rowKey: -1},
        nestedRowMap: {rowMap: {}, rowKey: -1}
    }

    constructor(props: IProps) {
        super(props);
        this.state = this.INITIAL_STATE
        this.api = new Api()
        this.closeRow = this.closeRow.bind(this)
    }

    componentDidMount() {
        this.appBarConfiguration()
        this.initialGetData()
    }

    render() {
        const {setModalVisible, api, closeRow, setNestedRowMap, setMainRowMap} = this
        const {modalVisible, mainRowMap, nestedRowMap} = this.state
        const {deleteTask, updateTask, navigation, updateList} = this.props
        const todos = this.props.lists?.map(value => {
            return ({title: value.title, data: [...value.todos]})
        })
        const categories: Category[] = this.props.lists?.map(value => {
            return ({id: value.id, title: value.title})
        })
        return (
            <View style={todoStyles.mainContent}>
                {(todos.length > 0) ? (<SwipeListView
                        useSectionList
                        keyExtractor={item => item.id.toString()}
                        sections={todos}
                        renderSectionHeader={renderSectionHeader}
                        renderSectionFooter={({section}: { section: SectionListData<Task> }) =>
                            renderSectionFooter(section,
                                {
                                    api: api,
                                    closeRow: closeRow,
                                    delTask: deleteTask,
                                    mainRowMap: mainRowMap,
                                    setNestedRowMap: setNestedRowMap,
                                    updTask: updateTask
                                }
                            )}
                        renderItem={(data) =>
                            renderItem(data, api, updateTask)
                        }
                        renderHiddenItem={(rowData, rowMap) =>
                            renderHiddenItem(rowData,
                                rowMap,
                                navigation,
                                closeRow,
                                api,
                                deleteTask)
                        }
                        leftOpenValue={50}
                        rightOpenValue={-50}
                        previewRowKey={'0'}
                        previewOpenValue={-40}
                        previewOpenDelay={3000}
                        onRowDidOpen={(rowKey, rowMap) => {
                            this.closeRow(nestedRowMap.rowMap, nestedRowMap.rowKey)
                            setMainRowMap(rowMap, parseInt(rowKey))
                        }}
                    />) :
                    <View style={todoStyles.placeholderView}>
                        <Text>Тут ничего нет, приходите когда тут что то появится.</Text>
                    </View>
                }
                <FAB
                    icon='plus'
                    style={todoStyles.fab}
                    onPress={() => {
                        navigation.navigate(Screens.TaskScreen)
                    }}
                />
                <ModalProject
                    visible={modalVisible}
                    setVisible={setModalVisible}>
                    <CategoryList
                        type={'delete'}
                        onUpdate={(category) => {
                            api.updateList(category, updateList)
                        }}
                        toDelete={(id) => {
                            api.deleteCategory(id, this.props.deleteList)
                        }}
                        addedSuccessfully={(it) => {
                            api.createList(it, this.props.addList)
                        }}
                        setVisible={setModalVisible}
                        categories={categories}/>
                </ModalProject>
            </View>
        )
    }

    private setMainRowMap = (rowMap: RowMap<Task>, rowKey: number) => {
        this.setState({mainRowMap: {rowMap, rowKey}})
    }

    private setNestedRowMap = (rowMap: RowMap<Task>, rowKey: number) => {
        this.setState({nestedRowMap: {rowMap, rowKey}})
    }

    private setItemList = (itemList: ListItem[]) => {
        this.setState({listItem: itemList})
    }

    private setModalVisible = (b: boolean) => {
        this.setState({modalVisible: b})
    }

    private headerRightIcon = (<IconButton
        icon={'format-list-bulleted-triangle'}
        onPress={() => {
            this.setModalVisible(true)
        }}
    />)

    private setCategories = (categories: Category[]) => {
        this.setState({categories: categories})
    }

    private appBarConfiguration = () => {
        this.props.navigation.setOptions({
            headerRight: () => this.headerRightIcon
        })
    }

    private initialGetData = () => {
        this.api.getAllLists()
            .then(it => {
                this.props.addAllLists(it.data)
                const itemList: ListItem[] = []
                const categories: Category[] = []
                it.data.map((value: Lists) => {
                    itemList.push({title: value.title, data: [...value.todos]})
                    categories.push({id: value.id, title: value.title})
                })
                this.setItemList(itemList)
                this.setCategories(categories)
            })
            .catch(reason => {
                console.warn(reason)
            })
    }

    private closeRow = (rowMap: RowMap<Task>, rowKey: number) => {
        if (rowMap[rowKey] && rowMap[rowKey] !== null) {
            rowMap[rowKey]?.closeRow()
        }
    }

}


const mapToStateProps = (store: { lists: { lists: Lists[] } }) => ({
    lists: store.lists.lists
})

export default connect(mapToStateProps,
    {addAllLists, deleteList, addList, updateList, deleteTask, updateTask})(TodoListScreen)


const renderSectionHeader = ({section}: any) => (
    <Text style={todoStyles.renderSectionHeader}>{section.title}</Text>)


const renderSectionFooter = (section: SectionListData<Task>, nested: NestedListProps) => {
    return (
        <View>
            <List.Accordion
                style={{paddingHorizontal: 40}}
                title='Завершенные'
                theme={renderSectionFooterTheme}>
                {nestedList(
                    section.data
                        .filter((value) => value.checked), nested)
                }
            </List.Accordion>
        </View>
    )
}


interface NestedListProps {
    api: Api,
    updTask: typeof updateTask,
    delTask: typeof deleteTask,
    closeRow: (rowMap: RowMap<Task>, rowKey: number) => void,
    mainRowMap: { rowMap: RowMap<Task>, rowKey: number },
    setNestedRowMap: (rowMap: RowMap<Task>, rowKey: number) => void
}

const nestedList = (
    tasks: Task[],
    props: NestedListProps
) => {
    return (
        <SwipeListView
            data={tasks}
            keyExtractor={item => item.id.toString()}
            renderItem={(data) => (
                <View key={data.item.id.toString()} style={todoStyles.renderItemView}>
                    <RadioButton
                        onPress={() => {
                            props.api.updateTask({...data.item, checked: false}, props.updTask)
                        }}
                        value={data.item.text} status='checked'/>
                    <Text style={{textDecorationLine: 'line-through', color: 'gray'}}>{data.item.text}</Text>
                </View>

            )}
            renderHiddenItem={(rowData, rowMap) => (
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignContent: 'center',
                    alignItems: 'center'
                }}>
                    <IconButton
                        onPress={() => {
                            props.api.deleteTask(rowData.item, props.delTask)
                            props.closeRow(rowMap, rowData.item.id)
                        }}
                        color={trashColor}
                        icon={trash}/>
                </View>

            )}
            leftOpenValue={50}
            rightOpenValue={-50}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            disableRightSwipe={true}
            onRowDidOpen={(rowKey, rowMap) => {
                props.closeRow(props.mainRowMap.rowMap, props.mainRowMap.rowKey)
                props.setNestedRowMap(rowMap, parseInt(rowKey))
            }}
        />
    )
}

const renderHiddenItem = (
    rowData: ListRenderItemInfo<Task>,
    rowMap: RowMap<Task>,
    navigation: TodoScreenNavigationProps,
    closeRow: (rowMap: RowMap<Task>, rowKey: number) => void,
    api: Api,
    delTask: typeof deleteTask) =>
    (
        !rowData.item.checked ? (<View style={todoStyles.renderHiddenItemView}>
            <View>
                <IconButton
                    onPress={() => {
                        navigation.navigate(Screens.TaskScreen, rowData.item)
                        closeRow(rowMap, rowData.item.id)
                    }}
                    color={pencilColor}
                    icon={pencil}/>
            </View>
            <View>
                <IconButton
                    onPress={() => {
                        api.deleteTask(rowData.item, delTask)
                        closeRow(rowMap, rowData.item.id)
                    }}
                    color={trashColor}
                    icon={trash}/>
            </View>
        </View>) : null
    )

const renderItem = (
    data: SectionListRenderItemInfo<Task> | ListRenderItemInfo<Task>,
    api: Api,
    updTask: typeof updateTask
) =>
    (
        <TouchableOpacity
            activeOpacity={0.8}
            style={todoStyles.touchableOpacity}>
            {!data.item.checked &&
            (<View style={todoStyles.renderItemView}>
                    <View>
                        <RadioButton
                            onPress={() => {
                                api.updateTask({...data.item, checked: true}, updTask)
                            }}
                            value={data.item.text}/></View>
                    <View style={todoStyles.renderItemTextView}>
                        <Text>{data.item.text}</Text></View>
                </View>
            )}
        </TouchableOpacity>
    )
