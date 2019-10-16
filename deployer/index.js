const { readFileSync } = require('fs')
const { resolve } = require('path')

const Web3 = require('web3')
const commander = require('commander')

commander
  .option('-b, --bin <path>', 'Path to contract binary')
  .option('-h, --host <path>', 'URL of the RPC', 'http://localhost:8545')

async function main() {
  console.log('Running Contract Deployer')
  commander.parse(process.argv)
  const binPath = resolve(commander.bin)
  const web3 = new Web3(commander.host)
  const currentBlockNumber = await web3.eth.getBlockNumber()
  console.log(`Contract Binary Path: ${binPath}`)
  console.log(`Web3 Version: ${web3.version}`)
  console.log(`Block number: ${currentBlockNumber}`)
  console.log(`Chain ID: ${await web3.eth.net.getId()}`)

  const bin = readFileSync(binPath, 'utf8')
  const account = web3.eth.accounts.privateKeyToAccount('0x2cdfcc85aef24b085229deb1a07475878e384019273328a13592aedd1595c1c6')

  console.log('Account Address:', account.address)

  const { rawTransaction } = await account.signTransaction({
    from: account.address,
    gas: 1500000,
    gasPrice: 1000000,
    data: '0x' + bin,
    chainId: 4,
  })

  console.log('Raw Transaction:', rawTransaction)

  const { contractAddress, blockNumber, blockHash, transactionHash } = await web3.eth.sendSignedTransaction(rawTransaction)

  console.log('Contract Address:', contractAddress)
  console.log('Contract Block Number:', blockNumber)
  console.log('Contract Block Hash:', blockHash)
  console.log('Contract Transaction Hash:', transactionHash)

}

const readJSON = path => JSON.parse(readFileSync(path, 'utf8'))

main().catch(console.error)
