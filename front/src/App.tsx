import { BaseProvider } from '@metamask/providers';
import { ethers } from "ethers";
import React,{ useState, useEffect, createContext, useContext } from "react";
import { Canvas, useFrame, useLoader } from '@react-three/fiber';

import './App.css';
import abi from "./utils/Obj.json";
import { OBJLoader } from "./component/module/OBJLoader";
import Header from "./component/Header";
import Three from "./component/Three";

declare global {
  interface Window {
    ethereum: BaseProvider;
  }
}

function Scene(objData: string) {
  const obj = useLoader(OBJLoader, objData)
  return <primitive object={obj} />
}

// Animation
function ObjAnimation(objData: any) {
  const objAnimation: any = React.useRef();

  useFrame(({ clock }) => {
    const animation = clock.getElapsedTime();
    objAnimation.current.rotation.y = animation;
  });

  return (
    <mesh ref={objAnimation}>
      { Scene(objData[0]) }
      <meshStandardMaterial color="red"/>
    </mesh>
  );
}

// 他のComponentとデータを共有
export const DataContext = createContext({} as {
  connectWallet: () => void
  currentAccount: string
  setCurrentAccount: React.Dispatch<React.SetStateAction<string>>
})

function App() {

    const contractAddress = "0x664aA5273306a66a0534Ee3B39812F42aA28d638";

    // ユーザーのパブリックウォレットを保存するために使用する状態変数を定義
    const [currentAccount, setCurrentAccount] = useState("");

    // OBJデータを格納する配列
    const [objData, setObjData] = useState<string[]>([]);

    interface GhostInterface {
      name: string;
      description: string;
      material: string;
      ghostId: number;
      vectorDataIndex: number;
    }

    // 全Ghostデータ保存
    const [allGhost, setAllGhost] = useState<GhostInterface[]>([]);

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
    const writeGhost = async (
      name: string, description: string, material: string, divNumHorizontal: number
    ) => {
      try {
        console.log(`name: ${name}`);
        console.log(`description: ${description}`);
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

          const readGhostContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          const ghostData = await readGhostContract.readGhost(ghostId, _divNumHorizontal);
          if (ghostData[4] > objData.length) {
            console.log(ghostData[0])
            setObjData((objData => [...objData, ghostData[0]]));
          }
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
    }, []);

    return (
      <div className="App">

        {/* Header */}
        <DataContext.Provider value={{
          connectWallet, currentAccount, setCurrentAccount}}>
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
              onClick={() => writeGhost(
                "First Ghost",
                "First Ghost Description",
                "First Ghost Material Data",
                12
              )}>
                Write Ghost
              </button>
              <button data-mdb-ripple="true" data-mdb-ripple-color="light" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => readGhost(
                1,
                12
              )}>
                Read Ghost
              </button>
            </div>
          </div>
          <div className="grid gap-5 row-gap-5 mb-8 lg:grid-cols-4 sm:grid-cols-2">
            <a
              href="/"
              aria-label="View Item"
              className="inline-block overflow-hidden duration-300 transform bg-white rounded shadow-sm hover:-translate-y-2"
            >
              <div className="flex flex-col h-full">
              <Canvas>
                <ambientLight intensity={0.1} />
                <directionalLight position={[0, 0, 5]} />
                <pointLight position={[10, 10, 10]} />
                {/* <Three /> */}
                { ObjAnimation(objData) }
              </Canvas>
                <div className="flex-grow border border-t-0 rounded-b">
                  <div className="p-5">
                    <h6 className="mb-2 font-semibold leading-5">
                      The doctor said
                    </h6>
                    <p className="text-sm text-gray-900">
                      Sportacus andrew weatherall goose Refined gentlemen super
                      mario des lynam alpha trion zap rowsdower.
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a
              href="/"
              aria-label="View Item"
              className="inline-block overflow-hidden duration-300 transform bg-white rounded shadow-sm hover:-translate-y-2"
            >
              <div className="flex flex-col h-full">
                <img
                  src="https://images.pexels.com/photos/3182750/pexels-photo-3182750.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                  className="object-cover w-full h-48"
                  alt=""
                />
                <div className="flex-grow border border-t-0 rounded-b">
                  <div className="p-5">
                    <h6 className="mb-2 font-semibold leading-5">
                      Skate ipsum dolor
                    </h6>
                    <p className="text-sm text-gray-900">
                      Bulbasaur Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit.
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a
              href="/"
              aria-label="View Item"
              className="inline-block overflow-hidden duration-300 transform bg-white rounded shadow-sm hover:-translate-y-2"
            >
              <div className="flex flex-col h-full">
                <img
                  src="https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                  className="object-cover w-full h-48"
                  alt=""
                />
                <div className="flex-grow border border-t-0 rounded-b">
                  <div className="p-5">
                    <h6 className="mb-2 font-semibold leading-5">They urge you</h6>
                    <p className="text-sm text-gray-900">
                      A flower in my garden, a mystery in my panties. Heart attack
                      never stopped old Big Bear.
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a
              href="/"
              aria-label="View Item"
              className="inline-block overflow-hidden duration-300 transform bg-white rounded shadow-sm hover:-translate-y-2"
            >
              <div className="flex flex-col h-full">
                <img
                  src="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                  className="object-cover w-full h-48"
                  alt=""
                />
                <div className="flex-grow border border-t-0 rounded-b">
                  <div className="p-5">
                    <h6 className="mb-2 font-semibold leading-5">
                      Baseball ipsum dolor
                    </h6>
                    <p className="text-sm text-gray-900">
                      Bro ipsum dolor sit amet gaper backside single track, manny
                      Bike epic clipless. Schraeder drop gondy.
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a
              href="/"
              aria-label="View Item"
              className="inline-block overflow-hidden duration-300 transform bg-white rounded shadow-sm hover:-translate-y-2"
            >
              <div className="flex flex-col h-full">
                <img
                  src="https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;w=500"
                  className="object-cover w-full h-48"
                  alt=""
                />
                <div className="flex-grow border border-t-0 rounded-b">
                  <div className="p-5">
                    <h6 className="mb-2 font-semibold leading-5">
                      The doctor said
                    </h6>
                    <p className="text-sm text-gray-900">
                      Sportacus andrew weatherall goose Refined gentlemen super
                      mario des lynam alpha trion zap rowsdower.
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a
              href="/"
              aria-label="View Item"
              className="inline-block overflow-hidden duration-300 transform bg-white rounded shadow-sm hover:-translate-y-2"
            >
              <div className="flex flex-col h-full">
                <img
                  src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                  className="object-cover w-full h-48"
                  alt=""
                />
                <div className="flex-grow border border-t-0 rounded-b">
                  <div className="p-5">
                    <h6 className="mb-2 font-semibold leading-5">
                      Skate ipsum dolor
                    </h6>
                    <p className="text-sm text-gray-900">
                      Bulbasaur Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit.
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a
              href="/"
              aria-label="View Item"
              className="inline-block overflow-hidden duration-300 transform bg-white rounded shadow-sm hover:-translate-y-2"
            >
              <div className="flex flex-col h-full">
                <img
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                  className="object-cover w-full h-48"
                  alt=""
                />
                <div className="flex-grow border border-t-0 rounded-b">
                  <div className="p-5">
                    <h6 className="mb-2 font-semibold leading-5">They urge you</h6>
                    <p className="text-sm text-gray-900">
                      A flower in my garden, a mystery in my panties. Heart attack
                      never stopped old Big Bear.
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a
              href="/"
              aria-label="View Item"
              className="inline-block overflow-hidden duration-300 transform bg-white rounded shadow-sm hover:-translate-y-2"
            >
              <div className="flex flex-col h-full">
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                  className="object-cover w-full h-48"
                  alt=""
                />
                <div className="flex-grow border border-t-0 rounded-b">
                  <div className="p-5">
                    <h6 className="mb-2 font-semibold leading-5">
                      Baseball ipsum dolor
                    </h6>
                    <p className="text-sm text-gray-900">
                      Bro ipsum dolor sit amet gaper backside single track, manny
                      Bike epic clipless. Schraeder drop gondy.
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
}

export default App;
