import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  BrowserRouter as Router,
  useLocation,
  Link,
} from 'react-router-dom';
import html2canvas from 'html2canvas';

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
  color: ${props => props.theme.notBlack};
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

const CaptureButton = styled.div`
  width: 100%;
  padding: 8px 0;
  background-color: #5bc131;
  color: #ffffff;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ButtonCaption = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
`;

export const PromptPayInput = styled.input`
  border-radius: 6px;
  border: 1px solid #d8d8d8;
  padding: 5px 16px;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  width: 300px;
  margin-left: 8px;
  @media (max-width: 768px) {
    width: 60%;
  }
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const App = () => {
  const { memberList, setMemberList, addMember, removeMember, sumTotal } = useMemberList([{ amount: 0, name: 'No. 1' }]);
  const { discount, setDiscount, getDiscountedPrice } = useDiscount(0);
  const [isConstantDiscount, setIsConstantDiscount] = useState(false);
  const [ppCode, setPPCode] = useState('');
  const [qrReady, setQRReady] = useState(false);
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

  const handlePPCodeChange = (val: string) => {
    setPPCode(val);
    if (val.length === 10 || val.length === 13) {
      // const imgData = new Image();
      // imgData.src = `https://promptpay.io/${ppCode}`;
      // const data = imgData.d
      setQRReady(true);
    } else {
      setQRReady(false);
    }
  }

  const capture = async (type: 'download' | 'copy') => {
    const elem = document.getElementById('distribution-section');
    if (window && navigator && elem) {
      const canvas = await html2canvas(elem);
      canvas.toBlob(async (blob) => {
        if (blob) {
          if (type === 'download') {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'distribution.png';
            link.click();
          }
          if (type === 'copy') {
            const data = [new ClipboardItem({ [blob.type]: blob })];
            await navigator.clipboard.write(data);
            alert('copied to clipboard');
          }
        }
      });
    }
  };


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
        <StepColumn>
          <StepTitle>4. Create PromptPay QR</StepTitle>
          <div style={{ display: 'flex', }}>
            <p>Enter your PromptPay code (Phone Number or ID Number):</p>
            <PromptPayInput value={ppCode} onChange={(e) => handlePPCodeChange(e.target.value)} />
          </div>
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
        <DistributionColumn id="distribution-section">
          <DistributionLabel>Distribution</DistributionLabel>
          {memberList.map((member, i) => {
            const { discount, toBePaid } = priceDistribution(member.amount);
            return (
              // <p>No. {i + 1} paid {toBePaid} (Discount: {discount})</p>
              <p>{member.name} {discount > 0 ? `got discount ${discount}` : ''}, net price: {toBePaid}</p>
            );
          })}
          {qrReady && (
            <div style={{ margin: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p>Scan the QR below to pay </p>
              <p style={{ margin: '-8px 0 8px', color: 'yellow', fontSize: '12px' }}>BUG: กด copy image ด้านล่างจะไม่ติด QR ลากแคปจอเองไปก่อนละกันนะ</p>
              <img src={`https://promptpay.io/${ppCode}`} alt="promptpay QR code" width={150} height={150} />
            </div>
          )}
        </DistributionColumn>
      </Row>
      <Row>
        <CaptureButton onClick={() => capture('download')}>
          <ButtonCaption>
            <div>Download result as image</div>
            <div><img src="/download-icon.png" width="24" height="24" alt="download" /></div>
          </ButtonCaption>
        </CaptureButton>
        <div style={{ display: 'flex', margin: '8px 16px', justifyContent: 'center', alignItems: 'center' }}>or</div>
        <CaptureButton onClick={() => capture('copy')}>
          <ButtonCaption>
            <div>Copy result image to clipboard</div>
            <img src="/copy-icon.png" width="24" height="24" alt="copy" />
          </ButtonCaption>
        </CaptureButton>
        <br/>
        <br/>
      </Row>
    </Container>
  );
};

const RoutedApp = () => <Router><App /></Router>

export default RoutedApp;
