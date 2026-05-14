import { differenceInDays, parseISO, startOfDay, subDays } from "date-fns";

export interface BabySize {
  week: number;
  trimester: number;
  size: string;
  sizeKn: string;
  weight: string;
  development: string;
  developmentKn: string;
  tips: string;
  tipsKn: string;
  checklist: string[];
  checklistKn: string[];
  phase: 'seed' | 'embryo' | 'early' | 'developed';
}

export const pregnancyData: BabySize[] = [
  { 
    week: 1, trimester: 1, size: "Seed", sizeKn: "ಬೀಜ", weight: "0g", 
    development: "Your body is preparing for ovulation and the journey of motherhood begins now.", 
    developmentKn: "ನಿಮ್ಮ ದೇಹ ಅಂಡೋತ್ಪತ್ತಿಗೆ ಸಿದ್ಧವಾಗುತ್ತಿದೆ ಮತ್ತು ಮಾತೃತ್ವದ ಪಯಣ ಈಗ ಪ್ರಾರಂಭವಾಗುತ್ತಿದೆ.",
    tips: "You should start taking folic acid and vitamins to prepare your body for a healthy pregnancy.",
    tipsKn: "ಆರೋಗ್ಯಕರ ಗರ್ಭಧಾರಣೆಗಾಗಿ ನಿಮ್ಮ ದೇಹವನ್ನು ಸಿದ್ಧಪಡಿಸಲು ನೀವು ಫೋಲಿಕ್ ಆಸಿಡ್ ಮತ್ತು ವಿಟಮಿನ್ಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ಪ್ರಾರಂಭಿಸಬೇಕು.",
    checklist: ["Start taking folic acid daily", "Track your period dates accurately", "Eat more green leafy vegetables", "Stop any unhealthy habits immediately"],
    checklistKn: ["ಪ್ರತಿದಿನ ಫೋಲಿಕ್ ಆಸಿಡ್ ಪ್ರಾರಂಭಿಸಿ", "ಋತುಚಕ್ರದ ದಿನಾಂಕಗಳನ್ನು ನಿಖರವಾಗಿ ಗಮನಿಸಿ", "ಹೆಚ್ಚು ಸೊಪ್ಪು ತರಕಾರಿಗಳನ್ನು ಸೇವಿಸಿ", "ತಕ್ಷಣವೇ ಅನಾರೋಗ್ಯಕರ ಹವ್ಯಾಸಗಳನ್ನು ಬಿಡಿ"],
    phase: 'seed'
  },
  { 
    week: 4, trimester: 1, size: "Poppy Seed", sizeKn: "ಗಸಗಸೆ ಬೀಜ", weight: "0.1g", 
    development: "The embryo is successfully implanting, and the foundation of your baby's life is being built.", 
    developmentKn: "ಭ್ರೂಣವು ಯಶಸ್ವಿಯಾಗಿ ಸ್ಥಾಪನೆಯಾಗುತ್ತಿದೆ ಮತ್ತು ಮಗುವಿನ ಜೀವನದ ಅಡಿಪಾಯ ಹಾಕಲಾಗುತ್ತಿದೆ.",
    tips: "Take a home pregnancy test if your period is late and talk to a healthcare professional.",
    tipsKn: "ನಿಮ್ಮ ಋತುಚಕ್ರ ತಡವಾಗಿದ್ದರೆ ಮನೆಯಲ್ಲೇ ಗರ್ಭಧಾರಣೆ ಪರೀಕ್ಷೆ ಮಾಡಿಕೊಳ್ಳಿ ಮತ್ತು ವೈದ್ಯರೊಂದಿಗೆ ಮಾತನಾಡಿ.",
    checklist: ["Confirm with home pregnancy test", "Book your first doctor appointment", "Drink at least 2 liters of water", "Avoid raw or undercooked foods"],
    checklistKn: ["ಮನೆಯಲ್ಲೇ ಗರ್ಭಧಾರಣೆ ಪರೀಕ್ಷೆ ಮಾಡಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ", "ವೈದ್ಯರ ಮೊದಲ ಭೇಟಿಯನ್ನು ನಿಗದಿಪಡಿಸಿ", "ಕನಿಷ್ಠ ೨ ಲೀಟರ್ ನೀರು ಕುಡಿಯಿರಿ", "ಹಸಿ ಅಥವಾ ಸರಿಯಾಗಿ ಬೇಯಿಸದ ಆಹಾರ ತಪ್ಪಿಸಿ"],
    phase: 'seed'
  },
  { 
    week: 8, trimester: 1, size: "Raspberry", sizeKn: "ರಾಸ್‌ಬೆರಿ", weight: "1g", 
    development: "Your baby's heart is beating fast, and tiny arms and legs are beginning to sprout.", 
    developmentKn: "ಮಗುವಿನ ಹೃದಯ ವೇಗವಾಗಿ ಬಡಿಯುತ್ತಿದೆ, ಮತ್ತು ಸಣ್ಣ ಕೈಕಾಲುಗಳು ಚಿಗುರಲು ಪ್ರಾರಂಭಿಸುತ್ತಿವೆ.",
    tips: "Morning sickness may be challenging now, so try eating small, frequent meals to stay nourished.",
    tipsKn: "ಈಗ ಬೆಳಗಿನ ಸುಸ್ತು ಕಾಡಬಹುದು, ಆದ್ದರಿಂದ ಪೌಷ್ಟಿಕಾಂಶ ಪಡೆಯಲು ಸ್ವಲ್ಪ ಸ್ವಲ್ಪವಾಗಿ ಪದೇ ಪದೇ ಆಹಾರ ಸೇವಿಸಿ.",
    checklist: ["Schedule your first ultrasound scan", "Get a basic blood group and sugar test", "Eat small ginger snacks for nausea", "Ensure you get 8 hours of sleep"],
    checklistKn: ["ನಿಮ್ಮ ಮೊದಲ ಅಲ್ಟ್ರಾಸೌಂಡ್ ಸ್ಕ್ಯಾನ್ ನಿಗದಿಪಡಿಸಿ", "ಮೂಲ ರಕ್ತದ ಗುಂಪು ಮತ್ತು ಸಕ್ಕರೆ ಪರೀಕ್ಷೆ ಮಾಡಿಸಿ", "ವಾಕರಿಕೆಗಾಗಿ ಸಣ್ಣ ಶುಂಠಿ ತಿಂಡಿಗಳನ್ನು ತಿನ್ನಿ", "ನೀವು ೮ ಗಂಟೆಗಳ ನಿದ್ದೆ ಮಾಡುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ"],
    phase: 'embryo'
  },
  { 
    week: 12, trimester: 1, size: "Lime", sizeKn: "ಲಿಂಬೆ ಹಣ್ಣು", weight: "14g", 
    development: "All organs and limbs are fully formed, and the baby is starting to make small movements.", 
    developmentKn: "ಎಲ್ಲಾ ಅಂಗಾಂಗಗಳು ಮತ್ತು ಕೈಕಾಲುಗಳು ಪೂರ್ಣವಾಗಿ ರೂಪುಗೊಂಡಿವೆ, ಮಗು ಸಣ್ಣ ಚಲನವಲನಗಳನ್ನು ಪ್ರಾರಂಭಿಸುತ್ತಿದೆ.",
    tips: "As you enter the second trimester soon, you will likely start feeling more energetic and positive.",
    tipsKn: "ನೀವು ಶೀಘ್ರದಲ್ಲೇ ಎರಡನೇ ತ್ರೈಮಾಸಿಕವನ್ನು ಪ್ರವೇಶಿಸುವುದರಿಂದ, ನೀವು ಹೆಚ್ಚು ಶಕ್ತಿಯುತವಾಗಿ ಮತ್ತು ಧನಾತ್ಮಕವಾಗಿ ಭಾವಿಸುತ್ತೀರಿ.",
    checklist: ["Complete the NT Scan for screening", "Check your thyroid levels if advised", "Start light prenatal yoga or walking", "Share the happy news with close family"],
    checklistKn: ["ಎನ್.ಟಿ ಸ್ಕ್ಯಾನ್ ಪೂರ್ಣಗೊಳಿಸಿ", "ವೈದ್ಯರು ಸೂಚಿಸಿದರೆ ಥೈರಾಯ್ಡ್ ಮಟ್ಟ ಪರೀಕ್ಷಿಸಿ", "ಲಘು ಯೋಗ ಅಥವಾ ನಡಿಗೆ ಪ್ರಾರಂಭಿಸಿ", "ಆಪ್ತ ಕುಟುಂಬದವರೊಂದಿಗೆ ಸಂತೋಷದ ಸುದ್ದಿ ಹಂಚಿಕೊಳ್ಳಿ"],
    phase: 'embryo'
  },
  { 
    week: 16, trimester: 2, size: "Avocado", sizeKn: "ಬೆಣ್ಣೆ ಹಣ್ಣು", weight: "100g", 
    development: "Your baby can now hear voices and light is visible through their thin, forming eyelids.", 
    developmentKn: "ನಿಮ್ಮ ಮಗು ಈಗ ಧ್ವನಿಗಳನ್ನು ಕೇಳಬಲ್ಲದು ಮತ್ತು ತಿಳಿಯಾದ ರೆಪ್ಪೆಗಳ ಮೂಲಕ ಬೆಳಕು ಅವರಿಗೆ ಕಾಣಿಸುತ್ತದೆ.",
    tips: "Start sleeping on your side with a pillow for support to ensure better blood flow to the baby.",
    tipsKn: "ಮಗುವಿಗೆ ಉತ್ತಮ ರಕ್ತ ಪರಿಚಲನೆಯಾಗಲು ಬೆಂಬಲಕ್ಕಾಗಿ ದಿಂಬನ್ನು ಇಟ್ಟುಕೊಂಡು ಪಕ್ಕಕ್ಕೆ ಮಲಗಲು ಪ್ರಾರಂಭಿಸಿ.",
    checklist: ["Continue daily iron and calcium pills", "Check your blood pressure regularly", "Practise sleeping on your left side", "Play soft music or talk to your baby"],
    checklistKn: ["ದಿನನಿತ್ಯ ಕಬ್ಬಿಣ ಮತ್ತು ಕ್ಯಾಲ್ಸಿಯಂ ಮಾತ್ರೆ ಮುಂದುವರಿಸಿ", "ನಿಯಮಿತವಾಗಿ ರಕ್ತದೊತ್ತಡವನ್ನು ಪರೀಕ್ಷಿಸಿ", "ನಿಮ್ಮ ಎಡಭಾಗಕ್ಕೆ ಮಲಗುವುದನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ", "ಮೃದುವಾದ ಸಂಗೀತ ಅಥವಾ ಮಗುವಿನೊಡನೆ ಮಾತನಾಡಿ"],
    phase: 'early'
  },
  { 
    week: 20, trimester: 2, size: "Banana", sizeKn: "ಬಾಳೆಹಣ್ಣು", weight: "300g", 
    development: "You've reached the halfway mark! Baby is very active and rolling around in the womb.", 
    developmentKn: "ನೀವು ಪಯಣದ ಅರ್ಧ ಹಾದಿ ತಲುಪಿದ್ದೀರಿ! ಮಗು ಗರ್ಭದಲ್ಲಿ ತುಂಬಾ ಸಕ್ರಿಯವಾಗಿದೆ ಮತ್ತು ಉರುಳುತ್ತಿದೆ.",
    tips: "This is the best time for a detailed anomaly scan to check all of your baby's vital organs.",
    tipsKn: "ಮಗುವಿನ ಎಲ್ಲಾ ಪ್ರಮುಖ ಅಂಗಗಳನ್ನು ಪರೀಕ್ಷಿಸಲು ಅನ್ಯಾಟಮಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿಸಲು ಇದು ಅತ್ಯುತ್ತಮ ಸಮಯ.",
    checklist: ["Book the detailed Anomaly pregnancy scan", "Get a routine urine and BP checkup", "Include more calcium-rich food like Ragi", "Walk for 20 minutes in the morning"],
    checklistKn: ["ವಿವರವಾದ ಅನ್ಯಾಟಮಿ ಸ್ಕ್ಯಾನ್ ಬುಕ್ ಮಾಡಿ", "ನಿಯಮಿತ ಮೂತ್ರ ಮತ್ತು ಬಿಪಿ ತಪಾಸಣೆ ಮಾಡಿಸಿ", "ರಾಗಿಯಂತಹ ಕ್ಯಾಲ್ಸಿಯಂಯುಕ್ತ ಆಹಾರ ಸೇರಿಸಿ", "ಬೆಳಿಗ್ಗೆ ೨೦ ನಿಮಿಷಗಳ ಕಾಲ ನಡೆಯಿರಿ"],
    phase: 'early'
  },
  { 
    week: 24, trimester: 2, size: "Corn", sizeKn: "ಜೋಳ", weight: "600g", 
    development: "Baby's lungs are developing surfactant, which will help them breathe after they are born.", 
    developmentKn: "ಮಗುವಿನ ಶ್ವಾಸಕೋಶವು ಸರ್ಫ್ಯಾಕ್ಟಂಟ್ ಅನ್ನು ಅಭಿವೃದ್ಧಿಪಡಿಸುತ್ತಿದೆ, ಇದು ಹುಟ್ಟಿದ ನಂತರ ಉಸಿರಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    tips: "Check your blood sugar levels now to ensure you are safe from gestational diabetes.",
    tipsKn: "ಗರ್ಭಾವಸ್ಥೆಯ ಮಧುಮೇಹದಿಂದ ನೀವು ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಿ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ರಕ್ತದ ಸಕ್ಕರೆ ಪರೀಕ್ಷಿಸಿ.",
    checklist: ["Undergo the Glucose Tolerance sugar test", "Keep your belly skin moisturized regularly", "Do gentle leg stretches for cramps", "Research child care and baby essentials"],
    checklistKn: ["ಗ್ಲೂಕೋಸ್ ಟಾಲರೆನ್ಸ್ ಸಕ್ಕರೆ ಪರೀಕ್ಷೆ ಮಾಡಿಸಿಕೊಳ್ಳಿ", "ನಿಮ್ಮ ಹೊಟ್ಟೆಯ ಚರ್ಮಕ್ಕೆ ನಿಯಮಿತವಾಗಿ ಲೇಪನ ಹಚ್ಚಿ", "ನೋವಿಗಾಗಿ ಲಘು ಕಾಲು ವ್ಯಾಯಾಮ ಮಾಡಿ", "ಮಗುವಿನ ಆರೈಕೆ ಮತ್ತು ಅಗತ್ಯಗಳ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ"],
    phase: 'early'
  },
  { 
    week: 28, trimester: 3, size: "Eggplant", sizeKn: "ಬದನೆಕಾಯಿ", weight: "1kg", 
    development: "Baby is blinking and can see shadows. Their brain tissue is developing rapidly now.", 
    developmentKn: "ಮಗು ಕಣ್ಣು ಮಿಟುಕಿಸುತ್ತಿದೆ ಮತ್ತು ನೆರಳುಗಳನ್ನು ನೋಡಬಲ್ಲದು. ಮೆದುಳು ವೇಗವಾಗಿ ಬೆಳೆಯುತ್ತಿದೆ.",
    tips: "Start counting your baby's kicks every day after meals to ensure they are energetic and healthy.",
    tipsKn: "ಮಗು ಆರೋಗ್ಯವಾಗಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಪ್ರತಿದಿನ ಊಟದ ನಂತರ ಮಗುವಿನ ಒದೆತಗಳನ್ನು ಎಣಿಸಿ.",
    checklist: ["Log daily baby kick counts in the app", "Take Tdap vaccination if recommended", "Watch for excessive leg or face swelling", "Start preparing your hospital luggage bag"],
    checklistKn: ["ಆಪ್‌ನಲ್ಲಿ ದಿನನಿತ್ಯದ ಒದೆತದ ಎಣಿಕೆಗಳನ್ನು ದಾಖಲಿಸಿ", "ವೈದ್ಯರು ಸೂಚಿಸಿದರೆ ಟಿಡಿಎಪಿ ಲಸಿಕೆ ಪಡೆಯಿರಿ", "ಕಾಲು ಅಥವಾ ಮುಖದ ಅತಿಯಾದ ಊತವನ್ನು ಗಮನಿಸಿ", "ನಿಮ್ಮ ಆಸ್ಪತ್ರೆಯ ಬ್ಯಾಗ್ ಸಿದ್ಧಪಡಿಸಲು ಪ್ರಾರಂಭಿಸಿ"],
    phase: 'developed'
  },
  { 
    week: 32, trimester: 3, size: "Squash", sizeKn: "ಸೋರೆಕಾಯಿ", weight: "1.7kg", 
    development: "The baby is practiced breathing techniques and their skeleton is fully developed but soft.", 
    developmentKn: "ಮಗು ಉಸಿರಾಟದ ತಂತ್ರಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡುತ್ತಿದೆ ಮತ್ತು ಅಸ್ಥಿಪಂಜರ ಪೂರ್ಣವಾಗಿ ಬೆಳೆದಿದೆ.",
    tips: "Finalize your birth plan and make sure you have transport ready for any emergency situation.",
    tipsKn: "ನಿಮ್ಮ ಹೆರಿಗೆ ಯೋಜನೆಯನ್ನು ಅಂತಿಮಗೊಳಿಸಿ ಮತ್ತು ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಾಗಿ ಸಾರಿಗೆ ವ್ಯವಸ್ಥೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಿ.",
    checklist: ["Review the final birth plan with doctor", "Check the baby's position in the womb", "Read about breastfeeding techniques early", "Keep your legs elevated while resting"],
    checklistKn: ["ವೈದ್ಯರೊಂದಿಗೆ ಅಂತಿಮ ಹೆರಿಗೆ ಯೋಜನೆಯನ್ನು ಚರ್ಚಿಸಿ", "ಗರ್ಭದಲ್ಲಿ ಮಗುವಿನ ಸ್ಥಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ", "ಹಾಲುಣಿಸುವ ತಂತ್ರಗಳ ಬಗ್ಗೆ ಮೊದಲೇ ಓದಿ", "ವಿಶ್ರಾಂತಿ ಪಡೆಯುವಾಗ ಕಾಲುಗಳನ್ನು ಎತ್ತರದಲ್ಲಿಡಿ"],
    phase: 'developed'
  },
  { 
    week: 36, trimester: 3, size: "Romaine Lettuce", sizeKn: "ಕೋಸುಗಡ್ಡೆ", weight: "2.6kg", 
    development: "Your baby is almost full term and is dropping lower into the pelvis to prepare for birth.", 
    developmentKn: "ಮಗು ಪೂರ್ಣಾವಧಿಗೆ ಹತ್ತಿರದಲ್ಲಿದೆ ಮತ್ತು ಹೆರಿಗೆಗಾಗಿ ಸೊಂಟದ ಕಡೆಗೆ ಕೆಳಗಿಳಿಯುತ್ತಿದೆ.",
    tips: "Watch for signs of labor like frequent contractions or water breaking and stay in close contact with your doctor.",
    tipsKn: "ಪದೇ ಪದೇ ಸಂಕೋಚನ ಅಥವಾ ನೀರು ಹೋಗುವಂತಹ ಹೆರಿಗೆಯ ಲಕ್ಷಣಗಳನ್ನು ಗಮನಿಸಿ ಮತ್ತು ವೈದ್ಯರ ಸಂಪರ್ಕದಲ್ಲಿರಿ.",
    checklist: ["Go for a checkup every single week now", "Set up the baby's car seat and cradle", "Learn the clear signs of active labor", "Complete any remaining nursery preparations"],
    checklistKn: ["ಈಗ ಪ್ರತಿ ವಾರ ವೈದ್ಯಕೀಯ ತಪಾಸಣೆಗೆ ಹೋಗಿ", "ಮಗುವಿನ ತೊಟ್ಟಿಲು ಮತ್ತು ಸೀಟ್ ಸಿದ್ಧಪಡಿಸಿ", "ಸಕ್ರಿಯ ಹೆರಿಗೆಯ ಸ್ಪಷ್ಟ ಲಕ್ಷಣಗಳನ್ನು ತಿಳಿಯಿರಿ", "ಯಾವುದೇ ಉಳಿದ ಸಿದ್ಧತೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ"],
    phase: 'developed'
  },
  { 
    week: 40, trimester: 3, size: "Watermelon", sizeKn: "ಕಲ್ಲಂಗಡಿ", weight: "3.5kg", 
    development: "Congratulations! Your baby is fully grown and ready to meet the world at any moment.", 
    developmentKn: "ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಮಗು ಪೂರ್ಣವಾಗಿ ಬೆಳೆದಿದೆ ಮತ್ತು ಯಾವ ಸಮಯದಲ್ಲಾದರೂ ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಲು ಸಿದ್ಧವಾಗಿದೆ.",
    tips: "Stay calm, practice deep breathing, and trust your body's strength to bring your baby home.",
    tipsKn: "ಶಾಂತವಾಗಿರಿ, ಆಳವಾದ ಉಸಿರಾಟದ ಅಭ್ಯಾಸ ಮಾಡಿ, ಮತ್ತು ಮಗುವನ್ನು ಮನೆಗೆ ಕರೆತರಲು ನಿಮ್ಮ ದೇಹದ ಶಕ್ತಿಯನ್ನು ನಂಬಿ.",
    checklist: ["Keep your hospital bag near the door", "Ensure emergency contacts are on dial", "Practice relaxing breathing techniques", "Trust the process and stay positive"],
    checklistKn: ["ಬಾಗಿಲ ಬಳಿ ಆಸ್ಪತ್ರೆಯ ಬ್ಯಾಗ್ ಅನ್ನು ಸಿದ್ಧವಾಗಿಡಿ", "ತುರ್ತು ಸಂಪರ್ಕಗಳು ಲಭ್ಯವಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿ", "ಉಸಿರಾಟದ ವಿಶ್ರಾಂತಿ ತಂತ್ರಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ", "ಪ್ರಕ್ರಿಯೆಯ ಮೇಲೆ ನಂಬಿಕೆ ಇಡಿ ಮತ್ತು ಸಕಾರಾತ್ಮಕವಾಗಿರಿ"],
    phase: 'developed'
  }
];

