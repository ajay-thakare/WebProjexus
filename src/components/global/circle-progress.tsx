"use client";
import { ProgressCircle } from "@tremor/react";
import React from "react";

type Props = {
  value: number;
  description: React.ReactNode;
};

const CircleProgress = ({ value = 0, description }: Props) => {
  return (
    <div className="flex gap-4 items-center">
      <ProgressCircle
        showAnimation={true}
        value={value}
        radius={70}
        strokeWidth={20}
      >
        {value}%
      </ProgressCircle>

      <div>
        <b>Closing Rate</b>
        <div className="text-muted-foreground [&:not(:last-child)]:mb-4">
          {description}
        </div>
      </div>
    </div>
  );
};

export default CircleProgress;
