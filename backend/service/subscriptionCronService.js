"use strict";

const { scheduleDailyTask } = require("../utils/cron");
const { getSubscriptionContract } = require("../utils/blockchain");

/**
 * Starts a cron job that runs once per day and ensures the subscription
 * contract is ready for whatever processing logic consumers want to add.
 * Returns a cancel function so callers can stop the cron when needed.
 */
function startSubscriptionCron(options = {}) {
  return scheduleDailyTask(async () => {
    const subscriptionContract = getSubscriptionContract();

    // Placeholder for whatever periodic work is needed with the contract.
    console.info(
      "[service] Subscription cron executed for contract:",
      subscriptionContract.address
    );
  }, options);
}

module.exports = {
  startSubscriptionCron,
};

if (require.main === module) {
  console.info("[service] Starting subscription cron service...");
  startSubscriptionCron();
}
