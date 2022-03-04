import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
    typography: {
        fontFamily: ['"Noto Sans CJK KR"', 'Roboto'].join(','),
    }
})

export default theme;