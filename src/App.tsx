import React, { useState } from 'react';
import styled from 'styled-components';

import Title from './components/Title';
import Counter from './components/Counter';
import useMemberList from './hooks/use-member-list';
import useDiscount from './hooks/use-discount';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  @media(max-width: 768px) {
    padding: 0 5%;
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

const FlexRow = styled.div`
  display: flex;
  padding: 8px;
  @media (max-width: 768px) {
    padding: 8px 0;
  }
  // -webkit-transition: 1s ease-in-out;
  // -moz-transition: 1s ease-in-out;
  // -o-transition: 1s ease-in-out;
  // transition: 1s ease-in-out;
`;

const CheckBoxDiv = styled.div`
  cursor: pointer;
  margin-bottom: 8px;
`;

const DelButton = styled.div`
  margin: auto;
  margin-left: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: red;
  width: 20px;
  height: 20px;
`;

const Text = styled.p`
  color: white;
  margin: 0 auto;
`;

const Row = styled.div`
  display: flex;
  margin-bottom: 24px;
  @media(max-width: 768px) {
    flex-direction: column;
    margin-bottom: 0;
  }
`;

const Column = styled.div`
  flex: 1;
  border-radius: 4px;
  background-color: ${props => props.theme.blue};
  padding: 16px;
  &:first-child {
    margin-right: 8px;
  }
  &:last-child {
    margin-left: 8px;
  }
  color: ${props => props.theme.white};
  @media(max-width: 768px) {
    &:nth-child(n) {
      margin: 0 0 16px;
    }
  }
`;

const DistributionColumn = styled(Column)`
  flex: 2;
`;

const StepColumn = styled(Column)`
  background-color: ${props => props.theme.white};
  color: ${props => props.theme.black};
  &:nth-child(2) {
    margin: 0 8px;
    flex: 2;
  }
  @media(max-width: 768px) {
    &:nth-child(n) {
      margin: 0 0 16px;
    }
  }
`;

const StepTitle = styled.p`
  font-weight: 600;
  margin: 0 0 12px;
  line-height: 23px;
`;

const PriceLabel = styled.p`
  font-size: 16px;
  font-weight: 400;
  margin: 0 0 4px;
`;

const PriceText = styled.p`
  font-size: 48px;
  font-weight: 600;
  margin: 0;
`;

const DistributionLabel = styled(PriceLabel)`
  font-weight: 600;
`;

const App = () => {
  const { memberList, setMemberList, addMember, removeMember, sumTotal } = useMemberList([{ amount: 0 }]);
  const { discount, setDiscount, getDiscountedPrice } = useDiscount(0);
  const [isConstantDiscount, setIsConstantDiscount] = useState(false);
  const discounted = getDiscountedPrice(sumTotal, isConstantDiscount);
  const priceDistribution = (price: number) => {
    const memberPrice = price;
    const actualDiscount = discount.cap !== 0
      ? (sumTotal - discounted > discount.cap ? discount.cap : sumTotal - discounted)
      : (sumTotal - discounted);
    const memberShare = sumTotal > 0 ? Math.round((memberPrice * 100 / sumTotal) ) : 0;
    const discountShare = Math.round(actualDiscount * (memberShare / 100));
    return {
      discount: discountShare,
      toBePaid: memberPrice - discountShare
    };
  };
  const toggleConstantDiscount = () => {
    setIsConstantDiscount(!isConstantDiscount);
  };
  function onChangeCounter(count: number) {
    if (count > memberList.length) {
      addMember();
    } else if (count < memberList.length) {
      removeMember(memberList.length - 1);
    }
  }
  return (
    <Container>
      <Title />
      <Row>
        <StepColumn>
          <StepTitle>1. How many?</StepTitle>
          <Counter
            onChange={onChangeCounter}
          />
        </StepColumn>
        <StepColumn>
          <StepTitle>2. What is the discount condition?</StepTitle>
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
        </StepColumn>
        <StepColumn>
          <StepTitle>3. How much did each one pay?</StepTitle>
          {memberList.map((member, i) => (
            <FlexRow>
              <RowText>No. {i + 1}</RowText>
              <Input value={member.amount} type="number" onChange={e => setMemberList(i, 'amount', e.target.value)} />
              <DelButton onClick={() => removeMember(i)}><Text>X</Text></DelButton>
            </FlexRow>
          ))}
        </StepColumn>
      </Row>
      <Row>
        <Column>
          <PriceLabel>Net Total</PriceLabel>
          <PriceText>{sumTotal}</PriceText>
        </Column>
        <Column>
          <PriceLabel>Grand Total</PriceLabel>
          <PriceText>{discounted}</PriceText>
        </Column>
        <DistributionColumn>
          <DistributionLabel>Distribution</DistributionLabel>
          {memberList.map((member, i) => {
            const { discount, toBePaid } = priceDistribution(member.amount);
            return (
              <p>No. {i + 1} paid {toBePaid} (Discount: {discount})</p>
            );
          })}
        </DistributionColumn>
      </Row>
    </Container>
  );
};

export default App;
