import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google import genai
from .models import ChatMessage

# -------------------------------------------------------------------
# Gemini Client
# Reads GEMINI_API_KEY automatically from environment (.env)
# -------------------------------------------------------------------
client = genai.Client()

# -------------------------------------------------------------------
# Model priority order (free tier, safest first)
# -------------------------------------------------------------------
MODEL_CANDIDATES = [
    "models/gemini-3-flash-preview",
    "models/gemini-2.5-flash-lite",
    "models/gemini-2.0-flash",
]

# -------------------------------------------------------------------
# System instruction (AI personality)
# -------------------------------------------------------------------
SYSTEM_INSTRUCTION = """
You are Bharadwaj AI Assistant.
You help with software engineering, coding, debugging,
system design, and clear technical explanations.
Be concise, practical, and developer-focused.
"""

# -------------------------------------------------------------------
# Helper: Try models one by one
# -------------------------------------------------------------------
def generate_with_fallback(prompt: str) -> str:
    for model_id in MODEL_CANDIDATES:
        try:
            response = client.models.generate_content(
                model=model_id,
                contents=prompt,
                config={
                    "system_instruction": SYSTEM_INSTRUCTION,
                    "temperature": 0.6,
                    "max_output_tokens": 8192,
                }
            )
            if response and response.text:
                return response.text
        except Exception:
            continue

    return "AI service is temporarily unavailable. Please try again."

# -------------------------------------------------------------------
# API Endpoint
# GET    /api/chat          → load chat history
# POST   /api/chat          → send message
# -------------------------------------------------------------------
@csrf_exempt
def chat_api(request):

    # -------------------------
    # GET: Load saved messages
    # -------------------------
    if request.method == "GET":
        messages = list(
            ChatMessage.objects.values(
                "sender", "message", "created_at"
            )
        )
        return JsonResponse({"messages": messages})

    # -------------------------
    # POST: New message
    # -------------------------
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:
        body = json.loads(request.body.decode("utf-8"))
        user_message = body.get("message", "").strip()

        if not user_message:
            return JsonResponse({"reply": "Empty message."})

        # Save user message
        ChatMessage.objects.create(
            sender="user",
            message=user_message
        )

        # Generate AI response
        reply = generate_with_fallback(user_message)

        # Save bot message
        ChatMessage.objects.create(
            sender="bot",
            message=reply
        )

        return JsonResponse({"reply": reply})

    except Exception:
        print("🔥 Gemini Backend Error")
        traceback.print_exc()
        return JsonResponse(
            {"reply": "Internal AI error. Check server logs."},
            status=500
        )

# -------------------------------------------------------------------
# DELETE /api/chat/delete → clear conversation
# -------------------------------------------------------------------
@csrf_exempt
def delete_chat(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE only"}, status=405)

    ChatMessage.objects.all().delete()
    return JsonResponse({"status": "deleted"})
