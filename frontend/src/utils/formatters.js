// General utilities for formatting numbers, phone values and timestamps

export function formatPhone(digits, countryCode) {
  if (countryCode === "+1" || countryCode === "+91") {
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.substring(0, 5);
      if (digits.length > 5) {
        formatted += " " + digits.substring(5, 10);
      }
    }
    return formatted;
  }
  return digits;
}

export function formatTime(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}
