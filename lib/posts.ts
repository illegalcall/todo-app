export type PostBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      items: string[];
      ordered?: boolean;
    }
  | {
      type: "code";
      code: string;
      language: string;
      caption?: string;
    }
  | {
      type: "quote";
      text: string;
    };

export interface PostSection {
  heading: string;
  blocks: PostBlock[];
}

export interface PostSource {
  label: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  author: string;
  topic: string;
  lead: string;
  sections: PostSection[];
  sources: PostSource[];
}

export const posts: BlogPost[] = [
  {
    slug: "how-large-language-models-work",
    title: "How Large Language Models Work, Without the Hand-Waving",
    description:
      "A practical tour of tokens, embeddings, attention, training, and generation—and why fluent language models can still be confidently wrong.",
    excerpt:
      "From tokens to attention to next-token prediction: a grounded mental model for what an LLM learns, how it produces an answer, and where its limits come from.",
    date: "2026-07-15",
    author: "Mira Chen",
    topic: "Foundations",
    lead:
      "An LLM is neither a database with every sentence filed away nor a small person living in a server. It is a learned system for predicting continuations—and that modest description turns out to produce remarkably rich behavior.",
    sections: [
      {
        heading: "Start with the right unit: tokens, not words",
        blocks: [
          {
            type: "paragraph",
            text: "Before a model sees language, a tokenizer breaks text into a vocabulary of reusable pieces called tokens. A familiar word may be one token; an unusual surname, source-code identifier, or accented phrase may become several. Tokenization matters because the model does not manipulate letters or meanings directly. It receives a sequence of integer token IDs and must learn useful structure from how those IDs occur together.",
          },
          {
            type: "paragraph",
            text: "Each token ID is mapped to an embedding: a long list of learned numbers. During training, embeddings arrange themselves so that tokens used in related contexts have useful geometric relationships. Position information is added because the same tokens in a different order can mean something entirely different. The result is a sequence of vectors representing both what appeared and where it appeared.",
          },
          {
            type: "quote",
            text: "The model never receives a dictionary definition of “promise,” “function,” or “kindness.” It learns operational meanings from patterns of use.",
          },
        ],
      },
      {
        heading: "Attention builds context on demand",
        blocks: [
          {
            type: "paragraph",
            text: "The transformer architecture, introduced in the 2017 paper “Attention Is All You Need,” replaced the strictly sequential processing common in earlier language systems with attention. For every token, the model creates a query, key, and value. A query is compared with other tokens’ keys; the resulting scores determine how much of their values should be mixed into the current representation.",
          },
          {
            type: "code",
            language: "text",
            caption: "A simplified view of one attention operation",
            code: "scores  = (query × keysᵀ) / √dimension\nweights = softmax(scores)\ncontext = weights × values",
          },
          {
            type: "paragraph",
            text: "Different attention heads can learn different relationships. One might connect a pronoun to the noun it refers to; another may track indentation in code; another may notice that a closing quotation mark is expected. A transformer block combines this contextual mixing with a feed-forward network, residual connections, and normalization. Repeating the block many times lets the representation evolve from local spelling and syntax toward more abstract relationships.",
          },
          {
            type: "paragraph",
            text: "Attention is powerful, but it is not a perfect explanation of the model’s reasoning. Researchers can inspect which tokens influence one another, yet the computation is distributed across many heads and layers. A clean attention map is a clue, not a faithful transcript of an internal thought process.",
          },
        ],
      },
      {
        heading: "Training compresses patterns into parameters",
        blocks: [
          {
            type: "paragraph",
            text: "During pretraining, the model repeatedly receives text with a next token to predict. Its initial guesses are poor. A loss function measures the gap between predicted probabilities and the actual continuation, then backpropagation adjusts billions of parameters by tiny amounts. Repeated across a large and varied corpus, this process rewards parameters that capture reusable regularities: grammar, genre, facts that recur in text, programming idioms, and patterns that resemble step-by-step inference.",
          },
          {
            type: "paragraph",
            text: "This is better understood as lossy compression than memorization alone. The parameters cannot store a perfect copy of the training set, so the model learns general circuits that help across examples. Memorization can still occur, especially for duplicated or distinctive sequences, but generalization is why a model can write a novel function or explain an analogy it never encountered verbatim.",
          },
          {
            type: "paragraph",
            text: "Pretraining optimizes continuation, not helpful conversation. Instruction tuning adds examples of desired responses, and preference optimization teaches the model which of several plausible answers people tend to prefer. Tool-use training can teach it to emit structured calls rather than invent an answer. These later stages shape behavior, but the generative engine remains a probability model over tokens.",
          },
        ],
      },
      {
        heading: "Generation is a loop, not a retrieved paragraph",
        blocks: [
          {
            type: "paragraph",
            text: "At inference time, your prompt and conversation history form the context window. The model performs a forward pass and produces a probability distribution for the next token. A decoding strategy selects one token, appends it to the context, and runs the process again. Temperature and sampling settings influence whether selection favors the safest high-probability continuation or explores less likely alternatives.",
          },
          {
            type: "list",
            items: [
              "The context window is working memory, not permanent memory. Information outside it must be retrieved or summarized.",
              "Generation is path-dependent. One early token changes the context for every token that follows.",
              "The model usually cannot check the external world unless the application gives it search, databases, calculators, or other tools.",
            ],
          },
          {
            type: "paragraph",
            text: "This loop explains both fluency and fragility. Every sentence is conditioned on a dense representation of what came before, producing striking coherence. But the objective is still to generate a plausible continuation. When the prompt asks for an obscure citation or an unavailable fact, a plausible-looking invention can score better than an awkward admission of uncertainty.",
          },
        ],
      },
      {
        heading: "A useful model of the limits",
        blocks: [
          {
            type: "paragraph",
            text: "Three distinctions make LLMs easier to use well. First, learned knowledge is not guaranteed knowledge: parameters encode statistical regularities with uneven coverage and uncertain freshness. Second, verbal reasoning is not automatically verified reasoning: a convincing derivation may contain a silent arithmetic or logical error. Third, capability is not agency: a base model returns tokens; an application gives it goals, memory, tools, retries, and permissions.",
          },
          {
            type: "paragraph",
            text: "Good product design works with those realities. Supply the relevant source material, ask the model to identify uncertainty, use tools for exact calculation and current data, request structured outputs, and verify consequential results. An LLM is most dependable when it is one component in a system with explicit context and checks—not when eloquence is treated as evidence.",
          },
        ],
      },
    ],
    sources: [
      {
        label: "Attention Is All You Need — Vaswani et al.",
        url: "https://arxiv.org/abs/1706.03762",
      },
      {
        label: "Training Compute-Optimal Large Language Models — Hoffmann et al.",
        url: "https://arxiv.org/abs/2203.15556",
      },
      {
        label:
          "Training language models to follow instructions with human feedback — Ouyang et al.",
        url: "https://arxiv.org/abs/2203.02155",
      },
    ],
  },
  {
    slug: "ai-agents-and-orchestration",
    title: "AI Agents Need Good Orchestration More Than More Autonomy",
    description:
      "A practical architecture guide to agent loops, tools, workflows, orchestration, permissions, observability, and evaluations.",
    excerpt:
      "The useful part of an AI agent is not endless autonomy. It is a well-bounded loop, legible tools, purposeful orchestration, and evidence that the work actually succeeded.",
    date: "2026-07-22",
    author: "Jon Bell",
    topic: "Systems",
    lead:
      "Calling every multi-step prompt an “agent” hides the engineering decisions that determine whether the system is dependable. The important question is not how human-like it feels, but how it chooses actions, observes results, and stops.",
    sections: [
      {
        heading: "Separate workflows from agents",
        blocks: [
          {
            type: "paragraph",
            text: "A workflow follows a path chosen in code: classify a request, retrieve a document, draft a response, then run a policy check. An agent lets a model choose at least some of that path dynamically. It may decide which tool to call, inspect the result, revise a plan, and continue until it reaches a stopping condition. Both are useful; neither is inherently more advanced.",
          },
          {
            type: "paragraph",
            text: "Use a workflow when the task is stable and the acceptable sequence is known. It is easier to test, cheaper to operate, and simpler to explain. Reach for an agent when the path genuinely depends on discoveries made during execution: debugging a repository, investigating an incident, or researching a question whose relevant sources cannot be predicted in advance.",
          },
          {
            type: "quote",
            text: "Autonomy is a budget to spend where uncertainty demands it, not a feature to maximize.",
          },
        ],
      },
      {
        heading: "The agent loop is small; the environment is the product",
        blocks: [
          {
            type: "paragraph",
            text: "At its center, an agent is a loop. The model receives a goal and current state, chooses an action, the runtime executes that action, and the result returns as a new observation. The loop ends on success, a limit, an error policy, or a request for human input. Production complexity lives around this loop: tool schemas, state storage, retries, credentials, sandboxes, tracing, and user controls.",
          },
          {
            type: "code",
            language: "ts",
            caption: "A deliberately simplified agent runtime",
            code: "for (let turn = 0; turn < maxTurns; turn++) {\n  const decision = await model.next({ goal, state, tools });\n\n  if (decision.type === \"done\") return verify(decision, state);\n  if (!policy.allows(decision.action)) return requestApproval(decision);\n\n  const observation = await execute(decision.action);\n  state = appendTrace(state, decision, observation);\n}\n\nreturn { status: \"limit_reached\", trace: state.trace };",
          },
          {
            type: "paragraph",
            text: "Tool design deserves the same care as a public API. Names should describe outcomes, parameters should be typed and narrow, error messages should say what can be corrected, and returned data should omit irrelevant noise. A vague “run anything” tool creates a larger decision space and a larger security boundary. Several small tools often make intended actions easier for the model—and for a human reviewer—to understand.",
          },
        ],
      },
      {
        heading: "Choose an orchestration pattern deliberately",
        blocks: [
          {
            type: "paragraph",
            text: "Orchestration coordinates model calls and tools. Prompt chaining works when one stage naturally produces input for the next. Routing sends distinct requests to specialized prompts, models, or policies. Parallelization reduces latency for independent work or gathers several perspectives. An evaluator-optimizer loop drafts, critiques against an explicit rubric, and revises. An orchestrator-worker pattern lets a coordinator discover subtasks and delegate them.",
          },
          {
            type: "list",
            items: [
              "Chain when order matters and intermediate checks can catch drift early.",
              "Route when categories have meaningfully different tools, risk, or cost.",
              "Parallelize only independent work; otherwise coordination overhead erases the gain.",
              "Add an evaluator when quality criteria can be written clearly and measured.",
              "Delegate when the task decomposes after inspection, not merely because multiple agents are available.",
            ],
          },
          {
            type: "paragraph",
            text: "Multi-agent systems are especially easy to overbuild. Every handoff can lose context, duplicate effort, increase token cost, or create contradictory state. Start with one agent and good tools. Split roles only when specialization, isolation, or parallel execution produces a measurable improvement over the simpler baseline.",
          },
        ],
      },
      {
        heading: "Bound context, memory, and authority",
        blocks: [
          {
            type: "paragraph",
            text: "An agent needs enough context to act, but more is not always better. Long histories bury important constraints and raise cost. Keep an immutable task brief, a compact working summary, structured state for facts and artifacts, and a trace of raw events for debugging. Retrieval should select relevant material rather than paste an entire knowledge base into every turn.",
          },
          {
            type: "paragraph",
            text: "Authority should be equally explicit. Separate read tools from write tools. Scope credentials to the task. Require approval for irreversible, expensive, external, or high-impact actions. Put file and network operations in a sandbox when possible. Defend tool outputs as untrusted input because a document or webpage can contain instructions designed to redirect the agent.",
          },
          {
            type: "paragraph",
            text: "A good stopping policy prevents two common failures: declaring victory based on a polished message, and looping long after useful progress has stopped. Define success in observable state—a passing test, a created reservation, a reconciled record—not in the model’s confidence. Set turn, time, and cost budgets, and make escalation a supported outcome rather than a failure.",
          },
        ],
      },
      {
        heading: "Evaluate trajectories and outcomes",
        blocks: [
          {
            type: "paragraph",
            text: "Single-response scoring is insufficient for agents because errors compound across actions. An evaluation should provide a controlled environment, run the task several times, capture the full trajectory, and grade both the final state and important process constraints. Did the record change correctly? Did the agent avoid a forbidden tool? Did it ask for approval? How much time and money did it use?",
          },
          {
            type: "paragraph",
            text: "Combine deterministic graders such as tests and database assertions with model-based or human review for qualities that resist exact rules. Keep a regression set drawn from real failures. In production, log tool names, sanitized arguments, latency, errors, approvals, model versions, and terminal outcomes. Without traces, teams end up debugging the final sentence while the actual mistake happened six tool calls earlier.",
          },
          {
            type: "paragraph",
            text: "The best agent architecture is usually visible, interruptible, and a little boring. It gives the model freedom where judgment is useful while conventional software handles permissions, durable state, and verification. That division is not a compromise. It is how probabilistic intelligence becomes a dependable system.",
          },
        ],
      },
    ],
    sources: [
      {
        label: "Building effective agents — Anthropic",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
      },
      {
        label: "A practical guide to building AI agents — OpenAI",
        url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/",
      },
      {
        label: "Demystifying evals for AI agents — Anthropic",
        url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
      },
    ],
  },
  {
    slug: "practical-future-ai-developer-tooling",
    title: "The Practical Future of AI Developer Tooling",
    description:
      "Why AI coding tools are moving from autocomplete to verified task execution, and what teams should change in their workflows now.",
    excerpt:
      "The next generation of developer tools will not merely write more code. It will compress the loop from intent to evidence—while making judgment, review, and system design more important.",
    date: "2026-07-29",
    author: "Asha Raman",
    topic: "Practice",
    lead:
      "The durable promise of AI-assisted development is not that typing disappears. It is that more of the journey from a precise intention to a verified change can become navigable, inspectable, and fast.",
    sections: [
      {
        heading: "From completing lines to completing loops",
        blocks: [
          {
            type: "paragraph",
            text: "Early AI coding tools lived inside the editor and predicted the next few lines. That interaction remains useful because it is immediate and easy to supervise. Newer systems operate over a repository: they search, edit several files, run commands, interpret failures, and prepare a patch. The unit of assistance is shifting from a snippet to a bounded engineering task.",
          },
          {
            type: "paragraph",
            text: "That shift changes the interface. A strong tool needs a map of the codebase, access to build and test feedback, an understanding of local conventions, and a way to show its plan and evidence. Chat is only one surface. Diffs, terminal logs, citations to files, review comments, checkpoints, and permission prompts are often more important because they expose what changed and why.",
          },
          {
            type: "quote",
            text: "The winning workflow will optimize for verified outcomes per unit of attention—not tokens generated or lines added.",
          },
        ],
      },
      {
        heading: "Productivity evidence is contextual, not contradictory",
        blocks: [
          {
            type: "paragraph",
            text: "Research results on coding assistants vary because the tasks and users vary. In a controlled GitHub study, developers using Copilot completed a small JavaScript server task substantially faster. A later GitHub experiment reported modest improvements in several code-quality measures for a scoped API exercise. By contrast, a 2025 METR randomized study found that experienced open-source developers working on their own mature repositories took longer with then-current AI tools, even though participants believed they had been faster.",
          },
          {
            type: "paragraph",
            text: "Those findings can coexist. A greenfield exercise with clear tests is different from modifying a large system full of tacit constraints. Familiar experts may spend more time prompting, waiting, checking plausible mistakes, and restoring context than they save on implementation. Tool capability also changes quickly, so a result is a measurement of a particular workflow at a particular time—not a universal law of software development.",
          },
          {
            type: "paragraph",
            text: "Teams should therefore measure their own work. Track cycle time, review time, escaped defects, rollback rate, developer satisfaction, and the fraction of generated changes substantially rewritten. Segment by task: migrations, tests, unfamiliar code navigation, boilerplate, debugging, and architectural work have different profiles. A local baseline is more useful than an industry-wide claim about a single productivity percentage.",
          },
        ],
      },
      {
        heading: "Repository context becomes infrastructure",
        blocks: [
          {
            type: "paragraph",
            text: "Coding models perform better when the repository explains itself. Machine-readable commands, focused architecture notes, representative tests, generated API schemas, stable formatting, and clear module boundaries all reduce ambiguity. These investments help humans too. The difference is that an agent encounters missing documentation at machine speed and can repeat the resulting mistake across many files.",
          },
          {
            type: "list",
            items: [
              "Keep one authoritative command for each of build, test, lint, and typecheck.",
              "Document constraints near the code they govern, and keep instructions short enough to remain current.",
              "Provide fast, deterministic tests so the tool can close its own feedback loop.",
              "Use typed interfaces and schemas at system boundaries; natural language should not replace enforceable contracts.",
              "Make generated changes easy to isolate, inspect, and revert.",
            ],
          },
          {
            type: "paragraph",
            text: "Retrieval will become more structural. Instead of stuffing arbitrary file chunks into a prompt, tools can combine dependency graphs, symbol references, version history, issue context, runtime traces, and ownership data. The goal is not maximum context. It is the smallest evidence set that explains the change safely.",
          },
        ],
      },
      {
        heading: "Verification moves into the center",
        blocks: [
          {
            type: "paragraph",
            text: "When producing code becomes cheaper, validation becomes the scarce resource. Future tools will generate tests alongside implementations, but a generated test is not independent proof if it repeats the same misunderstanding. Strong workflows mix checks: type systems, linters, unit and integration tests, property tests, security scanning, previews, benchmarks, and human review guided by risk.",
          },
          {
            type: "code",
            language: "text",
            caption: "A risk-aware assistance ladder",
            code: "read and explain  →  draft a diff  →  run local checks\n        →  request review  →  stage a deployment\n        →  monitor evidence  →  expand authority",
          },
          {
            type: "paragraph",
            text: "Permission should expand with demonstrated reliability and shrink with risk. Reading code is not the same as changing production configuration. Editing an isolated test fixture is not the same as running a database migration. Useful tools make those boundaries visible and preserve a durable record of actions, inputs, outputs, and approvals.",
          },
        ],
      },
      {
        heading: "Developers move upstream—and stay accountable",
        blocks: [
          {
            type: "paragraph",
            text: "As implementation loops accelerate, developers spend a larger share of time framing problems, selecting tradeoffs, defining invariants, and reviewing behavior. Domain knowledge becomes more valuable, not less: someone must recognize when a technically valid patch violates the product, the organization, or the user’s expectations. Recent research on agentic coding has likewise found that stronger domain expertise helps people direct more effective work.",
          },
          {
            type: "paragraph",
            text: "Junior engineers still need deliberate practice. If every unfamiliar step is delegated, short-term velocity can create long-term fragility. Teams can use AI as a tutor—asking for explanations, alternatives, and review questions—while reserving tasks that build debugging and systems intuition. Senior engineers need new skills too: writing executable acceptance criteria, designing evaluation suites, and reviewing a stream of small machine-produced changes without succumbing to automation bias.",
          },
          {
            type: "paragraph",
            text: "The practical future is neither a magical one-prompt application nor business as usual with faster autocomplete. It is a layered engineering environment where models propose and navigate, deterministic systems constrain and verify, and people retain responsibility for goals and consequences. Teams that improve their feedback loops now will benefit from better models later without having to rebuild their working culture around every release.",
          },
        ],
      },
    ],
    sources: [
      {
        label:
          "Quantifying GitHub Copilot’s impact on developer productivity and happiness — GitHub",
        url: "https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/",
      },
      {
        label: "Does GitHub Copilot improve code quality? — GitHub",
        url: "https://github.blog/news-insights/research/does-github-copilot-improve-code-quality-heres-what-the-data-says/",
      },
      {
        label:
          "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity — METR",
        url: "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/",
      },
      {
        label: "Agentic coding and persistent returns to expertise — Anthropic",
        url: "https://www.anthropic.com/research/claude-code-expertise",
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostWordCount(post: BlogPost): number {
  const articleText = post.sections
    .flatMap((section) => [
      section.heading,
      ...section.blocks.flatMap((block) => {
        if (block.type === "list") return block.items;
        if (block.type === "code") return block.caption ?? "";
        return block.text;
      }),
    ])
    .join(" ");

  return articleText.match(/\b[\w’'-]+\b/g)?.length ?? 0;
}

export function getReadingTime(post: BlogPost): string {
  const minutes = Math.max(1, Math.ceil(getPostWordCount(post) / 210));
  return `${minutes} min read`;
}

export function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00Z`));
}
