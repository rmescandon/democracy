# Democracy

This project uses HardHat to create an smart contract that allow accounts to vote for proposals using direct vote, delegating to a designee or simply leave the voting option for any delegate to take it.

The general rules of the contract are:

- there are two kind of actors in the contract: citizens and delegates
- every citizen or delegate is identified by an account address
- every citizen has the right to vote
- every citizen can vote once and the weight of their vote is 1
- every citizen can delegate their vote to a designee
- every citizen can simply not vote or delegate
- there is a list of proposals a voter can vote
- there is a closed list of delegates
- every delegate has a percentage of share valid for all proposals
- every delegate can vote once for every proposal
- the weight of the delegate vote is zero in origin
- every voter delegating in a certain delegate increases the weigth of such delegate voting weight in 1
- every citizen or delegate can choose, when voting, one of these: yes, no, abstain
- the choose of the citizens is not known
- the choose of the delegates is known
- only the owner of the contract can register delegates
- only the owner of the contract can register citizens
- the proposals have a due date. Once such date is reached, the owner of the contract closes the votation
- as part of the votation closing process, the votes not used by the citizens are distributed amongst the delegates proportionally as their share percentages until expiring all remaining votes
