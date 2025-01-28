'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });
import NotFoundJson from './404.json';

const NotFoundError = () => {
  return (
    <Lottie
      animationData={NotFoundJson}
      loop
      play
      style={{ width: 500, height: 400 }}
    />
  );
};

export default NotFoundError;
