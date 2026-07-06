"use client";

import React, { useEffect, useState } from "react";
import { FiShoppingCart, FiBox, FiUserPlus } from "react-icons/fi";
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
            title: "Welcome Back",
            subtitle: "Your dashboard is ready with the latest updates.",
        },
        {
            title: "Morning",
            subtitle: "A productive day begins with organized verifications.",
        },
        {
            title: "Top of the Morning",
            subtitle: "Everything is set for today's screening activities.",
        },
        {
            title: "Hello",
            subtitle: "New candidates and verification requests are waiting.",
        },
        {
            title: "Fresh Start",
            subtitle: "Let's make today's verification process seamless.",
        },
        {
            title: "Have a Great Morning",
            subtitle: "Track every verification with confidence.",
        },
        {
            title: "Ready for Today?",
            subtitle: "Stay ahead with faster background verification.",
        },
        {
            title: "Good to See You",
            subtitle: "Let's begin another productive workday.",
        },
        {
            title: "Welcome",
            subtitle: "Manage your candidates efficiently from one place.",
        },
        {
            title: "Let's Get Started",
            subtitle: "Review pending reports and initiate new checks.",
        },
        {
            title: "Bright Morning",
            subtitle: "Your verification dashboard is ready.",
        },
        {
            title: "New Day, New Opportunities",
            subtitle: "Simplify today's verification workflow.",
        },
        {
            title: "Happy Morning",
            subtitle: "Everything you need is just a click away.",
        },
        {
            title: "Let's Make Progress",
            subtitle: "Keep your verification pipeline moving.",
        },
        {
            title: "Welcome Back",
            subtitle: "Today's verification insights are waiting for you.",
        },
        {
            title: "Good Morning",
            subtitle: "Deliver trusted verification reports faster today.",
        },
        {
            title: "Ready to Verify?",
            subtitle: "Start processing candidates with confidence.",
        },
        {
            title: "Have a Wonderful Morning",
            subtitle: "Let's build trust, one verification at a time.",
        },
    ],

    afternoon: [
        {
            title: "Good Afternoon",
            subtitle: "Keep your verification process moving smoothly.",
        },
        {
            title: "Welcome Back",
            subtitle: "Your pending tasks are ready for review.",
        },
        {
            title: "Hope You're Having a Great Day",
            subtitle: "Track completed and ongoing verifications effortlessly.",
        },
        {
            title: "Hello",
            subtitle: "Everything you need is right here on your dashboard.",
        },
        {
            title: "Keep the Momentum Going",
            subtitle: "Stay on top of your candidate screenings.",
        },
        {
            title: "Productive Afternoon",
            subtitle: "Every completed verification builds more trust.",
        },
        {
            title: "Let's Keep Moving",
            subtitle: "Review reports and complete pending requests.",
        },
        {
            title: "Welcome",
            subtitle: "Your verification insights are up to date.",
        },
        {
            title: "Stay Focused",
            subtitle: "Efficient verification starts with organized workflows.",
        },
        {
            title: "Great to See You",
            subtitle: "Continue managing candidates with ease.",
        },
        {
            title: "Keep Up the Great Work",
            subtitle: "You're making excellent progress today.",
        },
        {
            title: "Back at It",
            subtitle: "Your dashboard has the latest verification updates.",
        },
        {
            title: "Good Afternoon",
            subtitle: "Complete today's pending verifications efficiently.",
        },
        {
            title: "Let's Finish Strong",
            subtitle: "Every completed report matters.",
        },
        {
            title: "Stay Ahead",
            subtitle: "Review verification statuses in real time.",
        },
        {
            title: "Halfway Through the Day",
            subtitle: "Keep your workflow running smoothly.",
        },
        {
            title: "Welcome Back",
            subtitle: "Manage candidates faster than ever.",
        },
        {
            title: "Your Dashboard Awaits",
            subtitle: "Everything is organized and ready.",
        },
        {
            title: "Hope Your Day Is Going Well",
            subtitle: "Let's clear today's pending verification queue.",
        },
        {
            title: "Keep Going",
            subtitle: "Success comes one verification at a time.",
        },
    ],

    evening: [
        {
            title: "Good Evening",
            subtitle: "Review today's progress before wrapping up.",
        },
        {
            title: "Welcome Back",
            subtitle: "Let's finish today's pending tasks.",
        },
        {
            title: "Hope You Had a Great Day",
            subtitle: "Check the latest verification updates and reports.",
        },
        {
            title: "Nice to See You Again",
            subtitle: "You're almost done for the day.",
        },
        {
            title: "Almost There",
            subtitle: "Complete any remaining verification requests.",
        },
        {
            title: "Great Work Today",
            subtitle: "Take a quick look at today's completed reports.",
        },
        {
            title: "Evening Check-In",
            subtitle: "Stay updated before calling it a day.",
        },
        {
            title: "Wrapping Things Up",
            subtitle: "Review pending candidates and outstanding tasks.",
        },
        {
            title: "Good Evening",
            subtitle: "Your verification summary is waiting.",
        },
        {
            title: "End the Day Strong",
            subtitle: "Clear today's remaining verification queue.",
        },
        {
            title: "One Last Look",
            subtitle: "Everything you need is right here.",
        },
        {
            title: "Ready to Wrap Up?",
            subtitle: "A final review keeps tomorrow organized.",
        },
        {
            title: "Welcome",
            subtitle: "Your latest verification updates are ready.",
        },
        {
            title: "Today's Progress",
            subtitle: "See what's completed and what's pending.",
        },
        {
            title: "Hope Your Day Went Well",
            subtitle: "Let's finish the remaining tasks together.",
        },
        {
            title: "Stay Organized",
            subtitle: "Prepare tomorrow's work with today's insights.",
        },
        {
            title: "Final Review",
            subtitle: "Double-check reports before signing off.",
        },
        {
            title: "Great Job Today",
            subtitle: "Every completed verification makes a difference.",
        },
        {
            title: "Relax, You're Almost Done",
            subtitle: "Just a few clicks to finish today's work.",
        },
        {
            title: "Have a Peaceful Evening",
            subtitle: "See you tomorrow for another productive day.",
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
                <Link href="/orders/create">
                    <Button
                        variant="default"
                        icon={<FiShoppingCart className="w-4 h-4" />}
                    >
                        Place Order
                    </Button>
                </Link>
                <Link href="/packages/create">
                    <Button
                        variant="default"
                        icon={<FiBox className="w-4 h-4" />}
                    >
                        Create Package
                    </Button>
                </Link>
                <Link href="/candidates/create">
                    <Button
                        variant="default"
                        icon={<FiUserPlus className="w-4 h-4" />}
                    >
                        New Candidate
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default DashboardHeader;