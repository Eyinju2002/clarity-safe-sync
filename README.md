# SafeSync

A secure tool for syncing and managing digital assets on the Stacks blockchain.

## Features
- Secure asset storage with multi-signature requirements
- Asset synchronization across approved addresses 
- Version control and history tracking
- Access control and permissions management
- Asset version updating with history preservation

## Usage
The contract provides the following main functions:
- store-asset: Store a new digital asset
- update-asset: Update an existing asset while preserving version history
- sync-asset: Sync an asset to approved addresses
- approve-address: Add an approved address for syncing
- revoke-address: Remove an approved address

## Getting Started
1. Deploy the contract
2. Use store-asset to add assets
3. Manage approved addresses
4. Update and sync assets as needed

## New Features
- Added asset versioning system that tracks latest version
- New update-asset function to modify existing assets
- Version history preserved across updates
