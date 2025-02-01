# 📩 Mystry Messages  

A **full-stack** anonymous messaging platform where users can send and receive mystery messages securely. Built with **Next.js, Resend, MongoDB, and Gemini AI**, this app offers a seamless and interactive user experience.  

## ✨ Features  
✅ **Send & Receive Anonymous Messages** – Stay anonymous while sharing your thoughts  
✅ **Email Verification** – Secured with **Resend** to verify users  
✅ **AI Message Suggestions** – Powered by **Gemini AI**  
✅ **Modern UI** – Built with **ShadCN** for a sleek design  
✅ **Secure Data Storage** – Messages and users are stored in **MongoDB**  

## 🚀 Tech Stack  
- **Frontend:** Next.js (App Router) with ShadCN  
- **Backend:** Next.js API Routes (Serverless)  
- **Database:** MongoDB (Mongoose ORM)  
- **Authentication:** Resend for email verification  
- **AI Features:** Gemini AI for message suggestions  

## 🛠 Installation  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/vaghmarelazy/Mystry-messages.git
   cd Mystry-messages
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env.local` file and add:  
   ```env
   MONGODB_URI=your_mongodb_connection_string
   RESEND_API_KEY=your_resend_api_key
   GEMINI_API_KEY=your_gemini_ai_key
   NEXTAUTH_SECRET=your_secret_key
   ```

4. **Run the development server**  
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.  

## 📌 Usage  
1. Sign up with your email (verified via Resend).  
2. Share your unique link with others.  
3. Receive anonymous messages and get AI-generated responses!  

## 🎯 Future Enhancements  
- Add OAuth login (Google, GitHub)  
- Message reactions & replies  
- User profiles & message history  
- End-to-end message encryption  

## 🤝 Contributing  
Contributions are welcome! Open an issue or submit a pull request.  

## 📜 License  
MIT License – Feel free to use and modify this project.  
