import React, {Component} from "react";
import TodoScreen from "../todo/todo-list-screen";
import {Provider as PaperProvider} from "react-native-paper";
import {createStackNavigator} from "@react-navigation/stack";
import {mainTheme} from "./main-styles";
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {Screens} from "../../entities/screens";
import TaskScreen from "../task-screen/task-screen";
import {Task} from "../../entities/task";

export type RootRouteStack = {
    TodoScreen: undefined
    TaskScreen: undefined | Task
}
export const RootStack = createStackNavigator<RootRouteStack>()

export class Main extends Component<any, any> {

    render() {
        return (
            <NavigationContainer theme={{...DefaultTheme, colors: {...DefaultTheme.colors, background: 'white'}}}>
                <PaperProvider theme={mainTheme}>
                    <RootStack.Navigator>
                        <RootStack.Screen
                            name={Screens.TodoScreen}
                            component={TodoScreen}
                            options={{
                                title: 'Задачи',
                            }}
                        />
                        <RootStack.Screen
                            name={Screens.TaskScreen}
                            component={TaskScreen}
                            options={{
                                title: ''
                            }}
                        />
                    </RootStack.Navigator>
                </PaperProvider>
            </NavigationContainer>
        );
    }
}



