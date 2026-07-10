const overlay = document.querySelector('#bootSequence');

if (overlay) {
    const forced = new URLSearchParams(location.search).get('boot') === '1';
    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem('i3t4an-boot-seen') === '1' } catch { }

    if (alreadySeen && !forced) {
        overlay.hidden = true;
    } else {
        const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const duration = reducedMotion ? 650 : 5000;
        const handoffAt = reducedMotion ? 160 : 4100;
        const start = 0;
        const timers = [];
        let frameId = 0;
        let finished = false;
        let logIndex = 0;
        let asciiIndex = 0;

        const log = overlay.querySelector('#bootLog');
        const ascii = overlay.querySelector('#bootAscii');
        const clock = overlay.querySelector('#bootClock');
        const signal = overlay.querySelector('#bootSignal');
        const cpu = overlay.querySelector('#bootCpu');
        const mem = overlay.querySelector('#bootMem');
        const net = overlay.querySelector('#bootNet');
        const hex = overlay.querySelector('#bootHex');
        const progress = overlay.querySelector('#bootProgress');
        const status = overlay.querySelector('#bootStatus');
        const canvas = overlay.querySelector('#bootTelemetry');
        const context = canvas?.getContext('2d');

        const identity = [
            ' ___  _____  _____  _  _      _      _   _',
            '|_ _||___ / |_   _|| || |    / \\    | \\ | |',
            ' | |   |_ \\   | |  | || |_  / _ \\   |  \\| |',
            ' | |  ___) |  | |  |__   _|/ ___ \\  | |\\  |',
            '|___||____/   |_|     |_| /_/   \\_\\ |_| \\_|',
        ];

        const baseLines = [
            'I3T4AN BIOS r26.07 // POST BEGIN',
            'PHOSPHOR ARRAY...............<span class="ok">ONLINE</span>',
            'VERTICAL HOLD................<span class="ok">LOCKED</span>',
            'SCAN MATRIX..................<span class="ok">CALIBRATED</span>',
            'MEMORY BANK 00...............4096 MB',
            'MEMORY BANK 01...............4096 MB',
            'MEMORY BANK 02...............4096 MB',
            'MEMORY BANK 03...............4096 MB',
            'MOUNT /PORTFOLIO.............<span class="ok">OK</span>',
            'LOAD TERMINAL.CORE...........<span class="ok">OK</span>',
            'LOAD MATRIX.DRV..............<span class="ok">OK</span>',
            'LOAD CONSTELLATION.MAP.......<span class="ok">OK</span>',
            'VERIFY RESEARCH ARCHIVE......02 RECORDS',
            'OPEN GITHUB UPLINK...........SYN',
            'REMOTE ACK...................<span class="ok">RECEIVED</span>',
        ];
        const repoCount = Math.max(1, window.SITE?.repos?.length || 29);
        const repoLines = Array.from({ length: repoCount }, (_, index) => (
            `INDEX REPOSITORY ${String(index + 1).padStart(2, '0')}/${String(repoCount).padStart(2, '0')}........<span class="ok">${(0xA7C0 + index * 131).toString(16).toUpperCase()}</span>`
        ));
        const finalLines = [
            'RESOLVE IDENTITY HASH........<span class="ok">VERIFIED</span>',
            'SUBJECT......................ETHAN BLAIR',
            'ROLE.........................DESKTOP ENGINEER',
            'SPECIALIZATION...............AUTOMATION / APPLIED AI',
            'PUBLIC INTERFACE.............<span class="ok">ARMED</span>',
            'SIGNAL STABILITY.............<span class="ok">NOMINAL</span>',
            'PORTFOLIO INTERFACE..........<span class="ok">READY</span>',
        ];
        const lines = [...baseLines, ...repoLines, ...finalLines];

        const addLogLine = () => {
            if (!log || logIndex >= lines.length) return;
            const row = document.createElement('span');
            row.innerHTML = `${String(logIndex).padStart(4, '0')}  ${lines[logIndex]}`;
            log.append(row, document.createTextNode('\n'));
            log.scrollTop = log.scrollHeight;
            logIndex += 1;
        };

        const corruptRow = row => row.replace(/[A-Z0-9]/g, character => Math.random() > .62 ? character : '#');
        const addAsciiRow = () => {
            if (!ascii || asciiIndex >= identity.length) return;
            const resolved = identity.slice(0, asciiIndex);
            ascii.textContent = [...resolved, corruptRow(identity[asciiIndex])].join('\n');
            timers.push(setTimeout(() => {
                ascii.textContent = identity.slice(0, asciiIndex + 1).join('\n');
                asciiIndex += 1;
                if (asciiIndex === identity.length) ascii.classList.add('is-locked');
            }, 58));
        };

        const randomHex = () => Array.from({ length: 26 }, () => Math.floor(Math.random() * 65535).toString(16).padStart(4, '0').toUpperCase()).join('  ');

        const drawTelemetry = elapsed => {
            if (!canvas || !context) return;
            const ratio = devicePixelRatio || 1;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
                canvas.width = Math.floor(width * ratio);
                canvas.height = Math.floor(height * ratio);
            }
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            context.clearRect(0, 0, width, height);
            context.strokeStyle = 'rgba(168,85,247,.12)';
            context.lineWidth = 1;
            for (let x = 0; x < width; x += Math.max(20, width / 9)) {
                context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
            }
            for (let y = 0; y < height; y += Math.max(20, height / 7)) {
                context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
            }

            const nodes = Array.from({ length: 13 }, (_, index) => ({
                x: width * (.12 + ((index * 37) % 78) / 100),
                y: height * (.12 + ((index * 53) % 76) / 100),
            }));
            const visible = Math.min(nodes.length, Math.floor(elapsed / 210));
            context.strokeStyle = 'rgba(168,85,247,.38)';
            for (let index = 1; index < visible; index++) {
                context.beginPath();
                context.moveTo(nodes[index - 1].x, nodes[index - 1].y);
                context.lineTo(nodes[index].x, nodes[index].y);
                context.stroke();
            }
            nodes.slice(0, visible).forEach((node, index) => {
                const pulse = 2.4 + Math.sin(elapsed / 170 + index) * 1.4;
                context.beginPath();
                context.arc(node.x, node.y, pulse, 0, Math.PI * 2);
                context.fillStyle = index === visible - 1 ? '#00d4ff' : '#a855f7';
                context.shadowColor = context.fillStyle;
                context.shadowBlur = 13;
                context.fill();
            });
            context.shadowBlur = 0;
            const sweepX = (elapsed % 920) / 920 * width;
            const gradient = context.createLinearGradient(sweepX - 20, 0, sweepX + 5, 0);
            gradient.addColorStop(0, 'rgba(168,85,247,0)');
            gradient.addColorStop(1, 'rgba(216,167,255,.65)');
            context.fillStyle = gradient;
            context.fillRect(sweepX - 20, 0, 25, height);
        };

        const finish = () => {
            if (finished) return;
            finished = true;
            timers.forEach(timer => {
                clearTimeout(timer);
                clearInterval(timer);
            });
            cancelAnimationFrame(frameId);
            document.body.classList.remove('boot-running');
            overlay.hidden = true;
            try { sessionStorage.setItem('i3t4an-boot-seen', '1') } catch { }
            removeEventListener('keydown', skip);
            removeEventListener('pointerdown', skip);
        };

        const beginHandoff = () => {
            if (finished || overlay.classList.contains('is-handoff')) return;
            status.textContent = 'PORTFOLIO INTERFACE READY // RELEASING DISPLAY';
            overlay.classList.add('is-handoff');
        };

        const skip = () => {
            beginHandoff();
            timers.push(setTimeout(finish, 920));
        };

        document.body.classList.add('boot-running');
        addEventListener('keydown', skip, { once: true });
        addEventListener('pointerdown', skip, { once: true });

        if (!reducedMotion) {
            const linesDueAtStart = Math.min(lines.length, Math.floor(performance.now() / 78));
            while (logIndex < linesDueAtStart) addLogLine();
            const logInterval = setInterval(() => {
                addLogLine();
                if (logIndex >= lines.length) clearInterval(logInterval);
            }, 78);
            timers.push(logInterval);

            timers.push(setTimeout(() => {
                addAsciiRow();
                const asciiInterval = setInterval(() => {
                    addAsciiRow();
                    if (asciiIndex >= identity.length) clearInterval(asciiInterval);
                }, 115);
                timers.push(asciiInterval);
            }, Math.max(0, 1620 - performance.now())));

            const hexInterval = setInterval(() => { if (hex) hex.textContent = randomHex() }, 72);
            timers.push(hexInterval);
        } else if (ascii) {
            ascii.textContent = identity.join('\n');
        }

        const animate = now => {
            const elapsed = now - start;
            const bounded = Math.min(duration, Math.max(0, elapsed));
            const clockDate = new Date();
            if (clock) clock.textContent = `${clockDate.toTimeString().slice(0, 8)}:${String(clockDate.getMilliseconds()).padStart(3, '0')}`;
            if (progress) progress.style.width = `${Math.min(100, bounded / duration * 100)}%`;
            if (signal) signal.textContent = `${Math.min(100, Math.floor(12 + bounded / duration * 88))}%`;
            if (cpu) cpu.textContent = String(Math.floor(21 + Math.abs(Math.sin(elapsed / 173)) * 73)).padStart(2, '0');
            if (mem) mem.textContent = String(Math.floor(512 + bounded / duration * 15872)).padStart(4, '0');
            if (net) net.textContent = (Math.abs(Math.sin(elapsed / 119)) * 8.7).toFixed(1);
            if (elapsed > 520 && elapsed < 1450) status.textContent = 'RUNNING POWER-ON SELF TEST';
            else if (elapsed >= 1450 && elapsed < 3150) status.textContent = 'INDEXING PUBLIC SYSTEMS';
            else if (elapsed >= 3150 && elapsed < handoffAt) status.textContent = 'LOCKING IDENTITY SIGNAL';
            drawTelemetry(elapsed);
            if (!finished) frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);
        timers.push(setTimeout(beginHandoff, Math.max(0, handoffAt - performance.now())));
        timers.push(setTimeout(finish, Math.max(0, duration - performance.now())));
    }
}
