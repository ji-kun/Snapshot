const { assert } = require('chai')
const { default: Web3 } = require('web3')

const Snapshot = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Snapshot', ([deployer, author, tipper]) => {
  let snapshot

  before(async () => {
    snapshot = await Snapshot.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await snapshot.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await snapshot.name();
      assert.equal(name, 'Decentragram');
    })
  })

  describe('images', async () => {
    let result, imageCount
    const hash = 'RohitKunji'

    before(async () => {
      result = await snapshot.uploadImage(hash, 'Image description', { from: author })
      imageCount = await snapshot.imageCount()
    })

    it('creates images', async () => {
      //PASS
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id verified')
      assert.equal(event.hash, hash, 'Hash verified')
      assert.equal(event.description, 'Image description', 'description verified')
      assert.equal(event.tipAmount, '0', 'tip amout verified')
      assert.equal(event.author, author, 'author verified')

      //FAIL
      await snapshot.uploadImage('', 'Image description', { from: author }).should.be.rejected;
      await snapshot.uploadImage('Image hash', '', { from: author }).should.be.rejected;

    })

    it('lists images', async () => {
      const image = await snapshot.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id verified')
      assert.equal(image.hash, hash, 'Hash verified')
      assert.equal(image.description, 'Image description', 'description verified')
      assert.equal(image.tipAmount, '0', 'tip amout verified')
      assert.equal(image.author, author, 'author verified')
    })

    it('allows tipping to author', async () => {
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await snapshot.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

      //PASS
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id verified')
      assert.equal(event.hash, hash, 'Hash verified')
      assert.equal(event.description, 'Image description', 'description verified')
      assert.equal(event.tipAmount, '1000000000000000000', 'tip amout verified')
      assert.equal(event.author, author, 'author verified')

      //Update Author Balance
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance) 

      let tipImageOwner
      tipImageOwner = web3.utils.toWei('1', 'Ether')
      tipImageOwner = new web3.utils.BN(tipImageOwner)

      const updatedBalance = oldAuthorBalance.add(tipImageOwner)

      assert.equal(newAuthorBalance.toString(), updatedBalance.toString())

      //FAIL
      await snapshot.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    })
  })
})