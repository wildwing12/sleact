import React, {FC} from "react";
import {Redirect, Route, Switch} from 'react-router-dom';
import LogIn from '@pages/LogIn';
import SignUp from '@pages/SignUp';

const App = () => {
    return (
        <Switch>
            <Redirect exact path='/' to="/login" />{/*다른페이지로 돌려주는 역활*/}
            <Route path="/login" component={LogIn}/>
            <Route path="/signup" component={SignUp}/>
        </Switch>
    );
}

export default App;