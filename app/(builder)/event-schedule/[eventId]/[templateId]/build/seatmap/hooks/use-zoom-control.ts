'use client';

import { useEffect, useState } from 'react';

import { MAX_SCALE, MIN_SCALE } from '../constants';
import { useStage } from '../context/stage';

function getScaleFromPercentage(percentage: number): number {
  const clamped = Math.max(1, Math.min(100, percentage));
  const normalized = (100 - clamped) / 99;
  return Math.exp(
    Math.log(MIN_SCALE) +
      normalized * (Math.log(MAX_SCALE) - Math.log(MIN_SCALE)),
  );
}

function getZoomPercentage(scale: number): number {
  const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
  const normalized =
    (Math.log(clamped) - Math.log(MIN_SCALE)) /
    (Math.log(MAX_SCALE) - Math.log(MIN_SCALE));
  return Math.round(100 - normalized * 99);
}

export function useZoomControl(zoomLevel: number = 5) {
  const { getStage, getStageClientRect } = useStage();
  const [percentage, setPercentage] = useState(100);
  const contentRect = getStageClientRect();

  useEffect(() => {
    if (!!contentRect?.width && !!contentRect?.height) {
      zoomToFit();
    }
  }, [contentRect]);

  useEffect(() => {
    const stage = getStage();
    if (!stage) return;

    const updateZoom = () =>
      setPercentage(getZoomPercentage(getStage()?.scaleX() || 1));
    stage.on('wheel', updateZoom);

    updateZoom();

    return () => {
      stage.off('wheel', updateZoom);
    };
  }, []);

  const zoomToFit = () => {
    const stage = getStage();
    const containerSize = {
      width: stage?.width() || 0,
      height: stage?.height() || 0,
    };

    if (
      !stage ||
      !contentRect ||
      containerSize.width === 0 ||
      containerSize.height === 0
    )
      return;

    const paddedWidth = containerSize.width * 0.8;
    const paddedHeight = containerSize.height * 0.8;

    const scaleX = paddedWidth / contentRect.width;
    const scaleY = paddedHeight / contentRect.height;
    const scale = Math.min(scaleX, scaleY, MAX_SCALE);

    const offsetX = (containerSize.width - contentRect.width * scale) / 2;
    const offsetY = (containerSize.height - contentRect.height * scale) / 2;

    stage.to({
      x: offsetX - contentRect.x * scale,
      y: offsetY - contentRect.y * scale,
      scaleY: scale,
      scaleX: scale,
    });
    setPercentage(getZoomPercentage(scale));
  };

  const setZoomByPercentage = (level: number) => {
    const stage = getStage();
    if (!stage) return;

    const scale = getScaleFromPercentage(level);
    const currentPosition = stage.position();

    const center = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };

    const newPos = {
      x: center.x - (center.x - currentPosition.x) * (scale / stage.scaleX()),
      y: center.y - (center.y - currentPosition.y) * (scale / stage.scaleY()),
    };

    stage.scale({ x: scale, y: scale });
    stage.position(newPos);
    stage.batchDraw();

    setPercentage(level);
  };

  const zoomIn = () => {
    const newLevel = Math.max(1, percentage - zoomLevel);
    setZoomByPercentage(newLevel);
  };

  const zoomOut = () => {
    const newLevel = Math.min(100, percentage + zoomLevel);
    setZoomByPercentage(newLevel);
  };

  return {
    percentage,
    zoomIn,
    zoomOut,
    setZoomByPercentage,
    zoomToFit,
  };
}
