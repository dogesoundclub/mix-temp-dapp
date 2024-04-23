"use client";

import tasks from "@/app/stage/data/tasks.json"

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useSendTransaction, useTransaction, useAccount } from 'wagmi';
import { Slider } from "@/components/ui/slider"
import { buttonVariants } from "@/components/ui/button"
import { Box, Checkbox, Flex, ScrollArea, Card, Avatar, Button, Dialog, Text, TextField } from "@radix-ui/themes";

import { Metadata } from "next"
import Image from "next/image"
import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"

import { taskSchema } from "./data/schema"

export default function Stage() {
    const { address, isConnected } = useAccount();
    const [isSpliting, setIsSpliting] = useState(false);
    const [splitMessage, setSplitMessage] = useState('');
    const { sendTransaction } = useSendTransaction();

    const [isLoading, setIsLoading] = useState(true);
    const [allNftsLoaded, setAllNftsLoaded] = useState(false);
    const [nftIds, setNftIds] = useState<string[]>([]);
    const [offset, setOffset] = useState(0);
    const loadCount = 10;
    const [sliderValue, setSliderValue] = useState([0]);
    const [checkboxes, setCheckboxes] = useState(new Array(10).fill(false));
    const [balance, setBalance] = useState(0);
    const selected = checkboxes.filter(checkbox => checkbox).length;

    console.log("address", address)
    console.log("isConnected", isConnected)
    console.log("allNftsLoaded", allNftsLoaded)
    const fetchNfts = async () => {
        if (!address || !isConnected || allNftsLoaded) 
          console.log("fetchNfts, address, isConnected, allNftsLoaded", address, isConnected, allNftsLoaded)
          return;
    
        setIsLoading(true);
        try {
            const response = await fetch(`/api/get-dsc-balance?walletAddress=${address}&offset=${offset}&count=${loadCount}`);
            const responseData = await response.json();
            if (responseData.statusCode === 200) {
                setNftIds(prevNfts => [...prevNfts, ...responseData.data.nftIds]);
                setBalance(responseData.data.balanceNumber);
                setIsLoading(false);
                setAllNftsLoaded(responseData.data.nftIds.length < loadCount || nftIds.length + responseData.data.nftIds.length >= responseData.data.balanceNumber);
            } else {
                console.error('Error fetching NFTs:', responseData.message);
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            // Remove this line
        }
    };

    useEffect(() => {
        fetchNfts();
    }, [offset]);

    const handleScroll = (event) => {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
      console.log("scrollHeight, scrollTop, clientHeight", scrollHeight, scrollTop, clientHeight)
      console.log("scrollHeight - scrollTop", scrollHeight - scrollTop)
      // Check if the user has scrolled to near the bottom
      if (scrollHeight - scrollTop <= clientHeight * 1.1) {
          setOffset(prevOffset => prevOffset + loadCount);
      }
      console.log("handScroll Event, offset:", offset);
  };

    const handleCheckboxChange = (index) => {
        setCheckboxes((prev) => prev.map((checked, i) => (i === index ? !checked : checked)));
    };

    const handleSliderChange = (value) => {
      setSliderValue(value);
      // Update the checkboxes based on the slider value
      const newCheckboxes = checkboxes.map((_, index) => index < value[0]);
      setCheckboxes(newCheckboxes);
    };

    const getSelectedNfts = () => {
      return nftIds.filter((_, index) => checkboxes[index]);
    };

    const onSplit = useCallback(async () => {
      if (!address || isConnected) {
        alert('You must connect your wallet to mint.');
        return;
      }
  
      setIsSpliting(true);
  
      try {
        // Send the transaction
        await sendTransaction({
          to: address,
          // data: ``
        });
    
        // Set a message indicating the transaction is in progress
        // Note: You'll need to rely on another method to track the actual transaction status
        setSplitMessage('Transaction in progress...');
      } catch (e) {
        setSplitMessage(`Error: ${(e as Error).message}`);
      } finally {
        setIsSpliting(false);
      }
    }, [address, nftIds.length, sendTransaction]);

    return (
      <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Stage</h2>
            <p className="text-muted-foreground">
              Time to come back home. Bring your mates!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
    );
}