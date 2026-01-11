'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactionsByStatus } from '@/hooks/useWallet';
import { formatDate, formatCurrency, truncateAddress } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function TransactionList() {
    const [status, setStatus] = useState<'pending' | 'confirmed'>('confirmed');
    const [limit, setLimit] = useState(5);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const { data, isLoading, error } = useTransactionsByStatus(status, limit);

    const transactions = data?.data || [];

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>View transactions by status</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={status}
                            onValueChange={(value) => setStatus(value as 'pending' | 'confirmed')}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={limit.toString()}
                            onValueChange={(value) => setLimit(parseInt(value))}
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : error ? (
                    <p className="text-sm text-destructive text-center py-8">Failed to load transactions</p>
                ) : transactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No transactions found</p>
                ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {transactions.map((tx) => (
                            <div
                                key={tx._id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>{tx.status}</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">From:</span>
                                            <span className="text-sm font-mono text-muted-foreground">{truncateAddress(tx.senderAddress)}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 w-5 p-0"
                                                onClick={() => handleCopy(tx.senderAddress, `sender-${tx._id}`)}
                                            >
                                                {copiedId === `sender-${tx._id}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">To:</span>
                                            <span className="text-sm font-mono text-muted-foreground">{truncateAddress(tx.recipientAddress)}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 w-5 p-0"
                                                onClick={() => handleCopy(tx.recipientAddress, `recipient-${tx._id}`)}
                                            >
                                                {copiedId === `recipient-${tx._id}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">{formatDate(tx.timestamp)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(tx.amount)}</p>
                                    {typeof tx.block === 'object' && tx.block && (
                                        <p className="text-xs text-muted-foreground">Block #{tx.block.index}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
