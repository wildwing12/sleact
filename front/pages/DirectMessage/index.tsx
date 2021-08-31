import React, {useCallback} from "react";
import {Container, Header} from "@pages/DirectMessage/styles";
import gravatar from 'gravatar';
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import {useParams} from "react-router";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";
import axios from "axios";
import {IDM} from "@typings/db";

const DirectMessage = () => {
    const path = "http://localhost:3095";
    const {workspace, id} = useParams<{ workspace: string, id: string }>();
    const {data: userData,} = useSWR(`${path}/api/workspaces/${workspace}/users/${id}`, fetcher,);
    const {data: myData,} = useSWR(`${path}/api/users`, fetcher,);
    const [chat, onChangeChat, setChat] = useInput('');

    const {data:chatData,mutate:mutateChat,revalidate} = useSWR<IDM[]>(
        `${path}/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
        fetcher,
    );

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        if (chat?.trim()) {
            console.log(chat)
            axios.post(`${path}/api/workspaces/${workspace}/dms/${id}/chats`, {
                content: chat
            },{
                withCredentials:true
            }).then(() => {
                setChat('');
            })
                .catch(console.error);
        }
        //
    }, [chat]);


    if (!userData || !myData) {
        return null;
    }
    return (
        <Container>
            <Header>
                <img src={gravatar.url(userData.email, {s: '24px', d: 'retro'})} alt={userData.nickname}/>
                <span>{userData.nickname}</span>
            </Header>
            <ChatList chatData={chatData} />
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
        </Container>
    )
}

export default DirectMessage;