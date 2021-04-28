import React from 'react';
import {Provider} from "react-redux";
import {store} from "./redux/store";
import {Main} from "./screens/main/main";
import {Provider as PaperProvider} from "react-native-paper";
import {mainTheme} from "./screens/main/main-styles";

export default function App() {
    return (
        <Provider store={store}>
            <PaperProvider theme={mainTheme}>
                <Main/>
            </PaperProvider>
        </Provider>
    );
}
