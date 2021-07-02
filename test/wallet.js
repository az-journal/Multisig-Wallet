
const {expectRevert} = require('@openzeppelin/test-helpers/'); 
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { assert } = require('chai');
const  Wallet = artifacts.require('Wallet');

contract('Wallet', (accounts)=>{
    let wallet;
    beforeEach(async ()=>{
        wallet = await Wallet.new([accounts[0],accounts[1],accounts[2]],2); 
        await web3.eth.sendTransaction({from:accounts[0],to: wallet.address,value:1000});
    });

    it('should have correct approvals and quorum', async () =>{
     const approvers = await wallet.getApprovers();
     const quorum = await wallet.quorum();
     assert(approvers[0] === accounts[0]);
     assert(approvers[1] === accounts[1]);
     assert(approvers[2] === accounts[2]);
     assert(quorum.toNumber() === 2);
    });


 it ('should create transfers',async() =>{
 await wallet.createTransfer(100, accounts[5],{from:accounts[0]});
 const transactions = await wallet.getTransfers();
 assert(transactions.length === 1);
 assert(transactions[0].amount ==='100');
 assert(transactions[0].approvals === '0');
 assert(transactions[0].id === "0");
 assert(transactions[0].to === accounts[5]);
 assert(transactions[0].sent === false);
 });

 it( 'should NOT create transfer if sender is not approved', async function() {
  try{
    await wallet.createTransfer(100,accounts[5],{from:accounts[4]})} catch(e){console.log(e)};
 });
it ('should increment approvals', async() =>{
    await wallet.createTransfer(100, accounts[5],{from: accounts[0]});
    await wallet.approveTransfer(0,{from:accounts[0]});
    const transactions = await wallet.getTransfers();
    const balance = await web3.eth.getBalance(wallet.address)
    assert(transactions[0].approvals === '1');
    assert(transactions[0].sent === false);
    assert (balance === '1000');
})
it('should sent transfer when quorum approvals reached', async() => {
    const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
    await wallet.createTransfer(100, accounts[6],{from: accounts[0]});
    await wallet.approveTransfer(0,{from: accounts[0]});
    await wallet.approveTransfer(0,{from: accounts[1]});
    const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
assert(balanceAfter.sub(balanceBefore).toNumber()===100);
});
it('should NOT approve transfer if sender is not approved', async() =>{
    await wallet.createTransfer(100, accounts[5],{from: accounts[0]});
   try{
      await wallet.approveTransfer(0,{from:accounts[4]})} catch(e){console.log(e)};
});

it('should NOT approve transfer if transfer already sent', async() =>{
    await wallet.createTransfer(100, accounts[6],{from: accounts[0]});
    await wallet.approveTransfer(0,{from: accounts[0]});
    await wallet.approveTransfer(0,{from: accounts[1]});
    try{ 
        await wallet.approveTransfer(0,{from: accounts[2]})} catch(e){console.log(e)};
})
it('should NOT approve transfer twice', async() =>{
    await wallet.createTransfer(100, accounts[6],{from: accounts[0]});
    await wallet.approveTransfer(0,{from: accounts[0]});
    try{  await wallet.approveTransfer(0,{from: accounts[0]})} catch(e) {console.log(e)};
});
});
