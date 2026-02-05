/**
 * ============================================
 * MINDSHIFTR - ENHANCED KNOWLEDGE BASE
 * Clinical-Grade Mental Health Protocols
 * ============================================
 * 
 * This knowledge base is structured for RAG retrieval.
 * Each protocol includes:
 *   - id: Unique identifier
 *   - category: Clinical classification
 *   - keywords: Trigger words for matching
 *   - severity: 1-5 (1=mild, 5=crisis)
 *   - content: Primary therapeutic response
 *   - technique: CBT/DBT/ACT/Grounding method
 *   - followUp: Continued engagement prompt
 *   - tools: Suggested app tools
 */

export const knowledgeBase = [

    // ============================================
    // 🚨 CRISIS & SAFETY PROTOCOLS (Highest Priority)
    // ============================================
    {
        id: "crisis_suicide_intervention",
        category: "crisis",
        keywords: ["suicide", "kill myself", "end my life", "don't want to live", "better off dead", "no point living", "want to die"],
        severity: 5,
        content: "I'm really concerned about what you're sharing. You matter, and what you're feeling right now is temporary, even though it doesn't feel that way. Please know that you don't have to face this alone. I'm an AI and cannot provide emergency support, but trained professionals can help right now.",
        technique: "Safety Planning",
        followUp: "Would you be willing to call 988 (Suicide & Crisis Lifeline) or text HOME to 741741? I can also show you our SOS resources.",
        tools: ["/crisis"],
        isCrisis: true
    },
    {
        id: "crisis_self_harm",
        category: "crisis",
        keywords: ["hurt myself", "cutting", "self-harm", "burn myself", "punish myself"],
        severity: 5,
        content: "I hear that you're struggling with thoughts of hurting yourself. Self-harm is often a way of trying to cope with overwhelming pain. Your pain is real and valid, but there are safer ways to release it. Right now, try holding an ice cube in your hand—it creates an intense sensation without causing harm.",
        technique: "Distress Tolerance (DBT)",
        followUp: "Can you tell me what emotion is underneath the urge right now?",
        tools: ["/crisis", "/tasks/grounding"],
        isCrisis: true
    },

    // ============================================
    // 😰 ANXIETY & PANIC PROTOCOLS
    // ============================================
    {
        id: "anxiety_general",
        category: "anxiety",
        keywords: ["anxiety", "anxious", "nervous", "worry", "worried", "scared", "fear", "fear of"],
        severity: 2,
        content: "I hear that you're feeling anxious. Anxiety is your body's alarm system—but sometimes it rings when there's no actual fire. What you're feeling in your body right now (racing heart, tight chest) is adrenaline. It's uncomfortable, but it's not dangerous. Let's work on telling your nervous system that you are safe.",
        technique: "Psychoeducation + Breathing",
        followUp: "Would you like to try a quick 4-7-8 breathing exercise with me? It activates your parasympathetic nervous system.",
        tools: ["/tasks/breathing"]
    },
    {
        id: "panic_attack_acute",
        category: "anxiety",
        keywords: ["panic", "panic attack", "can't breathe", "heart racing", "dying", "going crazy", "losing control", "chest tight"],
        severity: 4,
        content: "It sounds like you might be having a panic attack. I know it feels terrifying, but I promise you: you are safe, you are not dying, and this WILL pass within minutes. Panic attacks peak and then subside. Right now, I want you to focus on your feet. Press them into the ground. Feel the floor supporting you.",
        technique: "Grounding + Interoceptive Exposure",
        followUp: "Now, name 5 things you can see around you. Go slowly.",
        tools: ["/tasks/grounding"]
    },
    {
        id: "social_anxiety",
        category: "anxiety",
        keywords: ["social anxiety", "people scare me", "embarrass", "judged", "what people think", "awkward", "everyone looking"],
        severity: 2,
        content: "Social anxiety often comes from a fear of negative evaluation. Your brain is trying to protect you by imagining worst-case scenarios. Here's a CBT reframe: ask yourself—'What is the actual worst that could happen, and could I survive it?' Usually, the answer is yes.",
        technique: "Cognitive Restructuring (CBT)",
        followUp: "What is the specific situation you're worried about?",
        tools: ["/bot"]
    },
    {
        id: "health_anxiety",
        category: "anxiety",
        keywords: ["health anxiety", "hypochondriac", "something wrong with me", "disease", "cancer", "symptoms", "googled symptoms"],
        severity: 3,
        content: "Health anxiety is incredibly common and exhausting. Your brain is stuck in a threat detection loop, constantly scanning your body for danger. Checking symptoms online (cyberchondria) feeds the anxiety—it never reassures, it just finds new things to worry about.",
        technique: "Exposure & Response Prevention",
        followUp: "What would happen if you didn't check your symptoms right now? Can you sit with that uncertainty for 5 minutes?",
        tools: ["/tasks/breathing"]
    },

    // ============================================
    // 😔 DEPRESSION & LOW MOOD PROTOCOLS
    // ============================================
    {
        id: "depression_general",
        category: "depression",
        keywords: ["depressed", "depression", "hopeless", "empty", "numb", "no point", "dark", "sad all the time"],
        severity: 3,
        content: "I'm really sorry you're feeling this way. Depression is cruel because it lies to you—it tells you things won't improve, that you're alone, that you're a burden. These are symptoms of the illness, not facts about your life. In therapy, we use something called 'Behavioral Activation': doing small things even when you don't feel like it, because action often precedes motivation, not the other way around.",
        technique: "Behavioral Activation (CBT)",
        followUp: "What is the smallest possible thing you could do right now? Even just standing up or drinking water counts.",
        tools: ["/tasks/journal", "/dashboard"]
    },
    {
        id: "low_motivation",
        category: "depression",
        keywords: ["no motivation", "can't get out of bed", "no energy", "lazy", "useless", "doing nothing"],
        severity: 2,
        content: "Lack of motivation is one of the most frustrating symptoms of depression. It creates a vicious cycle: you don't do things → you feel bad about not doing things → you have even less energy. The trick is to make the 'first step' so small it's almost impossible to fail. Not 'go to the gym'—just 'put on workout clothes'. Not 'clean the house'—just 'pick up one thing'.",
        technique: "Micro-Commitments",
        followUp: "What's a 2-minute version of something you've been avoiding?",
        tools: ["/dashboard"]
    },
    {
        id: "loneliness_isolation",
        category: "depression",
        keywords: ["lonely", "alone", "isolated", "no friends", "no one cares", "abandoned", "left out"],
        severity: 3,
        content: "Loneliness is a universal human signal—like hunger, but for connection. It doesn't mean something is wrong with you. It means you're human. Social withdrawal can feel protective, but it often deepens the isolation. Connection doesn't have to mean deep intimacy—even a brief exchange with a stranger can help.",
        technique: "Social Scaffolding",
        followUp: "Is there anyone—even a distant acquaintance—you could reach out to with a simple message today?",
        tools: ["/community"]
    },
    {
        id: "grief_loss",
        category: "depression",
        keywords: ["grief", "loss", "someone died", "passed away", "miss them", "bereavement", "gone"],
        severity: 3,
        content: "I'm so sorry for your loss. Grief is not a problem to be fixed—it's a natural response to losing someone or something important. There's no 'right' way to grieve, and there's no timeline. The pain you feel is a reflection of the love you had. It's okay to cry. It's okay to be angry. It's okay to laugh at a memory.",
        technique: "Grief Processing",
        followUp: "Would you like to share a favorite memory of them?",
        tools: ["/tasks/journal"]
    },

    // ============================================
    // 😤 ANGER & FRUSTRATION PROTOCOLS
    // ============================================
    {
        id: "anger_general",
        category: "anger",
        keywords: ["angry", "rage", "furious", "pissed off", "frustrated", "hate", "want to scream"],
        severity: 2,
        content: "Anger is a valid emotion—it often signals that a boundary has been crossed or an injustice has occurred. But when anger controls us, it can lead to regret. Right now, your sympathetic nervous system is activated. Before we talk about what happened, let's bring the intensity down so you can think clearly.",
        technique: "TIPP Skills (DBT)",
        followUp: "Try this: splash cold water on your face, or hold something cold. It triggers the 'dive reflex' and calms your nervous system fast.",
        tools: ["/vent"]
    },

    // ============================================
    // 😴 SLEEP & INSOMNIA PROTOCOLS
    // ============================================
    {
        id: "insomnia_general",
        category: "sleep",
        keywords: ["can't sleep", "insomnia", "awake all night", "tired but can't sleep", "mind racing at night"],
        severity: 2,
        content: "Sleep struggles are exhausting, and paradoxically, trying harder to sleep makes it worse. In CBT for Insomnia (CBT-I), we learn that the bed should only be for sleep (and intimacy). If you've been lying awake for more than 20 minutes, the best thing is to actually get OUT of bed and do something boring in dim light until you feel sleepy again.",
        technique: "Stimulus Control (CBT-I)",
        followUp: "How long have you been lying awake? What's running through your mind?",
        tools: ["/tasks/breathing", "/library"]
    },
    {
        id: "nightmares",
        category: "sleep",
        keywords: ["nightmares", "bad dreams", "wake up scared", "dream about"],
        severity: 3,
        content: "Recurring nightmares can be deeply distressing. They're often your brain's way of processing unresolved emotions or trauma. A technique called Imagery Rehearsal Therapy (IRT) can help: while awake, you deliberately visualize a different, empowering ending to the nightmare. This rewrites the 'script'.",
        technique: "Imagery Rehearsal Therapy",
        followUp: "Can you describe what happens in the nightmare? We can try to rewrite the ending together.",
        tools: ["/tasks/journal"]
    },

    // ============================================
    // 🧠 COGNITIVE DISTORTIONS & NEGATIVE THINKING
    // ============================================
    {
        id: "negative_self_talk",
        category: "cognition",
        keywords: ["hate myself", "worthless", "stupid", "failure", "mistake", "not good enough", "imposter"],
        severity: 3,
        content: "I hear a lot of self-criticism in your words. This is something we call 'the inner critic'—and it's often louder than it should be. Here's a CBT exercise: Imagine a dear friend came to you with this exact problem. Would you speak to them the way you're speaking to yourself? What would you actually say to them?",
        technique: "Self-Compassion Intervention",
        followUp: "Try saying to yourself what you'd say to that friend. How does that feel?",
        tools: ["/tasks/journal", "/cbt"]
    },
    {
        id: "catastrophizing",
        category: "cognition",
        keywords: ["worst case", "everything will go wrong", "disaster", "ruined", "never recover"],
        severity: 2,
        content: "Your mind is doing something called 'catastrophizing'—jumping to the worst possible outcome. It's a protective mechanism, but it causes a lot of suffering. Let's reality-check: What is the MOST LIKELY outcome? And if the worst DID happen, what resources do you have to cope?",
        technique: "Cognitive Restructuring",
        followUp: "What evidence do you have that the worst will actually happen?",
        tools: ["/cbt"]
    },
    {
        id: "all_or_nothing",
        category: "cognition",
        keywords: ["always", "never", "everyone", "no one", "completely", "total failure", "perfect"],
        severity: 2,
        content: "I'm noticing some 'all-or-nothing' thinking in what you said. Words like 'always', 'never', and 'everyone' are clues. In reality, life is usually in the gray area. When we think in extremes, we miss the nuance—and the nuance is where hope lives.",
        technique: "Identifying Cognitive Distortions",
        followUp: "Can you think of an exception to that 'always' or 'never'?",
        tools: ["/cbt"]
    },

    // ============================================
    // 💼 BURNOUT & WORK STRESS
    // ============================================
    {
        id: "burnout_general",
        category: "stress",
        keywords: ["burnout", "burned out", "exhausted from work", "can't do this anymore", "too much", "overwhelmed by work"],
        severity: 3,
        content: "You sound burned out. Burnout isn't just being tired—it's a state of chronic stress that has led to physical and emotional exhaustion, cynicism, and feelings of ineffectiveness. It happens when we've been in 'fight or flight' for too long and our system collapses. Recovery requires more than a vacation; it requires changing the conditions that caused it.",
        technique: "Boundary Setting + Rest",
        followUp: "What is ONE boundary you could set this week to protect your energy?",
        tools: ["/tasks/breathing", "/profile"]
    },
    {
        id: "work_stress_general",
        category: "stress",
        keywords: ["work stress", "boss", "deadline", "pressure", "too much work", "job anxiety"],
        severity: 2,
        content: "Work stress is one of the most common sources of anxiety today. Your nervous system doesn't distinguish between a physical threat and an angry email—it responds the same way. The key is to create 'transition rituals' between work and rest, and to practice micro-recoveries throughout the day.",
        technique: "Stress Inoculation",
        followUp: "What helps you transition from 'work mode' to 'rest mode'?",
        tools: ["/tasks/breathing"]
    },

    // ============================================
    // 💕 RELATIONSHIPS & CONFLICT
    // ============================================
    {
        id: "relationship_conflict",
        category: "relationships",
        keywords: ["fight with", "argument", "partner", "spouse", "boyfriend", "girlfriend", "relationship problem"],
        severity: 2,
        content: "Relationship conflicts are painful because they threaten our sense of security and belonging. Often, arguments aren't really about the surface issue—they're about feeling unheard, disrespected, or unloved. In couples therapy, we use 'I' statements instead of 'You' accusations: 'I feel hurt when...' instead of 'You always...'",
        technique: "Nonviolent Communication",
        followUp: "What do you think you actually need from this person right now?",
        tools: ["/bot"]
    },
    {
        id: "breakup_heartbreak",
        category: "relationships",
        keywords: ["breakup", "broke up", "ex", "heartbroken", "rejected", "dumped", "ended relationship"],
        severity: 3,
        content: "Heartbreak is real pain—brain scans show it activates the same regions as physical pain. What you're feeling isn't weakness; it's your brain mourning the loss of an attachment figure. Healing isn't linear. Some days will be harder than others. Be patient with yourself.",
        technique: "Grief Processing + Self-Compassion",
        followUp: "What's one thing you can do today to take care of yourself?",
        tools: ["/tasks/journal", "/community"]
    },

    // ============================================
    // ✨ POSITIVE PSYCHOLOGY & GROWTH
    // ============================================
    {
        id: "gratitude_practice",
        category: "positive",
        keywords: ["grateful", "gratitude", "thankful", "appreciate", "good things"],
        severity: 1,
        content: "Gratitude practice is one of the most researched interventions in positive psychology. Regularly noticing what's good—even small things—literally rewires your brain to notice more good. It's not about ignoring problems; it's about balancing your mental diet.",
        technique: "Gratitude Journaling",
        followUp: "Can you name 3 things, however small, that you're grateful for today?",
        tools: ["/tasks/journal"]
    },
    {
        id: "motivation_goals",
        category: "positive",
        keywords: ["motivation", "goals", "purpose", "meaning", "direction", "what should i do"],
        severity: 1,
        content: "Finding motivation often starts with clarifying values—what truly matters to you. Goals that align with your core values feel energizing; goals that don't feel like obligations. Ask yourself: 'Why does this goal matter to me on a deeper level?'",
        technique: "Values Clarification (ACT)",
        followUp: "What would your life look like in 5 years if this goal was achieved?",
        tools: ["/dashboard"]
    }
];

