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

      const responseData = await response.json();
      console.log(responseData);

      if (responseData.summary) {
        const summaryLines = responseData.summary.split('\n').filter((line: string) => line.trim() !== '');
        
        // Find the index where the recommendation starts
        const recIndex = summaryLines.findIndex((line: string) => line.toLowerCase().includes('recommended action'));
        
        if (recIndex !== -1) {
          // Separate bullet points and recommendation
          const bulletPoints = summaryLines.slice(0, recIndex);
          const recommendation = summaryLines.slice(recIndex).join('\n');

          setArrayOfSummaryBulletPoints(bulletPoints);
          setRec(recommendation);
        } else {
          // If no recommendation found, treat all as bullet points
          setArrayOfSummaryBulletPoints(summaryLines);
          setRec('');
        }
      } else {
        setArrayOfSummaryBulletPoints([]);
        setRec('No summary available');
      }

    } catch (error) {
      console.error('Error:', error);
      setArrayOfSummaryBulletPoints([]);
      setRec('Error processing request');
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
      {rec && <p><strong>Recommendation:</strong> {rec}</p>}
      <ul>
        {arrayOfSummaryBulletPoints.map((summaryBulletPoint, index) => (
          <li key={index}>{summaryBulletPoint}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;