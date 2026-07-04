import { useTranslations } from 'next-intl'

export const useTranslation = (namespace?: string) => {
    const t = useTranslations(namespace)
    return (key: string, ...args: any[]) => {
        if (!key || key.trim() === '') {
            console.error('Empty translation key passed to t()! Namespace:', namespace);
        }
        return t(key, ...args)
    }
}

export default useTranslation
