'use client'
import { useEffect } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { dateLocales } from '@/i18n/dateLocales'
import dayjs from 'dayjs'

import type { AbstractIntlMessages } from 'next-intl'

type LocaleProvider = {
    messages: AbstractIntlMessages
    children: React.ReactNode
    locale: string
}

const LocaleProvider = ({ messages, children, locale }: LocaleProvider) => {
    useEffect(() => {
        const loadDateLocale = dateLocales[locale] ?? dateLocales.en

        loadDateLocale().then(() => {
            dayjs.locale(locale in dateLocales ? locale : 'en')
        })
    }, [locale])

    return (
        <NextIntlClientProvider messages={messages} locale={locale} timeZone="UTC">
            {children}
        </NextIntlClientProvider>
    )
}

export default LocaleProvider