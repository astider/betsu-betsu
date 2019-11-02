import { useState } from 'react';

export default function useMemberList(init: Member[]) {
  const [memberListState, setMemberListState] = useState<Member[]>(init);
  const setMemberList = (index: number, key: string, value: string) => {
    setMemberListState(memberListState
      .map((member, i) => (i === index) ? { ...member, [key]: value } : member)
    );
  }
  const addMember = () => setMemberListState([...memberListState, { amount: 0 }]);
  const removeMember = (index: number) => setMemberListState(memberListState.filter((member, i) => i !== index));
  const sumTotal = memberListState.reduce((sum, mem) => sum + Number(mem.amount), 0);
  return {
    setMemberList,
    memberList: memberListState,
    addMember,
    removeMember,
    sumTotal
  };
};
