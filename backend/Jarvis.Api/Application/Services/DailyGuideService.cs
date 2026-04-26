using Jarvis.Api.Contracts;

namespace Jarvis.Api.Application.Services;

public class DailyGuideService
{
    private static readonly IReadOnlyList<string> DotNetRoadmapTopics =
    [
        ".NET dependency injection and service lifetimes",
        "ASP.NET Core middleware pipeline and ordering",
        "Entity Framework Core tracking vs no-tracking",
        "Minimal APIs and clean controller boundaries",
        "Background services with resilient retries",
        "API validation and ProblemDetails contracts",
        "Caching strategies in full-stack apps",
        "Testing APIs with integration and unit tests",
        "Observability with structured logs and metrics",
        "Security fundamentals: auth, authz, and secrets"
    ];

    private static readonly IReadOnlyList<string> FullStackTopics =
    [
        "Angular standalone architecture and feature boundaries",
        "SQL indexing and query plan basics",
        "Type-safe API contracts between Angular and .NET",
        "State orchestration for complex UI workflows",
        "Form validation strategy across frontend and backend",
        "Performance tuning for Angular rendering paths",
        "Database schema design for product iteration speed",
        "Error-handling strategy from API to UI messaging",
        "Feature rollout pattern using progressive enhancement",
        "GitHub PR workflow for stable delivery"
    ];

    private static readonly IReadOnlyList<(string Word, string Meaning, string Example)> Vocabulary =
    [
        ("Leverage", "Using a small action to create a larger result.", "I focus on high-leverage tasks before shallow work."),
        ("Disciplined", "Consistently following a plan regardless of mood.", "A disciplined routine protects long-term goals."),
        ("Iterate", "Improve something through repeated small versions.", "I iterate my learning system every week."),
        ("Pragmatic", "Focused on practical and realistic solutions.", "A pragmatic engineer ships value early and refines."),
        ("Articulate", "Able to explain ideas clearly and confidently.", "I want to become more articulate in meetings."),
        ("Composure", "Calmness under pressure.", "Composure helps me think clearly during hard conversations.")
    ];

    private static readonly IReadOnlyList<string> ConfidenceDrills =
    [
        "Speak one clear recommendation out loud before starting work.",
        "Record a 60-second voice note explaining today's goal.",
        "Ask one direct question in a confident tone today.",
        "Hold posture tall for 2 minutes before your first call.",
        "Practice one interview-style answer with slower pacing.",
        "End one conversation with a clear summary statement."
    ];

    private static readonly IReadOnlyList<string> Quotes =
    [
        "Clarity creates speed. Confusion creates delay.",
        "Small daily execution beats occasional intensity.",
        "Your schedule is your real set of priorities.",
        "Discipline is choosing what matters most first.",
        "Build systems that work on low-motivation days.",
        "Consistency turns effort into identity."
    ];

    private static readonly IReadOnlyList<string> InspirationStories =
    [
        "An engineer spent 30 days fixing one weak core skill. Promotions followed because reliability improved first.",
        "A writer published one short post every week for a year. Compounding visibility created unexpected opportunities.",
        "A founder cut three distractions, kept one mission, and doubled output without longer work hours.",
        "A developer practiced speaking daily for 10 minutes and became the default presenter in team demos.",
        "A learner tracked tiny wins each day; after six months, confidence came from evidence, not hype.",
        "A builder used first-principles thinking to remove assumptions, then solved the root problem faster."
    ];

    private static readonly IReadOnlyList<string> HealthTips =
    [
        "Drink water before caffeine to stabilize energy.",
        "Take a 5-minute movement break every 90 minutes.",
        "Get sunlight in the morning to support sleep rhythm.",
        "Protect your first deep-work block before checking feeds.",
        "Keep posture resets between focus sessions.",
        "Set a consistent sleep window and defend it."
    ];

    private static readonly IReadOnlyList<string> DietTips =
    [
        "Build meals around protein first, then add carbs and fats.",
        "Keep one simple high-protein backup meal ready.",
        "Use a fixed lunch menu on busy workdays.",
        "Avoid sugar-heavy snacks during deep work.",
        "Hydrate before deciding if you're hungry.",
        "Plan tomorrow's meals tonight in two minutes."
    ];

