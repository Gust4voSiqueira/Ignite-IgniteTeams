import theme from '../theme'
import 'styled-components/native'

declare module 'styled-components/native' {
  type ThemeType = typeof theme
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeType {}
}
