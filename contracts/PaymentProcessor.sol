// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IERC20.sol";

/**
 * @title PaymentProcessor
 * @dev Process payments in native BNB and ERC-20 tokens
 * @notice Core payment processor for BNBPay platform
 */
contract PaymentProcessor {
    
    // ========================================
    // STRUCTS
    // ========================================
    
    struct Payment {
        address from;           // Sender address
        address to;             // Recipient address
        uint256 amount;         // Payment amount
        address token;          // Token address (address(0) for native BNB)
        string label;           // Payment description
        string memo;            // Additional notes
        uint256 timestamp;      // When payment was made
        bool processed;         // Payment status
    }
    
    // ========================================
    // STATE VARIABLES
    // ========================================
    
    mapping(bytes32 => Payment) public payments;
    mapping(address => bytes32[]) public userPayments;           // Payments sent by user
    mapping(address => bytes32[]) public userReceivedPayments;   // Payments received by user
    
    uint256 public totalPaymentsProcessed;
    uint256 public totalVolumeProcessed;  // Total value processed (in wei)
    
    address public owner;
    uint256 public feePercentage;  // Fee in basis points (50 = 0.5%)
    uint256 public constant MAX_FEE = 500;  // Max 5% fee
    
    // ========================================
    // EVENTS
    // ========================================
    
    event PaymentProcessed(
        bytes32 indexed paymentId,
        address indexed from,
        address indexed to,
        uint256 amount,
        address token,
        string label,
        uint256 timestamp
    );
    
    event TokenPaymentProcessed(
        bytes32 indexed paymentId,
        address indexed from,
        address indexed to,
        uint256 amount,
        address token,
        string label,
        uint256 timestamp
    );
    
    event FeeUpdated(uint256 oldFee, uint256 newFee);
    
    // ========================================
    // MODIFIERS
    // ========================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    // ========================================
    // CONSTRUCTOR
    // ========================================
    
    constructor() {
        owner = msg.sender;
        feePercentage = 50;  // 0.5% default fee
        totalPaymentsProcessed = 0;
        totalVolumeProcessed = 0;
    }
    
    // ========================================
    // PAYMENT FUNCTIONS
    // ========================================
    
    /**
     * @dev Process native BNB payment
     * @param to Recipient address
     * @param label Payment description
     * @param memo Additional notes
     * @return paymentId Unique payment identifier
     */
    function processPayment(
        address payable to,
        string memory label,
        string memory memo
    ) external payable returns (bytes32) {
        require(msg.value > 0, "Amount must be greater than 0");
        require(to != address(0), "Invalid recipient address");
        require(to != msg.sender, "Cannot send to yourself");
        
        // Calculate fee
        uint256 fee = (msg.value * feePercentage) / 10000;
        uint256 amountAfterFee = msg.value - fee;
        
        // Generate unique payment ID
        bytes32 paymentId = keccak256(
            abi.encodePacked(
                msg.sender,
                to,
                msg.value,
                block.timestamp,
                totalPaymentsProcessed
            )
        );
        
        // Store payment details
        payments[paymentId] = Payment({
            from: msg.sender,
            to: to,
            amount: msg.value,
            token: address(0),
            label: label,
            memo: memo,
            timestamp: block.timestamp,
            processed: true
        });
        
        // Track user payments
        userPayments[msg.sender].push(paymentId);
        userReceivedPayments[to].push(paymentId);
        
        // Transfer BNB to recipient
        (bool success, ) = to.call{value: amountAfterFee}("");
        require(success, "Transfer failed");
        
        // Update stats
        totalPaymentsProcessed++;
        totalVolumeProcessed += msg.value;
        
        emit PaymentProcessed(
            paymentId,
            msg.sender,
            to,
            msg.value,
            address(0),
            label,
            block.timestamp
        );
        
        return paymentId;
    }
    
    /**
     * @dev Process ERC-20 token payment
     * @param to Recipient address
     * @param token ERC-20 token address
     * @param amount Token amount to send
     * @param label Payment description
     * @param memo Additional notes
     * @return paymentId Unique payment identifier
     */
    function processTokenPayment(
        address to,
        address token,
        uint256 amount,
        string memory label,
        string memory memo
    ) external returns (bytes32) {
        require(amount > 0, "Amount must be greater than 0");
        require(to != address(0), "Invalid recipient address");
        require(token != address(0), "Invalid token address");
        require(to != msg.sender, "Cannot send to yourself");
        
        IERC20 tokenContract = IERC20(token);
        
        // Check allowance
        uint256 allowance = tokenContract.allowance(msg.sender, address(this));
        require(allowance >= amount, "Insufficient token allowance");
        
        // Check balance
        uint256 senderBalance = tokenContract.balanceOf(msg.sender);
        require(senderBalance >= amount, "Insufficient token balance");
        
        // Calculate fee
        uint256 fee = (amount * feePercentage) / 10000;
        uint256 amountAfterFee = amount - fee;
        
        // Generate unique payment ID
        bytes32 paymentId = keccak256(
            abi.encodePacked(
                msg.sender,
                to,
                amount,
                token,
                block.timestamp,
                totalPaymentsProcessed
            )
        );
        
        // Store payment details
        payments[paymentId] = Payment({
            from: msg.sender,
            to: to,
            amount: amount,
            token: token,
            label: label,
            memo: memo,
            timestamp: block.timestamp,
            processed: true
        });
        
        // Track user payments
        userPayments[msg.sender].push(paymentId);
        userReceivedPayments[to].push(paymentId);
        
        // Transfer tokens to recipient
        require(
            tokenContract.transferFrom(msg.sender, to, amountAfterFee),
            "Token transfer failed"
        );
        
        // Transfer fee to owner (if fee > 0)
        if (fee > 0) {
            require(
                tokenContract.transferFrom(msg.sender, owner, fee),
                "Fee transfer failed"
            );
        }
        
        // Update stats
        totalPaymentsProcessed++;
        
        emit TokenPaymentProcessed(
            paymentId,
            msg.sender,
            to,
            amount,
            token,
            label,
            block.timestamp
        );
        
        return paymentId;
    }
    
    // ========================================
    // QUERY FUNCTIONS
    // ========================================
    
    /**
     * @dev Get payment details by ID
     */
    function getPaymentDetails(bytes32 paymentId) 
        external 
        view 
        returns (Payment memory) 
    {
        require(payments[paymentId].timestamp > 0, "Payment does not exist");
        return payments[paymentId];
    }
    
    /**
     * @dev Get all payments sent by a user
     */
    function getUserPayments(address user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userPayments[user];
    }
    
    /**
     * @dev Get all payments received by a user
     */
    function getUserReceivedPayments(address user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userReceivedPayments[user];
    }
    
    /**
     * @dev Get total number of payments processed
     */
    function getTotalPayments() external view returns (uint256) {
        return totalPaymentsProcessed;
    }
    
    /**
     * @dev Get total volume processed (in wei)
     */
    function getTotalVolume() external view returns (uint256) {
        return totalVolumeProcessed;
    }
    
    // ========================================
    // ADMIN FUNCTIONS
    // ========================================
    
    /**
     * @dev Update fee percentage (only owner)
     * @param newFee New fee in basis points (50 = 0.5%)
     */
    function updateFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_FEE, "Fee too high");
        uint256 oldFee = feePercentage;
        feePercentage = newFee;
        emit FeeUpdated(oldFee, newFee);
    }
    
    /**
     * @dev Withdraw collected fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Transfer ownership (only owner)
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
    
    // Fallback to receive BNB
    receive() external payable {}
}
