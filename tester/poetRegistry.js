const { randomBytes } = require('crypto')
const { readFileSync } = require('fs')
const { resolve } = require('path')

const Web3 = require('web3')
const commander = require('commander')

commander
  .option('-a, --abi <path>', 'Path to contract ABI')
  .option('-d, --address <path>', 'Contract address')
  .option('-h, --host <path>', 'URL of the RPC', 'http://localhost:8545')
  .option('-c, --chainId <path>', 'Chain ID', 4)
  .option('-p, --privateKey <path>', 'Private key of the account signing the transactions', 4)

async function main() {
  commander.parse(process.argv)
  const abiPath = resolve(commander.abi)
  const web3 = new Web3(commander.host)
  const currentBlockNumber = await web3.eth.getBlockNumber()
  const abi = readJSON(abiPath)
  const account = web3.eth.accounts.privateKeyToAccount(commander.privateKey)
  const contract = new web3.eth.Contract(abi, commander.address, { from: account.address })

  const addCid = async (cid) => {
    const method = contract.methods.addCid(cid)

    const tx = {
      from: account.address,
      to: commander.address,
      gas: await method.estimateGas(),
      gasPrice: 1e9,
      data: method.encodeABI(),
      chainId: commander.chainId,
      nonce: await web3.eth.getTransactionCount(account.address, 'pending'),
    }

    // console.log('tx', tx)

    const { rawTransaction } = await account.signTransaction(tx)

    // console.log('Signed Raw Transaction Created')

    return web3.eth.sendSignedTransaction(rawTransaction)
  }

  const getCidCount = () => contract.methods.getCidCount().call()

  const testAddingCid = async () => {
    const cidCountBefore = await getCidCount()
    console.log(`cidCountBefore`, cidCountBefore)
    const cidToAdd = web3.utils.asciiToHex(randomBytes(32))
    console.log(`addCid(${cidToAdd})...`)
    await addCid(cidToAdd)
    const cidCountAfter = await getCidCount()
    console.log('cidCountAfter:', cidCountAfter)
    const addedCid = await contract.methods.cids(cidCountAfter - 1).call()
    console.log('addedCid', addedCid)
    console.log('addedCid is as expected', addedCid === cidToAdd)
    console.log('cidCount increated by one after inserting', cidCountAfter === cidCountBefore + 1)
  }

  console.log('Running Contract Tester')
  console.log(`Contract ABI Path: ${abiPath}`)
  console.log(`Contract Address: ${commander.address}`)
  console.log(`Web3 Version ${web3.version}`)
  console.log(`Block number ${currentBlockNumber}`)
  console.log('Account Address', account.address)

  await testAddingCid()

}

const readJSON = path => JSON.parse(readFileSync(path, 'utf8'))

main().catch(console.error)
