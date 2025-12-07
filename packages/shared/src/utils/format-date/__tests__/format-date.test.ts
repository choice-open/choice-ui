import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  formatRelativeTime,
  createDateFormatter,
  formatSimpleDate,
  formatTime,
} from "..";

describe("formatRelativeTime", () => {
  const mockNow = new Date("2024-01-15T14:30:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  describe("Parameter validation", () => {
    it("should handle invalid dates", () => {
      expect(formatRelativeTime(null as any)).toBe("Invalid Date");
      expect(formatRelativeTime(new Date("invalid"))).toBe("Invalid Date");
      expect(formatRelativeTime(undefined as any)).toBe("Invalid Date");
    });
  });

  describe("Basic relative time formatting", () => {
    it("should format recent times correctly in English", () => {
      const fiveMinutesAgo = new Date(mockNow.getTime() - 5 * 60 * 1000);
      const result = formatRelativeTime(fiveMinutesAgo, { language: "en" });
      expect(result).toBe("5 minutes ago");
    });

    it("should format recent times correctly in Chinese", () => {
      const fiveMinutesAgo = new Date(mockNow.getTime() - 5 * 60 * 1000);
      const result = formatRelativeTime(fiveMinutesAgo, { language: "cn" });
      expect(result).toBe("5分钟前");
    });

    it("should format future dates correctly", () => {
      const inOneHour = new Date(mockNow.getTime() + 60 * 60 * 1000);
      const result = formatRelativeTime(inOneHour, { language: "en" });
      expect(result).toBe("in about 1 hour");
    });
  });

  describe("Days threshold behavior", () => {
    it("should use relative time within threshold", () => {
      const threeDaysAgo = new Date(
        mockNow.getTime() - 3 * 24 * 60 * 60 * 1000,
      );
      const result = formatRelativeTime(threeDaysAgo, {
        daysThreshold: 7,
        language: "en",
      });
      expect(result).toBe("3 days ago");
    });

    it("should use absolute format beyond threshold", () => {
      const tenDaysAgo = new Date(mockNow.getTime() - 10 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(tenDaysAgo, {
        daysThreshold: 7,
        language: "en",
      });
      expect(result).toBe("January 5");
    });

    it("should use Chinese format beyond threshold", () => {
      const tenDaysAgo = new Date(mockNow.getTime() - 10 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(tenDaysAgo, {
        daysThreshold: 7,
        language: "cn",
      });
      expect(result).toBe("1月5日");
    });
  });

  describe("Year threshold behavior", () => {
    it("should show month/day within year threshold", () => {
      const sixMonthsAgo = new Date("2023-07-15T14:30:00Z");
      const result = formatRelativeTime(sixMonthsAgo, {
        daysThreshold: 7,
        yearThreshold: 1,
        language: "en",
      });
      expect(result).toBe("July 15");
    });

    it("should show full date beyond year threshold", () => {
      const twoYearsAgo = new Date("2022-01-15T14:30:00Z");
      const result = formatRelativeTime(twoYearsAgo, {
        daysThreshold: 7,
        yearThreshold: 1,
        language: "en",
      });
      expect(result).toBe("2022/01/15");
    });
  });

  describe("Specific time display", () => {
    it("should show today with time", () => {
      const todayMorning = new Date("2024-01-15T09:30:00Z");
      const result = formatRelativeTime(todayMorning, {
        showSpecificTime: true,
        language: "en",
      });
      expect(result).toBe("Today at 09:30");
    });

    it("should show yesterday with time", () => {
      const yesterday = new Date("2024-01-14T16:45:00Z");
      const result = formatRelativeTime(yesterday, {
        showSpecificTime: true,
        language: "en",
      });
      expect(result).toBe("Yesterday at 16:45");
    });

    it("should show Chinese format for today", () => {
      const todayMorning = new Date("2024-01-15T09:30:00Z");
      const result = formatRelativeTime(todayMorning, {
        showSpecificTime: true,
        language: "cn",
      });
      expect(result).toBe("今天 09:30");
    });
  });

  describe("Custom formats", () => {
    it("should use custom full date format", () => {
      const oldDate = new Date("2022-01-15T14:30:00Z");
      const result = formatRelativeTime(oldDate, {
        daysThreshold: 7,
        yearThreshold: 1,
        customFormat: {
          fullDate: "dd/MM/yyyy",
        },
      });
      expect(result).toBe("15/01/2022");
    });

    it("should use custom month day format", () => {
      const recentDate = new Date("2023-12-25T14:30:00Z");
      const result = formatRelativeTime(recentDate, {
        daysThreshold: 7,
        yearThreshold: 1,
        customFormat: {
          monthDay: "MMM dd",
        },
      });
      expect(result).toBe("Dec 25");
    });

    it("should force numeric format", () => {
      const recentDate = new Date("2023-12-25T14:30:00Z");
      const result = formatRelativeTime(recentDate, {
        daysThreshold: 7,
        yearThreshold: 1,
        forceNumericFormat: true,
      });
      expect(result).toBe("12/25");
    });
  });

  describe("Timezone handling", () => {
    it("should handle UTC timezone option", () => {
      const date = new Date("2024-01-15T14:30:00Z");
      const result = formatRelativeTime(date, {
        timezone: { useUTC: true },
        language: "en",
      });
      expect(result).toContain("seconds ago");
    });

    it("should use custom reference time", () => {
      const customRef = new Date("2024-01-15T12:00:00Z");
      const date = new Date("2024-01-15T11:00:00Z");
      const result = formatRelativeTime(date, {
        timezone: { referenceTime: customRef },
        language: "en",
      });
      expect(result).toBe("about 1 hour ago");
    });
  });

  describe("Multiple languages", () => {
    const testDate = new Date(mockNow.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago

    it.each([
      ["en", "2 hours ago"],
      ["cn", "2小时前"],
      ["ja", "2時間前"],
      ["es", "hace 2 horas"],
      ["fr", "il y a 2 heures"],
      ["de", "vor 2 Stunden"],
    ])("should format %s correctly", (language, expected) => {
      const result = formatRelativeTime(testDate, {
        language: language as any,
      });
      expect(result).toBe(expected);
    });
  });

  describe("Error handling", () => {
    it("should handle date-fns errors gracefully", () => {
      // Mock date-fns to throw an error
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Create an edge case that might cause date-fns to error
      const result = formatRelativeTime(new Date(Number.MAX_SAFE_INTEGER));

      // Should return error message instead of throwing
      expect(result).toBe("Format Error");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});

describe("createDateFormatter", () => {
  it("should create formatter with default options", () => {
    const formatter = createDateFormatter({
      language: "cn",
      daysThreshold: 14,
    });

    const testDate = new Date("2024-01-01T14:30:00Z");
    const result = formatter(testDate);

    expect(result).toContain("1月1日");
  });

  it("should allow option overrides", () => {
    const formatter = createDateFormatter({
      language: "cn",
      daysThreshold: 14,
    });

    const testDate = new Date("2024-01-01T14:30:00Z");
    const result = formatter(testDate, { language: "en" });

    expect(result).toBe("January 1");
  });
});

describe("formatSimpleDate", () => {
  it("should format simple date in English", () => {
    const date = new Date("2024-01-15T14:30:00Z");
    const result = formatSimpleDate(date, { language: "en" });
    expect(result).toBe("Jan 15, 2024");
  });

  it("should format simple date in Chinese", () => {
    const date = new Date("2024-01-15T14:30:00Z");
    const result = formatSimpleDate(date, { language: "cn" });
    expect(result).toBe("2024年1月15日");
  });

  it("should use custom format", () => {
    const date = new Date("2024-01-15T14:30:00Z");
    const result = formatSimpleDate(date, {
      customFormat: { fullDate: "yyyy-MM-dd" },
    });
    expect(result).toBe("2024-01-15");
  });

  it("should handle invalid dates", () => {
    const result = formatSimpleDate(new Date("invalid"));
    expect(result).toBe("Invalid Date");
  });
});

describe("formatTime", () => {
  it("should format time in English (12-hour)", () => {
    const date = new Date("2024-01-15T14:30:00Z");
    const result = formatTime(date, { language: "en" });
    expect(result).toBe("2:30 PM");
  });

  it("should format time in Chinese (24-hour)", () => {
    const date = new Date("2024-01-15T14:30:00Z");
    const result = formatTime(date, { language: "cn" });
    expect(result).toBe("14:30");
  });

  it("should use custom time format", () => {
    const date = new Date("2024-01-15T14:30:00Z");
    const result = formatTime(date, {
      customFormat: { time: "HH:mm:ss" },
    });
    expect(result).toBe("14:30:00");
  });

  it("should handle invalid dates", () => {
    const result = formatTime(new Date("invalid"));
    expect(result).toBe("Invalid Time");
  });
});
