declare const Theme: {
    text: {
        heading: {
            color: string;
            fontFamily: string;
            fontWeight: string;
            marginBottom: string;
            letterSpacing: string;
        };
        h1: {
            variant: string;
            fontSize: string;
            lineHeight: string;
            letterSpacing: number;
        };
        h2: {
            variant: string;
            fontSize: string;
            lineHeight: string;
            letterSpacing: number;
        };
        h3: {
            variant: string;
            fontSize: string;
            lineHeight: string;
            letterSpacing: number;
        };
        h4: {
            variant: string;
            fontSize: string;
            lineHeight: string;
            letterSpacing: number;
        };
        h5: {
            variant: string;
            fontSize: string;
            lineHeight: string;
            letterSpacing: number;
        };
        h6: {
            variant: string;
            fontSize: string;
            lineHeight: string;
            letterSpacing: number;
        };
        body: {
            color: string;
            fontSize: string;
            fontFamily: string;
            fontWeight: string;
            lineHeight: string;
        };
    };
    variants: {
        avatar: {
            width: string;
            height: string;
            borderRadius: string;
        };
        card: {
            p: number;
            bg: string;
            borderRadius: string;
            boxShadow: string;
        };
        link: {
            color: string;
        };
        nav: {
            fontSize: number;
            fontWeight: string;
            display: string;
            p: number;
            color: string;
            textDecoration: string;
            ":hover,:focus,.active": {
                color: string;
            };
        };
    };
    buttons: {
        primary: {
            cursor: string;
            textTransform: string;
            boxSizing: string;
            fontSize: number;
            fontWeight: string;
            color: string;
            bg: string;
            borderRadius: string;
            fontFamily: string;
            transition: string;
            py: number;
            px: number;
            whiteSpace: string;
            "&:disabled": {
                opacity: number;
                cursor: string;
            };
            "&:hover, &:focus": {
                backgroundColor: string;
                outline: string;
                "&:disabled": {
                    backgroundColor: string;
                };
            };
        };
        primaryBig: {
            variant: string;
            py: number;
        };
        secondary: {
            variant: string;
            color: string;
            bg: string;
            "&:hover, &:focus": {
                backgroundColor: string;
                borderColor: string;
                outline: string;
            };
        };
        secondaryBig: {
            variant: string;
            py: number;
        };
        outline: {
            variant: string;
            border: string;
            borderColor: string;
            "&:hover, &:focus": {
                backgroundColor: string;
                borderColor: string;
                outline: string;
                "&:disabled": {
                    backgroundColor: string;
                    borderColor: string;
                };
            };
        };
        outlineBig: {
            variant: string;
            py: number;
        };
    };
    styles: {
        root: {
            fontFamily: string;
            fontWeight: string;
            lineHeight: string;
        };
    };
    forms: {
        input: {
            fontFamily: string;
            width: string;
            borderColor: string;
            backgroundColor: string;
            fontSize: number;
            p: number;
            color: string;
            "&:hover, &:focus": {
                borderColor: string;
                outline: string;
            };
            "&::placeholder": {
                fontStyle: string;
            };
            "&:disabled": {
                opacity: number;
                borderColor: string;
                color: string;
            };
        };
        select: {
            color: string;
            fontFamily: string;
            borderColor: string;
            backgroundColor: string;
            fontSize: number;
            p: number;
            "&:hover, &:focus": {
                borderColor: string;
                outline: string;
            };
        };
        textarea: {
            fontFamily: string;
            borderColor: string;
            backgroundColor: string;
            fontSize: number;
            p: number;
            height: number;
            resize: string;
            color: string;
            "&:hover, &:focus": {
                borderColor: string;
                outline: string;
            };
            "&::placeholder": {
                fontStyle: string;
                lineHeight: string;
            };
        };
    };
    label: {
        color: string;
        as: string;
        fontFamily: string;
        fontSize: number;
        userSelect: string;
    };
    loadingPlaceholder: {
        text: {
            height: string;
        };
    };
    useColorSchemeMediaQuery: boolean;
    colors: {
        text: string;
        textMediumEmphasis: string;
        textDisabled: string;
        textPrimary: string;
        background: string;
        onBackground: string;
        primary: string;
        onPrimary: string;
        primaryDark: string;
        onPrimaryDark: string;
        primaryLight: string;
        onPrimaryLight: string;
        primaryLighter: string;
        onPrimaryLighter: string;
        primaryLightest: string;
        onPrimaryLightest: string;
        secondary: string;
        onSecondary: string;
        surface: string;
        onSurface: string;
        surfaceTransparent: string;
        onSurfaceTransparent: string;
        surfaceBlurTransparent: string;
        onSurfaceBlurTransparent: string;
        border: string;
        borderEmphasized: string;
        overlay: string;
        onOverlay: string;
        muted: string;
        mutedLight: string;
        gray: string;
        highlight: string;
        icon: string;
        error: string;
        onError: string;
        warning: string;
        onWarning: string;
        tintWarning: string;
        danger: string;
        onDanger: string;
        tintYellow: string;
        onTintYellow: string;
        tintError: string;
        onTintError: string;
        materialStage: {
            presented: string;
            onPresented: string;
            practiced: string;
            onPracticed: string;
            mastered: string;
            onMastered: string;
        };
        modes: {
            dark: {
                text: string;
                textMediumEmphasis: string;
                textDisabled: string;
                textPrimary: string;
                primary: string;
                onPrimary: string;
                background: string;
                onBackground: string;
                surface: string;
                onSurface: string;
                surfaceTransparent: string;
                onSurfaceTransparent: string;
                surfaceBlurTransparent: string;
                onSurfaceBlurTransparent: string;
                primaryDark: string;
                onPrimaryDark: string;
                icon: string;
                border: string;
                muted: string;
                mutedLight: string;
                overlay: string;
                onOverlay: string;
                warning: string;
                onWarning: string;
                tintWarning: string;
                tintError: string;
                onTintError: string;
                error: string;
                onError: string;
            };
        };
    };
    fonts: {
        body: string;
        heading: string;
    };
    fontSizes: number[];
    fontWeights: {
        heading: number;
        body: number;
    };
    space: number[];
    sizes: {
        avatar: number;
        appbar: number;
        sidebar: {
            mobile: number;
            desktop: number;
        };
        icon: number;
        table: {
            row: number;
            header: number;
        };
        maxWidth: {
            xsm: number;
            sm: number;
            md: number;
            lg: number;
        };
    };
    radii: {
        default: number;
        circle: number;
    };
    shadows: {
        low: string;
    };
};
export declare type Theme = typeof Theme;
export default Theme;
