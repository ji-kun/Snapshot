pragma solidity ^0.5.0;

contract Snapshot {
  string  public name = "Snapshot";

  //storing posts' photos
  uint public imageCount = 0;
  string public comment = '';
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }
  struct Comms {
    uint id;
    string comment;
    address payable author;
  }
  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

    event ImageShared(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author,
    address payable newAuthor
  );
    event Comment (
      uint id,
      string comment,
      address payable author
    );


  //sharing posts
  function sharePosts(string memory _imgHash, string memory _description, address payable _prevAuthor) public {
    require(bytes(_imgHash).length > 0);
    require(bytes(_description).length > 0);
    require(msg.sender != address(0x0));

    imageCount ++;
    images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender);

    emit ImageShared(imageCount, _imgHash, _description, 0, msg.sender, _prevAuthor);
  }

  //creating posts' photos (Hashes on IPFS)
  function uploadImage(string memory _imgHash, string memory _description) public {
    require(bytes(_imgHash).length > 0);
    require(bytes(_description).length > 0);
    require(msg.sender != address(0x0));
    
    imageCount ++;
    images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender);

    emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
  }

   //commenting on posts
  function uploadComment( string memory _comment) public {
    require(bytes(_comment).length > 0);
    require(msg.sender != address(0x0));

    emit Comment(imageCount, _comment, msg.sender);
  }

  //Tipping Author of Post
  function tipImageOwner(uint _id) public payable {
    require(_id > 0 && _id <= imageCount);
    //Fetch photo and pay author
    Image memory _image = images[_id];
    
    address payable _author = _image.author;
    address(_author).transfer(msg.value);

    _image.tipAmount = _image.tipAmount + msg.value;

    //image updation
    images[_id] = _image;

    emit ImageTipped(imageCount, _image.hash, _image.description, _image.tipAmount, _author);
  }
}