
import { SurgeryRecord, SurgeryType } from './types';

// Real data extracted from the user's file
const rawData = [
  { count: 4069, year: 2025, month: 7, type: 'Minor' as const },
  { count: 4056, year: 2025, month: 10, type: 'Minor' as const },
  { count: 3967, year: 2025, month: 12, type: 'Minor' as const },
  { count: 3780, year: 2025, month: 5, type: 'Minor' as const },
  { count: 3777, year: 2025, month: 8, type: 'Minor' as const },
  { count: 3618, year: 2025, month: 9, type: 'Minor' as const },
  { count: 3395, year: 2025, month: 11, type: 'Minor' as const },
  { count: 3331, year: 2024, month: 12, type: 'Minor' as const },
  { count: 3194, year: 2025, month: 4, type: 'Minor' as const },
  { count: 3145, year: 2025, month: 2, type: 'Minor' as const },
  { count: 2807, year: 2024, month: 2, type: 'Minor' as const },
  { count: 2780, year: 2023, month: 5, type: 'Minor' as const },
  { count: 2683, year: 2025, month: 6, type: 'Minor' as const },
  { count: 2673, year: 2025, month: 1, type: 'Minor' as const },
  { count: 2645, year: 2023, month: 1, type: 'Minor' as const },
  { count: 2598, year: 2023, month: 3, type: 'Minor' as const },
  { count: 2569, year: 2023, month: 8, type: 'Minor' as const },
  { count: 2563, year: 2024, month: 1, type: 'Minor' as const },
  { count: 2477, year: 2024, month: 10, type: 'Minor' as const },
  { count: 2415, year: 2022, month: 8, type: 'Minor' as const },
  { count: 2396, year: 2022, month: 6, type: 'Minor' as const },
  { count: 2395, year: 2024, month: 5, type: 'Minor' as const },
  { count: 2332, year: 2023, month: 9, type: 'Minor' as const },
  { count: 2329, year: 2023, month: 10, type: 'Minor' as const },
  { count: 2324, year: 2023, month: 7, type: 'Minor' as const },
  { count: 2256, year: 2023, month: 11, type: 'Minor' as const },
  { count: 2239, year: 2024, month: 11, type: 'Minor' as const },
  { count: 2199, year: 2023, month: 2, type: 'Minor' as const },
  { count: 2188, year: 2024, month: 9, type: 'Minor' as const },
  { count: 2163, year: 2022, month: 10, type: 'Minor' as const },
  { count: 2142, year: 2023, month: 6, type: 'Minor' as const },
  { count: 2136, year: 2022, month: 9, type: 'Minor' as const },
  { count: 2109, year: 2022, month: 3, type: 'Minor' as const },
  { count: 2096, year: 2024, month: 3, type: 'Minor' as const },
  { count: 2078, year: 2024, month: 4, type: 'Minor' as const },
  { count: 2054, year: 2022, month: 12, type: 'Minor' as const },
  { count: 1924, year: 2022, month: 11, type: 'Minor' as const },
  { count: 1916, year: 2022, month: 5, type: 'Minor' as const },
  { count: 1893, year: 2023, month: 12, type: 'Minor' as const },
  { count: 1855, year: 2024, month: 8, type: 'Minor' as const },
  { count: 1849, year: 2024, month: 7, type: 'Minor' as const },
  { count: 1746, year: 2022, month: 1, type: 'Minor' as const },
  { count: 1696, year: 2025, month: 3, type: 'Minor' as const },
  { count: 1683, year: 2022, month: 7, type: 'Minor' as const },
  { count: 1672, year: 2024, month: 6, type: 'Minor' as const },
  { count: 1668, year: 2022, month: 2, type: 'Minor' as const },
  { count: 1209, year: 2022, month: 4, type: 'Minor' as const },
  { count: 1203, year: 2023, month: 4, type: 'Minor' as const },
  // Major Data (OT)
  { count: 762, year: 2025, month: 7, type: 'Major' as const },
  { count: 725, year: 2023, month: 5, type: 'Major' as const },
  { count: 699, year: 2025, month: 12, type: 'Major' as const },
  { count: 689, year: 2025, month: 5, type: 'Major' as const },
  { count: 681, year: 2023, month: 8, type: 'Major' as const },
  { count: 677, year: 2025, month: 8, type: 'Major' as const },
  { count: 672, year: 2024, month: 12, type: 'Major' as const },
  { count: 665, year: 2025, month: 9, type: 'Major' as const },
  { count: 664, year: 2024, month: 5, type: 'Major' as const },
  { count: 662, year: 2025, month: 10, type: 'Major' as const },
  { count: 659, year: 2023, month: 7, type: 'Major' as const },
  { count: 657, year: 2023, month: 3, type: 'Major' as const },
  { count: 656, year: 2024, month: 10, type: 'Major' as const },
  { count: 641, year: 2022, month: 10, type: 'Major' as const },
  { count: 639, year: 2022, month: 6, type: 'Major' as const },
  { count: 639, year: 2024, month: 1, type: 'Major' as const },
  { count: 628, year: 2024, month: 9, type: 'Major' as const },
  { count: 624, year: 2025, month: 1, type: 'Major' as const },
  { count: 623, year: 2023, month: 1, type: 'Major' as const },
  { count: 612, year: 2023, month: 6, type: 'Major' as const },
  { count: 607, year: 2022, month: 11, type: 'Major' as const },
  { count: 603, year: 2025, month: 6, type: 'Major' as const },
  { count: 599, year: 2022, month: 12, type: 'Major' as const },
  { count: 598, year: 2025, month: 2, type: 'Major' as const },
  { count: 595, year: 2022, month: 9, type: 'Major' as const },
  { count: 594, year: 2025, month: 4, type: 'Major' as const },
  { count: 586, year: 2023, month: 11, type: 'Major' as const },
  { count: 576, year: 2025, month: 11, type: 'Major' as const },
  { count: 575, year: 2022, month: 8, type: 'Major' as const },
  { count: 570, year: 2022, month: 3, type: 'Major' as const },
  { count: 570, year: 2024, month: 6, type: 'Major' as const },
  { count: 563, year: 2023, month: 12, type: 'Major' as const },
  { count: 552, year: 2024, month: 7, type: 'Major' as const },
  { count: 549, year: 2023, month: 2, type: 'Major' as const },
  { count: 549, year: 2023, month: 10, type: 'Major' as const },
  { count: 540, year: 2024, month: 11, type: 'Major' as const },
  { count: 536, year: 2024, month: 8, type: 'Major' as const },
  { count: 531, year: 2023, month: 9, type: 'Major' as const },
  { count: 530, year: 2024, month: 4, type: 'Major' as const },
  { count: 528, year: 2024, month: 2, type: 'Major' as const },
  { count: 521, year: 2022, month: 5, type: 'Major' as const },
  { count: 513, year: 2025, month: 3, type: 'Major' as const },
  { count: 504, year: 2024, month: 3, type: 'Major' as const },
  { count: 503, year: 2023, month: 4, type: 'Major' as const },
  { count: 489, year: 2022, month: 7, type: 'Major' as const },
  { count: 484, year: 2022, month: 4, type: 'Major' as const },
  { count: 460, year: 2022, month: 1, type: 'Major' as const },
  { count: 340, year: 2022, month: 2, type: 'Major' as const },
];

export const getSpecialtyName = (specialty: string, lang: 'ar' | 'en') => {
  // Since specialty isn't detailed in the raw data, we aggregate as "Health Services"
  return lang === 'ar' ? 'الخدمات الصحية' : 'Health Services';
};

export function generateMockData(): SurgeryRecord[] {
  // Returns the real data mapped to SurgeryRecord interface
  // We use the rawData which already contains year, month, type, and count
  return rawData.map((d, index) => ({
    id: `rec-${index}`,
    year: d.year,
    month: d.month,
    type: d.type,
    specialty: 'Total', // Placeholder as not in data
    count: d.count,
    outcome: 'Success',
    patientAgeGroup: 'Adult' // Placeholder as not in data
  }));
}

export function filterData(data: SurgeryRecord[], filters: { year: string, month: string, type: string }) {
  return data.filter(item => {
    const matchYear = filters.year === 'all' || item.year.toString() === filters.year;
    const matchMonth = filters.month === 'all' || item.month.toString() === filters.month;
    const matchType = filters.type === 'all' || item.type === filters.type;
    return matchYear && matchMonth && matchType;
  });
}
