'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, truncateAddress } from '@/lib/utils/formatters';
import type { Block } from '@/lib/types/api';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface BlockCardProps {
    block: Block;
}

export function BlockCard({ block }: BlockCardProps) {
    const [copiedHash, setCopiedHash] = useState(false);
    const [copiedPrevHash, setCopiedPrevHash] = useState(false);

    const handleCopy = (text: string, type: 'hash' | 'prevHash') => {
        navigator.clipboard.writeText(text);
        if (type === 'hash') {
            setCopiedHash(true);
            setTimeout(() => setCopiedHash(false), 2000);
        } else {
            setCopiedPrevHash(true);
            setTimeout(() => setCopiedPrevHash(false), 2000);
        }
    };

    const transactions = Array.isArray(block.transactions) ? block.transactions.filter((t) => typeof t === 'object') : [];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Block #{block.index}
                            <Badge variant="outline">Nonce: {block.nonce}</Badge>
                        </CardTitle>
                        <CardDescription>{formatDate(block.timestamp)}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Hash:</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{truncateAddress(block.hash, 8, 8)}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleCopy(block.hash, 'hash')}
                            >
                                {copiedHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Previous Hash:</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{truncateAddress(block.previousHash, 8, 8)}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleCopy(block.previousHash, 'prevHash')}
                            >
                                {copiedPrevHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Transactions: {transactions.length}</span>
                        {transactions.length > 0 && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                    >
                                        View Transactions
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Block #{block.index} Transactions</DialogTitle>
                                        <DialogDescription>{transactions.length} transaction(s) in this block</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-2">
                                        {transactions.map((tx: any, idx: number) => (
                                            <div
                                                key={tx._id || idx}
                                                className="p-3 border rounded-lg space-y-1"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">Transaction #{idx + 1}</span>
                                                    <span className="text-sm font-mono text-muted-foreground">
                                                        {truncateAddress(tx._id || '', 6, 4)}
                                                    </span>
                                                </div>
                                                <div className="text-xs space-y-1">
                                                    <div>
                                                        <span className="text-muted-foreground">From: </span>
                                                        <span className="font-mono">{truncateAddress(tx.senderAddress)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">To: </span>
                                                        <span className="font-mono">{truncateAddress(tx.recipientAddress)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Amount: </span>
                                                        <span className="font-semibold">{tx.amount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
