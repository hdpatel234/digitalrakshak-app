export type Variables =
    | 'primary'
    | 'primaryDeep'
    | 'primaryMild'
    | 'primarySubtle'
    | 'neutral'

export type ThemeVariables = Record<'light' | 'dark', Record<Variables, string>>

const defaultTheme: ThemeVariables = {
    light: {
        primary: '#2a85ff',
        primaryDeep: '#0069f6',
        primaryMild: '#4996ff',
        primarySubtle: '#2a85ff1a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#2a85ff',
        primaryDeep: '#0069f6',
        primaryMild: '#4996ff',
        primarySubtle: '#2a85ff1a',
        neutral: '#ffffff',
    },
}

const darkTheme: ThemeVariables = {
    light: {
        primary: '#18181b',
        primaryDeep: '#09090b',
        primaryMild: '#27272a',
        primarySubtle: '#18181b0d',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#ffffff',
        primaryDeep: '#09090b',
        primaryMild: '#e5e7eb',
        primarySubtle: '#ffffff1a',
        neutral: '#111827',
    },
}

const greenTheme: ThemeVariables = {
    light: {
        primary: '#0CAF60',
        primaryDeep: '#088d50',
        primaryMild: '#34c779',
        primarySubtle: '#0CAF601a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#0CAF60',
        primaryDeep: '#088d50',
        primaryMild: '#34c779',
        primarySubtle: '#0CAF601a',
        neutral: '#ffffff',
    },
}

const purpleTheme: ThemeVariables = {
    light: {
        primary: '#8C62FF',
        primaryDeep: '#704acc',
        primaryMild: '#a784ff',
        primarySubtle: '#8C62FF1a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#8C62FF',
        primaryDeep: '#704acc',
        primaryMild: '#a784ff',
        primarySubtle: '#8C62FF1a',
        neutral: '#ffffff',
    },
}

const orangeTheme: ThemeVariables = {
    light: {
        primary: '#fb732c',
        primaryDeep: '#cc5c24',
        primaryMild: '#fc8f56',
        primarySubtle: '#fb732c1a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#fb732c',
        primaryDeep: '#cc5c24',
        primaryMild: '#fc8f56',
        primarySubtle: '#fb732c1a',
        neutral: '#ffffff',
    },
}

const blueTheme: ThemeVariables = {
    light: {
        primary: '#2563eb',
        primaryDeep: '#1d4ed8',
        primaryMild: '#3b82f6',
        primarySubtle: '#2563eb1a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#3b82f6',
        primaryDeep: '#2563eb',
        primaryMild: '#60a5fa',
        primarySubtle: '#3b82f61a',
        neutral: '#0f172a',
    },
}

const redTheme: ThemeVariables = {
    light: {
        primary: '#ef4444',
        primaryDeep: '#dc2626',
        primaryMild: '#f87171',
        primarySubtle: '#ef44441a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#f87171',
        primaryDeep: '#ef4444',
        primaryMild: '#fca5a5',
        primarySubtle: '#f871711a',
        neutral: '#1f2937',
    },
}

const yellowTheme: ThemeVariables = {
    light: {
        primary: '#eab308',
        primaryDeep: '#ca8a04',
        primaryMild: '#facc15',
        primarySubtle: '#eab3081a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#facc15',
        primaryDeep: '#eab308',
        primaryMild: '#fde047',
        primarySubtle: '#facc151a',
        neutral: '#1e293b',
    },
}

const pinkTheme: ThemeVariables = {
    light: {
        primary: '#ec4899',
        primaryDeep: '#db2777',
        primaryMild: '#f472b6',
        primarySubtle: '#ec48991a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#f472b6',
        primaryDeep: '#ec4899',
        primaryMild: '#f9a8d4',
        primarySubtle: '#f472b61a',
        neutral: '#1e1b4b',
    },
}

const tealTheme: ThemeVariables = {
    light: {
        primary: '#14b8a6',
        primaryDeep: '#0d9488',
        primaryMild: '#2dd4bf',
        primarySubtle: '#14b8a61a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#2dd4bf',
        primaryDeep: '#14b8a6',
        primaryMild: '#5eead4',
        primarySubtle: '#2dd4bf1a',
        neutral: '#111827',
    },
}

const indigoTheme: ThemeVariables = {
    light: {
        primary: '#6366f1',
        primaryDeep: '#4f46e5',
        primaryMild: '#818cf8',
        primarySubtle: '#6366f11a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#818cf8',
        primaryDeep: '#6366f1',
        primaryMild: '#a5b4fc',
        primarySubtle: '#818cf81a',
        neutral: '#0f172a',
    },
}