/** Total gestation length used for EDD-based counting (40 × 7 days). */
export const PREGNANCY_TOTAL_DAYS = 280;

export interface PregnancyFromDueDate {
  dueDate: Date;
  pregnancyStartDate: Date;
  daysPassed: number;
  daysRemaining: number;
  /** `floor(daysPassed / 7)`, never negative. */
  currentWeek: number;
  /** `(daysPassed / 280) * 100`, clamped 0–100. */
  progressPercentage: number;
  /** Week 1–40 for UI and `getPregnancyData`. */
  gestationalWeekNumber: number;
  daysInWeek: number;
  daysRemainingInWeek: number;
}

/**
 * EDD-based pregnancy timeline:
 * - Start = dueDate − 280 days
 * - daysPassed = calendar days from start through today
 * - currentWeek = floor(daysPassed / 7)
 * - daysRemaining = calendar days from today through due (negative when overdue)
 * - progressPercentage = (daysPassed / 280) × 100, clamped 0–100
 */
export function computePregnancyFromDueDate(
  dueDateInput: string | undefined,
  now: Date = new Date()
): PregnancyFromDueDate | null {
  if (!dueDateInput?.trim()) return null;

  let due: Date;
  try {
    due = startOfDay(parseISO(dueDateInput));
  } catch {
    return null;
  }
  if (Number.isNaN(due.getTime())) return null;

  const today = startOfDay(now);
  const pregnancyStartDate = subDays(due, PREGNANCY_TOTAL_DAYS);

  const daysPassed = Math.max(0, differenceInDays(today, pregnancyStartDate));
  const daysRemaining = differenceInDays(due, today);

  const currentWeek = Math.max(0, Math.floor(daysPassed / 7));

  const rawProgress = (daysPassed / PREGNANCY_TOTAL_DAYS) * 100;
  const progressPercentage = Math.min(100, Math.max(0, rawProgress));

  const gestationalWeekNumber = Math.min(40, Math.max(1, currentWeek + 1));

  const daysInWeek = daysPassed % 7;
  const daysRemainingInWeek = daysInWeek === 0 ? 7 : 7 - daysInWeek;

  return {
    dueDate: due,
    pregnancyStartDate,
    daysPassed,
    daysRemaining,
    currentWeek,
    progressPercentage,
    gestationalWeekNumber,
    daysInWeek,
    daysRemainingInWeek,
  };
}

export function getPregnancyData(week: number): BabySize {
  // Find the exact week or the highest previous week
  const sorted = [...pregnancyData].sort((a, b) => b.week - a.week);
  const data = sorted.find(d => week >= d.week);
  const result = data ? { ...data, week } : { ...pregnancyData[0], week };
  
  // Fill missing checklist items to target 4-5 items per week
  if (result.checklist.length < 4) {
    result.checklist = [...result.checklist, "Drink at least 2 liters of water daily", "Take a short 15-minute walk today"];
    result.checklistKn = [...result.checklistKn, "ದಿನಕ್ಕೆ ಕನಿಷ್ಠ ೨ ಲೀಟರ್ ನೀರು ಕುಡಿಯಿರಿ", "ಇಂದು ೧೫ ನಿಮಿಷಗಳ ಕಾಲ ಲಘುವಾಗಿ ನಡೆಯಿರಿ"];
  }
  
  return result;
}

