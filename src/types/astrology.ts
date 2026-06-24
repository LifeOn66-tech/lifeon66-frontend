export type Gender = 'male' | 'female' | 'other';

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export function formatGenderLabel(gender?: string): string {
  const option = GENDER_OPTIONS.find((o) => o.value === gender);
  return option?.label ?? (gender ? gender : 'Not specified');
}

export interface BirthDetails {
  date: string;
  time: string;
  place: string;
  gender: Gender | '';
}

function cleanBirthField(value: unknown): string {
  if (value == null) return '';
  const text = String(value).trim();
  if (!text || text === 'undefined' || text === 'null') return '';
  return text;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function composeDateFromParts(birthData: Record<string, unknown> | undefined): string {
  if (!birthData) return '';

  const year = birthData.year ?? birthData.birthYear;
  const month = birthData.month ?? birthData.birthMonth;
  const day = birthData.day ?? birthData.birthDay;

  if (year != null && month != null && day != null) {
    return `${year}-${pad2(Number(month))}-${pad2(Number(day))}`;
  }

  return '';
}

function composeTimeFromParts(birthData: Record<string, unknown> | undefined): string {
  if (!birthData) return '';

  const hour = birthData.hour ?? birthData.birthHour;
  const minute = birthData.min ?? birthData.minute ?? birthData.birthMin;

  if (hour != null && minute != null) {
    return `${pad2(Number(hour))}:${pad2(Number(minute))}`;
  }

  return '';
}

function normalizeDateValue(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const text = cleanBirthField(value);
  if (!text) return '';

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10);
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return text;
}

function normalizeTimeValue(value: unknown): string {
  const text = cleanBirthField(value);
  if (!text) return '';

  const match = text.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    return `${pad2(Number(match[1]))}:${match[2]}`;
  }

  return text;
}

export function getAstrologyBirthDetails(data: Record<string, unknown> | null | undefined) {
  if (!data) {
    return { gender: '', date: '', time: '', place: '' };
  }

  const birthData = data.birthData as Record<string, unknown> | undefined;
  const birthDetails = data.birthDetails as Record<string, unknown> | undefined;

  const date =
    normalizeDateValue(
      data.birthDate ??
        data.dateOfBirth ??
        birthDetails?.date ??
        birthData?.date ??
        birthData?.birthDate
    ) || composeDateFromParts(birthData);

  const time =
    normalizeTimeValue(
      data.birthTime ??
        data.timeOfBirth ??
        birthDetails?.time ??
        birthData?.time ??
        birthData?.birthTime
    ) || composeTimeFromParts(birthData);

  const place = cleanBirthField(
    data.birthPlace ??
      data.placeOfBirth ??
      birthDetails?.place ??
      birthData?.place ??
      birthData?.birthPlace ??
      birthData?.location
  );

  const gender = cleanBirthField(
    data.gender ?? birthData?.gender ?? birthDetails?.gender
  );

  return { gender, date, time, place };
}

export function getMissingBirthDetailLabels(details: ReturnType<typeof getAstrologyBirthDetails>): string[] {
  const missing: string[] = [];
  if (!details.date) missing.push('date of birth');
  if (!details.time) missing.push('time of birth');
  if (!details.place) missing.push('birth place');
  if (!details.gender) missing.push('gender');
  return missing;
}
