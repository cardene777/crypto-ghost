// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "hardhat/console.sol";
import "./MintNft.sol";
import "./library/Vector.sol";

contract Obj is MintNft {
    using Strings for *;
    using Vector for *;

    struct VectorData {
        uint256 divNumHorizontal;
        uint256 divNumVertical;
        string[] baseVVector; // vの配列
        string[] baseVnVector; // vnの配列
    }

    struct Ghost {
        string name; // ghost name
        string description; // ghost description
        string material; // ghost material
        uint256 ghostId; // ghost ID
        uint256 vectorDataIndex; // vectorData index
    }

    VectorData[] public vectorData;
    Ghost[] public ghost;

    uint256 ghosttIdCounter = 1;
    uint256 objDataId = 1;

    mapping(uint256 => uint256) public divNumHorizontalToObjDataId;

    function createObjFile(uint256 _divNumHorizontal)
        public
        view
        returns (string memory)
    {
        require(
            divNumHorizontalToObjDataId[_divNumHorizontal] > 0,
            "The specified number of divisions is not registered."
        );
        uint256 objDataIndex = divNumHorizontalToObjDataId[_divNumHorizontal] -
            1;

        uint256 divNumHorizontal = vectorData[objDataIndex].divNumHorizontal;
        uint256 divNumVertical = vectorData[objDataIndex].divNumVertical;
        string[] memory baseVVector = vectorData[objDataIndex].baseVVector;
        string[] memory baseVnVector = vectorData[objDataIndex].baseVnVector;

        string memory vVector = "v".createVector(divNumVertical, baseVVector);

        string memory vnVector = "vn".createVector(divNumVertical, baseVnVector);

        vVector = string.concat("v -0 1 0\n", vVector, "v 0 -1 0\n");

        string memory fMesh = divNumHorizontal.createF(divNumHorizontal * divNumVertical);

        fMesh = string.concat(
            unicode"# Blender v3.2.2 OBJ File: ''\n# www.blender.org\nmtllib sphere_12_6.mtl\no 球_球.001\n",
            vVector,
            vnVector,
            "usemtl None\ns off\n",
            fMesh
        );
        console.log("fMesh create");
        fMesh = Base64.encode(bytes(fMesh));
        // Base64
        fMesh = string(abi.encodePacked("data:model/obj;base64,", string(fMesh)));
        return fMesh;
    }

    function addVectorData(
        uint256 _divNumHorizontal,
        uint256 _divNumVertical,
        string[] memory _baseVVector,
        string[] memory _baseVnVector
    ) public {
        VectorData memory _newObjData = VectorData(
            _divNumHorizontal,
            _divNumVertical,
            _baseVVector,
            _baseVnVector
        );
        if (divNumHorizontalToObjDataId[_divNumHorizontal] == 0) {
            divNumHorizontalToObjDataId[_divNumHorizontal] = objDataId;
            objDataId++;
            vectorData.push(_newObjData);
            console.log("Add Vector Data");
        }
    }

    function writeGhost(
        string memory _name,
        string memory _description,
        string memory _material,
        uint _divNumHorizontal
    ) external {
        uint vectorDataIndex = divNumHorizontalToObjDataId[
            _divNumHorizontal
        ];
        Ghost memory _newGhost = Ghost(
            _name,
            _description,
            _material,
            ghosttIdCounter,
            vectorDataIndex
        );
        ghosttIdCounter++;
        ghost.push(_newGhost);

        // ghostNftMint(_name, _description,
        //     vectorData[vectorDataIndex-1].divNumHorizontal,
        //     vectorData[vectorDataIndex-1].divNumVertical,
        //     vectorData[vectorDataIndex-1].baseVVector,
        //     vectorData[vectorDataIndex-1].baseVnVector
        // );
    }

    function readGhost(uint256 ghostId, uint256 _divNumHorizontal)
        external
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        string memory objString = createObjFile(_divNumHorizontal);
        return (
            objString,
            ghost[ghostId - 1].name,
            ghost[ghostId - 1].description,
            ghost[ghostId - 1].material,
            ghost[ghostId - 1].ghostId,
            ghost[ghostId - 1].vectorDataIndex
        );
    }

    function getAllGhost() external view returns (Ghost[] memory) {
        return ghost;
    }

    function getAllVector() external view returns (VectorData[] memory) {
        return vectorData;
    }

    function getVector(uint vectorId) external view returns (uint, uint) {
        return (
            vectorData[vectorId - 1].divNumHorizontal,
            vectorData[vectorId - 1].divNumVertical
        );
    }

    function getDivNumHorizontalToObjDataId(uint _divNumHorizontal) external view returns(uint) {
        return divNumHorizontalToObjDataId[_divNumHorizontal];
    }

}