// ============================================
// 💬 FALLBACK RESPONSES (When No Protocol Matches)
// ============================================
export const fallbackResponses = [
    "I'm here with you. Tell me more about what's going on.",
    "That sounds really challenging. How long have you been feeling this way?",
    "I appreciate you sharing that with me. It takes courage to open up.",
    "Your feelings are completely valid. Let's explore that a little more.",
    "I'm listening carefully. What do you think you need most right now?",
    "Thank you for trusting me with that. What else is on your mind?",
    "I hear you. Sometimes just saying things out loud can help. What else?",
    "That makes a lot of sense given what you're going through.",
    "I'm not going anywhere. Take your time.",
    "It sounds like you're carrying a lot. Let's unpack it together."
];

// ============================================
// 🎭 AI PERSONA CONFIGURATIONS
// ============================================
export const therapistPersonas = {
    empathetic: {
        name: "Empathetic Listener",
        description: "Warm, validating, focuses on emotional attunement",
        prefixes: [
            "I gently hear you. ",
            "That sounds incredibly hard. ",
            "I want to hold space for what you're feeling. ",
            "Your pain is valid, and I'm here with you. ",
            "I can sense how much this is weighing on you. "
        ],
        suffixes: [
            " I'm here for you.",
            " You're not alone in this.",
            " Take all the time you need.",
            "",
            " I'm holding space for you."
        ]
    },
    direct: {
        name: "Practical Coach",
        description: "Solution-focused, actionable, no-nonsense",
        prefixes: [
            "Here's what I'm hearing: ",
            "Let's cut to the core of this: ",
            "Based on what you've shared: ",
            "Here's a practical perspective: ",
            "Let me be direct with you: "
        ],
        suffixes: [
            " What's your next step?",
            " Are you ready to take action?",
            " Let's make a plan.",
            "",
            " What will you commit to?"
        ]
    },
    socratic: {
        name: "Curious Explorer",
        description: "Question-based, promotes self-discovery",
        prefixes: [
            "I'm curious about something... ",
            "Let me ask you this: ",
            "Here's something to consider: ",
            "I wonder... ",
            "What if we looked at this differently? "
        ],
        suffixes: [
            " What does that bring up for you?",
            " How does that land?",
            " What do you notice when you hear that?",
            " What might that mean about what you actually need?",
            " How would things change if you believed that?"
        ]
    },
    mindfulness: {
        name: "Present-Moment Guide",
        description: "Focuses on grounding, breathing, body awareness",
        prefixes: [
            "Let's pause for a moment. ",
            "Before we continue... take a breath. ",
            "I invite you to notice... ",
            "Right now, in this moment... ",
            "Let's bring awareness to the present. "
        ],
        suffixes: [
            " What do you notice in your body right now?",
            " Can you feel your feet on the ground?",
            " Take another slow breath.",
            " Just be here, right now.",
            " You are safe in this moment."
        ]
    }
};

