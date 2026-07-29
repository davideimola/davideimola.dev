I built an AI agent that does code security review. Here's why.

A few months ago everyone was talking about OpenClaw. It was the tool of the moment and everyone was writing about it. I used it for useful things and for completely useless ones, and I had a lot of fun. The part that stuck with me is that it genuinely worked like a colleague. We actually used it that way. We've mostly stopped since, but it worked, and it wasn't bad at all.

What stayed with me was the shape of it. An AI that is already running when you need it, instead of one you have to go and start. One that can reach different tools. One that knows things about you and grows what it knows by talking to you. That is not a small thing.

And application security has the opposite problem of a missing tool. There are too many. Nobody has the time to learn them properly, and even when you do know them it's hard to remember to run them. You can put them in a pipeline, sure, and then you spend your time managing the pipeline.

So: an always-running agent that acts like the code security reviewer your team doesn't have, doing the review by calling deterministic tools and using them to verify what it finds. That felt worth trying.

So I tried it. Argus is the first version that came out, it's rough, and today it does two things. It reviews pull requests on GitHub, and it runs as an MCP server. It doesn't watch your infrastructure and it isn't a SOC. It reads code. That's already something, and it makes me genuinely happy, because it proved the thing was feasible: tool calling gets you to something usable, with whatever AI you already have instead of the one a vendor picks for you.

The MCP side is the part I use most. I like being able to point at something I just wrote and ask whether it's safe. Tools like Claude already have skills for that and they're good at it. What they don't have is your company: the other repos, how your services talk to each other, what your org actually cares about. Something that holds that context and applies it to hunt for security problems is not a trivial thing to have.

It's not a trivial thing to build either. It's security and it's AI, so both halves are hard. Argus exists to be tried and broken, not to be finished, and for it to grow it needs people running it on their own code, seeing what works and what doesn't, and telling me.

It's been a great experiment either way. I've read a lot of security tooling getting here, and I want far more tools and features in it than I have time to build. That's exactly why I'm sharing it now rather than later. I've already built something, it's my take on a problem worth solving, and I'd like to find out what it becomes.

https://davideimola.dev/blog/introducing-argus
Repo: https://github.com/argusappsec/argus
