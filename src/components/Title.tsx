import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 16px;
  text-align: center;
  padding: 16px 0;
  border-bottom: 1px solid ${props => props.theme.gray};
`;

const H1 = styled.h1`
  font-size: 4em;
  margin: 0;
  /* color: ${props => props.theme.notBlack}; */
  color: ${props => props.theme.brown};
`;

const Eng = styled.h2`
  margin: 0;
  font-size: 1em;
  color: ${props => props.theme.notBlack};
`;

const Description = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.notBlack};
`;

const Title = () => {
  return (
    <Container>
      <H1>べつべつ</H1>
      <Eng>Betsu === Separately</Eng>
      <Description>Just 3 steps then you can calculate your meal discount easily!</Description>
    </Container>
  );
};

export default Title;
