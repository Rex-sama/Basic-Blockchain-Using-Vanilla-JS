const crypto = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previoushash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previoushash = previoushash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return crypto(
      this.index +
        this.timestamp +
        this.previoushash +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined : ", this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 5; //More difficulty takes more time to mine
  }
  createGenesisBlock() {
    return new Block(0, "24/05/2021", "Genesis Block", "012345");
  }
  getBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previoushash = this.getBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      //   if (currentBlock.hash !== currentBlock.calculateHash()) {
      //     return false;
      //   }

      if (currentBlock.previoushash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

const block = new BlockChain();

console.log("Mining Block 1..........");
block.addBlock(new Block(1, "21/05/2021", { amount: 20 }));
console.log("Mining Block 2..........");
block.addBlock(new Block(2, "24/05/2021", { amount: 40 }));

console.log(JSON.stringify(block, null, 1));
// block.chain[1] = { amount: 1000 };       Tampering Data
console.log("BlockChain Valid : ", block.isChainValid());
