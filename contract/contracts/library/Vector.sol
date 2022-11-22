// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";

library Vector {
    using Strings for *;
    function createVVector(
        uint256 index,
        string[] memory vectorBaseArray,
        string memory vector,
        string memory vectorZInversion
    ) public pure returns (string memory, string memory) {
        vector = string.concat(
            vector,
            "v -",
            vectorBaseArray[index * 9 + 2],
            " ",
            vectorBaseArray[index * 9 + 1],
            " ",
            vectorBaseArray[index * 9],
            "\n"
        );
        vectorZInversion = string.concat(
            vectorZInversion,
            "v -",
            vectorBaseArray[index * 9 + 2],
            " -",
            vectorBaseArray[index * 9 + 1],
            " ",
            vectorBaseArray[index * 9],
            "\n"
        );

        for (uint256 i = 2; i > 0; i--) {
            vector = string.concat(
                vector,
                "v -",
                vectorBaseArray[index * 9 + i * 3],
                " ",
                vectorBaseArray[index * 9 + i * 3 + 1],
                " ",
                vectorBaseArray[index * 9 + i * 3 + 2],
                "\n"
            );
            vectorZInversion = string.concat(
                vectorZInversion,
                "v -",
                vectorBaseArray[index * 9 + i * 3],
                " -",
                vectorBaseArray[index * 9 + i * 3 + 1],
                " ",
                vectorBaseArray[index * 9 + i * 3 + 2],
                "\n"
            );
        }

        for (uint256 i = 0; i < 3; i++) {
            if (
                keccak256(
                    abi.encodePacked(vectorBaseArray[index * 9 + i * 3 + 2])
                ) == keccak256(abi.encodePacked("0.0"))
            ) {
                vector = string.concat(
                    vector,
                    "v -",
                    vectorBaseArray[index * 9 + i * 3],
                    " ",
                    vectorBaseArray[index * 9 + i * 3 + 1],
                    " ",
                    vectorBaseArray[index * 9 + i * 3 + 2],
                    "\n"
                );
                vectorZInversion = string.concat(
                    vectorZInversion,
                    "v -",
                    vectorBaseArray[index * 9 + i * 3],
                    " -",
                    vectorBaseArray[index * 9 + i * 3 + 1],
                    " ",
                    vectorBaseArray[index * 9 + i * 3 + 2],
                    "\n"
                );
            } else {
                vector = string.concat(
                    vector,
                    "v -",
                    vectorBaseArray[index * 9 + i * 3],
                    " ",
                    vectorBaseArray[index * 9 + i * 3 + 1],
                    " -",
                    vectorBaseArray[index * 9 + i * 3 + 2],
                    "\n"
                );
                vectorZInversion = string.concat(
                    vectorZInversion,
                    "v -",
                    vectorBaseArray[index * 9 + i * 3],
                    " -",
                    vectorBaseArray[index * 9 + i * 3 + 1],
                    " -",
                    vectorBaseArray[index * 9 + i * 3 + 2],
                    "\n"
                );
            }
        }

        vector = string.concat(
            vector,
            "v ",
            vectorBaseArray[index * 9 + 2],
            " ",
            vectorBaseArray[index * 9 + 1],
            " -",
            vectorBaseArray[index * 9],
            "\n"
        );
        vectorZInversion = string.concat(
            vectorZInversion,
            "v ",
            vectorBaseArray[index * 9 + 2],
            " -",
            vectorBaseArray[index * 9 + 1],
            " -",
            vectorBaseArray[index * 9],
            "\n"
        );

        for (uint256 i = 2; i > 0; i--) {
            vector = string.concat(
                vector,
                "v ",
                vectorBaseArray[index * 9 + i * 3],
                " ",
                vectorBaseArray[index * 9 + i * 3 + 1],
                " -",
                vectorBaseArray[index * 9 + i * 3 + 2],
                "\n"
            );
            vectorZInversion = string.concat(
                vectorZInversion,
                "v ",
                vectorBaseArray[index * 9 + i * 3],
                " -",
                vectorBaseArray[index * 9 + i * 3 + 1],
                " -",
                vectorBaseArray[index * 9 + i * 3 + 2],
                "\n"
            );
        }

        return (vector, vectorZInversion);
    }

    function createVnVector(
        uint256 index,
        string[] memory vectorBaseArray,
        string memory vector,
        string memory vectorZInversion
    ) public pure returns (string memory, string memory) {
        for (uint256 i = 0; i < 3; i++) {
            vector = string.concat(
                vector,
                "vn -",
                vectorBaseArray[index * 9 + i * 3],
                " ",
                vectorBaseArray[index * 9 + i * 3 + 1],
                " ",
                vectorBaseArray[index * 9 + i * 3 + 2],
                "\n"
            );
            vectorZInversion = string.concat(
                vectorZInversion,
                "vn -",
                vectorBaseArray[index * 9 + i * 3],
                " -",
                vectorBaseArray[index * 9 + i * 3 + 1],
                " ",
                vectorBaseArray[index * 9 + i * 3 + 2],
                "\n"
            );
        }
        for (uint256 i = 0; i < 3; i++) {
            vector = string.concat(
                vector,
                "vn -",
                vectorBaseArray[index * 9 + i * 3],
                " ",
                vectorBaseArray[index * 9 + i * 3 + 1],
                " -",
                vectorBaseArray[index * 9 + i * 3 + 2],
                "\n"
            );
            vectorZInversion = string.concat(
                vectorZInversion,
                "vn -",
                vectorBaseArray[index * 9 + i * 3],
                " -",
                vectorBaseArray[index * 9 + i * 3 + 1],
                " -",
                vectorBaseArray[index * 9 + i * 3 + 2],
                "\n"
            );
        }
        for (uint256 i = 0; i < 3; i++) {
            vector = string.concat(
                vector,
                "vn ",
                vectorBaseArray[index * 9 + i * 3],
                " ",
                vectorBaseArray[index * 9 + i * 3 + 1],
                " -",
                vectorBaseArray[index * 9 + i * 3 + 2],
                "\n"
            );
            vectorZInversion = string.concat(
                vectorZInversion,
                "vn ",
                vectorBaseArray[index * 9 + i * 3],
                " -",
                vectorBaseArray[index * 9 + i * 3 + 1],
                " -",
                vectorBaseArray[index * 9 + i * 3 + 2],
                "\n"
            );
        }

        return (vector, vectorZInversion);
    }

    function createF(uint256 _divNumHorizontal, uint256 _divNum)
        public
        pure
        returns (string memory)
    {
        string memory fMesh;
        for (uint256 index = 1; index <= _divNum; index++) {
            string memory indexString = Strings.toString(index);
            if (index < _divNumHorizontal) {
                fMesh = string.concat(
                    fMesh,
                    "f ",
                    Strings.toString(index + 1),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    " 1/",
                    indexString,
                    "/",
                    indexString,
                    " ",
                    Strings.toString(index + 2),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    "\n"
                );
            } else if (index == _divNumHorizontal) {
                fMesh = string.concat(
                    fMesh,
                    "f ",
                    Strings.toString(index + 1),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    " 1/",
                    indexString,
                    "/",
                    indexString,
                    " ",
                    Strings.toString(index - 10),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    "\n"
                );
            } else if (index == _divNum) {
                fMesh = string.concat(
                    fMesh,
                    "f ",
                    Strings.toString(index - _divNumHorizontal * 2 + 2),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    " 62/",
                    indexString,
                    "/",
                    indexString,
                    " ",
                    Strings.toString(index - _divNumHorizontal + 1),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    "\n"
                );
            } else if (index >= _divNum - _divNumHorizontal + 1) {
                fMesh = string.concat(
                    fMesh,
                    "f ",
                    Strings.toString(index - _divNumHorizontal + 2),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    " 62/",
                    indexString,
                    "/",
                    indexString,
                    " ",
                    Strings.toString(index - _divNumHorizontal + 1),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    "\n"
                );
            } else if (index % _divNumHorizontal == 0) {
                fMesh = string.concat(
                    fMesh,
                    "f ",
                    Strings.toString(index - _divNumHorizontal * 2 + 2),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    " ",
                    Strings.toString(index - _divNumHorizontal + 2),
                    "/",
                    indexString,
                    "/",
                    indexString
                );
                fMesh = string.concat(
                    fMesh,
                    " ",
                    Strings.toString(index + 1),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    " ",
                    Strings.toString(index - _divNumHorizontal + 1),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    "\n"
                );
            } else {
                fMesh = string.concat(
                    fMesh,
                    "f ",
                    Strings.toString(index - _divNumHorizontal + 2),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    " ",
                    Strings.toString(index + 2),
                    "/",
                    indexString,
                    "/",
                    indexString
                );
                fMesh = string.concat(
                    fMesh,
                    " ",
                    Strings.toString(index + 1),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    " ",
                    Strings.toString(index - _divNumHorizontal + 1),
                    "/",
                    indexString,
                    "/",
                    indexString,
                    "\n"
                );
            }
        }

        return fMesh;
    }

    function createVector(
        string memory _vectorKind,
        uint256 divNumVertical,
        string[] memory baseVVector
    ) public pure returns (string memory) {
        string memory vector;
        string memory endZInversionVector;
        string memory vectorZInversion;
        for (uint256 i = 0; i < divNumVertical / 2; i++) {
            vector = string.concat(
                vector,
                _vectorKind,
                " ",
                baseVVector[i * 9],
                " ",
                baseVVector[i * 9 + 1],
                " ",
                baseVVector[i * 9 + 2],
                "\n"
            ); // objテキストとして最後に返す文字列
            vector = string.concat(
                vector,
                _vectorKind,
                " ",
                baseVVector[i * 9 + 3],
                " ",
                baseVVector[i * 9 + 4],
                " ",
                baseVVector[i * 9 + 5],
                "\n"
            ); // objテキストとして最後に返す文字列
            vector = string.concat(
                vector,
                _vectorKind,
                " ",
                baseVVector[i * 9 + 6],
                " ",
                baseVVector[i * 9 + 7],
                " ",
                baseVVector[i * 9 + 8],
                "\n"
            ); // objテキストとして最後に返す文字列
            endZInversionVector = string.concat(
                _vectorKind,
                " ",
                baseVVector[i * 9],
                " -",
                baseVVector[i * 9 + 1],
                " ",
                baseVVector[i * 9 + 2],
                "\n"
            );
            endZInversionVector = string.concat(
                endZInversionVector,
                _vectorKind,
                " ",
                baseVVector[i * 9 + 3],
                " -",
                baseVVector[i * 9 + 4],
                " ",
                baseVVector[i * 9 + 5],
                "\n"
            );
            endZInversionVector = string.concat(
                endZInversionVector,
                _vectorKind,
                " ",
                baseVVector[i * 9 + 6],
                " -",
                baseVVector[i * 9 + 7],
                " ",
                baseVVector[i * 9 + 8],
                "\n"
            );

            if (
                keccak256(abi.encodePacked(_vectorKind)) ==
                keccak256(abi.encodePacked("v"))
            ) {
                (vector, endZInversionVector) = createVVector(
                    i,
                    baseVVector,
                    vector,
                    endZInversionVector
                );
                if (divNumVertical / 2 - 1 != i) {
                    vectorZInversion = string.concat(
                        endZInversionVector,
                        vectorZInversion
                    );
                }
            } else {
                (vector, endZInversionVector) = createVnVector(
                    i,
                    baseVVector,
                    vector,
                    endZInversionVector
                );
                vectorZInversion = string.concat(
                    endZInversionVector,
                    vectorZInversion
                );
            }
        }

        vector = string.concat(vector, vectorZInversion);

        return vector;
    }
}
