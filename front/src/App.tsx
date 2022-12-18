import { BaseProvider } from '@metamask/providers';
import { ethers } from "ethers";
import React,{ useState, useEffect, createContext } from "react";
import { Canvas } from '@react-three/fiber';

import './App.css';
import abi from "./utils/Obj.json";
import Header from "./component/Header";
import Three from "./component/Three";
import { Buffer } from 'buffer'

declare global {
  interface Window {
    ethereum: BaseProvider;
  }
}

// 他のComponentとデータを共有
export const DataContext = createContext({} as {
  connectWallet: () => void
  currentAccount: string
  setCurrentAccount: React.Dispatch<React.SetStateAction<string>>
  objItem: string
})

function App() {

    const contractAddress = "0x452882885cCe1dCF449878Eda8d9D53d077B4319";

    // ユーザーのパブリックウォレットを保存するために使用する状態変数を定義
    const [currentAccount, setCurrentAccount] = useState("");

    // OBJデータを格納する配列
    const [objData, setObjData] = useState<string[]>([]);

    // NFTの名前を格納する配列
    const [objNFTName, setObjNFTName] = useState<string[]>([]);

    interface GhostInterface {
      name: string;
      description: string;
      material: string;
      ghostId: number;
      vectorDataIndex: number;
    }

    // 全Ghostデータ保存
    const [allGhost, setAllGhost] = useState<GhostInterface[]>([]);

    // 全Ghostデータ保存
    const [allGhostObj, setAllGhostObj] = useState<string[]>([]);

    interface VectorDataInterface {
      divNumHorizontal: number;
      divNumVertical: number;
      baseVVector: string[];
      baseVnVector: string[];
    }

    // 全Vectorデータ保存
    const [allVector, setAllVector] = useState<VectorDataInterface[]>([]);

    // ABIを参照
    const contractABI = abi.abi;

    const objItem = "";


    // connectWalletメソッドを実装
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          alert("Get MetaMask!");
          return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", []);

        console.log("Connected: ", accounts[0]);
        if (accounts != null ) {
          setCurrentAccount(accounts[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getAllGhost = async () => {
      const { ethereum } = window;

      try {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          // コントラクトからgetAllPostメソッドを呼び出す
          const ghosts = await contract.getAllGhost();
          const ghostCleaned = ghosts.map((oneGhost: any) => {
            return {
              name: oneGhost.name,
              description: oneGhost.description,
              material: oneGhost.material,
              ghostId: oneGhost.ghostId,
              vectorDataIndex: oneGhost.vectorDataIndex,
            };
          });
          console.log(ghostCleaned)
          // React Stateにデータを格納
          setAllGhost(ghostCleaned);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getAllGhostObj = async () => {
      const { ethereum } = window;

      try {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          // コントラクトからgetAllPostメソッドを呼び出す
          const ghostsObj = await contract.getAllObjData();
          console.log(ghostsObj)
          setAllGhostObj(ghostsObj);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getAllVector = async () => {
      const { ethereum } = window;

      try {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          // コントラクトからgetAllPostメソッドを呼び出す
          const vectors = await contract.getAllVector();
          const vectorCleaned = vectors.map((oneVector: any) => {
            return {
              divNumHorizontal: oneVector.divNumHorizontal,
              divNumVertical: oneVector.divNumVertical,
              baseVVector: oneVector.baseVVector,
              baseVnVector: oneVector.baseVnVector,
            };
          });
          console.log(vectorCleaned)
          // React Stateにデータを格納
          setAllVector(vectorCleaned);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    // window.ethereumにアクセスできることを確認
    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          console.log("Get your Metamask ready!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }
        // ユーザーのウォレットへのアクセスが許可されているかどうかを確認
        // アカウントがあれば一番目のアドレスを表示。
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
          getAllGhost();
          getAllVector();
        } else {
          console.log("No authorized account found");
        }
      } catch (error) {
        console.log(error);
      }
    };

    // writeGhost
    const addVectorData = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          const ghostContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          await ghostContract.addVectorData(12, 6,
            ["0.5", "0.866025", "0.0", "0.433013", "0.866025", "0.25", "0.25", "0.866025", "0.433013", "0.866026", "0.5", "0.0", "0.750001", "0.5", "0.433013", "0.433013", "0.5", "0.750001", "1.0", "0.0", "0.0", "0.866025", "0.0", "0.5", "0.5", "0.0", "0.866025"],
            ["0.2582", "0.9636", "0.0692", "0.189", "0.9636", "0.189", "0.0692", "0.9636", "0.2582", "0.6947", "0.6947", "0.1862", "0.5085", "0.6947", "0.5086", "0.1861", "0.6947", "0.6947", "0.9351", "0.2506", "0.2506", "0.6845", "0.2506", "0.6846", "0.2505", "0.2506", "0.9351"]
        );
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    // writeGhost
    const writeGhost = async (
      name: string, description: string, material: string, divNumHorizontal: number
    ) => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          const writeGhostContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          await writeGhostContract.writeGhost(name, description, material, divNumHorizontal);
          console.log("name: " + name)
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    // readGhost
    const readGhost = async (ghostId: number, _divNumHorizontal: number) => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          const ghostContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          const ghostData = await ghostContract.readGhost(ghostId, _divNumHorizontal);
          console.log(ghostData)
          // if (ghostData[4] > objData.length) {
          //   console.log(ghostData[0])
          //   setObjData((objData => [...objData, ghostData[0]]));
          // }
          if (!objData.includes(ghostData[0])) {
            console.log(ghostData[0])
            setObjData((objData => [...objData, ghostData[0]]));
          }
          console.log(objData)
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    // ghostNftMint
    const mintNft = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          const ghostContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          const objData = "data:model/obj;base64,IyBCbGVuZGVyIHYzLjIuMiBPQkogRmlsZTogJycKIyB3d3cuYmxlbmRlci5vcmcKbXRsbGliIHNwaGVyZV8xMl82Lm10bApvIOeQg1/nkIMuMDAxCnYgLTAgMSAwCnYgMC41IDAuODY2MDI1IDAuMAp2IDAuNDMzMDEzIDAuODY2MDI1IDAuMjUKdiAwLjI1IDAuODY2MDI1IDAuNDMzMDEzCnYgLTAuMCAwLjg2NjAyNSAwLjUKdiAtMC4yNSAwLjg2NjAyNSAwLjQzMzAxMwp2IC0wLjQzMzAxMyAwLjg2NjAyNSAwLjI1CnYgLTAuNSAwLjg2NjAyNSAwLjAKdiAtMC40MzMwMTMgMC44NjYwMjUgLTAuMjUKdiAtMC4yNSAwLjg2NjAyNSAtMC40MzMwMTMKdiAwLjAgMC44NjYwMjUgLTAuNQp2IDAuMjUgMC44NjYwMjUgLTAuNDMzMDEzCnYgMC40MzMwMTMgMC44NjYwMjUgLTAuMjUKdiAwLjg2NjAyNiAwLjUgMC4wCnYgMC43NTAwMDEgMC41IDAuNDMzMDEzCnYgMC40MzMwMTMgMC41IDAuNzUwMDAxCnYgLTAuMCAwLjUgMC44NjYwMjYKdiAtMC40MzMwMTMgMC41IDAuNzUwMDAxCnYgLTAuNzUwMDAxIDAuNSAwLjQzMzAxMwp2IC0wLjg2NjAyNiAwLjUgMC4wCnYgLTAuNzUwMDAxIDAuNSAtMC40MzMwMTMKdiAtMC40MzMwMTMgMC41IC0wLjc1MDAwMQp2IDAuMCAwLjUgLTAuODY2MDI2CnYgMC40MzMwMTMgMC41IC0wLjc1MDAwMQp2IDAuNzUwMDAxIDAuNSAtMC40MzMwMTMKdiAxLjAgMC4wIDAuMAp2IDAuODY2MDI1IDAuMCAwLjUKdiAwLjUgMC4wIDAuODY2MDI1CnYgLTAuMCAwLjAgMS4wCnYgLTAuNSAwLjAgMC44NjYwMjUKdiAtMC44NjYwMjUgMC4wIDAuNQp2IC0xLjAgMC4wIDAuMAp2IC0wLjg2NjAyNSAwLjAgLTAuNQp2IC0wLjUgMC4wIC0wLjg2NjAyNQp2IDAuMCAwLjAgLTEuMAp2IDAuNSAwLjAgLTAuODY2MDI1CnYgMC44NjYwMjUgMC4wIC0wLjUKdiAwLjg2NjAyNiAtMC41IDAuMAp2IDAuNzUwMDAxIC0wLjUgMC40MzMwMTMKdiAwLjQzMzAxMyAtMC41IDAuNzUwMDAxCnYgLTAuMCAtMC41IDAuODY2MDI2CnYgLTAuNDMzMDEzIC0wLjUgMC43NTAwMDEKdiAtMC43NTAwMDEgLTAuNSAwLjQzMzAxMwp2IC0wLjg2NjAyNiAtMC41IDAuMAp2IC0wLjc1MDAwMSAtMC41IC0wLjQzMzAxMwp2IC0wLjQzMzAxMyAtMC41IC0wLjc1MDAwMQp2IDAuMCAtMC41IC0wLjg2NjAyNgp2IDAuNDMzMDEzIC0wLjUgLTAuNzUwMDAxCnYgMC43NTAwMDEgLTAuNSAtMC40MzMwMTMKdiAwLjUgLTAuODY2MDI1IDAuMAp2IDAuNDMzMDEzIC0wLjg2NjAyNSAwLjI1CnYgMC4yNSAtMC44NjYwMjUgMC40MzMwMTMKdiAtMC4wIC0wLjg2NjAyNSAwLjUKdiAtMC4yNSAtMC44NjYwMjUgMC40MzMwMTMKdiAtMC40MzMwMTMgLTAuODY2MDI1IDAuMjUKdiAtMC41IC0wLjg2NjAyNSAwLjAKdiAtMC40MzMwMTMgLTAuODY2MDI1IC0wLjI1CnYgLTAuMjUgLTAuODY2MDI1IC0wLjQzMzAxMwp2IDAuMCAtMC44NjYwMjUgLTAuNQp2IDAuMjUgLTAuODY2MDI1IC0wLjQzMzAxMwp2IDAuNDMzMDEzIC0wLjg2NjAyNSAtMC4yNQp2IDAgLTEgMAp2biAwLjI1ODIgMC45NjM2IDAuMDY5Mgp2biAwLjE4OSAwLjk2MzYgMC4xODkKdm4gMC4wNjkyIDAuOTYzNiAwLjI1ODIKdm4gLTAuMjU4MiAwLjk2MzYgMC4wNjkyCnZuIC0wLjE4OSAwLjk2MzYgMC4xODkKdm4gLTAuMDY5MiAwLjk2MzYgMC4yNTgyCnZuIC0wLjI1ODIgMC45NjM2IC0wLjA2OTIKdm4gLTAuMTg5IDAuOTYzNiAtMC4xODkKdm4gLTAuMDY5MiAwLjk2MzYgLTAuMjU4Mgp2biAwLjI1ODIgMC45NjM2IC0wLjA2OTIKdm4gMC4xODkgMC45NjM2IC0wLjE4OQp2biAwLjA2OTIgMC45NjM2IC0wLjI1ODIKdm4gMC42OTQ3IDAuNjk0NyAwLjE4NjIKdm4gMC41MDg1IDAuNjk0NyAwLjUwODYKdm4gMC4xODYxIDAuNjk0NyAwLjY5NDcKdm4gLTAuNjk0NyAwLjY5NDcgMC4xODYyCnZuIC0wLjUwODUgMC42OTQ3IDAuNTA4Ngp2biAtMC4xODYxIDAuNjk0NyAwLjY5NDcKdm4gLTAuNjk0NyAwLjY5NDcgLTAuMTg2Mgp2biAtMC41MDg1IDAuNjk0NyAtMC41MDg2CnZuIC0wLjE4NjEgMC42OTQ3IC0wLjY5NDcKdm4gMC42OTQ3IDAuNjk0NyAtMC4xODYyCnZuIDAuNTA4NSAwLjY5NDcgLTAuNTA4Ngp2biAwLjE4NjEgMC42OTQ3IC0wLjY5NDcKdm4gMC45MzUxIDAuMjUwNiAwLjI1MDYKdm4gMC42ODQ1IDAuMjUwNiAwLjY4NDYKdm4gMC4yNTA1IDAuMjUwNiAwLjkzNTEKdm4gLTAuOTM1MSAwLjI1MDYgMC4yNTA2CnZuIC0wLjY4NDUgMC4yNTA2IDAuNjg0Ngp2biAtMC4yNTA1IDAuMjUwNiAwLjkzNTEKdm4gLTAuOTM1MSAwLjI1MDYgLTAuMjUwNgp2biAtMC42ODQ1IDAuMjUwNiAtMC42ODQ2CnZuIC0wLjI1MDUgMC4yNTA2IC0wLjkzNTEKdm4gMC45MzUxIDAuMjUwNiAtMC4yNTA2CnZuIDAuNjg0NSAwLjI1MDYgLTAuNjg0Ngp2biAwLjI1MDUgMC4yNTA2IC0wLjkzNTEKdm4gMC45MzUxIC0wLjI1MDYgMC4yNTA2CnZuIDAuNjg0NSAtMC4yNTA2IDAuNjg0Ngp2biAwLjI1MDUgLTAuMjUwNiAwLjkzNTEKdm4gLTAuOTM1MSAtMC4yNTA2IDAuMjUwNgp2biAtMC42ODQ1IC0wLjI1MDYgMC42ODQ2CnZuIC0wLjI1MDUgLTAuMjUwNiAwLjkzNTEKdm4gLTAuOTM1MSAtMC4yNTA2IC0wLjI1MDYKdm4gLTAuNjg0NSAtMC4yNTA2IC0wLjY4NDYKdm4gLTAuMjUwNSAtMC4yNTA2IC0wLjkzNTEKdm4gMC45MzUxIC0wLjI1MDYgLTAuMjUwNgp2biAwLjY4NDUgLTAuMjUwNiAtMC42ODQ2CnZuIDAuMjUwNSAtMC4yNTA2IC0wLjkzNTEKdm4gMC42OTQ3IC0wLjY5NDcgMC4xODYyCnZuIDAuNTA4NSAtMC42OTQ3IDAuNTA4Ngp2biAwLjE4NjEgLTAuNjk0NyAwLjY5NDcKdm4gLTAuNjk0NyAtMC42OTQ3IDAuMTg2Mgp2biAtMC41MDg1IC0wLjY5NDcgMC41MDg2CnZuIC0wLjE4NjEgLTAuNjk0NyAwLjY5NDcKdm4gLTAuNjk0NyAtMC42OTQ3IC0wLjE4NjIKdm4gLTAuNTA4NSAtMC42OTQ3IC0wLjUwODYKdm4gLTAuMTg2MSAtMC42OTQ3IC0wLjY5NDcKdm4gMC42OTQ3IC0wLjY5NDcgLTAuMTg2Mgp2biAwLjUwODUgLTAuNjk0NyAtMC41MDg2CnZuIDAuMTg2MSAtMC42OTQ3IC0wLjY5NDcKdm4gMC4yNTgyIC0wLjk2MzYgMC4wNjkyCnZuIDAuMTg5IC0wLjk2MzYgMC4xODkKdm4gMC4wNjkyIC0wLjk2MzYgMC4yNTgyCnZuIC0wLjI1ODIgLTAuOTYzNiAwLjA2OTIKdm4gLTAuMTg5IC0wLjk2MzYgMC4xODkKdm4gLTAuMDY5MiAtMC45NjM2IDAuMjU4Mgp2biAtMC4yNTgyIC0wLjk2MzYgLTAuMDY5Mgp2biAtMC4xODkgLTAuOTYzNiAtMC4xODkKdm4gLTAuMDY5MiAtMC45NjM2IC0wLjI1ODIKdm4gMC4yNTgyIC0wLjk2MzYgLTAuMDY5Mgp2biAwLjE4OSAtMC45NjM2IC0wLjE4OQp2biAwLjA2OTIgLTAuOTYzNiAtMC4yNTgyCnVzZW10bCBOb25lCnMgb2ZmCmYgMi8xLzEgMS8xLzEgMy8xLzEKZiAzLzIvMiAxLzIvMiA0LzIvMgpmIDQvMy8zIDEvMy8zIDUvMy8zCmYgNS80LzQgMS80LzQgNi80LzQKZiA2LzUvNSAxLzUvNSA3LzUvNQpmIDcvNi82IDEvNi82IDgvNi82CmYgOC83LzcgMS83LzcgOS83LzcKZiA5LzgvOCAxLzgvOCAxMC84LzgKZiAxMC85LzkgMS85LzkgMTEvOS85CmYgMTEvMTAvMTAgMS8xMC8xMCAxMi8xMC8xMApmIDEyLzExLzExIDEvMTEvMTEgMTMvMTEvMTEKZiAxMy8xMi8xMiAxLzEyLzEyIDIvMTIvMTIKZiAzLzEzLzEzIDE1LzEzLzEzIDE0LzEzLzEzIDIvMTMvMTMKZiA0LzE0LzE0IDE2LzE0LzE0IDE1LzE0LzE0IDMvMTQvMTQKZiA1LzE1LzE1IDE3LzE1LzE1IDE2LzE1LzE1IDQvMTUvMTUKZiA2LzE2LzE2IDE4LzE2LzE2IDE3LzE2LzE2IDUvMTYvMTYKZiA3LzE3LzE3IDE5LzE3LzE3IDE4LzE3LzE3IDYvMTcvMTcKZiA4LzE4LzE4IDIwLzE4LzE4IDE5LzE4LzE4IDcvMTgvMTgKZiA5LzE5LzE5IDIxLzE5LzE5IDIwLzE5LzE5IDgvMTkvMTkKZiAxMC8yMC8yMCAyMi8yMC8yMCAyMS8yMC8yMCA5LzIwLzIwCmYgMTEvMjEvMjEgMjMvMjEvMjEgMjIvMjEvMjEgMTAvMjEvMjEKZiAxMi8yMi8yMiAyNC8yMi8yMiAyMy8yMi8yMiAxMS8yMi8yMgpmIDEzLzIzLzIzIDI1LzIzLzIzIDI0LzIzLzIzIDEyLzIzLzIzCmYgMi8yNC8yNCAxNC8yNC8yNCAyNS8yNC8yNCAxMy8yNC8yNApmIDE1LzI1LzI1IDI3LzI1LzI1IDI2LzI1LzI1IDE0LzI1LzI1CmYgMTYvMjYvMjYgMjgvMjYvMjYgMjcvMjYvMjYgMTUvMjYvMjYKZiAxNy8yNy8yNyAyOS8yNy8yNyAyOC8yNy8yNyAxNi8yNy8yNwpmIDE4LzI4LzI4IDMwLzI4LzI4IDI5LzI4LzI4IDE3LzI4LzI4CmYgMTkvMjkvMjkgMzEvMjkvMjkgMzAvMjkvMjkgMTgvMjkvMjkKZiAyMC8zMC8zMCAzMi8zMC8zMCAzMS8zMC8zMCAxOS8zMC8zMApmIDIxLzMxLzMxIDMzLzMxLzMxIDMyLzMxLzMxIDIwLzMxLzMxCmYgMjIvMzIvMzIgMzQvMzIvMzIgMzMvMzIvMzIgMjEvMzIvMzIKZiAyMy8zMy8zMyAzNS8zMy8zMyAzNC8zMy8zMyAyMi8zMy8zMwpmIDI0LzM0LzM0IDM2LzM0LzM0IDM1LzM0LzM0IDIzLzM0LzM0CmYgMjUvMzUvMzUgMzcvMzUvMzUgMzYvMzUvMzUgMjQvMzUvMzUKZiAxNC8zNi8zNiAyNi8zNi8zNiAzNy8zNi8zNiAyNS8zNi8zNgpmIDI3LzM3LzM3IDM5LzM3LzM3IDM4LzM3LzM3IDI2LzM3LzM3CmYgMjgvMzgvMzggNDAvMzgvMzggMzkvMzgvMzggMjcvMzgvMzgKZiAyOS8zOS8zOSA0MS8zOS8zOSA0MC8zOS8zOSAyOC8zOS8zOQpmIDMwLzQwLzQwIDQyLzQwLzQwIDQxLzQwLzQwIDI5LzQwLzQwCmYgMzEvNDEvNDEgNDMvNDEvNDEgNDIvNDEvNDEgMzAvNDEvNDEKZiAzMi80Mi80MiA0NC80Mi80MiA0My80Mi80MiAzMS80Mi80MgpmIDMzLzQzLzQzIDQ1LzQzLzQzIDQ0LzQzLzQzIDMyLzQzLzQzCmYgMzQvNDQvNDQgNDYvNDQvNDQgNDUvNDQvNDQgMzMvNDQvNDQKZiAzNS80NS80NSA0Ny80NS80NSA0Ni80NS80NSAzNC80NS80NQpmIDM2LzQ2LzQ2IDQ4LzQ2LzQ2IDQ3LzQ2LzQ2IDM1LzQ2LzQ2CmYgMzcvNDcvNDcgNDkvNDcvNDcgNDgvNDcvNDcgMzYvNDcvNDcKZiAyNi80OC80OCAzOC80OC80OCA0OS80OC80OCAzNy80OC80OApmIDM5LzQ5LzQ5IDUxLzQ5LzQ5IDUwLzQ5LzQ5IDM4LzQ5LzQ5CmYgNDAvNTAvNTAgNTIvNTAvNTAgNTEvNTAvNTAgMzkvNTAvNTAKZiA0MS81MS81MSA1My81MS81MSA1Mi81MS81MSA0MC81MS81MQpmIDQyLzUyLzUyIDU0LzUyLzUyIDUzLzUyLzUyIDQxLzUyLzUyCmYgNDMvNTMvNTMgNTUvNTMvNTMgNTQvNTMvNTMgNDIvNTMvNTMKZiA0NC81NC81NCA1Ni81NC81NCA1NS81NC81NCA0My81NC81NApmIDQ1LzU1LzU1IDU3LzU1LzU1IDU2LzU1LzU1IDQ0LzU1LzU1CmYgNDYvNTYvNTYgNTgvNTYvNTYgNTcvNTYvNTYgNDUvNTYvNTYKZiA0Ny81Ny81NyA1OS81Ny81NyA1OC81Ny81NyA0Ni81Ny81NwpmIDQ4LzU4LzU4IDYwLzU4LzU4IDU5LzU4LzU4IDQ3LzU4LzU4CmYgNDkvNTkvNTkgNjEvNTkvNTkgNjAvNTkvNTkgNDgvNTkvNTkKZiAzOC82MC82MCA1MC82MC82MCA2MS82MC82MCA0OS82MC82MApmIDUxLzYxLzYxIDYyLzYxLzYxIDUwLzYxLzYxCmYgNTIvNjIvNjIgNjIvNjIvNjIgNTEvNjIvNjIKZiA1My82My82MyA2Mi82My82MyA1Mi82My82MwpmIDU0LzY0LzY0IDYyLzY0LzY0IDUzLzY0LzY0CmYgNTUvNjUvNjUgNjIvNjUvNjUgNTQvNjUvNjUKZiA1Ni82Ni82NiA2Mi82Ni82NiA1NS82Ni82NgpmIDU3LzY3LzY3IDYyLzY3LzY3IDU2LzY3LzY3CmYgNTgvNjgvNjggNjIvNjgvNjggNTcvNjgvNjgKZiA1OS82OS82OSA2Mi82OS82OSA1OC82OS82OQpmIDYwLzcwLzcwIDYyLzcwLzcwIDU5LzcwLzcwCmYgNjEvNzEvNzEgNjIvNzEvNzEgNjAvNzEvNzEKZiA1MC83Mi83MiA2Mi83Mi83MiA2MS83Mi83Mgo="

          const ghostData = await ghostContract.ghostNftMint(
              objData, "TestGhost", "Mint Test Ghost NFT", 12, 6
          );
          console.log(ghostData)
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    // tokenURI
    const getTokenURI = async (ghostId: number, _divNumHorizontal: number) => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          const ghostContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          // const readGhostData = await ghostContract.readGhost(ghostId, _divNumHorizontal);

          // console.log("readGhostData Done")

          // const ghostVectorData = await ghostContract.getVector(1);

          // console.log("ghostVectorData Done")

          // await ghostContract.ghostNftMint(
          //   readGhostData[0],
          //   readGhostData[1],
          //   readGhostData[2],
          //   ghostVectorData[0],
          //   ghostVectorData[1],
          // );

          const ghostTokenURI = await ghostContract.tokenURI(ghostId);
          const decodeghostTokenURI = JSON.parse(Buffer.from(ghostTokenURI.split(",")[1], 'base64').toString());
          const ghostObj = decodeghostTokenURI["animation_url"]
          const ghostName = decodeghostTokenURI["name"]

          console.log(ghostObj)

          // if (!objData.includes(ghostObj)) {
            setObjData((objData => [...objData, ghostObj]));
            setObjNFTName((objNFTName => [...objNFTName, ghostName]))
          // }
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    // WEBページロード時に実行。
    useEffect(() => {
      checkIfWalletIsConnected();
      getAllGhostObj()
    }, []);

    return (
      <div className="App">

        {/* Header */}
        <DataContext.Provider value={{
          connectWallet, currentAccount, setCurrentAccount, objItem}}>
          <Header />
        </DataContext.Provider>

        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
            <div>
              <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                Brand new
              </p>
            </div>
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
              <span className="relative inline-block">
                <svg
                  viewBox="0 0 52 24"
                  fill="currentColor"
                  className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
                >
                  <defs>
                    <pattern
                      id="7b568941-9ed0-4f49-85a0-5e21ca6c7ad6"
                      x="0"
                      y="0"
                      width=".135"
                      height=".30"
                    >
                      <circle cx="1" cy="1" r=".7" />
                    </pattern>
                  </defs>
                </svg>
              </span>{' '}
              Crypto Ghost
            </h2>
            <p className="text-base text-gray-700 md:text-lg">
              Full-on chain 3D NFT.
            </p>
            <div className="flex space-x-2 justify-center mt-3">
              <button data-mdb-ripple="true" data-mdb-ripple-color="light" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => addVectorData()}>
                Add Vector Data
              </button>
              <button data-mdb-ripple="true" data-mdb-ripple-color="light" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => writeGhost(
                "First Ghost",
                "First Ghost Description",
                "First Ghost Material Data",
                12
              )}>
                Write Ghost
              </button>
              <button data-mdb-ripple="true" data-mdb-ripple-color="light" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                // onClick={() => getTokenURI(
                //   1,
                //   12
                // )}>
                onClick={() => mintNft()}>
                Mint Ghost
              </button>
            </div>
          </div>
          <div className="grid gap-5 row-gap-5 mb-8 lg:grid-cols-4 sm:grid-cols-2">
            { allGhostObj.map((objItem: string, index: number) => {
              return (
                <a
                  href="/"
                  key={index}
                  aria-label="View Item"
                  className="inline-block overflow-hidden duration-300 transform bg-white rounded shadow-sm hover:-translate-y-2"
                >
                  <div className="flex flex-col h-full">
                  <Canvas>
                    <color attach="background" args={[0xf5f3fd]} />
                    <ambientLight intensity={0.1} />
                    <directionalLight position={[0, 0, 5]} />
                    <pointLight position={[10, 10, 10]} />
                    <DataContext.Provider value={{
                      connectWallet, currentAccount, setCurrentAccount, objItem}}>
                      <Three />
                    </DataContext.Provider>
                  </Canvas>
                    <div className="flex-grow border border-t-0 rounded-b">
                      <div className="p-5">
                        <h6 className="mb-2 font-semibold leading-5">
                          #{index+1} {objNFTName[index]}
                        </h6>
                        <p className="text-sm text-gray-900">
                          {objItem.substr(22, 25)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              )
            } )}
          </div>
        </div>
      </div>
    );
}

export default App;
