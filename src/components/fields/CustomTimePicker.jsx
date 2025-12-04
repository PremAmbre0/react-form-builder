import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { getAccentColorHex } from '../../utils/colors';

export default function CustomTimePicker({ value, onChange, onClose, accentColor }) {
    const [selectedHour, setSelectedHour] = useState(12);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState('AM');
    const accentHex = getAccentColorHex(accentColor);

    const ITEM_HEIGHT = 40;
    const CONTAINER_HEIGHT = 192; // h-48
    const PADDING_Y = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2; // 76px

    // Refs
    const hourRef = useRef(null);
    const minuteRef = useRef(null);
    const periodRef = useRef(null);
    const lastEmittedValue = useRef(value);

    // Data
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    const periods = ['AM', 'PM'];

    // Render 3 sets for infinite scroll
    const loopedHours = [...hours, ...hours, ...hours];
    const loopedMinutes = [...minutes, ...minutes, ...minutes];

    // Helper to parse date
    const parseDate = (val) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) return null;
        let h = date.getHours();
        const m = date.getMinutes();
        const p = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        return { h, m, p };
    };

    // Initialize state from value
    useEffect(() => {
        if (value && value !== lastEmittedValue.current) {
            const parsed = parseDate(value);
            if (parsed) {
                setSelectedHour(parsed.h);
                setSelectedMinute(parsed.m);
                setSelectedPeriod(parsed.p);
            }
        }
    }, [value]);

    // Scroll to current state on mount and when state changes (if needed for initial sync)
    // We use useLayoutEffect to ensure it happens before paint if possible, avoiding jump
    useLayoutEffect(() => {
        const syncScroll = () => {
            scrollToValue(hourRef, selectedHour, hours);
            scrollToValue(minuteRef, selectedMinute, minutes);
            scrollToValue(periodRef, selectedPeriod, periods, false);
        };

        // We only want to force scroll if we haven't touched it yet? 
        // Or just always sync on mount?
        // Let's sync on mount.
        syncScroll();

        // Also set a timeout to ensure it sticks after layout
        setTimeout(syncScroll, 10);
    }, []); // Run once on mount

    // Also sync when value changes externally (handled by the useEffect above updating state, but we need to scroll too)
    useEffect(() => {
        if (value && value !== lastEmittedValue.current) {
            const parsed = parseDate(value);
            if (parsed) {
                setTimeout(() => {
                    scrollToValue(hourRef, parsed.h, hours);
                    scrollToValue(minuteRef, parsed.m, minutes);
                    scrollToValue(periodRef, parsed.p, periods, false);
                }, 0);
            }
        }
    }, [value]);

    const scrollToValue = (ref, val, list, isLooped = true) => {
        if (ref.current) {
            const listLength = list.length;
            const index = list.indexOf(val);
            if (index === -1) return;

            let targetIndex = index;
            if (isLooped) {
                // Scroll to middle set
                targetIndex = listLength + index;
            }

            ref.current.scrollTop = targetIndex * ITEM_HEIGHT;
        }
    };

    const emitChange = (h, m, p) => {
        const date = new Date();
        let hours24 = h;
        if (p === 'PM' && h !== 12) hours24 += 12;
        if (p === 'AM' && h === 12) hours24 = 0;
        date.setHours(hours24, m, 0, 0);

        const iso = date.toISOString();
        lastEmittedValue.current = iso;
        onChange(iso);
    };

    const handleScroll = (e, list, setFunc, type) => {
        const scrollTop = e.target.scrollTop;
        const listLength = list.length;
        const singleSetHeight = listLength * ITEM_HEIGHT;

        // Infinite Scroll Jump
        if (scrollTop < singleSetHeight / 2) {
            e.target.scrollTop = scrollTop + singleSetHeight;
            return;
        }
        else if (scrollTop > singleSetHeight * 2.5) {
            e.target.scrollTop = scrollTop - singleSetHeight;
            return;
        }

        const rawIndex = Math.round(scrollTop / ITEM_HEIGHT);
        const val = list[rawIndex % listLength];

        // Update state if changed
        if (type === 'hour' && val !== selectedHour) {
            setSelectedHour(val);
            emitChange(val, selectedMinute, selectedPeriod);
        } else if (type === 'minute' && val !== selectedMinute) {
            setSelectedMinute(val);
            emitChange(selectedHour, val, selectedPeriod);
        } else if (type === 'period' && val !== selectedPeriod) {
            setSelectedPeriod(val);
            emitChange(selectedHour, selectedMinute, val);
        }
    };

    const handleClick = (e, val, list, ref, type) => {
        e.stopPropagation();
        const currentScroll = ref.current.scrollTop;
        const listLength = list.length;
        const singleSetHeight = listLength * ITEM_HEIGHT;

        const currentSet = Math.floor(currentScroll / singleSetHeight);
        const index = list.indexOf(val);

        let targetIndex = (currentSet * listLength) + index;

        ref.current.scrollTo({
            top: targetIndex * ITEM_HEIGHT,
            behavior: 'smooth'
        });
    };

    return (
        <div
            className="absolute z-50 mt-2 bg-popover text-popover-foreground rounded-lg shadow-xl border border-border w-64 animate-in fade-in zoom-in-95 duration-200 overflow-hidden select-none"
            style={{ '--accent-color': accentHex }}
        >

            <div className="flex h-48 relative">
                {/* Selection Highlight Bar */}
                <div
                    className="absolute top-1/2 left-0 w-full h-10 -translate-y-1/2 pointer-events-none transition-colors"
                    style={{ backgroundColor: `var(--accent-color)`, opacity: 0.1 }}
                />

                {/* Hours Column */}
                <div
                    ref={hourRef}
                    onScroll={(e) => handleScroll(e, hours, setSelectedHour, 'hour')}
                    className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory border-r border-border/50 relative"
                >
                    <div style={{ paddingTop: PADDING_Y, paddingBottom: PADDING_Y }}>
                        {loopedHours.map((hour, i) => (
                            <div
                                key={`h-${i}`}
                                onClick={(e) => handleClick(e, hour, hours, hourRef, 'hour')}
                                className={`h-10 flex items-center justify-center cursor-pointer snap-center transition-all duration-200 ${selectedHour === hour
                                        ? 'font-bold text-lg scale-110 text-foreground'
                                        : 'text-muted-foreground/60 hover:text-[var(--accent-color)]'
                                    }`}
                            >
                                {hour.toString().padStart(2, '0')}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Minutes Column */}
                <div
                    ref={minuteRef}
                    onScroll={(e) => handleScroll(e, minutes, setSelectedMinute, 'minute')}
                    className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory border-r border-border/50 relative"
                >
                    <div style={{ paddingTop: PADDING_Y, paddingBottom: PADDING_Y }}>
                        {loopedMinutes.map((minute, i) => (
                            <div
                                key={`m-${i}`}
                                onClick={(e) => handleClick(e, minute, minutes, minuteRef, 'minute')}
                                className={`h-10 flex items-center justify-center cursor-pointer snap-center transition-all duration-200 ${selectedMinute === minute
                                        ? 'font-bold text-lg scale-110 text-foreground'
                                        : 'text-muted-foreground/60 hover:text-[var(--accent-color)]'
                                    }`}
                            >
                                {minute.toString().padStart(2, '0')}
                            </div>
                        ))}
                    </div>
                </div>

                {/* AM/PM Column */}
                <div
                    ref={periodRef}
                    onScroll={(e) => {
                        const scrollTop = e.target.scrollTop;
                        const index = Math.round(scrollTop / ITEM_HEIGHT);
                        const val = periods[index];
                        if (val && val !== selectedPeriod) {
                            setSelectedPeriod(val);
                            emitChange(selectedHour, selectedMinute, val);
                        }
                    }}
                    className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory relative"
                >
                    <div style={{ paddingTop: PADDING_Y, paddingBottom: PADDING_Y }}>
                        {periods.map((period, i) => (
                            <div
                                key={period}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    periodRef.current.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
                                }}
                                className={`h-10 flex items-center justify-center cursor-pointer snap-center transition-all duration-200 ${selectedPeriod === period
                                        ? 'font-bold text-lg scale-110 text-foreground'
                                        : 'text-muted-foreground/60 hover:text-[var(--accent-color)]'
                                    }`}
                            >
                                {period}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
