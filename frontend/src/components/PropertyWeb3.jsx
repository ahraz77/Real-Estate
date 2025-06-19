import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/RealEstateRegistry.json";

const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Local Hardhat deployment

export default function PropertyWeb3() {
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [status, setStatus] = useState("");
  const [queryId, setQueryId] = useState("");
  const [propertyInfo, setPropertyInfo] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function fetchActivities() {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);
        // Fetch PropertyRegistered events
        const registered = await contract.queryFilter(
          contract.filters["PropertyRegistered(uint256,address,string,uint256)"](),
          0,
          "latest"
        );
        // Fetch PropertyTransferred events
        const transferred = await contract.queryFilter(
          contract.filters["PropertyTransferred(uint256,address,address)"](),
          0,
          "latest"
        );
        // Format events
        const regEvents = registered.map(e => ({
          type: "Registered",
          id: e.args.propertyId.toString(),
          owner: e.args.owner,
          location: e.args.location,
          price: e.args.price.toString(),
          tx: e.transactionHash,
          block: e.blockNumber
        }));
        const transEvents = transferred.map(e => ({
          type: "Transferred",
          id: e.args.propertyId.toString(),
          from: e.args.from,
          to: e.args.to,
          tx: e.transactionHash,
          block: e.blockNumber
        }));
        // Merge and sort by block number (desc)
        const all = [...regEvents, ...transEvents].sort((a, b) => b.block - a.block);
        setActivities(all.slice(0, 10)); // Show last 10
      } catch (err) {
        // Ignore errors if not connected
      }
    }
    fetchActivities();
  }, [status]);

  async function registerProperty(e) {
    e.preventDefault();
    if (!window.ethereum) return setStatus("MetaMask required!");
    setStatus("Waiting for transaction...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
      const tx = await contract.registerProperty(location, price);
      await tx.wait();
      setStatus("Property registered!");
    } catch (err) {
      setStatus("Error: " + (err?.reason || err?.message || err));
    }
  }

  async function transferProperty(e) {
    e.preventDefault();
    if (!window.ethereum) return setStatus("MetaMask required!");
    setStatus("Waiting for transaction...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
      const tx = await contract.transferProperty(propertyId, newOwner);
      await tx.wait();
      setStatus("Property transferred!");
    } catch (err) {
      setStatus("Error: " + (err?.reason || err?.message || err));
    }
  }

  async function getPropertyInfo(e) {
    e.preventDefault();
    setStatus("");
    setPropertyInfo(null);
    if (!window.ethereum) return setStatus("MetaMask required!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);
      const prop = await contract.getProperty(queryId);
      setPropertyInfo(prop);
    } catch (err) {
      setStatus("Error: " + (err?.reason || err?.message || err));
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-2xl mt-12 border border-blue-200">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-800 tracking-tight drop-shadow">Web3 Property Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <form onSubmit={registerProperty} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Register Property</h3>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none" required />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Price</label>
            <input value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none" required type="number" min="0" />
          </div>
          <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition">Register</button>
        </form>
        <form onSubmit={transferProperty} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4 border border-blue-100">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Transfer Property</h3>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Property ID</label>
            <input value={propertyId} onChange={e => setPropertyId(e.target.value)} className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none" required />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">New Owner Address</label>
            <input value={newOwner} onChange={e => setNewOwner(e.target.value)} className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none" required />
          </div>
          <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition">Transfer</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <form onSubmit={getPropertyInfo} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4 border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Get Property Info</h3>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Property ID</label>
            <input value={queryId} onChange={e => setQueryId(e.target.value)} className="w-full border border-purple-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none" required />
          </div>
          <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-lg font-semibold hover:bg-purple-800 transition">Get Info</button>
        </form>
        {propertyInfo && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow p-6 border border-purple-200 flex flex-col gap-2 justify-center">
            <h4 className="font-bold text-purple-800 mb-2">Property Details</h4>
            <div><b>ID:</b> {propertyInfo.id.toString()}</div>
            <div><b>Location:</b> {propertyInfo.location}</div>
            <div><b>Price:</b> {propertyInfo.price.toString()}</div>
            <div><b>Owner:</b> <span className="break-all">{propertyInfo.owner}</span></div>
          </div>
        )}
      </div>
      {activities.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-center text-blue-700 text-lg">Recent Activities</h3>
          <ul className="bg-blue-50 rounded-2xl p-4 text-sm shadow border border-blue-100 divide-y divide-blue-100">
            {activities.map((a, i) => (
              <li key={i} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  {a.type === "Registered" ? (
                    <span className="text-blue-800"><b>Registered</b> property #{a.id} by <span className="font-mono">{a.owner.slice(0, 8)}...</span> at <span className="font-semibold">{a.location}</span> (Price: {a.price})</span>
                  ) : (
                    <span className="text-green-800"><b>Transferred</b> property #{a.id} from <span className="font-mono">{a.from.slice(0, 8)}...</span> to <span className="font-mono">{a.to.slice(0, 8)}...</span></span>
                  )}
                </div>
                <div className="text-gray-400 text-xs">Block: {a.block} | Tx: {a.tx.slice(0, 10)}...</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {status && <div className="mt-6 text-center text-base text-blue-700 font-semibold animate-pulse">{status}</div>}
    </div>
  );
}
