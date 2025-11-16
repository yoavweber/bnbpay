"use strict";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Schedules a callback to run once per day at a specific time (default midnight).
 * Returns a cancel function to stop the recurring task.
 *
 * @param {() => void | Promise<void>} callback - Logic to execute once per day.
 * @param {{ atHour?: number, atMinute?: number, atSecond?: number }} [options]
 */
function scheduleDailyTask(callback, options = {}) {
  const { atHour = 0, atMinute = 0, atSecond = 0 } = options;

  const computeDelayUntilNextRun = () => {
    const now = new Date();
    const next = new Date(now);
    next.setHours(atHour, atMinute, atSecond, 0);
    if (next <= now) {
      next.setTime(next.getTime() + DAY_IN_MS);
    }
    return next.getTime() - now.getTime();
  };

  let timeoutId;

  const runTask = async () => {
    try {
      await callback();
    } catch (error) {
      console.error("[cron] Daily task failed:", error);
    } finally {
      timeoutId = setTimeout(runTask, DAY_IN_MS);
    }
  };

  timeoutId = setTimeout(runTask, computeDelayUntilNextRun());

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}

module.exports = {
  scheduleDailyTask,
};
