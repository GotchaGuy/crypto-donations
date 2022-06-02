//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title A Crypto Donations contract
/// @notice A Smart Contract for donating crypto assets to a specific campaign

contract CryptoDonations is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _campaignId;

/// @notice Campaign struct containing raising deadline, raising goal, its title, and description
/// @param timeGoal campaign's deadline to raise moneyRaisedGoal
/// @param moneyRaisedGoal campaign's aimed amount of money to raise until timeGoal
/// @param title campaign title
/// @param description description of campaign and its purpose
    struct Campaign {
        uint256 timeGoal;
        uint256 moneyRaisedGoal;
        string title;
        string description;
    }

/// @notice boolean for stopping reentrancy during withdrawal
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

    /// @notice Returns current available raised funds for a specific campaign
    function getCampaignSum(uint256 campaignId) public view validCampaign(campaignId) returns(uint256 sum){
       return campaignSums[campaignId];
    }

    /// @notice SC Admin can create campaign structs
    /// @param _timeGoal campaign's deadline to raise moneyRaisedGoal
    /// @param _moneyRaisedGoal campaign's aimed amount of money to raise until timeGoal
    /// @param _title campaign title
    /// @param _description description of campaign and its purpose
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

    /// @notice SC Admin can change any campaign struct
    /// @param campaignId ID of campaign intended to be changed
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

    /// @notice Anyone can donate ETH to an active campaign
    /// @param campaignId ID of campaign intended to receive sent ETH
    function donate(uint256 campaignId) external payable validFunds(msg.value) validCampaign(campaignId) activeCampaign(campaignId) {
        campaignSums[campaignId] += msg.value;

        emit Contribution(campaignId, msg.value, msg.sender);

        if(campaignSums[campaignId] >= campaigns[campaignId].moneyRaisedGoal) {
            emit CampaignGoalMet(campaignId);
        }
    }

    /// @notice Admin can withdraw any amount raised from a campaign and send it to another address
    /// @param campaignId ID of campaign intended to withdraw ETH from
    /// @param _to address intended to receive funds
    /// @param _amount amount of ETH to withdraw
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
