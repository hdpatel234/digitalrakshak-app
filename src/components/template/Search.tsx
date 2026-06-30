'use client'

import { useState, useRef, useEffect } from 'react'
import classNames from '@/utils/classNames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import ScrollBar from '@/components/ui/ScrollBar'
import navigationIcon from '@/configs/navigation-icon.config'
import {
    GUIDE_PREFIX_PATH,
    UI_COMPONENTS_PREFIX_PATH,
} from '@/constants/route.constant'
import { apiGetSearchResult } from '@/services/CommonService'
import debounce from 'lodash/debounce'
import Spinner from '@/components/ui/Spinner'
import { HiOutlineSearch, HiChevronRight } from 'react-icons/hi'
import { PiMagnifyingGlassDuotone } from 'react-icons/pi'
import Link from 'next/link'
import Highlighter from 'react-highlight-words'

type SearchData = {
    key: string
    path: string
    title: string
    icon: string
    category: string
    categoryTitle: string
}

type SearchResult = {
    title: string
    data: SearchData[]
}

type SearchApiResponse = {
    status: boolean
    message: string
    data: SearchResult[]
}



const ListItem = (props: {
    icon: string
    label: string
    url: string
    isLast?: boolean
    keyWord: string
    onNavigate: () => void
}) => {
    const { icon, label, url = '', keyWord, onNavigate } = props

    return (
        <Link href={url} onClick={onNavigate}>
            <div
                className={classNames(
                    'flex items-center justify-between rounded-xl p-3 cursor-pointer user-select',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                )}
            >
                <div className="flex items-center gap-2">
                    <div
                        className={classNames(
                            'rounded-lg border-2 border-gray-200 shadow-xs text-xl group-hover:shadow-sm h-10 w-10 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                        )}
                    >
                        {icon && navigationIcon[icon]}
                    </div>
                    <div className="text-gray-900 dark:text-gray-300">
                        <Highlighter
                            autoEscape
                            highlightClassName={classNames(
                                'text-primary',
                                'underline bg-transparent font-semibold dark:text-white',
                            )}
                            searchWords={[keyWord]}
                            textToHighlight={label}
                        />
                    </div>
                </div>
                <HiChevronRight className="text-lg" />
            </div>
        </Link>
    )
}

const _Search = ({ className }: { className?: string }) => {
    const [searchDialogOpen, setSearchDialogOpen] = useState(false)
    const [searchResult, setSearchResult] = useState<SearchResult[]>([])
    const [noResult, setNoResult] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const handleReset = () => {
        setNoResult(false)
        setSearchResult([])
        setIsLoading(false)
    }

    const handleSearchOpen = () => {
        setSearchDialogOpen(true)
    }

    const handleSearchClose = () => {
        setSearchDialogOpen(false)
        handleReset()
    }

    const debounceFn = debounce(handleDebounceFn, 500)

    async function handleDebounceFn(query: string) {
        if (!query) {
            setSearchResult([])
            return
        }

        if (noResult) {
            setNoResult(false)
        }

        setIsLoading(true)

        try {
            const respond = await apiGetSearchResult<SearchApiResponse>({ query })

            if (respond && respond.status && respond.data) {
                if (respond.data.length === 0) {
                    setNoResult(true)
                }
                setSearchResult(respond.data)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    useEffect(() => {
        if (searchDialogOpen) {
            const timeout = setTimeout(() => inputRef.current?.focus(), 100)
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [searchDialogOpen])

    const handleNavigate = () => {
        handleSearchClose()
    }

    return (
        <>
            <div
                className={classNames(className, 'text-2xl')}
                onClick={handleSearchOpen}
            >
                <PiMagnifyingGlassDuotone />
            </div>
            <Dialog
                contentClassName="p-0"
                isOpen={searchDialogOpen}
                closable={false}
                onRequestClose={handleSearchClose}
            >
                <div>
                    <div className="px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center">
                            <HiOutlineSearch className="text-xl" />
                            <input
                                ref={inputRef}
                                className="ring-0 outline-hidden block w-full p-4 text-base bg-transparent text-gray-900 dark:text-gray-100"
                                placeholder="Search..."
                                onChange={handleSearch}
                            />
                        </div>
                        <Button size="xs" onClick={handleSearchClose}>
                            Esc
                        </Button>
                    </div>
                    <div className="py-6 px-5">
                        <ScrollBar className=" max-h-[350px] overflow-y-auto">
                            {isLoading && (
                                <div className="my-10 text-center flex flex-col items-center justify-center">
                                    <Spinner className="text-4xl mb-3 text-primary" />
                                    <span className="text-gray-500 text-lg">Searching...</span>
                                </div>
                            )}
                            {!isLoading && searchResult.map((result) => (
                                <div key={result.title} className="mb-4">
                                    <h6 className="mb-3">{result.title}</h6>
                                    {result.data.map((data, index) => (
                                        <ListItem
                                            key={data.title + index}
                                            icon={data.icon}
                                            label={data.title}
                                            url={data.path}
                                            keyWord={
                                                inputRef.current?.value || ''
                                            }
                                            onNavigate={handleNavigate}
                                        />
                                    ))}
                                </div>
                            ))}
                            {!isLoading && searchResult.length === 0 && noResult && (
                                <div className="my-10 text-center text-lg">
                                    <span>No results for </span>
                                    <span className="heading-text">
                                        {`'`}
                                        {inputRef.current?.value}
                                        {`'`}
                                    </span>
                                </div>
                            )}
                            {!isLoading && searchResult.length === 0 && !noResult && (
                                <div className="my-10 text-center text-lg text-gray-500 flex flex-col items-center justify-center">
                                    <HiOutlineSearch className="text-4xl mb-3 text-gray-300" />
                                    <span>Start typing to search...</span>
                                </div>
                            )}
                        </ScrollBar>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

const Search = withHeaderItem(_Search)

export default Search
