import type { TScheduledPlan } from "./auth/types";

export function isActiveScheduledPlan(entry: TScheduledPlan, now = new Date()) {
  return new Date(entry.startedAt) <= now && new Date(entry.endsAt) > now;
}

export function isFutureScheduledPlan(entry: TScheduledPlan, now = new Date()) {
  return new Date(entry.startedAt) > now && new Date(entry.endsAt) > new Date(entry.startedAt);
}

export function findActiveScheduledPlan(scheduledPlans: TScheduledPlan[] | undefined, now = new Date()) {
  return scheduledPlans?.find((entry) => isActiveScheduledPlan(entry, now));
}

export function findScheduledPlanForPlanId(
  scheduledPlans: TScheduledPlan[] | undefined,
  planId: string,
  now = new Date(),
) {
  return scheduledPlans
    ?.filter((entry) => entry.plan._id === planId)
    .find((entry) => new Date(entry.endsAt) > now);
}

export function getScheduledPlanStatus(entry: TScheduledPlan, now = new Date()) {
  if (isActiveScheduledPlan(entry, now)) {
    return "active" as const;
  }
  if (isFutureScheduledPlan(entry, now)) {
    return "future" as const;
  }
  return "expired" as const;
}

export function getPlanScheduleDisplay(
  scheduledPlans: TScheduledPlan[] | undefined,
  planId: string,
  dateFormatter: Intl.DateTimeFormat,
  now = new Date(),
) {
  const entry = findScheduledPlanForPlanId(scheduledPlans, planId, now);
  if (!entry) {
    return {
      label: "Not running",
      status: "none" as const,
      isScheduled: false,
      isActive: false,
    };
  }

  const status = getScheduledPlanStatus(entry, now);
  if (status === "active") {
    return {
      label: `Ends ${dateFormatter.format(new Date(entry.endsAt))}`,
      status,
      isScheduled: true,
      isActive: true,
    };
  }
  if (status === "future") {
    return {
      label: `Starts ${dateFormatter.format(new Date(entry.startedAt))}`,
      status,
      isScheduled: true,
      isActive: false,
    };
  }

  return {
    label: "Not running",
    status: "none" as const,
    isScheduled: false,
    isActive: false,
  };
}
