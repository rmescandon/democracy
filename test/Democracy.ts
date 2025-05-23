import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { encodeBytes256String, decodeBytes256String } from "./utils";

let deployContract = async () => {
  const [owner, addr1, addr2] = await ethers.getSigners();
  const Democracy = await ethers.getContractFactory("Democracy");
  const democracy = await Democracy.deploy();
  return { democracy, owner, addr1, addr2 };
};

describe("Democracy ownership", () => {
  it("Should set the right owner", async () => {
    const { democracy, owner } = await loadFixture(deployContract);
    expect(await democracy.owner()).to.equal(owner.address);
  });
});

describe("Proposal creation", () => {
  it("Should create a proposal", async () => {
    const { democracy } = await loadFixture(deployContract);
    await expect(
      democracy.createProposal(
        ethers.encodeBytes32String("Proposal 1"),
        encodeBytes256String("Proposal 1 Description"),
      ),
    )
      .to.emit(democracy, "ProposalCreated")
      .withArgs(0, ethers.encodeBytes32String("Proposal 1"));
    expect(await democracy.proposalsCount()).to.equal(1);
    const [title, description, yesCount, noCount, done] = await democracy.getProposal(0);
    expect(ethers.decodeBytes32String(title)).to.equal("Proposal 1");
    expect(decodeBytes256String(description)).to.equal("Proposal 1 Description");
    expect(yesCount).to.equal(0);
    expect(noCount).to.equal(0);
    expect(done).to.equal(false);
  });

  it("Should not allow non-owners to create proposals", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await expect(
      democracy
        .connect(addr1)
        .createProposal(ethers.encodeBytes32String("Proposal 1"), encodeBytes256String("Proposal 1 Description")),
    ).to.be.revertedWith("Caller is not the owner");
  });

  it("Should allow deleting a proposal", async () => {
    const { democracy } = await loadFixture(deployContract);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    await expect(democracy.deleteProposal(0)).to.emit(democracy, "ProposalDeleted").withArgs(0);
    expect(await democracy.proposalsCount()).to.equal(0);
  });

  it("Should not allow deleting a non-existing proposal", async () => {
    const { democracy } = await loadFixture(deployContract);
    await expect(democracy.deleteProposal(0)).to.be.revertedWith("Proposal does not exist");
  });

  it("Should not allow deleting a proposal with votes", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    await democracy.registerCitizen(addr1.address);
    await democracy.connect(addr1).voteAsCitizen(0, 1);
    await expect(democracy.deleteProposal(0)).to.be.revertedWith("Proposal already voted");
  });
});

describe("Register citizens", () => {
  it("Should register a citizen as a potential voter", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await expect(democracy.registerCitizen(addr1.address))
      .to.emit(democracy, "CitizenRegistered")
      .withArgs(addr1.address);
  });

  it("Should not allow non-owners to register voters", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await expect(democracy.connect(addr1).registerCitizen(addr1.address)).to.be.revertedWith("Caller is not the owner");
  });

  it("Should not allow registering the same citizen twice", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await democracy.registerCitizen(addr1.address);
    await expect(democracy.registerCitizen(addr1.address)).to.be.revertedWith("Citizen already registered");
  });
});

describe("Register delegates", () => {
  it("Should register a delegate", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    let percentage = 50;
    await expect(democracy.registerDelegate(addr1.address, percentage))
      .to.emit(democracy, "DelegateRegistered")
      .withArgs(addr1.address, percentage);
    // Check if the delegate is registered with the correct percentage
    expect(await democracy.percentages(addr1.address)).to.equal(percentage);
    expect(await democracy.delegates(0)).to.equal(addr1.address);
  });

  it("Should not allow non-owners to register delegates", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    let percentage = 50;
    await expect(democracy.connect(addr1).registerDelegate(addr1.address, percentage)).to.be.revertedWith(
      "Caller is not the owner",
    );
  });

  it("Should not allow registering the same delegate twice", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    let percentage = 50;
    await democracy.registerDelegate(addr1.address, percentage);
    await expect(democracy.registerDelegate(addr1.address, percentage)).to.be.revertedWith(
      "Delegate already registered",
    );
  });

  it("Should not allow unregistering a non-registered delegate", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await expect(democracy.unregisterDelegate(addr1.address)).to.be.revertedWith("Delegate not registered");
  });

  it("Should unregister a delegate", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    let percentage = 50;
    await democracy.registerDelegate(addr1.address, percentage);
    await expect(democracy.unregisterDelegate(addr1.address))
      .to.emit(democracy, "DelegateUnregistered")
      .withArgs(addr1.address);
    // Check if the delegate is unregistered
    expect(await democracy.percentages(addr1.address)).to.equal(0);
  });

  it("Should not allow to unregister a delegate twice", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    let percentage = 50;
    await democracy.registerDelegate(addr1.address, percentage);
    await democracy.unregisterDelegate(addr1.address);
    await expect(democracy.unregisterDelegate(addr1.address)).to.be.revertedWith("Delegate not registered");
  });
});

