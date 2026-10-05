export type PaletteColor = {
    token: string;
    label: string;
    use: string;
    light: { hex: string; oklch: string };
    dark: { hex: string; oklch: string };
};

export type PaletteGroup = { name: string; description: string; colors: PaletteColor[] };

const color = (token: string, label: string, use: string, lightHex: string, lightOklch: string, darkHex: string, darkOklch: string): PaletteColor => ({ token, label, use, light: { hex: lightHex, oklch: lightOklch }, dark: { hex: darkHex, oklch: darkOklch } });

export const paletteGroups: PaletteGroup[] = [
    {
        name: "Foundation", description: "Page, content, text, controls and dividers.", colors: [
            color("background", "App background", "Main canvas", "#F5F5F5", "oklch(0.970 0 0)", "#242424", "oklch(0.260 0 0)"),
            color("foreground", "Primary text", "Headings and body", "#242424", "oklch(0.260 0 0)", "#FFFFFF", "oklch(1 0 0)"),
            color("surface", "Content surface", "Headers and panels", "#FFFFFF", "oklch(1 0 0)", "#292929", "oklch(0.281 0 0)"),
            color("surface-2", "Raised surface", "Nested and elevated areas", "#EEEFF2", "oklch(0.952 0.004 271.4)", "#333333", "oklch(0.321 0 0)"),
            color("card", "Card", "Repeated content cards", "#FFFFFF", "oklch(1 0 0)", "#292929", "oklch(0.281 0 0)"),
            color("popover", "Popover", "Menus and dialogs", "#FFFFFF", "oklch(1 0 0)", "#333333", "oklch(0.321 0 0)"),
            color("secondary", "Secondary surface", "Quiet controls and rows", "#EEEFF2", "oklch(0.952 0.004 271.4)", "#383838", "oklch(0.341 0 0)"),
            color("muted", "Muted surface", "Subdued regions", "#EEEFF2", "oklch(0.952 0.004 271.4)", "#383838", "oklch(0.341 0 0)"),
            color("muted-foreground", "Secondary text", "Metadata and placeholders", "#616161", "oklch(0.493 0 0)", "#B5B5B5", "oklch(0.773 0 0)"),
            color("accent", "Interaction surface", "Hover and selected controls", "#E8E8F8", "oklch(0.936 0.022 286)", "#34345A", "oklch(0.344 0.066 282.4)"),
            color("border", "Border", "Dividers and containers", "#DADCE0", "oklch(0.894 0.006 264.5)", "#454545", "oklch(0.390 0 0)"),
            color("input", "Input border", "Fields and switches", "#D1D1D1", "oklch(0.861 0 0)", "#525252", "oklch(0.439 0 0)"),
        ]
    },
    {
        name: "Brand", description: "Primary actions, focus, selection and identity.", colors: [
            color("primary", "Primary", "Main actions", "#6264A7", "oklch(0.532 0.104 280.9)", "#7F85F5", "oklch(0.664 0.164 278.6)"),
            color("brand-hover", "Primary hover", "Active actions", "#464775", "oklch(0.419 0.076 281.6)", "#9297F7", "oklch(0.713 0.139 280)"),
            color("brand-soft", "Primary tint", "Selected navigation", "#E8E8F8", "oklch(0.936 0.022 286)", "#34345A", "oklch(0.344 0.066 282.4)"),
            color("ring", "Focus ring", "Keyboard focus", "#6264A7", "oklch(0.532 0.104 280.9)", "#7F85F5", "oklch(0.664 0.164 278.6)"),
        ]
    },
    {
        name: "Feedback & files", description: "Status, priority, file types and system feedback.", colors: [
            color("success", "Success", "Completed and online", "#237B4B", "oklch(0.519 0.112 155)", "#54B982", "oklch(0.711 0.125 157.1)"),
            color("success-soft", "Success tint", "Success backgrounds", "#E4F3EA", "oklch(0.950 0.020 159.7)", "#1F4030", "oklch(0.341 0.049 161.2)"),
            color("warning", "Warning", "Medium priority", "#9A6700", "oklch(0.554 0.117 75)", "#F5C451", "oklch(0.843 0.141 85.5)"),
            color("warning-soft", "Warning tint", "Warning backgrounds", "#FFF4CE", "oklch(0.966 0.051 93.7)", "#493C1F", "oklch(0.363 0.048 85.9)"),
            color("danger", "Danger", "Errors and high priority", "#C4314B", "oklch(0.548 0.182 16)", "#F1707B", "oklch(0.702 0.159 16.9)"),
            color("danger-soft", "Danger tint", "Danger backgrounds", "#FDE7E9", "oklch(0.946 0.024 11.3)", "#4A272D", "oklch(0.321 0.053 9.5)"),
            color("info", "Information", "Links and documents", "#0078D4", "oklch(0.568 0.167 251.3)", "#62ABF5", "oklch(0.725 0.131 250.4)"),
            color("info-soft", "Information tint", "Information backgrounds", "#E5F1FB", "oklch(0.952 0.019 243)", "#24394F", "oklch(0.337 0.047 250.5)"),
            color("violet", "Violet", "Image files", "#8B5CF6", "oklch(0.606 0.219 292.7)", "#B39AF8", "oklch(0.745 0.135 295.2)"),
            color("violet-soft", "Violet tint", "Image backgrounds", "#F0EAFD", "oklch(0.947 0.026 300.3)", "#3D3157", "oklch(0.344 0.066 297.4)"),
        ]
    },
    {
        name: "Navigation & charts", description: "Persistent navigation and data visualization.", colors: [
            color("sidebar", "Sidebar", "Main navigation", "#EBECEF", "oklch(0.943 0.004 271.4)", "#0F1B24", "oklch(0.215 0.025 241.7)"),
            color("sidebar-accent", "Sidebar selection", "Selected navigation", "#FFFFFF", "oklch(1 0 0)", "#1B2A35", "oklch(0.277 0.029 240.9)"),
            color("sidebar-border", "Sidebar divider", "Navigation separators", "#DADCE0", "oklch(0.894 0.006 264.5)", "#263742", "oklch(0.327 0.030 237.2)"),
            color("chart-1", "Chart 1", "Primary series", "#6264A7", "oklch(0.532 0.104 280.9)", "#7F85F5", "oklch(0.664 0.164 278.6)"),
            color("chart-2", "Chart 2", "Success series", "#237B4B", "oklch(0.519 0.112 155)", "#54B982", "oklch(0.711 0.125 157.1)"),
            color("chart-3", "Chart 3", "Warning series", "#9A6700", "oklch(0.554 0.117 75)", "#F5C451", "oklch(0.843 0.141 85.5)"),
            color("chart-4", "Chart 4", "Danger series", "#C4314B", "oklch(0.548 0.182 16)", "#F1707B", "oklch(0.702 0.159 16.9)"),
            color("chart-5", "Chart 5", "Information series", "#0078D4", "oklch(0.568 0.167 251.3)", "#62ABF5", "oklch(0.725 0.131 250.4)"),
        ]
    },
];

export const paletteCount = paletteGroups.reduce((sum, group) => sum + group.colors.length, 0);