const roseTheme: ThemeVariables = {
    light: {
        primary: '#f43f5e',
        primaryDeep: '#e11d48',
        primaryMild: '#fb7185',
        primarySubtle: '#f43f5e1a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#fb7185',
        primaryDeep: '#f43f5e',
        primaryMild: '#fda4af',
        primarySubtle: '#fb71851a',
        neutral: '#1f2937',
    },
}

const amberTheme: ThemeVariables = {
    light: {
        primary: '#f59e0b',
        primaryDeep: '#d97706',
        primaryMild: '#fbbf24',
        primarySubtle: '#f59e0b1a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#fbbf24',
        primaryDeep: '#f59e0b',
        primaryMild: '#fcd34d',
        primarySubtle: '#fbbf241a',
        neutral: '#1e293b',
    },
}

const cyanTheme: ThemeVariables = {
    light: {
        primary: '#06b6d4',
        primaryDeep: '#0891b2',
        primaryMild: '#22d3ee',
        primarySubtle: '#06b6d41a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#22d3ee',
        primaryDeep: '#06b6d4',
        primaryMild: '#67e8f9',
        primarySubtle: '#22d3ee1a',
        neutral: '#0f172a',
    },
}

const limeTheme: ThemeVariables = {
    light: {
        primary: '#84cc16',
        primaryDeep: '#65a30d',
        primaryMild: '#a3e635',
        primarySubtle: '#84cc161a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#a3e635',
        primaryDeep: '#84cc16',
        primaryMild: '#bef264',
        primarySubtle: '#a3e6351a',
        neutral: '#1e293b',
    },
}

const stoneTheme: ThemeVariables = {
    light: {
        primary: '#78716c',
        primaryDeep: '#57534e',
        primaryMild: '#a8a29e',
        primarySubtle: '#78716c1a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#d6d3d1',
        primaryDeep: '#a8a29e',
        primaryMild: '#e7e5e4',
        primarySubtle: '#d6d3d11a',
        neutral: '#1c1917',
    },
}

const oceanTheme: ThemeVariables = {
    light: {
        primary: '#0ea5e9',
        primaryDeep: '#0284c7',
        primaryMild: '#38bdf8',
        primarySubtle: '#0ea5e91a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#38bdf8',
        primaryDeep: '#0ea5e9',
        primaryMild: '#7dd3fc',
        primarySubtle: '#38bdf81a',
        neutral: '#0c4a6e',
    },
}

const sunsetTheme: ThemeVariables = {
    light: {
        primary: '#f97316',
        primaryDeep: '#ea580c',
        primaryMild: '#fb923c',
        primarySubtle: '#f973161a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#fb923c',
        primaryDeep: '#f97316',
        primaryMild: '#fdba74',
        primarySubtle: '#fb923c1a',
        neutral: '#7c2d12',
    },
}

const mintTheme: ThemeVariables = {
    light: {
        primary: '#10b981',
        primaryDeep: '#059669',
        primaryMild: '#34d399',
        primarySubtle: '#10b9811a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#34d399',
        primaryDeep: '#10b981',
        primaryMild: '#6ee7b7',
        primarySubtle: '#34d3991a',
        neutral: '#064e3b',
    },
}

const lavenderTheme: ThemeVariables = {
    light: {
        primary: '#a78bfa',
        primaryDeep: '#8b5cf6',
        primaryMild: '#c4b5fd',
        primarySubtle: '#a78bfa1a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#c4b5fd',
        primaryDeep: '#a78bfa',
        primaryMild: '#ddd6fe',
        primarySubtle: '#c4b5fd1a',
        neutral: '#2e1065',
    },
}

const coffeeTheme: ThemeVariables = {
    light: {
        primary: '#92400e',
        primaryDeep: '#78350f',
        primaryMild: '#b45309',
        primarySubtle: '#92400e1a',
        neutral: '#ffffff',
    },
    dark: {
        primary: '#d97706',
        primaryDeep: '#b45309',
        primaryMild: '#f59e0b',
        primarySubtle: '#d977061a',
        neutral: '#422006',
    },
}

const presetThemeSchemaConfig: Record<string, ThemeVariables> = {
    default: defaultTheme,
    dark: darkTheme,
    green: greenTheme,
    purple: purpleTheme,
    orange: orangeTheme,
    blue: blueTheme,
    red: redTheme,
    yellow: yellowTheme,
    pink: pinkTheme,
    teal: tealTheme,
    indigo: indigoTheme,
    rose: roseTheme,
    amber: amberTheme,
    cyan: cyanTheme,
    lime: limeTheme,
    stone: stoneTheme,
    ocean: oceanTheme,
    sunset: sunsetTheme,
    mint: mintTheme,
    lavender: lavenderTheme,
    coffee: coffeeTheme,
}

export default presetThemeSchemaConfig
