<div align="center">
  <img src="assets/readme-banner.png" alt="QuizFlow Banner" width="100%" />

  # ⚡ QuizFlow
  **Master Your Knowledge. Challenge The World.**

  [![Expo SDK](https://img.shields.io/badge/Expo%20SDK-52-black?logo=expo&style=for-the-badge)](https://expo.dev)
  [![React Native](https://img.shields.io/badge/React_Native-0.76-blue?logo=react&style=for-the-badge)](https://reactnative.dev)
  [![Firebase](https://img.shields.io/badge/Firebase-12.6-orange?logo=firebase&style=for-the-badge)](https://firebase.google.com)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  [Features](#-features) • [Installation](#-installation) • [Screenshots](#-screenshots) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)
</div>

---

## 🚀 Overview

**QuizFlow** is a modern, premium mobile learning experience designed to make studying engaging and effective. Built with React Native and Expo, it combines beautiful animations, gamification, and robust tracking to help users master new topics.

Whether you're preparing for exams or just expanding your knowledge, QuizFlow adapts to your pace.

## ✨ Features

### 🎮 Gamified Learning
- **XP System**: Earn experience points for every correct answer.
- **Leveling**: Progress from "Novice" to "Master" as you learn.
- **Streaks**: Maintain daily activity to unlock achievements.
- **Leaderboards**: Compete globally with other learners.

### 📚 Study Modes
- **Topic-based Quizzes**: Filter challenges by specific categories.
- **Timed Mode**: Race against the clock to test your speed.
- **Study Mode**: Read and review MCQs without the pressure of a timer.
- **Offline Sync**: Download quizzes and practice anywhere.

### 🎨 Premium UI/UX
- **Smooth Animations**: Powered by `react-native-reanimated` and `Framer Motion`.
- **Glassmorphism**: Modern, sleek design language.
- **Dark Mode**: Easy on the eyes for late-night study sessions.
- **Haptic Feedback**: Tactile responses for interactions.

### 📊 Meaningful Stats
- **Detailed Analytics**: Visualize your accuracy and improvement over time.
- **Badges & Achievements**: Unlock rewards for milestones.

## 📱 Screenshots

<div align="center">
  <h3>App Showcase</h3>
  <img src="assets/screenshots/showcase_1.png" width="30%" />
  <img src="assets/screenshots/showcase_2.png" width="30%" />
  <img src="assets/screenshots/showcase_3.png" width="30%" />
  <img src="assets/screenshots/showcase_4.png" width="30%" />
  <img src="assets/screenshots/showcase_5.png" width="30%" />
  <img src="assets/screenshots/showcase_6.png" width="30%" />
  <img src="assets/screenshots/showcase_7.png" width="30%" />
  <img src="assets/screenshots/showcase_8.png" width="30%" />
  <img src="assets/screenshots/showcase_9.png" width="30%" />
  <img src="assets/screenshots/showcase_10.png" width="30%" />
  <img src="assets/screenshots/showcase_11.png" width="30%" />
  <img src="assets/screenshots/showcase_12.png" width="30%" />
  <img src="assets/screenshots/showcase_13.png" width="30%" />
  <img src="assets/screenshots/showcase_14.png" width="30%" />
  <img src="assets/screenshots/showcase_15.png" width="30%" />
  <img src="assets/screenshots/showcase_16.png" width="30%" />
</div>

## 🛠 Tech Stack

- **Core**: React Native, Expo, TypeScript
- **Styling**: StyleSheet, Expo Linear Gradient
- **Navigation**: Expo Router (File-based routing)
- **State Management**: React Context, Hooks
- **Backend / Auth**: Firebase (Auth, Firestore)
- **Animations**: React Native Reanimated, Lottie
- **Icons**: Lucide React Native

## ⚡ Installation

Get the project running locally in minutes.

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo Go app on your phone (or Android Studio/Xcode for simulators)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quizflow.git
   cd quizflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   *Note: This project uses `react-native-svg` and `lucide-react-native`.*

3. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   *Modify `.env` with your Firebase credentials.*

4. **Start the server**
   ```bash
   npx expo start
   ```

5. **Run on Device**
   - Scan the QR code with **Expo Go** (Android/iOS).
   - Or press `a` for Android Emulator / `i` for iOS Simulator.

## 📁 Project Structure

<details>
<summary>Click to expand</summary>

```
quizflow/
├── app/                  # Expo Router pages
│   ├── (auth)/           # Authentication screens
│   ├── (tabs)/           # Main tab navigation
│   ├── quiz/             # Quiz execution flow
│   └── ...
├── components/           # Reusable UI components
│   ├── ui/               # Primitive UI elements (Buttons, Inputs)
│   └── ...
├── context/              # Global state (Theme, Auth, Toast)
├── hooks/                # Custom React hooks
├── services/             # API services (Firebase)
└── assets/               # Images, fonts, animations
```
</details>

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/imtiaz0307">Imtiaz</a></p>
</div>