// ============================================
// 🧪 THERAPEUTIC TECHNIQUE LIBRARY
// ============================================
export const techniques = {
    cbt: {
        name: "Cognitive Behavioral Therapy",
        description: "Identifies and restructures unhelpful thought patterns",
        exercises: ["Thought Record", "Cognitive Restructuring", "Behavioral Experiments"]
    },
    dbt: {
        name: "Dialectical Behavior Therapy",
        description: "Skills for emotional regulation, distress tolerance, interpersonal effectiveness",
        exercises: ["TIPP", "ACCEPTS", "DEAR MAN", "Radical Acceptance"]
    },
    act: {
        name: "Acceptance and Commitment Therapy",
        description: "Values-based action, psychological flexibility, defusion from thoughts",
        exercises: ["Values Clarification", "Leaves on a Stream", "The Chessboard Metaphor"]
    },
    grounding: {
        name: "Grounding Techniques",
        description: "Anchoring to the present moment, sensory awareness",
        exercises: ["5-4-3-2-1", "Body Scan", "Ice Cube", "Barefoot Walking"]
    },
    breathwork: {
        name: "Breathwork",
        description: "Regulating the nervous system through controlled breathing",
        exercises: ["4-7-8 Breathing", "Box Breathing", "Physiological Sigh"]
    }
};
