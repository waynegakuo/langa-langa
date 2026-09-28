export function formatTeamColor(hex: string | null | undefined): string {
  if (!hex) return '6b6b7b';
  return hex.replace('#', '');
}

export function teamColorCss(hex: string | null | undefined): string {
  return `#${formatTeamColor(hex)}`;
}
