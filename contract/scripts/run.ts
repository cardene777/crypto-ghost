const hre = require("hardhat");

const main = async () => {
    const [owner] = await hre.ethers.getSigners();

    const VectorLibrary = await hre.ethers.getContractFactory("Vector");
    const vector = await VectorLibrary.deploy();
    await vector.deployed();


    const ObjFactory = await hre.ethers.getContractFactory("Obj", {
        signer: owner,
        libraries: {
            Vector: vector.address
        }
    });
    const ObjContract = await ObjFactory.deploy();
    const contract = await ObjContract.deployed();

    console.log("Contract deployed to: ", contract.address);
    console.log("owner address: ", owner.address);
    
    await contract.addVectorData(
    12, 6,
    ["0.5", "0.866025", "0.0", "0.433013", "0.866025", "0.25", "0.25", "0.866025", "0.433013", "0.866026", "0.5", "0.0", "0.750001", "0.5", "0.433013", "0.433013", "0.5", "0.750001", "1.0", "0.0", "0.0", "0.866025", "0.0", "0.5", "0.5", "0.0", "0.866025"],
    ["0.2582", "0.9636", "0.0692", "0.189", "0.9636", "0.189", "0.0692", "0.9636", "0.2582", "0.6947", "0.6947", "0.1862", "0.5085", "0.6947", "0.5086", "0.1861", "0.6947", "0.6947", "0.9351", "0.2506", "0.2506", "0.6845", "0.2506", "0.6846", "0.2505", "0.2506", "0.9351"]
    );
    console.log("VectorDataにデータ登録できました✨");

    await contract.writeGhost(
        "First Ghost",
        "First Ghost Description",
        "First Ghost Material Data",
        12
    );
    console.log("ゴーストのデータを追加できました✨")

    const ghostData = await contract.readGhost(
        1,
        12
    );
    console.log("ゴーストのデータとOBJファイルを取得できました✨")

    await contract.getAllGhost();
    console.log("ゴーストのデータを全て取得できました✨")

    await contract.ghostNftMint(ghostData[0], "TestGhost", "Mint Test Ghost NFT", 12, 6);
    console.log("GhostをMintしました✨")

    const tokenURI = await contract.tokenURI(1);
    console.log(tokenURI);

    const allGhostObj = await contract.getAllObjData()
    console.log(allGhostObj);
    console.log("MintしたGhostを全て取得できました✨")

    console.log("Contract deployed to: ", contract.address);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
