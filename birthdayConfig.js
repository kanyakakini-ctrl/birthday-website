/**
 * 🎂 BIRTHDAY SURPRISE CONFIGURATION
 * 
 * Synchronized with your latest custom birthday data, PIN, memories, and gifts.
 */

export const birthdayConfig = {
  recipientName: "Nahun",
  nickname: "Gawar",
  pin: "2808",
  unlockScreen: {
    title: "unlock",
    subtitle: "A special surprise is waiting for you ✨",
    hintText: "Enter the 4-digit secret key 🗝️ (Default: 1234)",
    photo: "/assets/photos/photo1.jpg"
  },
  surpriseScreen: {
    heading: "Hey there!",
    question: "I have little surprise for you.\nWanna see it? 💖",
    yesButtonText: "YES, OF COURSE! 🎉",
    noButtonText: "No thanks 🙈",
    noButtonResponses: [
      "Are you sure? 🥺",
      "Wrong button silly! 😜",
      "Try clicking YES instead! ✨",
      "Nice try, you can't say no! 🎁",
      "Come on, just click YES! 💕",
      "Nope, not allowed! 🚀",
      "Resistance is futile! 🥰"
    ]
  },
  celebrationScreen: {
    birthdayTitle: "HAPPY BIRTHDAY",
    subheading: "Wishing you the most magical and joyful day filled with endless smiles! 🎂✨",
    mainPhoto: "/assets/photos/photo2.jpg",
    ctaButtonText: "Open Memories 📸"
  },
  memories: [
    {
      id: 2,
      image: "/assets/photos/1787846835387-photo2.jpg",
      caption: "Sweet Moments & Laughter",
      date: "Endless Smiles 😊",
      note: "Remember this day? We laughed so hard our stomachs hurt! You always bring so much joy. 🌟"
    },
    {
      id: 3,
      image: "/assets/photos/photo3.jpg",
      caption: "Unforgettable Adventures",
      date: "Pure Magic 🌿",
      note: "Life with you is never dull. Here's to all the unplanned adventures and great stories. 🌈"
    },
    {
      id: 4,
      image: "/assets/photos/1787847721187-1787847708058-photo4.jpg",
      caption: "Brightest Smile in the Room",
      date: "Golden Hour ☀️",
      note: "Your positivity is contagious. Thank you for always lighting up the world around you. 🌸"
    },
    {
      id: 5,
      image: "/assets/photos/1787847738625-photo5.jpg",
      caption: "To Many More Memories Ahead",
      date: "Forever & Always 💖",
      note: "May your coming year be overflowing with dreams coming true, good health, and big hugs! 🥂"
    },
    {
      id: 1787846593589,
      image: "/assets/photos/1787847807057-photo6.jpg",
      caption: "photo3",
      date: "Special Moment ✨",
      note: "A special memory with you!"
    },
    {
      id: 1787848730391,
      image: "/assets/photos/1787848741938-1787847817883-photo7.jpg",
      caption: "New Memory ✨",
      date: "Happy Day",
      note: "Add your custom message here."
    }
  ],
  giftsHeading: "select any gift",
  giftsSubheading: "Tap a gift box to unwrap your special surprises! 🎁",
  gifts: [
    {
      id: 2,
      title: "Surprise Gift #1",
      boxLabel: "A warm hug",
      image: "/assets/gifts/gift2.svg",
      revealPhoto: "/assets/photos/surprise1_heart.png",
      badge: "🍰 Sweet Surprise",
      message: "GIFT_MESSAGE_1: Unlimited free hugs, warm cups of coffee, and someone who always has your back no matter what! 💕"
    },
    {
      id: 3,
      title: "Surprise Gift #2",
      boxLabel: "A Secret Wish",
      image: "/assets/gifts/gift3.svg",
      revealPhoto: "/assets/photos/surprise2_cat.png",
      badge: "⭐ Golden Wish",
      message: "GIFT_MESSAGE_2: One redeemable 'Get Out of Any Chores / Free Favor' coupon anytime you wish! 🪄✨"
    },
    {
      id: 1787848603097,
      title: "Surprise Gift #3",
      boxLabel: "suprise suprise mf",
      image: "/assets/gifts/gift1.svg",
      revealPhoto: "/assets/photos/surprise3_bouquet.png",
      badge: "💖 Special Surprise",
      message: "go shwaty its your bday "
    }
  ],
  finalMessage: {
    heading: "A Letter For You 💌",
    subheading: "From the bottom of my heart...",
    photo: "/assets/photos/photo2.svg",
    content: "BIRTHDAY_MESSAGE_HERE\n\nYes 😂 Since it’s a birthday letter, we can make it more personal, chaotic, and cute—like something he’ll actually laugh at while secretly getting emotional. And turning 25 gives us plenty of material. 😭\n\nDear Gawar,\n\nHAPPY 25th BIRTHDAY, old man! 🥳😂\n25 already?? Honestly, I’m concerned because you’re growing older but your brain is still buffering. 🤡\n\nYou are genuinely one of the most delulu, gawar, chipku and unnecessarily available people I know. You somehow manage to misunderstand the simplest things, spend half your petrol just roaming around here and there, and still think every random plan with me is a good idea. 😂\n\nBut jokes apart, I’m actually really lucky to have you. ❤️ You’ve always been there for me—whether I need help, someone to roam around with, someone to eat with, or simply someone who will waste an unreasonable amount of petrol with me for absolutely no reason. 😭\n\nI love all our random rides, stupid conversations, food plans, unnecessary roaming and all the nonsense we do together. And I genuinely appreciate how you always think about me before yourself. That’s something I’ll never take for granted.\n\nAlthough sometimes you become wayyy too chipku, and at those times I strongly believe you should remember that personal space is a real concept. Please learn it before 26. 😂\n\nBut honestly, beneath all your gawarpan and delulu behaviour, you have a really good heart. So don’t ever change that part of you.\n\nHere’s to 25—may you become wiser, less delulu, slightly less chipku, and PLEASE finally start understanding things without needing a full PowerPoint presentation from me. 😭😂\n\nHappy Birthday, Gawar! ❤️\nStay annoying. Stay stupid. Stay you.\n\nAnd yes… I’m lucky to have you, idiot. 🫶🏻\n\n— Your favourite person to waste petrol with 😂❤️",
    signature: "With lots of love 💕",
    replayButtonText: "Replay Surprise 🔄"
  },
  music: {
    audioUrl: "/music/birthday-song.mp3",
    autoPlayPrompt: true,
    title: "Birthday Melody 🎵"
  }
};

export default birthdayConfig;
