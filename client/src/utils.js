
import Web3 from 'web3'; //import Web3 object
import Wallet from './contracts/Wallet.json'; // import contract artifact
import detectEthereumProvider from '@metamask/detect-provider';
//define 1st function to instrantiate web3 object
const getWeb3 = () =>
 new Promise(async(resolve,reject)=>{
     let provider = await detectEthereumProvider();
   if(provider){
       await provider.request({method:'eth_requestAccounts'});
    try{
        const web3 = new Web3(window.ethereum);
        resolve(web3);
    } catch (error) {
        reject(error);
    }
   } reject('Install Metamask');

});

const getWallet = async web3 =>{
    const networkId = await web3.eth.net.getId(); //extract network id from contract abstraction
   //define var that stores data of contract deployment
    const deployedNetwork = Wallet.networks[networkId];
   
   //return contract instance
    return new web3.eth.Contract(
        Wallet.abi,
        deployedNetwork && deployedNetwork.address); //provide address of smart contract
};
export{getWeb3, getWallet};