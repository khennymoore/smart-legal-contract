import { describe, expect, it, beforeEach } from "vitest";

// Data Store Types
type ContractStatus = Map<number, { status: string }>;
type PaymentsDue = Map<number, { amount: number; dueDate: number }>;
type ComplianceViolations = Map<number, { violation: string }>;

// State variables
let contractStatus: ContractStatus;
let paymentsDue: PaymentsDue;
let complianceViolations: ComplianceViolations;
let violationCount: number;

// Reset state before each test
beforeEach(() => {
  contractStatus = new Map();
  paymentsDue = new Map();
  complianceViolations = new Map();
  violationCount = 0;
});

// Mock Functions
const createContract = (contractId: number, status: string) => {
  contractStatus.set(contractId, { status });
  return { ok: { message: "Contract Created Successfully" } };
};

const setPayment = (contractId: number, amount: number, dueDate: number) => {
  paymentsDue.set(contractId, { amount, dueDate });
  return { ok: { message: "Payment Schedule Added" } };
};

const pay = (contractId: number, amount: number, currentTime: number) => {
  const contract = contractStatus.get(contractId);
  if (!contract) return { err: "Contract Not Found" };

  const payment = paymentsDue.get(contractId);
  if (!payment) return { err: "No Payment Scheduled" };

  if (currentTime >= payment.dueDate) {
    const penalty = Math.floor((amount * 10) / 100); // Penalty Rate: 10%
    return {
      ok: { message: "Payment received with penalty", penalty },
    };
  } else {
    paymentsDue.delete(contractId);
    return { ok: { message: "Payment Successful", penalty: null } };
  }
};

const checkCompliance = (contractId: number, criteria: string) => {
  const contract = contractStatus.get(contractId);
  if (!contract) return { err: "Contract Not Found" };

  if (contract.status === criteria) {
    return { ok: { message: "Compliance verified" } };
  } else {
    complianceViolations.set(contractId, { violation: "Non-compliance detected" });
    violationCount++;
    return { ok: { message: "Non-compliance logged" } };
  }
};

// Tests
describe("Smart Legal Contract Tests (Vitest)", () => {
  it("should create a contract successfully", () => {
    const result = createContract(1, "Active");
    expect(result).toEqual({ ok: { message: "Contract Created Successfully" } });
    expect(contractStatus.get(1)).toEqual({ status: "Active" });
  });

  it("should set a payment schedule successfully", () => {
    const result = setPayment(1, 1000, 1672531200);
    expect(result).toEqual({ ok: { message: "Payment Schedule Added" } });
    expect(paymentsDue.get(1)).toEqual({ amount: 1000, dueDate: 1672531200 });
  });

  it("should handle payments with and without penalties", () => {
    // Create contract and set payment schedule before attempting payment
    createContract(1, "Active");
    setPayment(1, 1000, 1672531200);

    // Payment before due date
    let result = pay(1, 1000, 1672531199);
    expect(result).toEqual({
      ok: { message: "Payment Successful", penalty: null },
    });
    expect(paymentsDue.has(1)).toBe(false);

    // Re-add payment schedule
    setPayment(1, 1000, 1672531200);

    // Payment after due date
    result = pay(1, 1000, 1672531201);
    expect(result).toEqual({
      ok: { message: "Payment received with penalty", penalty: 100 },
    });
  });

  it("should log compliance violations correctly", () => {
    createContract(2, "Active");

    const result = checkCompliance(2, "Inactive");
    expect(result).toEqual({ ok: { message: "Non-compliance logged" } });
    expect(complianceViolations.get(2)).toEqual({
      violation: "Non-compliance detected",
    });
  });

  it("should update violation count correctly", () => {
    createContract(2, "Active");
    expect(violationCount).toBe(0);
    checkCompliance(2, "Inactive");
    expect(violationCount).toBe(1);
  });
});
