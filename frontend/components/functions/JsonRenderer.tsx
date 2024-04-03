import React from 'react';

type JsonRendererProps = {
 jsonData: any; // Replace 'any' with the actual type of your jsonData
};

const JsonRenderer: React.FC<JsonRendererProps> = ({ jsonData }) => {
  if (!jsonData) {
    return null;
  }

 const gptContent = jsonData.GPT ? <p><strong>GPT:</strong> {jsonData.GPT}</p> : '';
 const chatHistory = jsonData.chat_history ?? null;

 if (Array.isArray(chatHistory) && chatHistory.length > 0) {
    const formattedContent = chatHistory.map((item, index) => {
      const role = item.sender === 'user' ? 'User' : 'Assistant';
      const message = item.message
        .replace(/    /g,'\n') //GPT sometimes returns four spaces followed by a dash. This adds a linebreak to list elements up better.
        .replace(/(?:(?<!:)  (?!\d+\.))/g,'\n\n') // This adds linebreaks between paragraphs, unless a colon is presented.
        .replace(/(?:(?<=: ) \d+\.|(?<=\. )\d+\.|(?<=\.  )\d+\.)|(?<=\.   )\d+\./g,'\n$&'); // This adds linebreak for numbered elements and helps to breaks up the returned text.

      return <p className="pb-3" key={index}><strong>{role}:</strong> {message}</p>;
    }).reverse();

    // Combine all the React components
    const reactContent = [gptContent, ...formattedContent];

    return <>{reactContent}</>;
 }

 return null;
};

export default JsonRenderer;