# 🤖 BharadwajAI Chat

BharadwajAI Chat is a full-stack AI chatbot built using **React**, **Django**, **SQLite**, and **Google Gemini API 3.0**.  
It provides real-time intelligent conversations with a clean UI and secure backend architecture.

---

## 🧠 Chatbot or Agent?

This project is currently an **AI Chatbot**.

- Accepts user input
- Sends it to Gemini API
- Returns AI-generated responses

It does not yet perform autonomous actions or tool usage.  
With memory and tool integrations, it can be upgraded into an **AI Agent**.

---

## 🚀 Features

- 💬 Real-time AI chat using Gemini API 3.0
- ⚛️ Modern React frontend
- 🐍 Django REST backend
- 🗄️ SQLite lightweight database
- 🔐 Secure environment-based API keys
- 🌐 Clean frontend-backend separation

---

## 🛠️ Tech Stack

Frontend: React, JavaScript, CSS  
Backend: Django, Django REST Framework, python-dotenv  
AI: Google Gemini API 3.0  
Database: SQLite

---

## 📁 Project Structure

```
bharadwaj-ai-chat/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
├── .gitignore
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend directory:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Never commit `.env` files to GitHub.

---

## ⚙️ Backend Setup (Django)

```
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## ⚛️ Frontend Setup (React)

```
cd frontend
npm install
npm start
```

---

## 🌐 Access the App

Frontend: http://localhost:3000  
Backend: http://localhost:8000  

---

## 🔄 Application Flow

1. User sends a message from the UI
2. Request reaches Django REST API
3. Backend calls Gemini API securely
4. Gemini generates the response
5. Response is displayed in the chat UI

---

## 🔒 Security

- API keys stored in environment variables
- `.env` ignored via `.gitignore`
- GitHub Secret Scanning supported
- No secrets committed

---

## 🚧 Future Enhancements

- Conversation memory
- Tool calling support
- Authentication
- Streaming responses
- Cloud deployment
- Upgrade to AI Agent

---

## 👨‍💻 Author

Bharadwaj (Manu)  
GitHub: https://github.com/Manu577228  
YouTube: Code with Bharadwaj

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
