import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form'

export type OverviewFields = {
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneNumber: string
    img: string
}

export type AddressFields = {
    country?: string
    state?: string
    address?: string
    postcode?: string
    city?: string
    managerEmails?: string[]
}

export type ProfileImageFields = {
    img: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type AccountField = {
    banAccount?: boolean
    accountVerified?: boolean
}

export type CustomerFormSchema = OverviewFields &
    AddressFields &
    ProfileImageFields &
    TagsFields &
    AccountField

export type FormSectionBaseProps = {
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
    setValue: UseFormSetValue<CustomerFormSchema>
}

export type CountriesApiResponse = {
    status: boolean
    data: Array<{
        id: number
        name: string
        isoCode2: string
        isoCode3: string
        phoneCode: string
        currencyCode: string
        currencySymbol: string
        capital: string
        continent: string
        isDefault: boolean
        displayOrder: number
    }>
}

export type LocationApiResponse = {
    status: boolean
    data: Array<{
        id: number
        name: string
    }>
}
