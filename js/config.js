/*
 * Regal Guesthouse — configurare marketing & CRM.
 * Completați ID-urile de mai jos pentru a activa măsurarea și retargetarea.
 * Scripturile terțe se încarcă DOAR dacă ID-ul e completat ȘI vizitatorul acceptă cookie-urile (GDPR).
 */
window.REGAL_CONFIG = {
  // Endpoint CRM / webhook (HubSpot Forms, Zoho, Make, Zapier etc.) care primește POST JSON.
  // Gol = formularele oferă trimiterea pe WhatsApp / apel ca alternativă.
  crmEndpoint: '',

  // Google Analytics 4, ex: 'G-XXXXXXXXXX'
  ga4Id: '',
  // Google Ads (remarketing + conversii), ex: 'AW-123456789'
  googleAdsId: '',
  // Etichetă conversie Google Ads pentru cererea de rezervare, ex: 'AbCdEfGhIjk'
  googleAdsLeadLabel: '',
  // Meta (Facebook / Instagram) Pixel, ex: '1234567890'
  metaPixelId: '',

  phone: '+40756348896',
  whatsapp: '40756348896',
  pricePerNight: 30
};
