# smart-legal-contract

A Clarity smart contract for managing legal contracts with payment schedules and compliance monitoring. This contract enables automated contract management, payment processing with penalties, and compliance violation tracking.

## Features

- Contract creation and status management
- Payment schedule setup and processing
- Automated late payment penalty calculations
- Compliance monitoring and violation tracking
- Violation reporting system

## Contract Maps

### `contract-status`
```clarity
(define-map contract-status {contract-id: uint} {status: (string-ascii 50)})
```
Stores the current status of each contract.

### `compliance-violations`
```clarity
(define-map compliance-violations {contract-id: uint} {violation: (string-ascii 100)})
```
Records compliance violations for each contract.

### `payments-due`
```clarity
(define-map payments-due {contract-id: uint} {amount: uint, due-date: uint})
```
Tracks payment schedules and amounts for each contract.

## Public Functions

### Create Contract
```clarity
(define-public (create-contract (contract-id uint) (status (string-ascii 50))))
```
Creates a new legal contract with the specified ID and status.

#### Parameters:
- `contract-id`: Unique identifier for the contract
- `status`: Initial status of the contract

#### Returns:
- Success message if contract is created

### Set Payment Schedule
```clarity
(define-public (set-payment (contract-id uint) (amount uint) (due-date uint)))
```
Sets up a payment schedule for a contract.

#### Parameters:
- `contract-id`: Contract identifier
- `amount`: Payment amount
- `due-date`: Due date timestamp

#### Returns:
- Success message if payment schedule is set

### Process Payment
```clarity
(define-public (pay (contract-id uint) (amount uint) (current-time uint)))
```
Processes a payment for a contract, applying late penalties if applicable.

#### Parameters:
- `contract-id`: Contract identifier
- `amount`: Payment amount
- `current-time`: Current timestamp

#### Returns:
- Payment status with optional penalty amount

### Check Compliance
```clarity
(define-public (check-compliance (contract-id uint) (criteria (string-ascii 100))))
```
Checks contract compliance against specified criteria.

#### Parameters:
- `contract-id`: Contract identifier
- `criteria`: Compliance criteria to check

#### Returns:
- Compliance status or violation record

## Read-Only Functions

### Get Violation
```clarity
(define-read-only (get-violation (contract-id uint)))
```
Retrieves violation information for a specific contract.

### Get Violations Summary
```clarity
(define-read-only (get-violations (contract-id uint)))
```
Gets violation summary including total violation count.

### Get Violation Count
```clarity
(define-read-only (get-violation-count))
```
Returns the total number of violations recorded.

## Constants

- `penalty-rate`: Set to 10% for late payments
- Error codes:
  - `err-contract-not-found`: Contract not found (u1)
  - `err-no-payment-scheduled`: No payment scheduled (u2)
  - `err-invalid-violation`: Invalid violation lookup (u3)

## Example Usage

1. Create a new contract:
```clarity
(contract-call? .legal-contract create-contract u1 "active")
```

2. Set up a payment schedule:
```clarity
(contract-call? .legal-contract set-payment u1 u1000 u1640995200) ;; Amount: 1000, Due: Jan 1, 2022
```

3. Process a payment:
```clarity
(contract-call? .legal-contract pay u1 u1000 u1640995200)
```

4. Check compliance:
```clarity
(contract-call? .legal-contract check-compliance u1 "regulatory-check-2022")
```

5. View violations:
```clarity
(contract-call? .legal-contract get-violations u1)
```

## Error Handling

The contract includes comprehensive error handling:
- Contract existence verification
- Payment schedule validation
- Compliance check validation
- Violation tracking verification

## Notes

- All timestamps should be in Unix epoch format
- Payment amounts are in base units (no decimals)
- Status strings are limited to 50 characters
- Violation descriptions are limited to 100 characters

## Security Considerations

- Contract IDs must be unique
- Payment schedules cannot be modified once set
- Compliance violations are permanent records
- Only one payment can be scheduled per contract at a time