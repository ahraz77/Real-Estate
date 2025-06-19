// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title RealEstateRegistry
 * @dev A simple smart contract for registering and transferring real estate properties.
 */
contract RealEstateRegistry {
    struct Property {
        uint256 id;
        string location;
        uint256 price;
        address owner;
    }

    uint256 public nextPropertyId;
    mapping(uint256 => Property) public properties;
    mapping(address => uint256[]) public ownerToProperties;

    event PropertyRegistered(uint256 indexed propertyId, address indexed owner, string location, uint256 price);
    event PropertyTransferred(uint256 indexed propertyId, address indexed from, address indexed to);

    function registerProperty(string memory location, uint256 price) public {
        uint256 propertyId = nextPropertyId++;
        properties[propertyId] = Property(propertyId, location, price, msg.sender);
        ownerToProperties[msg.sender].push(propertyId);
        emit PropertyRegistered(propertyId, msg.sender, location, price);
    }

    function transferProperty(uint256 propertyId, address newOwner) public {
        require(properties[propertyId].owner == msg.sender, "Only the owner can transfer this property");
        require(newOwner != address(0), "Invalid new owner address");
        
        // Remove property from current owner's list
        uint256[] storage ownerProps = ownerToProperties[msg.sender];
        for (uint256 i = 0; i < ownerProps.length; i++) {
            if (ownerProps[i] == propertyId) {
                ownerProps[i] = ownerProps[ownerProps.length - 1];
                ownerProps.pop();
                break;
            }
        }
        
        // Transfer ownership
        properties[propertyId].owner = newOwner;
        ownerToProperties[newOwner].push(propertyId);
        emit PropertyTransferred(propertyId, msg.sender, newOwner);
    }

    function getPropertiesByOwner(address owner) public view returns (uint256[] memory) {
        return ownerToProperties[owner];
    }

    function getProperty(uint256 propertyId) public view returns (Property memory) {
        return properties[propertyId];
    }
}
