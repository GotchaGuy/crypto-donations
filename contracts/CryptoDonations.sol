//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Administrator have the ability to create new campaigns. Each campaign have its name, description, time goal & money raised goal.
// This version of a platform accepts only donations in chain's native coin.
// Deploy smart contract to testnet of your choice (Rinkeby, Ropsten, Kovan, Goerli) and verify it on Etherscan.

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract CryptoDonations is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _campaignId;

    struct Campaign {
        uint256 timeGoal;
        uint256 moneyRaisedGoal;
        string title;
        string description;
    }

    bool internal locked;

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => uint256) private campaignSums;


    event CampaignCreated(uint256 campaignId);
    event CampaignChanged(uint256 campaignId);
    event CampaignGoalMet(uint256 campaignId);
    event Contribution(uint256 indexed campaignId, uint256 indexed amount, address indexed contributor);
    event WithdrawStatus(bool sent, uint256 amount, uint256 campaignId);

    error noFundsSet();
    error invalidTimeGoal();
    error emptyTitle();
    error invalidCampaign();
    error campaignIsInactive();
    error campaignIsActive();
    error withdrawAmountTooHigh();
    error reentrancyAttempt();

    modifier validFunds(uint256 _funds) {
        if(_funds == 0) {
            revert noFundsSet();
        }
        _;
    }

    modifier validTimeGoal(uint256 _timeGoal) {
        if(_timeGoal <= block.timestamp) {
            revert invalidTimeGoal();
        }
        _;
    }

    modifier validTitle(string calldata _title) {
        if(keccak256(abi.encodePacked(_title)) == keccak256(abi.encodePacked(""))) {
            revert emptyTitle();
        }
        _;
    }

    modifier validCampaign(uint256 _id) {
        if(campaigns[_id].timeGoal == 0) {
            revert invalidCampaign();
        }
        _;
    }

    modifier activeCampaign(uint256 _id) {
        if(campaigns[_id].timeGoal <= block.timestamp) {
            revert campaignIsInactive();
        }
        _;
    }

    modifier inactiveCampaign(uint256 _id) {
        if(campaigns[_id].timeGoal > block.timestamp) {
            revert campaignIsActive();
        }
        _;
    }

    modifier noReentrant() {
        if (locked) {
            revert reentrancyAttempt();
        }
        // require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    function getCampaignSum(uint256 campaignId) public view validCampaign(campaignId) returns(uint256){
       return campaignSums[campaignId];
    }

    function createCampaign(
        uint256 _timeGoal,
        uint256 _moneyRaisedGoal,
        string calldata _title,
        string calldata _description
    ) external onlyOwner validFunds(_moneyRaisedGoal) validTimeGoal(_timeGoal) validTitle(_title) {
        uint256 campaignId = _campaignId.current();
        campaigns[campaignId] = Campaign(_timeGoal, _moneyRaisedGoal, _title, _description);

        emit CampaignCreated(campaignId);

        _campaignId.increment();
    }

    function changeCampaign(
        uint256 campaignId,
        uint256 _timeGoal,
        uint256 _moneyRaisedGoal,
        string calldata _title,
        string calldata _description
    ) external onlyOwner validCampaign(campaignId) validFunds(_moneyRaisedGoal) validTimeGoal(_timeGoal) validTitle(_title) {
        campaigns[campaignId] = Campaign(_timeGoal, _moneyRaisedGoal, _title, _description);

        emit CampaignChanged(campaignId);

    }

    function donate(uint256 campaignId) external payable validFunds(msg.value) validCampaign(campaignId) activeCampaign(campaignId) {
        campaignSums[campaignId] += msg.value;

        emit Contribution(campaignId, msg.value, msg.sender);

        if(campaignSums[campaignId] >= campaigns[campaignId].moneyRaisedGoal) {
            emit CampaignGoalMet(campaignId);
        }
    }

    function withdraw(uint256 campaignId, address payable _to, uint256 _amount) external payable onlyOwner validCampaign(campaignId) inactiveCampaign(campaignId) noReentrant{
        uint256 sum = campaignSums[campaignId];
        if(_amount > sum) {
            revert withdrawAmountTooHigh();
        }

        (bool sent, ) = _to.call{value: _amount}("");

        if(sent){
            campaignSums[campaignId] -= _amount;
        }
        emit WithdrawStatus(sent, _amount, campaignId);
    }

}
