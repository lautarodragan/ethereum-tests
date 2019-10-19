const { readFileSync } = require('fs')
const { resolve } = require('path')

const Web3 = require('web3')
const commander = require('commander')

commander
  .option('-a, --abi <path>', 'Path to contract ABI')
  .option('-d, --address <path>', 'Contract address')
  .option('-h, --host <path>', 'URL of the RPC', 'http://localhost:8545')
  .option('-c, --chainId <path>', 'Chain ID', 4)

async function main() {
  commander.parse(process.argv)
  const abiPath = resolve(commander.abi)
  const web3 = new Web3(commander.host)
  const currentBlockNumber = await web3.eth.getBlockNumber()
  const abi = readJSON(abiPath)
  const account = web3.eth.accounts.privateKeyToAccount('0x2cdfcc85aef24b085229deb1a07475878e384019273328a13592aedd1595c1c6')
  const contract = new web3.eth.Contract(abi, commander.address, { from: account.address })

  console.log('Running Contract Tester')
  console.log(`Contract ABI Path: ${abiPath}`)
  console.log(`Contract Address: ${commander.address}`)
  console.log(`Web3 Version ${web3.version}`)
  console.log(`Block number ${currentBlockNumber}`)
  console.log('Account Address', account.address)

  console.log('helloWorld():', await contract.methods.helloWorld().call())
  console.log('totalSupply():', await contract.methods.totalSupply().call())

  const method = contract.methods.addSupply()

  const tx = {
    from: account.address,
    to: commander.address,
    gas: await method.estimateGas({gas: 900000000000}),
    gasPrice: 10000000000,
    data: method.encodeABI(),
    chainId: commander.chainId,
    nonce: await web3.eth.getTransactionCount(account.address, 'pending'),
  }

  console.log('tx', tx)

  const { rawTransaction } = await account.signTransaction(tx)

  console.log('Signed Raw Transaction Created')

  const { contractAddress, blockNumber, blockHash, transactionHash } = await web3.eth.sendSignedTransaction(rawTransaction)

  console.log('Contract Address:', contractAddress)
  console.log('Contract Block Number:', blockNumber)
  console.log('Contract Block Hash:', blockHash)
  console.log('Contract Transaction Hash:', transactionHash)

}

const readJSON = path => JSON.parse(readFileSync(path, 'utf8'))

main().catch(console.error)
