import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  BrowserRouter as Router,
  useLocation,
  Link,
} from 'react-router-dom';

import Title from './components/Title';
import Counter from './components/Counter';
import DiscountCondition from './components/Step/DiscountCondition';
import useMemberList from './hooks/use-member-list';
import useDiscount from './hooks/use-discount';
import PayList from './components/Step/PayList';
import VisionPage from './vision/index';
import NameList from './components/Step/NameList';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  @media(max-width: 768px) {
    padding: 0 5%;
  }
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
  background-color: ${props => props.theme.brown};
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

const SubTitle = styled.span`
  font-size: 10px;
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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const App = () => {
  const { memberList, setMemberList, addMember, removeMember, sumTotal } = useMemberList([{ amount: 0, name: 'No. 1' }]);
  const { discount, setDiscount, getDiscountedPrice } = useDiscount(0);
  const [isConstantDiscount, setIsConstantDiscount] = useState(false);
  const discounted = getDiscountedPrice(sumTotal, isConstantDiscount);
  const query = useQuery();
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
  if (query.get('beta') === 'true') {
    return <VisionPage />
  }
  return (
    <Container>
      <Title />
      <div>
        <Link to="/?beta=true">Try new feature?</Link>
      </div>
      <br />
      <br />
      <Row>
        <StepColumn>
          <StepTitle>1. How many?</StepTitle>
          <Counter
            onChange={onChangeCounter}
          />
          <NameList
            memberList={memberList}
            setMemberList={setMemberList}
            removeMember={removeMember}
          />
        </StepColumn>
        <StepColumn>
          <StepTitle>2. What is the discount condition?</StepTitle>
          <DiscountCondition
            toggleConstantDiscount={toggleConstantDiscount}
            isConstantDiscount={isConstantDiscount}
            discount={discount}
            setDiscount={setDiscount}
          />
        </StepColumn>
        <StepColumn>
          <StepTitle>3. How much did each one pay? <SubTitle>(Price before discount)</SubTitle></StepTitle>
          <PayList
            memberList={memberList}
            setMemberList={setMemberList}
            removeMember={removeMember}
          />
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
              // <p>No. {i + 1} paid {toBePaid} (Discount: {discount})</p>
              <p>{member.name} paid {toBePaid} (Discount: {discount})</p>
            );
          })}
        </DistributionColumn>
      </Row>
    </Container>
  );
};

const RoutedApp = () => <Router><App /></Router>

export default RoutedApp;
