import React, {useCallback, VFC} from "react";
import Modal from "@components/Modal";
import {Button, Input, Label} from "@pages/SignUp/styles";
import useInput from "@hooks/useInput";
import axios from "axios";
import {toast} from "react-toastify";
import {useParams} from "react-router";
import {IChannel, IUser} from "@typings/db";
import useSWR from "swr";
import fetcher from "@utils/fetcher";

interface props {
    show: boolean;
    onCloseModal: () => void;
    setShowInviteChannelModal:(flag:boolean)=>void
}

const InviteChannelModal: VFC<props> = ({show, onCloseModal,setShowInviteChannelModal}) => {
    const [newMember,onChangeNewMember,setNewMember] = useInput('');
    const {workspace,channel} = useParams<{workspace:string,channel:string}>();

    const {data:userData} = useSWR<IUser>('http://localhost:3095/api/users',fetcher);
    const {revalidate:revalidateMembers}=useSWR<IUser[]>(userData ?`http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/members`:null, fetcher);

    const onInviteMember= useCallback((e) => {
        e.preventDefault()
        if(!newMember||newMember.trim()===''){
            return;
        }
        axios.post(`http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/members`,{
            email:newMember,
        },{
            withCredentials:true
        }).then(()=>{
            revalidateMembers();
            setShowInviteChannelModal(false);
            setNewMember('');
        }).catch((error)=>{
            console.error(error);
            toast.error(error.response?.data,{position:"bottom-center"});
        })

    }, [newMember,workspace,channel]);
    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onInviteMember}>
                <Label id="member-label">
                    <span>채널 맴버 초대</span>
                    <Input id="member" type="email" value={newMember} onChange={onChangeNewMember}/>
                </Label>
                <Button type="submit">초대하기</Button>
            </form>
        </Modal>
    )
}

export default InviteChannelModal;