'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactionHistory } from '@/hooks/useWallet';
import { formatDate, formatCurrency, truncateAddress } from '@/lib/utils/formatters';
import { Loader2, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';

export function TransactionHistory() {
    const [status, setStatus] = useState<'pending' | 'confirmed'>('confirmed');
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const { data, isLoading, error } = useTransactionHistory(status, offset, limit);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const pagination = data?.data?.pagination;
    const transactions = data?.data?.transactions || [];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>View your transaction history with pagination</CardDescription>
                    </div>
                    <Select
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value as 'pending' | 'confirmed');
                            setOffset(0);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
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
                    <>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[100px]">Type</TableHead>
                                        <TableHead className="min-w-[150px]">Address</TableHead>
                                        <TableHead className="min-w-[100px]">Amount</TableHead>
                                        <TableHead className="min-w-[100px]">Status</TableHead>
                                        <TableHead className="min-w-[150px]">Date</TableHead>
                                        <TableHead className="min-w-[80px]">Block</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((tx) => (
                                        <TableRow key={tx._id}>
                                            <TableCell>
                                                <Badge variant={tx.type === 'sent' ? 'destructive' : 'default'}>
                                                    {tx.type === 'sent' ? 'Sent' : 'Received'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm">
                                                        {truncateAddress(tx.type === 'sent' ? tx.recipientAddress : tx.senderAddress)}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() =>
                                                            handleCopy(
                                                                tx.type === 'sent' ? tx.recipientAddress : tx.senderAddress,
                                                                `address-${tx._id}`,
                                                            )
                                                        }
                                                    >
                                                        {copiedId === `address-${tx._id}` ? (
                                                            <Check className="h-3 w-3" />
                                                        ) : (
                                                            <Copy className="h-3 w-3" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={tx.type === 'sent' ? 'text-destructive' : 'text-green-600'}>
                                                    {tx.type === 'sent' ? '-' : '+'}
                                                    {formatCurrency(tx.amount)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>{tx.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{formatDate(tx.timestamp)}</TableCell>
                                            <TableCell>
                                                {typeof tx.block === 'object' && tx.block ? (
                                                    <span className="font-mono text-xs">#{tx.block.index}</span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {pagination && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                                <div className="text-sm text-muted-foreground text-center sm:text-left">
                                    Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total)
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setOffset(pagination.prevOffset || 0)}
                                        disabled={!pagination.prevOffset}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="hidden sm:inline">Previous</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setOffset(pagination.nextOffset || 0)}
                                        disabled={!pagination.nextOffset}
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
