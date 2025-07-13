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
  const SWAP_AMOUNT = parseEther("10"); // 10 tokens

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

  const addLiquidityFixture = async () => {
    const { simpleSwap, tokenA, tokenB, user1, user2, deadline } = await loadFixture(deployContractsFixture);

    await simpleSwap
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

    return { simpleSwap, tokenA, tokenB, user1, user2, deadline };
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

    it("Should fail with identical tokens", async () => {
      const { simpleSwap, tokenA, user1, deadline } = await loadFixture(deployContractsFixture);

      await expect(
        simpleSwap.connect(user1).addLiquidity(
          tokenA.target,
          tokenA.target, // Same token
          LIQUIDITY_AMOUNT_A,
          LIQUIDITY_AMOUNT_B,
          0,
          0,
          user1.address,
          deadline,
        ),
      ).to.be.revertedWith("SimpleSwap: Identical tokens");
    });

    it("Should fail with zero address tokens", async () => {
      const { simpleSwap, tokenA, user1, deadline } = await loadFixture(deployContractsFixture);

      await expect(
        simpleSwap.connect(user1).addLiquidity(
          tokenA.target,
          ethers.ZeroAddress, // Zero address
          LIQUIDITY_AMOUNT_A,
          LIQUIDITY_AMOUNT_B,
          0,
          0,
          user1.address,
          deadline,
        ),
      ).to.be.revertedWith("SimpleSwap: Invalid token address");
    });
  });

  describe("removeLiquidity", () => {
    it("Should remove liquidity successfully", async () => {
      const { simpleSwap, tokenA, tokenB, user1, deadline } = await loadFixture(addLiquidityFixture);

      const [token0, token1] =
        tokenA.target < tokenB.target ? [tokenA.target, tokenB.target] : [tokenB.target, tokenA.target];

      const [amount0, amount1] =
        tokenA.target < tokenB.target
          ? [LIQUIDITY_AMOUNT_A, LIQUIDITY_AMOUNT_B]
          : [LIQUIDITY_AMOUNT_B, LIQUIDITY_AMOUNT_A];

      const lpTokenAddress = await simpleSwap.lpTokens(token0, token1);
      const lpToken = await ethers.getContractAt("LPToken", lpTokenAddress);
      const lpBalance = await lpToken.balanceOf(user1.address);

      const liquidityToRemove = lpBalance / 2n;

      const tx = await simpleSwap.connect(user1).removeLiquidity(
        tokenA.target,
        tokenB.target,
        liquidityToRemove,
        0, // amountAMin
        0, // amountBMin
        user1.address,
        deadline,
      );

      await expect(tx)
        .to.emit(simpleSwap, "LiquidityRemoved")
        .withArgs(tokenA.target, tokenB.target, user1.address, amount0 / 2n, amount1 / 2n, liquidityToRemove);
    });
  });

  describe("getPrice", () => {
    it("Should return correct price", async () => {
      const { simpleSwap, tokenA, tokenB } = await loadFixture(addLiquidityFixture);
      const price = await simpleSwap.getPrice(tokenA.target, tokenB.target);

      expect(price).to.equal(parseEther("0.5"));
    });

    it("Should return correct inverse price", async () => {
      const { simpleSwap, tokenA, tokenB } = await loadFixture(addLiquidityFixture);
      const price = await simpleSwap.getPrice(tokenB.target, tokenA.target);

      expect(price).to.equal(parseEther("2"));
    });
  });

  describe("Get Amount Out", () => {
    it("Should calculate correct amount out", async function () {
      const { simpleSwap } = await loadFixture(deployContractsFixture);
      const amountIn = parseEther("10");
      const reserveIn = parseEther("100");
      const reserveOut = parseEther("200");

      const amountOut = await simpleSwap.getAmountOut(amountIn, reserveIn, reserveOut);

      const expected = (amountIn * reserveOut) / (reserveIn + amountIn);
      expect(amountOut).to.equal(expected);
    });

    it("Should fail with zero amount in", async function () {
      const { simpleSwap } = await loadFixture(deployContractsFixture);
      await expect(simpleSwap.getAmountOut(0, parseEther("100"), parseEther("200"))).to.be.revertedWith(
        "SimpleSwap: Amount in must be greater than zero",
      );
    });

    it("Should fail with zero reserves", async function () {
      const { simpleSwap } = await loadFixture(deployContractsFixture);
      await expect(simpleSwap.getAmountOut(parseEther("10"), 0, parseEther("200"))).to.be.revertedWith(
        "SimpleSwap: No liquidity for this pair",
      );
    });
  });

  describe("Swap Tokens", () => {
    it("Should swap tokens successfully", async function () {
      const { simpleSwap, tokenA, tokenB, user2, deadline } = await loadFixture(addLiquidityFixture);

      const initialBalanceA = await tokenA.balanceOf(user2.address);
      const initialBalanceB = await tokenB.balanceOf(user2.address);

      const tx = await simpleSwap.connect(user2).swapExactTokensForTokens(
        SWAP_AMOUNT,
        0, // amountOutMin
        [tokenA.target, tokenB.target],
        user2.address,
        deadline,
      );

      await expect(tx).to.emit(simpleSwap, "SwappedTokens");

      const finalBalanceA = await tokenA.balanceOf(user2.address);
      const finalBalanceB = await tokenB.balanceOf(user2.address);

      expect(finalBalanceA).to.equal(initialBalanceA - SWAP_AMOUNT);
      expect(finalBalanceB).to.be.gt(initialBalanceB);
    });
  });
});
