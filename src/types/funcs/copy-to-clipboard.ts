function unsecuredCopyToClipboard(input: string) {
  const textArea = document.createElement('textarea');
  textArea.value = input;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
}

export function copyToClipboard(input: string) {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(input);
  } else {
    unsecuredCopyToClipboard(input);
  }
}