describe("Voting process", () => {
  it("Should allow a citizen to vote", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await democracy.registerCitizen(addr1.address);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    await expect(democracy.connect(addr1).voteAsCitizen(0, 1))
      .to.emit(democracy, "CitizenVoted")
      .withArgs(addr1.address, 0, 1);

    await expect(democracy.citizenHasVoted(addr1.address, 0)).to.eventually.be.true;
  });

  it("Should allow a citizen to vote with yes", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await democracy.registerCitizen(addr1.address);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    let choiceYes = 1;
    await expect(democracy.connect(addr1).voteAsCitizen(0, choiceYes))
      .to.emit(democracy, "CitizenVoted")
      .withArgs(addr1.address, 0, choiceYes);
    await expect(democracy.citizenHasVoted(addr1.address, 0)).to.eventually.be.true;
    const [title, description, yesCount, noCount, done] = await democracy.getProposal(0);
    expect(yesCount).to.equal(1);
    expect(noCount).to.equal(0);
    expect(done).to.equal(false);
  });

  it("Should allow a citizen to vote with no", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await democracy.registerCitizen(addr1.address);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    let choiceNo = 2;
    await expect(democracy.connect(addr1).voteAsCitizen(0, choiceNo))
      .to.emit(democracy, "CitizenVoted")
      .withArgs(addr1.address, 0, choiceNo);
    await expect(democracy.citizenHasVoted(addr1.address, 0)).to.eventually.be.true;
    const [title, description, yesCount, noCount, done] = await democracy.getProposal(0);
    expect(yesCount).to.equal(0);
    expect(noCount).to.equal(1);
    expect(done).to.equal(false);
  });

  it("Should allow a citizen to vote with abstain", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await democracy.registerCitizen(addr1.address);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    let choiceAbstain = 0;
    await expect(democracy.connect(addr1).voteAsCitizen(0, choiceAbstain))
      .to.emit(democracy, "CitizenVoted")
      .withArgs(addr1.address, 0, choiceAbstain);
    await expect(democracy.citizenHasVoted(addr1.address, 0)).to.eventually.be.true;
    const [title, description, yesCount, noCount, done] = await democracy.getProposal(0);
    expect(yesCount).to.equal(0);
    expect(noCount).to.equal(0);
    expect(done).to.equal(false);
  });

  it("Should not allow a citizen to vote twice", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await democracy.registerCitizen(addr1.address);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    await democracy.connect(addr1).voteAsCitizen(0, 1);
    await expect(democracy.connect(addr1).voteAsCitizen(0, 1)).to.be.revertedWith("Citizen already voted");
  });

  it("Should not allow a citizen delegate after voting", async () => {
    const { democracy, addr1, addr2 } = await loadFixture(deployContract);
    await democracy.registerCitizen(addr1.address);
    await democracy.registerDelegate(addr2.address, 50);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    await democracy.connect(addr1).voteAsCitizen(0, 1);
    await expect(democracy.connect(addr1).delegateVote(0, addr2.address)).to.be.revertedWith("Citizen already voted");
  });

  it("Should not allow a citizen delegate after delegating", async () => {
    const { democracy, addr1, addr2 } = await loadFixture(deployContract);
    await democracy.registerCitizen(addr1.address);
    await democracy.registerDelegate(addr2.address, 50);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    await democracy.connect(addr1).delegateVote(0, addr2.address);
    await expect(democracy.connect(addr1).delegateVote(0, addr2.address)).to.be.revertedWith("Citizen already voted");
  });

  it("Should allow a citizen delegate their vote", async () => {
    const { democracy, addr1, addr2 } = await loadFixture(deployContract);
    await democracy.registerCitizen(addr1.address);
    await expect(democracy.registerDelegate(addr2.address, 50))
      .to.emit(democracy, "DelegateRegistered")
      .withArgs(addr2.address, 50);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    await expect(democracy.connect(addr1).delegateVote(0, addr2.address))
      .to.emit(democracy, "CitizenDelegatedVote")
      .withArgs(addr1.address, 0, addr2.address);
    await expect(democracy.citizenHasVoted(addr1.address, 0)).to.eventually.be.true;
  });

  it("Should allow a delegate to vote", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await democracy.registerDelegate(addr1.address, 50);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    let choiceYes = 1;
    await expect(democracy.connect(addr1).voteAsDelegate(0, choiceYes))
      .to.emit(democracy, "DelegateVoted")
      .withArgs(addr1.address, 0, choiceYes);
    await expect(democracy.delegateHasVoted(addr1.address, 0)).to.eventually.be.true;
  });

  it("Should not allow a non-registered citizen to vote", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    await expect(democracy.connect(addr1).voteAsCitizen(0, 1)).to.be.revertedWith("Citizen is not registered");
  });

  it("Should not allow a non-registered delegate to vote", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await democracy.createProposal(
      ethers.encodeBytes32String("Proposal 1"),
      encodeBytes256String("Proposal 1 Description"),
    );
    await expect(democracy.connect(addr1).voteAsDelegate(0, 1)).to.be.revertedWith("Delegate is not registered");
  });
});
