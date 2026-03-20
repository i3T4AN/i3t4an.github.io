/* Portfolio Config */
window.SITE = {
    name: "Ethan Blair",
    tagline: "Enterprise Systems • Automation • Applied AI",
    url: "https://i3t4an.github.io/",
    profile: {
        githubUsername: "i3T4AN",
        affiliation: "University of Northern Colorado",
        jobTitle: "Desktop Engineer"
    },
    seo: {
        title: "Ethan Blair — Portfolio",
        description: "Desktop Engineer focused on enterprise systems, automation, applied AI, and software development.",
        ogType: "website",
        twitterCard: "summary",
        googleSiteVerification: "google47f0585bbbc7d4af"
    },
    hero: {
        title: "Building Practical Automation for Enterprise Systems.",
        paragraph: "I’m Ethan Blair, a University of Northern Colorado graduate in Computer Information Systems, a Desktop Engineer supporting enterprise systems at scale, and the Technical Co-Founder and lead developer behind WHATS THE MOVES LTD and <a href=\"https://wtms.live\">wtms.live</a>. My work centers on automation, applied AI, and software development that reduces manual effort and improves reliability."
    },
    socials: {
        github: "https://github.com/i3T4AN",
        linkedin: "https://www.linkedin.com/in/ethan-blair-99a3b72a2",
        email: "mailto:i3t4an8lair@gmail.com"
    },
    skills: {
        development: [
            "JavaScript/TypeScript",
            "React",
            "Node.js",
            "Python",
            "C#",
            "Objective-C",
            "PowerShell",
            "AppleScript",
            "Xcode",
            "FastAPI",
            "Lua",
            "Batch scripting",
            ".NET tooling",
            "API integration patterns"
        ],
        automation: [
            "Microsoft Power BI",
            "Microsoft Copilot Studio",
            "Power Automate",
            "Mabl (Automated QA Testing)",
            "RAG pipelines",
            "MCP server development",
            "Semantic search",
            "Vector databases (Qdrant)",
            "Multi-model LLM integration (Claude/Gemini/OpenAI-compatible proxies)"
        ],
        systems: [
            "Microsoft Intune",
            "Microsoft SCCM",
            "Microsoft Azure",
            "Windows",
            "Linux",
            "macOS",
            "Q-SYS (AV)",
            "Active Directory",
            "Entra ID / Azure AD",
            "Microsoft Graph",
            "LDAP",
            "WinRM / PowerShell Remoting",
            "MDM policy automation (Intune/SCCM)"
        ]
    },
    repos: [
        { group: 'dev', url: 'https://github.com/i3T4AN/csv-watcher' },
        { group: 'dev', url: 'https://github.com/i3T4AN/sudokusolver-resume' },
        { group: 'dev', url: 'https://github.com/i3T4AN/numberguesser-resume' },
        { group: 'dev', url: 'https://github.com/i3T4AN/weatherCLI' },
        { group: 'dev', url: 'https://github.com/i3T4AN/streamdock' },
        { group: 'dev', url: 'https://github.com/i3T4AN/LIBRE-HACKTIVATOR_iOS_12-16' },
        { group: 'ai', url: 'https://github.com/i3T4AN/Agent_Example' },
        { group: 'ai', url: 'https://github.com/i3T4AN/Kali_Linux_MCP' },
        { group: 'ai', url: 'https://github.com/i3T4AN/lmstudio-openai-proxy' },
        { group: 'ai', url: 'https://github.com/i3T4AN/Claude-Gemini-MCP-Integration-Server' },
        { group: 'ai', url: 'https://github.com/i3T4AN/Claude_MCP_Bridge' },
        { group: 'ai', url: 'https://github.com/i3T4AN/evillimiter-mcp-server' },
        { group: 'ai', url: 'https://github.com/i3T4AN/Vector-Knowledge-Base' },
        { group: 'ai', url: 'https://github.com/i3T4AN/Semantic-skill-space' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/applescript-device-rename' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/SCCM-font-install-no-restart' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/azuread-inactive-users-export' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/macos-setup' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/Cross-platform-sys-reporting' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/qsys-av-scheduler' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/ADSI-ComputerQuery' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/audit-AD-Computers' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/LanSchoolRegRemove' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/Get-ADDeviceList' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/Rename-ADComputerClient' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/Syspulse' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/Repair-AD-Trust-for-DC' },
        { group: 'enterprise', url: 'https://github.com/i3T4AN/SCCM_Lanschool_Reg_Removal' }

    ],
    publishedWork: {
        sectionTitle: "Published Work",
        emptyMessage: "No publications available right now. Check back soon.",
        items: [
            // Example:
            // {
            //     doi: "10.xxxx/xxxxx",
            //     pdfUrl: "Optional direct PDF URL override"
            // },
            { doi: "10.5281/zenodo.18831091" },
            { doi: "10.5281/zenodo.18830835" }
        ]
    },
    navigation: {
        title: "Sections",
        ariaLabel: "Homepage section links",
        items: [
            { label: "Technical Skills", href: "#skills" },
            { label: "Published Work", href: "#published" },
            { label: "Terminal", href: "#terminal" },
            {
                label: "Featured Projects",
                href: "#projects",
                children: [
                    { label: "Automation & AI", href: "#projects-ai" },
                    { label: "Enterprise Systems / Cloud", href: "#projects-enterprise" },
                    { label: "Programming / Development", href: "#projects-dev" }
                ]
            }
        ]
    },
    terminal: {
        welcomeMessage: "Welcome to Ethan's interactive terminal. Type '--help' to see available commands.",
        prompt: "visitor@i3t4an.github.io:~$ ",
        title: "terminal — bash",
        asciiArt: `                                                                                                                                  
                                                                                                                                                                
                                                                                                                                                      
                                                                                                                                                      
                                                                                                                                                      
                                                                                                                                                      
                                                                                                                                                      
                                                                                                                                                      
                                                                                                                                                      
                                                                                                                                                      
                                                                                                                                                      
          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@{@@@%#%@@@#[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%}]@%(^^@#]@@@#%{@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          @@@@@@@@@@@@@@@@@@@@@@@@@]({@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%[(>+=+===++><)#}(]~*>#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          @@@@@@@@@[((}((((<)(]]]}{([@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@==-:.:...+]>.......~~:-~<)@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          @@@@}}<>>^>>><<<)()())))<)(][][]%@@@@@@@@@@@@@@@@@@@@@(=:...:-.~*~-.:............--~=)@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          %<>^^^^^><<)<<<<<<)((](<]](((((]]][[[%@@@@@@@@@@@@@@{-...........*(::...........:..~-*(@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          >^>>>><<)(()<>>><))]]))(]((()(((())(((]][}%@@@@@@@@<:............~>=:..............:++)#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          <<<<>><<<>))<)<))(]](((())(()<))<<)<<<))((((]{#%#(-.......-===+=~~--...............:-=+>%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          )))))<<<<<)))<<)<<((((((())))))<>><)<<<<><>^<)(](^......:+*^^^^^*+=~--:.:...........:-~+<%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          {[[(<))<)<<)<<)<))(()<<((]]()))))<<<<><)<>>>)<)()>.....:=>>>>>>>>^***+~:::......::-~~++=(@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@{          
          ]]][[]]()<<<)<<))<>)((((((((]))()<<<<>>>>^>>><<<(>:...:~><<>>>>>>^^**+=::::.-~~>))<[>>^>[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          ](]][]([()<<<>))<<))(())))]])(()(((())<>)(<>>>><<>....=)<<<>>^^**^**+*====^*++><{}{@}}}]@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          }[[]]]]]]][](<)<)<<)<<)))(<)()(()<<())<))>>^^>><><:..~)<>^-::::..:~***+=++>()(]%@@@@}}#%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          %{}}]]](((((][[]<<<<<<<<<)(()))))(()(<><><>^>>^<)<~.:=<<+::.:....:++^^*+:::*)#@@@@@%]]{@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
          (][%%{}]]]()()(]([[)<<<<<))>>))<<<<<((((<<<>>>><>)^-:+<^:......:....+*(=.::::-)%@@@{[{#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%}}@@@@@@@@          
          ())((]}{[]]]((())((]](()<<<<))<<><<<))<<)())<><<<~=<*><>.......:...=*>}...:.:^~<[%@{}{#[[}}#@@@@@@@@@@@@@%@{%@@@@@@@@#{###%#@@@@@}          
          )))()]]([}{[((]((><)(()(]][[])))<)<))><<<))<<<<><-<>^<>>^-.......:~*+)}*.:...>~*]}<@%%}[[][}}[][{%@@@)*-~-+~~~*@@@@@@[{#%####@@@@{          
          <<<)><)]]((][[[()><>)))()][[][}](<<)<><)<))))<<<<+~>>*<><^*=----~^++*{%@-.....~^)[@@@%)(]]]]][[#[]}>^~~~-<(*~~*^@@@@@#][[[{[@@@@{{          
          )<<<<)))))(((((][()]}(^]<<<)()(<)(][(><<<()<))())^>^^^<<>^**++++^^^*{@@@)~=::+<(@@@%^{((((](]][[[]<^-----<)*~+{#%@@@@@@(][]@@@@%{#          
          <<<<<<<<<<<<<<<)<>)]][]]()>)<(((()(]]]}[<><<><)))>***>>>>^^*+++=--+*<{){**^*}@@@@@@#>[((((((]]]](*~~):::{%%%%##{#%@@@@@@@@@@@@@}{#          
          <<<<<<<><<<<<><)((((((]]]]}]()<))())((]]][[]((<<<><<^>>^^>>*==+==~~~~()<>***]@@@@@]}%)(((((]]((>~=--]><>{{#{##{{{%@###{#{{}{}}[}{{          
          ))<<<<))<)<<<)))()])((((((]]][}}](<)(()(]]]][]]((<>^^>>^^>>*~:::::-~=+[@#><(]@@@@@@@}#%###%@%{[}}#*){####{}####}%{{)@%%%#%{{#{{{{{          
          ))<))><>))))<)<)(<)(()<)()(<((]]()<))()((((]]])((]](.^>>><>^^>^*+==={@@)=(@#@@@}([[(](](]{{##{[[#%%%#]}[[}}}}{{%@@%#(((][((((]]][[          
          >)()(((()))()))<)()))(())))())((]][(]])((](((()((]=..^+><<<>>>^**=~+<@@@}@@@@@@[[[[([##[<^][}](}{}}{#}{@@@%%%%%##%######{{{{#{{{{{          
          >^<<>>><^<<))<>^^<<)<)(<><><<](@{%#%#%%%%#%@%%#@*....*^*>>>^***+~~+>{@@@@@@@@@#{{{############{{#{##{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{          
          {@@%<<<<]@##(]^^**^<)<>^*[([@@}#@%@%%%%%%%@@#+.......~*^^=+++=====*)@@@@@@@@=}+%##########{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{          
          <{[{##}@@{()<(#><({@]]}[[@@][@<<@@@%%@%(=............-+*****+~~=+==>{@@@@@@+:(.{%{{{[}{[}}[[[]]]][]]](]]]](]]]]]]]]]](](](](((]((]          
          ](@@}<#{@#}}{{<)((()(<(}:^@<)#*=::...................-++*^^^^>^**>%@@@@@@)-(:..({>+}(}[*^+**++*(}^+==>^^+){^^^+*-~+]{^~>*>^>+)]>**          
          #@[@@@@(@@(>{@@><><><<((-~:..:.......................-=*^^^^^^><<#@@@#)>>~%*..=+(}:.~:^=-~>~:~*(}^~--*+*=<}*::~*--=]{>~=+^^^^)}<<>          
          (}{)]@{#(]^<>]{}{#%@@*-:.........................:).:-+*^^>^^^^^)#{<><>^=@(...-+=(~...:....::.-]({{}#}{{}}#}}[[[]]]}{((())))<<(<<<          
          @@@@@@@<>(####@])<)#:.............................)[:~=+^^>>>^^^^>>^>>*+@%:....=-^............+:.~{#<*+=^^#^><*^*=*)#^<]*^+=*<[^)>          
          <][(<>)(@>*<()<([(.....:.........................:~]@>~++^*^^^^^^^^^*+>@@=...:................:..)>))}}]>*#^^)>^>>^<#^>>^^>>^>#*>>          
          <]]#]}[]^>>)()^>=...............................:++*}#@*=^*******^**={@@<........................[}:-(-#{(}][]][]]]][](((()))<})<<          
          (<>==)[][^<{{@%~................................=<<>({%@@(**+*++*^=<@@@]=.......................~<(+~{..@<)@>*^****^{>^^>^>^**}^>^          
          )>)~~]]%}>]({[:.................................~]](([#%@@@@)+=++]@@@%[<........................~}.^<~-..@]<#@+^*^*^{^^^^^^^**{^^^          
          ^>#*^})###(]]...................................<>[[[}{#@@}}%%%@@@@@#}]<........................~(.^>.*..-#[~@@==+**}^^^*~=^^*{+^*          
          ]}{)=%([(](<.....::.............................)(<}###}]]]#}[{}]]{@#[]:........................+).<..^....*^}@@~=+={>^^++*^**]=*>          
          <>>>[{>{([(::....:..............................^>[[[][[}]{%%%%{}}[[[](.........................*<.^..*.....]}@@><)>><^^^^^**>^*((          
          ^><:~@*})[~:....::.............................:(>)[#}{{{[[%%%%#}}}}[(<>~.......................^>.*........-%@@*::::..::.::::~^=-          
          -::~--:==-.....:::..............................[()][}{{}}}{%###[[}{{)>>.....:..................<<.-........={%@*.:::::.:.::..:~-:          
          .:::::::.:....:::...............................[}[[[[{{}}}{%#%%}}}{{)]:.....=::................)[..........+<}%#...:..........:::          
          ..:.:.::::....:::...............................([}{{[{{{}[#%#%%}}{{{(>.....^==:...............=(%.:.........*}#@*+******^^^>><)))          
          :.:::...:.....:::...............................)[{{{}{{{}}#%%#%{{{}{[=....~^*=:...............))@.+=........^]{@%}}}{{{{{}}{{{{{{          
          [][[}}}:::....::................................*<[}{}#####}##{#{}}}}}]{{])(^*^-................]].>.........^]}@@#{{[[{##}[}}{{}{          
          #%#{{#[........................................~**)[}[#####{{@%%%{{{{{}#[]((^<<*...............=~.*..........^))%@}##{{{[###{#{}{#          
          {{{{[[^:......:................................)<>><][###{##@@@@@#####{[](]])]((.................~^.........:~+>}@{{[}}[]{#{#{[}}{          
          }{[[}{{:......................................*](<])<(}{{{}#@{%%@###%{[]]][[][[[.................~}..........::**@{}][}}[[}][[((]}          
          ][{#{}{>......................................]()]}[]((}{{{#@@@@@###}[[[[}{[[}}^.............:=^.*{..........~:..[#{[}{{{[{%#%%##{          
          }}}][}{%.....................................][[)[{}}[]]]{}#@%@@%#}}[[}}{{}[}}}:...............:-~#............:-)#@%@@%##%%{{}##{          
          [}{}[}#}.:..................................>][[({{}}{}{}[}{####{}[}}}{{{{{}{[*...................~..........-+^*=^+~@@#[}#%###{}{          
          ]([]{}}:...................................~[]}]}{{{{{{{{}}}}{{{}}{#{##{{#{{}^:...................................>)<.(@@}{}%%{%%%          
          #%#{}##:..................................-[[}}]{{{{{{{{{{{{{{{{{###{{#{{{{[^=(...........................++*^{%@{-..].=%@%%#{{{}[          
          }}#[[}}::................................+(]}{#[{##{{{{###{{{{{{#{{#{{{{{{#<[(^+........................*+^>>>>(@@@@@.~.]@%##{#%#%          
          %##{#%#::................................)^][{{}##{{#{{{{{{{{{{{{{{#{{#{{{{}]<+=.......................+*=**>))<><]@@@@:^%[[@#{}[[          
          {#}[#{{::................................^+^([[}###{#{{{{{{{{{{{{{{{}{{}{#[[(>+:.......................>^*+:~*<<))(>>@@@%-@###{{%#          
          }{%{{%#:::.............................:::*=^<)]}}{{##{#{{{{{{{{{{{{[[{###}])^::.......................~^*+=-:.=>^><<<%@@.%#[{}{##          
          {#}[#@(:...............................:=~~^+*>>])][}{{{{#####{}{{{{{##{}{[(<=*..........................>+=+::...~:-#@@@%%}###}}{          
          [}[{#%~.................................<*^>^^^><](]][[{}{{{{#{{#####{}}}#]<^=^.................-<........**+>*::^<>^%@%)+*]%{###{          
          {}}]}}::.................................<(><<<<]]][[[[{}{}}#%#####{}}}}}#))>~:.................<}>........+([~=><^^>@@{#{%%##)^<]          
          ](((##:::................................<<<()<([(][]]}}}{{{###{{{{}}}{{{#()*~.................:%@#@^......=+^<><>^#@####%#%%%@@}[          
          ]]}{](::.................................:<)())[((((({}}{{{{{{{{{{{}}{{{{#(>=:................:*#][}#{:...^^^)-+){@}}}}#<^*^*^<<((          
          #%{#{#....................................*><)[(][[[}#{###{{{{{{{{#}{{{{{%)*~:...............>(}][[[[}[)))[}(^^<@@#((][}{%%%#%#{][          
          %%%%%%...:................................:+*[)]]][][{{{{{{{{{{{{{#}####{#>+::...............)}{{}()[#%@{][}}^@#(@@%%%#{%{[}[}{%##          
          @%@{)]>.:..................................-^}(][[}]}}}{{{{{{######{###{}}>~--...............}@###%@#{%}[{{{}<(](]@#]<({@@@#{##}[[          
          {{{%@##@+...................................=))}}{{{%%####{########{###}]>+-=~..............:{#%%@%{{#{}##{}[}-%)^@@^({}]}##](({%#          
          ^^^^^*^^^^...................................:~>][[{###{#{{##########{])^<~~=+:.............({]^)()()<)(][]][()(}<)@%#[((]]]{{]>>]          
          %%#%%##{%-.....................................::+<[}[}}{}#%%%%%###}(]<>)+~~=*:............:(]*~==*))**^>^>(}[]~#(^@@^<([])]}])[[[          
          %#{{]]#%-:.....................................=-===^<][##@@%%%#{]((]>^>*=+~~=:.............(}#{}}}%[<{}[[[]][{<)}>>@[)](((([])>^>          
          {#{{[][{:.......................................:>*++)><<{%#}[[[]](<<>^^=+][^+=-............(#<}}(({%@{{##%%%@@@*#(*%@%##{##{{]([{                                                                                                                                                                                                                                                                                           
                                                                                                                                                                
`,
        whoami: [
            "I automate repetitive tasks so I can focus on creating new repetitive tasks.",
            "Enterprise IT: where \"quick fix\" means \"new policy plus three scripts.\"",
            "I write PowerShell so I don't have to remote in ever again.",
            "I build cross-platform tools and disappoint all operating systems equally.",
            "My favorite cloud pattern is \"works on-prem too.\"",
            "I convert manual SOPs into scripts and panic into logs.",
            "I make boring tasks disappear, then get assigned exciting outages.",
            "I treat production like a petting zoo: look carefully, touch nothing.",
            "I build admin tooling for people who are one ticket away from a career change.",
            "My scripts are idempotent; my sleep schedule is not.",
            "I turn \"just click through it\" into \"run this once.\"",
            "I speak fluent regex and moderate shell sarcasm.",
            "I write automation that survives Mondays.",
            "I fix legacy systems with modern tools and ancient patience.",
            "If it needs 14 clicks, it needs one command.",
            "I keep enterprise workflows stable and my test environments unstable.",
            "I do root-cause analysis and occasionally root-cause archaeology.",
            "I build AI agents with guardrails because confidence is not accuracy.",
            "I wire MCP servers to real workflows so demos can become jobs.",
            "My bots escalate less than people do.",
            "I trust automation, then verify like a paranoid auditor.",
            "I parse logs for a living and mixed signals for free.",
            "I turn tribal knowledge into scripts before the expert goes on PTO.",
            "I optimize for fewer midnight pages and fewer \"per my last email\" threads.",
            "I like systems design the way others like horror films.",
            "I build tooling that makes incidents shorter and postmortems longer.",
            "I automate onboarding so nobody has to remember the secret checkbox.",
            "I ship practical code: no buzzwords, just fewer tickets.",
            "I've debugged enough policy conflicts to qualify as conflict resolution.",
            "I use AI to speed up work, not to generate new work.",
            "My CLI tools are friendlier than most enterprise portals.",
            "I write documentation like backups: best before disaster.",
            "I replace manual workflows with scripts and vague ownership with timestamps.",
            "I make dashboards for managers and scripts for reality.",
            "I design solutions that are boring in production and exciting in commits.",
            "I build resilient automations and emotionally fragile prototypes.",
            "I standardize the chaos, then version it.",
            "I do DevOps for environments that still fax each other spiritually.",
            "I make complex systems simpler, then explain why they're still complex.",
            "My definition of \"done\" includes rollback instructions and coffee.",
            "I migrated from TempleOS to Hannah Montana Linux because Terry dropped Threadripper support.",
            "I run Chaos Monkey in prod, but only on Fridays for spiritual growth.",
            "I set `chmod 777` once in 2019 and I still hear security whispering my name.",
            "I containerized the printer driver and now the printer is somehow in Kubernetes.",
            "I replaced standups with `tail -f` and team morale improved by 3%.",
            "I asked Copilot for a hotfix and it generated a legally binding prophecy.",
            "I built an AI agent to answer tickets and it now requests PTO.",
            "I enabled verbose logging and accidentally invented a new religion.",
            "I treat merge conflicts as couples therapy between branches.",
            "I wrote one AppleScript and now macOS asks me for emotional consent before deploying."
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
            projectNote: 'Use the project cards above for full README and repository details.',
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
            automationTitle: 'Automation, AI & Enterprise Tools',
            systemsTitle: 'Cloud, Systems & Tools'
        },
        matrix: {
            characters: "013456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            duration: 100000
        }
    }
};
