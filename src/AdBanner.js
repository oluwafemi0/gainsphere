import React from 'react';

const AdBanner = ({ adText }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center mb-4 shadow-md">
      <h3 className="text-lg font-semibold">{adText}</h3>
      <p className="text-gray-600">Your ad here</p>
    </div>
  );
};

export default AdBanner;
