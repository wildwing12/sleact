import React, {FC} from "react";
import {Redirect, Route, Switch} from 'react-router-dom';
import loadable from "@loadable/component";

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
    return (
        <Switch>
            <Redirect exact path='/' to="/login"/>{/*다른페이지로 돌려주는 역활*/}
            <Route path="/login" component={LogIn}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/workspace" component={Workspace} />
        </Switch>
    );
}

export default App;