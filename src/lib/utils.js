export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const truncatedText = (text) => {
  const textMaxWidth = window.innerWidth>1280 ? 120 : 70;
  return text?.length > textMaxWidth ? text?.slice(0, textMaxWidth) + '...' : text;
}

export const kerberosToEntryNumber = (kerberos) => {
  return '20' + kerberos.slice(3,5) + kerberos.slice(0,3).toUpperCase() + kerberos.slice(5);
}

export const entryNumberToKerberos = (entryNumber) => {
  return entryNumber.slice(4,7).toLowerCase() + entryNumber.slice(2,4) + entryNumber.slice(7);
}
