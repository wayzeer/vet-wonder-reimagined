/**
 * Business Hours Configuration for VetWonder Clinic
 * 
 * Moralzarzal, Madrid - Operating Hours
 */

export interface TimeSlot {
    open: string; // HH:MM format
    close: string;
}

export interface DaySchedule {
    slots: TimeSlot[];
    isClosed: boolean;
}

// Business hours configuration
// Monday = 1, Sunday = 0
export const BUSINESS_HOURS: Record<number, DaySchedule> = {
    0: { slots: [], isClosed: true }, // Sunday - Closed
    1: { slots: [{ open: "10:00", close: "14:00" }, { open: "17:00", close: "20:00" }], isClosed: false }, // Monday
    2: { slots: [{ open: "10:00", close: "14:00" }, { open: "17:00", close: "20:00" }], isClosed: false }, // Tuesday
    3: { slots: [{ open: "10:00", close: "14:00" }, { open: "17:00", close: "20:00" }], isClosed: false }, // Wednesday
    4: { slots: [{ open: "10:00", close: "14:00" }, { open: "17:00", close: "20:00" }], isClosed: false }, // Thursday
    5: { slots: [{ open: "10:00", close: "14:00" }, { open: "17:00", close: "20:00" }], isClosed: false }, // Friday
    6: { slots: [{ open: "10:00", close: "14:00" }], isClosed: false }, // Saturday
};

// Appointment duration in minutes
export const APPOINTMENT_DURATION = 30;

// Buffer time between appointments in minutes
export const APPOINTMENT_BUFFER = 15;

// Spanish National Holidays + Madrid Community Holidays 2025
export const HOLIDAYS_2025: string[] = [
    // Already past 2024
    "2024-12-25", // Navidad
    "2024-12-26", // San Esteban (some regions)

    // 2025
    "2025-01-01", // Año Nuevo
    "2025-01-06", // Epifanía (Reyes)
    "2025-04-17", // Jueves Santo
    "2025-04-18", // Viernes Santo
    "2025-05-01", // Día del Trabajo
    "2025-05-02", // Día de la Comunidad de Madrid
    "2025-05-15", // San Isidro (Madrid)
    "2025-08-15", // Asunción de la Virgen
    "2025-10-12", // Fiesta Nacional de España
    "2025-11-01", // Todos los Santos
    "2025-11-09", // Almudena (Madrid)
    "2025-12-06", // Día de la Constitución
    "2025-12-08", // Inmaculada Concepción
    "2025-12-25", // Navidad
];

// Custom clinic closures (vacations, special days)
export const CUSTOM_CLOSURES: string[] = [
    // Add custom closure dates here, e.g.:
    // "2025-08-01", // Summer vacation start
    // "2025-08-31", // Summer vacation end
];

/**
 * Check if a specific date is a holiday or custom closure
 */
export function isHoliday(date: Date): boolean {
    const dateStr = formatDateToISO(date);
    return HOLIDAYS_2025.includes(dateStr) || CUSTOM_CLOSURES.includes(dateStr);
}

/**
 * Check if the clinic is closed on a specific date
 */
export function isClinicClosed(date: Date): boolean {
    const dayOfWeek = date.getDay();
    const schedule = BUSINESS_HOURS[dayOfWeek];

    return schedule.isClosed || isHoliday(date);
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDateToISO(date: Date): string {
    return date.toISOString().split("T")[0];
}

/**
 * Parse time string to minutes since midnight
 */
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

/**
 * Format minutes since midnight to time string
 */
function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Generate available time slots for a given date
 */
export function getAvailableTimeSlotsForDate(date: Date): string[] {
    if (isClinicClosed(date)) {
        return [];
    }

    const dayOfWeek = date.getDay();
    const schedule = BUSINESS_HOURS[dayOfWeek];
    const slots: string[] = [];

    for (const period of schedule.slots) {
        const startMinutes = timeToMinutes(period.open);
        const endMinutes = timeToMinutes(period.close);

        // Generate slots every APPOINTMENT_DURATION minutes
        for (let time = startMinutes; time + APPOINTMENT_DURATION <= endMinutes; time += APPOINTMENT_DURATION) {
            slots.push(minutesToTime(time));
        }
    }

    return slots;
}

/**
 * Check if a specific time is within business hours
 */
export function isWithinBusinessHours(date: Date, time: string): boolean {
    if (isClinicClosed(date)) {
        return false;
    }

    const dayOfWeek = date.getDay();
    const schedule = BUSINESS_HOURS[dayOfWeek];
    const timeMinutes = timeToMinutes(time);

    for (const period of schedule.slots) {
        const startMinutes = timeToMinutes(period.open);
        const endMinutes = timeToMinutes(period.close);

        if (timeMinutes >= startMinutes && timeMinutes + APPOINTMENT_DURATION <= endMinutes) {
            return true;
        }
    }

    return false;
}

/**
 * Get human-readable business hours for a day
 */
export function getBusinessHoursDisplay(dayOfWeek: number): string {
    const schedule = BUSINESS_HOURS[dayOfWeek];

    if (schedule.isClosed) {
        return "Cerrado";
    }

    return schedule.slots
        .map(slot => `${slot.open} - ${slot.close}`)
        .join(", ");
}

/**
 * Get the reason why a date is closed (holiday name or regular closure)
 */
export function getClosureReason(date: Date): string | null {
    const dateStr = formatDateToISO(date);

    // Check holidays
    const holidayNames: Record<string, string> = {
        "2025-01-01": "Año Nuevo",
        "2025-01-06": "Día de Reyes",
        "2025-04-17": "Jueves Santo",
        "2025-04-18": "Viernes Santo",
        "2025-05-01": "Día del Trabajo",
        "2025-05-02": "Día de la Comunidad de Madrid",
        "2025-05-15": "San Isidro",
        "2025-08-15": "Asunción de la Virgen",
        "2025-10-12": "Fiesta Nacional",
        "2025-11-01": "Todos los Santos",
        "2025-11-09": "La Almudena",
        "2025-12-06": "Día de la Constitución",
        "2025-12-08": "Inmaculada Concepción",
        "2025-12-25": "Navidad",
    };

    if (holidayNames[dateStr]) {
        return `Festivo: ${holidayNames[dateStr]}`;
    }

    if (CUSTOM_CLOSURES.includes(dateStr)) {
        return "Cierre especial";
    }

    const dayOfWeek = date.getDay();
    if (BUSINESS_HOURS[dayOfWeek].isClosed) {
        return "Cerrado los domingos";
    }

    return null;
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
}

/**
 * Check if a time slot has already passed for today
 */
export function isTimeSlotPassed(date: Date, time: string): boolean {
    const now = new Date();
    const slotDate = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    slotDate.setHours(hours, minutes, 0, 0);

    return slotDate <= now;
}
