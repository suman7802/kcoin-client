"use client";

import { Button } from "@/components/ui/button";
import { useMineBlock } from "@/hooks/useBlockchain";
import { Loader2, Pickaxe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MineButton() {
  const { mutate: mineBlock, isPending } = useMineBlock();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mine Block</CardTitle>
        <CardDescription>
          Mine a new block to add pending transactions to the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => mineBlock()}
          disabled={isPending}
          size="lg"
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mining...
            </>
          ) : (
            <>
              <Pickaxe className="mr-2 h-4 w-4" />
              Mine Block
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
