type CURRENCY_COUNTRIES = "GHS" | "USD" | "EUR" | "SEK";
type COUNTRY_LANGUAGES = "en" | "de" | "sv";
type COUNTRY_CODES = "GH" | "US" | "DE" | "SE";

// TODO: Fix this custom typing later
type Locale = `${COUNTRY_LANGUAGES}-${COUNTRY_CODES}`;

interface FormatCurrencyOptions {
  currency?: string;
  locale?: Locale;
}

const CURRENCIES_WITH_LOCALES: { [key: string]: Locale } = {
  GHS: "en-GH",
  USD: "en-US",
  EUR: "de-DE",
  SEK: "sv-SE",
};

export const formatCurrency = (amount: number, opts?: FormatCurrencyOptions) => {
  const currency = CURRENCIES_WITH_LOCALES[opts?.currency || "GHS"] ? opts?.currency || "GHS" : "GHS";
  opts = {
    locale: CURRENCIES_WITH_LOCALES[currency] || "en-GH",
    ...opts,
  };

  const formatted = new Intl.NumberFormat(opts.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount ?? 0);

  return formatted.replace(/(\D+)(\d)/, "$1 $2");
};

export const getListingDiscount = (originalPrice: number, discountedPrice: number) => {
  return originalPrice > 0 ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;
};

// Helper function to calculate discount percentage
export const calculateDiscountPercentage = (original: number, discounted: number): string => {
  const discount = ((original - discounted) / original) * 100;
  return `-${Math.round(discount)}%`;
};

export const getListingQuantitySold = (quantityTotal: number, quantityAvailable: number) => {
  return quantityTotal - quantityAvailable;
};

export const getListingQuantityAvailable = (quantityTotal: number, quantityAvailable: number) => {
  return quantityAvailable;
};

// Helper function to format time to 12-hour format
export const formatTime12Hour = (timeString: string): string => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${period}`;
};

// Helper function to format time range from Date objects
export const formatTimeRange = (startTime: Date | string, endTime: Date | string): string => {
  const start = typeof startTime === "string" ? new Date(startTime) : startTime;
  const end = typeof endTime === "string" ? new Date(endTime) : endTime;

  const startHours = start.getHours();
  const startMinutes = start.getMinutes();
  const endHours = end.getHours();
  const endMinutes = end.getMinutes();

  const formatTime = (hours: number, minutes: number) => {
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return `${formatTime(startHours, startMinutes)}-${formatTime(endHours, endMinutes)}`;
};

// Helper function to parse 12-hour format back to 24-hour
export const parseTimeToDate = (timeString: string): Date => {
  const date = new Date();
  if (timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    date.setHours(hours || 17);
    date.setMinutes(minutes || 0);
  } else {
    date.setHours(17);
    date.setMinutes(0);
  }
  return date;
};

// Helper function to format date to 24-hour string
export const formatTime24Hour = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export const getListingPickupTime = (startTime: Date | string, endTime: Date | string) => {
  // Convert strings to Date objects if needed
  const startDate = typeof startTime === "string" ? new Date(startTime) : startTime;
  const endDate = typeof endTime === "string" ? new Date(endTime) : endTime;

  // Validate that we have valid dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "Invalid time";
  }

  const startTimeString = formatTime24Hour(startDate);
  const endTimeString = formatTime24Hour(endDate);
  return `${formatTime12Hour(startTimeString)} - ${formatTime12Hour(endTimeString)}`;
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
