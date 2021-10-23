import React, { ChangeEventHandler, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Title from '../components/Title';
import axios from 'axios';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  @media(max-width: 768px) {
    padding: 0 5%;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled.div`
  background: #415463;
  min-height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  border-radius: 10px;
`;

const VisionPage: React.FC = props => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [foundText, setFoundText] = useState<string[]>([]);
  const [touch, setTouch] = useState(false);

  const onChangeFile = (elem: HTMLInputElement) => {
    if (elem.files?.length !== 1) {
      setFile(null);
      return;
    }
    const file = elem.files[0];
    console.log('File is ', file);
    setFile(file);
  }

  const onSubmit = async () => {
    try {
      setIsUploading(true);
      setTouch(true);
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      const URL = 'https://us-central1-betsu-74576.cloudfunctions.net/upload';
      const textList: string[] = await axios.post(
        URL,
        file,
        { headers:
          {
            'content-type': 'multipart/form-data'
          },
        },
      );
      setFoundText(textList);
    } catch (e) {

    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Container>
      <Title />
      <div>
        <Link to="/">Back to basic mode</Link>
      </div>
      <br />
      <br />
      <p>Upload your receipt/slip and we will help filling the form for you.</p>
      <br />
      <Column>
        <Row>
          <input type="file" name="receipt" onChange={e => onChangeFile(e.target)} />
          <div>
            <p>Filename: {file ? file.name : 'choose file first'}</p>
          </div>
        </Row>
        <br />
        <br />
        <Button onClick={onSubmit}>Yo, Do the thing.</Button>
      </Column>
      {isUploading && <div>That's a lot of work isn't it. Wait for a moment sir.</div>}
      {touch && (
        <div>
          <p>Here the text we found:</p>
          <hr />
          <p>{foundText.map(t => t).join(', ')}</p>
        </div>
      )}
    </Container>
  );
}

export default VisionPage;
