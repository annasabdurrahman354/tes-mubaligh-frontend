import React from "react";
import { Card, CardBody } from "@heroui/react";

interface TimerProps {
  datetimeOrMinutes: Date | number;
  className?: string; // Optional className prop
}

export default function SmallTimer({ datetimeOrMinutes, className }: TimerProps) {
  const [timeElapsed, setTimeElapsed] = React.useState({
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    let startTime: Date;

    if (typeof datetimeOrMinutes === "number") {
      // If number, calculate the start time in the past
      startTime = new Date(new Date().getTime() - datetimeOrMinutes * 60000);
    } else {
      // If Date, use it directly
      startTime = datetimeOrMinutes;
    }

    const calculateTimeElapsed = () => {
      const difference = new Date().getTime() - startTime.getTime();
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeElapsed({ minutes, seconds });
    };

    // Calculate immediately
    calculateTimeElapsed();

    // Update every second
    const timer = setInterval(calculateTimeElapsed, 1000);

    return () => clearInterval(timer);
  }, [datetimeOrMinutes]);

  return (
    <Card className={`w-fit ${className || ""}`} radius="md" bordered shadow="sm">
      <CardBody className="flex items-center justify-center py-0.5 px-2">
        <div className="text-xs font-semibold tabular-nums text-default-700">
          {String(timeElapsed.minutes).padStart(2, "0")}:
          {String(timeElapsed.seconds).padStart(2, "0")}
        </div>
      </CardBody>
    </Card>
  );
}