import React from 'react';
import styled from 'styled-components';

const FlexRow = styled.div`
  display: flex;
  padding: 8px;
  @media (max-width: 768px) {
    padding: 8px 0;
  }
`;

const RowText = styled.div`
  margin: auto 4px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Input = styled.input`
  border-radius: 6px;
  border: 1px solid #d8d8d8;
  padding: 5px 16px;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  width: 100px;
  margin-left: 8px;
  @media (max-width: 768px) {
    width: 60%;
  }
`;

// const DelButton = styled.div`
//   margin: auto;
//   margin-left: 8px;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   cursor: pointer;
//   background-color: red;
//   width: 20px;
//   height: 20px;
// `;

// const Text = styled.p`
//   color: white;
//   margin: 0 auto;
// `;

interface IProps {
  memberList: Member[]
  setMemberList: any
  removeMember: any
}

const PayList: React.FC<IProps> = props => {
  const { memberList, setMemberList } = props;
  return (
    <>
      {memberList.map((member, i) => (
        <FlexRow>
          <RowText>No. {i + 1}</RowText>
          <Input
            value={member.amount}
            type="number"
            onChange={e => setMemberList(i, 'amount', e.target.value)}
          />
          {/* <DelButton onClick={() => removeMember(i)}><Text>X</Text></DelButton> */}
        </FlexRow>
      ))}
    </>
  );
};

export default PayList;
