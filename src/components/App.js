import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Snapshot from '../abis/Decentragram.json';
import Navbar from './Navbar';
import Content from './Main';
import Lottie from './Lottie';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadData()
  }

  //Importing Web3 as metamask requires
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Need Ethereum Browser to Run. This is not  an ethereum browser')
    }
  }

  async loadData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({
       account: accounts[0] 
    })
    const nid = await web3.eth.net.getId()
    const netData = Snapshot.networks[nid]
    if(netData){
      const  snapshot = web3.eth.Contract(Snapshot.abi, netData.address)
      this.setState({
        snapshot
      })
      const imagesCount = await snapshot.methods.imageCount().call()
      this.setState({
        imagesCount
      })

      for ( var i =1; i<=imagesCount; i++ ) {
        const image = await snapshot.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }

      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount )
      })

      this.setState({
        loading: false
      })
    }
    else{
      window.alert('Snapshot network undetected!')
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result)
      })
    }
  }

  // sharePost = (description, prevAuthor) => {
  //   this.setState({
  //     loading: true,
  //   })
  //   this.state.snapshot.methods.sharePost(description, prevAuthor).send({ from: this.state.account }).on('transactionHash', (hash) => {
  //     this.setState({
  //       loading: false
  //     })
  //   })
  // }

  uploadImage = (description) => {
    //ipfs
    ipfs.add(this.state.buffer, (error, result) => {
      if(error){
        console.log(error)
        return
      }
      this.setState({
        loading: true
      })
      this.state.snapshot.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
          loading: false
        })
      })
    })
  }

  uploadComment = (comment) => {
    this.setState({
      loading: true
    })
    this.state.snapshot.methods.uploadComment(comment).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({
        loading: false
      })
    })
  }

  tipImageOwner = (id, tipAmount) => {
    this.setState({
      loading: true,
    })
    this.state.snapshot.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({
        loading: false
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      snapshot: null,
      images: [],
      loading: true
    }

  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <Lottie />
          : <Content
            images = {this.state.images}
            captureFile = {this.captureFile}
            uploadImage={this.uploadImage}
            tipImageOwner = {this.tipImageOwner}
            //sharePost = {this.sharePost}
            uploadComment = { this.uploadComment }
            />
          }
      </div>
    );
  }
}

export default App;