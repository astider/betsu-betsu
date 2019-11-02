import React from 'react';
import styled from 'styled-components';

const FlexRow = styled.div`
  display: flex;
  padding: 8px;
  @media (max-width: 768px) {
    padding: 8px 0;
  }
`;

const CheckBoxDiv = styled.div`
  cursor: pointer;
  margin-bottom: 8px;
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

const DCInput = styled(Input)`
  width: 100px;
  @media (max-width: 768px) {
    width: 80px;
  }
`;


const RowText = styled.div`
  margin: auto 4px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

interface IProps {
  toggleConstantDiscount: any
  isConstantDiscount: boolean
  discount: any
  setDiscount: any
}

const DiscountCondition: React.FC<IProps> = props => {
  const { toggleConstantDiscount, isConstantDiscount, discount, setDiscount } = props;
  return (
    <>
      <CheckBoxDiv onClick={toggleConstantDiscount}>
        <input type="checkbox" checked={isConstantDiscount} />
        Calculate constant discount
      </CheckBoxDiv>
      <FlexRow>
        <DCInput value={discount.rate} onChange={(e) => setDiscount('rate', e.target.value)} disabled={isConstantDiscount} />
        <RowText> % off</RowText>
        <DCInput value={discount.cap} onChange={(e) => setDiscount('cap', e.target.value)} />
        <RowText> {isConstantDiscount ? 'Discount' : 'Discount Cap'}</RowText>
      </FlexRow>
    </>
  );
};

export default DiscountCondition;
