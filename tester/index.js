const { readFileSync } = require('fs')
const { resolve } = require('path')

const Web3 = require('web3')
const commander = require('commander')

commander
  .option('-a, --abi <path>', 'Path to contract ABI')
  .option('-c, --address <path>', 'Contract address')
  .option('-h, --host <path>', 'URL of the RPC', 'http://localhost:8545')

async function main() {
  console.log('Running Contract Tester')
  commander.parse(process.argv)
  const abiPath = resolve(commander.abi)
  const web3 = new Web3(commander.host)
  const blockNumber = await web3.eth.getBlockNumber()
  console.log(`Contract ABI Path: ${abiPath}`)
  console.log(`Contract Address: ${commander.address}`)
  console.log(`Web3 Version ${web3.version}`)
  console.log(`Block number ${blockNumber}`)

  const abi = readJSON(abiPath)
  const account = web3.eth.accounts.privateKeyToAccount('0x2cdfcc85aef24b085229deb1a07475878e384019273328a13592aedd1595c1c6')
  const contract = new web3.eth.Contract(abi, commander.address, { from: account.address })

  console.log('Account Address', account.address)

  console.log('helloWorld():', await contract.methods.helloWorld().call())
  console.log('totalSupply():', await contract.methods.totalSupply().call())


}

const readJSON = path => JSON.parse(readFileSync(path, 'utf8'))

main().catch(console.error)
