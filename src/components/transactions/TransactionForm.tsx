'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateTransaction } from '@/hooks/useWallet';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const transactionSchema = z.object({
    recipientAddress: z.string().min(1, 'Recipient address is required'),
    amount: z.number().positive('Amount must be positive').min(0.01, 'Amount must be at least 0.01'),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function TransactionForm() {
    const { mutate: createTransaction, isPending } = useCreateTransaction();

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            recipientAddress: '',
            amount: 0,
        },
    });

    const onSubmit = (values: TransactionFormValues) => {
        createTransaction(values, {
            onSuccess: () => {
                form.reset();
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Send Transaction</CardTitle>
                <CardDescription>Transfer funds to another wallet address</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="recipientAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter recipient wallet address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Transaction'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
