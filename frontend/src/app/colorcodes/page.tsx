"use client";

import {
    Check,
    Copy,
    Moon,
    Palette,
    Search,
    Sun,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
    paletteGroups,
    type PaletteColor,
} from "@/libs/theme-palette";

/* =========================================================
 * Copy Button
 * ========================================================= */

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1200);
        } catch {
            // Clipboard unavailable
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            className="
                inline-flex
                items-center
                gap-2
                rounded-md
                px-2
                py-1
                font-mono
                text-xs
                text-text-secondary
                transition
                hover:bg-surface-muted
                hover:text-text
            "
            title={`Copy ${value}`}
        >
            {copied ? (
                <Check className="size-3 text-success" />
            ) : (
                <Copy className="size-3 text-text-subtle" />
            )}

            <span>
                {copied ? "Copied" : value}
            </span>
        </button>
    );
}

/* =========================================================
 * Large Hover Preview
 * ========================================================= */

function LargeColorPreview({
    item,
}: {
    item: PaletteColor;
}) {
    return (
        <div
            className="
                pointer-events-none
                absolute
                bottom-full
                left-1/2
                z-50
                mb-4
                hidden
                w-72
                -translate-x-1/2
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-surface
                shadow-2xl
                group-hover/color:block
            "
        >
            {/* Large color */}
            <div
                className="h-40 w-full"
                style={{
                    backgroundColor: item.light.hex,
                }}
            />

            {/* Information */}
            <div className="space-y-3 p-4">
                <div>
                    <p className="text-sm font-semibold text-text">
                        {item.label}
                    </p>

                    <code className="mt-1 block text-[11px] text-text-muted">
                        --{item.token}
                    </code>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* HEX */}
                    <div>
                        <p
                            className="
                                mb-1
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-wider
                                text-text-subtle
                            "
                        >
                            HEX
                        </p>

                        <p className="font-mono text-xs text-text-secondary">
                            {item.light.hex}
                        </p>
                    </div>

                    {/* OKLCH */}
                    <div>
                        <p
                            className="
                                mb-1
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-wider
                                text-text-subtle
                            "
                        >
                            OKLCH
                        </p>

                        <p className="truncate font-mono text-xs text-text-secondary">
                            {item.light.oklch}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
 * Color Preview
 * ========================================================= */

function ColorPreview({
    item,
}: {
    item: PaletteColor;
}) {
    const [copied, setCopied] = useState<string | null>(null);

    const copyHex = async (hex: string) => {
        try {
            await navigator.clipboard.writeText(hex);
            setCopied(hex);

            setTimeout(() => {
                setCopied(null);
            }, 1200);
        } catch {
            // Clipboard unavailable
        }
    };

    return (
        <div className="flex items-center gap-3">
            {/* Light */}
            <div className="group/color relative">
                <button
                    type="button"
                    onClick={() => copyHex(item.light.hex)}
                    className="
                        group
                        relative
                        flex
                        h-14
                        w-14
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border
                        border-border
                        shadow-sm
                        transition-all
                        duration-200
                        hover:scale-105
                        hover:shadow-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary
                        focus:ring-offset-2
                        focus:ring-offset-background
                    "
                    style={{
                        backgroundColor: item.light.hex,
                    }}
                    title={`Copy ${item.light.hex}`}
                    aria-label={`Copy ${item.light.hex}`}
                >
                    <span
                        className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            bg-black/40
                            opacity-0
                            transition-opacity
                            group-hover:opacity-100
                        "
                    >
                        {copied === item.light.hex ? (
                            <Check className="size-4 text-white" />
                        ) : (
                            <Copy className="size-4 text-white" />
                        )}
                    </span>
                </button>

                <span className="mt-1 block text-center text-[9px] font-medium uppercase tracking-wider text-text-subtle">
                    Light
                </span>
            </div>

            {/* Dark */}
            <div className="group/color relative">
                <button
                    type="button"
                    onClick={() => copyHex(item.dark.hex)}
                    className="
                        group
                        relative
                        flex
                        h-14
                        w-14
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border
                        border-border
                        shadow-sm
                        transition-all
                        duration-200
                        hover:scale-105
                        hover:shadow-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary
                        focus:ring-offset-2
                        focus:ring-offset-background
                    "
                    style={{
                        backgroundColor: item.dark.hex,
                    }}
                    title={`Copy ${item.dark.hex}`}
                    aria-label={`Copy ${item.dark.hex}`}
                >
                    <span
                        className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            bg-black/40
                            opacity-0
                            transition-opacity
                            group-hover:opacity-100
                        "
                    >
                        {copied === item.dark.hex ? (
                            <Check className="size-4 text-white" />
                        ) : (
                            <Copy className="size-4 text-white" />
                        )}
                    </span>
                </button>

                <span className="mt-1 block text-center text-[9px] font-medium uppercase tracking-wider text-text-subtle">
                    Dark
                </span>
            </div>
        </div>
    );
}

/* =========================================================
 * Color Item
 * ========================================================= */

function ColorItem({
    item,
}: {
    item: PaletteColor;
}) {
    return (
        <div
            className="
                group
                grid
                grid-cols-1
                gap-5
                border-b
                border-border-subtle
                px-5
                py-5
                transition-colors
                last:border-0
                hover:bg-surface-subtle
                sm:grid-cols-[1.2fr_1fr_1fr_1.4fr_1fr_1fr]
                sm:items-center
            "
        >
            {/* Color */}
            <div className="min-w-0">
                <div className="flex items-center gap-4">
                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-text">
                            {item.label}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Light */}
            <div>
                <span
                    className="
                        mb-2
                        block
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-wider
                        text-text-subtle
                    "
                >
                    Light
                </span>

                <div className="flex items-center gap-2">
                    <div
                        className="
                            h-10
                            w-10
                            rounded-lg
                            border
                            border-border
                            shadow-sm
                        "
                        style={{
                            backgroundColor: item.light.hex,
                        }}
                    />

                    <CopyButton value={item.light.hex} />
                </div>
            </div>

            {/* Dark */}
            <div>
                <span
                    className="
                        mb-2
                        block
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-wider
                        text-text-subtle
                    "
                >
                    Dark
                </span>

                <div className="flex items-center gap-2">
                    <div
                        className="
                            h-10
                            w-10
                            rounded-lg
                            border
                            border-border
                            shadow-sm
                        "
                        style={{
                            backgroundColor: item.dark.hex,
                        }}
                    />

                    <CopyButton value={item.dark.hex} />
                </div>
            </div>

            {/* Variable */}
            <div className="min-w-0">
                <span
                    className="
                        mb-1
                        block
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-wider
                        text-text-subtle
                    "
                >
                    Variable
                </span>

                <CopyButton value={`--${item.token}`} />
            </div>

            {/* HEX */}
            <div>
                <span
                    className="
                        mb-1
                        block
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-wider
                        text-text-subtle
                    "
                >
                    HEX
                </span>

                <CopyButton value={item.light.hex} />
                <CopyButton value={item.dark.hex} />
            </div>

            {/* OKLCH */}
            <div>
                <span
                    className="
                        mb-1
                        block
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-wider
                        text-text-subtle
                    "
                >
                    OKLCH
                </span>

                <CopyButton value={item.light.oklch} />
                <CopyButton value={item.dark.oklch} />
            </div>
        </div>
    );
}

