"use client";

import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Link from "next/link";

type GreetingData = {
    title: string;
    subtitle: string;
};

const greetings: Record<"morning" | "afternoon" | "evening", GreetingData[]> = {
    morning: [
        {
            title: "Good Morning",
            subtitle: "Start your day by reviewing today's verification requests.",
        },
        {
            title: "Rise and Shine",
            subtitle: "Let's get today's background checks underway.",
        },
        {
            title: "Morning",
            subtitle: "A fresh day to manage candidates and verifications.",
        },
        {
            title: "Top of the Morning",
            subtitle: "Everything is ready for today's verification workflow.",
        },
        {
            title: "Have a Great Morning",
            subtitle: "Stay ahead with your latest verification updates.",
        },
        {
            title: "Hello, Good Morning",
            subtitle: "Welcome back! Let's make today productive.",
        },
    ],

    afternoon: [
        {
            title: "Good Afternoon",
            subtitle: "Keep your verification process moving smoothly.",
        },
        {
            title: "Hope You're Having a Great Day",
            subtitle: "Review pending candidates and completed reports.",
        },
        {
            title: "Hello",
            subtitle: "Everything you need is right here on your dashboard.",
        },
        {
            title: "Welcome Back",
            subtitle: "Your verification activities are waiting for you.",
        },
        {
            title: "Have a Productive Afternoon",
            subtitle: "Track progress and complete pending verifications.",
        },
    ],

    evening: [
        {
            title: "Good Evening",
            subtitle: "Review today's progress before wrapping up.",
        },
        {
            title: "Hope You Had a Great Day",
            subtitle: "Check the latest verification updates and reports.",
        },
        {
            title: "Welcome Back",
            subtitle: "You're all set to finish today's pending tasks.",
        },
        {
            title: "Have a Relaxing Evening",
            subtitle: "A quick review now can save time tomorrow.",
        },
        {
            title: "Nice to See You Again",
            subtitle: "Let's wrap up today's verification activities.",
        },
    ],
};

const getGreeting = (): GreetingData => {
    const hour = new Date().getHours();

    let options: GreetingData[];

    if (hour < 12) {
        options = greetings.morning;
    } else if (hour < 18) {
        options = greetings.afternoon;
    } else {
        options = greetings.evening;
    }

    return options[Math.floor(Math.random() * options.length)];
};

interface DashboardHeaderProps {
    userName?: string;
}

const DashboardHeader = ({
    userName = "User",
}: DashboardHeaderProps) => {
    const [greeting, setGreeting] = useState<GreetingData>({
        title: "Welcome",
        subtitle: "Loading your dashboard...",
    });

    useEffect(() => {
        setGreeting(getGreeting());
    }, []);

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {greeting.title}, {userName}
                </h1>

                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {greeting.subtitle}
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Link href="/candidates/create">
                    <Button
                        variant="default"
                        icon={<FiPlus className="w-4 h-4" />}
                    >
                        New Candidate
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default DashboardHeader;