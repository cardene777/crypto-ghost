// RecoveryStory.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

// いくつかの OpenZeppelin のコントラクトをインポート。
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


// utils ライブラリをインポートして文字列の処理を行う。
import "hardhat/console.sol";

// Base64.solコントラクトからSVGとJSONをBase64に変換する関数をインポート。

// インポートした OpenZeppelin のコントラクトを継承。
// 継承したコントラクトのメソッドにアクセスできるようになる。
contract MintNft is ERC721URIStorage {
    using Strings for *;

    // OpenZeppelin が tokenIds を簡単に追跡するために提供するライブラリを呼び出す
    using Counters for Counters.Counter;

    // _tokenIdsを初期化（_tokenIds = 0）
    Counters.Counter private _tokenIds;

    // NFT トークンの名前とそのシンボルを渡す。
    constructor() ERC721("Ghost NFT", "GHOST") {
        console.log("Create GhostNFT");
    }

    string[] ghostObj;

    // シードを生成する関数を作成。
    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    // ユーザーが NFT を取得するために実行する関数。
    function ghostNftMint(
        string memory _objData,
        string memory _name,
        string memory _description,
        uint _divNumHorizontal,
        uint _divNumVertical
        ) public {

        // NFT IDカウンターをインクリメント。
        _tokenIds.increment();
        // 現在のtokenIdを取得。tokenIdは0から始まる。
        uint256 newItemId = _tokenIds.current();

        string memory finalSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: #F8F5F5; font-family: 'Georgia, serif'; font-size: 24px; }</style><rect width='100%' height='100%' fill='#3FC0A1' /><text x='50%' y='50%' className='base' dominant-baseline='middle' text-anchor='middle'>";

        string memory svgText;
        svgText = string.concat("#", Strings.toString(newItemId), " ", _name, " ");
        svgText = string.concat(svgText, Strings.toString(_divNumHorizontal), " x ", Strings.toString(_divNumVertical));

        finalSvg = string(abi.encodePacked(finalSvg, svgText, "</text></svg>"));

        // NFTに出力されるテキストをターミナルに出力。
        console.log("\n----- SVG data -----");
        console.log(finalSvg);
        console.log("--------------------\n");
        console.log("\n----- OBJ data -----");
        console.log(_objData);
        console.log("--------------------\n");


        // JSONファイルを所定の位置に取得し、base64としてエンコード。
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        _name,
                        '", "image_data": "',
                        Base64.encode(bytes(finalSvg)),
                        '", "description": "',
                        _description,
                        '", "animation_url": "',
                        // OBJデータ
                        _objData,
                        '"}'
                    )
                )
            )
        );

        string memory tokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n----- Token URI ----");
        console.log(tokenUri);
        console.log("--------------------\n");

        ghostObj.push(_objData);

        // msg.sender を使って NFT を送信者に Mint。
        _safeMint(_msgSender(), newItemId);

        // tokenURIを更新。
        _setTokenURI(newItemId, tokenUri);

        string memory _tokenURI = tokenURI(newItemId);

        console.log("tokenURI: ", _tokenURI);

        // NFTがいつ誰に作成されたかを確認。
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    }

    function getAllObjData() public view returns(string[] memory) {
        return ghostObj;
    }

}
