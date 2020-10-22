import React, { Component } from 'react';
import Identicon from 'identicon.js';
import './App.css'
import tip from '../../src/ethereum.png';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto post" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto allContent formStyles">
              <p>&nbsp;</p>
              <h2>Add a photo</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.imageDescription.value
                this.props.uploadImage(description)
              }} >
                <input type='file' accept=".png, .jpeg, .jpg, .gif, .bmp" class ="choosefile" onChange={this.props.captureFile} />
                  <div className="">
                    <br></br>
                      <input
                        id="imageDescription"
                        type="text"
                        ref={(input) => { this.imageDescription = input }}
                        className="form-control"
                        placeholder="What's on your mind?"
                        required />
                  </div>
                <button type="submit" className="hover btn colorButton btn-block btn-lg mt-2 pt-2">Upload!</button>
              </form>

              <p>&nbsp;</p>
                { this.props.images.map((image, key) => {
                  return(
                    <div className="" key={key} >
                      <div className="">
                        <img
                          className=''
                          width='30'
                          height='30'
                          src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                        />
                        <small className="">{image.author}</small>
                      </div>
                      <ul id="imageList" className="ulitem">
                        <li className="litem">
                          <p className=""><img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{ maxWidth: '420px'}}/></p>
                          <p>{image.description}</p>
                        </li>
                        <li key={key} className="litem">
                          <small className="float-left mt-1 text-muted">
                            REACH: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                          </small>
                          <button
                            className="btn btn-link btn-sm float-right pt-0  Snapshoit"
                            name={image.id}
                            onClick={(event) => {
                              let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                              console.log(event.target.name, tipAmount)
                              this.props.tipImageOwner(event.target.name, tipAmount)
                            }}
                          >
                            <img src = {tip} className="tip" />
                            TIP 0.1 ETH
                          </button>
                          <br />
                          <br />
                        </li>
                      </ul>
                    </div>
                  )
                })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;