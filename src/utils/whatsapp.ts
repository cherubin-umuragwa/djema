/**
 * Generates a WhatsApp click-to-chat URL.
 * @param phone - Phone number in E.164 format (e.g. +256700000000)
 * @param message - Pre-filled message text
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  // Strip leading + for wa.me format
  const e164 = phone.startsWith('+') ? phone.slice(1) : phone;
  return `https://wa.me/${e164}?text=${encodeURIComponent(message)}`;
}

export function buildProviderToRequesterMessage(serviceType: string): string {
  return `Hi, I saw your request for ${serviceType} on Djema and I can help. Can we talk?`;
}

export function buildRequesterToProviderMessage(
  providerName: string,
  serviceType: string
): string {
  return `Hi ${providerName}, I found you on Djema. I need help with ${serviceType}. Are you available?`;
}
