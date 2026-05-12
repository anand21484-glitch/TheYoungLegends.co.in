"""One-time script to generate 5 ADDITIONAL quiz questions per story using
free Pollinations.ai text generation.

Output is written to /app/backend/quiz_extensions.py as a Python dict mapping
story_id -> list of 5 question dicts (same shape as existing quiz entries).
The stories_seed.py will be patched to merge these onto the base 5 questions
so each story ends with 10 questions total.

Usage:  python /app/backend/scripts_generate_extra_quiz.py
Idempotent: skips story_ids already present in the output file.
"""
import os
import asyncio
import json
import re
import httpx
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

# Import the merged STORIES list (includes north/east/more)
import sys
sys.path.insert(0, "/app/backend")
from stories_seed import STORIES  # noqa: E402

OUT_PATH = "/app/backend/quiz_extensions.py"
POLLINATIONS_URL = "https://text.pollinations.ai/"


def existing_questions(s) -> list:
    """Stringify existing questions so model can avoid duplicates."""
    return [q["q_en"] for q in s.get("quiz", [])]


PROMPT_TEMPLATE = """Output JSON only. Schema: {"questions":[N items]}.
Each item: {q_en, q_hi, options_en (4 short strings), options_hi (4 Hindi, same order), answer (int 0-3)}.

Topic: Indian freedom fighter {name} ({era}).
Brief: {story}

Make {n} NEW simple kid quiz questions (age 5-10, ~10 words each, factual from story).
Avoid these existing: {existing}

Return ONLY the JSON object."""


async def _call_pollinations(client: httpx.AsyncClient, prompt: str) -> str:
    """Use the GET endpoint which returns more reliably than POST."""
    import urllib.parse as up
    url = "https://text.pollinations.ai/" + up.quote(prompt, safe="")
    r = await client.get(
        url,
        params={"json": "true", "model": "openai"},
        timeout=httpx.Timeout(120.0, connect=20.0),
    )
    r.raise_for_status()
    return r.text


async def _generate_batch(client: httpx.AsyncClient, s: dict, n: int, existing_qs: list) -> list:
    """Generate `n` questions in a single call. Returns valid-cleaned list."""
    brief = s["story_en"][:800].replace("\n", " ")
    existing_brief = "; ".join(existing_qs)[:280]
    prompt = (
        PROMPT_TEMPLATE
        .replace("{name}", s["name"])
        .replace("{era}", s.get("era", ""))
        .replace("{story}", brief)
        .replace("{existing}", existing_brief)
        .replace("{n}", str(n))
    )
    raw = await _call_pollinations(client, prompt)
    raw = raw.strip()
    # Try whole-JSON parse
    try:
        obj = json.loads(raw)
        if isinstance(obj, dict) and isinstance(obj.get("questions"), list):
            return _validate(obj["questions"])
    except Exception:
        pass
    # Fallback: extract a "questions": [ ... ] block by bracket-matching
    idx = raw.find('"questions"')
    if idx >= 0:
        bracket = raw.find("[", idx)
        if bracket >= 0:
            depth = 0
            end = -1
            for j in range(bracket, len(raw)):
                c = raw[j]
                if c == "[":
                    depth += 1
                elif c == "]":
                    depth -= 1
                    if depth == 0:
                        end = j + 1
                        break
            if end > 0:
                try:
                    qs = json.loads(raw[bracket:end])
                    return _validate(qs)
                except Exception:
                    pass
            # Truncated — try to keep just the complete items by parsing object-by-object
            partial = raw[bracket + 1:]
            return _extract_partial_objects(partial)
    return []


def _extract_partial_objects(s: str) -> list:
    """Walk a JSON-array body string and parse as many complete objects as possible."""
    out: list = []
    i = 0
    while i < len(s):
        if s[i] != "{":
            i += 1
            continue
        depth = 0
        end = -1
        in_str = False
        esc = False
        for j in range(i, len(s)):
            c = s[j]
            if esc:
                esc = False
                continue
            if c == "\\":
                esc = True
                continue
            if c == '"':
                in_str = not in_str
                continue
            if in_str:
                continue
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    end = j + 1
                    break
        if end < 0:
            break
        try:
            obj = json.loads(s[i:end])
            out.append(obj)
        except Exception:
            pass
        i = end
    return _validate(out)


