import Container from '@/components/shared/Container'
import Link from 'next/link'
import { FiLink } from 'react-icons/fi'

export default async function Page() {
    return (
        <Container>
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
                <div className="relative w-full max-w-md h-64 md:h-80 mb-8 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 group">
                    <img
                        src="/images/webhooks_coming_soon.png"
                        alt="Webhooks Coming Soon"
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-6">
                        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 text-white flex items-center gap-2">
                            <FiLink className="w-5 h-5" />
                            <span className="font-semibold tracking-wide">Developer Webhooks</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
                    Webhooks
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg mb-8 leading-relaxed">
                    We're crafting a powerful, secure webhooks integration for real-time data delivery. This feature is currently in active development.
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/settings"
                        className="px-8 py-3.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Go Back
                    </Link>
                    <button
                        disabled
                        className="px-8 py-3.5 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 font-semibold cursor-not-allowed border border-slate-200 dark:border-slate-700"
                    >
                        Coming Soon
                    </button>
                </div>
            </div>
        </Container>
    )
}
