import { NextResponse } from 'next/server';

// In-memory store for RL feedback (would be DB in prod)
// We track how many positive vs negative interactions occurred
let feedbackStats = {
    up: 0,
    down: 0
};

export async function POST(req) {
    try {
        const { feedback, messageId } = await req.json(); // feedback: 'up' | 'down'

        if (feedback === 'up') feedbackStats.up++;
        if (feedback === 'down') feedbackStats.down++;

        // In a real RLHF loop, we would save the (UserMessage, BotResponse, Score) tuple
        // to a dataset for PPO training or DPO.

        console.log(`RL Feedback Received: ${feedback}. Stats:`, feedbackStats);

        return NextResponse.json({ success: true, stats: feedbackStats });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
    }
}
