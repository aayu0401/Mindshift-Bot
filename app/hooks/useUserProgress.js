"use client";
import { useState, useEffect } from 'react';
import { showToast } from '../components/Toast';

export const useUserProgress = () => {
    const [points, setPoints] = useState(0);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedPoints = parseInt(localStorage.getItem('mindshiftr_points') || '120');
            const storedStreak = parseInt(localStorage.getItem('mindshiftr_streak') || '5');
            setPoints(storedPoints);
            setStreak(storedStreak);
        }
    }, []);

    const addPoints = (amount) => {
        const newTotal = points + amount;
        setPoints(newTotal);
        if (typeof window !== 'undefined') {
            localStorage.setItem('mindshiftr_points', newTotal.toString());
        }
        showToast(`+${amount} Care Points Earned!`, 'success');
    };

    return { points, streak, addPoints };
};
