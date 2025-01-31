import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure can store new asset",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "safe-sync",
        "store-asset",
        [types.ascii("test-hash-123")],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    assertEquals(block.receipts[0].result, "(ok u0)");
  },
});

Clarinet.test({
  name: "Ensure only owner can approve addresses",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "safe-sync",
        "approve-address",
        [types.principal(wallet1.address)],
        wallet1.address
      )
    ]);
    
    assertEquals(block.receipts[0].result, `(err u100)`);
  },
});

Clarinet.test({
  name: "Test asset syncing between approved addresses",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;
    const wallet2 = accounts.get("wallet_2")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "safe-sync",
        "approve-address",
        [types.principal(wallet1.address)],
        deployer.address
      ),
      Tx.contractCall(
        "safe-sync",
        "store-asset",
        [types.ascii("test-hash-123")],
        wallet1.address
      ),
      Tx.contractCall(
        "safe-sync",
        "sync-asset",
        [types.uint(0), types.principal(wallet2.address)],
        wallet1.address
      )
    ]);
    
    assertEquals(block.receipts[2].result, `(err ${types.uint(103)})`);
  },
});
