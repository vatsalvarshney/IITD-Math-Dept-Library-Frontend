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