    private static readonly IReadOnlyList<string> PhysicalChallenges =
    [
        "20 push-ups + 20 bodyweight squats before lunch.",
        "10-minute brisk walk after your first focus block.",
        "2 rounds of plank holds (45 seconds each).",
        "Mobility reset: hips, shoulders, and thoracic spine for 8 minutes.",
        "Three stair climbs today with controlled breathing.",
        "Minimum workout entry: 12 focused minutes, no negotiation."
    ];

    private static readonly IReadOnlyList<string> WealthTips =
    [
        "Create one skill-to-income action before noon.",
        "Log every income signal, even small ones, to reinforce growth.",
        "Define one offer improvement that can raise value delivered.",
        "Spend 20 minutes on pipeline-building, not just task execution.",
        "Protect savings transfer as a fixed monthly system.",
        "Choose one asset-building action over one consumption action."
    ];

    private static readonly IReadOnlyList<string> ReflectionPrompts =
    [
        "What action made today better than yesterday?",
        "Where did I avoid discomfort, and what is the next brave step?",
        "Which decision today aligned with my long-term identity?",
        "What distracted me most, and how will I reduce it tomorrow?",
        "What did I learn that I can teach clearly?",
        "What is one promise I kept to myself today?"
    ];

    private static readonly IReadOnlyList<string> BlogPrompts =
    [
        "Write about one .NET concept you finally understood this week.",
        "Share a short lesson on building confidence through repetition.",
        "Document your current full-stack learning roadmap and why.",
        "Explain a mistake you made and the system you built to prevent it.",
        "Write a practical guide for staying focused in high-distraction environments.",
        "Turn today's learning note into a beginner-friendly blog post."
    ];

    private static readonly IReadOnlyList<string> MentalModels =
    [
        "First Principles: break problems into fundamentals before selecting a solution.",
        "Compounding: tiny repeated gains beat occasional bursts.",
        "Inversion: identify what causes failure, then remove it.",
        "Constraint Focus: pick the one bottleneck limiting progress.",
        "Feedback Loop: ship, measure, adjust, and repeat quickly.",
        "Opportunity Cost: saying yes to one task means saying no to another."
    ];

    public DailyGuideResponse BuildTodayGuide()
    {
        var today = DateTime.Today;
        var primaryLearningTopic = PickByDate(DotNetRoadmapTopics, today, 11);
        var fullStackTopic = PickByDate(FullStackTopics, today, 23);
        var englishWord = PickByDate(Vocabulary, today, 31);
        var wealthFocus = PickByDate(WealthTips, today, 41);
        var mentalModel = PickByDate(MentalModels, today, 53);

        return new DailyGuideResponse
        {
            Date = today.ToString("yyyy-MM-dd"),
            TodaysMission = $"Execute one deep-work block on {primaryLearningTopic}, then log one proof of progress.",
            LearningTopic = $"{primaryLearningTopic} + {fullStackTopic}",
            EnglishWord = englishWord.Word,
            EnglishMeaning = englishWord.Meaning,
            EnglishExampleSentence = englishWord.Example,
            ConfidenceDrill = PickByDate(ConfidenceDrills, today, 61),
            QuoteOfTheDay = PickByDate(Quotes, today, 71),
            InspirationStory = PickByDate(InspirationStories, today, 79),
            HealthTip = PickByDate(HealthTips, today, 89),
            DietTip = PickByDate(DietTips, today, 97),
            PhysicalChallenge = PickByDate(PhysicalChallenges, today, 101),
            WealthFocus = wealthFocus,
            ReflectionPrompt = PickByDate(ReflectionPrompts, today, 109),
            BlogPrompt = PickByDate(BlogPrompts, today, 127),
            FocusMissionSuggestion = "Run a 25-minute deep-work sprint. No context switching until one concrete output is complete.",
            MentalModel = mentalModel
        };
    }

    private static T PickByDate<T>(IReadOnlyList<T> source, DateTime date, int salt)
    {
        var seed = unchecked((date.Year * 1000) + (date.DayOfYear * 37) + (salt * 101));
        var index = Math.Abs(seed) % source.Count;
        return source[index];
    }
}
