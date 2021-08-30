import React, {useCallback, useState, VFC} from "react";
import {useParams} from "react-router";
import useSWR from "swr";
import {IUser, IUserWithOnline} from "@typings/db";
import fetcher from "@utils/fetcher";
import {CollapseButton} from "@components/DMList/styles";
import {NavLink}from'react-router-dom'


const DMList: VFC = () => {

    const {workspace} = useParams<{ workspace: string }>();
    const { data: userData, error, revalidate, mutate } = useSWR<IUser>('http://localhost:3095/api/users', fetcher, {
        dedupingInterval: 2000, // 2초
    });
    const {data: memberData} = useSWR<IUserWithOnline[]>(
        userData ? `http://localhost:3095/api/workspaces/${workspace}/members` : null, fetcher);
    const [channelCollapse,setChannelCollapse] = useState(false);
    const [countList,setCountList] = useState<{[key:string]:number}>({});
    const [onlineList,setOnlineList] = useState<number[]>([]);

    const toggleChannelCollapse = useCallback(() => {
        setChannelCollapse(prevState => !prevState);
    }, [],);

    const resetCount =useCallback((id)=>()=>{
        setCountList(list=>{
            return {
                ...list,
                [id]:0
            }
        })
    },[]);
    return (
        <>
            <h2>
                <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
                    <i
                        className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
                        data-qa="channel-section-collapse"
                        aria-hidden="true"
                    />
                </CollapseButton>
                <span>Direct Messages</span>
            </h2>
            <div>
                {!channelCollapse &&
                memberData?.map((member) => {
                    const isOnline = onlineList.includes(member.id);
                    const count = countList[member.id] || 0;
                    return (
                        <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
                            <i
                                className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                                    isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                                }`}
                                aria-hidden="true"
                                data-qa="presence_indicator"
                                data-qa-presence-self="false"
                                data-qa-presence-active="false"
                                data-qa-presence-dnd="false"
                            />
                            <span className={count>0 ? 'bold':undefined}>{member.nickname}</span>
                            {member.id === userData?.id && <span> (나)</span>}
                        </NavLink>
                    );
                })}
            </div>
        </>
    )
}

export default DMList;