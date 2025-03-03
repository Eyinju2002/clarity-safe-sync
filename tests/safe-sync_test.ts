[Previous tests remain unchanged...]

Clarinet.test({
  name: "Ensure revoke-address works correctly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "safe-sync",
        "approve-address",
        [types.principal(wallet1.address)],
        deployer.address
      ),
      Tx.contractCall(
        "safe-sync",
        "revoke-address",
        [types.principal(wallet1.address)],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts[1].result, "(ok true)");
    
    // Verify revoked address cannot sync
    let block2 = chain.mineBlock([
      Tx.contractCall(
        "safe-sync",
        "store-asset",
        [types.ascii("test-hash-123")],
        deployer.address
      ),
      Tx.contractCall(
        "safe-sync",
        "sync-asset",
        [types.uint(0), types.principal(wallet1.address)],
        wallet1.address
      )
    ]);
    
    assertEquals(block2.receipts[1].result, `(err ${types.uint(100)})`);
  },
});
