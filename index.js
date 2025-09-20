// auto-reset.js
// Starts a reset vote when the final boss dies

module.exports = function AutoReset(mod) {
    let enabled = true;
    const triggeredBosses = new Set();
    let hooks = [];

    // Dungeons mapping
    const dungeons = {
        2802: { name: "Aesir's End - HM", bosses: [1000], delay: 2000 },
        2803: { name: "Aesir's End - NM", bosses: [1000], delay: 2000 },
        2804: { name: "Phantom's Hideout", bosses: [10000, 9000],  delay: 30000 },
        2809: { name: "The Observatory", bosses: [1000], delay: 2000 },
        2811: { name: "Sea of Honor", bosses: [2200], delay: 10000 },
        2813: { name: "Broslama", bosses: [1000], delay: 5000 },
        3023: { name: "Akalath Quarantine", bosses: [2000], delay: 5000 },
        3103: { name: "Forbidden Arena [Undying Warlord]", bosses: [1000], delay: 2000 },
		3027: { name: "Forbidden Arena [Hagufna]", bosses: [1000], delay: 2000 },
        444:  { name: "Bahaar's Sanctum", bosses: [2000], delay: 20000 },
		427:  { name: "Manaya's Core (Hard)", bosses: [2007], delay: 2000 },
        739:  { name: "Red Refuge", bosses: [3001], delay: 5000 },
        794:  { name: "Thaumetal Refinery", bosses: [3000], delay: 5000 },
        994:  { name: "Thaumetal Refinery (Hard)", bosses: [3000], delay: 5000 },
        756:  { name: "Timescape", bosses: [1002], delay: 5000 },
        466:  { name: "Demon's Wheel", bosses: [46602], delay: 5000 },
        720:  { name: "Antaroth's Abyss", bosses: [3000], delay: 5000 },
        754:  { name: "Bathysmal Rise (Hard)", bosses: [1002], delay: 5000 },
        455:  { name: "Revenous Gorge", bosses: [300], delay: 10000 },
        939:  { name: "Red Refuge (Hard)", bosses: [3001], delay: 5000 },
		981:  { name: "Velik's Sanctuary (Hard)", bosses: [3000], delay: 2000 },
		982:  { name: "Groto of Lost Souls (Hard)", bosses: [3000], delay: 2000 },
		
    };

    // Helpers for hook management
    function hook(...args) {
        hooks.push(mod.hook(...args));
    }
    function unloadHooks() {
        if (hooks.length) {
            for (let h of hooks) mod.unhook(h);
            hooks = [];
        }
    }

    // Setup (register hooks etc.)
    function setup() {
        hook('S_BOSS_GAGE_INFO', 3, event => {
            if (!enabled) return;

            const dungeon = dungeons[event.huntingZoneId];
            if (!dungeon || !dungeon.bosses.includes(event.templateId)) return;

            const bossKey = `${event.huntingZoneId}-${event.templateId}`;
            if (event.curHp === 0n && !triggeredBosses.has(bossKey)) {
                triggeredBosses.add(bossKey);
                resetInstance(dungeon.name, dungeon.delay, bossKey);
            }
        });
    }

    // Reset function with delay
    function resetInstance(dungeonName, delay, bossKey) {
        setTimeout(() => {
            mod.send('C_RESET_ALL_DUNGEON', 1, {});
            mod.command.message(`Final boss defeated in ${dungeonName} → Reset vote started! (Delay: ${delay}ms)`);
            triggeredBosses.delete(bossKey);
        }, delay);
    }

    // Commands
    function handleCommand(arg) {
        if (arg === "on") {
            enabled = true;
            mod.command.message("AutoReset enabled.");
        } else if (arg === "off") {
            enabled = false;
            mod.command.message("AutoReset disabled.");
        } else {
            mod.command.message(`Usage: /autoreset | /ar [on|off] (currently ${enabled ? "ON" : "OFF"})`);
        }
    }

    mod.command.add('autoreset', handleCommand);
    mod.command.add('ar', handleCommand);

    // Reload command (soft reload)
    mod.command.add('ar_reload', () => {
        mod.command.message("Reloading AutoReset...");
        try {
            unloadHooks();
            setup();
            triggeredBosses.clear();
            mod.command.message("AutoReset reloaded successfully!");
        } catch (e) {
            mod.command.message(`Error reloading AutoReset: ${e.message}`);
        }
    });

    // initial setup
    setup();
};



























































/*module.exports = function AutoReset(mod) {
    // config
    let enabled = true;

    // List of final bosses (zoneId + templateId)
    // Add more dungeons here as needed
    const finalBosses = {
        2802: [1000], 
		2803: [1000],
		2804: [300],
		2809: [1000],
		2811: [2200],
		2813: [1000],
		3023: [2000],
		3103: [1000],
		444: [2000],
		739: [3001],
		794: [3000],
		994: [3000],
		756: [1002],
		466: [46602],
		720: [3000],
		754: [1002],
		455: [300],
		939: [3001],
    };

    // Commands
	const handleCommand = (arg) => {
		if (arg === "on") {
			enabled = true;
			mod.command.message("AutoReset enabled.");
		} else if (arg === "off") {
			enabled = false;
			mod.command.message("AutoReset disabled.");
		} else {
			mod.command.message(`Usage: /autoreset | /ar [on|off] (currently ${enabled ? "ON" : "OFF"})`);
		}
	};

	// Register both commands
	mod.command.add('autoreset', handleCommand);
	mod.command.add('ar', handleCommand);


    // Track boss and trigger reset when HP = 0
    mod.hook('S_BOSS_GAGE_INFO', 3, event => {
        if (!enabled) return;

        const bosses = finalBosses[event.huntingZoneId];
        if (!bosses || !bosses.includes(event.templateId)) return;

        if (event.curHp === 0n) {
            resetInstance();
        }
    });

    // Function to send reset vote
    function resetInstance() {
        mod.send('C_RESET_ALL_DUNGEON', 1, {}); 
        mod.command.message("Final boss defeated → Reset vote started!");
    }
}*/
