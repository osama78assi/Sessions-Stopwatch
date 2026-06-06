import Stopwatch from "../models/stopwatch.js";
import Session from "../models/sessions.js";
export async function testScript() {
    // Create test stopwatches
    const stopwatches = await Stopwatch.bulkCreate([
        { category: "General Study" },
        { category: "Programming" },
        { category: "Gaming" },
        { category: "Software Development" },
        { category: "AI" },
    ]);

    const sessions = [];

    const now = new Date();

    // Generate sessions spread over ~6 months
    for (let i = 0; i < 3000; i++) {
        const stopwatch =
            stopwatches[Math.floor(Math.random() * stopwatches.length)];

        const daysAgo = Math.floor(Math.random() * 180);

        const sessionDate = new Date(now);
        sessionDate.setDate(sessionDate.getDate() - daysAgo);

        sessionDate.setHours(
            Math.floor(Math.random() * 24),
            Math.floor(Math.random() * 60),
            Math.floor(Math.random() * 60),
            0,
        );

        const duration =
            5 * 60 * 1000 +
            Math.floor(Math.random() * 3 * 60 * 60 * 1000); // 5 min -> 3 hrs

        const longestSet = Math.floor(
            duration * (0.5 + Math.random() * 0.5),
        );

        const stopCounts = Math.floor(Math.random() * 10);

        // 1–30 minutes pause per stop
        let pausedTime = 0;

        for (let j = 0; j < stopCounts; j++) {
            pausedTime +=
                (1 + Math.floor(Math.random() * 30)) * 60 * 1000;
        }

        const finishedAt = new Date(
            sessionDate.getTime() + duration + pausedTime,
        );

        sessions.push({
            stopwatchId: stopwatch.id,
            duration,
            longestSet,
            stopCounts,
            description: `Test session #${i + 1}`,
            createdAt: sessionDate,
            finishedAt,
        });
    }

    await Session.bulkCreate(sessions);

    console.log(
        `Created ${stopwatches.length} stopwatches and ${sessions.length} sessions`,
    );
}