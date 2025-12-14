import { useEffect } from "react";
import ProgressBar from "./ProgressBar.jsx";

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    console.log("TIMER SER");
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);

    // Cleanup Function
    // Cleanup: لا يعمل أبدًا بدون unmount أو dependency change
    // Cleanup: يعمل قبل تشغيل effect جديد أو عند unmount،
    // ولا يعمل عند أول تنفيذ للمكوّن لأنه لا يوجد effect سابق لتنظيفه.
    return () => {
      console.log("Cleaning up timer");
      clearTimeout(timer);
    };
  }, [onConfirm]);
  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  );
}
