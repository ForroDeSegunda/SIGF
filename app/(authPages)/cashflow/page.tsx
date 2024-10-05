import { readTransactions } from "./actions";
import { CashFlowContent } from "./content";

export default async function CashFlowPage() {
  const transactions = await readTransactions();

  return <CashFlowContent transactions={transactions} />;
}
