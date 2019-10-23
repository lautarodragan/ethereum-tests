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

  const addSupply = async () => {
    const method = contract.methods.addSupply()

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

  const addThing = async (thing) => {
    const method = contract.methods.addThing(thing)

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

  console.log('Running Contract Tester')
  console.log(`Contract ABI Path: ${abiPath}`)
  console.log(`Contract Address: ${commander.address}`)
  console.log(`Web3 Version ${web3.version}`)
  console.log(`Block number ${currentBlockNumber}`)
  console.log('Account Address', account.address)

  console.log('helloWorld():', await contract.methods.helloWorld().call())
  console.log('totalSupply():', await contract.methods.totalSupply().call())
  console.log('addSupply...')
  await addSupply()
  console.log('totalSupply():', await contract.methods.totalSupply().call())
  console.log('things():', await contract.methods.getThings().call())
  const str = 'T: ' + new Date().toISOString()
  console.log(`addThing(${str})...`)
  await addThing(web3.utils.asciiToHex(str))
  const things = await contract.methods.getThings().call()
  console.log('things():', things)
  console.log('things():', things.map(web3.utils.hexToAscii).map(_ => _.trim()))

}

const readJSON = path => JSON.parse(readFileSync(path, 'utf8'))

main().catch(console.error)
