'use client';

import { MineButton } from '@/components/blockchain/MineButton';
import { BlockchainView } from '@/components/blockchain/BlockchainView';

export default function BlockchainPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Blockchain</h1>
                <p className="text-muted-foreground">Mine blocks and explore the blockchain</p>
            </div>

            <MineButton />

            <BlockchainView />
        </div>
    );
}