def _validate(qs: list) -> list:
    cleaned: list = []
    for q in qs:
        if not isinstance(q, dict):
            continue
        if not all(k in q for k in ("q_en", "q_hi", "options_en", "options_hi", "answer")):
            continue
        if not (isinstance(q["options_en"], list) and len(q["options_en"]) == 4):
            continue
        if not (isinstance(q["options_hi"], list) and len(q["options_hi"]) == 4):
            continue
        try:
            ans = int(q["answer"])
            if ans < 0 or ans > 3:
                continue
        except Exception:
            continue
        cleaned.append({
            "q_en": str(q["q_en"]).strip(),
            "q_hi": str(q["q_hi"]).strip(),
            "options_en": [str(o).strip() for o in q["options_en"]],
            "options_hi": [str(o).strip() for o in q["options_hi"]],
            "answer": ans,
        })
    return cleaned


async def generate_for_story(client: httpx.AsyncClient, s: dict) -> list:
    """Generate 5 questions; if response is truncated, top up with another call."""
    existing_qs = [q["q_en"] for q in s.get("quiz", [])]
    accumulated: list = []
    for attempt in range(4):
        try:
            need = 5 - len(accumulated)
            if need <= 0:
                break
            # Ask for a few more than needed in case some get dropped
            batch = await _generate_batch(client, s, max(need + 1, 3), existing_qs + [q["q_en"] for q in accumulated])
            # Dedupe by q_en against accumulated + existing
            seen = {q.lower() for q in existing_qs + [q["q_en"] for q in accumulated]}
            for q in batch:
                key = q["q_en"].lower()
                if key in seen:
                    continue
                seen.add(key)
                accumulated.append(q)
            if len(accumulated) >= 5:
                return accumulated[:5]
            print(f"  attempt {attempt+1}: have {len(accumulated)}/5; topping up...", flush=True)
        except Exception as e:
            print(f"  attempt {attempt+1} error: {str(e)[:140]}", flush=True)
            await asyncio.sleep(8 * (attempt + 1))
    return accumulated[:5] if len(accumulated) >= 4 else []


def load_existing_out() -> dict:
    if not os.path.exists(OUT_PATH):
        return {}
    try:
        ns: dict = {}
        with open(OUT_PATH, "r", encoding="utf-8") as f:
            exec(f.read(), ns)
        return ns.get("EXTRA_QUIZZES", {})
    except Exception as e:
        print("could not read existing output:", e)
        return {}


def write_out(data: dict):
    py = (
        '"""Auto-generated extra quiz questions (5 per story) appended to stories_seed.py.\n'
        'Source: free Pollinations.ai (openai model). Regenerate via\n'
        'scripts_generate_extra_quiz.py. Do NOT hand-edit unless necessary."""\n\n'
        "EXTRA_QUIZZES = "
    )
    py += json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(py)


async def main():
    existing = load_existing_out()
    print(f"Loaded {len(existing)} existing extra-quizzes from {OUT_PATH}")
    todo = [s for s in STORIES if s["id"] not in existing]
    print(f"Need to generate for {len(todo)} stories")

    async with httpx.AsyncClient() as client:
        for i, s in enumerate(todo):
            print(f"[{i+1}/{len(todo)}] {s['id']}...", flush=True)
            qs = await generate_for_story(client, s)
            if qs:
                existing[s["id"]] = qs
                print(f"  ✓ {len(qs)} questions saved", flush=True)
                # Save progress after each story
                write_out(existing)
            else:
                print(f"  ✗ failed all attempts; skipping", flush=True)
            await asyncio.sleep(8.0)  # rate-limit aware pacing between stories
    print(f"\nDONE. Total stories with extra quiz: {len(existing)}/{len(STORIES)}")


if __name__ == "__main__":
    asyncio.run(main())
