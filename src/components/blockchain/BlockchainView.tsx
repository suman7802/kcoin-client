"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBlockchain } from "@/hooks/useBlockchain";
import { BlockCard } from "./BlockCard";
import { Loader2, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

export function BlockchainView() {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [hashFilter, setHashFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const options = {
    hash: hashFilter || undefined,
    date: dateFilter || undefined,
    offset,
    limit,
  };

  const { data, isLoading, error } = useBlockchain(options);

  const pagination = data?.data?.pagination;
  const blocks = data?.data?.blocks || [];

  const handleClearFilters = () => {
    setHashFilter("");
    setDateFilter("");
    setOffset(0);
  };

  const hasFilters = hashFilter || dateFilter;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Blockchain</CardTitle>
            <CardDescription>
              View the blockchain with pagination and filters
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Search className="h-4 w-4 mr-2" />
              Filters
            </Button>
            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
        {showFilters && (
          <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="hash-filter">Filter by Hash</Label>
              <Input
                id="hash-filter"
                placeholder="Enter block hash"
                value={hashFilter}
                onChange={(e) => {
                  setHashFilter(e.target.value);
                  setOffset(0);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-filter">Filter by Date</Label>
              <Input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setOffset(0);
                }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive text-center py-8">
            Failed to load blockchain
          </p>
        ) : blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No blocks found
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {blocks.map((block) => (
                <BlockCard key={block._id} block={block} />
              ))}
            </div>
            {pagination && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages} (
                  {pagination.totalCount} total blocks)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOffset(pagination.prevOffset || 0)}
                    disabled={!pagination.prevOffset}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOffset(pagination.nextOffset || 0)}
                    disabled={!pagination.nextOffset}
                  >
                    Next
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
