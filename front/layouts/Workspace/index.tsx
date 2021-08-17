import React, {FC, useCallback} from 'react';
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import axios from "axios";
import {Redirect} from "react-router-dom";
import {
    Channels,
    Chats,
    Header, MenuScroll,
    ProfileImg,
    RightMenu,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper,
} from "@layouts/Workspace/styles";
import gravatar from 'gravatar';
const Workspace: FC = ({children}) => {
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

    if (!data) {
        return <Redirect to="/login"/>
    }
    return (
        <div>
            <Header>
                <RightMenu>
                    <span>
                        <ProfileImg src={gravatar.url(data.nickname, {s:'28px',d:'retro'})} alt={data.nickname} />
                    </span>
                </RightMenu>
            </Header>
            <button onClick={onLogout}>로그아웃</button>
            <WorkspaceWrapper>
                <Workspaces>test</Workspaces>
                <Channels>
                    <WorkspaceName>Sleact</WorkspaceName>
                    <MenuScroll>menuScroll</MenuScroll>
                </Channels>
                <Chats>Chats</Chats>
            </WorkspaceWrapper>
            {children}
        </div>
    )
}

export default Workspace;