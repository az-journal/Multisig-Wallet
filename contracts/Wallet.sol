pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;


contract Wallet{
    
    address[]public approvers;
    uint public quorum;
    
    struct Transfer{
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
    }
    
   Transfer[] public transfers;
    mapping (address =>mapping(uint=>bool)) public approvals;
    
    constructor(address[]memory _approvers, uint _quorum) {
        approvers=_approvers;
        quorum = _quorum;
    }
    
    modifier onlyApprover(){
        bool allowed = false;
        for (uint i=0;i<approvers.length; i++){
            if(approvers[i] == msg.sender){
                allowed == true;
            }
        }
        require(allowed =true, 'only Approver allowed');
        _;
    }

function getApprovers() external view returns (address[]memory){
    return approvers;
}

function createTransfer(uint amount, address payable to) external onlyApprover{
    transfers.push(Transfer(
      transfers.length,
      amount,
      to,
      0,
      false)
      );
}
 function getTransfers() external view returns (Transfer[]memory){
    return transfers;
}
function approveTransfer(uint id) external onlyApprover{
    require(transfers[id].sent == false, 'transfer has already been sent');
    require (approvals[msg.sender][id] ==false);
    
    approvals [msg.sender][id] = true;
    transfers[id].approvals ++;
    
    if(transfers[id].approvals >= quorum){
        transfers[id].sent == true;
        address payable to = transfers[id].to;
        uint amount = transfers[id].amount;
        to.transfer(amount);
    }
}

 receive() external payable{} 
    
}


