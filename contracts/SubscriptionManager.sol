// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IERC20.sol";

/**
 * @title SubscriptionManager
 * @dev Manage recurring subscriptions with automatic payment processing
 * @notice Enables Patreon-style subscriptions on BNB Chain
 */
contract SubscriptionManager {
    
    // ========================================
    // STRUCTS
    // ========================================
    
    struct Subscription {
        bytes32 id;                     // Unique subscription ID
        address subscriber;             // Who's paying
        address recipient;              // Who's receiving
        uint256 amountPerPeriod;       // Amount per payment cycle
        uint256 intervalSeconds;        // Payment interval (e.g., 2,592,000 = 30 days)
        address token;                  // Payment token (address(0) for BNB)
        uint256 startTimestamp;         // When subscription started
        uint256 lastPaymentTimestamp;   // When last payment was made
        uint256 nextPaymentTimestamp;   // When next payment is due
        uint256 totalPaymentsMade;      // Number of payments made so far
        bool active;                    // Is subscription active?
    }
    
    // ========================================
    // STATE VARIABLES
    // ========================================
    
    mapping(bytes32 => Subscription) public subscriptions;
    mapping(address => bytes32[]) public userSubscriptions;          // Subscriptions user is paying for
    mapping(address => bytes32[]) public recipientSubscriptions;     // Subscriptions paying to recipient
    
    uint256 public totalSubscriptions;
    uint256 public totalActiveSubscriptions;
    
    address public owner;
    uint256 public feePercentage;  // Fee in basis points (50 = 0.5%)
    uint256 public constant MAX_FEE = 500;  // Max 5%
    uint256 public constant MIN_INTERVAL = 86400;  // Min 1 day
    uint256 public constant MAX_INTERVAL = 31536000;  // Max 1 year
    
    // ========================================
    // EVENTS
    // ========================================
    
    event SubscriptionCreated(
        bytes32 indexed subscriptionId,
        address indexed subscriber,
        address indexed recipient,
        uint256 amountPerPeriod,
        uint256 intervalSeconds,
        address token,
        uint256 timestamp
    );
    
    event SubscriptionPaymentProcessed(
        bytes32 indexed subscriptionId,
        address indexed subscriber,
        address indexed recipient,
        uint256 amount,
        uint256 paymentNumber,
        uint256 timestamp
    );
    
    event SubscriptionCancelled(
        bytes32 indexed subscriptionId,
        address indexed cancelledBy,
        uint256 timestamp
    );
    
    event SubscriptionUpdated(
        bytes32 indexed subscriptionId,
        uint256 newAmount,
        uint256 timestamp
    );
    
    // ========================================
    // MODIFIERS
    // ========================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyActiveSubscription(bytes32 subId) {
        require(subscriptions[subId].active, "Subscription not active");
        _;
    }
    
    // ========================================
    // CONSTRUCTOR
    // ========================================
    
    constructor() {
        owner = msg.sender;
        feePercentage = 50;  // 0.5% default
        totalSubscriptions = 0;
        totalActiveSubscriptions = 0;
    }
    
    // ========================================
    // SUBSCRIPTION FUNCTIONS
    // ========================================
    
    /**
     * @dev Create new subscription with initial payment
     * @param recipient Address receiving subscription payments
     * @param amountPerPeriod Amount to pay each period
     * @param intervalDays Payment interval in days (e.g., 30 for monthly)
     * @param token Token address (address(0) for BNB)
     * @return subscriptionId Unique subscription identifier
     */
    function createSubscription(
        address recipient,
        uint256 amountPerPeriod,
        uint256 intervalDays,
        address token
    ) external payable returns (bytes32) {
        require(amountPerPeriod > 0, "Amount must be > 0");
        require(recipient != address(0), "Invalid recipient");
        require(recipient != msg.sender, "Cannot subscribe to yourself");
        require(intervalDays >= 1 && intervalDays <= 365, "Invalid interval");
        
        uint256 intervalSeconds = intervalDays * 86400;
        require(intervalSeconds >= MIN_INTERVAL && intervalSeconds <= MAX_INTERVAL, "Invalid interval");
        
        // For native BNB subscriptions
        if (token == address(0)) {
            require(msg.value == amountPerPeriod, "Incorrect payment amount");
        } else {
            // For token subscriptions, check allowance
            IERC20 tokenContract = IERC20(token);
            uint256 allowance = tokenContract.allowance(msg.sender, address(this));
            require(allowance >= amountPerPeriod, "Insufficient token allowance");
            
            // Check balance
            uint256 balance = tokenContract.balanceOf(msg.sender);
            require(balance >= amountPerPeriod, "Insufficient token balance");
        }
        
        // Generate unique subscription ID
        bytes32 subId = keccak256(
            abi.encodePacked(
                msg.sender,
                recipient,
                amountPerPeriod,
                intervalSeconds,
                block.timestamp,
                totalSubscriptions
            )
        );
        
        // Calculate timestamps
        uint256 now_ = block.timestamp;
        uint256 nextPayment = now_ + intervalSeconds;
        
        // Create subscription
        subscriptions[subId] = Subscription({
            id: subId,
            subscriber: msg.sender,
            recipient: recipient,
            amountPerPeriod: amountPerPeriod,
            intervalSeconds: intervalSeconds,
            token: token,
            startTimestamp: now_,
            lastPaymentTimestamp: now_,
            nextPaymentTimestamp: nextPayment,
            totalPaymentsMade: 0,
            active: true
        });
        
        // Track subscriptions
        userSubscriptions[msg.sender].push(subId);
        recipientSubscriptions[recipient].push(subId);
        
        // Process first payment
        _processPayment(subId);
        
        // Update counters
        totalSubscriptions++;
        totalActiveSubscriptions++;
        
        emit SubscriptionCreated(
            subId,
            msg.sender,
            recipient,
            amountPerPeriod,
            intervalSeconds,
            token,
            now_
        );
        
        return subId;
    }
    
    /**
     * @dev Process recurring subscription payment
     * @param subId Subscription ID
     */
    function processSubscriptionPayment(bytes32 subId) 
        external 
        onlyActiveSubscription(subId) 
    {
        Subscription storage sub = subscriptions[subId];
        
        require(block.timestamp >= sub.nextPaymentTimestamp, "Payment not due yet");
        
        // Process payment
        _processPayment(subId);
    }
    
    /**
     * @dev Internal function to process payment
     */
    function _processPayment(bytes32 subId) internal {
        Subscription storage sub = subscriptions[subId];
        
        uint256 fee = (sub.amountPerPeriod * feePercentage) / 10000;
        uint256 amountAfterFee = sub.amountPerPeriod - fee;
        
        if (sub.token == address(0)) {
            // Native BNB payment
            require(address(this).balance >= sub.amountPerPeriod || msg.value >= sub.amountPerPeriod, "Insufficient balance");
            
            (bool success, ) = payable(sub.recipient).call{value: amountAfterFee}("");
            require(success, "Transfer failed");
            
        } else {
            // Token payment
            IERC20 tokenContract = IERC20(sub.token);
            
            // Transfer to recipient
            require(
                tokenContract.transferFrom(sub.subscriber, sub.recipient, amountAfterFee),
                "Token transfer failed"
            );
            
            // Transfer fee to owner
            if (fee > 0) {
                require(
                    tokenContract.transferFrom(sub.subscriber, owner, fee),
                    "Fee transfer failed"
                );
            }
        }
        
        // Update subscription
        sub.lastPaymentTimestamp = block.timestamp;
        sub.nextPaymentTimestamp = block.timestamp + sub.intervalSeconds;
        sub.totalPaymentsMade++;
        
        emit SubscriptionPaymentProcessed(
            subId,
            sub.subscriber,
            sub.recipient,
            sub.amountPerPeriod,
            sub.totalPaymentsMade,
            block.timestamp
        );
    }
    
    /**
     * @dev Cancel subscription
     * @param subId Subscription ID
     */
    function cancelSubscription(bytes32 subId) external onlyActiveSubscription(subId) {
        Subscription storage sub = subscriptions[subId];
        
        require(
            msg.sender == sub.subscriber || msg.sender == sub.recipient || msg.sender == owner,
            "Not authorized to cancel"
        );
        
        sub.active = false;
        totalActiveSubscriptions--;
        
        emit SubscriptionCancelled(subId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Update subscription amount (only recipient can update)
     * @param subId Subscription ID
     * @param newAmount New amount per period
     */
    function updateSubscriptionAmount(bytes32 subId, uint256 newAmount) 
        external 
        onlyActiveSubscription(subId) 
    {
        Subscription storage sub = subscriptions[subId];
        require(msg.sender == sub.recipient, "Only recipient can update amount");
        require(newAmount > 0, "Amount must be > 0");
        
        sub.amountPerPeriod = newAmount;
        
        emit SubscriptionUpdated(subId, newAmount, block.timestamp);
    }
    
    // ========================================
    // QUERY FUNCTIONS
    // ========================================
    
    /**
     * @dev Get subscription details
     */
    function getSubscription(bytes32 subId) 
        external 
        view 
        returns (Subscription memory) 
    {
        return subscriptions[subId];
    }
    
    /**
     * @dev Get all subscriptions for a user (subscriber)
     */
    function getUserSubscriptions(address user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userSubscriptions[user];
    }
    
    /**
     * @dev Get all subscriptions paying to recipient
     */
    function getRecipientSubscriptions(address recipient) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return recipientSubscriptions[recipient];
    }
    
    /**
     * @dev Check if subscription payment is due
     */
    function isPaymentDue(bytes32 subId) external view returns (bool) {
        Subscription memory sub = subscriptions[subId];
        return sub.active && block.timestamp >= sub.nextPaymentTimestamp;
    }
    
    /**
     * @dev Get next payment timestamp
     */
    function getNextPaymentTime(bytes32 subId) external view returns (uint256) {
        return subscriptions[subId].nextPaymentTimestamp;
    }
    
    /**
     * @dev Calculate MRR (Monthly Recurring Revenue) for recipient
     */
    function calculateMRR(address recipient) external view returns (uint256) {
        bytes32[] memory subs = recipientSubscriptions[recipient];
        uint256 mrr = 0;
        
        for (uint256 i = 0; i < subs.length; i++) {
            Subscription memory sub = subscriptions[subs[i]];
            if (sub.active) {
                // Convert to monthly amount (30 days)
                uint256 monthlyAmount = (sub.amountPerPeriod * 2592000) / sub.intervalSeconds;
                mrr += monthlyAmount;
            }
        }
        
        return mrr;
    }
    
    /**
     * @dev Get active subscriber count for recipient
     */
    function getActiveSubscriberCount(address recipient) external view returns (uint256) {
        bytes32[] memory subs = recipientSubscriptions[recipient];
        uint256 count = 0;
        
        for (uint256 i = 0; i < subs.length; i++) {
            if (subscriptions[subs[i]].active) {
                count++;
            }
        }
        
        return count;
    }
    
    // ========================================
    // ADMIN FUNCTIONS
    // ========================================
    
    /**
     * @dev Update fee percentage
     */
    function updateFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_FEE, "Fee too high");
        feePercentage = newFee;
    }
    
    /**
     * @dev Withdraw collected fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
    
    // Fallback to receive BNB
    receive() external payable {}
}
