"use client";

import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionHistory } from "@/components/transactions/TransactionHistory";
import { TransactionList } from "@/components/transactions/TransactionList";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          Send transactions and view your transaction history
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TransactionForm />
        <div className="space-y-6">
          <TransactionList />
        </div>
      </div>

      <TransactionHistory />
    </div>
  );
}