/* =========================================================
 * Page
 * ========================================================= */

export default function ColorsPage() {
    const [search, setSearch] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const normalizedSearch = search.trim().toLowerCase();

    /* -------------------------------------------------------
     * Theme
     * ------------------------------------------------------- */

    const toggleTheme = () => {
        const nextMode = !darkMode;

        setDarkMode(nextMode);

        document.documentElement.classList.toggle(
            "dark",
            nextMode,
        );
    };

    /* -------------------------------------------------------
     * Search
     * ------------------------------------------------------- */

    const filteredGroups = useMemo(() => {
        return paletteGroups
            .map((group) => ({
                ...group,

                colors: group.colors.filter((item) => {
                    if (!normalizedSearch) {
                        return true;
                    }

                    return (
                        item.label
                            .toLowerCase()
                            .includes(normalizedSearch) ||
                        item.token
                            .toLowerCase()
                            .includes(normalizedSearch) ||
                        item.light.hex
                            .toLowerCase()
                            .includes(normalizedSearch) ||
                        item.light.oklch
                            .toLowerCase()
                            .includes(normalizedSearch)
                    );
                }),
            }))
            .filter((group) => group.colors.length > 0);
    }, [normalizedSearch]);

    const totalResults = filteredGroups.reduce(
        (total, group) => total + group.colors.length,
        0,
    );

    return (
        <main
            className="
                min-h-screen
                bg-background
                text-foreground
                transition-colors
                duration-300
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-6xl
                    px-5
                    py-8
                    sm:px-8
                    sm:py-12
                "
            >
                {/* =================================================
                 * Header
                 * ================================================= */}

                <header className="mb-8">
                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-6
                        "
                    >
                        <div>
                            <div
                                className="
                                    mb-5
                                    flex
                                    size-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-border
                                    bg-surface
                                    shadow-sm
                                "
                            >
                                <Palette
                                    className="
                                        size-5
                                        text-text
                                    "
                                />
                            </div>

                            <h1
                                className="
                                    text-3xl
                                    font-semibold
                                    tracking-tight
                                    text-text
                                    sm:text-4xl
                                "
                            >
                                Color system
                            </h1>

                            <p
                                className="
                                    mt-2
                                    max-w-2xl
                                    text-sm
                                    leading-6
                                    text-text-muted
                                "
                            >
                                Explore the semantic colors
                                used throughout the design
                                system. Hover to preview and
                                click to copy.
                            </p>
                        </div>

                        {/* Theme button */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="
                                flex
                                shrink-0
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-border
                                bg-surface
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-text-secondary
                                shadow-sm
                                transition-all
                                hover:bg-surface-muted
                                hover:text-text
                                hover:shadow-md
                            "
                            title={
                                darkMode
                                    ? "Switch to light theme"
                                    : "Switch to dark theme"
                            }
                        >
                            {darkMode ? (
                                <Sun className="size-4" />
                            ) : (
                                <Moon className="size-4" />
                            )}

                            <span className="hidden sm:block">
                                {darkMode ? "Light" : "Dark"}
                            </span>
                        </button>
                    </div>
                </header>

                {/* =================================================
                 * Search
                 * ================================================= */}

                <div className="sticky top-4 z-20 mb-10">
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-border
                            bg-surface/95
                            px-4
                            py-3
                            shadow-sm
                            backdrop-blur
                            transition
                            focus-within:border-border-strong
                            focus-within:shadow-md
                        "
                    >
                        <Search
                            className="
                                size-4
                                shrink-0
                                text-text-subtle
                            "
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="
                                Search colors, tokens, HEX or OKLCH...
                            "
                            className="
                                min-w-0
                                flex-1
                                bg-transparent
                                text-sm
                                text-text
                                outline-none
                                placeholder:text-text-subtle
                            "
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="
                                    rounded-md
                                    px-2
                                    py-1
                                    text-xs
                                    font-medium
                                    text-text-muted
                                    transition
                                    hover:bg-surface-muted
                                    hover:text-text
                                "
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div
                        className="
                            mt-3
                            flex
                            items-center
                            justify-between
                            px-1
                        "
                    >
                        <p className="text-xs text-text-subtle">
                            {totalResults}{" "}
                            {totalResults === 1
                                ? "color"
                                : "colors"}
                            {search ? " found" : ""}
                        </p>

                        {search && (
                            <p className="text-xs text-text-subtle">
                                Searching all values
                            </p>
                        )}
                    </div>
                </div>

                {/* =================================================
                 * Groups
                 * ================================================= */}

                {filteredGroups.length > 0 ? (
                    <div className="space-y-10">
                        {filteredGroups.map((group) => (
                            <section key={group.name}>
                                {/* Group heading */}
                                <div
                                    className="
                                        mb-4
                                        flex
                                        items-end
                                        justify-between
                                        gap-4
                                    "
                                >
                                    <div>
                                        <h2
                                            className="
                                                text-sm
                                                font-semibold
                                                text-text
                                            "
                                        >
                                            {group.name}
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-text-muted
                                            "
                                        >
                                            {group.description}
                                        </p>
                                    </div>

                                    <span
                                        className="
                                            hidden
                                            rounded-full
                                            border
                                            border-border
                                            bg-surface
                                            px-2.5
                                            py-1
                                            text-[10px]
                                            font-medium
                                            text-text-muted
                                            sm:block
                                        "
                                    >
                                        {group.colors.length}{" "}
                                        {group.colors.length === 1
                                            ? "color"
                                            : "colors"}
                                    </span>
                                </div>

                                {/* Color table */}
                                <div
                                    className="
                                        overflow-visible
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-surface
                                        shadow-sm
                                        transition-shadow
                                        hover:shadow-md
                                    "
                                >
                                    {/* Table header */}
                                    <div
                                        className="
                                            hidden
                                            grid-cols-[1.2fr_1.4fr_1fr_1fr]
                                            border-b
                                            border-border-subtle
                                            bg-surface-subtle
                                            px-5
                                            py-3
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-text-subtle
                                            sm:grid
                                        "
                                    >
                                        <span>Color</span>
                                        <span>Variable</span>
                                        <span>HEX</span>
                                        <span>OKLCH</span>
                                    </div>

                                    {/* Colors */}
                                    {group.colors.map((item) => (
                                        <ColorItem
                                            key={item.token}
                                            item={item}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    /* Empty state */
                    <div
                        className="
                            rounded-2xl
                            border
                            border-dashed
                            border-border
                            bg-surface
                            px-6
                            py-16
                            text-center
                        "
                    >
                        <div
                            className="
                                mx-auto
                                mb-4
                                flex
                                size-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-surface-muted
                            "
                        >
                            <Search
                                className="
                                    size-5
                                    text-text-subtle
                                "
                            />
                        </div>

                        <h2
                            className="
                                text-sm
                                font-semibold
                                text-text
                            "
                        >
                            No colors found
                        </h2>

                        <p
                            className="
                                mx-auto
                                mt-1
                                max-w-sm
                                text-xs
                                leading-5
                                text-text-muted
                            "
                        >
                            Try searching by a color
                            name, token, HEX value,
                            or OKLCH value.
                        </p>

                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="
                                mt-5
                                rounded-lg
                                bg-primary
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-primary-foreground
                                transition
                                hover:opacity-90
                            "
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {/* =================================================
                 * Footer
                 * ================================================= */}

                <footer
                    className="
                        mt-12
                        border-t
                        border-border
                        pt-5
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <p className="text-xs text-text-subtle">
                            Semantic color tokens
                        </p>

                        <p className="text-xs text-text-subtle">
                            Hover preview · Click to copy
                        </p>
                    </div>
                </footer>
            </div>
        </main>
    );
}