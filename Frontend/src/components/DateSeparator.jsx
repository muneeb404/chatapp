import React from 'react';

const DateSeparator = ({ date }) => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-base-200 text-base-content text-xs px-3 py-2 rounded-full">
        {date}
      </div>
    </div>
  );
};

export default DateSeparator;

