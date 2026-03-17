import {
  differenceInMinutes,
  format,
  isThisWeek,
  isThisYear,
  isToday,
  isYesterday
} from "date-fns";
import { SvelteDate } from "svelte/reactivity";
import { i18n } from "$lib";

const weekdays = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
const months = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr"
];

export type FormatOptions = {
  preset?: "default" | "custom" | "birthday" | "month" | "timestring" | "full";
  withTime?: boolean;
};

export function getFormat() {
  const { t, format: formatter, locale } = $derived(i18n);
  const now = new SvelteDate();

  function handler(date?: Date | number | string, options?: FormatOptions): string | undefined {
    if (!date) return undefined;
    const preset = options?.preset ?? "default";
    const withTime = options?.withTime ?? false;

    if (typeof date === "string" && preset === "timestring") {
      const [hours, minutes, seconds] = date.split(":");
      const timeDate = new SvelteDate();
      timeDate.setHours(Number(hours), Number(minutes), Number(seconds));
      return formatter.dateTime(timeDate, {
        hour: "numeric",
        minute: "numeric"
      });
    }
    if (!(date instanceof Date)) date = new SvelteDate(date);

    if (preset === "full") {
      if (locale === "uz") {
        let dateString = `${date.getFullYear()}-yil, ${date.getDate()}-${months[date.getMonth()].toLowerCase()}`;
        if (withTime) {
          dateString += `,
                    ${format(date, "HH:mm")}`;
        }
        return dateString;
      }

      return formatter.dateTime(date, {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(withTime ? { hour: "numeric", minute: "numeric" } : {})
      });
    }

    if (preset === "custom") {
      const diffMinutes = differenceInMinutes(now, date);
      if (diffMinutes < 1) return t("just-now");
      if (diffMinutes < 60) return t("minutes-ago", { minutes: diffMinutes });
      if (isToday(date)) return t("today-at", { time: format(date, "HH:mm") });
      if (isYesterday(date)) return t("yesterday-at", { time: format(date, "HH:mm") });
      if (isThisWeek(date, { weekStartsOn: 1 })) {
        if (locale === "uz") {
          const week = weekdays[date.getDay()];

          return `${week}, ${format(date, "HH:mm")} da`;
        }
        return formatter.dateTime(date, {
          weekday: "long",
          hour: "numeric",
          minute: "numeric"
        });
      }
      if (isThisYear(date)) {
        if (locale === "uz") {
          let dateString = `${date.getDate()}-${months[date.getMonth()].toLowerCase()}`;
          if (withTime) {
            dateString += `,
                        ${format(date, "HH:mm")} da`;
          }
          return dateString;
        }

        return formatter.dateTime(date, {
          month: "long",
          day: "numeric",
          ...(withTime ? { hour: "numeric", minute: "numeric" } : {})
        });
      }

      if (locale === "uz") {
        let dateString = `${date.getFullYear()}-yil, ${date.getDate()}-${months[date.getMonth()].toLowerCase()}`;
        if (withTime) {
          dateString += `,
                    ${format(date, "HH:mm")} da`;
        }
        return dateString;
      }

      return formatter.dateTime(date, {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(withTime ? { hour: "numeric", minute: "numeric" } : {})
      });

      // should return like "today, at 12:30"
    }

    if (preset === "month") {
      if (isThisYear(date)) {
        if (locale === "uz") {
          return months[date.getMonth()];
        }
        return formatter.dateTime(date, { month: "long" });
      }

      if (locale === "uz") {
        return `${date.getFullYear()}-yil, ${months[date.getMonth()]}`;
      }

      return formatter.dateTime(date, { month: "long", year: "numeric" });
    }

    if (preset === "birthday") {
      if (locale === "uz") {
        return `${date.getFullYear()}-yil, ${date.getDate()}-${months[date.getMonth()]}`;
      }
      return formatter.dateTime(date, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }

    if (isThisYear(date)) {
      if (locale === "uz") {
        let dateString = `${date.getDate()}-${months[date.getMonth()].toLowerCase()}`;
        if (withTime) {
          dateString += `,
                    ${format(date, "HH:mm")} da`;
        }
        return dateString;
      }

      return formatter.dateTime(date, {
        month: "long",
        day: "numeric",
        ...(withTime ? { hour: "numeric", minute: "numeric" } : {})
      });
    }

    if (locale === "uz") {
      let dateString = `${date.getFullYear()}-yil, ${date.getDate()}-${months[date.getMonth()].toLowerCase()}`;
      if (withTime) {
        dateString += `,
                ${format(date, "HH:mm")} da`;
      }
      return dateString;
    }

    return formatter.dateTime(date, {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(withTime ? { hour: "numeric", minute: "numeric" } : {})
    });
  }
  return handler;
}
