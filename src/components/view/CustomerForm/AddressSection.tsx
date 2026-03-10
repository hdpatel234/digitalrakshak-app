'use client'

import { useEffect, useMemo } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { FormItem } from '@/components/ui/Form'
import { Controller, useWatch } from 'react-hook-form'
import useSWR from 'swr'
import { apiGetCountries } from '@/services/auth/countries'
import { apiGetStates } from '@/services/auth/states'
import { apiGetCities } from '@/services/auth/cities'
import type {
    CountriesApiResponse,
    FormSectionBaseProps,
    LocationApiResponse,
} from './types'
import { components } from 'react-select'
import type { ControlProps, OptionProps } from 'react-select'

type AddressSectionProps = FormSectionBaseProps

type SelectOption = {
    label: string
    value: string
    flagCode?: string
}

const { Control } = components

const CountrySelectOption = (props: OptionProps<SelectOption>) => {
    return (
        <DefaultOption<SelectOption>
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.flagCode}.png`}
                    />
                    <span>{label}</span>
                </span>
            )}
        />
    )
}

const CountrySelectControl = ({ children, ...props }: ControlProps<SelectOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected?.flagCode && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.flagCode}.png`}
                />
            )}
            {children}
        </Control>
    )
}

const AddressSection = ({ control, errors, setValue }: AddressSectionProps) => {
    const countryValue = useWatch({ control, name: 'country' })
    const stateValue = useWatch({ control, name: 'state' })
    const cityValue = useWatch({ control, name: 'city' })

    const { data: countriesData } = useSWR<CountriesApiResponse>(
        '/api/auth/countries',
        () => apiGetCountries<CountriesApiResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const { data: statesData } = useSWR<LocationApiResponse>(
        countryValue ? `/api/auth/states?country_id=${countryValue}` : null,
        () => apiGetStates<LocationApiResponse>(countryValue as string),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const { data: citiesData } = useSWR<LocationApiResponse>(
        stateValue ? `/api/auth/cities?state_id=${stateValue}` : null,
        () => apiGetCities<LocationApiResponse>(stateValue as string),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const countryOptions = useMemo(
        () =>
            (countriesData?.data || []).map((country) => ({
                label: country.name,
                value: String(country.id),
                flagCode: country.isoCode2,
            })),
        [countriesData],
    )

    const stateOptions = useMemo(
        () =>
            (statesData?.data || []).map((state) => ({
                label: state.name,
                value: String(state.id),
            })),
        [statesData],
    )

    const cityOptions = useMemo(
        () =>
            (citiesData?.data || []).map((city) => ({
                label: city.name,
                value: String(city.id),
            })),
        [citiesData],
    )

    useEffect(() => {
        if (!countryValue) {
            setValue('state', '')
            setValue('city', '')
            return
        }

        if (
            stateValue &&
            stateOptions.length > 0 &&
            !stateOptions.some((option) => option.value === stateValue)
        ) {
            setValue('state', '')
            setValue('city', '')
        }
    }, [countryValue, setValue, stateOptions, stateValue])

    useEffect(() => {
        if (!stateValue) {
            setValue('city', '')
            return
        }

        if (
            cityValue &&
            cityOptions.length > 0 &&
            !cityOptions.some((option) => option.value === cityValue)
        ) {
            setValue('city', '')
        }
    }, [cityOptions, cityValue, setValue, stateValue])

    return (
        <Card>
            <h4 className="mb-6">Address Information</h4>
            <FormItem
                label="Address"
                invalid={Boolean(errors.address)}
                errorMessage={errors.address?.message}
            >
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Address"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="Country"
                    invalid={Boolean(errors.country)}
                    errorMessage={errors.country?.message}
                >
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <Select<SelectOption>
                                instanceId="country"
                                options={countryOptions}
                                components={{
                                    Option: CountrySelectOption,
                                    Control: CountrySelectControl,
                                }}
                                placeholder="Select Country"
                                value={countryOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) => {
                                    field.onChange(option?.value || '')
                                    setValue('state', '')
                                    setValue('city', '')
                                }}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="State"
                    invalid={Boolean(errors.state)}
                    errorMessage={errors.state?.message}
                >
                    <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                            <Select<SelectOption>
                                instanceId="state"
                                options={stateOptions}
                                placeholder="Select State"
                                isDisabled={!countryValue}
                                value={stateOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) => {
                                    field.onChange(option?.value || '')
                                    setValue('city', '')
                                }}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="City"
                    invalid={Boolean(errors.city)}
                    errorMessage={errors.city?.message}
                >
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <Select<SelectOption>
                                instanceId="city"
                                options={cityOptions}
                                placeholder="Select City"
                                isDisabled={!stateValue}
                                value={cityOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value || '')
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Zip Code"
                    invalid={Boolean(errors.postcode)}
                    errorMessage={errors.postcode?.message}
                >
                    <Controller
                        name="postcode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                autoComplete="off"
                                placeholder="Zip Code"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default AddressSection
