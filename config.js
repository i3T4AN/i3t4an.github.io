/* Portfolio Config - Ethan Blair */
window.SITE = {
    name: "Ethan Blair",
    tagline: "Enterprise Systems • Automation • AI Development",
    hero: {
        title: "Building Practical Tools for Enterprise Systems.",
        paragraph: "I'm Ethan Blair, I studied at the University of Northern Colorado. My focus is on enterprise technology, automation, and AI development. I enjoy building practical tools that make systems work more efficiently."
    },
    socials: {
        github: "https://github.com/i3T4AN",
        linkedin: "https://www.linkedin.com/in/ethan-blair-99a3b72a2",
        email: "mailto:i3t4an8lair@gmail.com"
    },
    skills: {
        development: [
            "JavaScript/TypeScript, React, Node.js",
            "Python, C#, Objective-C",
            "PowerShell, AppleScript, Xcode"
        ],
        automation: [
            "Microsoft Copilot Studio",
            "Power Automate",
            "Mabl (Automated QA Testing)"
        ],
        systems: [
            "Microsoft Azure, Intune, SCCM",
            "Power BI",
            "macOS, Windows, Linux",
            "Q-SYS (AV Integration)"
        ]
    },
    repos: [
        { group: 'dev', url: 'https://github.com/i3T4AN/csv-watcher' },
        { group: 'dev', url: 'https://github.com/i3T4AN/sudokusolver-resume' },
        { group: 'dev', url: 'https://github.com/i3T4AN/numberguesser-resume' },
        { group: 'dev', url: 'https://github.com/i3T4AN/weatherCLI' },
        { group: 'dev', url: 'https://github.com/i3T4AN/streamdock' },
        { group: 'ai', url: 'https://github.com/i3T4AN/Agent_Example' },
        { group: 'ai', url: 'https://github.com/i3T4AN/Kali_Linux_MCP' },
        { group: 'ai', url: 'https://github.com/i3T4AN/lmstudio-openai-proxy' },
        { group: 'ai', url: 'https://github.com/i3T4AN/Claude-Gemini-MCP-Integration-Server' },
        { group: 'ai', url: 'https://github.com/i3T4AN/Claude_MCP_Bridge' },
        { group: 'ai', url: 'https://github.com/i3T4AN/evillimiter-mcp-server' },
        { group: 'ai', url: 'https://github.com/i3T4AN/Vector-Knowledge-Base' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/applescript-device-rename' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/SCCM-font-install-no-restart' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/azuread-inactive-users-export' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/macos-setup' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/SAD_Group_Proj' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/Cross-platform-sys-reporting' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/qsys-av-scheduler' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/ADSI-ComputerQuery' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/audit-AD-Computers' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/LanSchoolRegRemove' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/Get-ADDeviceList' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/Rename-ADComputerClient' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/Syspulse' }
    ],
    terminal: {
        welcomeMessage: "Welcome to Ethan's interactive terminal. Type '--help' to see available commands.",
        prompt: "visitor@i3t4an.github.io:~$ ",
        title: "terminal — bash",
        asciiArt: `
▓▓▓▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▓▓▓▓▓▒▓▓▓▓▒▒▓▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▓▓▓▒▒▓▒▒▒▒▓▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░░░░░▒▒▒▒░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒░▒▒▒▒▒▒▓▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░░░░░░░░▒▒░░░▒▒░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▓▓▒▒▒▓▓▓▓▒▒▒▒░▒░▒▒▒▒▒▒▒▒▒▒▓▓▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░░░▒░░░░░▒░░░░░░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒░░░▒▒▒▒▒▒░░▒▒▒░░░▒░▒▒░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░▒░▒▒░▒░░░░▒▒░░░▒░░░░░░░░▒▒▒▒▒▓▓▓▒▒▒▒▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒░░▒▒▒░░▒▒░░ ░░░░░░▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░▒▒░░░░▒▒░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▓▒▒░░░░░░░░░░      ░░░░░░░░ ░░░░ ░ ░░░▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     ░░░   ░░░░░░                 ░░▒░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░▒▒░░░░░░░░░░░░░░░░░░░▒░░░░░░░░      ░  ░░ ░                        ░░░░░▓▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░           ░░░░                          ░░░░░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░░░░░░░░░▒▒░░░░░░░░░░░░░░░░                ░░░                           ░░ ░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                    ░░                       ░  ░░░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                                           ░   ░░░░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░░░░░░░░░░░░░░░░░░░░            ░░░░░░░░░░                        ░    ░░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░░░░░░░░░░░░░░░░░░░░          ░░░░░░░░░░░░░░░░░ ░                ░     ░░░░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▒▒▒░░░░░░░░░░░░░░░▒░░░░░░░░░         ░░░░░░░░░░░░░░░░░░░░░               ░ ░░░░░░░▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓
░▒░▒▒▒▒░░░░░░░░░░░░░░░░░░░░░        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░       ░░░░░░░░░░░░░▒░▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓
░░░░░░░░▒▒░░░░░░░░░░░░░░░░░░       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ░░▒░▒▒▒░░░░░░░░▒░░░▒▒▒▒▒▒▒▒▒▒▒▒▓
░░░░░░░░░░░░░▒░░░░░░░░░░░░░░       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▒░▒▒░░░░░░░░░▒▒░░▒▒▒▒▒▒▒▒
░░░░░░░░░░░░░░░░▒▒▒░░░░░░░░░      ░░░░░░░░        ░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▓▓▓▓▓▒▒▒▒▒▒▒░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒░░░░░░░░░░░░░▒▒░░▒▒▒▒░░░░░░    ░░░░░░░         ░░░░░░░░░░░░░░▒▒▒▒▓▓▒▓▓▓▓▓▓▒▒░▒▒▒░░░░░░░░░░▒░▒▒▒▒▒▒
░░▒▒░░░░░░░░░░░░░░░░░░▒░░▒▒░░    ░▒▒░                ░░░░░░░░░░░░░░░▒▓▓▓▓▓▓▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░▒▒
░░░░░░░░░▒▒░░░░░░░░░░░░░░░░░░░   ░░░░                 ░░░▒░          ░▒▓▓▓▓▒▒▒▒▒▒▒░░░░░░░░░▒░░░░░░▒░
░░░░░░░░░▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░                ░░░▒▒░       ░░░░░▒▒▒▓▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░           ░ ░░░░░░         ░░░▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░▒▒▒░░░░░░░░░░░░░░░░░░       ░ ░░░░░░▒▒▓░       ░░░░░▒░▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▒▒░       ░░▒▒░▓▒▓▓▓▓░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▓▓▓▓▒░░░   ░░░░▒▓▓▓▒▒░▒▒░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒░░░░░░░░░░░░░░░░░░░░░░ ░░░░░▒▓▒▓▒░░░░░▒▓▓▓▓▓▓▓▓▓▓░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒░░░░░░░░▒▒▓▓▓▓▓▓▓▒▒░▒░░░▒▒▒▒▒▒░▒▒▒▒▒▒▒▒▒▒▒
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒░░░░░░░▒▒▓▓▓▓▓▒▒▒▒▒░░░░░░░░░░░░░░░░░▒▒▒▒▒
░░▒▒▒░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░     ░░░░▒▒▒▒░▒░▒▒▒▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░
░░░░░▒▒▒░▒▒▒▒▒▒▓▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░▒▒▒▓▓░░░░▒▓▒▒▓▓▓▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
░░░░░░░░▒░░▒▒▒░▓▒░░▒▒▒▒▒▒▒▒▒▒░   ░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▒░▒▓▒▒▒▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
░░░░░░░░▒ ░▒▒░░▒▒░░░▒▒▒▒▒▒▒▒     ░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▒▒▓▓▒▒▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
░▒▒▒▓▓░░░ ░░░░░░░░░░▒▒░░░░░      ░░░░░░░░░░░░░░░░░░░░▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░
▒▒▒░▒▒▓▒░░░░░░░░░░░░▒▒░░░         ░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░▒▒░░░░░░░░░░░▒▒░░░░░░░░░
░░░░░▒▓▒░░░░░░░░░░░░▒▒░           ░░░░░░░░ ░░░░░░░░░░░░▒▒▒▒▓▓▓▓▓▒ ▒░░░░░░░░░▒▒░░░░░░░░░░░▒▒░░░░░░░░░
░▒▒▒▒░░░▒░░░░░░░▒▒▒░               ░░░░░░░░░░░░░ ░░░░░░░▒▒▒▓▓▓▓▒░  ▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
░▒░░░░░░░▒░▒░▒░                    ░░░░░░░░░░░░░░░░▒▒▓▓▓▓▓▓▓▓▓▒░▒  ▒  ▒▒░░░░▒▒░░░░░░░░░░░▒▒░░░░░░░░░
░░░░░▒▒░ ░░                        ░░░░░░░░░░░░░░░▒▒▒▓▓▓▓▓▓▓▒░ ▒▒    ░▒▒▒ ░▒░▒▒▒░░░░░░░░░▒▒░░░░░░░░░
▒░░                                ░░░░░░░░░░░░░░▒▒▒▓▓▓▓▓▓▒░░ ▒▒░    ░░░▒▒  ░░░░░░░░░░░░░▒▒░░░░░░░░░
                                   ░░░░░░░░░░░░░░▒▒▒▓▓▓▓▒░░░ ▒▒▒     ░░░▒▒░   ░  ░   ░░░ ░▒░░▒▒▒▒▒▒▒
                                  ░░░░░░░░░░░░░░░░▒▒▒▒░░░░░ ▒▒▒░     ░░░░░░     ░  ░       ░░░░░▒░░░
                   ░░       ░░ ░  ░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▒     ░░░░░░       ░         ░░░ ░░▒▒▒
                   ░░░░     ░░ ░▒▒░░░░░░░░░░░░░░░░░░░░░░░ ▒▒▓▒░    ░░░  ░░                 ░░   ▒░░░
                      ░░░     ░░░░▒▓▒░░░░░░░░░░░░░░░░░░░░▒▓▓▒░░      ░░░░                  ░    ▒▒░░
                     ░ ░░    ░░▒ ░░▒▒▓▓░░░░░░░░░░░░░░░░▒▒▓▓▓▒░    ░░░                           ▒▒░░
                             ░▒▒░░░░▒▒▒▒▒▒░░░░░░░░░░░░▒▒▓▓▒▒░░    ░░  ░░                        ▒▒ ░
                       ░ ░    ▒▒▒░░░░▒▒▒▒▒▒▒▒▒░░░░░▒▒▒▓▓▒▒▒▒░     ░ ░░░░                        ▒░░▒
                        ░░     ▒▒░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░         ░░                        ▒░░░
                         ░     ░▒▒░▒▒▒▒▒▒░░░▒▒▒▒▒▒▒░░▒▒▒▒▒▒░░      ░░                           ▒░░░
                                ░▒▒▒▒▒░░░░░▒▒▒▒▒▒▒▒▒▒░░░▒▒▒▒                                    ▒░░░
                                 ░▒░▒▒▒▒▒░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░           ░░                       ░░░░`,
        whoami: [
            "Debugging: Being the detective in a crime you committed",
            "I speak fluent binary, but management prefers PowerPoint",
            "Code works perfectly until it meets users",
            "My code is like my jokes - they only work in my head",
            "I turn coffee into enterprise solutions",
            "404: Motivation not found, please try again Monday",
            "I automate everything except my own procrastination",
            "Professional code whisperer and occasional code shouter",
            "I put the 'oops' in DevOps",
            "Making computers do things since they stopped being room-sized",
            "Still searching for the perfect merge conflict resolution",
            "I write documentation like I floss - irregularly but with good intentions",
            "Making legacy systems slightly less legacy since 2024",
            "I've seen things you wouldn't believe - COBOL in production in 2025",
            "Network admin by day, network blamer by... also day",
            "Automating the automation that automates the automation",
            "Enterprise systems: Where simple tasks go to become complex workflows",
            "Building bridges between humans and machines, mostly for the machines",
            "Code is poetry, debugging is literary criticism",
            "I believe in documentation the way others believe in unicorns",
            "Making the complex simple, then making it complex again for enterprise",
            "Professional digital plumber - I fix what's broken and break what's fixed",
            "JavaScript: The language that convinced me semicolons are just suggestions",
            "TypeScript: JavaScript with trust issues",
            "React: I render components, not judgment",
            "Node.js: Bringing JavaScript's chaos to servers since 2009",
            "Python: The only snake I'm not afraid of",
            "C#: Microsoft's apology for Visual Basic",
            "Objective-C: Square brackets everywhere, sanity nowhere",
            "PowerShell: Making Windows bearable one cmdlet at a time",
            "AppleScript: Teaching machines to think like creative directors",
            "Xcode: 90% waiting, 10% coding, 100% frustration",
            "Copilot Studio: Teaching AI to automate my automation",
            "Power Automate: Because clicking buttons is so last century",
            "Mabl QA: Finding bugs faster than developers can create them",
            "AI-assisted coding: Finally, a rubber duck that codes back",
            "Quality Assurance: Professional dream crusher since testing began",
            "Azure: The cloud with more services than a fancy hotel",
            "Intune: Managing devices remotely so I don't have to",
            "SCCM: System Center Configuration Manager or 'Why Won't This Deploy'",
            "Power BI: Making data look prettier than it actually is",
            "macOS: Unix in a turtleneck",
            "Windows: The OS that taught me patience",
            "Linux: Because I enjoy earning my desktop environment",
            "Q-SYS: Making conference rooms smarter than their occupants",
            "Multi-platform admin: Fluent in Windows cursing and Unix muttering"
        ],
        commands: {
            '--help': 'Show list of all commands with one-line summaries',
            'about': 'Print hero title and paragraph',
            'skills': 'Print grouped lists of skills',
            'projects': 'Show compact table of featured repos',
            'project': 'Show details for single project',
            'links': 'Print GitHub, LinkedIn, and email links',
            'theme': 'Toggle theme',
            'matrix': 'Enable/disable code-rain effect',
            'clear': 'Clear the terminal screen',
            'history': 'List last 20 commands',
            'palette': 'Show current CSS variables',
            'whoami': 'Return one-liner and tagline'
        },
        messages: {
            commandNotFound: "Command not found: {cmd}. Type '--help' for available commands.",
            projectUsage: 'Usage: project <name>',
            projectDetails: 'Project details for: {name}',
            projectNote: 'Detailed project view would be implemented here.',
            projectsInfo: 'Featured Projects (from GitHub):',
            projectsBrowse: 'Use the visual interface above to browse projects, or type "project <name>" for details.',
            themeUsage: 'Usage: theme <light|dark|auto>',
            themeSet: 'Theme set to: {theme}',
            matrixUsage: 'Usage: matrix <on|off>',
            matrixOn: 'Matrix effect activated for 100 seconds',
            matrixOff: 'Matrix effect deactivated',
            skillsTitle: 'Technical Skills:',
            connectTitle: 'Connect with me:',
            commandsTitle: 'Available commands:',
            historyTitle: 'Last 20 commands:',
            paletteTitle: 'CSS Variables:',
            taglinePrefix: 'Tagline:',
            noProjectsFound: 'No projects match the current filter.',
            developmentTitle: 'Programming & Development',
            automationTitle: 'AI, QA & Automation',
            systemsTitle: 'Cloud, Systems & Tools'
        },
        matrix: {
            characters: "013456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            duration: 100000
        }
    }
};
