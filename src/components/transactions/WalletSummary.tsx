'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionSummary } from '@/hooks/useWallet';
import { formatCurrency } from '@/lib/utils/formatters';
import { Loader2 } from 'lucide-react';

export function WalletSummary() {
    const { data, isLoading, error } = useTransactionSummary();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">...</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error || !data?.data) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Failed to load wallet summary</p>
                </CardContent>
            </Card>
        );
    }

    const summary = data.data;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(summary.availableBalance)}</div>
                    <p className="text-xs text-muted-foreground">Ready to use</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(summary.pendingBalance)}</div>
                    <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.pendingTransactionCount}</div>
                    <p className="text-xs text-muted-foreground">In queue</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.totalTransactionCount}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
            </Card>
        </div>
    );
}
