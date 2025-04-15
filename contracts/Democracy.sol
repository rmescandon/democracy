// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.28;

import "./Ownable.sol";
import "hardhat/console.sol";

/**
 * @title Democracy
 */
contract Democracy is Ownable {
    enum Choice {
        Abstain,
        Yes,
        No
    }

    struct DelegateVote {
        address delegate;
        bool voted;
        uint256 weight;
        Choice choice;
    }

    struct Proposal {
        bytes32 description;
        uint256 yesCount;
        uint256 noCount;
        bool done;
        address[] voters;
        DelegateVote[] delegateVotes;
    }

    // holds the list of all the citizens. Only citizens in this list can vote. Every citizen has the right to one single vote
    address[] public citizens;

    // list of delegate addresses
    address[] public delegates;
    // percentage of representation of every delegate for the remaining votes
    mapping(address => uint256) public percentages;

    // holds the different proposals that can be voted
    Proposal[] public proposals;

    event ProposalCreated(uint256 proposalId, bytes32 description);
    event CitizenRegistered(address citizen);
    event DelegateRegistered(address delegate, uint256 percentage);
    event CitizenVoted(address citizen, uint256 proposalId, Choice choice);
    event CitizenDelegatedVote(address citizen, uint256 proposalId, address delegate);
    event DelegateVoted(address delegate, uint256 proposalId, Choice choice);

    // creates a new proposal
    function createProposal(bytes32 _description) external onlyOwner {
        Proposal memory p = Proposal(_description, 0, 0, false, new address[](0), new DelegateVote[](delegates.length));
        // initialize the delegate votes
        for (uint256 i = 0; i < delegates.length; i++) {
            p.delegateVotes[i] = DelegateVote(delegates[i], false, 0, Choice.Abstain);
        }
        proposals.push(p);
        emit ProposalCreated(proposals.length - 1, _description);
    }

    modifier isCitizen() {
        bool found = false;
        for (uint256 i = 0; i < citizens.length; i++) {
            if (citizens[i] == msg.sender) {
                found = true;
                break;
            }
        }
        require(found, "Citizen is not registered");
        _;
    }

    modifier isDelegate() {
        bool found = false;
        for (uint256 i = 0; i < delegates.length; i++) {
            if (delegates[i] == msg.sender) {
                found = true;
                break;
            }
        }
        require(found, "Delegate is not registered");
        _;
    }

    modifier citizenHasNotVoted(uint256 _proposalId) {
        require(!citizenHasVoted(msg.sender, _proposalId), "Citizen already voted");
        _;
    }

    function citizenHasVoted(address _citizen, uint256 _proposalId) public view returns (bool) {
        Proposal memory proposal = proposals[_proposalId];
        for (uint256 i = 0; i < proposal.voters.length; i++) {
            if (proposal.voters[i] == _citizen) {
                return true;
            }
        }
        return false;
    }

    modifier delegateHasNotVoted(uint256 _proposalId) {
        require(!delegateHasVoted(msg.sender, _proposalId), "Delegate already voted");
        _;
    }

    function delegateHasVoted(address _delegate, uint256 _proposalId) public view returns (bool) {
        DelegateVote memory dv = getDelegateVote(_proposalId, _delegate);
        return dv.voted;
    }

    modifier citizenNotRegistered(address _citizen) {
        require(!_isRegistered(_citizen, citizens), "Citizen already registered");
        _;
    }

    modifier delegateRegistered(address _delegate) {
        require(_isRegistered(_delegate, delegates), "Delegate not registered");
        _;
    }

    modifier delegateNotRegistered(address _delegate) {
        require(!_isRegistered(_delegate, delegates), "Delegate already registered");
        _;
    }

    function _isRegistered(address _addr, address[] memory _collection) internal pure returns (bool) {
        for (uint256 i = 0; i < _collection.length; i++) {
            if (_addr == _collection[i]) {
                return true;
            }
        }
        return false;
    }

    function getDelegateVote(uint256 _proposalId, address _delegate) public view returns (DelegateVote memory) {
        Proposal memory proposal = proposals[_proposalId];
        for (uint256 i = 0; i < proposal.delegateVotes.length; i++) {
            if (proposal.delegateVotes[i].delegate == _delegate) {
                return proposal.delegateVotes[i];
            }
        }
        revert("Delegate vote not found");
    }

    function _pointToDelegateVote(uint256 _proposalId, address _delegate) private view returns (DelegateVote storage) {
        Proposal storage proposal = proposals[_proposalId];
        for (uint256 i = 0; i < proposal.delegateVotes.length; i++) {
            if (proposal.delegateVotes[i].delegate == _delegate) {
                return proposal.delegateVotes[i];
            }
        }
        revert("Delegate vote not found");
    }

    function _increaseWeight(DelegateVote storage _vote, uint256 _weight) private {
        _vote.weight += _weight;
    }

    function registerCitizen(address _citizen) external onlyOwner citizenNotRegistered(_citizen) {
        citizens.push(_citizen);
        emit CitizenRegistered(_citizen);
    }

    function registerDelegate(
        address _delegate,
        uint256 _percentage
    ) external onlyOwner delegateNotRegistered(_delegate) {
        delegates.push(_delegate);
        percentages[_delegate] = _percentage;
        emit DelegateRegistered(_delegate, _percentage);
    }

    function voteAsDelegate(uint256 _proposalId, Choice _choice) external isDelegate delegateHasNotVoted(_proposalId) {
        DelegateVote storage vote = _pointToDelegateVote(_proposalId, msg.sender);
        require(vote.voted == false, "The delegate already voted");
        vote.voted = true;
        vote.weight = 0;
        vote.choice = _choice;
        emit DelegateVoted(msg.sender, _proposalId, _choice);
    }

    function voteAsCitizen(uint256 _proposalId, Choice _choice) external isCitizen citizenHasNotVoted(_proposalId) {
        Proposal storage proposal = proposals[_proposalId];

        // register vote
        if (_choice == Choice.Yes) {
            proposal.yesCount += 1;
        } else if (_choice == Choice.No) {
            proposal.noCount += 1;
        }

        // register voter
        proposal.voters.push(msg.sender);
        emit CitizenVoted(msg.sender, _proposalId, _choice);
    }

    function delegateVote(
        uint256 _proposalId,
        address _delegate
    ) external isCitizen delegateRegistered(_delegate) citizenHasNotVoted(_proposalId) {
        DelegateVote storage dv = _pointToDelegateVote(_proposalId, _delegate);
        dv.weight += 1;
        proposals[_proposalId].voters.push(msg.sender);
        emit CitizenDelegatedVote(msg.sender, _proposalId, _delegate);
    }

    // Function to sort an array of unsigned integers using insertion sort
    function sortDelegates() public view returns (address[] memory) {
        address[] memory arr = new address[](delegates.length);
        uint256 len = arr.length;
        for (uint256 i = 1; i < len; i++) {
            address delegateI = delegates[i];
            uint256 percentageI = percentages[delegateI];
            uint256 j = i - 1;

            // Move elements of arr[0..i-1], that are greater than key,
            // to one position ahead of their current position
            while (j >= 0 && percentages[arr[j]] > percentageI) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = delegateI;
        }
        return arr;
    }

    function _distributeDelegations(uint256 _proposalId) private {
        Proposal storage proposal = proposals[_proposalId];
        uint256 remainingVotes = citizens.length - proposal.voters.length;
        if (remainingVotes > 0) {
            for (uint256 i = 0; i < delegates.length; i++) {
                address delegate = delegates[i];
                uint256 percentage = percentages[delegate];
                uint256 votes = ((percentage * remainingVotes) / 100);

                // increase the weight of the delegate vote in the assignation
                DelegateVote storage dv = _pointToDelegateVote(_proposalId, delegate);
                _increaseWeight(dv, votes);
                remainingVotes -= votes;
            }
        }

        address[] memory sortedDelegates = sortDelegates();
        // after a first distribution could happen that there are still remaining votes.
        // They are distributed one by one from higher to lower percentage
        for (uint i = 0; i < sortedDelegates.length; i++) {
            if (remainingVotes > 0) {
                DelegateVote storage dv = _pointToDelegateVote(_proposalId, sortedDelegates[i]);
                _increaseWeight(dv, 1);
                remainingVotes -= 1;
            }
        }

        // finally, increment the votes in the proposal as per delegate choice
        for (uint i = 0; i < sortedDelegates.length; i++) {
            DelegateVote memory dv = getDelegateVote(_proposalId, sortedDelegates[i]);
            if (dv.choice == Choice.Yes) {
                proposal.yesCount += 1;
            } else if (dv.choice == Choice.No) {
                proposal.noCount += 1;
            }
        }
    }
}
