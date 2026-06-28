const SideDesign = () => {
    return (
        <div className="hidden lg:flex relative overflow-hidden rounded-3xl">
            {/* Background gradient layer */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(135deg, #0B3C5D 0%, #0a2f4a 40%, #061e30 100%)',
                }}
            />
            {/* Subtle pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                    backgroundSize: '32px 32px',
                }}
            />
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 2xl:px-20">
                <img
                    className="max-w-[380px] 2xl:max-w-[480px] w-full drop-shadow-2xl mb-12"
                    src="/img/others/auth-signin-hero.png"
                    alt="Digital Rakshak - Secure Identity Verification"
                />
                <div className="text-center max-w-[460px]">
                    <h1 className="text-2xl 2xl:text-3xl font-bold text-white mb-4 leading-tight">
                        Secure Digital Identity
                        <br />
                        <span className="text-sky-300">
                            at Your Fingertips
                        </span>
                    </h1>
                    <p className="text-white/60 text-sm 2xl:text-base font-medium leading-relaxed">
                        Protect and manage your digital documents with
                        enterprise-grade security. Your identity, verified
                        and safeguarded.
                    </p>
                </div>
                {/* Decorative floating dots */}
                <div className="absolute top-16 right-16 w-3 h-3 bg-sky-400/30 rounded-full" />
                <div className="absolute top-32 right-28 w-2 h-2 bg-sky-300/20 rounded-full" />
                <div className="absolute bottom-24 left-16 w-4 h-4 bg-sky-400/20 rounded-full" />
                <div className="absolute bottom-40 left-28 w-2 h-2 bg-sky-300/15 rounded-full" />
            </div>
            {/* Bottom gradient fade */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32"
                style={{
                    background:
                        'linear-gradient(to top, rgba(6,30,48,0.6), transparent)',
                }}
            />
        </div>
    )
}

export default SideDesign
