import React, { useCallback, useEffect, useRef } from 'react';
import { Container, Header } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import useSWR, { useSWRInfinite } from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';

const DirectMessage = () => {
  const path = 'http://localhost:3095';
  const { workspace, id } = useParams<{ workspace: string, id: string }>();
  const { data: userData } = useSWR(`${path}/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`${path}/api/users`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');

  const [socket] = useSocket(workspace);

  const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IDM[]>(
    (index) => `${path}/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (chat?.trim() && chatData) {
      const savedChat = chat;
      mutateChat((prevChatData) => {
        prevChatData?.[0].unshift({
          id: (chatData[0][0]?.id || 0) + 1,
          content: savedChat,
          SenderId: myData.id,
          Sender: myData,
          ReceiverId: userData.id,
          Receiver: userData,
          createdAt: new Date(),
        });
        return prevChatData;
      }, false).then(
        () => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
      console.log(chat);
      axios.post(`${path}/api/workspaces/${workspace}/dms/${id}/chats`, {
        content: chat,
      }, {
        withCredentials: true,
      }).then(() => {
        revalidate();
        setChat('');
        scrollbarRef.current?.scrollToBottom();
      })
        .catch(console.error);
    }
    //
  }, [chat, chatData, myData, userData, workspace, id]);

  const onMessage = useCallback((data: IDM) => {
    if(data.SenderId === Number(id) && myData.id !== Number(id)){
      mutateChat((chatData)=>{
        chatData?.[0].unshift(data);
        return chatData;
      },false)
        .then(()=>{
          if(scrollbarRef?.current){
            if(
              scrollbarRef.current.getScrollHeight()<
              scrollbarRef.current.getClientHeight()+scrollbarRef.current.getScrollTop()+150
            ){
              console.log('scrollToBottom!',scrollbarRef.current.getValues());
              setTimeout(()=>{
                scrollbarRef.current?.scrollToBottom()
              },50);
            }
          }
        })
    }
  }, []);
  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);
  //로딩시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        scrollRef={scrollbarRef}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;