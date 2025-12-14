import { useState, useEffect } from "react";
export default function ProgressBar({ timer }) {
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("INTERVAL");
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);

    // Cleanup Function
    // Cleanup: لا يعمل أبدًا بدون unmount أو dependency change
    // Cleanup: يعمل قبل تشغيل effect جديد أو عند unmount،
    // ولا يعمل عند أول تنفيذ للمكوّن لأنه لا يوجد effect سابق لتنظيفه.
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress value={remainingTime} max={timer} />;
}
