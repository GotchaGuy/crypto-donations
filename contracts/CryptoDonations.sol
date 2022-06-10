//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "./DNPT.sol";

interface IDNPT {
        function mintToken(address recipient) external returns(bool minted);
}

interface ICryptoDonations {

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

    /**     
     * @dev Emitted when a campaign is created.     
     */
    event CampaignCreated(uint256 campaignId);

    /**     
     * @dev Emitted when a campaign is changed.     
     */
    event CampaignChanged(uint256 campaignId);

    /**     
     * @dev Emitted when a campaign's goal is met with enough funds or more.     
     */
    event CampaignGoalMet(uint256 campaignId);

    /**     
     * @dev Emitted when anyone donates.     
     */
    event Contribution(uint256 indexed campaignId, uint256 indexed amount, address indexed contributor, bool nftMinted);
    
    /**     
     * @dev Emitted when admin withdraws specific amount of funds from a campaign.     
     */
    event WithdrawStatus(bool sent, uint256 amount, uint256 campaignId);

    /**     
     * @dev Emitted when contract receives ownership of whitelisted Gift NFT.     
     */
    // event NFTReceived(address operator, address from, uint256 tokenId, bytes data);

    /**     
     * @dev Emitted when a admin sets NFT contract address.    
     */
    event setGiftNFT(address giftNFTAddress);

    error InvalidAddress();
    error noFundsSet();
    error invalidTimeGoal();
    error emptyTitle();
    error invalidCampaign();
    error campaignIsInactive();
    error campaignIsActive();
    error withdrawAmountTooHigh();
    error reentrancyAttempt();

    function setGiftNFTAddress(address _address) external;

    function getCampaignSum(uint256 campaignId) external view returns(uint256 sum);

    function createCampaign(
        uint256 _timeGoal,
        uint256 _moneyRaisedGoal,
        string calldata _title,
        string calldata _description
    ) external;

    function changeCampaign(
        uint256 campaignId,
        uint256 _timeGoal,
        uint256 _moneyRaisedGoal,
        string calldata _title,
        string calldata _description
    ) external;

    function donate(uint256 campaignId) external payable;

    function withdraw(uint256 campaignId, address payable _to, uint256 _amount) external payable;
}


/// @title A Crypto Donations contract
/// @notice A Smart Contract for donating crypto assets to a specific campaign
/// @dev Might need , IERC721Receiver for that other approach
contract CryptoDonations is Ownable, ICryptoDonations {
    using Counters for Counters.Counter;
    Counters.Counter private _campaignId;

/// @notice boolean for stopping reentrancy during withdrawal
    bool internal locked;

/// @dev whitelisted NFT contract address
    // address public whitelistedNftContract;

    // DNPT public giftNFTContract;
    address public giftNFT;

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => uint256) private campaignSums;

/// @notice via campaign ID and contributor address, amount contributed to a specific campaign from a specific user can be obtained
    mapping(uint256 => mapping(address => uint256)) private campaignContributions;
  

    modifier validAddress(address _address) {
        if (_address == address(0)) {
            revert InvalidAddress();
        }
        _;
    }

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
        locked = true;
        _;
        locked = false;
    }

    /// @dev Admin can change address of nft contract that will be providing gift nfts.
    // function changeWhitelistedNFT(address _nftContract) external override onlyOwner {
    //     whitelistedNftContract = _nftContract;
    // }

    function setGiftNFTAddress(address _address) public override onlyOwner validAddress(_address) {
        giftNFT = _address;
        emit setGiftNFT(_address);
    }

    /// @notice Returns current available raised funds for a specific campaign.
    /// @param campaignId ID of the campaign whose sumtotal raised amount (or leftover balance amount on the contract) you want to see
    /// @return sum sumtotal raised amount of funds for a campaign (or leftover balance amount on the contract)
    function getCampaignSum(uint256 campaignId) public view override validCampaign(campaignId) returns(uint256 sum){
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
    ) external override onlyOwner validFunds(_moneyRaisedGoal) validTimeGoal(_timeGoal) validTitle(_title) {
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
    ) external override onlyOwner validCampaign(campaignId) validFunds(_moneyRaisedGoal) validTimeGoal(_timeGoal) validTitle(_title) {
        campaigns[campaignId] = Campaign(_timeGoal, _moneyRaisedGoal, _title, _description);

        emit CampaignChanged(campaignId);

    }

    /// @notice Anyone can donate ETH to an active campaign
    /// @param campaignId ID of campaign intended to receive sent ETH
    function donate(uint256 campaignId) external payable override validFunds(msg.value) validCampaign(campaignId) activeCampaign(campaignId) {
        campaignSums[campaignId] += msg.value;
        bool minted;
        if(campaignContributions[campaignId][msg.sender] == 0) {
        //    minted = giftNFTContract.mintToken(msg.sender);
        minted = IDNPT(giftNFT).mintToken(msg.sender);
        }

        campaignContributions[campaignId][msg.sender] += msg.value;

        emit Contribution(campaignId, msg.value, msg.sender, minted);

        // razmisljam se ovde da dodam jedan bool koji ce biti true ako se opali goalmet event - da se ne bi opalio event svaku put kad se doda suma koja opet prelazi cilj
        if(campaignSums[campaignId] >= campaigns[campaignId].moneyRaisedGoal) {
            emit CampaignGoalMet(campaignId);
        }
    }

    /// @notice Admin can withdraw any amount raised from a campaign and send it to another address
    /// @param campaignId ID of campaign intended to withdraw ETH from
    /// @param _to address intended to receive funds
    /// @param _amount amount of ETH to withdraw
    function withdraw(uint256 campaignId, address payable _to, uint256 _amount) external payable override onlyOwner validCampaign(campaignId) inactiveCampaign(campaignId) validAddress(_to) noReentrant{
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
