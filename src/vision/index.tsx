import React, { useState } from 'react';
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
  const [scopeText, setScopeText] = useState<string[]>([]);
  const [touch, setTouch] = useState(false);

  const onChangeFile = (elem: HTMLInputElement) => {
    if (elem.files?.length !== 1) {
      setFile(null);
      return;
    }
    const file = elem.files[0];
    // console.log('File is ', file);
    setFile(file);
  }

  const onSubmit = async () => {
    try {
      setIsUploading(true);
      setTouch(true);
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      const URL = 'https://us-central1-betsu-74576.cloudfunctions.net/vision/upload';
      const { list: textList }: { list: string[] } = await axios.post<{ list: string[] }>(
        URL,
        formData,
        { headers:
          {
            'content-type': 'multipart/form-data'
          },
        },
      ).then(resp => resp.data);
      setFoundText(textList);
      const lowerCasedList = textList.map(text => text.toLowerCase());
      if (
        lowerCasedList.indexOf('summary')
        && lowerCasedList.indexOf('total')
      ) {
        const start = lowerCasedList.indexOf('summary');
        const endMinus = lowerCasedList.indexOf('total');
        const scoped = textList.slice(start, endMinus + 1);
        setScopeText(scoped);
      }
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
        <div style={{ marginTop: '24px' }}>
          <p>{isUploading ? 'finding words...' : 'Here\'s the text we found:'}</p>
          <hr />
          <p>{foundText.length > 0 ? foundText.map(t => t).join(', ') : 'No text found'}</p>
          <br />
          <br />
          <p>Scoped info:</p>
          <p>{scopeText.length > 0 ? scopeText.map(t => t).join(', ') : 'No scoped text found'}</p>
          <br />

        </div>
      )}
    </Container>
  );
}
// https://ko-fi.com/astider
export default VisionPage;
