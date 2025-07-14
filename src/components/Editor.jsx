import React, { useContext } from 'react';
import { WritingContext } from '../contexts/WritingContext';
import Textarea from './ui/Textarea';
import OutputDisplay from './OutputDisplay';

const Editor = () => {
  const { output, setOutput } = useContext(WritingContext);

  return (
    <div className="bg-secondary border border-primary/20 rounded-lg p-4 sm:p-6 min-h-[50vh]">
      <Textarea
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        placeholder="Your generated text will appear here..."
        className="w-full min-h-[40vh] bg-transparent text-accent border-none focus:ring-0 resize-none font-[Inter] text-sm sm:text-base"
      />
      <OutputDisplay />
    </div>
  );
};

export default Editor;