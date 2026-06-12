/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BidHistory {
  id: string;
  bidderName: string;
  isUser: boolean;
  timeString: string;
  priceAfterBid: number;
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  category: 'electronics' | 'luxury' | 'gold' | 'gadgets';
  originalPrice: number;
  currentPrice: number;
  timeRemaining: number; // in seconds
  image: string;
  lastBidder: string;
  isUserHighBidder: boolean;
  bidsPlacedCount: number;
  bidsRequiredPerBid: number;
  bidsHistory: BidHistory[];
  status: 'live' | 'ended';
  winnerName?: string;
  savingPercent: number;
  timerMax: number; // reference for bar progress
}

export interface BidPackage {
  id: string;
  bidsCount: number;
  price: number;
  bonusBids: number;
  name: string;
  popular?: boolean;
}

export interface WinnerHistory {
  id: string;
  title: string;
  image: string;
  originalPrice: number;
  winningPrice: number;
  winnerName: string;
  savings: number;
  savedPercent: number;
  dateString: string;
}

export interface UserStats {
  bidsRemaining: number;
  totalBidsPlaced: number;
  moneySaved: number;
  totalSpent: number;
  wonItemsCount: number;
}
