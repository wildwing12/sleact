import React, { useCallback, useRef, VFC, forwardRef, RefObject } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/style';
import { IDM } from '@typings/db';
import { Scrollbars } from 'react-custom-scrollbars';
import Chat from '@components/Chat';

interface Props {
  chatSections: {[key:string]:IDM[]};
  setSize:(f:(index:number)=>number)=>Promise<IDM[][] | undefined>;
  isEmpty:boolean;
  isReachingEnd:boolean;
  scrollRef:RefObject<Scrollbars>;
}

const ChatList: VFC<Props>=({ chatSections,setSize, scrollRef,isReachingEnd }) => {

  const onScroll = useCallback((values) => {
    if(values.scrollTop === 0 && !isReachingEnd){
      console.log('가장 위');
      //데이터 추가 로딩
      setSize((prevSize)=>prevSize+1)
        .then(()=>{
          //스크롤 위치
          if(scrollRef?.current)
            scrollRef.current?.scrollTop(scrollRef.current?.getScrollHeight() - values.scrollHeight)
        });
    }
  }, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
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