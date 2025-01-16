"use client";
import dynamic from "next/dynamic";
import React from "react";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });
import loading from "./loading.json";

const Loading = () => {
  return (
    <div className="w-auto h-full flex justify-center items-center">
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
