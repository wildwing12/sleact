import React, {useCallback, useState, VFC} from 'react';
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import axios from "axios";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import {
    AddButton,
    Channels,
    Chats,
    Header,
    LogOutButton,
    MenuScroll,
    ProfileImg,
    ProfileModal,
    RightMenu,
    WorkspaceButton, WorkspaceModal,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper,
} from "@layouts/Workspace/styles";
import gravatar from 'gravatar';
import loadable from "@loadable/component";
import Menu from "@components/Menu";
import {IUser} from "@typings/db";
import {Button, Input, Label} from "@pages/SignUp/styles";
import useInput from "@hooks/useInput";
import Modal from "@components/Modal";
import {toast} from "react-toastify";
import CreateChannelModal from "@components/CreateChannelModal";

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import("@pages/DirectMessage"));

const Workspace: VFC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const {
        data: userData,
        error,
        revalidate,
        mutate
    } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, {
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


    const onClickUserProfile = useCallback((e) => {
        e.stopPropagation();
        setShowUserMenu(prevState => !prevState);
    }, []);

    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true);
    }, []);

    const onCreateWorkspace = useCallback((e) => {
        e.preventDefault();
        if (!newWorkspace || !newWorkspace.trim()) return;
        if (!newUrl || !newUrl.trim()) return;
        axios.post("http://localhost:3095/api/workspaces", {
            workspace: newWorkspace,
            url: newUrl,
        }, {
            withCredentials: true,
        }).then(() => {
            revalidate();
            setShowCreateWorkspaceModal(false);
            setNewWorkspace('');
            setNewUrl('');
        }).catch(error => {
            console.dir(error);
            toast.error(error.response?.data, {position: 'bottom-center'})
        })
    }, [newWorkspace, newUrl]);

    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false);
        setShowCreateChannelModal(false);
    }, []);

    const toggleWorkspaceModal = useCallback(() => {
        setShowWorkspaceModal(prev => !prev);
    }, [])

    const onClickAddChannel = useCallback(() => {
        setShowCreateChannelModal(true);
    }, []);

    if (!userData) {
        return <Redirect to="/login"/>
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(userData.nickname, {s: '28px', d: 'retro'})}
                                    alt={userData.nickname}/>
                        {showUserMenu &&
                        <Menu style={{right: 0, top: 38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                            <ProfileModal>
                                <img src={gravatar.url(userData.nickname, {s: '28px', d: 'retro'})}
                                     alt={userData.nickname}/>
                                <div>
                                    <span id="profile-name">{userData.nickname}</span>
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
                <Workspaces>{userData.Workspaces && userData.Workspaces.map((ws) => {
                    return (
                        <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                            <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                        </Link>
                    )
                })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
                    <MenuScroll>
                        <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{top: 95, left: 80}}>
                            <WorkspaceModal>
                                <h2>Sleact</h2>
                                {/*<button onClick={onClickInviteWorkspace}>워크스페이스 초대</button>*/}
                                <button onClick={onClickAddChannel}>채널만들기</button>
                                <button onClick={onLogout}>로그아웃</button>
                            </WorkspaceModal>
                        </Menu>
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/channel" component={Channel}/>
                        <Route path="/workspace/dm" component={DirectMessage}/>
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>워크스페이스 이름</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}/>
                    </Label>
                    <Label id="workspace-url-label">
                        <span>워크스페이스 url</span>
                        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}/>
                    </Label>
                    <Button type="submit">생성하기</Button>
                </form>
            </Modal>
            <CreateChannelModal
                show={showCreateChannelModal}
                onCloseModal={onCloseModal}
            />
        </div>
    )
}

export default Workspace;