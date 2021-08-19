import React, {FC, useCallback, useState} from 'react';
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import axios from "axios";
import {Redirect, Route, Switch} from "react-router-dom";
import {
    Channels,
    Chats,
    Header, LogOutButton,
    MenuScroll,
    ProfileImg, ProfileModal,
    RightMenu,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper,
} from "@layouts/Workspace/styles";
import gravatar from 'gravatar';
import loadable from "@loadable/component";
import Menu from "@components/Menu";

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import("@pages/DirectMessage"));

const Workspace: FC = ({children}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const {data, error, revalidate, mutate} = useSWR('http://localhost:3095/api/users', fetcher, {
        dedupingInterval: 2000
    });
    const onLogout = useCallback(() => {
        axios
            .post('http://localhost:3095/api/users/logout', null, {
                withCredentials: true
            }).then(() => {
            mutate(false, false);
        })
    }, []);


    const onClickUserProfile = useCallback(() => {
        setShowUserMenu(prevState => !prevState);
    }, []);

    if (!data) {
        return <Redirect to="/login"/>
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(data.nickname, {s: '28px', d: 'retro'})} alt={data.nickname}/>
                        {showUserMenu &&
                        <Menu style={{right: 0, top: 38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                            <ProfileModal>
                                <img src={gravatar.url(data.nickname, {s: '28px', d: 'retro'})} alt={data.nickname}/>
                                <div>
                                    <span id="profile-name">{data.nickname}</span>
                                    <span id="profile-active">Active</span>
                                </div>
                            </ProfileModal>
                            <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                        </Menu>
                        }
                    </span>
                </RightMenu>
            </Header>
            <WorkspaceWrapper>
                <Workspaces>test</Workspaces>
                <Channels>
                    <WorkspaceName>Sleact</WorkspaceName>
                    <MenuScroll>menuScroll</MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/channel" component={Channel}/>
                        <Route path="/workspace/dm" component={DirectMessage}/>
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            {children}
        </div>
    )
}

export default Workspace;