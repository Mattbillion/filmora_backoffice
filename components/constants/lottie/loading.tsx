'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });
import loading from './loading.json';

const Loading = () => {
  return (
    <div className="flex h-full w-auto items-center justify-center">
      <Lottie
        loop
        animationData={loading}
        play
        style={{ width: 500, height: 400 }}
      />
    </div>
  );
};

export default Loading;
