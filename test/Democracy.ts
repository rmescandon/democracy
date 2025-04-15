import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

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
    await expect(democracy.createProposal(ethers.encodeBytes32String("Proposal 1")))
      .to.emit(democracy, "ProposalCreated")
      .withArgs(0, ethers.encodeBytes32String("Proposal 1"));
  });

  it("Should not allow non-owners to create proposals", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await expect(democracy.connect(addr1).createProposal(ethers.encodeBytes32String("Proposal 2"))).to.be.revertedWith(
      "Caller is not the owner",
    );
  });
});

describe("Register voters", () => {
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
});

describe("Voting process", () => {
  it("A citizen votes", async () => {
    const { democracy, addr1 } = await loadFixture(deployContract);
    await democracy.createProposal(ethers.encodeBytes32String("Proposal 1"));
    await democracy.registerCitizen(addr1.address);
    await expect(democracy.connect(addr1).voteAsCitizen(0, 1))
      .to.emit(democracy, "CitizenVoted")
      .withArgs(addr1.address, 0, 1);

    await expect(democracy.citizenHasVoted(addr1.address, 0)).to.eventually.be.true;
  });

  it("A citizen delegates their vote", async () => {
    const { democracy, addr1, addr2 } = await loadFixture(deployContract);
    await democracy.registerCitizen(addr1.address);
    await expect(democracy.registerDelegate(addr2.address, 50))
      .to.emit(democracy, "DelegateRegistered")
      .withArgs(addr2.address, 50);
    await democracy.createProposal(ethers.encodeBytes32String("Proposal 1"));
    await expect(democracy.connect(addr1).delegateVote(0, addr2.address))
      .to.emit(democracy, "CitizenDelegatedVote")
      .withArgs(addr1.address, 0, addr2.address);
    await expect(democracy.citizenHasVoted(addr1.address, 0)).to.eventually.be.true;
  });

  // it("Should not allow a non-registered citizen to vote", async () => {
  //   const { democracy, addr1 } = await loadFixture(deployContract);
  //   await democracy.createProposal(ethers.encodeBytes32String("Proposal 2"));
  //   await expect(democracy.connect(addr1).vote(0, true)).to.be.revertedWith("Citizen is not registered");
  // });
});
