// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DemocracyModule = buildModule("DemocracyModule", (m) => {
  const democracy = m.contract("Democracy", [], {});

  return { democracy };
});

export default DemocracyModule;
