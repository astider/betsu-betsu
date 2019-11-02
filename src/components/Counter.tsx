import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface IProps {
  onChange: (count: number) => any
  initial?: number
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
`;

const Button = styled.button`
  border: 1px solid ${props => props.theme.gray};
  border-radius: 4px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
`;

const NumberContainer = styled.div`
  margin: 0 4px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  > p {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
`;

const Counter: React.FC<IProps> = props => {
  const { onChange, initial } = props;
  const isMounted = useRef<boolean>(false);
  const [count, setCount] = useState<number>(initial || 1);
  const isLeftDisable = count === 1;
  function increment() {
    setCount((prevCount: number) => prevCount + 1);
  }
  function decrement() {
    setCount((prevCount: number) => {
      return prevCount > 1 ? prevCount - 1 : prevCount;
    });
  }
  useEffect(() => {
    if (isMounted.current && onChange) {
      onChange(count);
    }
    if (!isMounted.current) {
      isMounted.current = true;
    }
  }, [count, onChange]);
  return (
    <Container>
      <Button disabled={isLeftDisable} onClick={decrement}>-</Button>
      <NumberContainer>
        <p>{count}</p>
      </NumberContainer>
      <Button onClick={increment}>+</Button>
    </Container>
  );
};

export default Counter;
