import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC20Token, SimpleSwap } from "../typechain-types";

const { parseEther } = ethers;

describe("SimpleSwap", () => {
  const INITIAL_SUPPLY = parseEther("1000000"); // 1M tokens
  const TRANSFER_AMOUNT = parseEther("10000"); // 10K tokens
  const LIQUIDITY_AMOUNT_A = parseEther("100"); // 100 tokens
  const LIQUIDITY_AMOUNT_B = parseEther("200"); // 200 tokens

  const deployContractsFixture = async () => {
    // Trx signers
    const [deployer, user1, user2]: HardhatEthersSigner[] = await ethers.getSigners();

    // SimpleSwap contract
    const simpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
    const simpleSwap: SimpleSwap = await simpleSwapFactory.deploy();

    // Erc20 tokens for testing
    const erc20Factory = await ethers.getContractFactory("ERC20Token");
    const tokenA: ERC20Token = await erc20Factory.deploy("Token A", "TKA", INITIAL_SUPPLY);
    const tokenB: ERC20Token = await erc20Factory.deploy("Token B", "TKB", INITIAL_SUPPLY);

    // Send tokens to testing users
    await tokenA.transfer(user1.address, TRANSFER_AMOUNT);
    await tokenB.transfer(user1.address, TRANSFER_AMOUNT);

    await tokenA.transfer(user2.address, TRANSFER_AMOUNT);
    await tokenB.transfer(user2.address, TRANSFER_AMOUNT);

    // Approve SimpleSwap contract
    await tokenA.connect(user1).approve(simpleSwap.target, TRANSFER_AMOUNT);
    await tokenB.connect(user1).approve(simpleSwap.target, TRANSFER_AMOUNT);
    await tokenA.connect(user2).approve(simpleSwap.target, TRANSFER_AMOUNT);
    await tokenB.connect(user2).approve(simpleSwap.target, TRANSFER_AMOUNT);

    const deadline = (await ethers.provider.getBlock("latest"))!.timestamp + 60;

    return { deadline, deployer, simpleSwap, user1, user2, tokenA, tokenB };
  };

  describe("Deployment", () => {
    it("Should deploy SimpleSwap contract successfully", async () => {
      const { simpleSwap } = await loadFixture(deployContractsFixture);

      expect(simpleSwap.target).to.not.equal(0);
      expect(simpleSwap.target).to.not.equal("");
      expect(simpleSwap.target).to.not.equal(null);
      expect(simpleSwap.target).to.not.equal(undefined);
    });
  });

  describe("addLiquidity", () => {
    it("Should add initial liquidity", async () => {
      const { simpleSwap, tokenA, tokenB, user1, deadline } = await loadFixture(deployContractsFixture);

      const tx = await simpleSwap
        .connect(user1)
        .addLiquidity(
          tokenA.target,
          tokenB.target,
          LIQUIDITY_AMOUNT_A,
          LIQUIDITY_AMOUNT_B,
          0,
          0,
          user1.address,
          deadline,
        );

      await expect(tx)
        .to.emit(simpleSwap, "LiquidityAdded")
        .withArgs(
          tokenA.target,
          tokenB.target,
          user1.address,
          LIQUIDITY_AMOUNT_A,
          LIQUIDITY_AMOUNT_B,
          LIQUIDITY_AMOUNT_A < LIQUIDITY_AMOUNT_B ? LIQUIDITY_AMOUNT_A : LIQUIDITY_AMOUNT_B,
        );

      const [token0, token1] =
        tokenA.target < tokenB.target ? [tokenA.target, tokenB.target] : [tokenB.target, tokenA.target];

      const reserves = await simpleSwap.reserves(token0, token1);
      expect(reserves.reserveA).to.be.gt(0);
      expect(reserves.reserveB).to.be.gt(0);
      expect(reserves.totalLiquidity).to.be.gt(0);
    });

    it("Should fail when deadline is exceeded", async () => {
      const { simpleSwap, tokenA, tokenB, user1 } = await loadFixture(deployContractsFixture);
      const expiredDeadline = (await ethers.provider.getBlock("latest"))!.timestamp - 1; // Expired deadline

      await expect(
        simpleSwap
          .connect(user1)
          .addLiquidity(
            tokenA.target,
            tokenB.target,
            LIQUIDITY_AMOUNT_A,
            LIQUIDITY_AMOUNT_B,
            0,
            0,
            user1.address,
            expiredDeadline,
          ),
      ).to.be.revertedWith("SimpleSwap: Expired deadline");
    });
  });
});
