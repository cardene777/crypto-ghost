import { BaseProvider } from '@metamask/providers';
import { ethers } from "ethers";
import React,{ useState, useEffect } from "react";
import './App.css';

import abi from "./utils/Obj.json";

declare global {
  interface Window {
    ethereum: BaseProvider;
  }
}

function App() {

    const contractAddress = "0x7b90EE900eaf38eA399cff094Ac8397cb9Db9D62";

    // ユーザーのパブリックウォレットを保存するために使用する状態変数を定義
    const [currentAccount, setCurrentAccount] = useState("");

    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        console.log(`ghostId: ${ghostId}`);
        console.log(`_divNumHorizontal: ${_divNumHorizontal}`);
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
          console.log(`ghostData: ${ghostData}`)
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
        <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center">
              <a
                href="/"
                aria-label="Company"
                title="Company"
                className="inline-flex items-center mr-8"
              >
                <svg
                  className="w-8 text-deep-purple-accent-400"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  stroke="currentColor"
                  fill="none"
                >
                  <rect x="3" y="1" width="7" height="12" />
                  <rect x="3" y="17" width="7" height="6" />
                  <rect x="14" y="1" width="7" height="6" />
                  <rect x="14" y="11" width="7" height="12" />
                </svg>
                <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">
                  Grave3D
                </span>
              </a>
              <ul className="flex items-center hidden space-x-8 lg:flex">
                <li>
                  <a
                    href="/"
                    aria-label="Our product"
                    title="Our product"
                    className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                  >
                    Product
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    aria-label="Our product"
                    title="Our product"
                    className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    aria-label="Product pricing"
                    title="Product pricing"
                    className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    aria-label="About us"
                    title="About us"
                    className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                  >
                    About us
                  </a>
                </li>
              </ul>
            </div>
            <ul className="flex items-center hidden space-x-8 lg:flex">
                { !currentAccount &&
                  <li>
                    <button
                      // href="/"
                      className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                      onClick={connectWallet}
                    >
                      Connect Wallet
                    </button>
                  </li>
                }
                  { currentAccount &&
                  <li>
                    { currentAccount }
                  </li>
                }
            </ul>
            <div className="lg:hidden">
              <button
                aria-label="Open Menu"
                title="Open Menu"
                className="p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline hover:bg-deep-purple-50 focus:bg-deep-purple-50"
                onClick={() => setIsMenuOpen(true)}
              >
                <svg className="w-5 text-gray-600" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"
                  />
                  <path
                    fill="currentColor"
                    d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"
                  />
                  <path
                    fill="currentColor"
                    d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"
                  />
                </svg>
              </button>
              {isMenuOpen && (
                <div className="absolute top-0 left-0 w-full">
                  <div className="p-5 bg-white border rounded shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <a
                          href="/"
                          aria-label="Company"
                          title="Company"
                          className="inline-flex items-center"
                        >
                          <svg
                            className="w-8 text-deep-purple-accent-400"
                            viewBox="0 0 24 24"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeMiterlimit="10"
                            stroke="currentColor"
                            fill="none"
                          >
                            <rect x="3" y="1" width="7" height="12" />
                            <rect x="3" y="17" width="7" height="6" />
                            <rect x="14" y="1" width="7" height="6" />
                            <rect x="14" y="11" width="7" height="12" />
                          </svg>
                          <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">
                            Company
                          </span>
                        </a>
                      </div>
                      <div>
                        <button
                          aria-label="Close Menu"
                          title="Close Menu"
                          className="p-2 -mt-2 -mr-2 transition duration-200 rounded hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <svg className="w-5 text-gray-600" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <nav>
                      <ul className="space-y-4">
                        <li>
                          <a
                            href="/"
                            aria-label="Our product"
                            title="Our product"
                            className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                          >
                            Product
                          </a>
                        </li>
                        <li>
                          <a
                            href="/"
                            aria-label="Our product"
                            title="Our product"
                            className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                          >
                            Features
                          </a>
                        </li>
                        <li>
                          <a
                            href="/"
                            aria-label="Product pricing"
                            title="Product pricing"
                            className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                          >
                            Pricing
                          </a>
                        </li>
                        <li>
                          <a
                            href="/"
                            aria-label="About us"
                            title="About us"
                            className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                          >
                            About us
                          </a>
                        </li>
                          { !currentAccount &&
                            <li>
                              <button
                                className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                                onClick={connectWallet}
                              >
                                Connect Wallet
                              </button>
                            </li>
                          }
                          { currentAccount &&
                            <li>
                              { currentAccount.substr(0, 8) }...
                            </li>
                          }
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Header end */}
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
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
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
          <div className="text-center">
            <a
              href="/"
              className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md md:w-auto bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    );
}

export default App;
