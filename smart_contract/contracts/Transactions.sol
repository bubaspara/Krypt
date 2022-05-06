// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCount;

    event Transfer(
        address from,
        address to,
        uint256 amount,
        string message,
        uint256 timestamp,
        string keyword
    );

    struct TransferStruct {
        address sender;
        address receiver;
        string keyword;
        string message;
        uint256 amount;
        uint256 timestamp;
    }

    TransferStruct[] transactions;

    /// @dev adds transaction to blockchain
    function addToBlockchain(
        address payable receiver,
        uint256 amount,
        string memory message,
        string memory keyword
    ) public {
        transactionCount++;
        transactions.push(
            TransferStruct(
                msg.sender,
                receiver,
                keyword,
                message,
                amount,
                block.timestamp
            )
        );
        emit Transfer(
            msg.sender,
            receiver,
            amount,
            message,
            block.timestamp,
            keyword
        );
    }

    /// @dev returns transactions
    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transactions;
    }

    /// @dev reutrn transaction count
    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
