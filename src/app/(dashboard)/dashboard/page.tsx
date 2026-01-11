'use client';

import { WalletSummary } from '@/components/transactions/WalletSummary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionHistory } from '@/hooks/useWallet';
import { formatDate, formatCurrency, truncateAddress } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
    const { data: historyData } = useTransactionHistory('confirmed', 0, 5);

    const recentTransactions = historyData?.data?.transactions || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your wallet and recent activity</p>
            </div>

            <WalletSummary />

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Your latest confirmed transactions</CardDescription>
                        </div>
                        <Link href="/transactions">
                            <Button
                                variant="outline"
                                size="sm"
                            >
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentTransactions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
                    ) : (
                        <div className="space-y-4">
                            {recentTransactions.map((tx) => (
                                <div
                                    key={tx._id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={tx.type === 'sent' ? 'destructive' : 'default'}>
                                                {tx.type === 'sent' ? 'Sent' : 'Received'}
                                            </Badge>
                                            <span className="text-sm font-mono text-muted-foreground">
                                                {truncateAddress(tx.type === 'sent' ? tx.recipientAddress : tx.senderAddress)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{formatDate(tx.timestamp)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${tx.type === 'sent' ? 'text-destructive' : 'text-green-600'}`}>
                                            {tx.type === 'sent' ? '-' : '+'}
                                            {formatCurrency(tx.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
