import '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    tableRowAlternate: Palette['primary'];
  }
  interface PaletteOptions {
    tableRowAlternate: PaletteOptions['primary'];
  }
}
