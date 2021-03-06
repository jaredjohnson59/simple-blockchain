const SHA256 = require('crypto-js/sha256');

class Block{
  constructor(index, timestamp, data, previousHash = ''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined:" + this.hash);
  }

}

class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 10;
  }

  createGenesisBlock(){
    return new Block(0, new Date().toLocaleString(), "Genesis Block", "0");
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    //Set previous hash for new block
    newBlock.previousHash = this.getLatestBlock().hash;
    //Calculate New Hash
    newBlock.hash = newBlock.mineBlock(this.difficulty);
    //Add block to chain
    this.chain.push(newBlock);
  }

  isChainValid(){
    for(let i = 1; i < this.chain.length; i++){
        const currentBlock = this.chain[i];
        const previous = this.chain[i-1];

        if(currentBlock.hash !== currentBlock.calculateHash()){
          return false;
        }

        if(currentBlock.previousHash !== previous.hash){
          return false;
        }
    }
            return true;
  }

}

let jCoin = new Blockchain();
console.log('Mining block 1....');
jCoin.addBlock(new Block(1, new Date().toLocaleString(), {amount: 4}))
console.log('Mining block 2....');
jCoin.addBlock(new Block(2, new Date().toLocaleString(), {amount: 2}))
