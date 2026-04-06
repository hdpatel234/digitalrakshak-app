import Skeleton from '@/components/ui/Skeleton'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'
import Spinner from '@/components/ui/Spinner'
import classNames from 'classnames'
import type { CommonProps } from '@/@types/common'
import type { ElementType, ReactNode } from 'react'

interface BaseLoadingProps extends CommonProps {
    asElement?: ElementType
    customLoader?: ReactNode
    loading: boolean
    spinnerClass?: string
    skeleton?: ReactNode
}

interface LoadingProps extends BaseLoadingProps {
    type?: 'default' | 'cover'
}

const DefaultLoading = (props: BaseLoadingProps) => {
    const {
        loading,
        children,
        spinnerClass,
        className,
        asElement: Component = 'div',
        customLoader,
        skeleton,
    } = props

    return loading ? (
        <Component
            className={classNames(
                !customLoader && !skeleton && 'flex flex-col gap-4',
                className,
            )}
        >
            {customLoader ? (
                <>{customLoader}</>
            ) : skeleton ? (
                <>{skeleton}</>
            ) : (
                <TextBlockSkeleton />
            )}
        </Component>
    ) : (
        <>{children}</>
    )
}

const CoveredLoading = (props: BaseLoadingProps) => {
    const {
        loading,
        children,
        spinnerClass,
        className,
        asElement: Component = 'div',
        customLoader,
        skeleton,
    } = props

    return (
        <Component className={classNames(loading ? 'relative' : '', className)}>
            {children}
            {loading && (
                <div className="w-full h-full bg-white dark:bg-gray-800 dark:bg-opacity-60 bg-opacity-50 absolute inset-0" />
            )}
            {loading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full px-10">
                    {customLoader ? (
                        <div className="flex justify-center">{customLoader}</div>
                    ) : skeleton ? (
                        <>{skeleton}</>
                    ) : (
                        <div className="flex justify-center">
                            <Spinner className={spinnerClass} size={40} />
                        </div>
                    )}
                </div>
            )}
        </Component>
    )
}

const Loading = ({
    type = 'default',
    loading = false,
    asElement = 'div',
    ...rest
}: LoadingProps) => {
    switch (type) {
        case 'default':
            return (
                <DefaultLoading
                    loading={loading}
                    asElement={asElement}
                    {...rest}
                />
            )
        case 'cover':
            return (
                <CoveredLoading
                    loading={loading}
                    asElement={asElement}
                    {...rest}
                />
            )
        default:
            return (
                <DefaultLoading
                    loading={loading}
                    asElement={asElement}
                    {...rest}
                />
            )
    }
}

export default Loading
