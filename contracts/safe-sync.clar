;; SafeSync Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-asset-exists (err u101))
(define-constant err-asset-not-found (err u102))
(define-constant err-invalid-address (err u103))

;; Data structures
(define-map assets 
  { asset-id: uint }
  { 
    owner: principal,
    hash: (string-ascii 64),
    version: uint,
    timestamp: uint
  }
)

(define-map approved-addresses
  { address: principal }
  { approved: bool }
)

(define-map sync-history
  { asset-id: uint, version: uint }
  {
    from: principal,
    to: principal,
    timestamp: uint
  }
)

;; Data variables
(define-data-var asset-counter uint u0)

;; Private functions
(define-private (is-approved (address principal))
  (default-to false (get approved (unwrap-panic (get-approved-status address))))
)

;; Public functions
(define-public (store-asset (hash (string-ascii 64)))
  (let 
    (
      (asset-id (var-get asset-counter))
    )
    (map-insert assets
      { asset-id: asset-id }
      {
        owner: tx-sender,
        hash: hash,
        version: u1,
        timestamp: block-height
      }
    )
    (var-set asset-counter (+ asset-id u1))
    (ok asset-id)
  )
)

(define-public (sync-asset (asset-id uint) (recipient principal))
  (let
    (
      (asset (unwrap! (map-get? assets { asset-id: asset-id }) (err err-asset-not-found)))
    )
    (asserts! (or (is-eq tx-sender (get owner asset)) (is-approved tx-sender)) (err err-not-authorized))
    (asserts! (is-approved recipient) (err err-invalid-address))
    
    (map-insert sync-history
      { asset-id: asset-id, version: (get version asset) }
      {
        from: tx-sender,
        to: recipient,
        timestamp: block-height
      }
    )
    (ok true)
  )
)

(define-public (approve-address (address principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err err-not-authorized))
    (map-set approved-addresses
      { address: address }
      { approved: true }
    )
    (ok true)
  )
)

(define-public (revoke-address (address principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err err-not-authorized))
    (map-delete approved-addresses { address: address })
    (ok true)
  )
)

;; Read only functions
(define-read-only (get-asset (asset-id uint))
  (map-get? assets { asset-id: asset-id })
)

(define-read-only (get-approved-status (address principal))
  (map-get? approved-addresses { address: address })
)

(define-read-only (get-sync-history (asset-id uint) (version uint))
  (map-get? sync-history { asset-id: asset-id, version: version })
)
