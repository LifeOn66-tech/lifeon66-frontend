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

export function getAstrologyBirthDetails(data: Record<string, unknown> | null | undefined) {
  if (!data) {
    return { gender: '', date: '', time: '', place: '' };
  }

  const birthData = data.birthData as Record<string, unknown> | undefined;
  const birthDetails = data.birthDetails as Record<string, unknown> | undefined;

  return {
    gender: String(
      data.gender ?? birthData?.gender ?? birthDetails?.gender ?? ''
    ),
    date: String(
      data.birthDate ?? data.dateOfBirth ?? birthData?.date ?? birthDetails?.date ?? ''
    ),
    time: String(
      data.birthTime ?? data.timeOfBirth ?? birthData?.time ?? birthDetails?.time ?? ''
    ),
    place: String(
      data.birthPlace ?? data.placeOfBirth ?? birthData?.place ?? birthDetails?.place ?? ''
    ),
  };
}
