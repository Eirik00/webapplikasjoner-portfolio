import { format, parseISO, differenceInDays, addDays, isBefore } from "date-fns";

export const formatDate = (date: Date | string, dateFormat = "yyyy-MM-dd"): string => {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return format(parsedDate, dateFormat);
};

export const daysBetween = (startDate: Date | string, endDate: Date | string): number => {
    const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
    const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
    return differenceInDays(end, start);
};

export const addDaysToDate = (date: Date | string, days: number): Date => {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return addDays(parsedDate, days);
};

export const isDateBefore = (date: Date | string, comparisonDate: Date | string): boolean => {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    const parsedComparisonDate = typeof comparisonDate === "string" ? parseISO(comparisonDate) : comparisonDate;
    return isBefore(parsedDate, parsedComparisonDate)
};