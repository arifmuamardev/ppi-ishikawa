export const brandTheme = {
  period: '2026/27',
  name: 'Contemporary',
  colors: {
    primary: '#B3263E',
    secondary: '#176B6A',
    accent: '#5BA8A6',
    surface: '#F7FAF9',
    ink: '#23282A'
  }
} as const;

export type BrandTheme = typeof brandTheme;
