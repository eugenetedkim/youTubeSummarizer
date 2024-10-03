import React, { useState, ChangeEvent } from 'react';
import TextInput from './components/TextInput';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [arrayOfSummaryBulletPoints, setArrayOfSummaryBulletPoints] = useState<string[]>([]);
  const [rec, setRec] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: text }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json(); // Parse response JSON
      console.log(responseData);
      const summary = responseData['summary']['message']['content'];
      const arrayOfSummaryBulletPoints = summary.split('- ');
      arrayOfSummaryBulletPoints.shift();
      const rec = arrayOfSummaryBulletPoints.pop();

      setArrayOfSummaryBulletPoints(arrayOfSummaryBulletPoints);
      setRec(rec);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <TextInput
          label="Enter YouTube URL"
          value={text}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </header>
      <p>{rec}</p>
      <ul>
        {arrayOfSummaryBulletPoints.map((summaryBulletPoint, index) => (
          <li key={index}>{summaryBulletPoint}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
