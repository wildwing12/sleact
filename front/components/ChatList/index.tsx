import React, { useCallback, useRef, VFC } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/style';
import { IDM } from '@typings/db';
import { Scrollbars } from 'react-custom-scrollbars';
import Chat from '@components/Chat';

interface Props {
  chatSections: {[key:string]:IDM[]};
}

const ChatList: VFC<Props> = ({ chatSections }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {
  }, []);
  console.log(chatSections);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {/*객체를 배열로 바꾸는방법*/}
        {Object.entries(chatSections).map(([date,chats])=>{
          return(<Section className={`section-${date}`} key={date}>
            <StickyHeader>
              <button>{date}</button>
            </StickyHeader>
            {chats.map((chat)=>(
              <Chat key={chat.id} data={chat}/>
            ))}
          </Section>)
        })}

      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;