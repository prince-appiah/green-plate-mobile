import { QueryCache, QueryClient } from "@tanstack/react-query";

const FIVE_MINUTES = 1000 * 60 * 5; // 5 minutes
const TEN_MINUTES = 1000 * 60 * 10; // 10 minutes
const HALF_HOUR = 1000 * 60 * 30; // 30 minutes
const QUARTER_HOUR = 1000 * 60 * 15; // 15 minutes
const ONE_HOUR = 1000 * 60 * 60; // 1 hour
const ONE_DAY = ONE_HOUR * 24; // 1 day
const ONE_WEEK = ONE_DAY * 7; // 1 week
const ONE_MONTH = ONE_WEEK * 4; // 4 weeks

const queryCache = new QueryCache();

export const queryClient = new QueryClient({
  defaultOptions: {
    // queries: {
    //   gcTime: FIVE_MINUTES, // 6 minutes
    //   staleTime: TEN_MINUTES,
    // },
  },
  queryCache,
});
