import React, {useCallback, useState, VFC} from 'react'
import {IChannel, IUser} from "@typings/db";
import {useLocation, useParams} from "react-router";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import {NavLink} from "react-router-dom";
import {CollapseButton} from "@components/DMList/styles";


const ChannelList: VFC = () => {
    const [channelCollapse, setChannelCollapse] = useState(false);
    const [countList, setCountList] = useState<{ [key: string]: number | undefined }>({})
    const path = "http://localhost:3095";
    const {workspace} = useParams<{ workspace: string }>();
    const {data: userData, error, revalidate, mutate} = useSWR<IUser | false>(`${path}/api/users`, fetcher, {dedupingInterval: 2000});
    const {data: channelData} = useSWR<IChannel[]>(userData ? `${path}/api/workspaces/${workspace}/channels` : null, fetcher);
    const location = useLocation();

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
                <span>Channels</span>
            </h2>
            <div>
                {!channelCollapse &&
                channelData?.map((channel) => {
                    return (
                        <NavLink
                            key={channel.name}
                            activeClassName="selected"
                            to={`/workspace/${workspace}/channel/${channel.name}`}
                        >
                            <span># {channel.name}</span>
                        </NavLink>
                    );
                })}
            </div>
        </>
    );
}
export default ChannelList;