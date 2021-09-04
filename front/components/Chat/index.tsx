import React, { VFC, memo, useMemo } from 'react';
import { IDM } from '@typings/db';
import { ChatWrapper } from '@components/Chat/styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';
interface Props {
  data: IDM;
}

const Chat: VFC<Props> = memo(({ data }) => {
  const {workspace} = useParams<{workspace:string}>();
  const user = data.Sender;

  // ?는 0개나 1개, *가 0개 이상을 뜻합니다.
  const result  =useMemo(()=> regexifyString({
    input:data.content,
    pattern:/@\[(.+?)]\((\d+?)\)|\n/g,
    decorator(match,index){
      const arr:string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
      if (arr){
        return(
          <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
            @{arr[1]}
          </Link>
        )
      }
      return <br key={index} />
    }
  }),[data.content]);
  return(
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email,{s:'36px',d:'retro'})} alt={user.nickname}  />
      </div>
      <div className='chat-text'>
        <div className='chat-user'>
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
});
export default Chat;